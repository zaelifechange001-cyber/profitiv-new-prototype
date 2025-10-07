import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SpinWheelProps {
  streak: number;
}

const SpinWheel = ({ streak }: SpinWheelProps) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<number | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [cooldownMessage, setCooldownMessage] = useState("");

  useEffect(() => {
    checkCooldown();
  }, []);

  const checkCooldown = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('spin_history')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        const lastSpin = new Date(data.created_at);
        const now = new Date();
        const hoursSince = (now.getTime() - lastSpin.getTime()) / (1000 * 60 * 60);
        
        if (hoursSince < 24) {
          setCanSpin(false);
          const hoursLeft = Math.ceil(24 - hoursSince);
          setCooldownMessage(`Next spin available in ${hoursLeft} hours`);
        }
      }
    } catch (error) {
      console.log('No spin history yet');
    }
  };

  const handleSpin = async () => {
    if (spinning || !canSpin) return;

    setSpinning(true);
    setPrize(null);

    try {
      const { data, error } = await supabase.rpc('spin_wheel');

      if (error) throw error;

      const spinResult = data as any;
      const multiplier = streak >= 100 ? 2 : 1;
      const finalPrize = spinResult.reward_amount * multiplier;
      
      // Calculate rotation for animation
      const spins = 5 + Math.random() * 3;
      const degrees = spins * 360 + Math.random() * 360;
      setRotation(rotation + degrees);

      // Wait for animation
      setTimeout(() => {
        setPrize(finalPrize);
        setSpinning(false);
        setCanSpin(false);
        setCooldownMessage("Next spin available in 24 hours");
        
        toast({
          title: streak >= 100 ? "🎉 Streak Bonus!" : "🎁 You Won!",
          description: `You earned ${finalPrize} ${spinResult.reward_type.toUpperCase()}!${streak >= 100 ? " (Doubled!)" : ""}`,
        });
      }, 4000);

    } catch (error: any) {
      console.error('Error spinning wheel:', error);
      setSpinning(false);
      toast({
        title: "Error",
        description: error.message || "Failed to spin",
        variant: "destructive",
      });
    }
  };

  const prizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const colors = [
    "from-purple-500 to-pink-600",
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-purple-500 to-pink-600",
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-purple-500 to-pink-600",
    "from-blue-500 to-purple-600",
  ];

  const streakPercentage = Math.min((streak / 100) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Streak Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Daily Streak</span>
          <span className="text-sm font-bold text-gradient-hero">{streak}/100 days</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-profitiv-purple to-profitiv-teal transition-all duration-500"
            style={{ width: `${streakPercentage}%` }}
          />
        </div>
        {streak >= 100 && (
          <p className="text-xs text-profitiv-teal mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Next spin reward will be DOUBLED!
          </p>
        )}
      </div>

      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-profitiv-teal" />
        </div>

        {/* Wheel */}
        <div className="relative w-80 h-80 mx-auto">
          <div
            className="absolute inset-0 rounded-full transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)",
            }}
          >
            {prizes.map((num, index) => {
              const angle = (360 / prizes.length) * index;
              return (
                <div
                  key={index}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className={`absolute top-0 left-1/2 w-40 h-40 -ml-20 origin-bottom bg-gradient-to-br ${colors[index]} clip-segment`}
                    style={{
                      clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
                    }}
                  >
                    <div
                      className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold text-2xl"
                      style={{
                        transform: `rotate(${180 - angle}deg)`,
                      }}
                    >
                      {num}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-profitiv-purple to-profitiv-teal flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Spin Button & Result */}
      <div className="mt-8 text-center">
        {prize !== null && (
          <div className="mb-4 p-4 glass-card">
            <p className="text-sm text-foreground/60 mb-1">You won</p>
            <p className="text-3xl font-bold text-gradient-hero">{prize} TIVs</p>
          </div>
        )}
        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          onClick={handleSpin}
          disabled={spinning || !canSpin}
        >
          {spinning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Spinning...
            </>
          ) : canSpin ? (
            <>
              Spin to Win
              <Sparkles className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Come Back Tomorrow"
          )}
        </Button>
        <p className="text-xs text-foreground/60 mt-2">
          {cooldownMessage || "Daily spin available • Come back tomorrow for more!"}
        </p>
      </div>
    </div>
  );
};

export default SpinWheel;
