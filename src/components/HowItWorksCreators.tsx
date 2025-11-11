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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            How Profitiv Works for Creators & Brands
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Profitiv turns your videos, courses, and campaigns into performance-driven engagement programs — so your brand grows faster with every viewer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="glass-card p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-profitiv-purple/20 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-profitiv-purple" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 mb-12 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6 text-foreground">
            Why Creators Love Profitiv
          </h3>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-foreground/80">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Button 
            variant="hero" 
            size="hero"
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
