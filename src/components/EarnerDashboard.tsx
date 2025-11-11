import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { LogOut, Wallet, ArrowUpRight } from "lucide-react";

interface EarnerDashboardProps {
  userId: string;
}

interface UserProfile {
  available_balance: number;
  tiv_balance: number;
  total_earned: number;
  tiv_to_usd_rate: number;
}

const EarnerDashboard = ({ userId }: EarnerDashboardProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: API Integration - Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('available_balance, tiv_balance, total_earned, tiv_to_usd_rate')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, toast]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tivBalance = profile?.tiv_balance || 0;
  const tivUsdValue = tivBalance * (profile?.tiv_to_usd_rate || 0.01);
  const totalEarned = profile?.total_earned || 0;
  const withdrawable = profile?.available_balance || 0;

  return (
    <div className="min-h-screen" data-role="earner">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                Your Earning <span className="text-gradient-hero">Dashboard</span>
              </h1>
              <p className="text-lg text-foreground/80">
                Overview of your rewards, tasks, and active pools — all in one place.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="gradient" 
                onClick={() => navigate('/payout-settings')}
                className="hover-lift"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* TIV Balance Card - Featured */}
          <div className="mb-8">
            <Card className="glass-card p-8 hover-lift bg-gradient-to-br from-profitiv-teal/10 to-profitiv-purple/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-profitiv-purple mb-2">Your TIV Balance</h3>
                  <div className="text-5xl font-bold text-foreground mb-2">
                    {tivBalance.toLocaleString()} TIVs
                  </div>
                  <p className="text-xl text-foreground/60">≈ ${tivUsdValue.toFixed(2)} USD Value</p>
                </div>
                <Button 
                  variant="glass" 
                  onClick={() => navigate('/marketplace')}
                  className="hover:border-profitiv-teal"
                >
                  Trade TIV
                </Button>
              </div>
              <Progress value={65} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                Goal: 5,000 TIVs • Keep earning to reach your target
              </p>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="glass-card p-6 hover-lift">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Completed Campaigns</h4>
              <div className="text-5xl font-bold text-foreground mb-2">18</div>
              <p className="text-sm text-muted-foreground mb-4">Campaigns Finished</p>
              <Progress value={90} className="mb-2" />
              <p className="text-xs text-profitiv-teal">You're in the top 5% of earners!</p>
            </Card>

            <Card className="glass-card p-6 hover-lift">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Withdraw Progress</h4>
              <div className="text-5xl font-bold text-foreground mb-2">${withdrawable.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground mb-4">Withdrawn This Month</p>
              <Progress value={50} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                {/* TODO: API Integration - Calculate based on plan limits */}
                Weekly limit: $250 • Monthly cap: $1,000
              </p>
            </Card>
          </div>

          {/* Active Campaign Card */}
          <Card className="glass-card p-6 hover-lift mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">Campaign Video — 1,000 views</h3>
              <span className="text-sm text-profitiv-teal font-semibold">Reward: 15 TIV</span>
            </div>
            <Progress value={56} className="mb-4" />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {/* TODO: API Integration - Fetch from campaigns table */}
                Join the pool • Your stake: $5 • Expected reward when goal met
              </p>
              <Button variant="gradient" size="sm">
                Watch & Earn
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="glass-card p-6 hover-lift cursor-pointer group"
              onClick={() => navigate('/videos')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-profitiv-teal/20 flex items-center justify-center group-hover:bg-profitiv-teal/30 transition-colors">
                  📹
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-profitiv-teal transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">Watch Videos</h3>
              <p className="text-sm text-foreground/60">Earn TIVs by watching</p>
            </Card>

            <Card 
              className="glass-card p-6 hover-lift cursor-pointer group"
              onClick={() => navigate('/learn-earn')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-profitiv-purple/20 flex items-center justify-center group-hover:bg-profitiv-purple/30 transition-colors">
                  📚
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-profitiv-purple transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">Learn & Earn</h3>
              <p className="text-sm text-foreground/60">Complete courses</p>
            </Card>

            <Card 
              className="glass-card p-6 hover-lift cursor-pointer group"
              onClick={() => navigate('/spin')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  ✨
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">Spin to Win</h3>
              <p className="text-sm text-foreground/60">Daily rewards</p>
            </Card>

            <Card 
              className="glass-card p-6 hover-lift cursor-pointer group"
              onClick={() => navigate('/marketplace')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
                  🏪
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-success transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">Marketplace</h3>
              <p className="text-sm text-foreground/60">Trade TIVs</p>
            </Card>
          </div>

          {/* Legal Notice */}
          <div className="mt-12 p-4 glass-card">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Legal:</strong> Rewards shown here are earned from verified engagement activity on Profitiv. 
              This platform is a marketing & engagement service — not an investment product. 
              Withdrawals, payouts, and marketplace trades require backend payment integration and verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnerDashboard;
