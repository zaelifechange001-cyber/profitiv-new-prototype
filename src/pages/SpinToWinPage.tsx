import Navigation from "@/components/Navigation";
import SpinWheel from "@/components/SpinWheel";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";

const SpinToWinPage = () => {
  // Mock streak data - in real app this would come from backend
  const currentStreak = 45;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">Spin to Win</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Log in daily and spin the wheel to win TIVs. Build your streak to unlock bonus multipliers!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass-card p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-profitiv-teal" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{currentStreak}</div>
              <p className="text-foreground/60">Current Streak</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-profitiv-purple" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">1-10</div>
              <p className="text-foreground/60">TIVs per Spin</p>
            </div>
            <div className="glass-card p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">2x</div>
              <p className="text-foreground/60">Bonus at 100% Streak</p>
            </div>
          </div>

          {/* Spin Wheel Component */}
          <div className="glass-card p-8 mb-16">
            <SpinWheel streak={currentStreak} />
          </div>

          {/* How it Works */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-bold mb-2">Log In Daily</h3>
                <p className="text-sm text-foreground/70">
                  Come back every day to maintain your streak and unlock bonus multipliers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-bold mb-2">Spin the Wheel</h3>
                <p className="text-sm text-foreground/70">
                  Each day you can spin once to win between 1-10 TIVs randomly
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-bold mb-2">Build Your Streak</h3>
                <p className="text-sm text-foreground/70">
                  Reach 100 days streak and your next reward will be doubled!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinToWinPage;
