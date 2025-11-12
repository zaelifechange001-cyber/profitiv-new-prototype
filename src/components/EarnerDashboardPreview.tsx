import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const EarnerDashboardPreview = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden isolate-blend">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b40] via-[#2d1b4e] to-[#1a3a52] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Your Earning Dashboard
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            Overview of your rewards, tasks, and active campaigns — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card p-6 hover-lift bg-background/5 backdrop-blur-md border border-white/10">
            <h4 className="text-xs font-semibold text-white/60 mb-1">Total Earned</h4>
            <div className="text-3xl font-bold text-white">$1,240</div>
            <p className="text-xs text-white/50 mt-1">Lifetime</p>
          </Card>

          <Card className="glass-card p-6 hover-lift bg-background/5 backdrop-blur-md border border-white/10">
            <h4 className="text-xs font-semibold text-white/60 mb-1">TIV Balance</h4>
            <div className="text-3xl font-bold text-white">1,420</div>
            <p className="text-xs text-white/50 mt-1">Available to trade or redeem</p>
          </Card>

          <Card className="glass-card p-6 hover-lift bg-background/5 backdrop-blur-md border border-white/10">
            <h4 className="text-xs font-semibold text-white/60 mb-1">Withdrawable</h4>
            <div className="text-3xl font-bold text-white">$420</div>
            <p className="text-xs text-white/50 mt-1">Ready after verification</p>
          </Card>
        </div>

          <Card className="glass-card p-6 hover-lift bg-background/5 backdrop-blur-md border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Featured Campaign — 1,000 completions</h3>
              <span className="text-sm text-profitiv-teal font-semibold">Reward: 15 TIV</span>
            </div>
            <Progress value={56} className="mb-4" />
            <p className="text-sm text-white/60">
              560 / 1,000 completed • Earn rewards for verified engagement
            </p>
          </Card>
      </div>
    </section>
  );
};

export default EarnerDashboardPreview;
