import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Coins, DollarSign, TrendingUp, Video, ShoppingCart, Wallet, LogOut } from "lucide-react";
import { VerificationStatusCard } from "@/components/verification/VerificationStatusCard";

interface EarnerDashboardProps {
  userId: string;
}

interface UserProfile {
  available_balance: number;
  tiv_balance: number;
  total_earned: number;
  tiv_to_usd_rate: number;
  first_name: string;
  email: string;
}

interface SubscriptionPlan {
  name: 'Starter' | 'Builder' | 'Pro' | 'Elite';
  weekly_cap: number;
  monthly_cap: number;
}

interface Campaign {
  id: string;
  title: string;
  creator_name: string;
  video_length: string;
  remaining_quota: number;
  earned_amount: number;
  progress: number;
  reward_type: 'tiv' | 'usd';
}

interface RewardTransaction {
  date: string;
  campaign_name: string;
  reward_amount: number;
  reward_type: 'tiv' | 'usd';
}

interface SubscriptionData {
  plan_name: string;
  weekly_cap: number;
  monthly_cap: number;
}

const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  'Starter': { name: 'Starter', weekly_cap: 100, monthly_cap: 500 },
  'Builder': { name: 'Builder', weekly_cap: 200, monthly_cap: 1000 },
  'Pro': { name: 'Pro', weekly_cap: 300, monthly_cap: 1500 },
  'Elite': { name: 'Elite', weekly_cap: 450, monthly_cap: 2250 }
};

