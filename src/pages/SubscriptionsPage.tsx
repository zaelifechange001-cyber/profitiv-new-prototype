import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SubscriptionsPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'earner' | 'creator' | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUserId(user.id);
      
      // Check if user has a role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (roleData?.role === 'admin') {
        setUserRole('creator');
      } else {
        setUserRole(null); // Show both options if no specific role
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">Choose Your Plan</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Power Your Profitiv Journey. Unlock higher limits, faster payouts, and premium access.
            </p>
          </div>

          {/* Role Selection or Single Role View */}
          {!userRole ? (
            <Tabs defaultValue="earner" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="earner" className="text-lg">
                  For Earners
                </TabsTrigger>
                <TabsTrigger value="creator" className="text-lg">
                  For Creators
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="earner">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Earner Plans</h2>
                  <p className="text-foreground/70">Watch, engage, and earn with verified campaigns</p>
                </div>
                <SubscriptionPlans role="earner" userId={userId || undefined} />
              </TabsContent>
              
              <TabsContent value="creator">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Creator Plans</h2>
                  <p className="text-foreground/70">Launch campaigns and grow your brand</p>
                </div>
                <SubscriptionPlans role="creator" userId={userId || undefined} />
              </TabsContent>
            </Tabs>
          ) : (
            <SubscriptionPlans role={userRole} userId={userId || undefined} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
