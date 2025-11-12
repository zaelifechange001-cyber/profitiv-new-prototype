import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface SubscriptionPlan {
  id: string;
  role: 'earner' | 'creator';
  name: string;
  price: number;
  weekly_cap?: number;
  monthly_cap?: number;
  max_campaigns?: number;
  max_target_views?: number;
  revenue_share_percent?: number;
  payout_delay_days?: number;
  features: string[];
}

interface SubscriptionPlansProps {
  role?: 'earner' | 'creator';
  userId?: string;
}

const SubscriptionPlans = ({ role, userId }: SubscriptionPlansProps) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [role]);

  const fetchPlans = async () => {
    try {
      const query = supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (role) {
        query.eq('role', role);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Cast and filter the data to match our interface
      const typedPlans = (data || [])
        .filter(plan => plan.role === 'earner' || plan.role === 'creator')
        .map(plan => ({
          ...plan,
          role: plan.role as 'earner' | 'creator',
          features: Array.isArray(plan.features) ? plan.features as string[] : []
        }));
      
      setPlans(typedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!userId) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setSelectedPlan(plan);
    setShowModal(true);
  };

  const confirmSubscription = async () => {
    if (!selectedPlan || !userId) return;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_id: selectedPlan.id,
          role: selectedPlan.role,
          status: 'active',
          started_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,role'
        });

      if (error) throw error;

      toast.success(`Successfully subscribed to ${selectedPlan.name} plan!`);
      setShowModal(false);
      
      // Redirect to appropriate dashboard
      if (selectedPlan.role === 'creator') {
        window.location.href = '/creators/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  const getVariant = (index: number) => {
    if (index === 1) return "gradient" as const; // Middle plan most popular
    return "glass" as const;
  };

  if (loading) {
    return <div className="text-center py-20">Loading plans...</div>;
  }

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!role && (
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Choose Your <span className="text-gradient-hero">Path</span>
              </h2>
              <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
                Power Your Profitiv Journey. Unlock higher limits, faster payouts, and premium access.
              </p>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative glass-card p-8 hover-lift transition-all duration-300 ${
                  index === 1 ? "ring-2 ring-primary glow-pulse scale-105" : ""
                }`}
              >
                {/* Popular Badge */}
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gradient-hero">${plan.price}</span>
                    <span className="text-foreground/60">/month</span>
                  </div>
                  {plan.role === 'earner' && (
                    <p className="text-foreground/70">
                      Max: ${plan.weekly_cap}/week or ${plan.monthly_cap}/month
                    </p>
                  )}
                  {plan.role === 'creator' && (
                    <p className="text-foreground/70">
                      Up to {plan.max_campaigns} campaigns | {plan.max_target_views?.toLocaleString()} views
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  variant={getVariant(index)} 
                  className="w-full group"
                  size="lg"
                  onClick={() => handleSubscribe(plan)}
                >
                  <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Subscribe
                </Button>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-foreground/60 mb-4">
              All plans include secure payments, dedicated support, and instant account setup
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <>
                  <p className="mb-4">
                    You are about to subscribe to the <strong>{selectedPlan.name}</strong> plan for <strong>${selectedPlan.price}/month</strong>.
                  </p>
                  <div className="bg-secondary/10 p-4 rounded-lg mb-4">
                    <p className="text-sm text-foreground/80">
                      Payment integration coming soon. Your plan will activate after Stripe setup is complete.
                    </p>
                  </div>
                  <Button onClick={confirmSubscription} className="w-full">
                    Confirm & Activate Plan
                  </Button>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionPlans;