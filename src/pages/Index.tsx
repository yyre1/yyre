import { Scene } from "@/components/3d/Scene";
import { SceneLighting } from "@/components/3d/SceneLighting";
import { AnimatedCube } from "@/components/3d/AnimatedCube";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

const Index = () => {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-neutral-950 text-white selection:bg-white/10">
      
      {/* 
        LAYERING SCHEME:
        1. 3D Canvas Environment (z-0, bottom)
        2. Hero & Header Overlay (z-10, top)
      */}

      {/* Layer 1: Fullscreen 3D Canvas Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Scene>
          <SceneLighting />
          <AnimatedCube />
        </Scene>
      </div>

      {/* Layer 2: Interactive HTML Overlay (Header + Hero Section) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        
        {/* Floating Glass Header with its own clipped local silk background */}
        <Header />

        {/* Hero Section with interactive fullscreen silk background canvas & sequential text transitions */}
        <Hero />
        
      </div>
    </div>
  );
};

export default Index;