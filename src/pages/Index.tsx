import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import EarningMethods from "@/components/EarningMethods";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CheckCircle, Video, Zap, GraduationCap, Users, Trophy, CoinsIcon, Play, BookOpen, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Service Description Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How to <span className="text-gradient-hero">Earn Money</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Multiple ways to turn your time into real cash. Choose what works best for you!
            </p>
          </div>

          <div className="space-y-16">
            {/* Watch Videos Service */}
            <div className="glass-card p-8 hover-lift">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Watch Videos</h3>
                  </div>
                  <p className="text-foreground/80 mb-6">
                    Get paid to watch engaging video content. Each video you complete earns you real money. 
                    The more you watch, the more you earn. Videos range from 30 seconds to 5 minutes.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Earn $0.05 - $0.25 per video</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>New videos added daily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>No limit on daily earnings</span>
                    </li>
                  </ul>
                  <Button variant="gradient" size="lg" onClick={() => navigate("/auth")}>
                    Start Watching <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <div className="earning-card p-6 bg-gradient-to-br from-profitiv-purple/10 to-profitiv-teal/10">
                  <Play className="w-16 h-16 text-profitiv-purple mb-4" />
                  <h4 className="text-xl font-bold mb-2">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
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
            <div className="glass-card p-8 hover-lift">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 earning-card p-6 bg-gradient-to-br from-secondary/10 to-warning/10">
                  <Zap className="w-16 h-16 text-warning mb-4" />
                  <h4 className="text-xl font-bold mb-2">Prize Pool</h4>
                  <div className="space-y-2 text-sm">
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
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-warning to-secondary flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Spin to Win</h3>
                  </div>
                  <p className="text-foreground/80 mb-6">
                    Spin the wheel once every 24 hours for a chance to win TIV tokens! 
                    Build a 100-day streak to DOUBLE all your spin rewards. Every spin is guaranteed to win.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>100% win rate - always get rewards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Build streaks for 2x multipliers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Win up to 1000 TIV per spin</span>
                    </li>
                  </ul>
                  <Button variant="gradient" size="lg" onClick={() => navigate("/auth")}>
                    Try Your Luck <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Learn & Earn Service */}
            <div className="glass-card p-8 hover-lift">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-profitiv-purple flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Learn & Earn</h3>
                  </div>
                  <p className="text-foreground/80 mb-6">
                    Complete educational courses and quizzes to earn money. Expand your knowledge while 
                    building your bank account. Courses cover topics from finance to technology.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Earn $1-$10 per completed course</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Courses take 10-30 minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Pass quiz to claim rewards</span>
                    </li>
                  </ul>
                  <Button variant="gradient" size="lg" onClick={() => navigate("/auth")}>
                    Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <div className="earning-card p-6 bg-gradient-to-br from-secondary/10 to-profitiv-purple/10">
                  <BookOpen className="w-16 h-16 text-secondary mb-4" />
                  <h4 className="text-xl font-bold mb-2">Course Library</h4>
                  <div className="space-y-2 text-sm">
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
            <div className="glass-card p-8 hover-lift">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 earning-card p-6 bg-gradient-to-br from-warning/10 to-profitiv-teal/10">
                  <CoinsIcon className="w-16 h-16 text-warning mb-4" />
                  <h4 className="text-xl font-bold mb-2">Market Info</h4>
                  <div className="space-y-2 text-sm">
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
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-warning to-profitiv-teal flex items-center justify-center">
                      <CoinsIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">TIV Marketplace</h3>
                  </div>
                  <p className="text-foreground/80 mb-6">
                    Trade TIV tokens with other users for real cash. Set your own prices or buy at market rate. 
                    TIVs earned from activities can be traded with the community.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Buy & sell TIV tokens instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Set custom prices or use market rate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>Low 2% marketplace fee</span>
                    </li>
                  </ul>
                  <Button variant="gradient" size="lg" onClick={() => navigate("/auth")}>
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

      {/* Subscription Plans */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-hero">Price Plans</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Unlock higher earning potential with our premium subscription tiers. Start free and upgrade as you grow.
            </p>
          </div>
          <SubscriptionPlans />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Success <span className="text-gradient-hero">Stories</span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
              Real people, real earnings. See how Profitiv has changed lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className="glass-card p-6 sm:p-8 hover-lift">
                {/* Header */}
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm sm:text-base">{testimonial.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold truncate">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-foreground/60 truncate">{testimonial.role}</p>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-sm sm:text-base text-foreground/80 mb-4 sm:mb-6 italic line-clamp-4">
                  "{testimonial.quote}"
                </blockquote>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-profitiv-purple/20">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gradient-hero">{testimonial.earnings}</div>
                    <div className="text-xs sm:text-sm text-foreground/60">Total Earned</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-medium text-profitiv-teal truncate">{testimonial.method}</div>
                    <div className="flex items-center space-x-1 justify-end mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-profitiv-teal text-profitiv-teal" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 sm:p-8 lg:p-12 text-center glow-pulse">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to <span className="text-gradient-hero">Start Earning?</span>
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Average monthly earnings: <span className="text-gradient-hero font-bold">$3,000+</span> and growing live in real-time!
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                <span className="text-sm sm:text-base text-success font-medium whitespace-nowrap">$5 Sign-up Bonus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                <span className="text-sm sm:text-base text-success font-medium whitespace-nowrap">Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                <span className="text-sm sm:text-base text-success font-medium whitespace-nowrap">No Hidden Fees</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="hero" size="hero" className="group" onClick={() => navigate("/auth")}>
                Start Earning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

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
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Investments</a></li>
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
