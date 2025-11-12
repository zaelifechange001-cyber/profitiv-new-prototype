import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { LogOut, Wallet, ArrowUpRight } from "lucide-react";

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
    <div className="min-h-screen bg-background relative" data-role="earner">
      <BackgroundAnimation />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <span className="profitiv-wordmark">Profitiv</span>
              <nav className="hidden md:flex gap-6">
                <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
                <a href="/dashboard" className="text-sm text-foreground font-medium">Dashboard</a>
                <a href="/videos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Campaigns</a>
                <a href="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Marketplace</a>
                <a href="/payout-settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Withdraw</a>
              </nav>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4 hover-lift">
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">Total Earned</h4>
              <div className="text-2xl font-bold text-foreground">${totalEarned.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">All-time earnings</p>
            </div>

            <div className="glass-card p-4 hover-lift">
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">TIV Balance</h4>
              <div className="text-2xl font-bold text-foreground">{tivBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">≈ ${tivUsdValue.toFixed(2)} USD</p>
            </div>

            <div className="glass-card p-4 hover-lift">
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">Withdrawable</h4>
              <div className="text-2xl font-bold text-foreground">${withdrawable.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
            </div>
          </div>

          {/* Featured Campaign */}
          <div className="glass-card p-5 hover-lift mb-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Featured Campaign</h3>
                <p className="text-sm text-muted-foreground">1,000 completions needed</p>
              </div>
              <span className="text-sm text-profitiv-teal font-semibold">+15 TIV</span>
            </div>
            <div className="mb-3">
              <div className="progress-bar mb-2">
                <div className="progress-bar-fill" style={{ width: '56%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">560 / 1,000 completed</p>
            </div>
            <Button variant="gradient" size="sm" onClick={() => navigate('/videos')} className="w-full">
              Watch & Earn
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              className="glass-card p-4 hover-lift cursor-pointer group"
              onClick={() => navigate('/videos')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-profitiv-teal/20 flex items-center justify-center group-hover:bg-profitiv-teal/30 transition-colors text-lg">
                  📹
                </div>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-profitiv-teal transition-colors" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Watch Videos</h3>
              <p className="text-xs text-foreground/60">Earn TIVs by watching</p>
            </div>

            <div 
              className="glass-card p-4 hover-lift cursor-pointer group"
              onClick={() => navigate('/learn-earn')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-profitiv-purple/20 flex items-center justify-center group-hover:bg-profitiv-purple/30 transition-colors text-lg">
                  📚
                </div>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-profitiv-purple transition-colors" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Learn & Earn</h3>
              <p className="text-xs text-foreground/60">Complete courses</p>
            </div>

            <div 
              className="glass-card p-4 hover-lift cursor-pointer group"
              onClick={() => navigate('/spin')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors text-lg">
                  ✨
                </div>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Spin to Win</h3>
              <p className="text-xs text-foreground/60">Daily rewards</p>
            </div>

            <div 
              className="glass-card p-4 hover-lift cursor-pointer group"
              onClick={() => navigate('/marketplace')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors text-lg">
                  🏪
                </div>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-success transition-colors" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Marketplace</h3>
              <p className="text-xs text-foreground/60">Trade TIVs</p>
            </div>
          </div>

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
