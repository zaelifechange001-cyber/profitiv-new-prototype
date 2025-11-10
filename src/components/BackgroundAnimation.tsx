import { memo, useEffect, useRef } from "react";

const BackgroundAnimationComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Adaptive internal resolution to guarantee smoothness without changing visuals
    const getBaseDPR = () => {
      const base = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const width = window.innerWidth;
      const scaleHint = width > 2400 ? 0.6 : width > 1800 ? 0.8 : 1;
      return Math.max(0.75, Math.min(1.25, base * scaleHint));
    };

    const state = {
      baseDpr: getBaseDPR(),
      scale: 1, // dynamically adjusted between 0.45..1 to keep 60fps
      width: 0,
      height: 0,
      t0: performance.now(),
    };

    const effectiveDpr = () => Math.max(0.45, Math.min(1, state.scale)) * state.baseDpr;

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      state.width = innerWidth;
      state.height = innerHeight;
      state.baseDpr = getBaseDPR();
      const dpr = effectiveDpr();
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Create a reusable stripes pattern (diagonal 135deg)
    let stripesPattern: CanvasPattern | null = null;
    const buildStripes = () => {
      const stripeSize = 12; // 6px purple + 6px cyan like CSS repeating-linear-gradient
      const off = document.createElement("canvas");
      off.width = stripeSize;
      off.height = stripeSize;
      const octx = off.getContext("2d");
      if (!octx) return;
      // Transparent background
      octx.clearRect(0, 0, stripeSize, stripeSize);
      // Draw two subtle stripes with low alpha
      octx.fillStyle = "rgba(138,43,226,0.04)"; // purple
      octx.fillRect(0, 0, stripeSize, 6);
      octx.fillStyle = "rgba(0,255,255,0.04)"; // cyan
      octx.fillRect(0, 6, stripeSize, 6);
      // Pattern used with rotation on main canvas
      stripesPattern = ctx.createPattern(off, "repeat");
    };
    buildStripes();

    // Detect if 'overlay' composite is supported
    let supportsOverlay = true;
    try {
      const prev = ctx.globalCompositeOperation as GlobalCompositeOperation;
      // @ts-ignore
      ctx.globalCompositeOperation = 'overlay';
      // @ts-ignore
      supportsOverlay = ctx.globalCompositeOperation === 'overlay';
      ctx.globalCompositeOperation = prev;
    } catch {
      supportsOverlay = false;
    }

    const radial = (
      x: number,
      y: number,
      r: number,
      stops: Array<[number, string]>,
      globalAlpha = 1,
      composite: GlobalCompositeOperation = "lighter"
    ) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      for (const [p, c] of stops) g.addColorStop(p, c);
      ctx.save();
      ctx.globalAlpha = globalAlpha;
      ctx.globalCompositeOperation = composite;
      ctx.fillStyle = g as any;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let rafId = 0;
    let lastNow = performance.now();
    let frameSum = 0;
    let frameCount = 0;
    const render = (now: number) => {
      const t = (now - state.t0) / 1000; // seconds
      const { width: w, height: h } = state;

      // Adaptive quality control targeting ~60fps
      const dt = now - lastNow; lastNow = now; frameSum += dt; frameCount++;
      if (frameCount >= 60) {
        const avg = frameSum / frameCount;
        // Refresh base DPR in case of zoom/monitor change
        state.baseDpr = getBaseDPR();
        if (avg > 18 && state.scale > 0.45) { // frame time too high -> reduce internal resolution
          state.scale = Math.max(0.45, state.scale * 0.9);
          resize();
        } else if (avg < 14 && state.scale < 1) { // plenty of headroom -> increase quality
          state.scale = Math.min(1, state.scale * 1.05);
          resize();
        }
        frameSum = 0; frameCount = 0;
      }

      ctx.clearRect(0, 0, w, h);

      // Secondary depth glow (faint darker layer)
      radial(
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.7,
        [
          [0, "rgba(26,0,38,0.4)"],
          [1, "rgba(26,0,38,0)"]
        ],
        1,
        "source-over"
      );

      // Stripes overlay with slight movement to emulate CSS animation
      if (stripesPattern) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.globalCompositeOperation = (supportsOverlay ? 'overlay' : 'source-over') as GlobalCompositeOperation;
        ctx.translate(w / 2, h / 2);
        ctx.rotate((-45 * Math.PI) / 180); // 135deg background -> rotate -45deg pattern canvas
        const offset = (t * 60) % 12; // scroll speed similar to CSS
        ctx.translate(-w / 2 - offset, -h / 2 - offset);
        ctx.fillStyle = stripesPattern;
        ctx.fillRect(0, 0, w + 24, h + 24);
        ctx.restore();
      }

      // Floating orb 1 - purple/pink glow
      const orb1Size = 600;
      const orb1X = w * 0.05 + 20 * Math.sin(t * 0.4);
      const orb1Y = h * 0.08 + 30 * Math.cos(t * 0.35);
      radial(
        orb1X,
        orb1Y,
        orb1Size,
        [
          [0, "rgba(138,43,226,0.4)"],
          [1, "rgba(255,0,204,0.0)"]
        ]
      );

      // Floating orb 2 - cyan/blue glow
      const orb2Size = 500;
      const orb2X = w * 0.95 + 25 * Math.cos(t * 0.45);
      const orb2Y = h * 0.92 + 20 * Math.sin(t * 0.38);
      radial(
        orb2X,
        orb2Y,
        orb2Size,
        [
          [0, "rgba(0,255,255,0.35)"],
          [1, "rgba(0,127,255,0.0)"]
        ]
      );

      // Additional center glow with pulse
      const pulse = 0.85 + 0.15 * Math.sin((t / 22) * 2 * Math.PI);
      radial(
        w * 0.5,
        h * 0.5,
        700 * pulse,
        [
          [0, "rgba(138,43,226,0.15)"],
          [0.6, "rgba(138,43,226,0.0)"]
        ],
        0.6
      );

      // Pulse wave overlay (two distant radial glows)
      radial(
        w * 0.15,
        h * 0.25,
        600 + 20 * Math.sin(t * 0.5),
        [
          [0, "rgba(138,43,226,0.12)"],
          [0.18, "rgba(138,43,226,0.0)"]
        ],
        1,
        "lighter"
      );

      radial(
        w * 0.85,
        h * 0.75,
        500 + 20 * Math.cos(t * 0.5),
        [
          [0, "rgba(0,255,255,0.1)"],
          [0.18, "rgba(0,255,255,0.0)"]
        ],
        1,
        "lighter"
      );

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden isolate gpu-hint"
      style={{ contain: "layout style paint", backfaceVisibility: "hidden" }}
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

BackgroundAnimationComponent.displayName = 'BackgroundAnimation';

export const BackgroundAnimation = memo(BackgroundAnimationComponent);
