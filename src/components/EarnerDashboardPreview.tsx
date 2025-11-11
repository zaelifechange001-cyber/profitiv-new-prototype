const EarnerDashboardPreview = () => {
  return (
    <section className="py-16 px-5 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your <span className="text-gradient-hero">Earning Dashboard</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Track your TIV balance, progress in campaigns, and completed rewards — all updated live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TIV Balance Card */}
          <div className="glass-card p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-2 text-profitiv-purple">Your TIV Balance</h3>
            <p className="text-4xl font-bold mb-1">3,250 TIVs</p>
            <p className="text-sm text-foreground/60 mb-4">≈ $6,500 USD Value</p>
            
            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-profitiv-purple to-profitiv-teal w-[65%]" />
            </div>
            <p className="text-xs text-foreground/60">Goal: 5,000 TIVs</p>
          </div>

          {/* Completed Campaigns Card */}
          <div className="glass-card p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-2 text-profitiv-teal">Completed Campaigns</h3>
            <p className="text-4xl font-bold mb-1">18</p>
            <p className="text-sm text-foreground/60 mb-4">Campaigns Finished</p>
            
            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-profitiv-teal to-profitiv-purple w-[90%]" />
            </div>
            <p className="text-xs text-foreground/60">You're in the top 5% of earners!</p>
          </div>

          {/* Withdraw Progress Card */}
          <div className="glass-card p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-2 text-success">Withdraw Progress</h3>
            <p className="text-4xl font-bold mb-1">$1,250</p>
            <p className="text-sm text-foreground/60 mb-4">Withdrawn This Month</p>
            
            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-success w-[50%]" />
            </div>
            <p className="text-xs text-foreground/60">Goal: $2,500 this month</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarnerDashboardPreview;
