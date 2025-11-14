// src/pages/dashboard/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Lightweight inline components for demonstration.
// In your real project you can replace these with your existing components
function Loading() {
  return <div style={{ padding: 20 }}>Loading dashboard…</div>;
}

function SignInPrompt() {
  return <div style={{ padding: 20 }}>Please sign in to view your dashboard.</div>;
}

/**
 * Small presentational cards — replace with your styled components
 */
function CapCard({ label, current, cap }: { label: string; current: number; cap: number }) {
  const pct = cap > 0 ? Math.min(100, Math.round((current / cap) * 100)) : 0;
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 14,
        minWidth: 180,
        background: "rgba(255,255,255,0.03)",
        color: "#fff",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>
        ${current} / ${cap}
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 6, marginTop: 8 }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg,#7C3AED,#06B6D4)",
            borderRadius: 6,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Fetch helpers — safe usage of maybeSingle()
 */
async function fetchUserRoleSafe(userId: string | null) {
  if (!userId) return null;
  // 1) Try user_subscriptions (preferred)
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("role")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (!error && data?.role) return data.role;
  } catch (e) {
    console.warn("user_subscriptions fetch error:", e);
  }

  // 2) Fallback to user_roles table
  try {
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();

    if (!error && data?.role) return data.role;
  } catch (e) {
    console.warn("user_roles fetch error:", e);
  }

  // Default to earner if no role found
  return "earner";
}

async function fetchSubscriptionForUser(userId: string | null) {
  if (!userId) return null;
  try {
    // Join user_subscriptions -> subscription_plans via plan_id OR if you store plan_name, adapt accordingly
    // This assumes user_subscriptions.plan_id exists and subscription_plans.id exists
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select(
        `
        status,
        kyc_verified,
        plan_id,
        subscription_plans:subscription_plans!inner(id, name, role, price, weekly_cap, monthly_cap, annual_cap)
      `,
      )
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.warn("subscription fetch returned error:", error);
      return null;
    }
    return data ?? null;
  } catch (e) {
    console.warn("subscription fetch unexpected error:", e);
    return null;
  }
}

async function fetchActiveCampaignsForUser(userId: string | null) {
  if (!userId) return [];
  // Note: This assumes active_campaigns table exists
  // If it doesn't, this will return empty array
  try {
    const { data } = await supabase
      .from("user_activities")
      .select("*")
      .eq("user_id", userId)
      .limit(10);
    return data ?? [];
  } catch (e) {
    console.warn("active campaigns fetch error:", e);
    return [];
  }
}

