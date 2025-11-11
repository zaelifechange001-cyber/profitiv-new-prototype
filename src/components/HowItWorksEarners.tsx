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
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/50 cv-auto relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-profitiv-teal/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How Profitiv Works for <span className="text-gradient-hero">Earners</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Start earning by supporting creators, completing actions, and helping campaigns grow — all powered by your subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="glass-card p-6 text-center space-y-4 hover-lift group">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-profitiv-teal/20 to-profitiv-purple/10 flex items-center justify-center group-hover:from-profitiv-teal/30 group-hover:to-profitiv-purple/20 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-profitiv-teal" />
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

        <div className="text-center">
          <Button 
            variant="gradient" 
            size="lg"
            className="min-h-[48px] px-8"
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
