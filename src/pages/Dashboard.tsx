import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import CreatorDashboard from "@/components/CreatorDashboard";
import EarnerDashboard from "@/components/EarnerDashboard";
import TIVMarketplaceModal from "@/components/TIVMarketplaceModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"creator" | "earner">("earner");
  const [loading, setLoading] = useState(true);
  const [showMarketplace, setShowMarketplace] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-profitiv-purple to-profitiv-teal flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <div>
              <h1 className="text-2xl font-bold">Profitiv</h1>
              <p className="text-sm text-muted-foreground">Creators • Brands • Earners</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={userRole === "creator" ? "default" : "ghost"}
              onClick={() => setUserRole("creator")}
            >
              Creator Dashboard
            </Button>
            <Button
              variant={userRole === "earner" ? "default" : "ghost"}
              onClick={() => setUserRole("earner")}
            >
              Earner Dashboard
            </Button>
            <Button variant="ghost" onClick={() => setShowMarketplace(true)}>
              Marketplace
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>

        {userRole === "creator" ? (
          <CreatorDashboard onOpenMarketplace={() => setShowMarketplace(true)} />
        ) : (
          <EarnerDashboard onOpenMarketplace={() => setShowMarketplace(true)} />
        )}

        <TIVMarketplaceModal 
          isOpen={showMarketplace} 
          onClose={() => setShowMarketplace(false)}
          userRole={userRole}
        />

        <div className="mt-6 text-sm text-muted-foreground">
          <strong>Legal note:</strong> Rewards shown here are earned from verified engagement activity on Profitiv. 
          This platform is a marketing & engagement service — not an investment product. Withdrawals, payouts, and 
          marketplace trades require backend payment integration and verification.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
