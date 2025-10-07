import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Play, Users, ArrowRight, Clock, DollarSign, Sparkles, GraduationCap, Video, Zap, Trophy, BookOpen, CoinsIcon, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const EarnPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">Earning Methods</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Choose your favorite way to earn or combine multiple methods to maximize your income potential.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient-hero mb-2">$3,000+</div>
              <p className="text-foreground/60">Average monthly earnings</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient-hero mb-2">24/7</div>
              <p className="text-foreground/60">Earning opportunities</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient-hero mb-2">Instant</div>
              <p className="text-foreground/60">Account setup</p>
            </div>
          </div>

          {/* Earning Methods */}
          <div className="space-y-16">
            {/* Individual Earnings */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-profitiv-teal" />
                <h2 className="text-3xl font-bold">Individual Earnings</h2>
                <span className="text-sm text-profitiv-teal font-medium">Instant Rewards</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Deposit & Watch Videos */}
                <div className="earning-card p-8 hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Deposit & Watch Videos</h3>
                  <p className="text-foreground/70 mb-6">
                    Deposit money, watch sponsored videos, and earn cash instantly once the video is completed.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 glass-card">
                      <div>
                        <h4 className="font-medium">Earnings</h4>
                        <p className="text-sm text-foreground/60">Per video</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-profitiv-teal">$0.05 - $0.50</div>
                      </div>
                    </div>
                  </div>

                  <Link to="/videos">
                    <Button variant="earnings" className="w-full" size="lg">
                      Start Watching
                      <Play className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Spin to Win */}
                <div className="earning-card p-8 hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Spin-to-Win</h3>
                  <p className="text-foreground/70 mb-6">
                    Log in daily to spin the Profitiv Wheel for random prizes (TIVs). Track your streak for doubled rewards!
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 glass-card">
                      <div>
                        <h4 className="font-medium">Prize Range</h4>
                        <p className="text-sm text-foreground/60">Per spin</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-profitiv-teal">1-10 TIVs</div>
                      </div>
                    </div>
                  </div>

                  <Link to="/spin-to-win">
                    <Button variant="earnings" className="w-full" size="lg">
                      Spin Now
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Learn & Earn */}
                <div className="earning-card p-8 hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-6">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Learn & Earn</h3>
                  <p className="text-foreground/70 mb-6">
                    Complete short learning modules or quizzes. Instantly earn money or TIVs upon completion.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 glass-card">
                      <div>
                        <h4 className="font-medium">Earnings</h4>
                        <p className="text-sm text-foreground/60">Per module</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-profitiv-teal">$0.10 - $1.00</div>
                      </div>
                    </div>
                  </div>

                  <Link to="/learn-earn">
                    <Button variant="earnings" className="w-full" size="lg">
                      Start Learning
                      <GraduationCap className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Community Pools */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-6 h-6 text-profitiv-purple" />
                <h2 className="text-3xl font-bold">Community Pools</h2>
                <span className="text-sm text-profitiv-purple font-medium">Group Campaigns</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video Investment Pools */}
                <div className="earning-card p-8 hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Video Investment Pools</h3>
                  <p className="text-foreground/70 mb-6">
                    Join other users in funding a video campaign. Once the community reaches the target views, your deposit flips into profit.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 glass-card">
                      <div>
                        <h4 className="font-medium">Returns</h4>
                        <p className="text-sm text-foreground/60">On completion</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-profitiv-teal">2x - 3x</div>
                      </div>
                    </div>
                  </div>

                  <Link to="/pools/video">
                    <Button variant="earnings" className="w-full" size="lg">
                      Join Pool
                      <Video className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Collaboration Pools */}
                <div className="earning-card p-8 hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Collaboration Pools</h3>
                  <p className="text-foreground/70 mb-6">
                    Work together by pooling deposits. When enough users join the pool, it flips into higher returns for everyone.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 glass-card">
                      <div>
                        <h4 className="font-medium">Returns</h4>
                        <p className="text-sm text-foreground/60">On completion</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-profitiv-teal">2x - 4x</div>
                      </div>
                    </div>
                  </div>

                  <Link to="/pools/collaboration">
                    <Button variant="earnings" className="w-full" size="lg">
                      Join Pool
                      <Zap className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Jackpot Pools */}
                <div className="earning-card p-8 hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Jackpot Pools</h3>
                  <p className="text-foreground/70 mb-6">
                    Deposit money into the monthly jackpot pool. Winners are drawn from all participants when the target is hit.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 glass-card">
                      <div>
                        <h4 className="font-medium">Prize</h4>
                        <p className="text-sm text-foreground/60">Monthly</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-profitiv-teal">Up to $10k</div>
                      </div>
                    </div>
                  </div>

                  <Link to="/pools/jackpot">
                    <Button variant="earnings" className="w-full" size="lg">
                      Enter Now
                      <Trophy className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Learning Pools */}
                <div className="earning-card p-8 hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Learning Pools</h3>
                  <p className="text-foreground/70 mb-6">
                    Users invest together in community learning campaigns. When enough people finish the course, everyone doubles their investment.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 glass-card">
                      <div>
                        <h4 className="font-medium">Returns</h4>
                        <p className="text-sm text-foreground/60">On completion</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-profitiv-teal">2x</div>
                      </div>
                    </div>
                  </div>

                  <Link to="/pools/learning">
                    <Button variant="earnings" className="w-full" size="lg">
                      Join Pool
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Marketplace */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <CoinsIcon className="w-6 h-6 text-warning" />
                <h2 className="text-3xl font-bold">Marketplace</h2>
                <span className="text-sm text-warning font-medium">TIV Exchange</span>
              </div>
              
              <div className="earning-card p-8 hover-lift max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-6">
                  <CoinsIcon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">TIV Bidding Marketplace</h3>
                <p className="text-foreground/70 mb-6">
                  Earn TIVs from other services. Sell your TIVs to other users in a live bid/ask system. Converts TIVs into cash instantly once another user buys them.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 glass-card">
                    <div>
                      <h4 className="font-medium">Exchange Type</h4>
                      <p className="text-sm text-foreground/60">TIVs to Cash</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-profitiv-teal">Instant</div>
                    </div>
                  </div>
                </div>

                <Link to="/marketplace">
                  <Button variant="earnings" className="w-full" size="lg">
                    Visit Marketplace
                    <CoinsIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center glass-card p-12 glow-pulse">
            <h2 className="text-3xl font-bold mb-4">
              Ready to <span className="text-gradient-hero">Maximize Your Earnings?</span>
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Combine all earning methods to reach your full potential. Start with individual earnings and grow with community pools!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/dashboard">
                <Button variant="gradient" size="lg">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="glass" size="lg">
                View Subscription Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnPage;