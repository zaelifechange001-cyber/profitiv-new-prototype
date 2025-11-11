import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CreatorDashboard = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-profitiv-purple/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Your Campaign <span className="text-gradient-hero">Dashboard</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            A single control center for all live campaigns, revenue, and audience quality metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card p-6 hover-lift">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Active Campaigns</h4>
            <div className="text-4xl font-bold text-foreground mb-2">8</div>
            <p className="text-sm text-muted-foreground">Running / Scheduled</p>
          </Card>

          <Card className="glass-card p-6 hover-lift">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Pending Revenue</h4>
            <div className="text-4xl font-bold text-foreground mb-2">$12,450</div>
            <p className="text-sm text-muted-foreground">Payouts queued</p>
          </Card>

          <Card className="glass-card p-6 hover-lift">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Avg Engagement Rate</h4>
            <div className="text-4xl font-bold text-foreground mb-2">92%</div>
            <p className="text-sm text-muted-foreground">Completion across campaigns</p>
          </Card>
        </div>

        <Card className="glass-card p-6 hover-lift">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-foreground">Promo Campaign — 2,500 views</h3>
            <span className="text-muted-foreground">Goal: 2,500</span>
          </div>
          <Progress value={72} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            Reward pool: 15,000 TIV • Access fee split managed by platform
          </p>
        </Card>
      </div>
    </section>
  );
};

export default CreatorDashboard;
