import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Play, TrendingUp, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface InvestmentVideo {
  id: string;
  title: string;
  video_url: string;
  description: string;
  investment_amount: number;
  goal_views: number;
  current_views: number;
  reward_per_view: number;
  status: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<InvestmentVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      fetchVideos();
      fetchWatchedVideos();
    };
    checkAuth();
  }, [navigate]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("investment_videos")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchedVideos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("video_views")
        .select("video_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setWatchedVideos(new Set(data?.map(v => v.video_id) || []));
    } catch (error) {
      console.error("Error fetching watched videos:", error);
    }
  };

  const handleWatchVideo = async (video: InvestmentVideo) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if already watched
      if (watchedVideos.has(video.id)) {
        toast({
          title: "Already Watched",
          description: "You've already earned from this video",
          variant: "destructive",
        });
        return;
      }

      // Record view
      const { error: viewError } = await supabase.from("video_views").insert({
        video_id: video.id,
        user_id: user.id,
        completed: true,
        reward_earned: video.reward_per_view,
      });

      if (viewError) throw viewError;

      // Update video views count
      const { error: updateError } = await supabase
        .from("investment_videos")
        .update({ current_views: video.current_views + 1 })
        .eq("id", video.id);

      if (updateError) throw updateError;

      // Award reward by fetching current balance and adding to it
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("available_balance, total_earned")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      const { error: balanceError } = await supabase
        .from("profiles")
        .update({ 
          available_balance: (profile?.available_balance || 0) + video.reward_per_view,
          total_earned: (profile?.total_earned || 0) + video.reward_per_view
        })
        .eq("user_id", user.id);

      if (balanceError) throw balanceError;

      // Log activity
      await supabase.from("user_activities").insert({
        user_id: user.id,
        activity_type: "video",
        description: `Watched: ${video.title}`,
        amount: video.reward_per_view,
      });

      toast({
        title: "Reward Earned!",
        description: `+$${video.reward_per_view.toFixed(2)} added to your balance`,
      });

      // Open video in new tab
      window.open(video.video_url, "_blank");

      // Refresh data
      fetchVideos();
      fetchWatchedVideos();
    } catch (error: any) {
      console.error("Error watching video:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to record video view",
        variant: "destructive",
      });
    }
  };

  const getProgress = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Investment Videos</h1>
          <p className="text-muted-foreground">
            Watch videos and earn money instantly
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Videos</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videos.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchedVideos.size}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {videos
                  .filter((v) => !watchedVideos.has(v.id))
                  .reduce((sum, v) => sum + Number(v.reward_per_view), 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No videos available at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              const watched = watchedVideos.has(video.id);
              const progress = getProgress(video.current_views, video.goal_views);

              return (
                <Card key={video.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {video.title}
                      </CardTitle>
                      {watched && <Badge variant="secondary">Watched</Badge>}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Campaign Progress</span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {video.current_views.toLocaleString()} /{" "}
                        {video.goal_views.toLocaleString()} views
                      </p>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Earn</p>
                        <p className="text-lg font-bold text-primary">
                          ${video.reward_per_view.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleWatchVideo(video)}
                        disabled={watched}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        {watched ? "Watched" : "Watch & Earn"}
                      </Button>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Investment Pool</p>
                          <p className="text-sm font-semibold text-success">
                            ${Number(video.investment_amount).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="gap-2"
                        >
                          Funded
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Investment Pool: ${Number(video.investment_amount).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
