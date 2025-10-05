import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

interface UserBalanceManagerProps {
  userId: string;
  currentBalance: number;
  onUpdate: () => void;
}

export function UserBalanceManager({ userId, currentBalance, onUpdate }: UserBalanceManagerProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const changeAmount = parseFloat(amount);
      if (isNaN(changeAmount) || changeAmount <= 0) {
        throw new Error("Invalid amount");
      }

      const newBalance = operation === "add" 
        ? currentBalance + changeAmount 
        : currentBalance - changeAmount;

      if (newBalance < 0) {
        throw new Error("Balance cannot be negative");
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          available_balance: newBalance,
          total_earned: operation === "add" ? currentBalance + changeAmount : currentBalance
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Log the activity
      await supabase.from('user_activities').insert({
        user_id: userId,
        activity_type: 'admin_adjustment',
        description: `Admin ${operation === "add" ? "added" : "subtracted"} $${changeAmount}`,
        amount: operation === "add" ? changeAmount : -changeAmount
      });

      toast({
        title: "Success",
        description: `Balance ${operation === "add" ? "increased" : "decreased"} by $${changeAmount}`,
      });

      setOpen(false);
      setAmount("");
      onUpdate();
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update balance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <DollarSign className="h-4 w-4 mr-2" />
          Adjust Balance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust User Balance</DialogTitle>
          <DialogDescription>
            Current balance: ${currentBalance.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="operation">Operation</Label>
            <Select value={operation} onValueChange={(v) => setOperation(v as "add" | "subtract")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Funds</SelectItem>
                <SelectItem value="subtract">Subtract Funds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Update Balance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
