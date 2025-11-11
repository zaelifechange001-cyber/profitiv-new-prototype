import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Campaign, generateId } from "@/types/dashboard";
import { toast } from "sonner";

interface CreatorDashboardProps {
  onOpenMarketplace: () => void;
}

const CreatorDashboard = ({ onOpenMarketplace }: CreatorDashboardProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: generateId(), title: 'Promo — 2,500 views', target: 2500, views: 1800, rewardPool: '15,000 TIV', status: 'live' },
    { id: generateId(), title: 'Launch — 1,000 views', target: 1000, views: 620, rewardPool: '6,000 TIV', status: 'live' },
    { id: generateId(), title: 'Course Push — 5,000 views', target: 5000, views: 1200, rewardPool: '40,000 TIV', status: 'live' }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    views: '',
    rewardType: 'tiv',
    budget: ''
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.views || !formData.budget) {
      toast.error('Please complete all campaign fields');
      return;
    }

    const target = parseInt(formData.views, 10);
    const budget = parseFloat(formData.budget);
    const rewardPool = formData.rewardType === 'tiv' 
      ? `${Math.round(budget * 1000)} TIV` 
      : `$${budget}`;

    const newCampaign: Campaign = {
      id: generateId(),
      title: formData.title,
      target,
      views: 0,
      rewardPool,
      status: 'live'
    };

    setCampaigns([newCampaign, ...campaigns]);
    
    // TODO: In production, POST newCampaign to your backend API
    // POST /api/campaigns
    // Server should validate budget, deduct creator funds, and persist the campaign
    console.log('Create campaign (TODO: backend):', newCampaign);
    
    setFormData({ title: '', views: '', rewardType: 'tiv', budget: '' });
    toast.success('Campaign created (mock)');
  };

  const simulateProgress = () => {
    if (campaigns.length === 0) return;
    
    const updatedCampaigns = [...campaigns];
    updatedCampaigns[0] = {
      ...updatedCampaigns[0],
      views: Math.min(updatedCampaigns[0].target, updatedCampaigns[0].views + Math.round(Math.random() * 200))
    };
    setCampaigns(updatedCampaigns);
    toast.success('Campaign progress simulated');
  };

  const handlePayout = () => {
    // TODO: In production, call backend endpoint to create Stripe payout
    // POST /api/payouts/create { recipientId, amount }
    // Server should use Stripe Connect to create payout or transfer
    console.log('Request payout (TODO: backend integration)');
    toast.info('Auto payout requested (demo). Integrate backend to call Stripe Connect payouts.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Welcome back, <strong>Creator</strong></p>
              <h2 className="text-2xl font-bold">Creator Dashboard</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Plan</p>
              <div className="inline-block px-3 py-1 bg-muted rounded-full font-semibold text-sm mt-1">
                Pro
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Active Campaigns</p>
            <p className="text-4xl font-bold mb-1">{campaigns.filter(c => c.status === 'live').length}</p>
            <p className="text-sm text-muted-foreground">Live now</p>
          </Card>
          
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Pending Revenue (est.)</p>
            <p className="text-4xl font-bold mb-1">$3,200</p>
            <p className="text-sm text-muted-foreground">Auto-calculated from access fees</p>
          </Card>
          
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Verified Views</p>
            <p className="text-4xl font-bold mb-1">
              {campaigns.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Quality engagements</p>
          </Card>
        </div>

        {/* Live Campaigns */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Live Campaigns</h3>
              <p className="text-sm text-muted-foreground">Monitor progress & rewards</p>
            </div>
            <Button variant="ghost" onClick={simulateProgress}>
              Simulate Progress
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const percent = Math.min(100, Math.round((campaign.views / campaign.target) * 100));
              return (
                <Card key={campaign.id} className="p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{campaign.title}</h4>
                      <p className="text-sm text-muted-foreground">Reward pool: {campaign.rewardPool}</p>
                    </div>
                    <span className="text-sm font-semibold">{percent}%</span>
                  </div>
                  
                  <Progress value={percent} className="mb-3" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {campaign.views.toLocaleString()} / {campaign.target.toLocaleString()} views
                    </span>
                    <Button variant="ghost" size="sm">
                      Manual Reward
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        {/* Create Campaign Form */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Create New Campaign</h3>
              <p className="text-sm text-muted-foreground">Launch a campaign (mock only)</p>
            </div>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Campaign title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                placeholder="Target views"
                type="number"
                min="100"
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={formData.rewardType}
                onValueChange={(value) => setFormData({ ...formData, rewardType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Reward type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiv">Reward: TIVs</SelectItem>
                  <SelectItem value="cash">Reward: Cash</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Campaign budget ($)"
                type="number"
                min="5"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFormData({ title: '', views: '', rewardType: 'tiv', budget: '' })}
              >
                Reset
              </Button>
              <Button type="submit" variant="gradient">
                Create Campaign
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Campaigns created here appear immediately in your live list. (Back-end persistence required for production.)
            </p>
          </form>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Wallet Card */}
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Creator Wallet</p>
          <p className="text-4xl font-bold mb-2">$6,820</p>
          <p className="text-sm text-muted-foreground mb-4">
            Available for transfer — transfers processed automatically via Stripe Connect (backend required)
          </p>
          
          <Button className="w-full" variant="gradient" onClick={handlePayout}>
            Request Auto Payout (Simulate)
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3">
            Note: In production, call your server to create a Stripe Payout/Transfer using Stripe Connect.
          </p>
        </Card>

        {/* Plan Card */}
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Plan Overview</p>
          <h3 className="text-2xl font-bold mb-4">Pro</h3>
          
          <div className="space-y-2 text-sm">
            <p><strong>Campaign limit:</strong> up to 15 campaigns/month</p>
            <p><strong>Reward budgets:</strong> $1,000 — $10,000 per campaign</p>
            <p><strong>Features:</strong> Enhanced analytics, verified badges</p>
          </div>
        </Card>

        {/* Marketplace Card */}
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">TIV Marketplace (Buy Packs)</p>
          
          <Button className="w-full mt-4" variant="ghost" onClick={onOpenMarketplace}>
            Open Marketplace
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3">
            Creators may buy TIV packs to fund perks and conversion tasks.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CreatorDashboard;
