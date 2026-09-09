import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SilkBackgroundProps {
  className?: string;
}

export function SilkBackground({ className }: SilkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Silk ribbons simulation parameters
    interface Ribbon {
      points: { x: number; y: number }[];
      color: string;
      speed: number;
      amplitude: number;
      phase: number;
      frequency: number;
      thickness: number;
    }

    let ribbons: Ribbon[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initRibbons();
    };

    const initRibbons = () => {
      ribbons = [
        {
          points: [],
          color: "rgba(167, 139, 250, 0.08)", // Soft purple/indigo
          speed: 0.0015,
          amplitude: height * 0.45,
          phase: 0,
          frequency: 0.003,
          thickness: 1.5,
        },
        {
          points: [],
          color: "rgba(226, 232, 240, 0.05)", // Soft slate/white
          speed: 0.001,
          amplitude: height * 0.35,
          phase: Math.PI / 3,
          frequency: 0.002,
          thickness: 1,
        },
        {
          points: [],
          color: "rgba(124, 58, 237, 0.04)", // Deeper violet accent
          speed: 0.002,
          amplitude: height * 0.5,
          phase: Math.PI / 1.5,
          frequency: 0.004,
          thickness: 2,
        },
        {
          points: [],
          color: "rgba(255, 255, 255, 0.03)", // Ultra fine highlight
          speed: 0.0008,
          amplitude: height * 0.25,
          phase: Math.PI / 2,
          frequency: 0.0015,
          thickness: 0.75,
        },
      ];
    };

    const drawRibbon = (ribbon: Ribbon, time: number) => {
      ctx.beginPath();
      ctx.lineWidth = ribbon.thickness;
      ctx.strokeStyle = ribbon.color;

      const segments = 40;
      const step = width / segments;

      for (let i = 0; i <= segments; i++) {
        const x = i * step;
        
        // Procedural flow using combinations of sin, cos and time offsets
        const wave1 = Math.sin(x * ribbon.frequency + ribbon.phase + time * ribbon.speed * 10);
        const wave2 = Math.cos(x * (ribbon.frequency * 1.5) - ribbon.phase + time * ribbon.speed * 8);
        const wave3 = Math.sin((x + time * 20) * 0.001) * 0.5;

        const y = height / 2 + (wave1 + wave2 + wave3) * ribbon.amplitude;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Quadratic curves for supreme smoothness
          const prevX = (i - 1) * step;
          const prevWave1 = Math.sin(prevX * ribbon.frequency + ribbon.phase + time * ribbon.speed * 10);
          const prevWave2 = Math.cos(prevX * (ribbon.frequency * 1.5) - ribbon.phase + time * ribbon.speed * 8);
          const prevWave3 = Math.sin((prevX + time * 20) * 0.001) * 0.5;
          const prevY = height / 2 + (prevWave1 + prevWave2 + prevWave3) * ribbon.amplitude;

          const xc = (prevX + x) / 2;
          const yc = (prevY + y) / 2;
          ctx.quadraticCurveTo(prevX, prevY, xc, yc);
        }
      }

      ctx.stroke();
    };

    let startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render flowing ribbons
      const time = Date.now() - startTime;
      ribbons.forEach((ribbon) => {
        drawRibbon(ribbon, reducedMotion ? 0 : time);
      });

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    
    // Initial frame render
    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}