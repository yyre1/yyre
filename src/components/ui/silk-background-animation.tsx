'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SilkBackgroundAnimationProps {
  className?: string;
  opacity?: number;
}

export const SilkBackgroundAnimation = ({ 
  className,
  opacity = 1 
}: SilkBackgroundAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let time = 0;
    const speed = 0.02;
    const scale = 2;
    const noiseIntensity = 0.8;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      // Use a slightly lower resolution for performance if needed, 
      // but stick to pixel-perfect for now as it's a Hero element
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple noise function (procedural)
    const noise = (x: number, y: number) => {
      const G = 2.71828;
      const rx = G * Math.sin(G * x);
      const ry = G * Math.sin(G * y);
      return (rx * ry * (1 + x)) % 1;
    };

    const animate = () => {
      if (reducedMotion) return;

      const { width, height } = canvas;
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Create gradient background
      // Note: We use the provided colors but allow alpha blending if opacity < 1
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `rgba(26, 26, 26, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(42, 42, 42, ${opacity})`);
      gradient.addColorStop(1, `rgba(26, 26, 26, ${opacity})`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Create silk-like pattern
      // We process every 2nd pixel as in the demo for performance
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Time offset calculation
      const tOffset = speed * time;

      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y += 2) {
          const u = (x / width) * scale;
          const v = (y / height) * scale;
          
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
          
          // Purple-gray silk color (r: 123, g: 116, b: 129)
          const r = Math.floor(123 * intensity);
          const g = Math.floor(116 * intensity);
          const b = Math.floor(129 * intensity);
          const a = Math.floor(255 * opacity);

          // Fill 2x2 block to avoid gaps since we skip pixels
          for (let dx = 0; dx < 2; dx++) {
            for (let dy = 0; dy < 2; dy++) {
              const curX = x + dx;
              const curY = y + dy;
              if (curX < width && curY < height) {
                const index = (curY * width + curX) * 4;
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
      overlayGradient.addColorStop(0, `rgba(0, 0, 0, ${0.1 * opacity})`);
      overlayGradient.addColorStop(1, `rgba(0, 0, 0, ${0.4 * opacity})`);
      
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, width, height);

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    // If reduced motion is on, just draw one frame and stop
    if (reducedMotion) {
      // Draw a static frame
      animate(); 
    } else {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [opacity, reducedMotion]);

  return (
    <canvas 
      ref={canvasRef}
      className={cn("pointer-events-none block", className)}
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
      aria-hidden="true"
    />
  );
};
