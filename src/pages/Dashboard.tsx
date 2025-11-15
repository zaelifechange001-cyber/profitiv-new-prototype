import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Diagnostic Dashboard
 * - Minimal UI
 * - Fetches raw rows from user_subscriptions and user_roles for the current user
 * - Prints full error objects to console
 * Use this to confirm what the front-end sees.
 */

function Loading() {
  return <div style={{ padding: 24 }}>Loading (diagnostic)…</div>;
}

function SignInPrompt() {
  return <div style={{ padding: 24 }}>Not signed in — please sign in to test.</div>;
}

export default function DashboardDiagnostic() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subRow, setSubRow] = useState<any>(null);
  const [roleRow, setRoleRow] = useState<any>(null);
  const [errorInfo, setErrorInfo] = useState<any>(null);

  // auth session listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => data?.subscription?.unsubscribe?.();
  }, []);

  // fetch minimal diagnostic data
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setSubRow(null);
      setRoleRow(null);
      setErrorInfo(null);

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Raw fetch of user_subscriptions (select *)
        const { data: subs, error: subErr } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id);

        if (!mounted) return;
        if (subErr) {
          console.error("user_subscriptions error:", subErr);
          setErrorInfo((prev: any) => ({ ...prev, user_subscriptions: subErr }));
        } else {
          console.log("user_subscriptions result:", subs);
          setSubRow(subs ?? null);
        }

        // Raw fetch of user_roles
        const { data: roles, error: roleErr } = await supabase.from("user_roles").select("*").eq("user_id", user.id);

        if (!mounted) return;
        if (roleErr) {
          console.error("user_roles error:", roleErr);
          setErrorInfo((prev: any) => ({ ...prev, user_roles: roleErr }));
        } else {
          console.log("user_roles result:", roles);
          setRoleRow(roles ?? null);
        }
      } catch (e) {
        console.error("Unexpected diagnostic error:", e);
        setErrorInfo((prev: any) => ({ ...prev, unexpected: String(e) }));
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <SignInPrompt />;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, Arial", lineHeight: 1.35 }}>
      <h2>Profitiv — Diagnostic Dashboard</h2>
      <p style={{ color: "#666" }}>This page only fetches raw rows to show what the app receives.</p>

      <section style={{ marginTop: 16 }}>
        <strong>Current user (auth session):</strong>
        <pre style={{ background: "#f7f7f7", padding: 12 }}>{JSON.stringify(user, null, 2)}</pre>
      </section>

      <section style={{ marginTop: 16 }}>
        <strong>user_subscriptions rows:</strong>
        <pre style={{ background: "#f7f7f7", padding: 12 }}>{JSON.stringify(subRow, null, 2)}</pre>
      </section>

      <section style={{ marginTop: 16 }}>
        <strong>user_roles rows:</strong>
        <pre style={{ background: "#f7f7f7", padding: 12 }}>{JSON.stringify(roleRow, null, 2)}</pre>
      </section>

      <section style={{ marginTop: 16 }}>
        <strong>Any errors (console also):</strong>
        <pre style={{ background: "#fff1f0", padding: 12, color: "#9b1c1c" }}>{JSON.stringify(errorInfo, null, 2)}</pre>
      </section>

      <div style={{ marginTop: 18, color: "#333" }}>
        <strong>Next:</strong> Copy any console errors or the JSON contents you see here and paste them back — I will
        act on them immediately.
      </div>
    </div>
  );
}
