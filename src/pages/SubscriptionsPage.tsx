import Navigation from "@/components/Navigation";
import SubscriptionPlans from "@/components/SubscriptionPlans";


const SubscriptionsPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">Pricing</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Unlock higher earning potential with our premium subscription tiers. Start free and upgrade as you grow.
            </p>
          </div>

          {/* Subscription Plans Component */}
          <SubscriptionPlans />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
