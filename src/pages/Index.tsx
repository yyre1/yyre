import { Scene } from "@/components/3d/Scene";
import { SceneLighting } from "@/components/3d/SceneLighting";
import { AnimatedCube } from "@/components/3d/AnimatedCube";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

const Index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Layer 1: Fullscreen 3D Canvas Background (bottom) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Scene>
          <SceneLighting />
          <AnimatedCube />
        </Scene>
      </div>

      {/* Layer 2: Hero Section with Silk Background (middle) */}
      {/* Wrapper creates stacking context (relative z-10) to sit above 3D Scene (z-0) */}
      <div className="relative z-10">
        <Hero />
      </div>

      {/* Layer 3: Floating Header (top) */}
      {/* Header is absolute top-0 with z-50, stays above Hero and 3D Scene */}
      <Header />
    </div>
  );
};

export default Index;