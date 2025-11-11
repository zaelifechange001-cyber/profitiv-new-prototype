import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

const CreatorBenefits = () => {
  const benefits = [
    { title: "Real engagement", description: "Verified viewers, not bots." },
    { title: "Predictable campaigns", description: "Templates and analytics help plan your spend." },
    { title: "Revenue sharing", description: "Access fees are split to fund rewards and payouts." },
    { title: "Reinvest easily", description: "Use earnings to fund your next campaign." },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-profitiv-purple/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Why Creators Choose <span className="text-gradient-hero">Profitiv</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="glass-card p-6 hover-lift">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreatorBenefits;
