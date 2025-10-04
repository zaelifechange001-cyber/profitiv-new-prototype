import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Copy, Users, DollarSign, TrendingUp, Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AffiliatePage = () => {
  const [affiliateCode] = useState("PROFITIV-USER-12345");
  const affiliateLink = `https://profitiv.com/ref/${affiliateCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const stats = [
    { label: "Total Referrals", value: "0", icon: Users, color: "text-profitiv-purple" },
    { label: "Active Referrals", value: "0", icon: TrendingUp, color: "text-profitiv-teal" },
    { label: "Total Earned", value: "$0.00", icon: DollarSign, color: "text-secondary" },
    { label: "Pending Rewards", value: "$0.00", icon: Gift, color: "text-warning" },
  ];

  const referralTiers = [
    { level: "Bronze", referrals: "1-10", commission: "5%", bonus: "$5" },
    { level: "Silver", referrals: "11-25", commission: "7.5%", bonus: "$15" },
    { level: "Gold", referrals: "26-50", commission: "10%", bonus: "$50" },
    { level: "Platinum", referrals: "51+", commission: "15%", bonus: "$100" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">Affiliate Program</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Earn passive income by referring friends! Get paid for every person who joins and earns through Profitiv.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass-card p-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-gradient-hero mb-2">{stat.value}</div>
                  <p className="text-foreground/60">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Your Affiliate Link */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-profitiv-purple" />
                Your Affiliate Link
              </h2>
              <div className="space-y-4">
                <div className="earning-card p-4">
                  <p className="text-sm text-foreground/60 mb-2">Your Unique Referral Code</p>
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono text-profitiv-teal">{affiliateCode}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(affiliateCode)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="earning-card p-4">
                  <p className="text-sm text-foreground/60 mb-2">Your Referral Link</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-profitiv-purple truncate">{affiliateLink}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(affiliateLink)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="gradient" size="lg" className="w-full">
                  Share on Social Media
                </Button>
              </div>
            </div>

            {/* How It Works */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">How It Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-profitiv-purple/20 flex items-center justify-center text-profitiv-purple font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Share Your Link</h3>
                    <p className="text-sm text-foreground/60">
                      Share your unique referral link with friends and family
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-profitiv-teal/20 flex items-center justify-center text-profitiv-teal font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">They Sign Up</h3>
                    <p className="text-sm text-foreground/60">
                      When someone joins using your link, they become your referral
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Earn Commission</h3>
                    <p className="text-sm text-foreground/60">
                      Get a percentage of their earnings plus bonus rewards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Tiers */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Commission Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {referralTiers.map((tier) => (
                <div key={tier.level} className="earning-card p-6 text-center">
                  <h3 className="text-xl font-bold text-gradient-hero mb-2">{tier.level}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground/60">
                      <span className="font-semibold">{tier.referrals}</span> referrals
                    </p>
                    <p className="text-2xl font-bold text-profitiv-teal">{tier.commission}</p>
                    <p className="text-sm text-foreground/60">commission</p>
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-lg font-bold text-secondary">{tier.bonus}</p>
                      <p className="text-xs text-foreground/60">tier bonus</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-foreground/60 mt-6">
              Commission is calculated based on your referrals' total earnings. The more they earn, the more you earn!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePage;
