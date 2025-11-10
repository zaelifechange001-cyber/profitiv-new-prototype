export const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Animated gradient base */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(26, 0, 38, 0.6), transparent 70%)',
          animation: 'backgroundPulse 15s ease-in-out infinite',
        }}
      />
      
      {/* Floating orb 1 */}
      <div 
        className="absolute w-[600px] h-[600px] left-[5%] top-[8%] rounded-full opacity-70 animate-orb1"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.4), rgba(255,0,204,0.2))',
          filter: 'blur(120px)',
        }}
      />
      
      {/* Floating orb 2 */}
      <div 
        className="absolute w-[500px] h-[500px] right-[5%] bottom-[8%] rounded-full opacity-70 animate-orb2"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.35), rgba(0,127,255,0.2))',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Center glow orb */}
      <div 
        className="absolute w-[450px] h-[450px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(200,0,255,0.25), transparent)',
          filter: 'blur(150px)',
        }}
      />
      
      {/* Moving gradient orb 1 */}
      <div 
        className="absolute w-[350px] h-[350px] left-[15%] bottom-[20%] rounded-full opacity-60 animate-orb3"
        style={{
          background: 'radial-gradient(circle, rgba(0,191,255,0.3), rgba(138,43,226,0.15))',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Moving gradient orb 2 */}
      <div 
        className="absolute w-[400px] h-[400px] right-[20%] top-[15%] rounded-full opacity-60 animate-orb4"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,204,0.3), rgba(0,229,255,0.15))',
          filter: 'blur(130px)',
        }}
      />
    </div>
  );
};