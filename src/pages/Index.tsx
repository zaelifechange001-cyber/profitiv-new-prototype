import { useState, useEffect, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import EarningMethods from "@/components/EarningMethods";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import Navigation from "@/components/Navigation";
import HowItWorksEarners from "@/components/HowItWorksEarners";
import HowItWorksCreators from "@/components/HowItWorksCreators";
import EarnerDashboard from "@/components/EarnerDashboard";
import CreatorDashboard from "@/components/CreatorDashboard";
import EarnerDashboardPreview from "@/components/EarnerDashboardPreview";
import CreatorDashboardPreview from "@/components/CreatorDashboardPreview";
import TIVMarketplace from "@/components/TIVMarketplace";
import SustainabilitySection from "@/components/SustainabilitySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CreatorBenefits from "@/components/CreatorBenefits";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CheckCircle, Video, Zap, GraduationCap, Users, Trophy, CoinsIcon, Play, BookOpen, DollarSign, Rocket, Target, BarChart3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useProfitivPulse } from "@/components/ProfitivPulse";

const testimonials = [
  {
    name: "James Wilson",
    role: "Premium Member",
    avatar: "JW",
    earnings: "$2,184",
    method: "Video watching",
    quote: "I've been using Profitiv for 6 months and have already earned over $2,000 just by watching videos and playing games in my spare time. The payouts are always on time!"
  },
  {
    name: "Sarah Chen",
    role: "Enterprise Member", 
    avatar: "SC",
    earnings: "$3,950",
    method: "Affiliate marketing",
    quote: "The affiliate program is fantastic! As a Premium subscriber, I get access to higher-paying affiliate offers. I've already referred 20 friends and earn passive income from their activity."
  },
  {
    name: "Mike Rodriguez",
    role: "Basic Member",
    avatar: "MR", 
    earnings: "$1,247",
    method: "Game rewards",
    quote: "Playing games and earning money? It sounds too good to be true, but Profitiv delivers. I've made over $1,200 in just 3 months during my lunch breaks."
  }
];

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get role from URL params or default to "earner" - memoized for performance
  const activeRole = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get("role") as "earner" | "creator" | null;
    return roleParam && (roleParam === "earner" || roleParam === "creator") ? roleParam : "earner";
  }, [location.search]);
  
  const triggerPulse = useProfitivPulse();

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen">
      <BackgroundAnimation />
      <Navigation />
      
      {/* Role Switcher Header */}
      <section className="py-6 md:py-8 px-5 text-center cv-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient-hero">Profitiv Pulse</span>
        </h1>
        <p className="text-sm md:text-base text-foreground/60 mb-5">Creators • Brands • Earners</p>
      </section>

      {/* Earner Home */}
      {activeRole === "earner" && (
        <div className="animate-fade-in">
          <HeroSection />

          {/* How It Works */}
          <HowItWorksEarners />

          {/* Earner Dashboard Preview */}
          <EarnerDashboardPreview />

      {/* Service Description Sections */}
      <section className="py-10 md:py-16 px-5 sm:px-6 lg:px-8 bg-background/50 cv-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              How to <span className="text-gradient-hero">Earn Money</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto px-4">
              Multiple ways to turn your time into real cash. Choose what works best for you!
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {/* Watch Videos Service */}
            <div className="glass-card p-5 md:p-8 hover-lift">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">Watch Videos</h3>
                  </div>
                  <p className="text-sm md:text-base text-foreground/80 mb-5">
                    Get paid to watch engaging video content. Each video you complete earns you real money. 
                    The more you watch, the more you earn. Videos range from 30 seconds to 5 minutes.
                  </p>
                  <ul className="space-y-2.5 mb-5">
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Earn $0.05 - $0.25 per video</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>New videos added daily</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>No limit on daily earnings</span>
                    </li>
                  </ul>
                  <Button variant="gradient" size="lg" className="w-full md:w-auto min-h-[48px]" onClick={() => navigate("/auth")}>
                    Start Watching <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <div className="earning-card p-5 md:p-6 bg-gradient-to-br from-profitiv-purple/10 to-profitiv-teal/10">
                  <Play className="w-12 h-12 md:w-16 md:h-16 text-profitiv-purple mb-3 md:mb-4" />
                  <h4 className="text-lg md:text-xl font-bold mb-2">Quick Stats</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Avg. per video:</span>
                      <span className="font-bold">$0.15</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Videos available:</span>
                      <span className="font-bold">500+</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Daily potential:</span>
                      <span className="font-bold text-success">$50+</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spin to Win Service */}
            <div className="glass-card p-5 md:p-8 hover-lift">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div className="order-2 md:order-1 earning-card p-5 md:p-6 bg-gradient-to-br from-secondary/10 to-warning/10">
                  <Zap className="w-12 h-12 md:w-16 md:h-16 text-warning mb-3 md:mb-4" />
                  <h4 className="text-lg md:text-xl font-bold mb-2">Prize Pool</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Min reward:</span>
                      <span className="font-bold">10 TIV</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Max reward:</span>
                      <span className="font-bold">1000 TIV</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Cooldown:</span>
                      <span className="font-bold text-warning">24 hours</span>
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-warning to-secondary flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">Spin to Win</h3>
                  </div>
                  <p className="text-sm md:text-base text-foreground/80 mb-5">
                    Spin the wheel once every 24 hours for a chance to win TIV tokens! 
                    Build a 100-day streak to DOUBLE all your spin rewards. Every spin is guaranteed to win.
                  </p>
                  <ul className="space-y-2.5 mb-5">
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>100% win rate - always get rewards</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Build streaks for 2x multipliers</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Win up to 1000 TIV per spin</span>
                    </li>
                  </ul>
                  <Button variant="gradient" size="lg" className="w-full md:w-auto min-h-[48px]" onClick={() => navigate("/auth")}>
                    Try Your Luck <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Learn & Earn Service */}
            <div className="glass-card p-5 md:p-8 hover-lift">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-secondary to-profitiv-purple flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">Learn & Earn</h3>
                  </div>
                  <p className="text-sm md:text-base text-foreground/80 mb-5">
                    Complete educational courses and quizzes to earn money. Expand your knowledge while 
                    building your bank account. Courses cover topics from finance to technology.
                  </p>
                  <ul className="space-y-2.5 mb-5">
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Earn $1-$10 per completed course</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Courses take 10-30 minutes</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Pass quiz to claim rewards</span>
                    </li>
                  </ul>
                  <Button variant="gradient" size="lg" className="w-full md:w-auto min-h-[48px]" onClick={() => navigate("/auth")}>
                    Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <div className="earning-card p-5 md:p-6 bg-gradient-to-br from-secondary/10 to-profitiv-purple/10">
                  <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-secondary mb-3 md:mb-4" />
                  <h4 className="text-lg md:text-xl font-bold mb-2">Course Library</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Available courses:</span>
                      <span className="font-bold">50+</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Categories:</span>
                      <span className="font-bold">12</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Avg. reward:</span>
                      <span className="font-bold text-success">$5.00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TIV Marketplace */}
            <div className="glass-card p-5 md:p-8 hover-lift">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div className="order-2 md:order-1 earning-card p-5 md:p-6 bg-gradient-to-br from-warning/10 to-profitiv-teal/10">
                  <CoinsIcon className="w-12 h-12 md:w-16 md:h-16 text-warning mb-3 md:mb-4" />
                  <h4 className="text-lg md:text-xl font-bold mb-2">Market Info</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Current rate:</span>
                      <span className="font-bold">$0.02/TIV</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Trading fee:</span>
                      <span className="font-bold">2%</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-foreground/60">Instant trades:</span>
                      <span className="font-bold text-success">Yes</span>
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-warning to-profitiv-teal flex items-center justify-center flex-shrink-0">
                      <CoinsIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">TIV Marketplace</h3>
                  </div>
                  <p className="text-sm md:text-base text-foreground/80 mb-5">
                    Trade TIV tokens with other users for real cash. Set your own prices or buy at market rate. 
                    TIVs earned from activities can be traded with the community.
                  </p>
                  <ul className="space-y-2.5 mb-5">
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Buy & sell TIV tokens instantly</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Set custom prices or use market rate</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Low 2% marketplace fee</span>
                    </li>
                  </ul>
                  <Button variant="gradient" size="lg" className="w-full md:w-auto min-h-[48px]" onClick={() => navigate("/auth")}>
                    Visit Marketplace <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earning Methods */}
      <EarningMethods />

      {/* Earner Dashboard */}
      <EarnerDashboard />

      {/* TIV Marketplace for Earners */}
      <TIVMarketplace role="earner" />

      {/* How Profitiv Sustains Growth */}
      <SustainabilitySection />

      {/* Testimonials */}
      <TestimonialsSection 
        role="earner"
        testimonials={[
          { quote: "I love that Profitiv pays out quickly and the tasks are straightforward.", author: "Kayla" },
          { quote: "Marketplace made it easy for me to turn TIVs into cash.", author: "Jon" }
        ]}
        ctaText="Ready to start earning?"
        ctaLink="/auth"
      />

      <SubscriptionPlans />
        </div>
      )}

      {/* Creator Home */}
      {activeRole === "creator" && (
        <div className="animate-fade-in">
          {/* Creator Hero */}
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
                    <span className="text-xs md:text-sm font-medium text-success">Live Now - Join 1,000+ Active Creators</span>
                  </div>

                  {/* Main Headline */}
                  <div className="space-y-3 md:space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground">
                      Where Your Content Works Harder — Powered by Real Engagement
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                      Launch campaigns that don't just get views — they build momentum. Profitiv connects your brand with earners who turn attention into real impact.
                    </p>
                    <p className="text-sm sm:text-base text-foreground/60 italic max-w-3xl mx-auto lg:mx-0">
                      Start a campaign → Grow your reach → Reward engagement.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
                    <div className="text-center lg:text-left">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-hero">$500K+</div>
                      <div className="text-xs text-foreground/60">Revenue Share</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-hero">5K+</div>
                      <div className="text-xs text-foreground/60">Creators</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-hero">24/7</div>
                      <div className="text-xs text-foreground/60">Support</div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
                    <Button variant="hero" size="hero" className="group w-full sm:w-auto min-h-[52px]" onClick={() => window.location.href = '/auth'}>
                      Launch Your Campaign
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="glass" size="hero" className="w-full sm:w-auto min-h-[52px]" onClick={(e) => e.preventDefault()}>
                      Watch Demo
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Right Column - Campaign Dashboard */}
                <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
                  <div className="max-w-md w-full">
                    <div className="glass-card p-6 glow-pulse">
                      {/* Header */}
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
                        Your Campaign <span className="text-foreground/60">Dashboard</span>
                      </h2>

                      {/* Active Campaigns */}
                      <div className="glass-card p-5 mb-5 bg-gradient-to-br from-profitiv-purple/20 to-profitiv-teal/20">
                        <div className="text-center">
                          <p className="text-sm text-foreground/60 mb-2">Active Campaigns</p>
                          <div className="text-3xl md:text-4xl font-bold text-white mb-1">8</div>
                          <div className="text-sm text-profitiv-teal font-medium">+3 this week</div>
                        </div>
                      </div>

                      {/* Campaign Stats */}
                      <div className="mb-5">
                        <h3 className="text-base md:text-lg font-semibold text-white mb-3">Campaign Stats</h3>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between p-3.5 rounded-lg bg-background/10 backdrop-blur-sm min-h-[48px]">
                            <div className="flex items-center space-x-3">
                              <BarChart3 className="w-5 h-5 text-profitiv-teal flex-shrink-0" />
                              <span className="text-white text-sm md:text-base">Total Views</span>
                            </div>
                            <span className="text-profitiv-teal font-semibold text-sm md:text-base">125K</span>
                          </div>
                          <div className="flex items-center justify-between p-3.5 rounded-lg bg-background/10 backdrop-blur-sm min-h-[48px]">
                            <div className="flex items-center space-x-3">
                              <Users className="w-5 h-5 text-profitiv-teal flex-shrink-0" />
                              <span className="text-white text-sm md:text-base">Engaged Users</span>
                            </div>
                            <span className="text-profitiv-teal font-semibold text-sm md:text-base">92%</span>
                          </div>
                        </div>
                      </div>

                      {/* View Dashboard Button */}
                      <Button variant="gradient" className="w-full min-h-[48px] text-base" onClick={(e) => e.preventDefault()}>
                        View Full Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* TIV Marketplace for Creators */}
          <TIVMarketplace role="creator" />

          {/* How Profitiv Sustains Growth */}
          <SustainabilitySection />

          {/* How It Works for Creators */}
          <HowItWorksCreators />

          {/* Creator Dashboard Preview */}
          <CreatorDashboardPreview />

          {/* Creator Dashboard */}
          <CreatorDashboard />

          {/* Why Creators Choose Profitiv */}
          <CreatorBenefits />

          {/* Testimonials */}
          <TestimonialsSection 
            role="creator"
            testimonials={[
              { quote: "Profitiv created measurable lift for our launch.", author: "Maya, Founder" },
              { quote: "Campaigns finished faster with better engagement.", author: "Aaron, Creator" }
            ]}
            ctaText="Ready to launch your first campaign?"
            ctaLink="/creators"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="glass-card border-t py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold text-gradient-hero">Profitiv</span>
              </div>
              <p className="text-sm sm:text-base text-foreground/60 mb-4 max-w-md">
                Transform your spare time into real income with Profitiv's revolutionary earning platform.
              </p>
              <p className="text-xs sm:text-sm text-foreground/50">
                © 2024 Profitiv. All rights reserved.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-2 text-sm sm:text-base text-foreground/60">
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Earn Money</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Affiliates</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Pools</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-sm sm:text-base text-foreground/60">
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
