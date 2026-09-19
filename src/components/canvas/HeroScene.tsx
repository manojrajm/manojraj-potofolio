import { Float, Lightformer, Environment, Line, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const VIOLET = "#7157ff";
const SILVER = "#c9cbd3";
const DARK = "#070707";

function Core({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const nodes = useMemo(() => Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const r = i % 2 === 0 ? 2.3 : 1.75;
    return [Math.cos(a) * r, Math.sin(a * 2) * 0.75, Math.sin(a) * r] as [number, number, number];
  }), []);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    if (!group.current || !ringA.current || !ringB.current) return;
    if (!reducedMotion) {
      group.current.rotation.y += dt * 0.13;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.12, dt * 2);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -pointer.x * 0.08, dt * 2);
      ringA.current.rotation.z += dt * 0.22;
      ringB.current.rotation.x -= dt * 0.16;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
    }
  });

  return (
    <group ref={group}>
      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh>
          <icosahedronGeometry args={[1.08, 2]} />
          <meshPhysicalMaterial color="#171526" metalness={0.65} roughness={0.18} transmission={0.28} thickness={1.5} emissive={VIOLET} emissiveIntensity={0.16} />
        </mesh>
        <mesh scale={0.68}>
          <octahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={VIOLET} metalness={0.8} roughness={0.2} emissive={VIOLET} emissiveIntensity={1.4} />
        </mesh>
      </Float>
      <mesh ref={ringA} rotation={[Math.PI / 2.6, 0.2, 0]}>
        <torusGeometry args={[1.65, 0.025, 10, 120]} />
        <meshStandardMaterial color={SILVER} metalness={1} roughness={0.15} emissive={VIOLET} emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={ringB} rotation={[0.4, 0, Math.PI / 2.5]}>
        <torusGeometry args={[2.05, 0.018, 8, 120]} />
        <meshStandardMaterial color={VIOLET} metalness={0.9} roughness={0.22} emissive={VIOLET} emissiveIntensity={0.65} />
      </mesh>
      {nodes.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[index % 3 === 0 ? 0.08 : 0.045, 12, 12]} />
          <meshBasicMaterial color={index % 3 === 0 ? SILVER : VIOLET} />
        </mesh>
      ))}
      <Line points={nodes.slice(0, 10)} color={VIOLET} lineWidth={0.65} transparent opacity={0.42} />
      {[["CODE", -2.5, 0.1], ["API", -0.9, 2.05], ["DB", 1.15, -1.95], ["PRODUCT", 2.35, 0.35]].map(([label, x, y]) => (
        <Text key={String(label)} position={[Number(x), Number(y), 0]} fontSize={0.18} color={SILVER} anchorX="center" anchorY="middle">
          {label}
        </Text>
      ))}
    </group>
  );
}

export default function HeroScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 7.4], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <color attach="background" args={[DARK]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 4]} intensity={18} color={VIOLET} distance={12} />
      <pointLight position={[-4, -2, 3]} intensity={10} color={SILVER} distance={10} />
      <Suspense fallback={null}>
        <Core reducedMotion={reducedMotion} />
        <Environment resolution={64}>
          <Lightformer intensity={3} position={[0, 4, -2]} scale={[10, 3, 1]} color={SILVER} />
          <Lightformer intensity={2} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 1, 1]} color={VIOLET} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
