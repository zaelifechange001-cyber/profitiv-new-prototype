import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, CreditCard, DollarSign, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface PayoutMethod {
  id: string;
  method_type: string;
  account_identifier: string;
  is_default: boolean;
  is_verified: boolean;
}

interface UserProfile {
  available_balance: number;
  tiv_balance: number;
  tiv_to_usd_rate: number;
  auto_payout_enabled: boolean;
  auto_payout_threshold: number;
}

export default function PayoutSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [tivAmount, setTivAmount] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newMethod, setNewMethod] = useState({
    method_type: "paypal",
    account_identifier: "",
  });

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

      const [profileRes, methodsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("payout_methods").select("*").eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (methodsRes.data) setPayoutMethods(methodsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPayoutMethod = async () => {
    if (!newMethod.account_identifier) {
      toast({
        title: "Error",
        description: "Please enter account details",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("payout_methods").insert({
        user_id: user.id,
        method_type: newMethod.method_type,
        account_identifier: newMethod.account_identifier,
        is_default: payoutMethods.length === 0,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payout method added successfully",
      });

      setNewMethod({ method_type: "paypal", account_identifier: "" });
      fetchData();
    } catch (error) {
      console.error("Error adding payout method:", error);
      toast({
        title: "Error",
        description: "Failed to add payout method",
        variant: "destructive",
      });
    }
  };

  const setDefaultMethod = async (methodId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("payout_methods")
        .update({ is_default: false })
        .eq("user_id", user.id);

      const { error } = await supabase
        .from("payout_methods")
        .update({ is_default: true })
        .eq("id", methodId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Default payout method updated",
      });

      fetchData();
    } catch (error) {
      console.error("Error setting default method:", error);
      toast({
        title: "Error",
        description: "Failed to update default method",
        variant: "destructive",
      });
    }
  };

  const toggleAutoPayout = async (enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ auto_payout_enabled: enabled })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Auto-payout ${enabled ? "enabled" : "disabled"}`,
      });

      fetchData();
    } catch (error) {
      console.error("Error toggling auto-payout:", error);
      toast({
        title: "Error",
        description: "Failed to update auto-payout setting",
        variant: "destructive",
      });
    }
  };

  const convertTivToUsd = async () => {
    const amount = parseFloat(tivAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid TIV amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc("convert_tiv_to_usd", {
        _user_id: user.id,
        _tiv_amount: amount,
      });

      if (error) throw error;

      const result = data as any;

      toast({
        title: "Conversion Successful",
        description: `Converted ${result.tiv_converted} TIV to $${result.usd_received.toFixed(2)}`,
      });

      setTivAmount("");
      fetchData();
    } catch (error: any) {
      console.error("Error converting TIV:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to convert TIV",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Payout Settings</h1>
          <p className="text-muted-foreground">
            Manage your payout methods and TIV tokens
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">USD Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${profile?.available_balance?.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TIV Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.tiv_balance?.toFixed(0) || "0"} TIV
              </div>
              <p className="text-xs text-muted-foreground">
                ≈ ${((profile?.tiv_balance || 0) * (profile?.tiv_to_usd_rate || 0.01)).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                100 TIV = ${(100 * (profile?.tiv_to_usd_rate || 0.01)).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="methods" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="methods">Payout Methods</TabsTrigger>
            <TabsTrigger value="tiv">Convert TIV</TabsTrigger>
            <TabsTrigger value="auto">Auto-Payout</TabsTrigger>
          </TabsList>

          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <CardTitle>Payout Methods</CardTitle>
                <CardDescription>
                  Add and manage your payout methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Add New Method</Label>
                  <div className="grid gap-4">
                    <div>
                      <Label>Payment Type</Label>
                      <select
                        className="w-full mt-1.5 px-3 py-2 bg-background border border-input rounded-md"
                        value={newMethod.method_type}
                        onChange={(e) =>
                          setNewMethod({ ...newMethod, method_type: e.target.value })
                        }
                      >
                        <option value="paypal">PayPal</option>
                        <option value="cashapp">Cash App</option>
                        <option value="venmo">Venmo</option>
                        <option value="bank">Bank Account</option>
                      </select>
                    </div>
                    <div>
                      <Label>Account Details</Label>
                      <Input
                        placeholder={
                          newMethod.method_type === "cashapp"
                            ? "$cashtag"
                            : newMethod.method_type === "bank"
                            ? "Account Number"
                            : "Email"
                        }
                        value={newMethod.account_identifier}
                        onChange={(e) =>
                          setNewMethod({ ...newMethod, account_identifier: e.target.value })
                        }
                      />
                    </div>
                    <Button onClick={addPayoutMethod}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Method
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Your Methods</Label>
                  {payoutMethods.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No payout methods added yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {payoutMethods.map((method) => (
                        <Card key={method.id}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="font-medium capitalize">{method.method_type}</p>
                              <p className="text-sm text-muted-foreground">
                                {method.account_identifier}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {method.is_default && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                              {!method.is_default && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDefaultMethod(method.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiv">
            <Card>
              <CardHeader>
                <CardTitle>Convert TIV to USD</CardTitle>
                <CardDescription>
                  Convert your TIV tokens to USD balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>TIV Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter TIV amount"
                    value={tivAmount}
                    onChange={(e) => setTivAmount(e.target.value)}
                  />
                  {tivAmount && !isNaN(parseFloat(tivAmount)) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      You will receive: $
                      {(parseFloat(tivAmount) * (profile?.tiv_to_usd_rate || 0.01)).toFixed(2)}
                    </p>
                  )}
                </div>
                <Button onClick={convertTivToUsd} className="w-full">
                  Convert TIV to USD
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auto">
            <Card>
              <CardHeader>
                <CardTitle>Automatic Payouts</CardTitle>
                <CardDescription>
                  Configure automatic payout settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto-Payout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process payouts when balance reaches threshold
                    </p>
                  </div>
                  <Switch
                    checked={profile?.auto_payout_enabled || false}
                    onCheckedChange={toggleAutoPayout}
                  />
                </div>

                <div>
                  <Label>Auto-Payout Threshold</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Current threshold: ${profile?.auto_payout_threshold?.toFixed(2) || "10.00"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Payouts will be processed automatically when your balance reaches this amount
                  </p>
                </div>

                {!payoutMethods.some((m) => m.is_default && m.is_verified) && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Please add and verify a default payout method to enable auto-payouts
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
