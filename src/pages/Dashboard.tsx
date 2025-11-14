import { fetchUserRole } from "../../utils/fetchUserRole";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EarnerDashboard from "@/components/EarnerDashboard";
import CreatorDashboard from "@/components/CreatorDashboard";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"earner" | "creator" | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      const role = await fetchUserRole(supabase, user.id);

      if (error) {
        console.error("Error fetching role:", error);
        // Default to earner if no role found
        setUserRole("earner");
        return;
      }

      // Map role to dashboard type
      if (data?.role === "admin") {
        setUserRole("creator"); // Admins see creator dashboard
      } else {
        setUserRole("earner"); // Default to earner
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("earner");
    }
  };

  useEffect(() => {
    let mounted = true;
    let redirectTimer: number | undefined;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      console.log("[Auth] onAuthStateChange", { event, hasUser: !!session?.user });

      if (session?.user) {
        if (redirectTimer) clearTimeout(redirectTimer);
        setUser(session.user);
        fetchUserRole(session.user.id);
        setLoading(false);
      } else if (event === "SIGNED_OUT") {
        if (redirectTimer) clearTimeout(redirectTimer);
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      console.log("[Auth] getSession", { hasUser: !!session?.user });
      if (session?.user) {
        if (redirectTimer) clearTimeout(redirectTimer);
        setUser(session.user);
        fetchUserRole(session.user.id);
        setLoading(false);
      } else {
        redirectTimer = window.setTimeout(() => {
          if (!mounted) return;
          console.log("[Auth] No session after timeout — redirecting to /auth");
          navigate("/auth");
          setLoading(false);
        }, 3000);
      }
    });

    return () => {
      mounted = false;
      if (redirectTimer) clearTimeout(redirectTimer);
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (loading || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {userRole === "earner" ? (
        <EarnerDashboard userId={user?.id || ""} />
      ) : (
        <CreatorDashboard userId={user?.id || ""} />
      )}
    </div>
  );
};

export default Dashboard;
