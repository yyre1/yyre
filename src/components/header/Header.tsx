import * as React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SilkBackgroundAnimation } from "@/components/silk/SilkBackgroundAnimation";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Collection", href: "#collection" },
  { label: "Drops", href: "#drops" },
  { label: "Lookbook", href: "#lookbook" },
  { label: "About", href: "#about" },
];

/**
 * Reusable site header with the Silk Background Animation as its animated
 * background. Sits above the 3D environment and stays lightweight so it does
 * not compete with the scene.
 */
export function Header() {
  const reducedMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close the mobile menu on Escape for keyboard accessibility
  React.useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Lock body scroll while the menu is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Silk animated background — isolated, non-interactive, above nothing else */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <SilkBackgroundAnimation
          animated={!reducedMotion}
          className="h-full w-full opacity-80"
        />
        {/* Subtle scrim to keep nav legible over the 3D scene */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>

      <nav
        className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <a
          href="#"
          className="group flex items-center text-lg font-light tracking-[0.3em] text-white/90 uppercase transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          yyre
        </a>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="group relative text-sm font-light tracking-[0.15em] text-white/60 uppercase transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/60"
          >
            Shop
          </Button>
          <Button
            size="sm"
            className="rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/15 focus-visible:ring-white/60"
          >
            Sign In
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile navigation panel */}
      <div
        id="mobile-navigation"
        className={cn(
          "md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <div className="mx-4 mt-1 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-300">
          <ul className="flex flex-col p-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-sm font-light tracking-[0.15em] text-white/70 uppercase transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 border-t border-white/10 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Shop
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-full border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/15"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}