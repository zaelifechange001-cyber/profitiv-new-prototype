import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, FileText, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [chartData, setChartData] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayouts: 0,
    activeCampaigns: 0,
    tivVolume: 0,
  });

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      // Fetch withdrawal data for revenue
      const { data: withdrawals } = await supabase
        .from('withdrawal_requests')
        .select('amount, fee, created_at')
        .eq('status', 'completed');

      const totalRevenue = withdrawals?.reduce((sum, w) => sum + Number(w.fee || 0), 0) || 0;
      const totalPayouts = withdrawals?.reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0;

      // Fetch active campaigns
      const { count: activeCampaigns } = await supabase
        .from('investment_videos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch TIV volume
      const { data: tivTxns } = await supabase
        .from('tiv_transactions')
        .select('amount')
        .eq('status', 'completed');

      const tivVolume = tivTxns?.reduce((sum, t) => sum + Number(t.amount || 0), 0) || 0;

      // Fetch top earners
      const { data: earners } = await supabase
        .from('profiles')
        .select('full_name, email, total_earned')
        .order('total_earned', { ascending: false })
        .limit(10);

      setTopUsers(earners || []);
      setStats({
        totalRevenue,
        totalPayouts,
        activeCampaigns: activeCampaigns || 0,
        tivVolume,
      });

      // Generate chart data based on time range
      generateChartData(withdrawals || []);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const generateChartData = (withdrawals: any[]) => {
    const now = new Date();
    const periods: any[] = [];

    if (timeRange === "daily") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        periods.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: date.toISOString().split('T')[0],
        });
      }
    } else if (timeRange === "weekly") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        periods.push({
          name: `Week ${4 - i}`,
          date: date.toISOString().split('T')[0],
        });
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        periods.push({
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          date: date.toISOString().split('T')[0],
        });
      }
    }

    const data = periods.map(period => {
      const periodWithdrawals = withdrawals.filter(w => {
        const wDate = new Date(w.created_at);
        const pDate = new Date(period.date);
        
        if (timeRange === "daily") {
          return wDate.toISOString().split('T')[0] === period.date;
        } else if (timeRange === "weekly") {
          return wDate >= pDate && wDate < new Date(pDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        } else {
          return wDate.getMonth() === pDate.getMonth() && wDate.getFullYear() === pDate.getFullYear();
        }
      });

      const revenue = periodWithdrawals.reduce((sum, w) => sum + Number(w.fee || 0), 0);
      const payouts = periodWithdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);

      return {
        name: period.name,
        revenue,
        payouts,
      };
    });

    setChartData(data);
  };

  const exportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export to PDF");
  };

  const exportCSV = () => {
    const headers = ['Period', 'Revenue', 'Payouts'];
    const rows = chartData.map(d => [d.name, d.revenue.toFixed(2), d.payouts.toFixed(2)]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profitiv-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
            Reports & Analytics
          </h2>
          <p className="text-white/60 mt-1">Generate and export platform reports</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily (7 days)</SelectItem>
              <SelectItem value="weekly">Weekly (4 weeks)</SelectItem>
              <SelectItem value="monthly">Monthly (6 months)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            onClick={exportPDF}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-white/50 mt-1">Platform fees collected</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalPayouts.toFixed(2)}</div>
            <p className="text-xs text-white/50 mt-1">Paid to users</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Active Campaigns</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.activeCampaigns}</div>
            <p className="text-xs text-white/50 mt-1">Running now</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">TIV Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.tivVolume.toFixed(0)}</div>
            <p className="text-xs text-white/50 mt-1">TIVs traded</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Revenue vs Payouts</CardTitle>
          <CardDescription className="text-white/60">
            Compare platform revenue and user payouts over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#7c3aed" name="Platform Revenue" />
              <Bar dataKey="payouts" fill="#0ea5e9" name="User Payouts" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Top Earning Users</CardTitle>
          <CardDescription className="text-white/60">
            Users with highest total earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{user.full_name || 'Unknown'}</p>
                    <p className="text-sm text-white/50">{user.email}</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-white">
                  ${Number(user.total_earned || 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
