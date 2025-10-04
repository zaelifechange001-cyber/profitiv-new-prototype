import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { CoinsIcon, TrendingUp, Users, DollarSign } from "lucide-react";

const MarketplacePage = () => {
  const mockListings = [
    { id: 1, seller: "User#1234", amount: 50, pricePerTIV: 2.0, total: 100.0 },
    { id: 2, seller: "User#5678", amount: 100, pricePerTIV: 2.0, total: 200.0 },
    { id: 3, seller: "User#9012", amount: 25, pricePerTIV: 2.0, total: 50.0 },
    { id: 4, seller: "User#3456", amount: 75, pricePerTIV: 2.0, total: 150.0 },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">TIV Marketplace</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Trade your TIVs with other users for instant cash. Each TIV = $2.00. Buy, sell, or convert your earnings!
            </p>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="glass-card p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-profitiv-teal" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">$2.00</div>
              <p className="text-foreground/60">Current Price per TIV</p>
            </div>
            <div className="glass-card p-6 text-center">
              <CoinsIcon className="w-8 h-8 mx-auto mb-3 text-profitiv-purple" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">5,420</div>
              <p className="text-foreground/60">TIVs Trading</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">247</div>
              <p className="text-foreground/60">Active Traders</p>
            </div>
            <div className="glass-card p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-warning" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">$648</div>
              <p className="text-foreground/60">24h Volume</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Your TIVs */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Your TIVs</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 earning-card">
                  <span className="text-foreground/60">Available TIVs</span>
                  <span className="text-2xl font-bold text-gradient-hero">125</span>
                </div>
                <div className="flex justify-between items-center p-4 earning-card">
                  <span className="text-foreground/60">Est. Value (@ $2.00)</span>
                  <span className="text-2xl font-bold text-profitiv-teal">$250.00</span>
                </div>
                <Button variant="gradient" size="lg" className="w-full">
                  List TIVs for Sale
                </Button>
              </div>
            </div>

            {/* Quick Buy */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Quick Buy TIVs</h2>
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Amount of TIVs"
                    className="flex-1 px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-profitiv-purple"
                  />
                  <Button variant="gradient" size="lg">
                    Buy
                  </Button>
                </div>
                <p className="text-sm text-foreground/60 text-center">
                  Current market rate: $2.00 per TIV
                </p>
              </div>
            </div>
          </div>

          {/* Active Listings */}
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Active Listings</h2>
              <Button variant="glass" size="sm">
                Refresh
              </Button>
            </div>
            <div className="space-y-4">
              {mockListings.map((listing) => (
                <div key={listing.id} className="earning-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{listing.seller}</h3>
                      <p className="text-sm text-foreground/60">
                        {listing.amount} TIVs @ ${listing.pricePerTIV} each
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gradient-hero mb-2">
                        ${listing.total.toFixed(2)}
                      </div>
                      <Button variant="earnings" size="sm">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
