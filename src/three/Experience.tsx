import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { CameraController } from "./camera/CameraController";
import { CharacterController } from "./character/CharacterController";
import { StudioEnvironment } from "./environment/StudioEnvironment";
import { HolographicGlobe } from "./globe/HolographicGlobe";

interface ExperienceProps {
  reducedMotion?: boolean;
}

/**
 * Experience:
 * Single Persistent 3D R3F Canvas mounting the humanoid character,
 * camera director, studio environment, holographic globe, and section transition manager.
 */
export default function Experience({ reducedMotion = false }: ExperienceProps) {
  return (
    <Canvas
      dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.75)]}
      camera={{ position: [0, 0, 7.2], fov: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      {/* Studio Lighting & Reflection Lightformers */}
      <StudioEnvironment />

      {/* Cinematic Camera Controller */}
      <CameraController reducedMotion={reducedMotion} />

      {/* Suspense-bounded Rigged 3D Character & Global Hologram */}
      <Suspense fallback={null}>
        <CharacterController reducedMotion={reducedMotion} />
        <HolographicGlobe />
      </Suspense>
    </Canvas>
  );
}
