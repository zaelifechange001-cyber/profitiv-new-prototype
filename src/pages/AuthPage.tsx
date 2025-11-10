import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event !== 'SIGNED_OUT') {
        navigate("/dashboard");
      }
      setCheckingSession(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`.trim(),
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Welcome to Profitiv.",
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
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
          {/* Logo */}
          <div className="text-center space-y-2">
            <h1 className="profitiv-wordmark text-4xl md:text-5xl font-black mb-2">
              PROFITIV
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {isLogin
                ? "Sign in to your Profitiv account"
                : "Start earning with Profitiv today"}
            </p>
          </div>

          {/* Auth form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                    className="h-11 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                    className="h-11 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
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
                placeholder="••••••••"
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
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          {/* Toggle auth mode */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
