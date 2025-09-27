import { Button } from "@/components/ui/button";
import { Play, Zap } from "lucide-react";

const YourEarningsToday = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-6 glow-pulse">
            {/* Header */}
            <h2 className="text-2xl font-bold text-white mb-6">
              Your Earnings<span className="text-foreground/60">Today</span>
            </h2>

            {/* Available Balance */}
            <div className="glass-card p-6 mb-6 bg-gradient-to-br from-profitiv-purple/20 to-profitiv-teal/20">
              <div className="text-center">
                <p className="text-foreground/60 mb-2">Available Balance</p>
                <div className="text-4xl font-bold text-white mb-2">$43.22</div>
                <div className="text-profitiv-teal font-medium">+$5.25 today</div>
              </div>
            </div>

            {/* Earning Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Earning Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <Play className="w-5 h-5 text-profitiv-teal" />
                    <span className="text-white">Videos</span>
                  </div>
                  <span className="text-profitiv-teal font-semibold">$3.50</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-profitiv-teal" />
                    <span className="text-white">Games</span>
                  </div>
                  <span className="text-profitiv-teal font-semibold">$1.75</span>
                </div>
              </div>
            </div>

            {/* Withdraw Button */}
            <Button variant="gradient" className="w-full">
              Withdraw Funds
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YourEarningsToday;