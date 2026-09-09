import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SilkBackgroundAnimation } from "./ui/silk-background-animation";

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Elegant sequential fade-in delay triggered on mount
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-transparent pt-32 pb-12 px-6 md:px-12 lg:px-20 z-10 select-none">
      
      {/* 1. Silk Background canvas animation layer confined strictly to the Hero boundary */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <SilkBackgroundAnimation className="opacity-55 scale-105" intensity={1.1} />
        {/* Subtle vignette/radial shadow gradient layer to enhance high-fashion high-contrast typography readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/10 to-neutral-950 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,10,10,0.8)_100%)] z-10" />
      </div>

      {/* 2. Main Hero Content Layout */}
      <div className="relative z-20 flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full text-center md:text-left">
        
        {/* SMALL EYEBROW */}
        <div
          className={cn(
            "mb-6 transition-all duration-1000 ease-out transform",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <span className="inline-block tracking-[0.35em] text-[10px] md:text-xs font-light text-violet-400 uppercase bg-violet-400/5 px-4 py-1.5 rounded-full border border-violet-500/10 shadow-[0_0_15px_rgba(167,139,250,0.05)]">
            collection 2026 • aura & form
          </span>
        </div>

        {/* LARGE CINEMATIC PRIMARY HEADLINE */}
        <h1
          className={cn(
            "text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em] leading-[1.05] text-white/95 mb-8 transition-all duration-1000 ease-out transform",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: "450ms" }}
        >
          Where technical <br />
          <span className="font-extralight italic text-white/50 tracking-wide pr-2">tailoring</span> 
          meets <br className="hidden sm:inline" />
          fluid geometry
        </h1>

        {/* SUPPORTING DESCRIPTION */}
        <p
          className={cn(
            "max-w-xl text-sm sm:text-base md:text-lg font-light leading-relaxed text-white/45 tracking-wide mb-12 transition-all duration-1000 ease-out transform mx-auto md:mx-0",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: "700ms" }}
        >
          A meticulous exploration of luxury structures and virtual silhouettes, 
          crafted to exist in the beautiful boundary between physical presence and 3D digital form.
        </p>

        {/* CTA BUTTONS */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 ease-out transform justify-center md:justify-start",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: "950ms" }}
        >
          {/* Primary CTA */}
          <button
            type="button"
            className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-black text-xs tracking-[0.2em] font-normal hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-500 uppercase w-full sm:w-auto"
          >
            Enter Showroom
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Secondary CTA */}
          <button
            type="button"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-xs tracking-[0.2em] font-light text-white hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-500 uppercase w-full sm:w-auto"
          >
            Watch Film
          </button>
        </div>
      </div>

      {/* 3. Subtle animated scroll indicator at the bottom */}
      <div
        className={cn(
          "relative z-20 flex flex-col items-center gap-2 transition-all duration-1000 ease-out transform",
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{ transitionDelay: "1200ms" }}
      >
        <span className="text-[9px] tracking-[0.3em] text-white/20 uppercase font-light">
          scroll to explore
        </span>
        <div className="animate-bounce text-white/30">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}