const EarnerDashboard = ({ userId }: EarnerDashboardProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS['Starter']);
  const [weeklyUsed, setWeeklyUsed] = useState(0);
  const [monthlyUsed, setMonthlyUsed] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [recentRewards, setRecentRewards] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('available_balance, tiv_balance, total_earned, tiv_to_usd_rate, first_name, email')
        .eq('user_id', userId)
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
            weekly_cap,
            monthly_cap,
            role
          )
        `)
        .eq('user_id', userId)
        .eq('role', 'earner')
        .eq('status', 'active')
        .single();

      if (subData?.subscription_plans) {
        const planData = Array.isArray(subData.subscription_plans) 
          ? subData.subscription_plans[0] 
          : subData.subscription_plans;
        
        const planName = planData.name || 'Starter';
        setSubscription(SUBSCRIPTION_PLANS[planName] || SUBSCRIPTION_PLANS['Starter']);
      } else {
        // Default to Starter if no subscription
        setSubscription(SUBSCRIPTION_PLANS['Starter']);
      }

      // Fetch user activities for weekly/monthly usage calculation
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: weeklyData } = await supabase
        .from('user_activities')
        .select('amount')
        .eq('user_id', userId)
        .gte('created_at', startOfWeek.toISOString())
        .in('activity_type', ['course_completion', 'spin_reward']);

      const { data: monthlyData } = await supabase
        .from('user_activities')
        .select('amount')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .in('activity_type', ['course_completion', 'spin_reward']);

      setWeeklyUsed(weeklyData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0);
      setMonthlyUsed(monthlyData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0);

      // Fetch active campaigns (TODO: implement proper campaign participation tracking)
      // Mock data for now
      setActiveCampaigns([
        {
          id: '1',
          title: 'Brand Awareness Campaign',
          creator_name: 'TechBrand Inc.',
          video_length: '30s',
          remaining_quota: 2350,
          earned_amount: 15,
          progress: 60,
          reward_type: 'tiv'
        },
        {
          id: '2',
          title: 'Product Launch Video',
          creator_name: 'EcoProducts',
          video_length: '45s',
          remaining_quota: 1200,
          earned_amount: 25,
          progress: 80,
          reward_type: 'usd'
        }
      ]);

      // Fetch recent rewards
      const { data: rewardsData } = await supabase
        .from('user_activities')
        .select('created_at, description, amount, activity_type')
        .eq('user_id', userId)
        .in('activity_type', ['course_completion', 'spin_reward', 'tiv_conversion'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (rewardsData) {
        setRecentRewards(
          rewardsData.map(reward => ({
            date: new Date(reward.created_at).toLocaleDateString(),
            campaign_name: reward.description,
            reward_amount: Number(reward.amount),
            reward_type: reward.activity_type.includes('tiv') ? 'tiv' : 'usd'
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

  const handleWithdraw = () => {
    if (weeklyUsed >= subscription.weekly_cap) {
      toast({
        title: "Weekly Limit Reached",
        description: "Upgrade your plan to earn more",
        variant: "destructive",
      });
      return;
    }
    navigate("/payout-settings");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const weeklyRemaining = subscription.weekly_cap - weeklyUsed;
  const monthlyRemaining = subscription.monthly_cap - monthlyUsed;
  const weeklyProgress = (weeklyUsed / subscription.weekly_cap) * 100;
  const isWeeklyCapped = weeklyUsed >= subscription.weekly_cap;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary">Profitiv</h1>
            <div className="hidden md:flex gap-6">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate("/videos")}>
                Campaigns
              </Button>
              <Button variant="ghost" onClick={() => navigate("/marketplace")}>
                Marketplace
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
        {/* Verification Status */}
        <VerificationStatusCard />

        {/* Hero Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.first_name || 'Earner'}!
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {subscription.name} Plan
            </Badge>
            <p className="text-muted-foreground">
              ${weeklyRemaining.toFixed(2)} of ${subscription.weekly_cap} weekly limit remaining
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
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total TIVs</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.tiv_balance.toFixed(0) || 0}</div>
              <p className="text-xs text-muted-foreground">
                ≈ ${((profile?.tiv_balance || 0) * (profile?.tiv_to_usd_rate || 0.01)).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profile?.available_balance.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">Available to withdraw</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${weeklyUsed.toFixed(2)}</div>
              <Progress value={weeklyProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {isWeeklyCapped ? 'Limit reached!' : `of $${subscription.weekly_cap}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profile?.total_earned.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">All-time earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Active Campaigns Feed */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Active Campaigns You're Participating In</CardTitle>
              <CardDescription>Your ongoing campaign engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCampaigns.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active campaigns. Browse available campaigns to start earning!
                </p>
              ) : (
                activeCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{campaign.title}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.creator_name}</p>
                      </div>
                      <Badge variant={campaign.reward_type === 'tiv' ? 'secondary' : 'default'}>
                        {campaign.earned_amount} {campaign.reward_type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Length: {campaign.video_length}</span>
                        <span className="text-muted-foreground">{campaign.remaining_quota} views left</span>
                      </div>
                      <Progress value={campaign.progress} />
                      <p className="text-xs text-muted-foreground">{campaign.progress}% complete</p>
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
                onClick={() => navigate("/videos")}
              >
                <Video className="mr-2 h-4 w-4" />
                Watch a Video
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/marketplace")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                TIV Marketplace
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleWithdraw}
                disabled={isWeeklyCapped}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Withdraw Rewards
              </Button>
              {isWeeklyCapped && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Weekly limit reached. Upgrade to earn more.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Rewards Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Rewards</CardTitle>
            <CardDescription>Your latest earnings and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentRewards.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No rewards yet</p>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left text-sm font-medium">Date</th>
                        <th className="p-3 text-left text-sm font-medium">Campaign</th>
                        <th className="p-3 text-right text-sm font-medium">Reward</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRewards.map((reward, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="p-3 text-sm">{reward.date}</td>
                          <td className="p-3 text-sm">{reward.campaign_name}</td>
                          <td className="p-3 text-sm text-right font-medium">
                            {reward.reward_amount.toFixed(2)} {reward.reward_type.toUpperCase()}
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
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Plan</span>
                <Badge>{subscription.name}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Limit</span>
                <span className="text-sm font-medium">${subscription.weekly_cap}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Limit</span>
                <span className="text-sm font-medium">${subscription.monthly_cap}</span>
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

export default EarnerDashboard;
