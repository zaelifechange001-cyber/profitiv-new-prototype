import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Play, Users, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 md:pt-24 md:pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-profitiv-purple/10 to-profitiv-teal/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-profitiv-purple/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-profitiv-teal/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left space-y-6 md:space-y-8">
            {/* Hero Badge */}
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium text-success">Live Now - Join 10,000+ Active Earners</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-gradient-hero">Earn Money</span>
                <br />
                <span className="text-foreground">Online Today</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-foreground/80 max-w-3xl leading-relaxed">
                Transform your spare time into real income through Watch Videos, Spin to Win, Learn & Earn, TIV Marketplace, and Community Pools - your complete earning ecosystem.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-12">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-hero">$2.4M+</div>
                <div className="text-xs sm:text-sm text-foreground/60">Total Paid Out</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-hero">50K+</div>
                <div className="text-xs sm:text-sm text-foreground/60">Active Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-hero">24/7</div>
                <div className="text-xs sm:text-sm text-foreground/60">Earning Opportunities</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Button variant="hero" size="hero" className="group" onClick={() => window.location.href = '/auth'}>
                Start Earning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="glass" size="hero">
                Watch Demo
                <Play className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Column - Your Earnings Today */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-md w-full">
              <div className="glass-card p-5 sm:p-6 glow-pulse">
                {/* Header */}
                <h2 className="text-2xl font-bold text-white mb-6">
                  Your Earnings <span className="text-foreground/60">Today</span>
                </h2>

                {/* Available Balance */}
                <div className="glass-card p-6 mb-6 bg-gradient-to-br from-profitiv-purple/20 to-profitiv-teal/20">
                  <div className="text-center">
                    <p className="text-foreground/60 mb-2">Available Balance</p>
                    <div className="text-4xl font-bold text-white mb-2">$43.22</div>
                    <div className="text-profitiv-teal font-medium">+$5.25 today</div>
                  </div>
                </div>

                {/* Earning Methods */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Earning Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <Play className="w-5 h-5 text-profitiv-teal" />
                        <span className="text-white">Videos</span>
                      </div>
                      <span className="text-profitiv-teal font-semibold">$3.50</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-profitiv-teal" />
                        <span className="text-white">Games</span>
                      </div>
                      <span className="text-profitiv-teal font-semibold">$1.75</span>
                    </div>
                  </div>
                </div>

                {/* Withdraw Button */}
                <Button variant="gradient" className="w-full">
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

export default HeroSection;