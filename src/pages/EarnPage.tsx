import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Play, Gamepad2, Users, ArrowRight, Clock, DollarSign } from "lucide-react";

const EarnPage = () => {
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
              <div className="text-3xl font-bold text-gradient-hero mb-2">$157</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Watch Videos */}
            <div className="earning-card p-8 hover-lift">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Watch Videos</h3>
              <p className="text-foreground/70 mb-6">
                Earn money by watching sponsored videos and advertisements. The longer the video, the more you earn.
              </p>

              {/* Video Types */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Regular Videos</h4>
                    <p className="text-sm text-foreground/60">15-30 seconds each</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">$0.05 - $0.15</div>
                    <div className="text-xs text-foreground/60">per video</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Premium Videos</h4>
                    <p className="text-sm text-foreground/60">1-2 minutes each</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">$0.10 - $0.30</div>
                    <div className="text-xs text-foreground/60">per video</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Survey Videos</h4>
                    <p className="text-sm text-foreground/60">2-5 minutes + survey</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">$0.25 - $0.75</div>
                    <div className="text-xs text-foreground/60">per video</div>
                  </div>
                </div>
              </div>

              <Button variant="earnings" className="w-full" size="lg">
                Watch Now
                <Play className="w-4 h-4" />
              </Button>
            </div>

            {/* Play Games */}
            <div className="earning-card p-8 hover-lift">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-6">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Play Games</h3>
              <p className="text-foreground/70 mb-6">
                Play casual games and complete achievements to earn rewards. The more you play, the more you earn!
              </p>

              {/* Game Types */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Bubble Shooter</h4>
                    <p className="text-sm text-foreground/60">Match 3 game</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">$0.05</div>
                    <div className="text-xs text-foreground/60">per level</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Word Master</h4>
                    <p className="text-sm text-foreground/60">Word puzzle game</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">$0.10</div>
                    <div className="text-xs text-foreground/60">per puzzle</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Racing Fever</h4>
                    <p className="text-sm text-foreground/60">Arcade racing</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">$0.15</div>
                    <div className="text-xs text-foreground/60">per race</div>
                  </div>
                </div>
              </div>

              <Button variant="earnings" className="w-full" size="lg">
                Play Now
                <Gamepad2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Affiliate Marketing */}
            <div className="earning-card p-8 hover-lift">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Affiliate Marketing</h3>
              <p className="text-foreground/70 mb-6">
                Promote products and earn commission on every sale. Higher subscription tiers unlock better commission rates.
              </p>

              {/* Commission Rates */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Free Tier</h4>
                    <p className="text-sm text-foreground/60">Basic offers</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">5%</div>
                    <div className="text-xs text-foreground/60">commission</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Premium Tier</h4>
                    <p className="text-sm text-foreground/60">Premium offers</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">15%</div>
                    <div className="text-xs text-foreground/60">commission</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-card">
                  <div>
                    <h4 className="font-medium">Enterprise Tier</h4>
                    <p className="text-sm text-foreground/60">VIP offers</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-profitiv-teal">20%</div>
                    <div className="text-xs text-foreground/60">commission</div>
                  </div>
                </div>
              </div>

              <Button variant="earnings" className="w-full" size="lg">
                Start Promoting
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center glass-card p-12 glow-pulse">
            <h2 className="text-3xl font-bold mb-4">
              Ready to <span className="text-gradient-hero">Maximize Your Earnings?</span>
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Combine all earning methods to reach your full potential. Our top earners make over $500/month!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button variant="gradient" size="lg">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
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