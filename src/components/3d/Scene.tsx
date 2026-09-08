import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";

type SceneProps = {
  children: React.ReactNode;
};

export function Scene({ children }: SceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return (
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}