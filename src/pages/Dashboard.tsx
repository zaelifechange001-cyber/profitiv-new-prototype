import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  Play, 
  Users, 
  ArrowUpRight,
  Clock,
  CheckCircle,
  Activity,
  Sparkles,
  GraduationCap,
  Video,
  Zap,
  Trophy,
  BookOpen,
  CoinsIcon,
  LogOut,
  Wallet
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  total_earned: number;
  available_balance: number;
  tiv_balance: number;
  tiv_to_usd_rate: number;
  created_at: string;
  updated_at: string;
}

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  amount: number | null;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserData = async (userId: string, isMounted: () => boolean) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!isMounted()) return;
      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!isMounted()) return;
      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      if (isMounted()) {
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    const isMounted = () => mounted;

    // Set up auth state listener FIRST
    let redirectTimer: number | undefined;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      // Debug: track auth events
      console.log('[Auth] onAuthStateChange', { event, hasUser: !!session?.user });

      if (session?.user) {
        // We have a session — cancel any pending redirect
        if (redirectTimer) clearTimeout(redirectTimer);
        setUser(session.user);
        // Defer the data fetch to avoid blocking auth flow
        setTimeout(() => {
          if (mounted) fetchUserData(session.user!.id, isMounted);
        }, 0);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        if (redirectTimer) clearTimeout(redirectTimer);
        navigate("/auth");
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('[Auth] getSession', { hasUser: !!session?.user });
      if (session?.user) {
        if (redirectTimer) clearTimeout(redirectTimer);
        setUser(session.user);
        fetchUserData(session.user.id, isMounted);
        setLoading(false);
      } else {
        // IMPORTANT: Don't redirect immediately — allow OAuth callback to finalize
        // Give the client a short window to process the provider redirect tokens
        redirectTimer = window.setTimeout(() => {
          if (!mounted) return;
          console.log('[Auth] No session after timeout — redirecting to /auth');
          navigate("/auth");
          setLoading(false);
        }, 3000);
      }
    });


    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
      case 'video watched':
        return Play;
      case 'spin':
      case 'spin to win':
        return Sparkles;
      case 'investment':
        return TrendingUp;
      case 'quiz':
      case 'learning':
        return GraduationCap;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
      case 'video watched':
        return 'text-profitiv-teal';
      case 'spin':
      case 'spin to win':
        return 'text-profitiv-purple';
      case 'investment':
        return 'text-success';
      case 'quiz':
      case 'learning':
        return 'text-secondary';
      default:
        return 'text-foreground';
    }
  };

  const [activeInvestments, setActiveInvestments] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchActiveInvestments = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('pool_participants')
          .select(`
            *,
            pool:community_pools(pool_name, status, goal_amount)
          `)
          .eq('user_id', user.id)
          .order('joined_at', { ascending: false });

        if (!isMounted) return;
        
        if (error) throw error;
        setActiveInvestments(data || []);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchActiveInvestments();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const mockInvestments = [
    {
      amount: "$10.00",
      expectedReturn: "$20.00",
      created: "Jan 12, 2025",
      status: "Active"
    },
    {
      id: "#45678901",
      amount: "$3.00",
      expectedReturn: "$6.00", 
      created: "Jan 10, 2025",
      status: "Pending"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, <span className="text-gradient-hero">{userName}</span>
              </h1>
              <p className="text-sm sm:text-base text-foreground/60">Here's your earning summary for today</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button variant="gradient" size="lg" onClick={() => navigate('/payout-settings')} className="w-full sm:w-auto">
                <Wallet className="w-4 h-4 mr-2" />
                Payout Settings
              </Button>
              <Button variant="outline" size="lg" onClick={handleLogout} className="w-full sm:w-auto">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* USD Balance */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">USD Balance</CardTitle>
                  <DollarSign className="w-4 h-4 text-profitiv-teal" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">
                  ${profile?.available_balance?.toFixed(2) || '0.00'}
                </div>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">
                    +${(activities.reduce((sum, act) => sum + (act.amount || 0), 0)).toFixed(2)}
                  </span>
                  <span className="text-sm text-foreground/60">total</span>
                </div>
                <p className="text-xs text-foreground/50 mt-2">Available for withdrawal</p>
              </CardContent>
            </div>

            {/* TIV Balance */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">TIV Balance</CardTitle>
                  <Wallet className="w-4 h-4 text-profitiv-purple" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">
                  {profile?.tiv_balance?.toFixed(0) || '0'} TIV
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-foreground/60">
                    ≈ ${((profile?.tiv_balance || 0) * (profile?.tiv_to_usd_rate || 0.01)).toFixed(2)} USD
                  </span>
                </div>
                <Button 
                  variant="link" 
                  className="text-xs p-0 h-auto mt-2 text-profitiv-purple"
                  onClick={() => navigate('/payout-settings')}
                >
                  Convert to USD
                </Button>
              </CardContent>
            </div>

            {/* Total Earned */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">Total Earned</CardTitle>
                  <TrendingUp className="w-4 h-4 text-profitiv-purple" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">
                  ${profile?.total_earned?.toFixed(2) || '0.00'}
                </div>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">{activities.length}</span>
                  <span className="text-sm text-foreground/60">activities</span>
                </div>
                <p className="text-xs text-foreground/50 mt-2">Lifetime earnings</p>
              </CardContent>
            </div>

            {/* Total Earned */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">Total Earned</CardTitle>
                  <TrendingUp className="w-4 h-4 text-secondary" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">
                  ${profile?.total_earned?.toFixed(2) || '0.00'}
                </div>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">{activities.length}</span>
                  <span className="text-sm text-foreground/60">activities</span>
                </div>
                <p className="text-xs text-foreground/50 mt-2">Lifetime earnings</p>
              </CardContent>
            </div>

            {/* Subscription */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">Subscription</CardTitle>
                  <Users className="w-4 h-4 text-profitiv-teal" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">Premium</div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">Active</span>
                </div>
                <Button variant="link" className="text-xs p-0 h-auto mt-2 text-profitiv-teal">
                  Upgrade Plan
                </Button>
              </CardContent>
            </div>
          </div>

          {/* Earning Services Quick Access */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Earning Services</h2>
            
            {/* Individual Earnings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-profitiv-teal" />
                Individual Earnings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/videos" className="earning-card p-6 hover-lift block">
                  <Play className="w-8 h-8 text-profitiv-teal mb-3" />
                  <h4 className="font-bold mb-1">Watch Videos</h4>
                  <p className="text-sm text-foreground/60 mb-3">Earn instantly by watching videos</p>
                  <Button variant="earnings" size="sm" className="w-full">
                    Start Watching
                  </Button>
                </Link>
                
                <Link to="/spin-to-win" className="earning-card p-6 hover-lift block">
                  <Sparkles className="w-8 h-8 text-profitiv-purple mb-3" />
                  <h4 className="font-bold mb-1">Spin to Win</h4>
                  <p className="text-sm text-foreground/60 mb-3">Daily wheel spin for TIVs</p>
                  <Button variant="earnings" size="sm" className="w-full">
                    Spin Now
                  </Button>
                </Link>
                
                <Link to="/learn-earn" className="earning-card p-6 hover-lift block">
                  <GraduationCap className="w-8 h-8 text-secondary mb-3" />
                  <h4 className="font-bold mb-1">Learn & Earn</h4>
                  <p className="text-sm text-foreground/60 mb-3">Complete quizzes for rewards</p>
                  <Button variant="earnings" size="sm" className="w-full">
                    Start Learning
                  </Button>
                </Link>
              </div>
            </div>

            {/* Community Pools */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-profitiv-purple" />
                Community Pools
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/pools/video" className="earning-card p-6 hover-lift block">
                  <Video className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-bold mb-1">Video Pools</h4>
                  <p className="text-sm text-foreground/60 mb-3">Group video campaigns</p>
                  <Button variant="earnings" size="sm" className="w-full">
                    Join Pool
                  </Button>
                </Link>
                
                <Link to="/pools/collaboration" className="earning-card p-6 hover-lift block">
                  <Zap className="w-8 h-8 text-profitiv-purple mb-3" />
                  <h4 className="font-bold mb-1">Collaboration</h4>
                  <p className="text-sm text-foreground/60 mb-3">Team investment pools</p>
                  <Button variant="earnings" size="sm" className="w-full">
                    Join Pool
                  </Button>
                </Link>
                
                <Link to="/pools/jackpot" className="earning-card p-6 hover-lift block">
                  <Trophy className="w-8 h-8 text-warning mb-3" />
                  <h4 className="font-bold mb-1">Jackpot</h4>
                  <p className="text-sm text-foreground/60 mb-3">Monthly prize draws</p>
                  <Button variant="earnings" size="sm" className="w-full">
                    Enter Now
                  </Button>
                </Link>
                
                <Link to="/pools/learning" className="earning-card p-6 hover-lift block">
                  <BookOpen className="w-8 h-8 text-secondary mb-3" />
                  <h4 className="font-bold mb-1">Learning Pools</h4>
                  <p className="text-sm text-foreground/60 mb-3">Community courses</p>
                  <Button variant="earnings" size="sm" className="w-full">
                    Join Pool
                  </Button>
                </Link>
              </div>
            </div>

            {/* Marketplace */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CoinsIcon className="w-5 h-5 text-warning" />
                Marketplace
              </h3>
              <Link to="/marketplace" className="earning-card p-6 hover-lift block max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <CoinsIcon className="w-12 h-12 text-warning" />
                  <div>
                    <h4 className="font-bold mb-1">TIV Marketplace</h4>
                    <p className="text-sm text-foreground/60">Trade TIVs for cash</p>
                  </div>
                </div>
                <Button variant="earnings" size="sm" className="w-full">
                  Visit Marketplace
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Investments Table */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Active Investments</h3>
                <Button variant="glass" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {activeInvestments.length > 0 ? (
                  activeInvestments.map((investment) => (
                    <div key={investment.id} className="earning-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{investment.pool?.pool_name || 'Pool'}</h4>
                          <p className="text-sm text-foreground/60">
                            Joined {new Date(investment.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="badge badge-success">
                          {investment.pool?.status || 'Active'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-foreground/60">Investment Amount</p>
                          <p className="font-semibold">${investment.investment_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60">Pool Goal</p>
                          <p className="font-semibold text-success">${investment.pool?.goal_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-foreground/60 py-8">No active investments yet</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <Button variant="glass" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.slice(0, 4).map((activity) => {
                    const Icon = getActivityIcon(activity.activity_type);
                    const color = getActivityColor(activity.activity_type);
                    return (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 earning-card">
                        <div className={`w-10 h-10 rounded-full bg-profitiv-purple/20 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.description}</h4>
                          <p className="text-sm text-foreground/60">
                            {new Date(activity.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        {activity.amount && (
                          <div className="text-right">
                            <p className="font-semibold text-gradient-hero">
                              ${activity.amount.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-foreground/60">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No activities yet</p>
                    <p className="text-sm">Start earning to see your activity here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;