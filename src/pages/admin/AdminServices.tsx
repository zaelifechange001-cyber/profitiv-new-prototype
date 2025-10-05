import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, GraduationCap, DollarSign, Zap } from "lucide-react";

export default function AdminServices() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Services Analytics</h2>
        <p className="text-muted-foreground">Performance metrics for each platform service</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Watch Videos</CardTitle>
              <CardDescription>Video completion and payout metrics</CardDescription>
            </div>
            <Video className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Videos Completed</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Payouts</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Watchers</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Learn & Earn</CardTitle>
              <CardDescription>Course completion and rewards</CardDescription>
            </div>
            <GraduationCap className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Course Completions</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Payout per User</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Learners</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Investment Pools</CardTitle>
              <CardDescription>Pool activity and deposits</CardDescription>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Pools</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Deposits</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending Payouts</span>
                <span className="font-bold">$0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Spin to Win</CardTitle>
              <CardDescription>Daily spins and rewards</CardDescription>
            </div>
            <Zap className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Spins Today</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rewards Distributed</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Streak Completions</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
