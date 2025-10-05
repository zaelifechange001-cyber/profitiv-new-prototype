import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function AdminSubscriptions() {
  const [subscriptionStats, setSubscriptionStats] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: plansData } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('price', { ascending: true });

        const { data: subscriptions } = await supabase
          .from('user_subscriptions')
          .select('plan_id, status');

        const stats = plansData?.map(plan => {
          const count = subscriptions?.filter(s => s.plan_id === plan.id && s.status === 'active').length || 0;
          const revenue = count * Number(plan.price);
          return { ...plan, userCount: count, revenue };
        });

        setPlans(plansData || []);
        setSubscriptionStats(stats || []);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
        <p className="text-muted-foreground">Subscription plans and user distribution</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {subscriptionStats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.userCount} users</div>
              <p className="text-xs text-muted-foreground mt-1">
                ${stat.price}/month • ${stat.revenue.toFixed(2)} revenue
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
          <CardDescription>Available subscription tiers and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold text-primary">${Number(plan.price).toFixed(2)}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Array.isArray(plan.features) && plan.features.map((feature: string, index: number) => (
                    <p key={index}>• {feature}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
