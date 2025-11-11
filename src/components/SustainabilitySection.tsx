const SustainabilitySection = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center">
          How Profitiv Sustains the Platform
        </h2>
        <div className="space-y-6 text-lg md:text-xl text-foreground/80 leading-relaxed">
          <p>
            Profitiv is built on a balanced ecosystem — where brands grow through engagement, creators expand their reach, and users are rewarded for authentic participation.
          </p>
          <p>
            Our revenue and reward systems are driven by a proprietary performance engine that ensures sustainable payouts, fair compensation, and continuous platform growth — without relying on investments or pooled funds.
          </p>
          <p>
            This approach keeps Profitiv independent, transparent, and built to last — rewarding everyone who helps power the network.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
