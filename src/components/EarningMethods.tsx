import { Button } from "@/components/ui/button";
import { Play, Users, TrendingUp, Clock, DollarSign, Sparkles, GraduationCap, Video, Zap, Trophy, BookOpen, CoinsIcon } from "lucide-react";
import { memo } from "react";

// Individual Earnings (Instant Rewards)
const individualEarnings = [
  {
    icon: Play,
    title: "Deposit & Watch Videos",
    description: "Deposit money, watch sponsored videos, and earn cash instantly once the video is completed",
    earnings: "$0.05 - $0.50 per video",
    time: "Instant",
    difficulty: "Beginner",
    color: "from-blue-500 to-purple-600",
    features: [
      "Instant cash rewards",
      "Sponsored video content",
      "No waiting period",
      "Deposit to unlock premium videos"
    ]
  },
  {
    icon: Sparkles,
    title: "Spin-to-Win",
    description: "Log in daily to spin the Profitiv Wheel for random prizes (TIVs). Track your streak for bonus rewards",
    earnings: "1-10 TIVs per spin",
    time: "Daily",
    difficulty: "Beginner",
    color: "from-purple-500 to-pink-600",
    features: [
      "Daily login rewards",
      "Win up to 10 TIVs",
      "Streak tracking system",
      "100% streak = doubled rewards"
    ]
  },
  {
    icon: GraduationCap,
    title: "Learn & Earn",
    description: "Complete short learning modules or quizzes. Instantly earn money or TIVs upon completion",
    earnings: "$0.10 - $1.00 per module",
    time: "5-10 minutes",
    difficulty: "Easy",
    color: "from-green-500 to-teal-600",
    features: [
      "Educational content",
      "Quick quizzes",
      "Instant TIV rewards",
      "Knowledge + earnings"
    ]
  }
];

// Community Pools (Group Campaigns)
const communityPools = [
  {
    icon: Video,
    title: "Video Investment Pools",
    description: "Join other users in funding a video campaign. Once the community reaches the target views, your deposit flips into profit",
    earnings: "2x - 3x returns",
    time: "24-48 hours",
    difficulty: "Intermediate",
    color: "from-blue-500 to-cyan-600",
    features: [
      "Community-funded campaigns",
      "Target view goals",
      "Profit sharing",
      "Group success rewards"
    ]
  },
  {
    icon: Zap,
    title: "Collaboration Pools",
    description: "Work together by pooling deposits. When enough users join the pool, it flips into higher returns for everyone",
    earnings: "2x - 4x returns",
    time: "48-72 hours",
    difficulty: "Intermediate",
    color: "from-purple-500 to-indigo-600",
    features: [
      "Team pooling system",
      "Shared investment",
      "Higher returns together",
      "Community rewards"
    ]
  },
  {
    icon: Trophy,
    title: "Jackpot Pools",
    description: "Deposit money into the monthly jackpot pool. Winners are drawn from all participants when the target is hit",
    earnings: "Up to $10,000",
    time: "Monthly draws",
    difficulty: "Easy",
    color: "from-orange-500 to-red-600",
    features: [
      "Monthly prize pool",
      "Random winner draws",
      "Growing jackpots",
      "Multiple winners"
    ]
  },
  {
    icon: BookOpen,
    title: "Learning Pools",
    description: "Users invest together in community learning campaigns. When enough people finish the course, everyone doubles their investment",
    earnings: "2x returns",
    time: "1-2 weeks",
    difficulty: "Intermediate",
    color: "from-green-500 to-emerald-600",
    features: [
      "Community courses",
      "Shared learning goals",
      "Doubled investments",
      "Educational rewards"
    ]
  }
];

const EarningMethodsComponent = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Bottom Stats */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-2xl font-bold mb-6">Ready to Start Earning?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-gradient-hero mb-2">$3000</div>
              <div className="text-foreground/60">Average monthly earnings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-hero mb-2">24/7</div>
              <div className="text-foreground/60">Earning opportunities available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-hero mb-2">instant</div>
              <div className="text-foreground/60">Account setup & start earning</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

EarningMethodsComponent.displayName = 'EarningMethods';

const EarningMethods = memo(EarningMethodsComponent);

export default EarningMethods;