import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import CreatorDashboard from "@/components/CreatorDashboard";
import EarnerDashboard from "@/components/EarnerDashboard";
import TIVMarketplaceModal from "@/components/TIVMarketplaceModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"creator" | "earner" | null>(null);
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

    // Fetch user role(s) from user_roles table
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (!error && roles && roles.length > 0) {
      // If multiple roles exist, default to the first (can enhance later)
      setUserRole(roles[0].role as "creator" | "earner");
    } else {
      // No role assigned yet – render friendly message (no redirect loop)
      setUserRole(null);
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

  if (userRole === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-border/50 rounded-2xl p-6 bg-card shadow-sm text-center space-y-3">
          <h2 className="text-xl font-semibold">Role Required</h2>
          <p className="text-sm text-muted-foreground">
            Your account doesn’t have a role yet. Please choose a path to continue.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Button variant="outline" onClick={() => navigate('/?role=earner')}>Go to Earn</Button>
            <Button variant="outline" onClick={() => navigate('/?role=creator')}>Go to Promote</Button>
            <Button variant="ghost" onClick={handleLogout}>Sign out</Button>
          </div>
        </div>
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
              <p className="text-sm text-muted-foreground">
                {userRole === "creator" ? "Creator Dashboard" : "Earner Dashboard"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        ) : userRole === "earner" ? (
          <EarnerDashboard onOpenMarketplace={() => setShowMarketplace(true)} />
        ) : null}

        <TIVMarketplaceModal 
          isOpen={showMarketplace} 
          onClose={() => setShowMarketplace(false)}
          userRole={userRole || "earner"}
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
