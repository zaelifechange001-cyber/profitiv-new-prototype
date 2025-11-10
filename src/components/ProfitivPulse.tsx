import { useEffect } from 'react';

export const useProfitivPulse = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes profitiv-pulse {
        0% { opacity: 0.95; transform: scale(0.6); }
        60% { opacity: 0.9; transform: scale(1.05); }
        100% { opacity: 0; transform: scale(1.8); }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const triggerPulse = () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;display:flex;align-items:center;justify-content:center;';
    
    const wave = document.createElement('div');
    wave.style.cssText = `
      width: 40vmax;
      height: 40vmax;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(159, 97, 255, 0.14) 0%, rgba(0, 255, 255, 0.08) 35%, transparent 60%);
      animation: profitiv-pulse 1.45s ease-out forwards;
      filter: blur(22px);
    `;
    
    wrap.appendChild(wave);
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1500);
  };

  return triggerPulse;
};

// Expose globally for easy access
if (typeof window !== 'undefined') {
  (window as any).profitivPulse = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes profitiv-pulse {
        0% { opacity: 0.95; transform: scale(0.6); }
        60% { opacity: 0.9; transform: scale(1.05); }
        100% { opacity: 0; transform: scale(1.8); }
      }
    `;
    if (!document.head.querySelector('style[data-profitiv-pulse]')) {
      style.setAttribute('data-profitiv-pulse', 'true');
      document.head.appendChild(style);
    }
    
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;display:flex;align-items:center;justify-content:center;';
    
    const wave = document.createElement('div');
    wave.style.cssText = `
      width: 40vmax;
      height: 40vmax;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(159, 97, 255, 0.14) 0%, rgba(0, 255, 255, 0.08) 35%, transparent 60%);
      animation: profitiv-pulse 1.45s ease-out forwards;
      filter: blur(22px);
    `;
    
    wrap.appendChild(wave);
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1500);
  };
}
