import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Play, Users, Zap } from "lucide-react";
import { memo } from "react";

const HeroSectionComponent = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EAF6FF] to-[#F4F8FF]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#111] mb-6 leading-tight">
          Earn From the Brands You Help Grow
        </h1>
        <p className="text-xl text-[#444] mb-8 leading-relaxed max-w-3xl mx-auto">
          Watch, learn, and engage with real creators and brands. Every interaction moves campaigns forward — and every milestone earns you TIV rewards.
        </p>
        <Button 
          size="lg"
          className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-8 py-6 text-lg font-semibold rounded-lg transition-colors"
          onClick={() => window.location.href = '/auth'}
        >
          Start Earning
        </Button>
      </div>
    </section>
  );
};

HeroSectionComponent.displayName = 'HeroSection';

const HeroSection = memo(HeroSectionComponent);

export default HeroSection;