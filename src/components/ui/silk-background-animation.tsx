import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SilkBackgroundAnimationProps {
  className?: string;
  intensity?: number;
}

export function SilkBackgroundAnimation({ className, intensity = 1 }: SilkBackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    interface Ribbon {
      points: { x: number; y: number }[];
      color: string;
      speed: number;
      amplitude: number;
      phase: number;
      frequency: number;
      thickness: number;
      offsetY: number;
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
      // Create a sophisticated, luxurious silk color palette with shades of gray, slate, violet, and deep charcoal/purple accents
      ribbons = [
        {
          points: [],
          color: "rgba(167, 139, 250, 0.07)", // Luxurious soft violet
          speed: 0.0008,
          amplitude: height * 0.35,
          phase: 0,
          frequency: 0.002,
          thickness: 1.5,
          offsetY: height * 0.5,
        },
        {
          points: [],
          color: "rgba(226, 232, 240, 0.04)", // Soft slate gray
          speed: 0.0005,
          amplitude: height * 0.28,
          phase: Math.PI / 4,
          frequency: 0.0015,
          thickness: 1.0,
          offsetY: height * 0.45,
        },
        {
          points: [],
          color: "rgba(139, 92, 246, 0.05)", // Deeper lavender/purple accent
          speed: 0.001,
          amplitude: height * 0.4,
          phase: Math.PI / 2,
          frequency: 0.0025,
          thickness: 2.0,
          offsetY: height * 0.55,
        },
        {
          points: [],
          color: "rgba(255, 255, 255, 0.025)", // White silk sheen highlight
          speed: 0.0004,
          amplitude: height * 0.2,
          phase: Math.PI / 1.5,
          frequency: 0.001,
          thickness: 0.75,
          offsetY: height * 0.5,
        },
      ];
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const drawRibbon = (ribbon: Ribbon, time: number) => {
      ctx.beginPath();
      ctx.lineWidth = ribbon.thickness;
      ctx.strokeStyle = ribbon.color;

      const segments = 60; // Smooth resolution
      const step = width / segments;

      // Mouse interactive wave attraction calculation
      const mouse = mouseRef.current;
      // Smoothly interpolate mouse position to prevent jarring jumps
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      for (let i = 0; i <= segments; i++) {
        const x = i * step;

        // Elegant flowing math
        const wave1 = Math.sin(x * ribbon.frequency + ribbon.phase + time * ribbon.speed * 10);
        const wave2 = Math.cos(x * (ribbon.frequency * 1.6) - ribbon.phase + time * ribbon.speed * 8);
        const wave3 = Math.sin((x + time * 15) * 0.0008) * 0.5;

        let baseOffset = (wave1 + wave2 + wave3) * ribbon.amplitude * intensity;

        // Apply interactive mouse disturbance
        if (mouse.active) {
          const dx = x - mouse.x;
          const dist = Math.abs(dx);
          const maxDist = width * 0.25; // Area of influence
          
          if (dist < maxDist) {
            // Smooth bell curve force
            const force = (1 - dist / maxDist) ** 2;
            const targetDelta = (mouse.y - ribbon.offsetY) * 0.35 * force;
            baseOffset += targetDelta;
          }
        }

        const y = ribbon.offsetY + baseOffset;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = (i - 1) * step;
          const prevWave1 = Math.sin(prevX * ribbon.frequency + ribbon.phase + time * ribbon.speed * 10);
          const prevWave2 = Math.cos(prevX * (ribbon.frequency * 1.6) - ribbon.phase + time * ribbon.speed * 8);
          const prevWave3 = Math.sin((prevX + time * 15) * 0.0008) * 0.5;
          
          let prevBaseOffset = (prevWave1 + prevWave2 + prevWave3) * ribbon.amplitude * intensity;

          if (mouse.active) {
            const dx = prevX - mouse.x;
            const dist = Math.abs(dx);
            const maxDist = width * 0.25;
            if (dist < maxDist) {
              const force = (1 - dist / maxDist) ** 2;
              const targetDelta = (mouse.y - ribbon.offsetY) * 0.35 * force;
              prevBaseOffset += targetDelta;
            }
          }

          const prevY = ribbon.offsetY + prevBaseOffset;

          const xc = (prevX + x) / 2;
          const yc = (prevY + y) / 2;
          ctx.quadraticCurveTo(prevX, prevY, xc, yc);
        }
      }

      ctx.stroke();
    };

    let startTime = Date.now();

    const render = () => {
      // Use transparent/subtle color overlay clearing to allow background 3D canvas peek-through
      ctx.clearRect(0, 0, width, height);

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
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [reducedMotion, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}