<<<<<<< HEAD
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";

type SceneProps = {
  children: React.ReactNode;
  className?: string;
};

export function Scene({ children, className }: SceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return (
      <div className={className} />
    );
  }

  return (
    <div className={className}>
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
=======
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import type { ReactNode } from 'react'

interface SceneProps {
  children: ReactNode
}

export function Scene({ children }: SceneProps) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls makeDefault />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
      />

      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  )
}
>>>>>>> 7feb5232bc6bf69f2a63a3b8eb4aded3523b4430
