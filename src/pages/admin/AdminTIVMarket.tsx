import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function AdminTIVMarket() {
  const [stats, setStats] = useState({
    currentRate: 0,
    soldToday: 0,
    boughtToday: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: txns } = await supabase
        .from('tiv_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch seller and buyer profiles separately
      if (txns && txns.length > 0) {
        const sellerIds = [...new Set(txns.map(t => t.seller_id))];
        const buyerIds = [...new Set(txns.filter(t => t.buyer_id).map(t => t.buyer_id))];
        const allUserIds = [...new Set([...sellerIds, ...buyerIds])];

        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', allUserIds);

        // Merge profiles with transactions
        const mergedTxns = txns.map(t => ({
          ...t,
          seller: profiles?.find(p => p.user_id === t.seller_id) || { full_name: 'Unknown', email: 'Unknown' },
          buyer: t.buyer_id ? profiles?.find(p => p.user_id === t.buyer_id) || { full_name: 'Unknown', email: 'Unknown' } : null
        }));
        setTransactions(mergedTxns);
      } else {
        setTransactions([]);
      }

      const soldToday = txns?.filter(t => 
        new Date(t.created_at) >= today && t.status === 'completed'
      ).reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const boughtToday = txns?.filter(t => 
        new Date(t.created_at) >= today && t.status === 'completed'
      ).length || 0;

      // Calculate average rate from recent transactions
      const recentCompleted = txns?.filter(t => t.status === 'completed').slice(0, 10) || [];
      const avgRate = recentCompleted.length > 0
        ? recentCompleted.reduce((sum, t) => sum + Number(t.rate), 0) / recentCompleted.length
        : 0;

      setStats({
        currentRate: avgRate,
        soldToday,
        boughtToday,
      });
      setTransactions(txns || []);
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      completed: "default",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">TIV Marketplace</h2>
        <p className="text-muted-foreground">Track TIV trading activity and market rates</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current TIV Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.currentRate.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per TIV</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TIVs Sold Today</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.soldToday}</div>
            <p className="text-xs text-muted-foreground">Total TIVs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.boughtToday}</div>
            <p className="text-xs text-muted-foreground">Completed trades</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest TIV marketplace activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{txn.seller?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{txn.seller?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {txn.buyer ? (
                        <div>
                          <p className="font-medium">{txn.buyer?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{txn.buyer?.email}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-bold">{Number(txn.amount).toFixed(0)} TIV</TableCell>
                    <TableCell>${Number(txn.rate).toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-primary">${Number(txn.total_price).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(txn.status)}</TableCell>
                    <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
