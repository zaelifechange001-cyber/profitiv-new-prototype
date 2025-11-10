import { memo } from "react";

const BackgroundAnimationComponent = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" style={{ contain: 'layout style paint' }}>
      {/* Secondary depth glow - faint darker layer */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(26, 0, 38, 0.4), transparent 70%)',
          filter: 'blur(150px)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
      
      {/* Stripes overlay with cyan/purple */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-overlay animate-stripes"
        style={{
          background: 'repeating-linear-gradient(135deg, rgba(138,43,226,0.04) 0 6px, rgba(0,255,255,0.04) 6px 12px)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
      
      {/* Floating orb 1 - purple/pink glow */}
      <div 
        className="absolute w-[600px] h-[600px] left-[5%] top-[8%] rounded-full opacity-80 animate-orb1"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.4), rgba(255,0,204,0.2))',
          filter: 'blur(100px)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
      
      {/* Floating orb 2 - cyan/blue glow */}
      <div 
        className="absolute w-[500px] h-[500px] right-[5%] bottom-[8%] rounded-full opacity-80 animate-orb2"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.35), rgba(0,127,255,0.25))',
          filter: 'blur(100px)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
      
      {/* Additional center glow */}
      <div 
        className="absolute w-[700px] h-[700px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.15), transparent 60%)',
          filter: 'blur(120px)',
          animation: 'wavePulse 22s ease-in-out infinite',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
        }}
      />
      
      {/* Pulse wave overlay - more intense */}
      <div 
        className="fixed inset-0 -z-[9] pointer-events-none animate-wavePulse"
        style={{
          background: `
            radial-gradient(1200px 600px at 15% 25%, rgba(138,43,226,0.12), transparent 18%),
            radial-gradient(1000px 500px at 85% 75%, rgba(0,255,255,0.1), transparent 18%)
          `,
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
};

BackgroundAnimationComponent.displayName = 'BackgroundAnimation';

export const BackgroundAnimation = memo(BackgroundAnimationComponent);