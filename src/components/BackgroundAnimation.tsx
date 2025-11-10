import { memo } from 'react';

export const BackgroundAnimation = memo(() => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Static gradient base - no animation */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(26, 0, 38, 0.4), transparent 70%)',
          willChange: 'opacity',
        }}
      />
      
      {/* Floating orb 1 - reduced blur */}
      <div 
        className="absolute w-[500px] h-[500px] left-[5%] top-[8%] rounded-full opacity-60 animate-orb1"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.3), rgba(255,0,204,0.15))',
          filter: 'blur(60px)',
          willChange: 'transform',
        }}
      />
      
      {/* Floating orb 2 - reduced blur */}
      <div 
        className="absolute w-[400px] h-[400px] right-[5%] bottom-[8%] rounded-full opacity-60 animate-orb2"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.25), rgba(0,127,255,0.15))',
          filter: 'blur(60px)',
          willChange: 'transform',
        }}
      />
    </div>
  );
});