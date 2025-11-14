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
    <div style={{ borderRadius: 12, padding: 14, minWidth: 180, background: "rgba(0,0,0,0.05)", marginBottom: 12 }}>
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>
        ${current} / ${cap}
      </div>
      <div style={{ height: 8, background: "#ddd", borderRadius: 6, marginTop: 8 }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#7C3AED",
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
    const { data } = await supabase
      .from("user_subscriptions")
      .select("role")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (data?.role) return data.role;
  } catch {}

  try {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
    if (data?.role) return data.role;
  } catch {}

  return "earner";
}

/* ✅ FULLY FIXED — matches YOUR REAL user_subscriptions table */
async function fetchSubscriptionForUser(userId: string | null) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select(
        `
        id,
        user_id,
        plan_id,
        plan_name,
        status,
        subscription_plans:plan_id (
          id,
          name,
          role,
          price,
          weekly_cap,
          monthly_cap,
          annual_cap
        )
      `,
      )
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

  const [weeklyEarned] = useState(0);
  const [monthlyEarned] = useState(0);
  const [annualEarned] = useState(0);

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

    return () => {};
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
  const plan = sub?.subscription_plans;

  const weeklyCap = plan?.weekly_cap ?? 0;
  const monthlyCap = plan?.monthly_cap ?? 0;
  const annualCap = plan?.annual_cap ?? 0;

  if (isCreator) {
    return (
      <div style={{ minHeight: "100vh", padding: 24, background: "#0b0f1a", color: "#fff" }}>
        <h2>Creator Dashboard</h2>
        <div>Plan: {plan?.name ?? "—"}</div>
        <div>Create campaigns here...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#f6f6f6" }}>
      <header style={{ marginBottom: 20 }}>
        <h2>Earner Dashboard</h2>
        <div>Plan: {plan?.name ?? "—"}</div>
      </header>

      <section style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <CapCard label="Weekly Earnings" current={weeklyEarned} cap={weeklyCap} />
        <CapCard label="Monthly Earnings" current={monthlyEarned} cap={monthlyCap} />
        <CapCard label="Annual Earnings" current={annualEarned} cap={annualCap} />
      </section>

      <div>Welcome, Earner!</div>
    </div>
  );
}
