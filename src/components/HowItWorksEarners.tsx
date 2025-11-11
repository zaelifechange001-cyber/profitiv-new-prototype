import { Button } from "@/components/ui/button";
import { Play, Zap, DollarSign, Wallet } from "lucide-react";

const HowItWorksEarners = () => {
  const steps = [
    {
      icon: DollarSign,
      title: "1. Choose Your Subscription Plan",
      description: "Pick a plan that fits your goals — Starter, Builder, Pro, or Elite. Each tier unlocks higher earning limits, faster payouts, and more campaign opportunities."
    },
    {
      icon: Play,
      title: "2. Engage with Campaigns",
      description: "Watch videos, complete Learn & Earn courses, or join community campaigns. Each task gives you the chance to earn TIVs — Profitiv's in-platform reward credits."
    },
    {
      icon: Zap,
      title: "3. Earn TIVs Instantly",
      description: "Every completed action adds TIVs to your dashboard in real time. You can use them to unlock premium content, trade on the marketplace, or redeem for cash rewards."
    },
    {
      icon: Wallet,
      title: "4. Redeem or Sell Your Rewards",
      description: "Sell your TIVs on the marketplace or redeem them directly once you reach your cash-out goal. Withdraw securely after ID and account verification."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            How Profitiv Works for Earners
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Start earning by supporting creators, completing actions, and helping campaigns grow — all powered by your subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="glass-card p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-profitiv-teal/20 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-profitiv-teal" />
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

        <div className="text-center">
          <Button 
            variant="hero" 
            size="hero"
            onClick={() => window.location.href = '/auth'}
          >
            Join Profitiv & Start Earning
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksEarners;
