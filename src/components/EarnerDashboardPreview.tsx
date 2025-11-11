import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const EarnerDashboardPreview = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-profitiv-teal/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Your Earning <span className="text-gradient-hero">Dashboard</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Overview of your rewards, tasks, and active pools — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card p-6 hover-lift">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Total Earned</h4>
            <div className="text-4xl font-bold text-foreground mb-2">$1,240</div>
            <p className="text-sm text-muted-foreground">Lifetime</p>
          </Card>

          <Card className="glass-card p-6 hover-lift">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">TIV Balance</h4>
            <div className="text-4xl font-bold text-foreground mb-2">1,420</div>
            <p className="text-sm text-muted-foreground">Available to trade or redeem</p>
          </Card>

          <Card className="glass-card p-6 hover-lift">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Withdrawable</h4>
            <div className="text-4xl font-bold text-foreground mb-2">$420</div>
            <p className="text-sm text-muted-foreground">Ready after verification</p>
          </Card>
        </div>

        <Card className="glass-card p-6 hover-lift">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-foreground">Campaign Video — 1,000 views</h3>
            <span className="text-sm text-profitiv-teal font-semibold">Reward: 15 TIV</span>
          </div>
          <Progress value={56} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            Join the pool • Your stake: $5 • Expected reward when goal met
          </p>
        </Card>
      </div>
    </section>
  );
};

export default EarnerDashboardPreview;
