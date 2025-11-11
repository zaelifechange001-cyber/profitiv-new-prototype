import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Testimonial {
  quote: string;
  author: string;
}

interface TestimonialsSectionProps {
  role: "earner" | "creator";
  testimonials: Testimonial[];
  ctaText: string;
  ctaLink: string;
}

const TestimonialsSection = ({ role, testimonials, ctaText, ctaLink }: TestimonialsSectionProps) => {
  const isCreator = role === "creator";

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/50 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${isCreator ? 'from-profitiv-purple/5' : 'from-profitiv-teal/5'} via-transparent to-transparent pointer-events-none`} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {isCreator ? "Trusted by Brands & " : "What "}
            <span className="text-gradient-hero">{isCreator ? "Creators" : "Earners Say"}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card p-8 hover-lift">
              <blockquote className="text-lg md:text-xl font-semibold text-foreground mb-4">
                "{testimonial.quote}"
              </blockquote>
              <cite className="text-sm text-muted-foreground not-italic">— {testimonial.author}</cite>
            </Card>
          ))}
        </div>

        <div className="glass-card p-8 md:p-12 text-center bg-gradient-to-br from-profitiv-teal/10 to-profitiv-purple/10 border-2 border-profitiv-teal/20">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gradient-hero">
            {ctaText}
          </h3>
          <Button 
            variant="gradient" 
            size="lg"
            className="min-h-[48px] px-8"
            onClick={() => window.location.href = ctaLink}
          >
            {isCreator ? "Get Started — Creator Signup" : "Get Started — Create Your Account"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
