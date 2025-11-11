import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Play, Users, Zap } from "lucide-react";
import { memo } from "react";

const HeroSectionComponent = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-8 md:pt-36 md:pb-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-profitiv-purple/10 to-profitiv-teal/10" />
      <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-profitiv-purple/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-profitiv-teal/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left space-y-5 md:space-y-7">
            {/* Hero Badge */}
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2.5 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-medium text-success">Live Now - Join 10,000+ Active Earners</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground">
                Earn From the Brands You Help Grow
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                Watch, learn, and engage with real creators and brands. Every interaction moves campaigns forward — and every milestone earns you TIV rewards.
              </p>
              <p className="text-sm sm:text-base text-foreground/60 italic max-w-3xl mx-auto lg:mx-0">
                Your time. Your engagement. Your Profitiv.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-hero">$2.4M+</div>
                <div className="text-xs text-foreground/60">Paid Out</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-hero">50K+</div>
                <div className="text-xs text-foreground/60">Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-hero">24/7</div>
                <div className="text-xs text-foreground/60">Available</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
              <Button variant="hero" size="hero" className="group w-full sm:w-auto min-h-[52px]" onClick={() => window.location.href = '/auth'}>
                Start Earning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="glass" size="hero" className="w-full sm:w-auto min-h-[52px]" onClick={(e) => e.preventDefault()}>
                Watch Demo
                <Play className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Column - Your Earnings Today */}
          <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="max-w-md w-full">
              <div className="glass-card p-6 glow-pulse">
                {/* Header */}
                <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
                  Your Earnings <span className="text-foreground/60">Today</span>
                </h2>

                {/* Available Balance */}
                <div className="glass-card p-5 mb-5 bg-gradient-to-br from-profitiv-purple/20 to-profitiv-teal/20">
                  <div className="text-center">
                    <p className="text-sm text-foreground/60 mb-2">Available Balance</p>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">$43.22</div>
                    <div className="text-sm text-profitiv-teal font-medium">+$5.25 today</div>
                  </div>
                </div>

                {/* Earning Methods */}
                <div className="mb-5">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3">Earning Methods</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-background/10 backdrop-blur-sm min-h-[48px]">
                      <div className="flex items-center space-x-3">
                        <Play className="w-5 h-5 text-profitiv-teal flex-shrink-0" />
                        <span className="text-white text-sm md:text-base">Videos</span>
                      </div>
                      <span className="text-profitiv-teal font-semibold text-sm md:text-base">$3.50</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-background/10 backdrop-blur-sm min-h-[48px]">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-profitiv-teal flex-shrink-0" />
                        <span className="text-white text-sm md:text-base">Games</span>
                      </div>
                      <span className="text-profitiv-teal font-semibold text-sm md:text-base">$1.75</span>
                    </div>
                  </div>
                </div>

                {/* Withdraw Button */}
                <Button variant="gradient" className="w-full min-h-[48px] text-base" onClick={(e) => e.preventDefault()}>
                  Withdraw Funds
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

HeroSectionComponent.displayName = 'HeroSection';

const HeroSection = memo(HeroSectionComponent);

export default HeroSection;