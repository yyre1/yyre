import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Handle scroll for background transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      document.body.style.overflow = "hidden";
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
    firstElement?.focus();

    return () => {
      menuRef.current?.removeEventListener("keydown", handleTabTrap);
    };
  }, [isOpen]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled 
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4" 
          : "bg-transparent py-8"
      )}
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-10 lg:px-12 flex items-center justify-between relative">
        
        {/* LEFT: Branding */}
        <div className="flex-shrink-0 z-10">
          <a
            href="/"
            className="group focus:outline-none focus:ring-1 focus:ring-white/30 rounded-md"
          >
            <span className="text-xl md:text-2xl font-light tracking-[0.4em] text-white group-hover:text-violet-400 transition-all duration-300 uppercase font-vip">
              YYRE
            </span>
          </a>
        </div>

        {/* CENTER: Desktop Navigation - Absolute Centering */}
        <nav 
          aria-label="Main Navigation" 
          className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 transition-opacity duration-300"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveItem(item.label);
              }}
              className={cn(
                "relative text-[10px] tracking-[0.3em] font-light uppercase transition-all duration-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30 rounded-sm py-1",
                activeItem === item.label
                  ? "text-white"
                  : "text-white/40"
              )}
            >
              {item.label}
              {activeItem === item.label && (
                <span className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-violet-500/60 shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
              )}
            </a>
          ))}
        </nav>

        {/* RIGHT: Utility Actions */}
        <div className="flex items-center gap-6 md:gap-8 z-10">
          {/* Desktop Only Actions */}
          <button 
            type="button"
            className="hidden md:flex text-white/40 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white/30 rounded-full p-1"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[1.2]" />
          </button>
          
          <button 
            type="button"
            className="hidden md:flex text-white/40 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white/30 rounded-full p-1"
            aria-label="Account"
          >
            <User className="w-4 h-4 stroke-[1.2]" />
          </button>

          <button 
            type="button"
            className="text-white/40 hover:text-white transition-colors focus:outline-none relative group focus:ring-1 focus:ring-white/30 rounded-full p-1"
            aria-label="Cart"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.2]" />
            <span className="absolute -top-0.5 -right-0.5 text-[7px] w-3 h-3 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">0</span>
          </button>

          {/* Mobile/Tablet Menu Toggler */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center justify-center text-white/70 hover:text-white focus:outline-none transition-all focus:ring-1 focus:ring-white/30 rounded-md p-1"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6 stroke-[1.2]" /> : <Menu className="w-6 h-6 stroke-[1.2]" />}
          </button>
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <div
        id="mobile-navigation"
        ref={menuRef}
        className={cn(
          "fixed inset-0 z-[60] bg-black transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        )}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between px-6 py-8 md:px-10">
          <span className="text-xl font-light tracking-[0.4em] text-white uppercase font-vip">
            YYRE
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white focus:outline-none p-1"
            aria-label="Close menu"
          >
            <X className="w-8 h-8 stroke-[1]" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Mobile Navigation" className="flex-1 flex flex-col px-8 md:px-12 py-12 gap-6 md:gap-8 overflow-y-auto">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                setActiveItem(item.label);
                setIsOpen(false);
              }}
              style={{
                transitionDelay: isOpen ? `${index * 70}ms` : "0ms",
              }}
              className={cn(
                "text-4xl md:text-6xl font-light tracking-[0.1em] uppercase transition-all duration-700 ease-out",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0",
                activeItem === item.label ? "text-violet-400" : "text-white/40 hover:text-white"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Footer actions in menu */}
        <div className={cn(
          "px-8 md:px-12 py-12 flex flex-col gap-8 transition-all duration-700 delay-300",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <button className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-white/30 hover:text-white transition-colors">
              <Search className="w-5 h-5 stroke-[1]" /> Search
            </button>
            <button className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-white/30 hover:text-white transition-colors">
              <User className="w-5 h-5 stroke-[1]" /> Account
            </button>
          </div>
          <p className="text-[10px] tracking-[0.4em] text-white/10 uppercase font-vip">
            YYRE © 2026
          </p>
        </div>
      </div>
    </header>
  );
}