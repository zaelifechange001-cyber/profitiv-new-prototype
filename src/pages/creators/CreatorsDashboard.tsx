import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Campaign {
  id: string;
  title: string;
  type: string;
  note: string;
  goal: number;
  current: number;
  percentage: number;
}

export default function CreatorsDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "c1",
      title: "Video Growth — \"Drop the Beat\"",
      type: "VID",
      note: "Reward: $0.50 / Verified view • Target: 10,000",
      goal: 10000,
      current: 8210,
      percentage: 82
    },
    {
      id: "c2",
      title: "Learn & Earn — \"Intro to Beatmaking\"",
      type: "CRS",
      note: "Reward: $12 completion • Participants goal: 750",
      goal: 750,
      current: 540,
      percentage: 72
    },
    {
      id: "c3",
      title: "Collaboration Pool — \"Community Jam\"",
      type: "COL",
      note: "Reward pool: $2,000 • Joined: 320",
      goal: 500,
      current: 320,
      percentage: 64
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    goal: "",
    current: "",
    note: ""
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/creators");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/creators");
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goal = parseInt(newCampaign.goal);
    const current = parseInt(newCampaign.current);
    const percentage = Math.min(100, Math.round((current / goal) * 100));

    const campaign: Campaign = {
      id: `c${Date.now()}`,
      title: newCampaign.title,
      type: "NEW",
      note: newCampaign.note || "Reward campaign",
      goal,
      current,
      percentage
    };

    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({ title: "", goal: "", current: "", note: "" });
    toast.success("Campaign created successfully!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden" data-role="creator">
      <BackgroundAnimation />
      
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-sm bg-background/30 relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="profitiv-logo" aria-label="Profitiv home" title="Profitiv">
              <span className="profitiv-wordmark">Profitiv</span>
            </a>
            <div className="hidden sm:block h-8 w-px bg-border/50" />
            <div>
              <div className="font-bold text-foreground">Welcome back, {user.email?.split("@")[0]}</div>
              <div className="text-sm text-muted-foreground">Creator Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create Campaign</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Campaign</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCampaign} className="space-y-4 mt-4">
                  <div>
                    <Label>Campaign Title</Label>
                    <Input
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                      placeholder="Campaign name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Target (number of actions)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newCampaign.goal}
                      onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
                      placeholder="e.g., 1000"
                      required
                    />
                  </div>
                  <div>
                    <Label>Current progress</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newCampaign.current}
                      onChange={(e) => setNewCampaign({ ...newCampaign, current: e.target.value })}
                      placeholder="e.g., 120"
                      required
                    />
                  </div>
                  <div>
                    <Label>Reward note (optional)</Label>
                    <Input
                      value={newCampaign.note}
                      onChange={(e) => setNewCampaign({ ...newCampaign, note: e.target.value })}
                      placeholder="$0.50/view or $12 completion"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button type="submit">Create Campaign</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => navigate("/creators")}>
              Back to Home
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 hover-lift">
            <div className="text-sm text-muted-foreground mb-2">Available Balance</div>
            <div className="text-3xl font-bold text-foreground mb-2">$1,248.50</div>
            <div className="text-xs text-muted-foreground">Withdrawable balance (min $1)</div>
          </div>

          <div className="glass-card p-6 hover-lift">
            <div className="text-sm text-muted-foreground mb-2">Pending Payouts</div>
            <div className="text-3xl font-bold text-foreground mb-2">$120.00</div>
            <div className="text-xs text-muted-foreground">Funds awaiting clearance</div>
          </div>

          <div className="glass-card p-6 hover-lift">
            <div className="text-sm text-muted-foreground mb-2">Total Paid</div>
            <div className="text-3xl font-bold text-foreground mb-2">$2,850.00</div>
            <div className="text-xs text-muted-foreground">Total payouts to date</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Campaigns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Active Campaigns</h3>
              <div className="text-sm text-muted-foreground">Auto-updating progress</div>
            </div>

            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="glass-card p-6 hover-lift">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 shadow-lg">
                        {campaign.type}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground truncate">{campaign.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{campaign.note}</p>
                      </div>
                    </div>

                    <div className="w-64 space-y-2">
                      <div className="progress-bar">
                        <div style={{ width: `${campaign.percentage}%` }} />
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        {campaign.current.toLocaleString()} / {campaign.goal.toLocaleString()} ({campaign.percentage}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h4 className="font-bold text-foreground mb-4">Payout History</h4>
              <div className="space-y-3">
                {[
                  { date: "2025-09-15", amount: "$820.00", status: "Paid" },
                  { date: "2025-09-03", amount: "$640.00", status: "Paid" },
                  { date: "2025-08-22", amount: "$1,390.00", status: "Paid" }
                ].map((payout, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-foreground">{payout.date}</div>
                      <div className="text-xs text-muted-foreground">{payout.status}</div>
                    </div>
                    <div className="font-bold text-foreground">{payout.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-bold text-foreground mb-4">Notifications</h4>
              <div className="text-sm text-muted-foreground">No unread notifications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
