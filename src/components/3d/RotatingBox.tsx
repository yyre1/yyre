import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function RotatingBox() {
  const meshRef = useRef<Mesh>(null!)
  const prefersReducedMotion = usePrefersReducedMotion()

  useFrame((_, delta) => {
    if (prefersReducedMotion) return
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
