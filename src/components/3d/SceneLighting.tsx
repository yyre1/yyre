export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-5, -3, -5]}
        intensity={0.3}
        color="#6366f1"
      />
      <pointLight position={[0, -2, 2]} intensity={0.6} color="#a78bfa" />
    </>
  );
}