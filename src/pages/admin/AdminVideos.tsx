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
import { Plus, Play, Pause, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InvestmentVideo {
  id: string;
  title: string;
  video_url: string;
  description: string;
  investment_amount: number;
  goal_views: number;
  current_views: number;
  status: string;
  reward_per_view: number;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<InvestmentVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    description: "",
    investment_amount: "",
    goal_views: "",
    reward_per_view: "",
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("investment_videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("investment_videos").insert({
        title: formData.title,
        video_url: formData.video_url,
        description: formData.description,
        investment_amount: parseFloat(formData.investment_amount),
        goal_views: parseInt(formData.goal_views),
        reward_per_view: parseFloat(formData.reward_per_view),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment video created successfully",
      });

      setDialogOpen(false);
      setFormData({
        title: "",
        video_url: "",
        description: "",
        investment_amount: "",
        goal_views: "",
        reward_per_view: "",
      });
      fetchVideos();
    } catch (error: any) {
      console.error("Error creating video:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create video",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";

    try {
      const { error } = await supabase
        .from("investment_videos")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Video ${newStatus}`,
      });

      fetchVideos();
    } catch (error) {
      console.error("Error updating video:", error);
      toast({
        title: "Error",
        description: "Failed to update video status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      paused: "secondary",
      completed: "outline",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getProgress = (current: number, goal: number) => {
    return goal > 0 ? (current / goal) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Investment Videos</h2>
          <p className="text-muted-foreground">Manage video investment campaigns</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Investment Video</DialogTitle>
              <DialogDescription>
                Add a new video investment campaign
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Video URL</Label>
                <Input
                  required
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.video_url}
                  onChange={(e) =>
                    setFormData({ ...formData, video_url: e.target.value })
                  }
                />
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
                  <Label>Investment Amount ($)</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.investment_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        investment_amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Goal Views</Label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={formData.goal_views}
                    onChange={(e) =>
                      setFormData({ ...formData, goal_views: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Reward/View ($)</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.reward_per_view}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reward_per_view: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Video Campaign
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.filter((v) => v.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.reduce((sum, v) => sum + v.current_views, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Campaigns</CardTitle>
          <CardDescription>All investment video campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Reward/View</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{video.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {video.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    ${Number(video.investment_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={getProgress(video.current_views, video.goal_views)} />
                      <p className="text-xs text-muted-foreground">
                        {getProgress(video.current_views, video.goal_views).toFixed(1)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {video.current_views.toLocaleString()} / {video.goal_views.toLocaleString()}
                  </TableCell>
                  <TableCell>${Number(video.reward_per_view).toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(video.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStatus(video.id, video.status)}
                    >
                      {video.status === "active" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
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
