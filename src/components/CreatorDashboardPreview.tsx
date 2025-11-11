const CreatorDashboardPreview = () => {
  return (
    <section className="py-16 px-5 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your <span className="text-gradient-hero">Campaign Dashboard</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Track your live campaigns, view progress, and monitor engagement metrics — all in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Earnings Summary Card */}
          <div className="glass-card p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-2 text-profitiv-purple">Earnings Summary</h3>
            <p className="text-4xl font-bold mb-1">$4,850</p>
            <p className="text-sm text-foreground/60 mb-4">This Month</p>
            
            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-profitiv-purple to-profitiv-teal w-[78%]" />
            </div>
            <p className="text-xs text-foreground/60">78% toward monthly goal</p>
          </div>

          {/* Active Campaigns Card */}
          <div className="glass-card p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-2 text-profitiv-teal">Active Campaigns</h3>
            <p className="text-4xl font-bold mb-1">6</p>
            <p className="text-sm text-foreground/60 mb-4">Running Campaigns</p>
            
            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-profitiv-teal to-profitiv-purple w-[60%]" />
            </div>
            <p className="text-xs text-foreground/60">3 near completion</p>
          </div>

          {/* Engagement Tracker Card */}
          <div className="glass-card p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-2 text-success">Engagement Tracker</h3>
            <p className="text-4xl font-bold mb-1">24.5k</p>
            <p className="text-sm text-foreground/60 mb-4">Verified Views</p>
            
            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-success w-[92%]" />
            </div>
            <p className="text-xs text-foreground/60">Goal: 26,500 views</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorDashboardPreview;
