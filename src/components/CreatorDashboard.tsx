import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { LogOut, Wallet, Plus, ArrowUpRight } from "lucide-react";

interface CreatorDashboardProps {
  userId: string;
}

interface UserProfile {
  available_balance: number;
  tiv_balance: number;
  total_earned: number;
}

const CreatorDashboard = ({ userId }: CreatorDashboardProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: API Integration - Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('available_balance, tiv_balance, total_earned')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, toast]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    }
  };

  const handleCreateCampaign = () => {
    // TODO: API Integration - Open campaign creation modal/page
    toast({
      title: "Coming Soon",
      description: "Campaign creation will be available soon. Backend integration required.",
    });
  };

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

  const walletBalance = profile?.available_balance || 0;
  const pendingRevenue = 12450; // TODO: API Integration - Calculate from campaigns
  const verifiedViews = 24500; // TODO: API Integration - Sum from campaigns

  return (
    <div className="min-h-screen" data-role="creator">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                Your Campaign <span className="text-gradient-hero">Dashboard</span>
              </h1>
              <p className="text-lg text-foreground/80">
                A single control center for all live campaigns, revenue, and audience quality metrics.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="gradient" 
                onClick={handleCreateCampaign}
                className="hover-lift"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card p-6 hover-lift">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Active Campaigns</h4>
              <div className="text-5xl font-bold text-foreground mb-2">6</div>
              <p className="text-sm text-muted-foreground">
                {/* TODO: API Integration - Count from campaigns table */}
                Running / Scheduled
              </p>
            </Card>

            <Card className="glass-card p-6 hover-lift">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Pending Revenue</h4>
              <div className="text-5xl font-bold text-foreground mb-2">${pendingRevenue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">
                {/* TODO: API Integration - Calculate from active campaigns */}
                Access fees queued (estimate)
              </p>
            </Card>

            <Card className="glass-card p-6 hover-lift">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Verified Engagement</h4>
              <div className="text-5xl font-bold text-foreground mb-2">{verifiedViews.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">
                {/* TODO: API Integration - Sum from campaign analytics */}
                Total verified views
              </p>
            </Card>
          </div>

          {/* Wallet Card */}
          <div className="mb-8">
            <Card className="glass-card p-8 hover-lift bg-gradient-to-br from-profitiv-purple/10 to-profitiv-teal/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-profitiv-purple mb-2">Creator Wallet</h3>
                  <div className="text-5xl font-bold text-foreground mb-2">
                    ${walletBalance.toFixed(2)}
                  </div>
                  <p className="text-lg text-foreground/60">
                    Available balance • Use to fund campaigns or request payouts
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="glass"
                    onClick={() => {
                      // TODO: API Integration - Stripe Connect for adding funds
                      toast({
                        title: "Coming Soon",
                        description: "Add funds via Stripe. Backend integration required.",
                      });
                    }}
                  >
                    Add Funds
                  </Button>
                  <Button 
                    variant="gradient"
                    onClick={() => navigate('/payout-settings')}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Payout
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {/* TODO: API Integration - Stripe Connect for payouts */}
                Payouts processed automatically via Stripe. Requires verification for large amounts.
              </p>
            </Card>
          </div>

          {/* Active Campaign Example */}
          <Card className="glass-card p-6 hover-lift mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">Promo Campaign — 2,500 views</h3>
              <span className="text-sm text-muted-foreground">Goal: 2,500</span>
            </div>
            <Progress value={72} className="mb-4" />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {/* TODO: API Integration - Fetch from campaigns table */}
                Reward pool: 15,000 TIV • Access fee split managed by platform
              </p>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="glass-card p-6 hover-lift cursor-pointer group"
              onClick={handleCreateCampaign}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-profitiv-purple/20 flex items-center justify-center group-hover:bg-profitiv-purple/30 transition-colors">
                  📹
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-profitiv-purple transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">New Campaign</h3>
              <p className="text-sm text-foreground/60">Launch a new campaign</p>
            </Card>

            <Card 
              className="glass-card p-6 hover-lift cursor-pointer group"
              onClick={() => navigate('/marketplace')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-profitiv-teal/20 flex items-center justify-center group-hover:bg-profitiv-teal/30 transition-colors">
                  🏪
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-profitiv-teal transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">TIV Marketplace</h3>
              <p className="text-sm text-foreground/60">Buy TIV for campaigns</p>
            </Card>

            <Card 
              className="glass-card p-6 hover-lift cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  📊
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">Analytics</h3>
              <p className="text-sm text-foreground/60">View campaign stats</p>
            </Card>

            <Card 
              className="glass-card p-6 hover-lift cursor-pointer group"
              onClick={() => navigate('/payout-settings')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
                  💰
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-success transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">Payout Settings</h3>
              <p className="text-sm text-foreground/60">Manage withdrawals</p>
            </Card>
          </div>

          {/* Legal Notice */}
          <div className="mt-12 p-4 glass-card">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Legal:</strong> Campaign metrics shown are estimates based on current engagement. 
              Profitiv is a marketing & engagement platform — not an investment service. 
              All campaign funding, payouts, and TIV transactions require backend integration with Stripe and verification systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
