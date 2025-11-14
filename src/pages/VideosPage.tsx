// src/pages/campaigns/Campaigns.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (!mounted) return;
      setCampaigns(data ?? []);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Campaigns</h2>
      {campaigns.length === 0 && <div>No campaigns yet.</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 12 }}>
        {campaigns.map((c) => (
          <div key={c.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              {c.category} • {c.requested_views} views requested
            </div>
            <div style={{ marginTop: 8 }}>{c.description}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button onClick={() => (window.location.href = `/campaign/${c.id}`)}>View</button>
              <button
                onClick={async () => {
                  // join campaign: creates active_campaigns entry for current user
                  const session = supabase.auth.session();
                  if (!session?.user) {
                    alert("Sign in to join.");
                    return;
                  }
                  await supabase.from("active_campaigns").insert({ campaign_id: c.id, user_id: session.user.id });
                  alert("Joined campaign — find it in your dashboard.");
                }}
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
