import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

export default function PayoutSettings() {
  const [amount, setAmount] = useState("");
  
  async function requestWithdraw() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      alert("Please sign in");
      return;
    }
    const usdAmount = parseFloat(amount);
    if (isNaN(usdAmount) || usdAmount <= 0) {
      alert("Invalid amount");
      return;
    }
    // This is a placeholder - implement when withdraw_requests table exists
    alert("Payout feature coming soon!");
    setAmount("");
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Request Payout</h2>
        <div className="space-y-4">
          <input 
            className="w-full p-2 border rounded" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="USD amount" 
          />
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
            onClick={requestWithdraw}
          >
            Request Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
