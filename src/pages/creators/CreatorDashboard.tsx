// Creator Dashboard Component
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Video, Eye, Play, Plus, LogOut, BarChart } from "lucide-react";

interface CreatorProfile {
  available_balance: number;
  total_earned: number;
  first_name: string;
  email: string;
}

interface SubscriptionPlan {
  name: 'Starter' | 'Builder' | 'Pro' | 'Elite';
  max_campaigns: number;
  max_target_views: number;
  revenue_share_percent: number;
}

interface Campaign {
  id: string;
  title: string;
  video_length: string;
  current_views: number;
  goal_views: number;
  status: string;
  investment_amount: number;
}

interface Transaction {
  date: string;
  description: string;
  amount: number;
}

const CreatorDashboard = () => {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [campaignCount, setCampaignCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('available_balance, total_earned, first_name, email')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user subscription
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans:plan_id (
            name,
            max_campaigns,
            max_target_views,
            revenue_share_percent,
            role
          )
        `)
        .eq('user_id', user.id)
        .eq('role', 'creator')
        .eq('status', 'active')
        .maybeSingle();

      if (subData?.subscription_plans) {
        const planData = Array.isArray(subData.subscription_plans) 
          ? subData.subscription_plans[0] 
          : subData.subscription_plans;
        
        setSubscription({
          name: planData.name || 'Starter',
          max_campaigns: Number(planData.max_campaigns) || 1,
          max_target_views: Number(planData.max_target_views) || 1000,
          revenue_share_percent: Number(planData.revenue_share_percent) || 50
        });
      } else {
        // Default to Starter if no subscription
        setSubscription({
          name: 'Starter',
          max_campaigns: 1,
          max_target_views: 1000,
          revenue_share_percent: 50
        });
      }

      // Fetch campaigns
      const { data: campaignsData } = await supabase
        .from('investment_videos')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (campaignsData) {
        setActiveCampaigns(campaignsData.map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          video_length: '30s', // Could be calculated from video_url
          current_views: campaign.current_views || 0,
          goal_views: campaign.goal_views,
          status: campaign.status,
          investment_amount: campaign.investment_amount
        })));
        setCampaignCount(campaignsData.length);
        setTotalViews(campaignsData.reduce((sum, c) => sum + (c.current_views || 0), 0));
      }

      // Fetch recent transactions
      const { data: transactionsData } = await supabase
        .from('user_activities')
        .select('created_at, description, amount')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsData) {
        setRecentTransactions(
          transactionsData.map(tx => ({
            date: new Date(tx.created_at).toLocaleDateString(),
            description: tx.description,
            amount: Number(tx.amount)
          }))
        );
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading || !subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const campaignProgress = (campaignCount / subscription.max_campaigns) * 100;
  const canCreateCampaign = campaignCount < subscription.max_campaigns;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary">Profitiv</h1>
            <div className="hidden md:flex gap-6">
              <Button variant="ghost" onClick={() => navigate("/creators/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate("/admin/campaigns")}>
                Campaigns
              </Button>
              <Button variant="ghost" onClick={() => navigate("/admin/financial")}>
                Financials
              </Button>
              <Button variant="ghost" onClick={() => navigate("/payout-settings")}>
                Withdraw
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container py-8 space-y-8">
        {/* Hero Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.first_name || 'Creator'}!
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {subscription.name} Plan
            </Badge>
            <p className="text-muted-foreground text-sm">
              Grow your brand with video campaigns
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/pricing")}
              className="ml-auto"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignCount}</div>
              <p className="text-xs text-muted-foreground">
                of {subscription.max_campaigns} campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profile?.available_balance.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">Ready to withdraw</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Limits */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Campaign Capacity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold">{campaignCount}</span>
                <span className="text-sm text-muted-foreground">of {subscription.max_campaigns}</span>
              </div>
              <Progress value={campaignProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {canCreateCampaign 
                  ? `${subscription.max_campaigns - campaignCount} campaign slots available` 
                  : 'Campaign limit reached. Upgrade for more.'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{subscription.revenue_share_percent}%</div>
              <p className="text-xs text-muted-foreground">
                You keep {subscription.revenue_share_percent}% of campaign revenue
              </p>
              <p className="text-xs text-muted-foreground">
                Max {subscription.max_target_views.toLocaleString()} views per campaign
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Active Campaigns */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Active Campaigns</CardTitle>
              <CardDescription>Monitor your campaign performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active campaigns yet</p>
                  <Button onClick={() => navigate("/admin/campaigns")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </div>
              ) : (
                activeCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{campaign.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Investment: ${campaign.investment_amount.toFixed(2)}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Length: {campaign.video_length}</span>
                        <span className="text-muted-foreground">
                          {campaign.current_views} / {campaign.goal_views} views
                        </span>
                      </div>
                      <Progress value={(campaign.current_views / campaign.goal_views) * 100} />
                      <p className="text-xs text-muted-foreground">
                        {Math.round((campaign.current_views / campaign.goal_views) * 100)}% complete
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/admin/campaigns")}
                disabled={!canCreateCampaign}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/admin/campaigns")}
              >
                <Play className="mr-2 h-4 w-4" />
                Manage Campaigns
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/admin/financial")}
              >
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              {!canCreateCampaign && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Campaign limit reached. Upgrade for more slots.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left text-sm font-medium">Date</th>
                        <th className="p-3 text-left text-sm font-medium">Description</th>
                        <th className="p-3 text-right text-sm font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="p-3 text-sm">{tx.date}</td>
                          <td className="p-3 text-sm">{tx.description}</td>
                          <td className="p-3 text-sm text-right font-medium">
                            ${tx.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>Your current creator plan limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Plan</span>
                <Badge>{subscription.name}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Max Campaigns</span>
                <span className="text-sm font-medium">{subscription.max_campaigns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Max Views Per Campaign</span>
                <span className="text-sm font-medium">{subscription.max_target_views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Revenue Share</span>
                <span className="text-sm font-medium">{subscription.revenue_share_percent}%</span>
              </div>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => navigate("/pricing")}
              >
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorDashboard;
