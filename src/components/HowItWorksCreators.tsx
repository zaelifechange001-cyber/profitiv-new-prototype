import { Button } from "@/components/ui/button";
import { DollarSign, Rocket, BarChart3, TrendingUp, Check } from "lucide-react";

const HowItWorksCreators = () => {
  const steps = [
    {
      icon: DollarSign,
      title: "1. Choose Your Subscription Plan",
      description: "Select a Creator Plan that fits your goals. Higher tiers allow more campaigns, detailed analytics, and premium access to engaged audiences."
    },
    {
      icon: Rocket,
      title: "2. Launch Your Campaigns",
      description: "Upload your content and set your view goal. Each campaign is powered by real users who engage directly with your videos, courses, or promotions."
    },
    {
      icon: BarChart3,
      title: "3. Track Results & Engagement",
      description: "Monitor progress with live dashboards that show engagement levels, views, and conversions — all in real time."
    },
    {
      icon: TrendingUp,
      title: "4. Earn from Access Fees",
      description: "Profitiv automatically splits access fee revenue — you get your share, earners get rewarded, and Profitiv powers future campaigns. The result: sustainable growth."
    }
  ];

  const benefits = [
    "Real engagement, not bots or empty views",
    "Shared revenue on every campaign",
    "Instant visibility with earners ready to engage",
    "Automated tracking and transparent payouts"
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/50 cv-auto relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-profitiv-purple/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How Profitiv Works for <span className="text-gradient-hero">Creators & Brands</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Profitiv turns your videos, courses, and campaigns into performance-driven engagement programs — so your brand grows faster with every viewer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="glass-card p-6 text-center space-y-4 hover-lift group">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-profitiv-purple/20 to-profitiv-teal/10 flex items-center justify-center group-hover:from-profitiv-purple/30 group-hover:to-profitiv-teal/20 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-profitiv-purple" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 md:p-8 mb-12 max-w-3xl mx-auto hover-lift">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
            Why Creators Love <span className="text-gradient-hero">Profitiv</span>
          </h3>
          <ul className="space-y-3 md:space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start text-foreground/80">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Button 
            variant="gradient" 
            size="lg"
            className="min-h-[48px] px-8"
            onClick={() => window.location.href = '/creators'}
          >
            Launch Your First Campaign
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCreators;
