import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, Download, Search } from "lucide-react";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    totalRewards: 0,
    totalPayouts: 0,
    totalMarketplace: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Fetch withdrawal requests with user data
      const { data: withdrawals } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch marketplace transactions
      const { data: marketplace } = await supabase
        .from('tiv_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch user activities (rewards)
      const { data: activities } = await supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch user profiles for all transactions
      const userIds = [
        ...new Set([
          ...(withdrawals?.map(w => w.user_id).filter(Boolean) || []),
          ...(marketplace?.map(m => m.seller_id).filter(Boolean) || []),
          ...(activities?.map(a => a.user_id).filter(Boolean) || []),
        ])
      ];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));

      // Combine and format all transactions
      const allTransactions = [
        ...(withdrawals || []).map(w => {
          const profile = profileMap.get(w.user_id);
          return {
            id: w.id,
            type: 'Payout',
            user: profile?.full_name || 'Unknown',
            email: profile?.email || '',
            amount: Number(w.amount),
            method: w.method,
            status: w.status,
            date: w.created_at,
            transactionId: w.id,
          };
        }),
        ...(marketplace || []).map(m => {
          const profile = profileMap.get(m.seller_id);
          return {
            id: m.id,
            type: 'Marketplace',
            user: profile?.full_name || 'Unknown',
            email: profile?.email || '',
            amount: Number(m.total_price),
            method: 'TIV Trade',
            status: m.status,
            date: m.created_at,
            transactionId: m.id,
          };
        }),
        ...(activities || []).map(a => {
          const profile = profileMap.get(a.user_id);
          return {
            id: a.id,
            type: 'Reward',
            user: profile?.full_name || 'Unknown',
            email: profile?.email || '',
            amount: Number(a.amount),
            method: a.activity_type,
            status: 'completed',
            date: a.created_at,
            transactionId: a.id,
          };
        }),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTransactions(allTransactions);

      // Calculate stats
      const totalPayouts = withdrawals?.reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0;
      const totalMarketplace = marketplace?.reduce((sum, m) => sum + Number(m.total_price || 0), 0) || 0;
      const totalRewards = activities?.reduce((sum, a) => sum + Number(a.amount || 0), 0) || 0;

      setStats({
        totalSubscriptions: 0, // TODO: Calculate from subscription payments
        totalRewards,
        totalPayouts,
        totalMarketplace,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "outline",
      completed: "default",
      approved: "default",
      rejected: "destructive",
      failed: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'User', 'Email', 'Amount', 'Method', 'Status', 'Transaction ID'];
    const rows = filteredTransactions.map(t => [
      new Date(t.date).toLocaleString(),
      t.type,
      t.user,
      t.email,
      t.amount.toFixed(2),
      t.method,
      t.status,
      t.transactionId,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === "all" || t.type.toLowerCase() === filter.toLowerCase();
    const matchesSearch = t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
            Transactions
          </h2>
          <p className="text-white/60 mt-1">All platform transactions and payments</p>
        </div>
        <Button
          onClick={exportToCSV}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalRewards.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Payouts</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalPayouts.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Marketplace</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalMarketplace.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Subscriptions</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalSubscriptions.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">All Transactions</CardTitle>
              <CardDescription className="text-white/60">
                Complete transaction history across all services
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-white w-64"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="reward">Rewards</SelectItem>
                  <SelectItem value="payout">Payouts</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="subscription">Subscriptions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              No transactions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/60">Type</TableHead>
                  <TableHead className="text-white/60">User</TableHead>
                  <TableHead className="text-white/60">Amount</TableHead>
                  <TableHead className="text-white/60">Method</TableHead>
                  <TableHead className="text-white/60">Status</TableHead>
                  <TableHead className="text-white/60">Date</TableHead>
                  <TableHead className="text-white/60">Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.slice(0, 50).map((txn) => (
                  <TableRow key={txn.id} className="border-white/10">
                    <TableCell>
                      <Badge variant="outline" className="bg-white/5 border-white/20 text-white">
                        {txn.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{txn.user}</p>
                        <p className="text-sm text-white/50">{txn.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-white">
                      ${txn.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-white/70">{txn.method}</TableCell>
                    <TableCell>{getStatusBadge(txn.status)}</TableCell>
                    <TableCell className="text-white/70">
                      {new Date(txn.date).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-white/50 text-xs font-mono">
                      {txn.transactionId.substring(0, 8)}...
                    </TableCell>
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
