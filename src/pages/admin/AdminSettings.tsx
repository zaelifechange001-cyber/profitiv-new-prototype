import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, DollarSign, Percent, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    profitivRevenueShare: 30,
    creatorRevenueShare: 70,
    tivValue: 2.00,
    minWithdrawal: 10.00,
    maxWithdrawal: 5000.00,
    maintenanceMode: false,
  });

  const [subscriptionLimits, setSubscriptionLimits] = useState({
    starterWeeklyCap: 100,
    starterMonthlyCap: 500,
    builderWeeklyCap: 200,
    builderMonthlyCap: 1000,
    proWeeklyCap: 300,
    proMonthlyCap: 1500,
    eliteWeeklyCap: 450,
    eliteMonthlyCap: 2250,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('tiv_settings')
        .select('*');

      if (data) {
        const settingsMap: any = {};
        data.forEach(s => {
          settingsMap[s.setting_key] = Number(s.setting_value);
        });

        setSettings(prev => ({
          ...prev,
          tivValue: settingsMap['tiv_to_usd_rate'] || 2.00,
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_update_global_settings', {
        _settings: {
          tivToUsdRate: settings.tivValue,
          marketplaceFee: 0.02, // 2% default
          withdrawalFee: 0.02   // 2% default
        }
      });

      if (error) throw error;

      // Update all user profiles with new TIV rate
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ tiv_to_usd_rate: settings.tivValue });

      if (profileError) throw profileError;

      toast.success((data as any)?.message || 'Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSubscriptionLimits = async () => {
    setLoading(true);
    try {
      // Update subscription plans with new caps
      const plans = [
        { name: 'Starter', weekly: subscriptionLimits.starterWeeklyCap, monthly: subscriptionLimits.starterMonthlyCap },
        { name: 'Builder', weekly: subscriptionLimits.builderWeeklyCap, monthly: subscriptionLimits.builderMonthlyCap },
        { name: 'Pro', weekly: subscriptionLimits.proWeeklyCap, monthly: subscriptionLimits.proMonthlyCap },
        { name: 'Elite', weekly: subscriptionLimits.eliteWeeklyCap, monthly: subscriptionLimits.eliteMonthlyCap },
      ];

      for (const plan of plans) {
        await supabase
          .from('subscription_plans')
          .update({ 
            weekly_cap: plan.weekly,
            monthly_cap: plan.monthly 
          })
          .eq('name', plan.name)
          .eq('role', 'earner');
      }

      toast.success('Subscription limits updated');
    } catch (error) {
      console.error('Error saving subscription limits:', error);
      toast.error('Failed to update subscription limits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
          Platform Settings
        </h2>
        <p className="text-white/60 mt-1">Configure global platform parameters</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Revenue Share Configuration
          </CardTitle>
          <CardDescription className="text-white/60">
            Set platform and creator revenue splits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profitiv-share" className="text-white/80">
                Profitiv Revenue Share (%)
              </Label>
              <Input
                id="profitiv-share"
                type="number"
                value={settings.profitivRevenueShare}
                onChange={(e) => setSettings({ ...settings, profitivRevenueShare: Number(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creator-share" className="text-white/80">
                Creator Revenue Share (%)
              </Label>
              <Input
                id="creator-share"
                type="number"
                value={settings.creatorRevenueShare}
                onChange={(e) => setSettings({ ...settings, creatorRevenueShare: Number(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <p className="text-sm text-white/50">
            Must total 100%. Current: {settings.profitivRevenueShare + settings.creatorRevenueShare}%
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            TIV & Withdrawal Settings
          </CardTitle>
          <CardDescription className="text-white/60">
            Configure TIV value and withdrawal limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tiv-value" className="text-white/80">
              TIV Value (USD)
            </Label>
            <Input
              id="tiv-value"
              type="number"
              step="0.01"
              value={settings.tivValue}
              onChange={(e) => setSettings({ ...settings, tivValue: Number(e.target.value) })}
              className="bg-white/5 border-white/10 text-white"
            />
            <p className="text-sm text-white/50">
              Current exchange rate: 1 TIV = ${settings.tivValue}
            </p>
          </div>

          <Separator className="bg-white/10" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-withdrawal" className="text-white/80">
                Minimum Withdrawal ($)
              </Label>
              <Input
                id="min-withdrawal"
                type="number"
                step="1.00"
                value={settings.minWithdrawal}
                onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-withdrawal" className="text-white/80">
                Maximum Withdrawal ($)
              </Label>
              <Input
                id="max-withdrawal"
                type="number"
                step="1.00"
                value={settings.maxWithdrawal}
                onChange={(e) => setSettings({ ...settings, maxWithdrawal: Number(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <Button
            onClick={saveSettings}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Save TIV & Withdrawal Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Subscription Payout Limits
          </CardTitle>
          <CardDescription className="text-white/60">
            Set weekly and monthly earning caps for each subscription tier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { name: 'Starter', weeklyKey: 'starterWeeklyCap', monthlyKey: 'starterMonthlyCap' },
            { name: 'Builder', weeklyKey: 'builderWeeklyCap', monthlyKey: 'builderMonthlyCap' },
            { name: 'Pro', weeklyKey: 'proWeeklyCap', monthlyKey: 'proMonthlyCap' },
            { name: 'Elite', weeklyKey: 'eliteWeeklyCap', monthlyKey: 'eliteMonthlyCap' },
          ].map((tier) => (
            <div key={tier.name} className="space-y-2">
              <h4 className="font-semibold text-white">{tier.name} Plan</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Weekly Cap ($)</Label>
                  <Input
                    type="number"
                    value={subscriptionLimits[tier.weeklyKey as keyof typeof subscriptionLimits]}
                    onChange={(e) => setSubscriptionLimits({ 
                      ...subscriptionLimits, 
                      [tier.weeklyKey]: Number(e.target.value) 
                    })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Monthly Cap ($)</Label>
                  <Input
                    type="number"
                    value={subscriptionLimits[tier.monthlyKey as keyof typeof subscriptionLimits]}
                    onChange={(e) => setSubscriptionLimits({ 
                      ...subscriptionLimits, 
                      [tier.monthlyKey]: Number(e.target.value) 
                    })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={saveSubscriptionLimits}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Save Subscription Limits
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-orange-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-400" />
            System Maintenance
          </CardTitle>
          <CardDescription className="text-white/60">
            Pause all transactions and platform activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div>
              <p className="font-medium text-white">Maintenance Mode</p>
              <p className="text-sm text-white/60">
                {settings.maintenanceMode 
                  ? 'Platform is currently in maintenance mode' 
                  : 'All systems operational'}
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>
          {settings.maintenanceMode && (
            <p className="text-sm text-orange-400">
              ⚠️ Warning: Users cannot perform any transactions while maintenance mode is active.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
