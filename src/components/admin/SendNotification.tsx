import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

interface SendNotificationProps {
  userId?: string;
  userName?: string;
}

export function SendNotification({ userId, userName }: SendNotificationProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"bonus" | "alert" | "announcement">("announcement");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bonusAmount = type === "bonus" ? parseFloat(amount) : 0;

      if (userId) {
        // Send to specific user
        const { error } = await supabase.from('admin_notifications').insert({
          user_id: userId,
          message,
          amount: bonusAmount,
          notification_type: type
        });

        if (error) throw error;

        // If it's a bonus, update their balance
        if (type === "bonus" && bonusAmount > 0) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('available_balance, total_earned')
            .eq('user_id', userId)
            .single();

          if (profile) {
            await supabase
              .from('profiles')
              .update({
                available_balance: Number(profile.available_balance) + bonusAmount,
                total_earned: Number(profile.total_earned) + bonusAmount
              })
              .eq('user_id', userId);

            await supabase.from('user_activities').insert({
              user_id: userId,
              activity_type: 'bonus',
              description: message,
              amount: bonusAmount
            });
          }
        }
      } else {
        // Send to all users
        const { data: users } = await supabase.from('profiles').select('user_id');
        
        if (users) {
          const notifications = users.map(user => ({
            user_id: user.user_id,
            message,
            amount: bonusAmount,
            notification_type: type
          }));

          const { error } = await supabase.from('admin_notifications').insert(notifications);
          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: userId ? `Notification sent to ${userName}` : "Notification sent to all users",
      });

      setOpen(false);
      setMessage("");
      setAmount("");
      setType("announcement");
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          {userId ? "Send Message" : "Broadcast to All"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            {userId ? `Send a message to ${userName}` : "Broadcast to all users"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="bonus">Bonus (with funds)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {type === "bonus" && (
            <div className="space-y-2">
              <Label htmlFor="amount">Bonus Amount ($)</Label>
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
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
