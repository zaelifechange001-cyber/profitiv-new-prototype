import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function Loading() {
  return <div style={{ padding: 20 }}>Loading dashboard…</div>;
}

function SignInPrompt() {
  return <div style={{ padding: 20 }}>Please sign in to view your dashboard.</div>;
}

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

async function fetchUserRoleSafe(userId: string | null) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("role")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (!error && data?.role) return data.role;
  } catch (e) {
    console.warn("fetch role (user_subscriptions) error:", e);
  }
  try {
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
    if (!error && data?.role) return data.role;
  } catch (e) {
    console.warn("fetch role (user_roles) error:", e);
  }
  // Default
  return "earner";
}

async function fetchSubscriptionForUser(userId: string | null) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("role, plan_name, weekly_cap, monthly_cap, annual_cap, kyc_verified")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (error) {
      console.warn("subscription fetch error:", error);
      return null;
    }
    return data ?? null;
  } catch (e) {
    console.warn("subscription fetch unexpected error:", e);
    return null;
  }
}

export default function DashboardPage(props: { user?: any }) {
  const [user, setUser] = useState<any>(props.user ?? null);
  const [role, setRole] = useState<string | null>(null);
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyEarned, setWeeklyEarned] = useState<number>(0);
  const [monthlyEarned, setMonthlyEarned] = useState<number>(0);
  const [annualEarned, setAnnualEarned] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      // ignore for now
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
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
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <SignInPrompt />;

  const isCreator = role === "creator";
  const planName = sub?.plan_name ?? "—";
  const weeklyCap = sub?.weekly_cap ?? 0;
  const monthlyCap = sub?.monthly_cap ?? 0;
  const annualCap = sub?.annual_cap ?? 0;

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
          <div style={{ opacity: 0.85 }}>Plan: {planName}</div>
        </header>
        {/* Creator UI content here */}
        <div>Welcome, Creator!</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "linear-gradient(180deg,#fafafa 0%, #f3f4f6 100%)" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/profitiv-logo-purple.svg" alt="Profitiv" style={{ height: 36 }} />
          <h2 style={{ margin: 0, color: "#111" }}>Earner Dashboard</h2>
        </div>
        <div style={{ color: "#333" }}>Plan: {planName}</div>
      </header>
      <section style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <CapCard label="Weekly Earnings" current={weeklyEarned} cap={weeklyCap} />
        <CapCard label="Monthly Earnings" current={monthlyEarned} cap={monthlyCap} />
        <CapCard label="Annual Earnings" current={annualEarned} cap={annualCap} />
      </section>
      {/* Earner UI content here */}
      <div>Welcome, Earner!</div>
    </div>
  );
}
