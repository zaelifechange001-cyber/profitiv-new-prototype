import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function CreatorsLanding() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event !== 'SIGNED_OUT') {
        navigate("/creators/dashboard");
      }
      setCheckingSession(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/creators/dashboard");
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/creators/dashboard` }
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Welcome to Profitiv Creators.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-dark/10 to-transparent" />
        <div className="absolute top-1/4 -left-24 w-64 h-64 md:w-96 md:h-96 bg-primary/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-24 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-[100px]" />
        <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-dark/10 to-transparent" />
      <div className="absolute top-1/4 -left-24 w-64 h-64 md:w-96 md:h-96 bg-primary/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-24 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-[100px]" />
      
      {/* Auth card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-6 md:p-8 space-y-6">
          {/* Badge and Title */}
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary font-bold text-sm">
              Creator • Brand
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {isLogin 
                ? "Sign in to manage your campaigns" 
                : "Join Profitiv as a creator or brand"}
            </p>
          </div>

          {/* Auth form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full min-h-[48px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLogin ? "Sign in" : "Sign up"}
            </Button>
          </form>

          {/* Toggle auth mode */}
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-colors text-sm"
            >
              {isLogin ? "Create account" : "Have account?"}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By continuing you agree to Profitiv's Terms and Privacy.
          </p>

          {/* Back to main site */}
          <div className="pt-4 border-t border-border/50">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="w-full text-sm"
            >
              ← Back to User Platform
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
