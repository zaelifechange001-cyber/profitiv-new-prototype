import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Edit, TrendingUp, DollarSign, Eye, Plus, Settings, Download, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Campaign {
  id: string;
  title: string;
  category: string;
  video_url: string;
  video_length: string;
  target_views: number;
  current_views: number;
  reward_per_view: number;
  budget_reserved: number;
  budget_spent: number;
  status: 'draft' | 'live' | 'paused' | 'completed';
  created_at: string;
  start_date?: string;
  end_date?: string;
  cta_text?: string;
}

interface CreatorPlan {
  name: string;
  max_campaigns: number;
  max_target_views: number;
  payout_delay_days: number;
  current_campaigns: number;
}

interface CreatorProfile {
  available_balance: number;
  tiv_balance: number;
  total_earned: number;
  pending_payouts: number;
  first_name?: string;
}

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<CreatorProfile>({
    available_balance: 0,
    tiv_balance: 0,
    total_earned: 0,
    pending_payouts: 0
  });
  const [creatorPlan, setCreatorPlan] = useState<CreatorPlan>({
    name: 'Starter',
    max_campaigns: 5,
    max_target_views: 5000,
    payout_delay_days: 7,
    current_campaigns: 0
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<'all' | 'live' | 'draft' | 'paused' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    category: '',
    video_url: '',
    video_length: '',
    target_views: '',
    reward_per_view: '',
    budget: '',
    start_date: '',
    end_date: '',
    cta_text: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await fetchData(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('available_balance, tiv_balance, total_earned, first_name')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch creator subscription
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans:plan_id (
            name,
            max_campaigns,
            max_target_views,
            payout_delay_days,
            role
          )
        `)
        .eq('user_id', userId)
        .eq('role', 'creator')
        .eq('status', 'active')
        .single();

      if (subData?.subscription_plans) {
        const planData = Array.isArray(subData.subscription_plans) 
          ? subData.subscription_plans[0] 
          : subData.subscription_plans;
        
        setCreatorPlan({
          name: planData.name || 'Starter',
          max_campaigns: planData.max_campaigns || 5,
          max_target_views: planData.max_target_views || 5000,
          payout_delay_days: planData.payout_delay_days || 7,
          current_campaigns: campaigns.filter(c => c.status === 'live' || c.status === 'paused').length
        });
      }

      // Calculate pending payouts (mock for now)
      const pendingPayouts = 420.00;

      setProfile({
        ...profileData,
        pending_payouts: pendingPayouts
      });

      // TODO: Fetch campaigns from API
      // For now, using mock data
      setCampaigns([
        {
          id: '1',
          title: 'Product Showcase - Fall Collection',
          category: 'advertisement',
          video_url: 'https://example.com/video1.mp4',
          video_length: '30s',
          target_views: 10000,
          current_views: 7250,
          reward_per_view: 0.05,
          budget_reserved: 500,
          budget_spent: 362.50,
          status: 'live',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Brand Awareness Campaign',
          category: 'youtube',
          video_url: 'https://example.com/video2.mp4',
          video_length: '45s',
          target_views: 5000,
          current_views: 5000,
          reward_per_view: 0.08,
          budget_reserved: 400,
          budget_spent: 400,
          status: 'completed',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'New Product Launch',
          category: 'advertisement',
          video_url: 'https://example.com/video3.mp4',
          video_length: '60s',
          target_views: 15000,
          current_views: 0,
          reward_per_view: 0.06,
          budget_reserved: 0,
          budget_spent: 0,
          status: 'draft',
          created_at: new Date().toISOString()
        }
      ]);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      // Validate inputs
      const targetViews = parseInt(newCampaign.target_views);
      const rewardPerView = parseFloat(newCampaign.reward_per_view);
      const budget = parseFloat(newCampaign.budget);
      const requiredBudget = targetViews * rewardPerView;

      if (budget < requiredBudget) {
        toast.error(`Insufficient budget. Required: $${requiredBudget.toFixed(2)}`);
        return;
      }

      if (creatorPlan.current_campaigns >= creatorPlan.max_campaigns) {
        toast.error(`Campaign limit reached. Upgrade to create more campaigns.`);
        return;
      }

      // TODO: API Integration - POST /api/creator/{id}/campaigns
      const campaign: Campaign = {
        id: Date.now().toString(),
        title: newCampaign.title,
        category: newCampaign.category,
        video_url: newCampaign.video_url,
        video_length: newCampaign.video_length,
        target_views: targetViews,
        current_views: 0,
        reward_per_view: rewardPerView,
        budget_reserved: 0,
        budget_spent: 0,
        status: 'draft',
        created_at: new Date().toISOString(),
        start_date: newCampaign.start_date || undefined,
        end_date: newCampaign.end_date || undefined,
        cta_text: newCampaign.cta_text || undefined
      };

      setCampaigns([campaign, ...campaigns]);
      setCreateDialogOpen(false);
      setNewCampaign({
        title: '',
        category: '',
        video_url: '',
        video_length: '',
        target_views: '',
        reward_per_view: '',
        budget: '',
        start_date: '',
        end_date: '',
        cta_text: ''
      });
      toast.success('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    }
  };

  const handlePublishCampaign = async (campaignId: string) => {
    try {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) return;

      const requiredReserve = campaign.target_views * campaign.reward_per_view;
      
      if (profile.available_balance < requiredReserve) {
        toast.error(`Insufficient funds. Required: $${requiredReserve.toFixed(2)}. Available: $${profile.available_balance.toFixed(2)}`);
        return;
      }

      // TODO: API Integration - POST /api/campaigns/{campaignId}/publish
      setCampaigns(campaigns.map(c => 
        c.id === campaignId 
          ? { ...c, status: 'live', budget_reserved: requiredReserve }
          : c
      ));

      setProfile({
        ...profile,
        available_balance: profile.available_balance - requiredReserve
      });

      toast.success('Campaign published successfully!');
    } catch (error) {
      console.error('Error publishing campaign:', error);
      toast.error('Failed to publish campaign');
    }
  };

  const handlePauseCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: 'paused' as const } : c
    ));
    toast.success('Campaign paused');
  };

  const handleResumeCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: 'live' as const } : c
    ));
    toast.success('Campaign resumed');
  };

  const handleTopUpWallet = () => {
    // TODO: API Integration - POST /api/wallet/topup -> Stripe Checkout
    toast.info('Redirecting to Stripe Checkout...');
    // window.location.href = stripeCheckoutUrl;
  };

  const handleBuyTIVPack = () => {
    // TODO: API Integration - POST /api/market/buy -> Stripe Checkout
    toast.info('TIV purchase coming soon');
  };

  const filteredCampaigns = filter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === filter);

  const totalViews = campaigns.reduce((sum, c) => sum + c.current_views, 0);
  const activeCampaignsCount = campaigns.filter(c => c.status === 'live').length;

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile.first_name || user?.email?.split('@')[0]}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Badge variant="secondary">{creatorPlan.name} Plan</Badge>
              <span>Campaigns: <strong>{creatorPlan.current_campaigns} / {creatorPlan.max_campaigns}</strong></span>
              <span>•</span>
              <span>Views: <strong>{totalViews.toLocaleString()} / {creatorPlan.max_target_views.toLocaleString()}</strong></span>
              <span>•</span>
              <span>Payout: <strong>{creatorPlan.payout_delay_days}d delay</strong></span>
            </div>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate("/pricing")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaignsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profile.pending_payouts.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profile.available_balance.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{profile.tiv_balance} TIVs</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Campaign Manager */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Campaign Manager</h2>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Fill in the details to launch your campaign
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Campaign Title *</Label>
                      <Input
                        value={newCampaign.title}
                        onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                        placeholder="e.g., Product Launch Campaign"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category *</Label>
                        <Select value={newCampaign.category} onValueChange={(value) => setNewCampaign({ ...newCampaign, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="advertisement">Advertisement</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="learn">Learn & Earn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Video Length *</Label>
                        <Input
                          value={newCampaign.video_length}
                          onChange={(e) => setNewCampaign({ ...newCampaign, video_length: e.target.value })}
                          placeholder="e.g., 30s"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Video URL or Upload *</Label>
                      <Input
                        value={newCampaign.video_url}
                        onChange={(e) => setNewCampaign({ ...newCampaign, video_url: e.target.value })}
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Target Views *</Label>
                        <Input
                          type="number"
                          value={newCampaign.target_views}
                          onChange={(e) => setNewCampaign({ ...newCampaign, target_views: e.target.value })}
                          placeholder="10000"
                        />
                      </div>

                      <div>
                        <Label>Reward per View (USD) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newCampaign.reward_per_view}
                          onChange={(e) => setNewCampaign({ ...newCampaign, reward_per_view: e.target.value })}
                          placeholder="0.05"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Campaign Budget (USD) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newCampaign.budget}
                        onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                        placeholder="500.00"
                      />
                      {newCampaign.target_views && newCampaign.reward_per_view && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Required: ${(parseInt(newCampaign.target_views) * parseFloat(newCampaign.reward_per_view)).toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={newCampaign.start_date}
                          onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={newCampaign.end_date}
                          onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Call-to-Action (Optional)</Label>
                      <Textarea
                        value={newCampaign.cta_text}
                        onChange={(e) => setNewCampaign({ ...newCampaign, cta_text: e.target.value })}
                        placeholder="Visit our website for exclusive offers!"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                      <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCampaign}>
                        Create Campaign
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Campaign Cards */}
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{campaign.title}</CardTitle>
                          <Badge variant={
                            campaign.status === 'live' ? 'default' :
                            campaign.status === 'draft' ? 'secondary' :
                            campaign.status === 'paused' ? 'outline' :
                            'secondary'
                          }>
                            {campaign.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          {campaign.category} • {campaign.video_length} • {campaign.current_views.toLocaleString()} / {campaign.target_views.toLocaleString()} views
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <Button size="sm" onClick={() => handlePublishCampaign(campaign.id)}>
                            Publish
                          </Button>
                        )}
                        {campaign.status === 'live' && (
                          <Button size="sm" variant="outline" onClick={() => handlePauseCampaign(campaign.id)}>
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {campaign.status === 'paused' && (
                          <Button size="sm" variant="outline" onClick={() => handleResumeCampaign(campaign.id)}>
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {(campaign.status === 'draft' || campaign.status === 'paused') && (
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <TrendingUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(campaign.current_views / campaign.target_views) * 100} className="mb-4" />
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget Reserved</p>
                        <p className="font-medium">${campaign.budget_reserved.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Budget Spent</p>
                        <p className="font-medium">${campaign.budget_spent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completion</p>
                        <p className="font-medium">{((campaign.current_views / campaign.target_views) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Wallet & Actions Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold">${profile.available_balance.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{profile.tiv_balance} TIVs</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-xl font-semibold">${profile.pending_payouts.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Available in 3-7 days</p>
                </div>
                <Button className="w-full" onClick={handleTopUpWallet}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Top Up Wallet
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate('/payout-settings')}>
                  Withdraw Funds
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TIV Marketplace</CardTitle>
                <CardDescription>Buy TIV packs to fund campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">Starter Pack</p>
                  <p className="text-2xl font-bold">1,000 TIVs</p>
                  <p className="text-sm text-muted-foreground">$100.00</p>
                  <Button size="sm" className="w-full mt-2" onClick={handleBuyTIVPack}>
                    Purchase
                  </Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">Pro Pack</p>
                  <p className="text-2xl font-bold">5,000 TIVs</p>
                  <p className="text-sm text-muted-foreground">$450.00</p>
                  <Button size="sm" className="w-full mt-2" onClick={handleBuyTIVPack}>
                    Purchase
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Funds are reserved when campaigns go live</p>
                <p>• Payouts have a 3-7 day verification period</p>
                <p>• KYC required before first withdrawal</p>
                <p>• All transactions are secured via Stripe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
