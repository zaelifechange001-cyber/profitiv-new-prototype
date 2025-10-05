import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles!withdrawal_requests_user_id_fkey (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Withdrawal ${status}`,
      });

      fetchWithdrawals();
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to update withdrawal status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
      completed: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Withdrawals</h2>
        <p className="text-muted-foreground">Manage withdrawal requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>Review and process user withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{withdrawal.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{withdrawal.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">${Number(withdrawal.amount).toFixed(2)}</TableCell>
                  <TableCell>{withdrawal.method}</TableCell>
                  <TableCell>${Number(withdrawal.fee).toFixed(2)}</TableCell>
                  <TableCell className="font-medium text-primary">
                    ${Number(withdrawal.net_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                  <TableCell>{new Date(withdrawal.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateStatus(withdrawal.id, 'approved')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(withdrawal.id, 'rejected')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {withdrawal.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdateStatus(withdrawal.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
