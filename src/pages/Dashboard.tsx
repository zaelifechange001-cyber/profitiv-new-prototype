import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** SIMPLE LOADING + SIGN IN */
function Loading() {
  return <div style={{ padding: 20 }}>Loading dashboard…</div>;
}

function SignInPrompt() {
  return <div style={{ padding: 20 }}>Please sign in to view your dashboard.</div>;
}

/** SMALL CARD FOR DISPLAY / PROGRESS */
function CapCard({ label, current, cap }: { label: string; current: number; cap: number }) {
  const pct = cap > 0 ? Math.min(100, Math.round((current / cap) * 100)) : 0;

  return (
    <div
      style={{
        borderRadius: 12,
        padding: 14,
        minWidth: 180,
        background: "#fff",
        marginBottom: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>
        ${current} / ${cap}
      </div>
      <div style={{ height: 8, background: "#eee", borderRadius: 6, marginTop: 8 }}>
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

/** FETCH USER ROLE FROM user_subscriptions OR user_roles  */
async function fetchUserRoleSafe(userId: string | null) {
  if (!userId) return null;

  // Try user_subscriptions first
  try {
    const { data } = await supabase
      .from("user_subscriptions")
      .select("role")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (data?.role) return data.role;
  } catch {}

  // fallback to user_roles
  try {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();

    if (data?.role) return data.role;
  } catch {}

  return "earner";
}

/** FETCH SUBSCRIPTION FROM user_subscriptions (NO plan_id) */
async function fetchSubscriptionForUser(userId: string | null) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("plan_name, role, weekly_cap, monthly_cap, annual_cap, kyc_verified, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (error) return null;

    return data ?? null;
  } catch (e) {
    console.warn("subscription error:", e);
    return null;
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // placeholder totals (you hook earnings_history later)
  const [weeklyEarned, setWeeklyEarned] = useState(0);
  const [monthlyEarned, setMonthlyEarned] = useState(0);
  const [annualEarned, setAnnualEarned] = useState(0);

  /** AUTH LISTENER */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  /** LOAD ROLE + SUBSCRIPTION */
  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      if (!user?.id) {
        setRole(null);
        setSub(null);
        setLoading(false);
        return;
      }

      const r = await fetchUserRoleSafe(user.id);
      if (!mounted) return;
      setRole(r);

      const s = await fetchSubscriptionForUser(user.id);
      if (!mounted) return;
      setSub(s);

      setWeeklyEarned(0);
      setMonthlyEarned(0);
      setAnnualEarned(0);

      setLoading(false);
    }

    load();
    return () => (mounted = false);
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <SignInPrompt />;

  /** SUB info */
  const planName = sub?.plan_name ?? "—";
  const weeklyCap = sub?.weekly_cap ?? 0;
  const monthlyCap = sub?.monthly_cap ?? 0;
  const annualCap = sub?.annual_cap ?? 0;

  /** CREATOR VIEW */
  if (role === "creator") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(#0b0f1a,#071225)",
          color: "#fff",
          padding: 24,
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <img src="/profitiv-logo-purple.svg" style={{ height: 36 }} />
            <h2>Creator Dashboard</h2>
          </div>
          <div>Plan: {planName}</div>
        </header>

        <div>Welcome Creator — your tools go here.</div>
      </div>
    );
  }

  /** EARNER VIEW */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#fafafa,#f3f4f6)",
        padding: 24,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <img src="/profitiv-logo-purple.svg" style={{ height: 36 }} />
          <h2 style={{ margin: 0 }}>Earner Dashboard</h2>
        </div>
        <div>Plan: {planName}</div>
      </header>

      <section style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <CapCard label="Weekly Earnings" current={weeklyEarned} cap={weeklyCap} />
        <CapCard label="Monthly Earnings" current={monthlyEarned} cap={monthlyCap} />
        <CapCard label="Annual Earnings" current={annualEarned} cap={annualCap} />
      </section>

      <div style={{ marginTop: 20 }}>
        <h3>How it works</h3>
        <p>Earning potential varies based on participation. KYC is required for payouts.</p>
      </div>
    </div>
  );
}
