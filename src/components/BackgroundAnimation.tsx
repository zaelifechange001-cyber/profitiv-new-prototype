import { memo, useEffect } from "react";

const BackgroundAnimationComponent = () => {
  // Force-disable continuous animations globally while this component is mounted
  useEffect(() => {
    document.documentElement.classList.add('profitiv-anim-off');
    return () => document.documentElement.classList.remove('profitiv-anim-off');
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Static gradient base (no animations) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 1200px 600px at 10% 10%, hsl(var(--primary) / 0.12), transparent), radial-gradient(ellipse 900px 500px at 85% 85%, hsl(var(--secondary) / 0.06), transparent), linear-gradient(180deg, hsl(var(--graphite)), hsl(var(--graphite-2)))',
        }}
      />

      {/* Stripes layer (static) */}
      <div
        className="absolute -inset-[20%]"
        style={{
          background:
            'repeating-linear-gradient(135deg, transparent, transparent 12px, hsl(var(--primary) / 0.04) 12px, hsl(var(--primary) / 0.04) 24px, hsl(var(--secondary) / 0.04) 24px, hsl(var(--secondary) / 0.04) 36px)',
          mixBlendMode: 'overlay' as any,
          opacity: 0.45,
        }}
      />

      {/* Static orbs (no float animations) */}
      <div
        className="absolute"
        style={{
          left: '5%',
          top: '8%',
          width: '560px',
          height: '560px',
          background:
            'radial-gradient(circle, hsl(var(--primary) / 0.32), hsl(var(--primary-glow) / 0.14), transparent 70%)',
          filter: 'blur(56px)',
        }}
      />

      <div
        className="absolute"
        style={{
          right: '5%',
          bottom: '8%',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, hsl(var(--secondary) / 0.28), hsl(var(--secondary-glow) / 0.12), transparent 70%)',
          filter: 'blur(56px)',
        }}
      />

      {/* Static center glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '660px',
          height: '660px',
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.14), transparent 60%)',
          filter: 'blur(70px)',
          opacity: 0.7,
        }}
      />

      {/* Global overrides to disable heavy loops without changing markup */}
      <style>{`
        :root.profitiv-anim-off .animate-pulse,
        :root.profitiv-anim-off .marketplace-card,
        :root.profitiv-anim-off .profitiv-wordmark,
        :root.profitiv-anim-off .glass-shimmer,
        :root.profitiv-anim-off .bg-motion,
        :root.profitiv-anim-off .hero-glow,
        :root.profitiv-anim-off [style*="animation:"] {
          animation: none !important;
        }
        /* Keep interactive accordions/menus intact */
        :root.profitiv-anim-off .animate-accordion-down,
        :root.profitiv-anim-off .animate-accordion-up,
        :root.profitiv-anim-off .animate-fade-in,
        :root.profitiv-anim-off .animate-fade-out,
        :root.profitiv-anim-off .animate-scale-in,
        :root.profitiv-anim-off .animate-scale-out,
        :root.profitiv-anim-off .animate-slide-in-right,
        :root.profitiv-anim-off .animate-slide-out-right {
          animation: none !important;
        }
      `}</style>
    </div>
  );
};

BackgroundAnimationComponent.displayName = 'BackgroundAnimation';

export const BackgroundAnimation = memo(BackgroundAnimationComponent);
