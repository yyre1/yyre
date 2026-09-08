import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AnimatedCube() {
  const meshRef = useRef<Mesh>(null);
  const timeRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    
    // Accumulate time manually to prepare for THREE.Clock removal
    // and avoid unnecessary property access if it triggers warnings
    timeRef.current += delta;

    if (reducedMotion) {
      meshRef.current.rotation.y += delta * 0.2;
    } else {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.position.y = Math.sin(timeRef.current * 0.8) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <torusKnotGeometry args={[1, 0.35, 128, 64]} />
      <meshPhysicalMaterial
        color="#e2e8f0"
        metalness={0.8}
        roughness={0.2}
        clearcoat={0.3}
        clearcoatRoughness={0.25}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}