import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import profitivLogo from "@/assets/profitiv-logo-glow.png";

const MarketplacePage = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [tivBalance, setTivBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [tivRate, setTivRate] = useState(0.02);
  const [sellAmount, setSellAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [isVerified, setIsVerified] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return null;
    }

    // Check user role from user_subscriptions
    const { data: roleData } = await supabase
      .from("user_subscriptions")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("status", "active")
      .maybeSingle();

    setUserRole(roleData?.role || "");

    // Check verification status
    const { data: verificationData } = await supabase
      .from("user_verifications")
      .select("overall_status")
      .eq("user_id", session.user.id)
      .single();

    setIsVerified(verificationData?.overall_status === "approved");

    return session;
  };

  const fetchData = async () => {
    const session = await checkAuth();
    if (!session) return;

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("tiv_balance, available_balance, tiv_to_usd_rate")
      .eq("user_id", session.user.id)
      .single();

    if (profile) {
      setTivBalance(Number(profile.tiv_balance) || 0);
      setUsdBalance(Number(profile.available_balance) || 0);
      setTivRate(Number(profile.tiv_to_usd_rate) || 0.02);
    }

    // Get TIV rate from settings
    const { data: rateData } = await supabase
      .from("tiv_settings")
      .select("setting_value")
      .eq("setting_key", "tiv_to_usd_rate")
      .single();

    if (rateData) {
      setTivRate(Number(rateData.setting_value));
    }

    // Get pending listings
    const { data: listingsData } = await supabase
      .from("tiv_transactions")
      .select(
        `
        *,
        seller:profiles!tiv_transactions_seller_id_fkey(full_name)
      `,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    setListings(listingsData || []);

    // Get recent activity
    const { data: activityData } = await supabase
      .from("tiv_transactions")
      .select(
        `
        *,
        seller:profiles!tiv_transactions_seller_id_fkey(full_name),
        buyer:profiles!tiv_transactions_buyer_id_fkey(full_name)
      `,
      )
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(5);

    setRecentActivity(activityData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleListTIV = async () => {
    if (!isVerified) {
      toast.error("Complete verification first to sell TIVs");
      navigate("/verification");
      return;
    }

    if (sellAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (sellAmount > tivBalance) {
      toast.error("Insufficient TIV balance");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const grossAmount = sellAmount * tivRate;
    const fee = grossAmount * 0.02;
    const netAmount = grossAmount - fee;

    const { error } = await supabase.rpc("list_tiv_on_marketplace", {
      _amount: sellAmount,
      _rate: tivRate,
    });

    if (error) {
      toast.error("Failed to create listing: " + error.message);
      return;
    }

    toast.success(`Listed ${sellAmount} TIV for $${netAmount.toFixed(2)}`);
    setSellAmount(0);
    fetchData();
  };

  const handleBuyPack = async (tivAmount: number, price: number) => {
    if (!isVerified) {
      toast.error("Complete verification first to buy TIV packs");
      navigate("/verification");
      return;
    }

    // TODO: Integrate with Stripe Checkout
    toast.info(`Would redirect to Stripe to purchase ${tivAmount.toLocaleString()} TIV for $${price}`);
  };

  const handleBuyTIV = async (listingId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    if (usdBalance < listing.total_price) {
      toast.error("Insufficient USD balance");
      return;
    }

    const { error } = await supabase.rpc("buy_tiv_from_marketplace", {
      _listing_id: listingId,
    });

    if (error) {
      toast.error("Failed to buy TIV: " + error.message);
      return;
    }

    toast.success(`Purchased ${listing.amount} TIV for $${listing.total_price.toFixed(2)}`);
    fetchData();
  };

  const creatorPacks = [
    { tiv: 5000, price: 250 },
    { tiv: 10000, price: 450 },
    { tiv: 25000, price: 1000 },
    { tiv: 50000, price: 1800 },
  ];

  const calculateSellPreview = () => {
    const gross = sellAmount * tivRate;
    const fee = gross * 0.02;
    const net = gross - fee;
    return { gross, fee, net };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0514] via-[#180f2e] to-[#291c4b]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0514] via-[#180f2e] to-[#291c4b] animate-gradient-slow p-6">
      <style>{`
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-slow {
          background-size: 400% 400%;
          animation: gradient-slow 16s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-4">
          <div className="flex items-center gap-4">
            <img src={profitivLogo} alt="Profitiv" className="h-10" />
            <div>
              <h1 className="text-2xl font-bold text-white">Profitiv Marketplace</h1>
              <p className="text-sm text-muted-foreground">Buy TIV packs (Creators) • Sell earned TIVs (Earners)</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Role: <span className="font-semibold text-foreground">{userRole || "Guest"}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Buy/Sell */}
          <div className="lg:col-span-2 space-y-6">
            {/* Buy Packs (Creators Only) */}
            {userRole === "creator" && (
              <Card className="glass-card p-6 border-primary/20">
                <h3 className="text-xl font-bold mb-2">Buy TIV Packs (Creators)</h3>
                <p className="text-sm text-muted-foreground mb-6">Buy packs to fund campaign perks. (Creators only)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {creatorPacks.map((pack) => (
                    <div
                      key={pack.tiv}
                      className="p-4 rounded-xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 text-center hover:border-primary/50 transition-all"
                    >
                      <div className="text-sm text-muted-foreground mb-2">Pack</div>
                      <div className="text-2xl font-bold mb-2">{pack.tiv.toLocaleString()} TIV</div>
                      <div className="text-lg mb-4">${pack.price}</div>
                      <Button onClick={() => handleBuyPack(pack.tiv, pack.price)} className="w-full" variant="gradient">
                        Buy Pack
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Payments handled via Stripe Checkout (test mode until integration).
                </p>
              </Card>
            )}

            {/* Sell TIVs (Earners Only) */}
            {userRole === "earner" && (
              <Card className="glass-card p-6 border-primary/20">
                <h3 className="text-xl font-bold mb-2">Sell Your TIVs (Earners)</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Select how many TIVs to sell. Earners will receive USD (minus 2% fee).
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Available:</div>
                    <div className="text-3xl font-bold">{tivBalance.toLocaleString()} TIV</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max={tivBalance}
                        value={sellAmount}
                        onChange={(e) => setSellAmount(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <div className="w-24 text-right font-bold">{sellAmount} TIV</div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-muted-foreground">You will receive:</div>
                      <div className="text-xl font-bold text-primary">${calculateSellPreview().net.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        (after 2% fee: ${calculateSellPreview().fee.toFixed(2)})
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setSellAmount(0)} variant="outline" className="flex-1">
                        Reset
                      </Button>
                      <Button
                        onClick={handleListTIV}
                        disabled={sellAmount <= 0 || sellAmount > tivBalance || !isVerified}
                        className="flex-1"
                        variant="gradient"
                      >
                        Confirm Sale
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Note: You must be fully verified to sell TIVs or withdraw proceeds.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Activity & Info */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="glass-card p-6 border-primary/20">
              <h3 className="text-xl font-bold mb-2">Marketplace Activity</h3>
              <p className="text-sm text-muted-foreground mb-4">Recent buys & sells</p>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 border-b border-white/5">
                      <div>
                        <div className="font-semibold text-sm">{item.buyer?.full_name || "Creator"}</div>
                        <div className="text-xs text-muted-foreground">bought {item.amount} TIV</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-8">No recent activity</div>
                )}
              </div>
            </Card>

            {/* How It Works */}
            <Card className="glass-card p-6 border-primary/20">
              <h3 className="text-xl font-bold mb-2">How it works</h3>
              <p className="text-sm text-muted-foreground">
                TIVs are internal reward credits. Creators buy packs to fund campaigns. Earners can sell earned TIVs for
                USD. Profitiv deducts a 2% fee to maintain liquidity.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
