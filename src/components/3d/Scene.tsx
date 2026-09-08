import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Suspense } from "react";

type SceneProps = Omit<CanvasProps, "children"> & {
  children: React.ReactNode;
};

export function Scene({ children, className, style, ...canvasProps }: SceneProps) {
  return (
    <Canvas
      className={className}
      style={style}
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      performance={{ min: 0.5 }}
      {...canvasProps}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}