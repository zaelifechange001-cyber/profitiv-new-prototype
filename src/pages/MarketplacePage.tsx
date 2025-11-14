// src/pages/marketplace/Marketplace.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Marketplace() {
  const [inventory, setInventory] = useState<any[]>([]);
  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.from("tiv_inventory").select("*, auth_users:user_id(id,email)");
      if (!mounted) return;
      setInventory(data ?? []);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h2>TIV Marketplace</h2>
      <div>Creators can buy TIV packs. Earners can sell TIVs (if enabled).</div>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {inventory.map((i) => (
            <div key={i.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
              <div>Owner: {i.user_id}</div>
              <div>TIV balance: {i.tiv_balance}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
