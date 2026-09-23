import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CharacterAnimator } from "./CharacterAnimator";
import { CharacterLookAt } from "./CharacterLookAt";
import { reconstructMixamoHierarchy } from "./CharacterSkeleton";

// Cyberpunk theme accents
const ELECTRIC_VIOLET = "#8b5cf6";
const NEON_CYAN = "#06b6d4";
const NEON_MAGENTA = "#d946ef";

useGLTF.preload("/models/character/Char.glb");

interface HumanoidProps {
  activeAnimation: string;
  isTypingSection?: boolean;
}

/**
 * Concentric Neon Holographic Pedestal at character's feet
 */
function HolographicPedestal() {
  return (
    <group position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Pulse Ring */}
      <mesh>
        <ringGeometry args={[0.62, 0.68, 36]} />
        <meshBasicMaterial color={ELECTRIC_VIOLET} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      {/* Middle Cyan Ring */}
      <mesh>
        <ringGeometry args={[0.46, 0.50, 32]} />
        <meshBasicMaterial color={NEON_CYAN} transparent opacity={0.85} toneMapped={false} />
      </mesh>
      {/* Inner Subtle Disc */}
      <mesh>
        <circleGeometry args={[0.34, 24]} />
        <meshBasicMaterial color="#1a0b36" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

/**
 * Floating 3D Cyber Holographic Keyboard for Experience section
 */
function HolographicKeyboard({ visible = false }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = visible;
  }, [visible]);

  const keys = useMemo(() => {
    const list: [number, number][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        list.push([(col - 3.5) * 0.07, (1.0 - row) * 0.07]);
      }
    }
    return list;
  }, []);

  return (
    <group
      ref={groupRef}
      position={[0, 0.88, 0.46]}
      rotation={[-0.55, 0, 0]}
      visible={visible}
    >
      {/* Slab Base */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.65, 0.28, 0.015]} />
        <meshStandardMaterial
          color="#0d091a"
          roughness={0.2}
          metalness={0.8}
          emissive={ELECTRIC_VIOLET}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Cyber Keys */}
      {keys.map(([x, y], idx) => (
        <mesh key={`k-${idx}`} position={[x, y, 0.01]}>
          <boxGeometry args={[0.05, 0.05, 0.012]} />
          <meshBasicMaterial
            color={idx % 4 === 0 ? NEON_MAGENTA : NEON_CYAN}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Boundary Glow Frame */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.32, 0.34, 32]} />
        <meshBasicMaterial color={ELECTRIC_VIOLET} transparent opacity={0.65} toneMapped={false} />
      </mesh>
    </group>
  );
}


/**
 * Humanoid:
 * High-quality 65-bone rigged Mixamo character with authentic PBR textures,
 * reconstructed Forward Kinematics hierarchy, integrated AnimationMixer,
 * and dynamic CharacterLookAt cursor tracking.
 */
export function Humanoid({
  activeAnimation,
  isTypingSection = false,
}: HumanoidProps) {
  const { scene } = useGLTF("/models/character/Char.glb");
  const lookAtRef = useRef<CharacterLookAt | null>(null);

  // Reconstruct true Mixamo FK hierarchy and tune materials synchronously
  useMemo(() => {
    reconstructMixamoHierarchy(scene);

    scene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.min(mat.roughness ?? 0.5, 0.52);
          mat.metalness = Math.max(mat.metalness ?? 0.3, 0.4);
          mat.emissive = new THREE.Color("#2a1254");
          mat.emissiveIntensity = 0.42;
          mat.envMapIntensity = 2.4;
        }
      }
    });
  }, [scene]);

  // Initialize LookAt controller for head/neck cursor tracking
  useEffect(() => {
    if (scene) {
      lookAtRef.current = new CharacterLookAt(scene, {
        maxYaw: 0.55,
        maxPitch: 0.28,
        smoothness: 3.5,
      });
    }
  }, [scene]);

  useFrame(({ pointer }, delta) => {
    if (lookAtRef.current && activeAnimation === "IDLE") {
      lookAtRef.current.setPointer(pointer.x, pointer.y);
      lookAtRef.current.update(delta);
    }
  });

  return (
    <group>
      {/* 65-Bone Rigged Humanoid Scene */}
      <primitive object={scene} />

      {/* THREE.AnimationMixer Animator */}
      <CharacterAnimator rootObject={scene} activeAnimation={activeAnimation} />

      {/* Concentric Neon Pedestal */}
      <HolographicPedestal />

      {/* Floating Holographic Cyber Terminal Keyboard */}
      <HolographicKeyboard visible={isTypingSection} />
    </group>
  );
}
