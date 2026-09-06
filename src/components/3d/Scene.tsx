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
