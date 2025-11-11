import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, generateId } from "@/types/dashboard";
import { toast } from "sonner";

interface EarnerDashboardProps {
  onOpenMarketplace: () => void;
}

const EarnerDashboard = ({ onOpenMarketplace }: EarnerDashboardProps) => {
  const [tivBalance, setTivBalance] = useState(3250);
  const [cashBalance, setCashBalance] = useState(420);
  const [completedCampaigns, setCompletedCampaigns] = useState(18);
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: generateId(), title: 'Watch: Investment Tips (15 TIV)', reward: 15, type: 'tiv' },
    { id: generateId(), title: 'Mini Quiz: Marketing (cash $2)', reward: 2, type: 'cash' },
    { id: generateId(), title: 'Watch: Promo (5 TIV)', reward: 5, type: 'tiv' }
  ]);

  const [sellForm, setSellForm] = useState({ amount: '', price: '' });

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.type === 'tiv') {
      setTivBalance(prev => prev + task.reward);
    } else {
      setCashBalance(prev => prev + task.reward);
    }

    // TODO: In production, send completion to server for verification
    // POST /api/tasks/complete { taskId }
    // Server should verify completion, prevent abuse, and credit user
    console.log('Complete task (TODO: backend):', task);
    
    toast.success(`Earned ${task.type === 'tiv' ? task.reward + ' TIV' : '$' + task.reward}!`);
  };

  const handleSellTiv = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amt = parseInt(sellForm.amount, 10);
    const price = parseFloat(sellForm.price);
    
    if (!amt || !price) {
      toast.error('Enter amount and price');
      return;
    }

    if (amt > tivBalance) {
      toast.error('Insufficient TIV balance');
      return;
    }

    // TODO: POST order to server to create sell order and lock TIVs
    // POST /api/market/orders { amount, price }
    // Server must reserve TIVs, validate user balance, and publish the order
    console.log('Create sell order (TODO: backend):', { amount: amt, price });
    
    setSellForm({ amount: '', price: '' });
    toast.success('Sell order posted (demo). Backend integration required.');
  };

  const handlePayout = () => {
    // TODO: In production, call backend endpoint
    // POST /api/payouts/earner { userId, amount }
    // Server should:
    // 1. Verify user KYC if above thresholds
    // 2. Create payout via Stripe Payout API or Transfers
    console.log('Request payout (TODO: backend integration)');
    toast.info('Auto payout triggered (demo). Connect your backend to Stripe APIs.');
  };

  const simulateTaskEarn = () => {
    if (tasks.length > 0) {
      handleCompleteTask(tasks[0].id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Welcome back, <strong>Earner</strong></p>
              <h2 className="text-2xl font-bold">Earner Dashboard</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Plan</p>
              <div className="inline-block px-3 py-1 bg-muted rounded-full font-semibold text-sm mt-1">
                Builder
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">TIV Balance</p>
            <p className="text-4xl font-bold mb-1">{tivBalance.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Available to sell</p>
          </Card>
          
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Cash Balance</p>
            <p className="text-4xl font-bold mb-1">${cashBalance}</p>
            <p className="text-sm text-muted-foreground">Withdrawable via Stripe (after verification)</p>
          </Card>
          
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Completed Campaigns</p>
            <p className="text-4xl font-bold mb-1">{completedCampaigns}</p>
            <p className="text-sm text-muted-foreground">Verified completions</p>
          </Card>
        </div>

        {/* Available Campaigns */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Available Campaigns</h3>
              <p className="text-sm text-muted-foreground">Choose tasks you qualify for</p>
            </div>
            <Button variant="ghost" onClick={simulateTaskEarn}>
              Simulate Earn
            </Button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.type === 'tiv' ? `${task.reward} TIV` : `$${task.reward} cash`}
                    </p>
                  </div>
                  <Button variant="gradient" onClick={() => handleCompleteTask(task.id)}>
                    Complete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Sell TIVs Form */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Sell Your TIVs</h3>
              <p className="text-sm text-muted-foreground">
                Post TIVs for sale on the marketplace (creators can buy)
              </p>
            </div>
            <span className="text-sm text-muted-foreground">Sell-only for launch</span>
          </div>

          <form onSubmit={handleSellTiv} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Amount (TIV)"
                type="number"
                min="10"
                value={sellForm.amount}
                onChange={(e) => setSellForm({ ...sellForm, amount: e.target.value })}
                required
              />
              <Input
                placeholder="Price (USD)"
                type="number"
                min="1"
                step="0.01"
                value={sellForm.price}
                onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSellForm({ amount: '', price: '' })}
              >
                Reset
              </Button>
              <Button type="submit" variant="gradient">
                Post Sell Order
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Orders appear in the public marketplace. Profitiv monitors listings to prevent abuse.
            </p>
          </form>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Withdrawals Card */}
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Withdrawals (Auto)</p>
          <p className="text-4xl font-bold mb-2">$120</p>
          <p className="text-sm text-muted-foreground mb-4">
            Auto-payouts processed to your connected payout method. For compliance, large withdrawals may require ID verification.
          </p>
          
          <Button className="w-full" variant="gradient" onClick={handlePayout}>
            Request Payout (Simulate)
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3">
            Real payouts require backend server call to your payments provider (Stripe).
          </p>
        </Card>

        {/* Plan Card */}
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Plan Overview</p>
          <h3 className="text-2xl font-bold mb-4">Builder</h3>
          
          <div className="space-y-2 text-sm">
            <p><strong>Monthly earning cap:</strong> $1,000</p>
            <p><strong>Weekly withdrawal cap:</strong> $250</p>
            <p><strong>Features:</strong> Bonus campaigns, Learn-&-Earn courses</p>
          </div>
        </Card>

        {/* Marketplace Card */}
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Marketplace</p>
          
          <Button className="w-full mt-4" variant="ghost" onClick={onOpenMarketplace}>
            Open Marketplace
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3">
            Sell orders can be cancelled anytime before a buyer completes purchase.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default EarnerDashboard;
