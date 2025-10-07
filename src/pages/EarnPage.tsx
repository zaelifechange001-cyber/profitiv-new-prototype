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
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Deposit & Watch Videos */}
                <Link to="/videos" className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-600/10 border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl -translate-y-8 translate-x-8" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-medium text-blue-400">
                          Instant Pay
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Watch Videos</h3>
                      <p className="text-sm text-foreground/60 mb-6 line-clamp-2">
                        Deposit money, watch sponsored videos, and earn cash instantly once the video is completed.
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gradient-hero">$0.05-$0.50</div>
                          <div className="text-xs text-foreground/50">per video</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-blue-400 group-hover:translate-x-1 transition-transform">
                          <span className="font-medium">Start</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Spin to Win */}
                <Link to="/spin-to-win" className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-600/10 border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl -translate-y-8 translate-x-8" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-medium text-purple-400">
                          Daily Rewards
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Spin-to-Win</h3>
                      <p className="text-sm text-foreground/60 mb-6 line-clamp-2">
                        Log in daily to spin the Profitiv Wheel for random prizes (TIVs). Track your streak for doubled rewards!
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gradient-hero">1-10 TIVs</div>
                          <div className="text-xs text-foreground/50">per spin</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-purple-400 group-hover:translate-x-1 transition-transform">
                          <span className="font-medium">Spin</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Learn & Earn */}
                <Link to="/learn-earn" className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-teal-500/10 to-green-600/10 border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300 hover:scale-[1.02] h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-teal-600/20 rounded-full blur-3xl -translate-y-8 translate-x-8" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg shadow-green-500/30">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-medium text-green-400">
                          Quick Win
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">Learn & Earn</h3>
                      <p className="text-sm text-foreground/60 mb-6 line-clamp-2">
                        Complete short learning modules or quizzes. Instantly earn cash upon completion.
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gradient-hero">$0.10-$1.00</div>
                          <div className="text-xs text-foreground/50">per module</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-400 group-hover:translate-x-1 transition-transform">
                          <span className="font-medium">Learn</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Community Pools */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-6 h-6 text-profitiv-purple" />
                <h2 className="text-3xl font-bold">Community Pools</h2>
                <span className="text-sm text-profitiv-purple font-medium">Group Campaigns</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Investment Pools */}
                <Link to="/pools/video" className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-cyan-600/10 border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300 hover:scale-[1.02] h-full">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-tl from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-cyan-500/30">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs font-medium text-cyan-400">
                            Group Earn
                          </div>
                          <div className="text-xs text-foreground/50">24-48h</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">Video Investment Pools</h3>
                      <p className="text-sm text-foreground/60 mb-6 line-clamp-2">
                        Join other users in funding a video campaign. Once the community reaches the target views, your deposit flips into profit.
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gradient-hero">2x-3x</div>
                          <div className="text-xs text-foreground/50">returns</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-cyan-400 group-hover:translate-x-1 transition-transform">
                          <span className="font-medium">Join</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Collaboration Pools */}
                <Link to="/pools/collaboration" className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-600/10 border border-indigo-500/20 p-6 hover:border-indigo-500/40 transition-all duration-300 hover:scale-[1.02] h-full">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-tl from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-medium text-indigo-400">
                            Team Up
                          </div>
                          <div className="text-xs text-foreground/50">48-72h</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">Collaboration Pools</h3>
                      <p className="text-sm text-foreground/60 mb-6 line-clamp-2">
                        Work together by pooling deposits. When enough users join the pool, it flips into higher returns for everyone.
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gradient-hero">2x-4x</div>
                          <div className="text-xs text-foreground/50">returns</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-indigo-400 group-hover:translate-x-1 transition-transform">
                          <span className="font-medium">Join</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Jackpot Pools */}
                <Link to="/pools/jackpot" className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-600/10 border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02] h-full">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-tl from-orange-500/20 to-red-600/20 rounded-full blur-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs font-medium text-orange-400">
                            Win Big
                          </div>
                          <div className="text-xs text-foreground/50">Monthly</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">Jackpot Pools</h3>
                      <p className="text-sm text-foreground/60 mb-6 line-clamp-2">
                        Deposit money into the monthly jackpot pool. Winners are drawn from all participants when the target is hit.
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gradient-hero">$10k</div>
                          <div className="text-xs text-foreground/50">prize pool</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-orange-400 group-hover:translate-x-1 transition-transform">
                          <span className="font-medium">Enter</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Learning Pools */}
                <Link to="/pools/learning" className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-emerald-600/10 border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] h-full">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-tl from-emerald-500/20 to-green-600/20 rounded-full blur-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-400">
                            Invest & Learn
                          </div>
                          <div className="text-xs text-foreground/50">1-2 weeks</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">Learning Pools</h3>
                      <p className="text-sm text-foreground/60 mb-6 line-clamp-2">
                        Users invest together in community learning campaigns. When enough people finish the course, everyone doubles their investment.
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gradient-hero">2x</div>
                          <div className="text-xs text-foreground/50">returns</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-emerald-400 group-hover:translate-x-1 transition-transform">
                          <span className="font-medium">Join</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Marketplace */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <CoinsIcon className="w-6 h-6 text-warning" />
                <h2 className="text-3xl font-bold">Marketplace</h2>
                <span className="text-sm text-warning font-medium">TIV Exchange</span>
              </div>
              
              <Link to="/marketplace" className="group max-w-3xl mx-auto block">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-yellow-600/10 border border-yellow-500/20 p-8 hover:border-yellow-500/40 transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-yellow-500/20 to-orange-600/20 rounded-full blur-3xl -translate-y-32" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg shadow-yellow-500/30">
                          <CoinsIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold group-hover:text-yellow-400 transition-colors">TIV Marketplace</h3>
                          <p className="text-sm text-foreground/50">Trade TIVs for real cash</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs font-medium text-yellow-400">
                        Live Trading
                      </div>
                    </div>
                    
                    <p className="text-foreground/70 mb-8 max-w-2xl">
                      Earn TIVs from other services, then sell your TIVs to other users in a live bid/ask system. Convert TIVs to cash once another user buys them.
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="text-xl font-bold text-gradient-hero">Instant</div>
                        <div className="text-xs text-foreground/50 mt-1">Exchange</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="text-xl font-bold text-gradient-hero">Live</div>
                        <div className="text-xs text-foreground/50 mt-1">Market</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="text-xl font-bold text-gradient-hero">24/7</div>
                        <div className="text-xs text-foreground/50 mt-1">Trading</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-6 text-yellow-400 group-hover:translate-x-1 transition-transform">
                      <span className="font-medium">Visit Marketplace</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
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