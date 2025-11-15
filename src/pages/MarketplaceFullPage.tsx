import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, TrendingUp, Coins, DollarSign, Package } from "lucide-react";
import Navigation from "@/components/Navigation";

interface TIVPack {
  id: string;
  pack_name: string;
  amount_tiv: number;
  price_usd: number;
  description: string;
  featured: boolean;
}

interface UserBalance {
  tiv_balance: number;
  available_balance: number;
  tiv_to_usd_rate: number;
}

export default function MarketplaceFullPage() {
  const [packs, setPacks] = useState<TIVPack[]>([]);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [sellAmount, setSellAmount] = useState("");
  const [sellRate, setSellRate] = useState("0.01");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch TIV packs
      const { data: packsData, error: packsError } = await supabase
        .from('tiv_packs')
        .select('*')
        .eq('active', true)
        .order('price_usd', { ascending: true });

      if (packsError) throw packsError;

      // Fetch user balance
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('tiv_balance, available_balance, tiv_to_usd_rate')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      setPacks(packsData || []);
      setBalance(profileData);
    } catch (error: any) {
      console.error('Error fetching marketplace data:', error);
      toast({
        title: "Error",
        description: "Failed to load marketplace",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPack = async (packId: string, priceUsd: number) => {
    try {
      setProcessing(true);
      
      // TODO: Integrate with Stripe for payment processing
      toast({
        title: "Coming Soon",
        description: "Stripe payment integration will be added next. Your purchase will be $" + priceUsd.toFixed(2),
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to purchase pack",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleListTIVs = async () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid TIV amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      const amount = parseFloat(sellAmount);
      const rate = parseFloat(sellRate);

      const { data, error } = await supabase.rpc('list_tiv_on_marketplace', {
        _amount: amount,
        _rate: rate
      });

      if (error) throw error;

      toast({
        title: "Listed Successfully!",
        description: `${amount} TIVs listed at $${rate} each`,
      });

      setSellAmount("");
      await fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to list TIVs",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">TIV Marketplace</h1>
          <p className="text-muted-foreground">
            Buy TIV packs to fund campaigns or sell your earned TIVs
          </p>
        </div>

        {balance && (
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TIV Balance</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{balance.tiv_balance.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">
                  ≈ ${(balance.tiv_balance * balance.tiv_to_usd_rate).toFixed(2)} USD
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${balance.available_balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Available to withdraw</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${balance.tiv_to_usd_rate.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Per TIV</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="buy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="buy">Buy TIV Packs</TabsTrigger>
            <TabsTrigger value="sell">Sell TIVs</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {packs.map((pack) => (
                <Card key={pack.id} className={pack.featured ? 'border-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Package className="h-8 w-8 text-primary" />
                      {pack.featured && (
                        <Badge variant="default">Popular</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{pack.pack_name}</CardTitle>
                    <CardDescription>{pack.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">TIVs Included:</span>
                        <span className="font-bold">{pack.amount_tiv.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Price:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${pack.price_usd}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleBuyPack(pack.id, pack.price_usd)}
                      disabled={processing}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-6">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Sell Your TIVs</CardTitle>
                <CardDescription>
                  List your TIVs on the marketplace for other users to purchase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sellAmount">Amount of TIVs</Label>
                  <Input
                    id="sellAmount"
                    type="number"
                    min="1"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    placeholder="Enter TIV amount"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: {balance?.tiv_balance.toFixed(0) || 0} TIVs
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellRate">Price Per TIV (USD)</Label>
                  <Input
                    id="sellRate"
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={sellRate}
                    onChange={(e) => setSellRate(e.target.value)}
                  />
                </div>

                {sellAmount && sellRate && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Listing Value:</span>
                        <span className="font-bold text-primary">
                          ${(parseFloat(sellAmount) * parseFloat(sellRate)).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  className="w-full"
                  onClick={handleListTIVs}
                  disabled={processing || !sellAmount}
                >
                  List TIVs for Sale
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
