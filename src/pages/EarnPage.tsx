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

            {/* Community Pools */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-6 h-6 text-profitiv-purple" />
                <h2 className="text-3xl font-bold">Community Pools</h2>
                <span className="text-sm text-profitiv-purple font-medium">Group Campaigns</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Participation Pools */}
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
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">Video Participation Pools</h3>
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
                            Participate & Learn
                          </div>
                          <div className="text-xs text-foreground/50">1-2 weeks</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">Learning Pools</h3>
                      <p className="text-sm text-foreground/60 mb-6 line-clamp-2">
                        Users participate together in community learning campaigns. When enough people finish the course, everyone doubles their rewards.
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