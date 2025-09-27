import HeroSection from "@/components/HeroSection";
import EarningMethods from "@/components/EarningMethods";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CheckCircle } from "lucide-react";

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
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Earning Methods */}
      <EarningMethods />

      {/* Subscription Plans */}
      <SubscriptionPlans />

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Success <span className="text-gradient-hero">Stories</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Real people, real earnings. See how Profitiv has changed lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className="glass-card p-8 hover-lift">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-foreground/80 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-profitiv-purple/20">
                  <div>
                    <div className="text-2xl font-bold text-gradient-hero">{testimonial.earnings}</div>
                    <div className="text-sm text-foreground/60">Total Earned</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-profitiv-teal">{testimonial.method}</div>
                    <div className="flex items-center space-x-1">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center glow-pulse">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to <span className="text-gradient-hero">Start Earning?</span>
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of people who are already making money with Profitiv. 
              Sign up today and get a $5 bonus just for joining!
            </p>
            
            <div className="flex items-center justify-center space-x-2 mb-8">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-success font-medium">$5 Sign-up Bonus</span>
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-success font-medium">Instant Access</span>
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-success font-medium">No Hidden Fees</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button variant="hero" size="hero" className="group">
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="glass" size="hero">
                Explore Earning Methods
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-card border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold text-gradient-hero">Profitiv</span>
              </div>
              <p className="text-foreground/60 mb-4">
                Transform your spare time into real income with Profitiv's revolutionary earning platform.
              </p>
              <p className="text-sm text-foreground/50">
                © 2024 Profitiv. All rights reserved.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Earn Money</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Affiliates</a></li>
                <li><a href="#" className="hover:text-profitiv-teal transition-colors">Investments</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-foreground/60">
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
