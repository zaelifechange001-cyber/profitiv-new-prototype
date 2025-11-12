import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsersToday: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalProfit: 0,
  });
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [topEarners, setTopEarners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get active users today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: activeUsersToday } = await supabase
          .from('user_activities')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        // Get financial data
        const { data: withdrawals } = await supabase
          .from('withdrawal_requests')
          .select('amount, net_amount, status');

        const totalWithdrawals = withdrawals?.reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0;
        const totalProfit = withdrawals?.reduce((sum, w) => sum + (Number(w.amount || 0) - Number(w.net_amount || 0)), 0) || 0;

        // Get recent signups
        const { data: signups } = await supabase
          .from('profiles')
          .select('full_name, email, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        // Get top earners
        const { data: earners } = await supabase
          .from('profiles')
          .select('full_name, email, total_earned')
          .order('total_earned', { ascending: false })
          .limit(5);

        setStats({
          totalUsers: totalUsers || 0,
          activeUsersToday: activeUsersToday || 0,
          totalDeposits: 0,
          totalWithdrawals,
          totalProfit,
        });

        setRecentSignups(signups || []);
        setTopEarners(earners || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
          Overview
        </h2>
        <p className="text-white/60 mt-1">Platform statistics and insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.activeUsersToday}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Withdrawals</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalWithdrawals.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Platform Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Signups</CardTitle>
            <CardDescription className="text-white/60">Latest users who joined the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSignups.map((signup, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium text-white">{signup.full_name || 'Unknown'}</p>
                    <p className="text-sm text-white/50">{signup.email}</p>
                  </div>
                  <p className="text-sm text-white/60">
                    {new Date(signup.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Top Earners</CardTitle>
            <CardDescription className="text-white/60">Users with highest earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEarners.map((earner, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium text-white">{earner.full_name || 'Unknown'}</p>
                    <p className="text-sm text-white/50">{earner.email}</p>
                  </div>
                  <p className="font-bold text-white">
                    ${Number(earner.total_earned || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
