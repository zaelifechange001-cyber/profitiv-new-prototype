import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

export default function AdminPools() {
  const [pools, setPools] = useState<CommunityPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    pool_name: "",
    pool_type: "video",
    description: "",
    goal_amount: "",
    min_investment: "5",
    max_participants: "",
  });

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      const { data, error } = await supabase
        .from("community_pools")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPools(data || []);
    } catch (error) {
      console.error("Error fetching pools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("community_pools").insert({
        pool_name: formData.pool_name,
        pool_type: formData.pool_type,
        description: formData.description,
        goal_amount: parseFloat(formData.goal_amount),
        min_investment: parseFloat(formData.min_investment),
        max_participants: formData.max_participants
          ? parseInt(formData.max_participants)
          : null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Community pool created successfully",
      });

      setDialogOpen(false);
      setFormData({
        pool_name: "",
        pool_type: "video",
        description: "",
        goal_amount: "",
        min_investment: "5",
        max_participants: "",
      });
      fetchPools();
    } catch (error: any) {
      console.error("Error creating pool:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create pool",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";

    try {
      const { error } = await supabase
        .from("community_pools")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Pool ${newStatus}`,
      });

      fetchPools();
    } catch (error) {
      console.error("Error updating pool:", error);
      toast({
        title: "Error",
        description: "Failed to update pool status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "default",
      filled: "secondary",
      closed: "outline",
      completed: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getProgress = (current: number, goal: number) => {
    return goal > 0 ? (current / goal) * 100 : 0;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      video: "text-blue-500",
      collaboration: "text-purple-500",
      jackpot: "text-yellow-500",
      learning: "text-green-500",
    };
    return colors[type] || "text-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community Pools</h2>
          <p className="text-muted-foreground">Manage investment pools</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Pool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Community Pool</DialogTitle>
              <DialogDescription>
                Create a new investment pool for the community
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Pool Name</Label>
                <Input
                  required
                  value={formData.pool_name}
                  onChange={(e) =>
                    setFormData({ ...formData, pool_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Pool Type</Label>
                <select
                  className="w-full mt-1.5 px-3 py-2 bg-background border border-input rounded-md"
                  value={formData.pool_type}
                  onChange={(e) =>
                    setFormData({ ...formData, pool_type: e.target.value })
                  }
                >
                  <option value="video">Video Investment</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="jackpot">Jackpot</option>
                  <option value="learning">Learning</option>
                </select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Goal Amount ($)</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.goal_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, goal_amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Min Investment ($)</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.min_investment}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_investment: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Max Participants</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Optional"
                    value={formData.max_participants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_participants: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Pool
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pools</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pools.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Pools</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pools.filter((p) => p.status === "open").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pools.reduce((sum, p) => sum + Number(p.current_amount), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pools.reduce((sum, p) => sum + p.current_participants, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pools</CardTitle>
          <CardDescription>Community investment pools</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pools.map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pool.pool_name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {pool.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(pool.pool_type)}>
                      {pool.pool_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 min-w-[120px]">
                      <Progress
                        value={getProgress(
                          Number(pool.current_amount),
                          Number(pool.goal_amount)
                        )}
                      />
                      <p className="text-xs text-muted-foreground">
                        {getProgress(
                          Number(pool.current_amount),
                          Number(pool.goal_amount)
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    ${Number(pool.current_amount).toFixed(2)} / $
                    {Number(pool.goal_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {pool.current_participants}
                    {pool.max_participants && ` / ${pool.max_participants}`}
                  </TableCell>
                  <TableCell>{getStatusBadge(pool.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(pool.id, pool.status)}
                    >
                      {pool.status === "open" ? "Close" : "Open"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
