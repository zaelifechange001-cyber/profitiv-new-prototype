import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, DollarSign, Users, Play, Video, Trophy, LogOut, Wallet } from "lucide-react";
import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const NavigationComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  // Nav items memoized for performance
  const authNavItems = useMemo(() => [
    { name: "Dashboard", path: "/dashboard", icon: DollarSign },
    { name: "Campaigns", path: "/videos", icon: Play },
    { name: "Marketplace", path: "/marketplace", icon: DollarSign },
    { name: "Withdraw", path: "/payout-settings", icon: Wallet },
  ], []);

  const publicNavItems = useMemo(() => [
    { name: "Home", path: "/", icon: DollarSign },
    { name: "Pricing", path: "/pricing", icon: Users },
  ], []);

  const navItems = useMemo(() => user ? authNavItems : publicNavItems, [user, authNavItems, publicNavItems]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="profitiv-logo" aria-label="Profitiv home" title="Profitiv">
            <span className="profitiv-wordmark">Profitiv</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path ? "active text-profitiv-teal" : "text-foreground/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="min-h-[44px] text-muted-foreground hover:text-primary" 
              onClick={() => navigate("/?role=creator")}
            >
              Promote
            </Button>
            {user ? (
              <Button variant="glass" size="sm" className="min-h-[44px]" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Button variant="glass" size="sm" className="min-h-[44px]" onClick={() => navigate("/auth")}>
                  Login
                </Button>
                <Button variant="gradient" size="sm" className="min-h-[44px]" onClick={() => navigate("/auth")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="min-h-[44px] min-w-[44px]"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-card border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium min-h-[48px] ${
                    location.pathname === item.path ? "active text-profitiv-teal" : "text-foreground/80"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Earner/Creator Home Links - Only on Homepage */}
            {location.pathname === "/" && (
              <div className="pt-2 pb-2 space-y-2 px-2">
                <div className="text-xs text-foreground/60 px-2 pb-1">Switch View</div>
                <Button 
                  variant="gradient" 
                  className="w-full min-h-[48px]" 
                  onClick={() => { 
                    setIsOpen(false);
                    navigate("/?role=earner");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Earn
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full min-h-[48px]" 
                  onClick={() => { 
                    setIsOpen(false);
                    navigate("/?role=creator");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Promote
                </Button>
              </div>
            )}
            
            {user && (
              <div className="pt-4 px-2">
                <Button variant="glass" className="w-full min-h-[48px]" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

NavigationComponent.displayName = 'Navigation';

const Navigation = memo(NavigationComponent);

export default Navigation;