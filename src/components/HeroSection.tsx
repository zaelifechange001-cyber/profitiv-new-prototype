import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Play, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-profitiv-purple/10 to-profitiv-teal/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-profitiv-purple/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-profitiv-teal/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success">Live Now - Join 10,000+ Active Earners</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gradient-hero">Earn Money</span>
              <br />
              <span className="text-foreground">Online Today</span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Transform your spare time into real income. Watch videos, play games, and build your affiliate network with Profitiv's revolutionary earning platform.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-hero">$2.4M+</div>
              <div className="text-sm text-foreground/60">Total Paid Out</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-hero">50K+</div>
              <div className="text-sm text-foreground/60">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-hero">24/7</div>
              <div className="text-sm text-foreground/60">Earning Opportunities</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button variant="hero" size="hero" className="group">
              Start Earning Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="hero">
              Watch Demo
              <Play className="w-5 h-5" />
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="glass-card p-6 hover-lift">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Watch & Earn</h3>
              <p className="text-foreground/70">Earn $0.01-$0.30 per video by watching sponsored content and advertisements.</p>
            </div>

            <div className="glass-card p-6 hover-lift">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-profitiv-teal to-profitiv-purple flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Game Rewards</h3>
              <p className="text-foreground/70">Play casual games and earn $0.05-$0.50 per completed level or achievement.</p>
            </div>

            <div className="glass-card p-6 hover-lift">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Affiliate Network</h3>
              <p className="text-foreground/70">Build your network and earn up to 20% commission on referral activities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;