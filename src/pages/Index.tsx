import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Scene } from "@/components/3d/Scene";
import { SceneLighting } from "@/components/3d/SceneLighting";
import { AnimatedCube } from "@/components/3d/AnimatedCube";

const Index = () => {
  return (
    <div className="relative w-full min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black">
      {/* 1. Header (Stage 1 Step 1) */}
      <Header />

      {/* 2. Hero Section (Stage 1 Step 2) with Silk Background */}
      <Hero />

      {/* 3. Interactive 3D Environment Section */}
      <section 
        aria-label="3D Interactive Environment"
        className="relative w-full h-[90vh] bg-neutral-950 flex flex-col items-center justify-center border-t border-white/10 overflow-hidden"
      >
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center px-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-violet-400/90 font-medium">
            Interactive Dimension
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white/90 mt-2">
            Tactile Geometry
          </h2>
        </div>

        {/* 3D Canvas Scene */}
        <div className="absolute inset-0 w-full h-full pt-20">
          <Scene>
            <SceneLighting />
            <AnimatedCube />
          </Scene>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
          <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase">
            Rotate & Explore 3D Asset
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;