export default function DashboardPage(props: { user?: any }) {
  const [user, setUser] = useState<any>(props.user ?? null);
  const [role, setRole] = useState<string | null>(null);
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  // Example earned counters (replace with real calculations)
  const [weeklyEarned, setWeeklyEarned] = useState<number>(0);
  const [monthlyEarned, setMonthlyEarned] = useState<number>(0);
  const [annualEarned, setAnnualEarned] = useState<number>(0);

  // Keep listening for auth state changes
  useEffect(() => {
    let mounted = true;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load role / subscription only after user exists
  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      setLoading(true);
      if (!user?.id) {
        setRole(null);
        setSub(null);
        setActiveCampaigns([]);
        setLoading(false);
        return;
      }

      const r = await fetchUserRoleSafe(user.id);
      if (!mounted) return;
      setRole(r);

      // subscription (prefers user_subscriptions -> subscription_plans)
      const s = await fetchSubscriptionForUser(user.id);
      if (!mounted) return;
      setSub(s);

      // fetch active campaigns for this earner
      const ac = await fetchActiveCampaignsForUser(user.id);
      if (!mounted) return;
      setActiveCampaigns(ac);

      // Placeholder: compute earned amounts (replace with real aggregates from earnings_history)
      // For now show 0 until you wire earnings_history aggregation
      setWeeklyEarned(0);
      setMonthlyEarned(0);
      setAnnualEarned(0);

      setLoading(false);
    }
    loadAll();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <SignInPrompt />;

  // decide visual theme: creator = dark neon; earner = light/neon (we just toggle a CSS class inline)
  const isCreator = role === "creator";

  // subscription plan details — adapt depending on structure returned
  const plan = sub?.subscription_plans ?? null;
  // If your user_subscriptions stores plan_name rather than plan_id join, adapt to fetch from subscription_plans table by name

  // Render Creator UI
  if (isCreator) {
    return (
      <div
        style={{
          minHeight: "100vh",
          color: "#fff",
          background: "linear-gradient(180deg,#0b0f1a 0%, #071225 100%)",
          padding: 24,
        }}
      >
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/profitiv-logo-purple.svg" alt="Profitiv" style={{ height: 36 }} />
            <h2 style={{ margin: 0 }}>Creator Dashboard</h2>
          </div>
          <div style={{ opacity: 0.85 }}>Plan: {plan?.name ?? "—"}</div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)" }}>
              <h3>Campaigns</h3>
              <p>Create and manage video campaigns. You can publish up to your plan limit.</p>
              <button
                onClick={() => {
                  /* TODO: open create campaign modal */
                }}
              >
                Create New Campaign
              </button>

              {/* quick list of campaigns (replace with real campaigns query) */}
              <div style={{ marginTop: 12 }}>
                {/* Placeholder: show your campaigns list — fetch from campaigns where creator_id = user.id */}
                <div>No campaigns yet — use "Create New Campaign"</div>
              </div>
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)" }}>
            <h4>Wallet</h4>
            <div>Available: ${(sub?.creator_balance ?? 0).toFixed?.() ?? 0}</div>
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => {
                  /* TODO: navigate to creator wallet */
                }}
              >
                Withdraw
              </button>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 20 }}>
          <h3>Creator Tools</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.02)" }}>
              <strong>Publish Campaigns</strong>
              <div>Up to {plan?.annual_cap ?? "—"} views/month (plan)</div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default: Earner UI
  const weeklyCap = plan?.weekly_cap ?? 0;
  const monthlyCap = plan?.monthly_cap ?? 0;
  const annualCap = plan?.annual_cap ?? 0;

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "linear-gradient(180deg,#fafafa 0%, #f3f4f6 100%)" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/profitiv-logo-violet.svg" alt="Profitiv" style={{ height: 36 }} />
          <h2 style={{ margin: 0, color: "#111" }}>Earner Dashboard</h2>
        </div>
        <div style={{ color: "#333" }}>Plan: {plan?.name ?? "—"}</div>
      </header>

      <section style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <CapCard label="Weekly Earnings" current={weeklyEarned} cap={weeklyCap} />
        <CapCard label="Monthly Earnings" current={monthlyEarned} cap={monthlyCap} />
        <CapCard label="Annual Earnings" current={annualEarned} cap={annualCap} />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ padding: 16, borderRadius: 12, background: "#fff", boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
          <h3>Active Campaigns You’re In</h3>
          {activeCampaigns.length === 0 && <div>No active campaigns. Click "Watch & Earn" to find campaigns.</div>}
          {activeCampaigns.map((a: any) => (
            <div
              key={a.id}
              style={{ display: "flex", gap: 12, padding: 12, borderRadius: 8, border: "1px solid #eee", marginTop: 8 }}
            >
              <div
                style={{
                  width: 120,
                  height: 70,
                  background: "#000",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* If campaigns.video_url is YouTube you can render a thumbnail */}
                Video
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{a.campaigns?.title ?? "Untitled"}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Progress: {a.progress} / {a.campaigns?.requested_views ?? "—"}
                </div>
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => {
                      /* TODO: open video player & track progress */
                    }}
                  >
                    Continue Watching
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside
          style={{ padding: 16, borderRadius: 12, background: "#fff", boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}
        >
          <h4>Quick Actions</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => (window.location.href = "/campaigns")}>Watch a Video</button>
            <button onClick={() => (window.location.href = "/marketplace")}>TIV Marketplace</button>
            <button onClick={() => (window.location.href = "/withdraw")}>Withdraw Rewards</button>
          </div>

          <div style={{ marginTop: 20 }}>
            <h4>Recent Rewards</h4>
            <div>A simple log will show here once earnings_history is wired.</div>
          </div>
        </aside>
      </section>

      <section style={{ marginTop: 18 }}>
        <h3>How it works</h3>
        <p style={{ maxWidth: 700 }}>
          Earning potential varies based on participation. Your plan determines weekly/monthly/annual caps; actual
          earnings depend on completing verified tasks — watching videos, completing courses, joining campaigns. Payouts
          require KYC verification.
        </p>
      </section>
    </div>
  );
}
