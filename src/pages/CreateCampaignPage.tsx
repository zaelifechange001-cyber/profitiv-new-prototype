import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Rocket } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function CreateCampaignPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [requestedViews, setRequestedViews] = useState("1000");
  const [rewardPerView, setRewardPerView] = useState("0.10");
  const [rewardType, setRewardType] = useState("tiv");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !videoUrl || !requestedViews || !rewardPerView) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const views = parseInt(requestedViews);
      const reward = parseFloat(rewardPerView);
      const totalBudget = views * reward;

      const { error } = await supabase
        .from('campaigns')
        .insert({
          creator_id: user.id,
          title,
          description,
          video_url: videoUrl,
          requested_views: views,
          reward_per_view: reward,
          reward_type: rewardType,
          total_budget: totalBudget,
          remaining_budget: totalBudget,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Campaign Created!",
        description: "Your campaign has been created as a draft. Publish it when ready.",
      });

      navigate("/creators/dashboard");
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Campaign</CardTitle>
            <CardDescription>
              Set up your video campaign and define rewards for viewer engagement
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Product Launch Video"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your campaign and what viewers should expect"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL *</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  YouTube, Vimeo, or direct video link
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="requestedViews">Target Views *</Label>
                  <Input
                    id="requestedViews"
                    type="number"
                    min="100"
                    value={requestedViews}
                    onChange={(e) => setRequestedViews(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rewardPerView">Reward Per View *</Label>
                  <Input
                    id="rewardPerView"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={rewardPerView}
                    onChange={(e) => setRewardPerView(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Reward Type *</Label>
                <RadioGroup value={rewardType} onValueChange={setRewardType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tiv" id="tiv" />
                    <Label htmlFor="tiv" className="font-normal cursor-pointer">
                      TIV (Platform Currency)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="usd" id="usd" />
                    <Label htmlFor="usd" className="font-normal cursor-pointer">
                      USD (Direct Cash)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target Views:</span>
                      <span className="font-medium">{requestedViews || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reward Per View:</span>
                      <span className="font-medium">
                        {rewardPerView || 0} {rewardType.toUpperCase()}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Budget:</span>
                        <span className="font-bold text-primary">
                          {((parseInt(requestedViews) || 0) * (parseFloat(rewardPerView) || 0)).toFixed(2)} {rewardType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
