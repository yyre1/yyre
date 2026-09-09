'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SilkBackgroundAnimationProps {
  className?: string;
}

export const SilkBackgroundAnimation: React.FC<SilkBackgroundAnimationProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const speed = 0.02;
    const scale = 2;
    const noiseIntensity = 0.8;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple noise function
    const noise = (x: number, y: number) => {
      const G = 2.71828;
      const rx = G * Math.sin(G * x);
      const ry = G * Math.sin(G * y);
      return (rx * ry * (1 + x)) % 1;
    };

    const animate = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#121212');
      gradient.addColorStop(0.5, '#1a1a1a');
      gradient.addColorStop(1, '#121212');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Create silk-like pattern (optimized step size for performance)
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      const step = 3; // Optimized for performance in hero section
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          const u = (x / width) * scale;
          const v = (y / height) * scale;
          
          const tOffset = speed * time;
          let tex_x = u;
          let tex_y = v + 0.03 * Math.sin(8.0 * tex_x - tOffset);

          const pattern = 0.6 + 0.4 * Math.sin(
            5.0 * (tex_x + tex_y + 
              Math.cos(3.0 * tex_x + 5.0 * tex_y) + 
              0.02 * tOffset) +
            Math.sin(20.0 * (tex_x + tex_y - 0.1 * tOffset))
          );

          const rnd = noise(x, y);
          const intensity = Math.max(0, pattern - rnd / 15.0 * noiseIntensity);
          
          // Purple-gray silk color matching high-fashion aesthetic
          const r = Math.floor(123 * intensity);
          const g = Math.floor(116 * intensity);
          const b = Math.floor(129 * intensity);
          const a = 255;

          // Fill block for step size
          for (let dx = 0; dx < step && x + dx < width; dx++) {
            for (let dy = 0; dy < step && y + dy < height; dy++) {
              const index = ((y + dy) * width + (x + dx)) * 4;
              if (index < data.length) {
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = a;
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add subtle overlay for depth
      const overlayGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, width, height);

      if (!reducedMotion) {
        time += 1;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <>
      <style>{`
        @keyframes heroFadeInUp {
          from {
            opacity: 0;
            transform: translateY(1.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-animate-in {
          animation: heroFadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <canvas 
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
        aria-hidden="true"
      />
    </>
  );
};