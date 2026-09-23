import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

const ELECTRIC_VIOLET = "#8b5cf6";
const NEON_CYAN = "#06b6d4";
const GLOW_WHITE = "#ffffff";

/**
 * StudioEnvironment:
 * Professional 3-point studio lighting with subtle cyberpunk rim accents,
 * soft ground contact shadows, and HDRI lightformers.
 */
export function StudioEnvironment() {
  return (
    <>
      {/* Balanced Base Ambient Light */}
      <ambientLight intensity={1.35} />

      {/* Primary Key Light (Top-Right, White) */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={3.4}
        color={GLOW_WHITE}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Front-Left Fill Light (Soft Cool Slate) */}
      <directionalLight
        position={[-3.5, 2.5, 4.5]}
        intensity={2.1}
        color="#cbd5e1"
      />

      {/* Electric Violet Rim/Accent Light */}
      <pointLight
        position={[-4.5, 2.0, -2.5]}
        intensity={36}
        color={ELECTRIC_VIOLET}
        distance={15}
      />

      {/* Cyan Silhouette Edge Light */}
      <pointLight
        position={[4.0, -1.0, 3.0]}
        intensity={24}
        color={NEON_CYAN}
        distance={14}
      />

      {/* Soft Bottom Fill Bounce */}
      <pointLight
        position={[0, -2.5, 2.0]}
        intensity={14}
        color={ELECTRIC_VIOLET}
        distance={10}
      />

      {/* Subtle Ground Contact Shadow */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.65}
        scale={3.2}
        blur={2.4}
        far={2.2}
        color="#000000"
      />

      {/* Environment Lightformers for Realistic Metallic Specular Highlights */}
      <Environment resolution={128}>
        <Lightformer
          intensity={3.0}
          position={[0, 5, -2]}
          scale={[12, 4, 1]}
          color={GLOW_WHITE}
        />
        <Lightformer
          intensity={4.5}
          position={[-5, 2, 2]}
          rotation-y={Math.PI / 2}
          scale={[8, 2, 1]}
          color={ELECTRIC_VIOLET}
        />
        <Lightformer
          intensity={3.0}
          position={[5, -2, 2]}
          rotation-y={-Math.PI / 2}
          scale={[6, 2, 1]}
          color={NEON_CYAN}
        />
      </Environment>
    </>
  );
}
