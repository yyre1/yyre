import { Scene } from "@/components/3d/Scene";
import { SceneLighting } from "@/components/3d/SceneLighting";
import { AnimatedCube } from "@/components/3d/AnimatedCube";
import { Header } from "@/components/header/Header";

const Index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-950">
      {/* 3D Canvas Background (z-index base) */}
      <Scene className="absolute inset-0 w-full h-full">
        <SceneLighting />
        <AnimatedCube />
      </Scene>

      {/* Site header sits above the 3D scene */}
      <Header />

      {/* HTML Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center space-y-6 px-6">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.3em] text-white/90 uppercase">
            yyre
          </h1>
          <p className="text-base md:text-lg font-light tracking-[0.15em] text-white/40 uppercase">
            Where form meets fabric
          </p>
          <div className="pt-8">
            <span className="inline-block h-px w-16 bg-white/20" />
          </div>
          <p className="text-xs tracking-[0.2em] text-white/20 uppercase mt-4">
            3D Environment Active
          </p>
        </div>
      </div>

      {/* Bottom corner hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[10px] tracking-[0.25em] text-white/15 uppercase">
          scroll to explore
        </p>
        <div className="mt-2 animate-bounce text-white/20 text-lg">↓</div>
      </div>
    </div>
  );
};

export default Index;