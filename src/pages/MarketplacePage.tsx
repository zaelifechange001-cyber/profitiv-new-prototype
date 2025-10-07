import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { CoinsIcon, TrendingUp, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const MarketplacePage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState({ tiv: 0, usd: 0 });
  const [tivRate, setTivRate] = useState(0.02);
  const [listAmount, setListAmount] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('tiv_balance, available_balance')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserBalance({
          tiv: profile.tiv_balance || 0,
          usd: profile.available_balance || 0,
        });
      }

      const { data: settings } = await supabase
        .from('tiv_settings')
        .select('setting_value')
        .eq('setting_key', 'tiv_usd_rate')
        .single();

      if (settings) {
        setTivRate(settings.setting_value);
        setListPrice(settings.setting_value.toString());
      }

      const { data: listingsData } = await supabase
        .from('tiv_transactions')
        .select(`
          *,
          seller:profiles!tiv_transactions_seller_id_fkey(full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setListings(listingsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListTIV = async () => {
    const amount = parseFloat(listAmount);
    const rate = parseFloat(listPrice);

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid TIV amount",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(rate) || rate <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price per TIV",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('list_tiv_on_marketplace', {
        _amount: amount,
        _rate: rate,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Listed ${amount} TIV for sale`,
      });

      setListAmount("");
      fetchData();
    } catch (error: any) {
      console.error('Error listing TIV:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to list TIV",
        variant: "destructive",
      });
    }
  };

  const handleBuyTIV = async (listingId: string) => {
    try {
      const { data, error } = await supabase.rpc('buy_tiv_from_marketplace', {
        _listing_id: listingId,
      });

      if (error) throw error;

      const result = data as any;

      toast({
        title: "Purchase Successful",
        description: `Purchased ${result.amount} TIV for $${result.total_paid.toFixed(2)}`,
      });

      fetchData();
    } catch (error: any) {
      console.error('Error buying TIV:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to buy TIV",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-20 px-4 text-center">
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  const totalTIVsTrading = listings.reduce((sum, l) => sum + l.amount, 0);
  const volume24h = listings.reduce((sum, l) => sum + l.total_price, 0);

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
              <div className="text-3xl font-bold text-gradient-hero mb-2">${tivRate.toFixed(4)}</div>
              <p className="text-foreground/60">Current Price per TIV</p>
            </div>
            <div className="glass-card p-6 text-center">
              <CoinsIcon className="w-8 h-8 mx-auto mb-3 text-profitiv-purple" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{totalTIVsTrading.toFixed(0)}</div>
              <p className="text-foreground/60">TIVs Trading</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{listings.length}</div>
              <p className="text-foreground/60">Active Traders</p>
            </div>
            <div className="glass-card p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-warning" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">${volume24h.toFixed(0)}</div>
              <p className="text-foreground/60">Total Listed Value</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Your TIVs */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Sell Your TIVs</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 earning-card">
                  <span className="text-foreground/60">Available TIVs</span>
                  <span className="text-2xl font-bold text-gradient-hero">{userBalance.tiv.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center p-4 earning-card">
                  <span className="text-foreground/60">Est. Value (@ ${tivRate.toFixed(4)})</span>
                  <span className="text-2xl font-bold text-profitiv-teal">${(userBalance.tiv * tivRate).toFixed(2)}</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Amount of TIVs to sell"
                    value={listAmount}
                    onChange={(e) => setListAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-profitiv-purple"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Price per TIV (USD)"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-profitiv-purple"
                  />
                  {listAmount && listPrice && (
                    <p className="text-sm text-foreground/60 text-center">
                      Total: ${(parseFloat(listAmount) * parseFloat(listPrice)).toFixed(2)} (After 2% fee: ${(parseFloat(listAmount) * parseFloat(listPrice) * 0.98).toFixed(2)})
                    </p>
                  )}
                </div>
                <Button variant="gradient" size="lg" className="w-full" onClick={handleListTIV}>
                  List TIVs for Sale
                </Button>
              </div>
            </div>

            {/* Quick Buy */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Your USD Balance</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 earning-card">
                  <span className="text-foreground/60">Available USD</span>
                  <span className="text-2xl font-bold text-gradient-hero">${userBalance.usd.toFixed(2)}</span>
                </div>
                <p className="text-sm text-foreground/60">
                  Browse the active listings below to buy TIVs from other users
                </p>
              </div>
            </div>
          </div>

          {/* Active Listings */}
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Active Listings</h2>
              <Button variant="glass" size="sm" onClick={fetchData}>
                Refresh
              </Button>
            </div>
            <div className="space-y-4">
              {listings.length === 0 ? (
                <p className="text-center text-foreground/60 py-8">No active listings at the moment</p>
              ) : (
                listings.map((listing) => (
                  <div key={listing.id} className="earning-card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{listing.seller?.full_name || 'Anonymous User'}</h3>
                        <p className="text-sm text-foreground/60">
                          {listing.amount.toFixed(0)} TIVs @ ${listing.rate.toFixed(4)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient-hero mb-2">
                          ${listing.total_price.toFixed(2)}
                        </div>
                        <Button 
                          variant="earnings" 
                          size="sm"
                          onClick={() => handleBuyTIV(listing.id)}
                          disabled={userBalance.usd < listing.total_price}
                        >
                          {userBalance.usd < listing.total_price ? 'Insufficient Balance' : 'Buy Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
