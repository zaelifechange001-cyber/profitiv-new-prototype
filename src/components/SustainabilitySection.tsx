const SustainabilitySection = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          How Profitiv <span className="text-gradient-hero">Sustains Growth</span>
        </h2>
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
          Profitiv operates the platform by reinvesting a portion of engagement fees to fund rewards and maintain secure operations. 
          We prioritize transparent tracking and compliance; detailed payout terms are provided in your dashboard and agreement.
        </p>
      </div>
    </section>
  );
};

export default SustainabilitySection;
