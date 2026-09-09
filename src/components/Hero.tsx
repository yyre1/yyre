'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { SilkBackgroundAnimation } from '@/components/ui/silk-background-animation';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

export const Hero = ({ className }: HeroProps) => {
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Trigger entrance sequence after mount
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fadeUp = (delay: number) => cn(
    'transition-all duration-1000 ease-out',
    loaded && !reducedMotion 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-6'
  );

  const fadeIn = (delay: number) => cn(
    'transition-all duration-700 ease-out',
    loaded && !reducedMotion
      ? 'opacity-100'
      : 'opacity-0'
  );

  // Staggered delays
  const delays = {
    eyebrow: 0,
    headline: 100,
    description: 200,
    cta: 300,
    scroll: 500,
  };

  return (
    <section 
      className={cn(
        'relative flex flex-col justify-center items-center min-h-[100vh] w-full overflow-hidden',
        'bg-neutral-950', // Fallback background
        className
      )}
      aria-labelledby="hero-heading"
    >
      {/* Silk Animated Background - fills the Hero section */}
      <div className="absolute inset-0 z-0">
        <SilkBackgroundAnimation opacity={0.85} />
      </div>

      {/* Subtle gradient overlay for depth and readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-neutral-950/60 via-transparent to-neutral-950/70 pointer-events-none" />

      {/* Hero Content - positioned above Silk and overlay */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 py-16 w-full max-w-6xl mx-auto">
        
        {/* Eyebrow / Label */}
        <div 
          className={cn(
            'text-xs md:text-sm font-light tracking-[0.4em] uppercase text-violet-400/90',
            'mb-6',
            fadeUp(delays.eyebrow)
          )}
          style={{ transitionDelay: `${delays.eyebrow}ms` }}
        >
          New Collection
        </div>

        {/* Primary Headline */}
        <h1 
          id="hero-heading"
          className={cn(
            'font-light tracking-[-0.02em] leading-[1.05] text-white/95',
            'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl',
            'max-w-5xl mx-auto',
            'mb-8',
            fadeUp(delays.headline)
          )}
          style={{ transitionDelay: `${delays.headline}ms` }}
        >
          Where Form<br />Meets Fabric
        </h1>

        {/* Supporting Description */}
        <p 
          className={cn(
            'font-light tracking-[0.1em] text-white/60',
            'text-base sm:text-lg md:text-xl',
            'max-w-2xl mx-auto',
            'mb-12',
            fadeUp(delays.description)
          )}
          style={{ transitionDelay: `${delays.description}ms` }}
        >
          Explore the intersection of architectural tailoring and fluid materiality. 
          Each piece is a study in silhouette, structure, and the quiet confidence of restraint.
        </p>

        {/* CTA Buttons */}
        <div 
          className={cn(
            'flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs',
            fadeUp(delays.cta)
          )}
          style={{ transitionDelay: `${delays.cta}ms` }}
        >
          <button 
            type="button"
            className={cn(
              'flex items-center justify-center gap-2 w-full sm:w-auto',
              'px-8 py-4 rounded-full',
              'bg-white text-black',
              'text-sm font-light tracking-[0.2em] uppercase',
              'hover:bg-neutral-200 active:bg-neutral-300',
              'transition-all duration-300 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-neutral-950',
              'border border-transparent'
            )}
          >
            Explore Collection
            <ArrowDown className="w-4 h-4 transition-transform duration-300" />
          </button>

          <button 
            type="button"
            className={cn(
              'flex items-center justify-center w-full sm:w-auto',
              'px-8 py-4 rounded-full',
              'bg-transparent text-white/80',
              'border border-white/20',
              'text-sm font-light tracking-[0.2em] uppercase',
              'hover:bg-white/5 hover:border-white/40',
              'transition-all duration-300 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-neutral-950'
            )}
          >
            View Lookbook
          </button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className={cn(
            'absolute bottom-8 left-1/2 -translate-x-1/2',
            'flex flex-col items-center gap-2',
            'text-white/30',
            'text-[10px] tracking-[0.3em] uppercase',
            fadeIn(delays.scroll)
          )}
          style={{ transitionDelay: `${delays.scroll}ms` }}
        >
          <span>Scroll to explore</span>
          <ArrowDown 
            className="w-5 h-5 animate-bounce"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};