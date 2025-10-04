import { Button } from "@/components/ui/button";
import { Play, Users, TrendingUp, Clock, DollarSign, Sparkles, GraduationCap, Video, Zap, Trophy, BookOpen, CoinsIcon } from "lucide-react";

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

const EarningMethods = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Multiple Ways to <span className="text-gradient-hero">Earn Money</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Choose your preferred earning method or combine multiple strategies to maximize your income potential.
          </p>
        </div>

        {/* Individual Earnings Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-profitiv-teal" />
            <h3 className="text-2xl font-bold">Individual Earnings</h3>
            <span className="text-sm text-profitiv-teal font-medium">Instant Rewards</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {individualEarnings.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.title} className="earning-card p-8 hover-lift">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{method.title}</h4>
                    </div>
                  </div>

                  <p className="text-foreground/70 mb-6">{method.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="w-4 h-4 text-profitiv-teal mr-1" />
                        <span className="text-sm font-medium text-profitiv-teal">Earnings</span>
                      </div>
                      <div className="text-sm font-semibold">{method.earnings}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-4 h-4 text-profitiv-purple mr-1" />
                        <span className="text-sm font-medium text-profitiv-purple">Time</span>
                      </div>
                      <div className="text-sm font-semibold">{method.time}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-4 h-4 text-secondary mr-1" />
                        <span className="text-sm font-medium text-secondary">Level</span>
                      </div>
                      <div className="text-sm font-semibold">{method.difficulty}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {method.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-profitiv-teal" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button variant="earnings" className="w-full" size="lg">
                    Start {method.title}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Pools Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-profitiv-purple" />
            <h3 className="text-2xl font-bold">Community Pools</h3>
            <span className="text-sm text-profitiv-purple font-medium">Group Campaigns</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {communityPools.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.title} className="earning-card p-8 hover-lift">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{method.title}</h4>
                    </div>
                  </div>

                  <p className="text-foreground/70 mb-6">{method.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="w-4 h-4 text-profitiv-teal mr-1" />
                        <span className="text-sm font-medium text-profitiv-teal">Returns</span>
                      </div>
                      <div className="text-sm font-semibold">{method.earnings}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-4 h-4 text-profitiv-purple mr-1" />
                        <span className="text-sm font-medium text-profitiv-purple">Duration</span>
                      </div>
                      <div className="text-sm font-semibold">{method.time}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-4 h-4 text-secondary mr-1" />
                        <span className="text-sm font-medium text-secondary">Level</span>
                      </div>
                      <div className="text-sm font-semibold">{method.difficulty}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {method.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-profitiv-purple" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button variant="earnings" className="w-full" size="lg">
                    Join Pool
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marketplace Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <CoinsIcon className="w-6 h-6 text-warning" />
            <h3 className="text-2xl font-bold">Marketplace</h3>
            <span className="text-sm text-warning font-medium">TIV Exchange</span>
          </div>
          <div className="earning-card p-8 hover-lift max-w-2xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <CoinsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-1">TIV Bidding Marketplace</h4>
              </div>
            </div>

            <p className="text-foreground/70 mb-6">
              Earn TIVs from other services. Sell your TIVs to other users in a live bid/ask system. Converts TIVs into cash instantly once another user buys them.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-4 h-4 text-profitiv-teal mr-1" />
                  <span className="text-sm font-medium text-profitiv-teal">Exchange</span>
                </div>
                <div className="text-sm font-semibold">TIVs → Cash</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-profitiv-purple mr-1" />
                  <span className="text-sm font-medium text-profitiv-purple">Speed</span>
                </div>
                <div className="text-sm font-semibold">Instant</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4 text-secondary mr-1" />
                  <span className="text-sm font-medium text-secondary">Level</span>
                </div>
                <div className="text-sm font-semibold">All Levels</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                <span className="text-sm text-foreground/80">Live bid/ask trading system</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                <span className="text-sm text-foreground/80">Instant TIV to cash conversion</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                <span className="text-sm text-foreground/80">User-to-user trading</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                <span className="text-sm text-foreground/80">Market-driven pricing</span>
              </div>
            </div>

            {/* CTA */}
            <Button variant="earnings" className="w-full" size="lg">
              Visit Marketplace
            </Button>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-2xl font-bold mb-6">Ready to Start Earning?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-gradient-hero mb-2">$157</div>
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
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="gradient" size="lg">
              Create Free Account
            </Button>
            <Button variant="glass" size="lg">
              Explore Methods
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarningMethods;