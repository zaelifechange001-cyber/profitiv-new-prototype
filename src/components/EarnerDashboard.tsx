import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { LogOut } from "lucide-react";

interface EarnerDashboardProps {
  userId: string;
}

interface UserProfile {
  available_balance: number;
  tiv_balance: number;
  total_earned: number;
  tiv_to_usd_rate: number;
}

const EarnerDashboard = ({ userId }: EarnerDashboardProps) => {
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
          .select('available_balance, tiv_balance, total_earned, tiv_to_usd_rate')
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

  const tivBalance = profile?.tiv_balance || 0;
  const tivUsdValue = tivBalance * (profile?.tiv_to_usd_rate || 0.01);
  const totalEarned = profile?.total_earned || 0;
  const withdrawable = profile?.available_balance || 0;

  return (
    <div className="min-h-screen relative overflow-hidden isolate-blend" data-role="earner">
      <BackgroundAnimation />
      
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/30 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="profitiv-logo" aria-label="Profitiv home" title="Profitiv">
                <span className="profitiv-wordmark">Profitiv</span>
              </a>
              <div className="hidden sm:block h-8 w-px bg-border/50" />
              <div>
                <div className="font-bold text-foreground">Welcome back</div>
                <div className="text-sm text-muted-foreground">Earner Dashboard</div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/videos')} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Campaigns
              </button>
              <button 
                onClick={() => navigate('/marketplace')} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Marketplace
              </button>
              <Button variant="outline" size="sm" onClick={() => navigate('/payout-settings')}>
                Withdraw
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/payout-settings')}>
                Withdraw
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 pt-12 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Your Earning <span className="text-gradient-hero">Dashboard</span>
            </h1>
            <p className="text-base text-muted-foreground">
              Overview of your rewards, tasks, and active campaigns.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 hover-lift">
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">Total Earned</h4>
              <div className="text-3xl font-bold text-foreground">${totalEarned.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">All-time earnings</p>
            </div>

            <div className="glass-card p-6 hover-lift">
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">TIV Balance</h4>
              <div className="text-3xl font-bold text-foreground">{tivBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">≈ ${tivUsdValue.toFixed(2)} USD</p>
            </div>

            <div className="glass-card p-6 hover-lift">
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">Withdrawable</h4>
              <div className="text-3xl font-bold text-foreground">${withdrawable.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
            </div>
          </div>

          {/* Quick action cards removed per request */}


          {/* Legal Notice */}
          <div className="mt-12 p-4 glass-card">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Legal:</strong> Profitiv is a fintech marketing & promotional rewards platform. 
              Rewards are earned from verified engagement with brand campaigns — not an investment service. 
              Withdrawals and TIV trades require backend payment integration and identity verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnerDashboard;
