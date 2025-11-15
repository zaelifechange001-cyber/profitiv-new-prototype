import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Video, ArrowLeft, Play, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Campaign {
  id: string;
  title: string;
  description: string;
  video_url: string;
  requested_views: number;
  current_views: number;
  reward_per_view: number;
  reward_type: string;
  remaining_budget: number;
  creator_id: string;
}

interface Participation {
  campaign_id: string;
  progress: number;
  completed: boolean;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [participations, setParticipations] = useState<Record<string, Participation>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch published campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'published')
        .gt('remaining_budget', 0)
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      // Fetch user's participations
      const { data: participationsData } = await supabase
        .from('campaign_participants')
        .select('campaign_id, progress, completed')
        .eq('user_id', user.id);

      const participationsMap: Record<string, Participation> = {};
      participationsData?.forEach(p => {
        participationsMap[p.campaign_id] = p;
      });

      setCampaigns(campaignsData || []);
      setParticipations(participationsMap);
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (campaignId: string) => {
    try {
      setProcessing(campaignId);
      const { data, error } = await supabase.rpc('participate_in_campaign', {
        _campaign_id: campaignId
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've joined this campaign",
      });

      await fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join campaign",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleCompleteView = async (campaignId: string) => {
    try {
      setProcessing(campaignId);
      const { data, error } = await supabase.rpc('complete_campaign_view', {
        _campaign_id: campaignId
      });

      if (error) throw error;

      const result = data as any;
      toast({
        title: "Reward Earned!",
        description: `You earned ${result.reward_amount} ${result.reward_type.toUpperCase()}`,
      });

      await fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete view",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Campaigns</h1>
          <p className="text-muted-foreground">
            Watch videos and complete campaigns to earn rewards. Earning potential varies based on participation.
          </p>
        </div>

        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No campaigns available</h3>
              <p className="text-muted-foreground">Check back soon for new earning opportunities</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const participation = participations[campaign.id];
              const isParticipating = !!participation;
              const progressPercent = isParticipating 
                ? Math.min((participation.progress / campaign.requested_views) * 100, 100)
                : 0;

              return (
                <Card key={campaign.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <Badge variant={campaign.reward_type === 'tiv' ? 'secondary' : 'default'}>
                        {campaign.reward_per_view} {campaign.reward_type.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>{campaign.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Views</span>
                        <span className="font-medium">
                          {campaign.current_views} / {campaign.requested_views}
                        </span>
                      </div>

                      {isParticipating && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Your Progress</span>
                            <span className="font-medium">{participation.progress} views</span>
                          </div>
                          <Progress value={progressPercent} />
                        </>
                      )}
                    </div>

                    <div className="mt-auto pt-4">
                      {!isParticipating ? (
                        <Button
                          className="w-full"
                          onClick={() => handleParticipate(campaign.id)}
                          disabled={processing === campaign.id}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Campaign
                        </Button>
                      ) : participation.completed ? (
                        <Button className="w-full" variant="outline" disabled>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => handleCompleteView(campaign.id)}
                          disabled={processing === campaign.id}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Watch & Earn
                        </Button>
                      )}
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
