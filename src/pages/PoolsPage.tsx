import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Users, TrendingUp, DollarSign, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CommunityPool {
  id: string;
  pool_name: string;
  pool_type: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  min_investment: number;
  max_participants: number;
  current_participants: number;
  status: string;
}

export default function PoolsPage() {
  const [pools, setPools] = useState<CommunityPool[]>([]);
  const [userParticipations, setUserParticipations] = useState<Set<string>>(new Set());
  const [selectedPool, setSelectedPool] = useState<CommunityPool | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { type } = useParams();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      fetchPools();
      fetchUserParticipations();
    };
    checkAuth();
  }, [navigate, type]);

  const fetchPools = async () => {
    try {
      let query = supabase
        .from("community_pools")
        .select("*")
        .eq("status", "open");

      if (type) {
        query = query.eq("pool_type", type);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setPools(data || []);
    } catch (error) {
      console.error("Error fetching pools:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserParticipations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("pool_participants")
        .select("pool_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setUserParticipations(new Set(data?.map(p => p.pool_id) || []));
    } catch (error) {
      console.error("Error fetching participations:", error);
    }
  };

  const handleJoinPool = async () => {
    if (!selectedPool) return;

    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < selectedPool.min_investment) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment is $${selectedPool.min_investment}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check balance
      const { data: profile } = await supabase
        .from("profiles")
        .select("available_balance")
        .eq("user_id", user.id)
        .single();

      if (!profile || profile.available_balance < amount) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough balance to join this pool",
          variant: "destructive",
        });
        return;
      }

      // Deduct from balance
      const { error: balanceError } = await supabase
        .from("profiles")
        .update({ available_balance: profile.available_balance - amount })
        .eq("user_id", user.id);

      if (balanceError) throw balanceError;

      // Join pool
      const { error: joinError } = await supabase.from("pool_participants").insert({
        pool_id: selectedPool.id,
        user_id: user.id,
        investment_amount: amount,
      });

      if (joinError) throw joinError;

      // Update pool
      const { error: updateError } = await supabase
        .from("community_pools")
        .update({
          current_amount: selectedPool.current_amount + amount,
          current_participants: selectedPool.current_participants + 1,
        })
        .eq("id", selectedPool.id);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from("user_activities").insert({
        user_id: user.id,
        activity_type: "investment",
        description: `Joined pool: ${selectedPool.pool_name}`,
        amount: -amount,
      });

      toast({
        title: "Success",
        description: "You've joined the pool successfully!",
      });

      setSelectedPool(null);
      setInvestmentAmount("");
      fetchPools();
      fetchUserParticipations();
    } catch (error: any) {
      console.error("Error joining pool:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to join pool",
        variant: "destructive",
      });
    }
  };

  const getProgress = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  const getTypeIcon = (poolType: string) => {
    switch (poolType) {
      case "video":
        return <TrendingUp className="h-6 w-6" />;
      case "collaboration":
        return <Users className="h-6 w-6" />;
      case "jackpot":
        return <Trophy className="h-6 w-6" />;
      case "learning":
        return <DollarSign className="h-6 w-6" />;
      default:
        return <Users className="h-6 w-6" />;
    }
  };

  const getTypeColor = (poolType: string) => {
    switch (poolType) {
      case "video":
        return "text-blue-500";
      case "collaboration":
        return "text-purple-500";
      case "jackpot":
        return "text-yellow-500";
      case "learning":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading pools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">Community Pools</span>
              {type && <span className="text-foreground/60"> - {type}</span>}
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Join investment pools and earn together
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="glass-card p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-profitiv-purple" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{pools.length}</div>
              <p className="text-foreground/60">Open Pools</p>
            </div>
            <div className="glass-card p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-profitiv-teal" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{userParticipations.size}</div>
              <p className="text-foreground/60">Your Pools</p>
            </div>
            <div className="glass-card p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">
                ${pools.reduce((sum, p) => sum + Number(p.current_amount), 0).toFixed(2)}
              </div>
              <p className="text-foreground/60">Total Invested</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-3 text-warning" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">
                {pools.reduce((sum, p) => sum + p.current_participants, 0)}
              </div>
              <p className="text-foreground/60">Participants</p>
            </div>
          </div>

          {pools.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-foreground/60">No pools available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pools.map((pool) => {
                const joined = userParticipations.has(pool.id);
                const progress = getProgress(
                  Number(pool.current_amount),
                  Number(pool.goal_amount)
                );

                return (
                  <div key={pool.id} className="earning-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-3 rounded-lg bg-gradient-to-br from-profitiv-purple/20 to-profitiv-teal/20 ${getTypeColor(pool.pool_type)}`}>
                          {getTypeIcon(pool.pool_type)}
                        </div>
                        {joined && <Badge variant="secondary">✓ Joined</Badge>}
                      </div>
                      <h3 className="text-lg font-bold line-clamp-2 group-hover:text-profitiv-purple transition-colors">
                        {pool.pool_name}
                      </h3>
                      <p className="text-sm text-foreground/60 line-clamp-2">
                        {pool.description}
                      </p>
                      <Badge variant="outline" className={`${getTypeColor(pool.pool_type)} capitalize`}>
                        {pool.pool_type}
                      </Badge>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground/60">Pool Progress</span>
                          <span className="font-medium text-profitiv-teal">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-foreground/60 mt-1">
                          <span>${Number(pool.current_amount).toFixed(2)}</span>
                          <span>${Number(pool.goal_amount).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm py-3 border-t border-border/50">
                        <div>
                          <p className="text-foreground/60">Min Investment</p>
                          <p className="font-bold text-gradient-hero">${Number(pool.min_investment).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60">Participants</p>
                          <p className="font-bold text-gradient-hero">
                            {pool.current_participants}
                            {pool.max_participants && ` / ${pool.max_participants}`}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedPool(pool);
                          setInvestmentAmount(pool.min_investment.toString());
                        }}
                        disabled={joined}
                        variant="gradient"
                        className="w-full"
                      >
                        {joined ? "Already Joined" : "Join Pool"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Join Pool Dialog */}
          <Dialog open={!!selectedPool} onOpenChange={() => setSelectedPool(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join {selectedPool?.pool_name}</DialogTitle>
              <DialogDescription>
                Enter your investment amount to join this pool
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Investment Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={selectedPool?.min_investment}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={`Min: $${selectedPool?.min_investment}`}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum: ${selectedPool?.min_investment}
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pool Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {selectedPool?.pool_type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Current Progress:</span>
                  <span>
                    {selectedPool &&
                      getProgress(
                        Number(selectedPool.current_amount),
                        Number(selectedPool.goal_amount)
                      ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Participants:</span>
                  <span>{selectedPool?.current_participants}</span>
                </div>
              </div>

              <Button onClick={handleJoinPool} className="w-full">
                Confirm & Join Pool
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}
