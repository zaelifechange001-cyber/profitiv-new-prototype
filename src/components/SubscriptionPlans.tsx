import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Basic access to earning opportunities",
    features: [
      "Watch videos ($0.01-$0.05 per video)",
      "Play simple games ($0.01-$0.10 per game)",
      "Basic affiliate offers (5% commission)",
      "Minimum $5 payouts",
    ],
    buttonText: "Sign Up Free",
    popular: false,
    variant: "glass" as const,
  },
  {
    name: "Basic",
    price: "$25",
    period: "/month",
    description: "Enhanced earning rates and opportunities",
    features: [
      "Watch premium videos ($0.05-$0.15 per video)",
      "Play advanced games ($0.05-$0.25 per game)",
      "Expanded affiliate offers (10% commission)",
      "Minimum $2 payouts",
      "Priority customer support",
    ],
    buttonText: "Get Started",
    popular: true,
    variant: "gradient" as const,
  },
  {
    name: "Premium",
    price: "$50",
    period: "/month",
    description: "Maximum earning potential across all methods",
    features: [
      "Highest paying videos ($0.10-$0.30 per video)",
      "Premium games ($0.10-$0.50 per game)",
      "Premium affiliate offers (15% commission)",
      "Minimum $1 payouts",
      "Advanced analytics dashboard",
      "VIP customer support",
    ],
    buttonText: "Upgrade Now",
    popular: false,
    variant: "glass" as const,
  },
  {
    name: "Enterprise",
    price: "$75",
    period: "/month",
    description: "For serious earners and business builders",
    features: [
      "All Premium tier benefits",
      "Double video rewards (2x entry)",
      "VIP affiliate offers (20% commission)",
      "Instant payouts (no minimum)",
      "Personal account manager",
      "Custom earning strategies",
    ],
    buttonText: "Go Enterprise",
    popular: false,
    variant: "glass" as const,
  },
];

const SubscriptionPlans = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 cv-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Choose Your <span className="text-gradient-hero">Subscription</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Unlock higher earning potential with our premium subscription tiers. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative glass-card p-8 hover-lift ${
                plan.popular ? "ring-2 ring-profitiv-teal glow-pulse" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-profitiv-teal to-profitiv-purple px-4 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-white">Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gradient-hero">{plan.price}</span>
                  <span className="text-foreground/60">{plan.period}</span>
                </div>
                <p className="text-foreground/70">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-profitiv-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-profitiv-teal" />
                    </div>
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                variant={plan.variant} 
                className="w-full"
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-foreground/60 mb-4">
            All plans include secure payments, 24/7 support, and instant account setup
          </p>
          <Button variant="link" className="text-profitiv-teal">
            View detailed comparison →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;