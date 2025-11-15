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

async function fetchUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.warn("subscription fetch error:", error);
    return null;
  }

  return data;
}

async function fetchUserRole(userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();

  return data?.role ?? "earner";
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [role, setRole] = useState<string>("earner");
  const [loading, setLoading] = useState(true);

  // Earnings (you can wire this later)
  const [weeklyEarned] = useState(0);
  const [monthlyEarned] = useState(0);
  const [annualEarned] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      setUser(session?.user ?? null);
    };
    init();

    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const [sub, r] = await Promise.all([fetchUserSubscription(user.id), fetchUserRole(user.id)]);

      setSubscription(sub);
      setRole(r);
      setLoading(false);
    };

    load();
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <SignInPrompt />;

  const isCreator = role === "creator";

  const weeklyCap = subscription?.weekly_cap ?? 0;
  const monthlyCap = subscription?.monthly_cap ?? 0;
  const annualCap = subscription?.annual_cap ?? 0;

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#f3f4f6" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/profitiv-logo-purple.svg" alt="Profitiv" style={{ height: 36 }} />
          <h2 style={{ margin: 0 }}>{isCreator ? "Creator Dashboard" : "Earner Dashboard"}</h2>
        </div>
        <div>Plan: {subscription?.plan_name ?? "—"}</div>
      </header>

      {!isCreator && (
        <>
          <section style={{ display: "flex", gap: 16 }}>
            <CapCard label="Weekly Earnings" current={weeklyEarned} cap={weeklyCap} />
            <CapCard label="Monthly Earnings" current={monthlyEarned} cap={monthlyCap} />
            <CapCard label="Annual Earnings" current={annualEarned} cap={annualCap} />
          </section>
        </>
      )}

      {isCreator && <div style={{ padding: 20 }}>Creator tools coming soon…</div>}
    </div>
  );
}
