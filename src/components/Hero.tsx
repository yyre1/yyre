import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SilkBackgroundAnimation } from '@/components/ui/silk-background-animation';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      aria-label="Hero Section"
      className={cn(
        "relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-neutral-950 text-white",
        className
      )}
    >
      {/* 1. Silk Animated Background */}
      <SilkBackgroundAnimation />

      {/* 2. Subtle Depth Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      {/* 3. Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 md:px-12 text-center pt-28 pb-16 flex flex-col items-center">
        
        {/* Eyebrow / Badge */}
        <div 
          className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md mb-8 opacity-0",
            isLoaded && "hero-animate-in"
          )}
          style={{ animationDelay: "100ms" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[11px] font-light tracking-[0.25em] uppercase text-white/80">
            Est. 2026 • The Silk Edit
          </span>
        </div>

        {/* Primary Cinematic Headline */}
        <h1 
          className={cn(
            "text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.05em] leading-[1.05] uppercase text-white/95 opacity-0 max-w-4xl",
            isLoaded && "hero-animate-in"
          )}
          style={{ 
            animationDelay: "300ms",
            textShadow: '0 0 60px rgba(255, 255, 255, 0.15)'
          }}
        >
          Where form <br className="hidden sm:block" />
          <span className="font-extralight italic text-violet-200/90 lowercase font-serif">meets</span> fabric
        </h1>

        {/* Supporting Description */}
        <p 
          className={cn(
            "mt-8 text-base md:text-lg font-light tracking-[0.15em] text-white/60 max-w-xl mx-auto leading-relaxed opacity-0",
            isLoaded && "hero-animate-in"
          )}
          style={{ animationDelay: "500ms" }}
        >
          An intersection of avant-garde minimalism and tactile 3D craftsmanship. Designed for the modern aesthetic.
        </p>

        {/* Call To Action Buttons */}
        <div 
          className={cn(
            "mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto opacity-0",
            isLoaded && "hero-animate-in"
          )}
          style={{ animationDelay: "700ms" }}
        >
          <button
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black font-light text-xs tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 group"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-light text-xs tracking-[0.25em] uppercase hover:bg-white/15 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            View Lookbook
          </button>
        </div>

      </div>

      {/* Subtle Scroll Indicator */}
      <div 
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center opacity-0 pointer-events-none flex flex-col items-center gap-2",
          isLoaded && "hero-animate-in"
        )}
        style={{ animationDelay: "900ms" }}
      >
        <span className="text-[9px] tracking-[0.3em] text-white/40 uppercase">
          scroll to discover
        </span>
        <div className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center p-1">
          <div className="w-1 h-1.5 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};