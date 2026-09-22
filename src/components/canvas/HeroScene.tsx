import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

// Colors aligned with modern dark portfolio design
const ELECTRIC_VIOLET = "#8b5cf6";
const CYAN_ACCENT = "#06b6d4";
const SILVER_GLOW = "#e2e8f0";
const DARK_BG = "#070707";

// Preload the user's uploaded 3D robot toy model
useGLTF.preload("/3d-robot-toy.glb");

interface RobotModelProps {
  reducedMotion?: boolean;
}

function RobotToyModel({ reducedMotion = false }: RobotModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();

  // Load the user's specific GLB model exclusively
  const { scene } = useGLTF("/3d-robot-toy.glb");

  // Clone scene so materials/transforms are clean
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.min(mat.roughness ?? 0.3, 0.45);
          mat.metalness = Math.max(mat.metalness ?? 0.6, 0.7);
          mat.envMapIntensity = 1.6;
        }
      }
    });
    return clone;
  }, [scene]);

  // Track smoothed scroll progress across entire page
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scrollRef.current = Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Frame loop for section-by-section 3D transitions
  useFrame((state, rawDelta) => {
    if (!groupRef.current) return;
    const dt = Math.min(rawDelta, 0.08);
    const isMobile = viewport.width < 6.0;

    // Viewport-aware section positions
    const winH = window.innerHeight || 800;
    const aboutEl = document.getElementById("about");
    const expEl = document.getElementById("experience");
    const skillsEl = document.getElementById("skills");
    const projectsEl = document.getElementById("projects");
    const contactEl = document.getElementById("contact");

    const aboutTop = aboutEl ? aboutEl.getBoundingClientRect().top : winH * 2;
    const expTop = expEl ? expEl.getBoundingClientRect().top : winH * 2;
    const skillsTop = skillsEl ? skillsEl.getBoundingClientRect().top : winH * 2;
    const projectsTop = projectsEl ? projectsEl.getBoundingClientRect().top : winH * 2;
    const contactTop = contactEl ? contactEl.getBoundingClientRect().top : winH * 2;

    // Target transforms determined by current section in view
    let targetX = 1.35;
    let targetY = 0.05;
    let targetZ = 0.3;
    let targetRotX = pointer.y * 0.15;
    let targetRotY = -0.4 + (pointer.x * -0.25);
    let targetRotZ = 0;
    let targetScale = isMobile ? 2.3 : 3.4;

    if (aboutTop > winH * 0.45) {
      // 1. HERO SECTION:
      // Positioned on the right-side stage, facing slightly towards the left copy
      targetX = isMobile ? 0 : 1.35;
      targetY = isMobile ? -0.2 : 0.05;
      targetZ = isMobile ? -0.6 : 0.3;
      targetRotY = isMobile ? 0 : -0.4 + (pointer.x * -0.25);
      targetRotX = pointer.y * 0.15;
      targetScale = isMobile ? 2.3 : 3.4;
    } else if (expTop > winH * 0.45) {
      // 2. ABOUT SECTION:
      // Smoothly glides to left side, faces right towards the text and facts
      const t = Math.min(1, Math.max(0, 1 - (aboutTop / (winH * 0.45))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.35, -1.9, t);
      targetY = isMobile ? -0.2 : THREE.MathUtils.lerp(0.05, -0.3, t);
      targetZ = isMobile ? -0.7 : 0.4;
      targetRotY = THREE.MathUtils.lerp(-0.4, 0.85, t) + (pointer.x * 0.15);
      targetRotX = pointer.y * 0.12;
      targetScale = isMobile ? 2.2 : 3.3;
    } else if (skillsTop > winH * 0.45) {
      // 3. EXPERIENCE SECTION:
      // Moves to right side, exhibits mechanical side details
      const t = Math.min(1, Math.max(0, 1 - (expTop / (winH * 0.45))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(-1.9, 1.85, t);
      targetY = isMobile ? -0.2 : THREE.MathUtils.lerp(-0.3, 0.0, t);
      targetZ = isMobile ? -0.8 : 0.1;
      targetRotY = THREE.MathUtils.lerp(0.85, Math.PI * 1.5, t);
      targetRotX = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
      targetScale = isMobile ? 2.2 : 3.1;
    } else if (projectsTop > winH * 0.45) {
      // 4. SKILLS SECTION:
      // Centered, scale up, continuous slow hover rotation inside constellation
      const t = Math.min(1, Math.max(0, 1 - (skillsTop / (winH * 0.45))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.85, 0.0, t);
      targetY = isMobile ? -0.3 : THREE.MathUtils.lerp(0.0, -0.25, t);
      targetZ = isMobile ? -0.5 : 0.8;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 1.5, Math.PI * 2.2, t) + (pointer.x * 0.2);
      targetRotX = pointer.y * 0.15;
      targetScale = isMobile ? 2.4 : 3.7;
    } else if (contactTop > winH * 0.55) {
      // 5. PROJECTS & PROCESS SECTION:
      // Shifts to right side, dynamic viewing angle for project cards
      const t = Math.min(1, Math.max(0, 1 - (projectsTop / (winH * 0.45))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(0.0, 2.0, t);
      targetY = isMobile ? -0.2 : THREE.MathUtils.lerp(-0.25, 0.1, t);
      targetZ = isMobile ? -0.6 : 0.3;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 2.2, Math.PI * 1.8, t) + (pointer.x * 0.15);
      targetRotX = pointer.y * 0.1;
      targetScale = isMobile ? 2.3 : 3.2;
    } else {
      // 6. CONTACT FOOTER:
      // Center greeting position, facing front to welcome viewer
      const t = Math.min(1, Math.max(0, 1 - (contactTop / (winH * 0.55))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(2.0, 0.0, t);
      targetY = isMobile ? -0.2 : THREE.MathUtils.lerp(0.1, -0.3, t);
      targetZ = isMobile ? -0.5 : 1.0;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 1.8, Math.PI * 2.0, t) + (pointer.x * -0.2);
      targetRotX = pointer.y * 0.1;
      targetScale = isMobile ? 2.5 : 3.5;
    }

    // Add gentle organic floating motion
    if (!reducedMotion) {
      const floatY = Math.sin(state.clock.elapsedTime * 1.6) * 0.08;
      const floatRotZ = Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
      targetY += floatY;
      targetRotZ += floatRotZ;
    }

    // Smooth lerping towards target transforms
    const lerpSpeed = dt * 4.5;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, lerpSpeed);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, lerpSpeed);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpSpeed);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, lerpSpeed);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, lerpSpeed);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, lerpSpeed);

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, lerpSpeed);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, lerpSpeed);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, lerpSpeed);
  });

  return (
    <group ref={groupRef} position={[2.2, -0.4, 0.2]} scale={3.2}>
      <primitive object={clonedScene} />
      {/* Soft contact shadow beneath the robot */}
      <ContactShadows
        position={[0, -0.52, 0]}
        opacity={0.55}
        scale={2.5}
        blur={2.2}
        far={1.8}
        color="#000000"
      />
    </group>
  );
}

export default function HeroScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 7.2], fov: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      {/* Cinematic dark studio lighting */}
      <ambientLight intensity={0.65} />
      {/* Main key light */}
      <directionalLight position={[5, 6, 5]} intensity={2.2} color={SILVER_GLOW} />
      {/* Electric Violet accent light */}
      <pointLight position={[-4, 2, -2]} intensity={22} color={ELECTRIC_VIOLET} distance={14} />
      {/* Cyan secondary rim light */}
      <pointLight position={[4, -2, 3]} intensity={14} color={CYAN_ACCENT} distance={12} />
      {/* Soft bottom violet bounce */}
      <pointLight position={[0, -4, 2]} intensity={8} color={ELECTRIC_VIOLET} distance={10} />

      <Suspense fallback={null}>
        <RobotToyModel reducedMotion={reducedMotion} />
        <Environment resolution={128}>
          <Lightformer intensity={2.5} position={[0, 5, -2]} scale={[12, 4, 1]} color={SILVER_GLOW} />
          <Lightformer intensity={3.5} position={[-5, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color={ELECTRIC_VIOLET} />
          <Lightformer intensity={2} position={[5, -2, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color={CYAN_ACCENT} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
