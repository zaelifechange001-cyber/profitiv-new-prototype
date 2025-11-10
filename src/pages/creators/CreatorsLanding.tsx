import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function CreatorsLanding() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/creators/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/creators/dashboard` }
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundAnimation />

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg">
            P
          </div>
          <div>
            <h1 className="text-lg font-bold">Profitiv — Creators</h1>
            <p className="text-xs text-muted-foreground">Promote. Reward. Grow.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            User Platform
          </Button>
          <Button onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}>
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
              Creator • Brand
            </div>
            
            <h2 className="text-5xl font-bold leading-tight">
              Launch campaigns that reach{" "}
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                real audiences
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Upload promotional videos or courses, set reward budgets, and pay only for verified engagement. 
              Grow your reach with measurable results.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}>
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                How it works
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Card className="p-8 glass-card backdrop-blur-xl border-primary/20">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">Campaign Preview</div>
                  <p className="text-sm text-muted-foreground">Reward overlay & analytics snapshot</p>
                </div>
                
                <div className="space-y-4">
                  <div className="h-32 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-4xl font-bold text-gradient">📊</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold">95%</div>
                      <div className="text-xs text-muted-foreground">Verified</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold">3-day</div>
                      <div className="text-xs text-muted-foreground">Payout</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold">$0</div>
                      <div className="text-xs text-muted-foreground">Setup</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Upload content", desc: "Add videos or course materials and set reward per verified action.", icon: "📹" },
            { title: "Reach audiences", desc: "Target users by interest groups and run reward-funded campaigns that convert.", icon: "🎯" },
            { title: "Track rewards", desc: "See verified views, completions, and payout obligations at a glance.", icon: "📈" }
          ].map((feature, i) => (
            <Card key={i} className="p-6 glass-card hover-lift" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth-section" className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card className="p-8 glass-card">
            <h3 className="text-2xl font-bold mb-4">Why creators choose Profitiv</h3>
            <p className="text-muted-foreground mb-6">
              Verified engagement, transparent payouts, and easy campaign management to help you convert viewers into customers.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-xs text-muted-foreground mt-1">Verified views</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">3-day</div>
                <div className="text-xs text-muted-foreground mt-1">Avg payout</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">$0</div>
                <div className="text-xs text-muted-foreground mt-1">Free setup</div>
              </Card>
            </div>
          </Card>

          <Card className="p-8 glass-card">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {isLogin ? "Sign in" : "Create an account"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Welcome back — enter your email and password." : "Join Profitiv as a creator or brand"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Loading..." : isLogin ? "Sign in" : "Sign up"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Create account" : "Have account?"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing you agree to Profitiv's Terms and Privacy.
              </p>
            </form>
          </Card>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-12 text-center text-sm text-muted-foreground">
        Not ready to sign up? You can explore features and pricing from this page. © Profitiv
      </footer>

      <style>{`
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
        }
        
        .orb-1 {
          width: 400px;
          height: 400px;
          background: hsl(var(--primary));
          top: -200px;
          right: -200px;
          animation-delay: 0s;
        }
        
        .orb-2 {
          width: 500px;
          height: 500px;
          background: hsl(var(--secondary));
          bottom: -250px;
          left: -250px;
          animation-delay: -7s;
        }
        
        .orb-3 {
          width: 350px;
          height: 350px;
          background: hsl(var(--accent));
          top: 50%;
          left: 50%;
          animation-delay: -14s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(100px, -100px) rotate(120deg);
          }
          66% {
            transform: translate(-100px, 100px) rotate(240deg);
          }
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
