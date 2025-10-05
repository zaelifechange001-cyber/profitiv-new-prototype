import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default function AdminFinancial() {
  const [financialData, setFinancialData] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    platformProfit: 0,
    tivsInCirculation: 0,
    videoEarnings: 0,
    learningEarnings: 0,
    poolEarnings: 0,
    spinEarnings: 0,
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Get withdrawal data
        const { data: withdrawals } = await supabase
          .from('withdrawal_requests')
          .select('amount, net_amount, fee, status');

        const totalWithdrawals = withdrawals?.reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0;
        const platformProfit = withdrawals?.reduce((sum, w) => sum + Number(w.fee || 0), 0) || 0;

        // Get earnings by activity type
        const { data: activities } = await supabase
          .from('user_activities')
          .select('activity_type, amount');

        const videoEarnings = activities?.filter(a => a.activity_type === 'video_watch').reduce((sum, a) => sum + Number(a.amount || 0), 0) || 0;
        const learningEarnings = activities?.filter(a => a.activity_type === 'course_complete').reduce((sum, a) => sum + Number(a.amount || 0), 0) || 0;
        const poolEarnings = activities?.filter(a => a.activity_type === 'pool_reward').reduce((sum, a) => sum + Number(a.amount || 0), 0) || 0;
        const spinEarnings = activities?.filter(a => a.activity_type === 'spin_reward').reduce((sum, a) => sum + Number(a.amount || 0), 0) || 0;

        setFinancialData({
          totalDeposits: 0,
          totalWithdrawals,
          platformProfit,
          tivsInCirculation: 0,
          videoEarnings,
          learningEarnings,
          poolEarnings,
          spinEarnings,
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
      }
    };

    fetchFinancialData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financial Summary</h2>
        <p className="text-muted-foreground">Overview of platform finances</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.totalDeposits.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.totalWithdrawals.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.platformProfit.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TIVs in Circulation</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.tivsInCirculation}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown by Service</CardTitle>
          <CardDescription>Distribution of earnings across different platform services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Video Watching</p>
                <p className="text-sm text-muted-foreground">Earnings from video views</p>
              </div>
              <p className="text-2xl font-bold text-primary">${financialData.videoEarnings.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Learn & Earn</p>
                <p className="text-sm text-muted-foreground">Course completion rewards</p>
              </div>
              <p className="text-2xl font-bold text-primary">${financialData.learningEarnings.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Investment Pools</p>
                <p className="text-sm text-muted-foreground">Pool rewards and payouts</p>
              </div>
              <p className="text-2xl font-bold text-primary">${financialData.poolEarnings.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Spin to Win</p>
                <p className="text-sm text-muted-foreground">Daily spin rewards</p>
              </div>
              <p className="text-2xl font-bold text-primary">${financialData.spinEarnings.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
