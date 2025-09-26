import { Button } from "@/components/ui/button";
import { Play, Gamepad2, Users, TrendingUp, Clock, DollarSign } from "lucide-react";

const earningMethods = [
  {
    icon: Play,
    title: "Watch Videos",
    description: "Earn money by watching sponsored videos and advertisements",
    earnings: "$0.01 - $0.30 per video",
    time: "15 seconds - 5 minutes",
    difficulty: "Beginner",
    color: "from-blue-500 to-purple-600",
    features: [
      "Short sponsored content",
      "Product advertisements", 
      "Survey-based videos",
      "Premium exclusive content"
    ]
  },
  {
    icon: Gamepad2,
    title: "Play Games",
    description: "Complete levels and achievements in casual games to earn rewards",
    earnings: "$0.05 - $0.50 per game",
    time: "2 - 15 minutes",
    difficulty: "Easy",
    color: "from-green-500 to-teal-600",
    features: [
      "Puzzle games",
      "Arcade classics",
      "Strategy challenges",
      "Achievement rewards"
    ]
  },
  {
    icon: Users,
    title: "Affiliate Marketing",
    description: "Build your network and earn commission from referral activities",
    earnings: "5% - 20% commission",
    time: "Ongoing passive income",
    difficulty: "Intermediate",
    color: "from-purple-500 to-pink-600",
    features: [
      "Product referrals",
      "Service promotions",
      "Network building",
      "Passive income streams"
    ]
  },
  {
    icon: TrendingUp,
    title: "Investment Returns",
    description: "Invest your earnings for guaranteed returns and compound growth",
    earnings: "2x - 5x returns",
    time: "24 - 72 hours",
    difficulty: "Advanced",
    color: "from-orange-500 to-red-600",
    features: [
      "Guaranteed returns",
      "Multiple investment tiers",
      "Compound interest",
      "Risk-free options"
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

        {/* Methods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {earningMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={method.title} className="earning-card p-8 hover-lift">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{method.title}</h3>
                    <p className="text-foreground/70">{method.description}</p>
                  </div>
                </div>

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