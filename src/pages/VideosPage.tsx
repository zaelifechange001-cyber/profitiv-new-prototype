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
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">Investment Videos</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Watch videos and earn money instantly
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass-card p-6 text-center">
              <Play className="w-8 h-8 mx-auto mb-3 text-profitiv-purple" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{videos.length}</div>
              <p className="text-foreground/60">Available Videos</p>
            </div>
            <div className="glass-card p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-profitiv-teal" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{watchedVideos.size}</div>
              <p className="text-foreground/60">Videos Watched</p>
            </div>
            <div className="glass-card p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">
                ${videos
                  .filter((v) => !watchedVideos.has(v.id))
                  .reduce((sum, v) => sum + Number(v.reward_per_view), 0)
                  .toFixed(2)}
              </div>
              <p className="text-foreground/60">Potential Earnings</p>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-foreground/60">No videos available at the moment</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => {
                const watched = watchedVideos.has(video.id);
                const progress = getProgress(video.current_views, video.goal_views);

                return (
                  <div key={video.id} className="earning-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-profitiv-purple transition-colors">
                          {video.title}
                        </h3>
                        {watched && <Badge variant="secondary">✓ Watched</Badge>}
                      </div>
                      <p className="text-sm text-foreground/60 line-clamp-2">
                        {video.description}
                      </p>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground/60">Campaign Progress</span>
                          <span className="font-medium text-profitiv-teal">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-foreground/60 mt-1">
                          {video.current_views.toLocaleString()} / {video.goal_views.toLocaleString()} views
                        </p>
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-border/50">
                        <div>
                          <p className="text-xs text-foreground/60">Earn</p>
                          <p className="text-2xl font-bold text-gradient-hero">
                            ${video.reward_per_view.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleWatchVideo(video)}
                          disabled={watched}
                          variant="gradient"
                          className="gap-2"
                        >
                          <Play className="h-4 w-4" />
                          {watched ? "Watched" : "Watch & Earn"}
                        </Button>
                      </div>

                      <div className="text-xs text-foreground/60 text-center">
                        Pool: ${Number(video.investment_amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
