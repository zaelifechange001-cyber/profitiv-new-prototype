import { memo } from "react";

const BackgroundAnimationComponent = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Static gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 1200px 600px at 10% 10%, hsl(270 100% 58% / 0.12), transparent), radial-gradient(ellipse 900px 500px at 85% 85%, hsl(180 100% 50% / 0.06), transparent), linear-gradient(180deg, hsl(220 50% 4%), hsl(220 45% 6%))'
        }}
      />
      
      {/* Animated gradient overlay - CSS only with will-change */}
      <div 
        className="absolute -inset-[10%]"
        style={{
          background: 'linear-gradient(120deg, hsl(270 100% 58% / 0.25), hsl(180 100% 50% / 0.18), hsl(330 100% 70% / 0.12))',
          filter: 'blur(120px) saturate(120%)',
          mixBlendMode: 'screen',
          opacity: 0.7,
          animation: 'slowDrift 22s ease-in-out infinite',
          willChange: 'transform'
        }}
      />

      {/* Diagonal stripes - CSS only */}
      <div 
        className="absolute -inset-[20%]"
        style={{
          background: 'repeating-linear-gradient(135deg, transparent, transparent 12px, hsl(270 100% 58% / 0.04) 12px, hsl(270 100% 58% / 0.04) 24px, hsl(180 100% 50% / 0.04) 24px, hsl(180 100% 50% / 0.04) 36px)',
          mixBlendMode: 'overlay',
          opacity: 0.5,
          animation: 'stripeMove 18s linear infinite',
          willChange: 'transform'
        }}
      />

      {/* Orb 1 - purple glow */}
      <div 
        className="absolute"
        style={{
          left: '5%',
          top: '8%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, hsl(270 100% 58% / 0.35), hsl(330 100% 70% / 0.15), transparent)',
          filter: 'blur(60px)',
          animation: 'floatOrb1 25s ease-in-out infinite',
          willChange: 'transform'
        }}
      />

      {/* Orb 2 - cyan glow */}
      <div 
        className="absolute"
        style={{
          right: '5%',
          bottom: '8%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.3), hsl(200 100% 50% / 0.12), transparent)',
          filter: 'blur(60px)',
          animation: 'floatOrb2 28s ease-in-out infinite',
          willChange: 'transform'
        }}
      />

      {/* Center pulse */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, hsl(270 100% 58% / 0.15), transparent 60%)',
          filter: 'blur(80px)',
          animation: 'centerPulse 22s ease-in-out infinite',
          willChange: 'transform, opacity'
        }}
      />

      <style>{`
        @keyframes slowDrift {
          0% { transform: translate3d(-2%, 0, 0) rotate(0deg) scale(1); }
          50% { transform: translate3d(3%, 2%, 0) rotate(1deg) scale(1.02); }
          100% { transform: translate3d(-2%, 0, 0) rotate(0deg) scale(1); }
        }
        
        @keyframes stripeMove {
          0% { transform: translateX(-30%) rotate(0deg); }
          100% { transform: translateX(10%) rotate(0deg); }
        }
        
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 30px); }
        }
        
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, -20px); }
        }
        
        @keyframes centerPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.8; }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

BackgroundAnimationComponent.displayName = 'BackgroundAnimation';

export const BackgroundAnimation = memo(BackgroundAnimationComponent);
