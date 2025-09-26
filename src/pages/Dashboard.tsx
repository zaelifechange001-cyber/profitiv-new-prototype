import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  Play, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const recentActivities = [
    {
      type: "Investment Completed",
      amount: "$10.00",
      date: "Jan 15, 2025",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      type: "New Investment", 
      amount: "$5.00",
      date: "Jan 12, 2025",
      icon: ArrowUpRight,
      color: "text-profitiv-purple"
    },
    {
      type: "Video Watched",
      amount: "$0.15",
      date: "Jan 10, 2025", 
      icon: Play,
      color: "text-profitiv-teal"
    },
    {
      type: "Game Completed",
      amount: "$0.25",
      date: "Jan 8, 2025",
      icon: Activity,
      color: "text-secondary"
    }
  ];

  const activeInvestments = [
    {
      id: "#12345678",
      amount: "$5.00",
      expectedReturn: "$10.00",
      created: "Jan 15, 2025",
      status: "Active"
    },
    {
      id: "#87654321", 
      amount: "$10.00",
      expectedReturn: "$20.00",
      created: "Jan 12, 2025",
      status: "Active"
    },
    {
      id: "#45678901",
      amount: "$3.00",
      expectedReturn: "$6.00", 
      created: "Jan 10, 2025",
      status: "Pending"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, <span className="text-gradient-hero">John Doe</span>
              </h1>
              <p className="text-foreground/60">Here's your earning summary for today</p>
            </div>
            <Button variant="gradient" size="lg">
              Request Payout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Available Balance */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">Available Balance</CardTitle>
                  <DollarSign className="w-4 h-4 text-profitiv-teal" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">$43.22</div>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">+$5.25</span>
                  <span className="text-sm text-foreground/60">today</span>
                </div>
                <p className="text-xs text-foreground/50 mt-2">Available for withdrawal</p>
              </CardContent>
            </div>

            {/* Total Earned */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">Total Earned</CardTitle>
                  <TrendingUp className="w-4 h-4 text-profitiv-purple" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">$157.45</div>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">12%</span>
                  <span className="text-sm text-foreground/60">this month</span>
                </div>
                <p className="text-xs text-foreground/50 mt-2">Lifetime earnings</p>
              </CardContent>
            </div>

            {/* Active Investments */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">Active Investments</CardTitle>
                  <Activity className="w-4 h-4 text-secondary" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">3</div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-sm text-warning">2 pending</span>
                </div>
                <p className="text-xs text-foreground/50 mt-2">Currently active investments</p>
              </CardContent>
            </div>

            {/* Subscription */}
            <div className="glass-card p-6 hover-lift">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/60">Subscription</CardTitle>
                  <Users className="w-4 h-4 text-profitiv-teal" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-gradient-hero mb-1">Premium</div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">Active</span>
                </div>
                <Button variant="link" className="text-xs p-0 h-auto mt-2 text-profitiv-teal">
                  Upgrade Plan
                </Button>
              </CardContent>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Investments Table */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Active Investments</h3>
                <Button variant="glass" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {activeInvestments.map((investment) => (
                  <div key={investment.id} className="earning-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">Investment {investment.id}</h4>
                        <p className="text-sm text-foreground/60">Created {investment.created}</p>
                      </div>
                      <div className={`badge ${investment.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                        {investment.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-foreground/60">Investment Amount</p>
                        <p className="font-semibold">{investment.amount}</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Expected Return</p>
                        <p className="font-semibold text-success">{investment.expectedReturn}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <Button variant="glass" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 earning-card">
                      <div className={`w-10 h-10 rounded-full bg-profitiv-purple/20 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.type}</h4>
                        <p className="text-sm text-foreground/60">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gradient-hero">{activity.amount}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;