// src/pages/withdraw/Withdraw.tsx
import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  async function requestWithdraw() {
    const session = supabase.auth.session();
    if (!session?.user) {
      alert("Sign in");
      return;
    }
    const usdAmount = parseFloat(amount);
    if (isNaN(usdAmount) || usdAmount <= 0) {
      alert("Invalid amount");
      return;
    }
    // Insert withdraw request (admin/stripe flow handles payout)
    await supabase.from("withdraw_requests").insert({
      user_id: session.user.id,
      tiv_amount: Math.round(usdAmount * 100), // example conversion; adjust logic
      usd_amount: usdAmount,
      status: "pending",
    });
    alert("Withdraw request sent. KYC required before payout.");
    setAmount("");
  }
  return (
    <div style={{ padding: 24 }}>
      <h2>Request Payout</h2>
      <div>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="USD amount" />
        <button onClick={requestWithdraw}>Request Withdraw</button>
      </div>
    </div>
  );
}
