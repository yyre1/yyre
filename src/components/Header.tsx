import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { SilkBackground } from "./SilkBackground";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Trap scroll
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap for mobile navigation drawer
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    menuRef.current.addEventListener("keydown", handleTabTrap);
    // Focus first link on open
    firstElement?.focus();

    return () => {
      menuRef.current?.removeEventListener("keydown", handleTabTrap);
    };
  }, [isOpen]);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full px-4 py-4 md:px-8 md:py-6 max-w-7xl mx-auto">
      {/* Container with premium glass backdrop and flowing silk canvas clipped background */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md bg-neutral-950/40 shadow-2xl transition-all duration-500 hover:border-white/15">
        {/* Silk Background layer confined strictly to the header */}
        <SilkBackground className="absolute inset-0 z-0 opacity-50" />
        
        {/* Subtle overlay gradient to emphasize luxury contrast and perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/80 z-10 pointer-events-none" />

        {/* Navigation / Foreground Content above the Silk layer */}
        <div className="relative z-20 flex items-center justify-between px-6 py-4 md:px-8">
          
          {/* LEFT: Premium Luxury branding Wordmark logo */}
          <a
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-white/30 rounded-md py-1 px-2"
          >
            <span className="text-xl md:text-2xl font-light tracking-[0.35em] text-white/90 group-hover:text-white transition-all duration-300 uppercase font-vip">
              YYRE
            </span>
          </a>

          {/* CENTER: Desktop navigation links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.label);
                }}
                className={cn(
                  "relative px-4 py-2 text-sm tracking-[0.18em] font-light uppercase transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-white/30 rounded-md",
                  activeItem === item.label
                    ? "text-white"
                    : "text-white/50 hover:text-white/90"
                )}
              >
                {item.label}
                {/* Minimalist dot indicator that glows on active item */}
                {activeItem === item.label && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-400 rounded-full shadow-[0_0_8px_#a78bfa]" />
                )}
              </a>
            ))}
          </nav>

          {/* RIGHT: CTA Button / Cart style luxury placeholder */}
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-xs font-light tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-500 uppercase focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              Explore Collection
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* MOBILE: Accessible Menu Toggler */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWERNESS MENU */}
      <div
        id="mobile-navigation"
        ref={menuRef}
        className={cn(
          "fixed inset-0 z-50 md:hidden bg-neutral-950/95 backdrop-blur-xl flex flex-col justify-between p-8 transition-all duration-500 ease-out",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-8 pointer-events-none"
        )}
      >
        {/* Mobile Header Inside Menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-light tracking-[0.35em] text-white/90 uppercase font-vip">
              YYRE
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              toggleButtonRef.current?.focus();
            }}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links Column */}
        <nav aria-label="Mobile Navigation" className="flex flex-col gap-6 my-auto">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                setActiveItem(item.label);
                setIsOpen(false);
              }}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
              className={cn(
                "text-2xl font-light tracking-[0.25em] uppercase transition-all duration-300 focus:outline-none focus:border-b focus:border-white/20 py-2",
                activeItem === item.label ? "text-violet-400 translate-x-2" : "text-white/60 hover:text-white"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Button in Drawer */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white text-black text-sm tracking-[0.2em] font-normal hover:bg-neutral-200 transition-all duration-300 uppercase focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-[10px] tracking-[0.2em] text-center text-white/30 uppercase mt-4 font-vip">
            YYRE © 2026
          </p>
        </div>
      </div>
    </header>
  );
}