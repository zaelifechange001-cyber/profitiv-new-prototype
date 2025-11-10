export const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Base gradient layer with animation */}
      <div 
        className="absolute inset-[-10%] -left-[20%] -right-[20%] opacity-90 animate-baseMove"
        style={{
          background: 'linear-gradient(160deg, #0e0f12 0%, #1b1228 30%, #0e0f12 60%)',
          backgroundSize: '300% 300%',
          filter: 'contrast(1.05) saturate(1.05)',
        }}
      />
      
      {/* Stripes overlay */}
      <div 
        className="absolute inset-0 opacity-90 mix-blend-overlay animate-stripes"
        style={{
          background: 'repeating-linear-gradient(135deg, rgba(143,0,255,0.03) 0 6px, rgba(0,255,255,0.03) 6px 12px)',
        }}
      />
      
      {/* Floating orb 1 */}
      <div 
        className="absolute w-[520px] h-[520px] left-[6%] top-[6%] rounded-full opacity-90 animate-orb1"
        style={{
          background: 'radial-gradient(circle, rgba(143,107,255,0.33), rgba(0,255,208,0.33))',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Floating orb 2 */}
      <div 
        className="absolute w-[420px] h-[420px] right-[6%] bottom-[10%] rounded-full opacity-90 animate-orb2"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,208,0.33), rgba(143,107,255,0.33))',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Pulse wave overlay */}
      <div 
        className="fixed inset-0 -z-[9] pointer-events-none animate-wavePulse"
        style={{
          background: `
            radial-gradient(1200px 600px at 10% 20%, rgba(143,0,255,0.06), transparent 15%),
            radial-gradient(1000px 500px at 90% 80%, rgba(0,255,255,0.04), transparent 15%)
          `,
        }}
      />
    </div>
  );
};