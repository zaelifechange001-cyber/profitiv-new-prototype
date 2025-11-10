import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, DollarSign, Users, Play, Video, Trophy, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const Navigation = () => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Nav items for authenticated users
  const authNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: DollarSign },
    { name: "Earn", path: "/earn", icon: Trophy },
    { name: "Pricing", path: "/pricing", icon: Users },
    { name: "Affiliate", path: "/affiliate", icon: Users },
  ];

  // Nav items for non-authenticated users (minimal)
  const publicNavItems = [
    { name: "Home", path: "/", icon: DollarSign },
    { name: "Pricing", path: "/pricing", icon: Users },
  ];

  const navItems = user ? authNavItems : publicNavItems;

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
              onClick={() => navigate("/creators")}
            >
              For Creators
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
            <div className="pt-4 space-y-3 px-2">
              <Button 
                variant="outline" 
                className="w-full min-h-[48px]" 
                onClick={() => { navigate("/creators"); setIsOpen(false); }}
              >
                For Creators
              </Button>
              {user ? (
                <Button variant="glass" className="w-full min-h-[48px]" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="glass" className="w-full min-h-[48px]" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                    Login
                  </Button>
                  <Button variant="gradient" className="w-full min-h-[48px]" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;