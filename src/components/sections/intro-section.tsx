import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function IntroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[90vh] bg-neutral-950 text-white flex flex-col justify-between px-6 md:px-12 lg:px-24 py-24 z-20 border-t border-white/10"
    >
      {/* Subtle top ambient glow / gradient transition */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Header / Eyebrow within Section */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div 
          className={cn(
            "transition-all duration-1000 ease-out transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="inline-flex items-center gap-2 text-xs font-light tracking-[0.3em] uppercase text-violet-400 bg-violet-400/5 px-4 py-2 rounded-full border border-violet-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Introduction
          </span>
        </div>

        <div 
          className={cn(
            "text-xs tracking-[0.2em] text-white/40 uppercase font-light transition-all duration-1000 ease-out transform delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          Manifesto & Vision • 01
        </div>
      </div>

      {/* Center Main Editorial Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-12">
        
        {/* Left Column: Large Dominant Statement */}
        <div className="lg:col-span-7">
          <h2 
            className={cn(
              "text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[-0.03em] leading-[1.1] text-white/95 transition-all duration-1000 ease-out transform delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Sculpting digital architecture through <span className="font-extralight italic text-violet-300/90 pr-1">immaculate</span> precision and fluid form.
          </h2>
        </div>

        {/* Right Column: Supporting Paragraph & Minimalist Interactive Element */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <p 
            className={cn(
              "text-base sm:text-lg font-light leading-relaxed text-white/50 tracking-wide transition-all duration-1000 ease-out transform delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            An uncompromising vision bridging physical luxury and digital craftsmanship. 
            Designed for those who appreciate the intersection of depth, texture, and timeless aesthetic restraint. 
            Every interaction is calibrated to evoke presence and tranquility.
          </p>

          <div 
            className={cn(
              "flex items-center gap-4 transition-all duration-1000 ease-out transform delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="h-[1px] w-16 bg-white/20" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-white/40 font-light">
              Explore the framework
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Footer Cue of Section */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pt-8 border-t border-white/5">
        <div className="text-[10px] tracking-[0.25em] text-white/30 uppercase font-light">
          YYRE Studio
        </div>

        <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-white/40 uppercase font-light">
          <span>Scroll</span>
          <ArrowRight className="w-3 h-3 rotate-90 text-white/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
