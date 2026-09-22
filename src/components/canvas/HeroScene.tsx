import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

// Colors aligned with modern dark portfolio design
const ELECTRIC_VIOLET = "#8b5cf6";
const CYAN_ACCENT = "#06b6d4";
const SILVER_GLOW = "#f1f5f9";

// Preload the rigged character model
useGLTF.preload("/Char.glb");

interface CharacterModelProps {
  reducedMotion?: boolean;
}

function RiggedCharacterModel({ reducedMotion = false }: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();

  // Load the rigged 65-bone character model directly (do NOT clone, so SkinnedMesh remains bound)
  const { scene } = useGLTF("/Char.glb");

  // Extract bone references and optimize materials on the active scene
  const bones = useMemo(() => {
    const boneMap: Record<string, THREE.Bone> = {};

    scene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        boneMap[child.name] = child as THREE.Bone;
      }
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false; // Prevents skinned meshes from disappearing during bone movement
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.min(mat.roughness ?? 0.4, 0.45);
          mat.metalness = Math.max(mat.metalness ?? 0.25, 0.35);
          mat.envMapIntensity = 2.4;
        }
      }
    });

    return boneMap;
  }, [scene]);

  // Capture the original T-pose rest rotations of all bones once
  const initialRotations = useRef<Record<string, THREE.Euler>>({});
  useEffect(() => {
    Object.entries(bones).forEach(([name, bone]) => {
      if (!initialRotations.current[name]) {
        initialRotations.current[name] = bone.rotation.clone();
      }
    });
  }, [bones]);

  // Frame loop for procedural bone animations and cross-section 3D transitions
  useFrame((state, rawDelta) => {
    if (!groupRef.current) return;
    const dt = Math.min(rawDelta, 0.08);
    const isMobile = viewport.width < 6.0;
    const time = state.clock.elapsedTime;
    const inits = initialRotations.current;

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

    // 1. World Transform Targets
    let targetX = 1.38;
    let targetY = -1.05;
    let targetZ = 0.25;
    let targetRotX = 0;
    let targetRotY = -0.35;
    let targetRotZ = 0;
    let targetScale = isMobile ? 1.35 : 1.85;

    // 2. Procedural Bone Rotation Offsets (relative to T-pose)
    // Relaxed developer posture: lower arms naturally from T-pose
    let leftArmOffsetZ = -1.05;
    let leftArmOffsetX = 0.2;
    let leftArmOffsetY = 0.0;
    let leftForeArmOffsetX = 0.35;

    let rightArmOffsetZ = 1.05;
    let rightArmOffsetX = 0.2;
    let rightArmOffsetY = 0.0;
    let rightForeArmOffsetX = 0.35;
    let rightHandOffsetZ = 0.0;

    if (aboutTop > winH * 0.45) {
      // 1. HERO SECTION:
      // Positioned on the right-side stage, facing slightly towards the left copy
      targetX = isMobile ? 0 : 1.38;
      targetY = isMobile ? -0.95 : -1.05;
      targetZ = isMobile ? -0.5 : 0.25;
      targetRotY = isMobile ? 0 : -0.35 + (pointer.x * -0.2);
      targetScale = isMobile ? 1.35 : 1.85;

      leftArmOffsetZ = -1.05;
      rightArmOffsetZ = 1.05;
    } else if (expTop > winH * 0.45) {
      // 2. ABOUT SECTION:
      // Glides across to the left side, rotates 45° to face right towards content
      const t = Math.min(1, Math.max(0, 1 - (aboutTop / (winH * 0.45))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.38, -1.85, t);
      targetY = isMobile ? -0.95 : THREE.MathUtils.lerp(-1.05, -1.0, t);
      targetZ = isMobile ? -0.5 : 0.35;
      targetRotY = THREE.MathUtils.lerp(-0.35, 0.75, t) + (pointer.x * 0.15);
      targetScale = isMobile ? 1.35 : 1.8;

      // Left arm raises gesturing towards the About Me content!
      leftArmOffsetZ = THREE.MathUtils.lerp(-1.05, -0.5, t);
      leftArmOffsetY = THREE.MathUtils.lerp(0.0, 0.45, t);
      leftForeArmOffsetX = THREE.MathUtils.lerp(0.35, 0.7, t);
      rightArmOffsetZ = 1.1;
    } else if (skillsTop > winH * 0.45) {
      // 3. EXPERIENCE SECTION:
      // Shifts to right-center, engages in Holographic Coding / Terminal Typing gesture
      const t = Math.min(1, Math.max(0, 1 - (expTop / (winH * 0.45))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(-1.85, 1.75, t);
      targetY = isMobile ? -0.95 : -1.02;
      targetZ = isMobile ? -0.6 : 0.1;
      targetRotY = THREE.MathUtils.lerp(0.75, -0.4, t);
      targetScale = isMobile ? 1.3 : 1.78;

      // Typing posture: both arms forward, forearms raised, simulated typing oscillations
      const typeWiggleLeft = Math.sin(time * 6.5) * 0.05;
      const typeWiggleRight = Math.cos(time * 7.0) * 0.05;
      leftArmOffsetX = 0.75 + typeWiggleLeft;
      rightArmOffsetX = 0.75 + typeWiggleRight;
      leftArmOffsetZ = -0.3;
      rightArmOffsetZ = 0.3;
      leftForeArmOffsetX = 0.75;
      rightForeArmOffsetX = 0.75;
    } else if (projectsTop > winH * 0.45) {
      // 4. SKILLS SECTION:
      // Centered inside constellation, arms spread in architecture showcase
      const t = Math.min(1, Math.max(0, 1 - (skillsTop / (winH * 0.45))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.75, 0.0, t);
      targetY = isMobile ? -1.05 : -1.15;
      targetZ = isMobile ? -0.4 : 0.65;
      targetRotY = THREE.MathUtils.lerp(-0.4, Math.PI * 2.15, t) + (pointer.x * 0.2);
      targetScale = isMobile ? 1.4 : 1.95;

      // Architectural presentation posture: hands open wide
      leftArmOffsetZ = -0.75;
      leftArmOffsetY = -0.3;
      rightArmOffsetZ = 0.75;
      rightArmOffsetY = 0.3;
    } else if (contactTop > winH * 0.55) {
      // 5. PROJECTS SECTION:
      // Right side observation pose
      const t = Math.min(1, Math.max(0, 1 - (projectsTop / (winH * 0.45))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(0.0, 1.85, t);
      targetY = isMobile ? -0.95 : -1.0;
      targetZ = isMobile ? -0.5 : 0.25;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 2.15, Math.PI * 1.8, t) + (pointer.x * 0.15);
      targetScale = isMobile ? 1.35 : 1.8;

      leftArmOffsetZ = -1.05;
      rightArmOffsetZ = 0.55;
      rightForeArmOffsetX = 1.25;
    } else {
      // 6. CONTACT SECTION:
      // Centered facing forward, waving greeting gesture!
      const t = Math.min(1, Math.max(0, 1 - (contactTop / (winH * 0.55))));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.85, 0.0, t);
      targetY = isMobile ? -0.95 : -1.05;
      targetZ = isMobile ? -0.4 : 0.85;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 1.8, Math.PI * 2.0, t) + (pointer.x * -0.2);
      targetScale = isMobile ? 1.45 : 1.9;

      // Waving arm greeting!
      rightArmOffsetZ = 2.05;
      rightForeArmOffsetX = 0.35;
      rightHandOffsetZ = Math.sin(time * 6.5) * 0.4; // Hand waving left-to-right!
      leftArmOffsetZ = -1.05;
    }

    // Apply Procedural Bone Rotations with Smooth Lerping
    const boneSpeed = dt * 5.5;

    // Organic Breathing on Spine
    if (!reducedMotion) {
      const breath = Math.sin(time * 1.6);
      if (bones["mixamorig:Spine"] && inits["mixamorig:Spine"]) {
        bones["mixamorig:Spine"].rotation.x = THREE.MathUtils.lerp(
          bones["mixamorig:Spine"].rotation.x,
          inits["mixamorig:Spine"].x + breath * 0.04,
          boneSpeed
        );
      }
      if (bones["mixamorig:Spine1"] && inits["mixamorig:Spine1"]) {
        bones["mixamorig:Spine1"].rotation.x = THREE.MathUtils.lerp(
          bones["mixamorig:Spine1"].rotation.x,
          inits["mixamorig:Spine1"].x + breath * 0.03,
          boneSpeed
        );
      }
      targetY += breath * 0.015;
    }

    // Interactive Head & Neck Tracking (Cursor Look-At)
    if (!reducedMotion) {
      if (bones["mixamorig:Head"] && inits["mixamorig:Head"]) {
        const targetHeadY = inits["mixamorig:Head"].y + (pointer.x * 0.45);
        const targetHeadX = inits["mixamorig:Head"].x + (-pointer.y * 0.3);
        bones["mixamorig:Head"].rotation.y = THREE.MathUtils.lerp(bones["mixamorig:Head"].rotation.y, targetHeadY, dt * 5);
        bones["mixamorig:Head"].rotation.x = THREE.MathUtils.lerp(bones["mixamorig:Head"].rotation.x, targetHeadX, dt * 5);
      }
      if (bones["mixamorig:Neck"] && inits["mixamorig:Neck"]) {
        const targetNeckY = inits["mixamorig:Neck"].y + (pointer.x * 0.22);
        bones["mixamorig:Neck"].rotation.y = THREE.MathUtils.lerp(bones["mixamorig:Neck"].rotation.y, targetNeckY, dt * 5);
      }
    }

    // Left Arm & ForeArm
    if (bones["mixamorig:LeftArm"] && inits["mixamorig:LeftArm"]) {
      bones["mixamorig:LeftArm"].rotation.z = THREE.MathUtils.lerp(bones["mixamorig:LeftArm"].rotation.z, inits["mixamorig:LeftArm"].z + leftArmOffsetZ, boneSpeed);
      bones["mixamorig:LeftArm"].rotation.x = THREE.MathUtils.lerp(bones["mixamorig:LeftArm"].rotation.x, inits["mixamorig:LeftArm"].x + leftArmOffsetX, boneSpeed);
      bones["mixamorig:LeftArm"].rotation.y = THREE.MathUtils.lerp(bones["mixamorig:LeftArm"].rotation.y, inits["mixamorig:LeftArm"].y + leftArmOffsetY, boneSpeed);
    }
    if (bones["mixamorig:LeftForeArm"] && inits["mixamorig:LeftForeArm"]) {
      bones["mixamorig:LeftForeArm"].rotation.x = THREE.MathUtils.lerp(bones["mixamorig:LeftForeArm"].rotation.x, inits["mixamorig:LeftForeArm"].x + leftForeArmOffsetX, boneSpeed);
    }

    // Right Arm, ForeArm & Hand
    if (bones["mixamorig:RightArm"] && inits["mixamorig:RightArm"]) {
      bones["mixamorig:RightArm"].rotation.z = THREE.MathUtils.lerp(bones["mixamorig:RightArm"].rotation.z, inits["mixamorig:RightArm"].z + rightArmOffsetZ, boneSpeed);
      bones["mixamorig:RightArm"].rotation.x = THREE.MathUtils.lerp(bones["mixamorig:RightArm"].rotation.x, inits["mixamorig:RightArm"].x + rightArmOffsetX, boneSpeed);
      bones["mixamorig:RightArm"].rotation.y = THREE.MathUtils.lerp(bones["mixamorig:RightArm"].rotation.y, inits["mixamorig:RightArm"].y + rightArmOffsetY, boneSpeed);
    }
    if (bones["mixamorig:RightForeArm"] && inits["mixamorig:RightForeArm"]) {
      bones["mixamorig:RightForeArm"].rotation.x = THREE.MathUtils.lerp(bones["mixamorig:RightForeArm"].rotation.x, inits["mixamorig:RightForeArm"].x + rightForeArmOffsetX, boneSpeed);
    }
    if (bones["mixamorig:RightHand"] && inits["mixamorig:RightHand"]) {
      bones["mixamorig:RightHand"].rotation.z = THREE.MathUtils.lerp(bones["mixamorig:RightHand"].rotation.z, inits["mixamorig:RightHand"].z + rightHandOffsetZ, boneSpeed);
    }

    // Smooth Lerping of the World Root Group
    const groupSpeed = dt * 4.5;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, groupSpeed);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, groupSpeed);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, groupSpeed);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, groupSpeed);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, groupSpeed);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, groupSpeed);

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, groupSpeed);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, groupSpeed);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, groupSpeed);
  });

  return (
    <group ref={groupRef} position={[1.38, -1.05, 0.25]} scale={1.85}>
      <primitive object={scene} />
      {/* Soft Contact Shadow beneath character feet */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.65}
        scale={2.8}
        blur={2.4}
        far={2.2}
        color="#000000"
      />
    </group>
  );
}

export default function HeroScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.2], fov: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      {/* Cinematic Studio Lighting tuned for dark streetwear character */}
      <ambientLight intensity={0.9} />
      {/* Front Key Directional Light */}
      <directionalLight position={[4, 6, 5]} intensity={3.0} color={SILVER_GLOW} />
      {/* Fill Light for Face / Mask */}
      <directionalLight position={[-2, 3, 4]} intensity={2.0} color="#cbd5e1" />
      {/* Electric Violet Accent Light */}
      <pointLight position={[-4, 2, -2]} intensity={32} color={ELECTRIC_VIOLET} distance={14} />
      {/* Cyan Rim Light */}
      <pointLight position={[4, -1, 3]} intensity={20} color={CYAN_ACCENT} distance={12} />
      {/* Soft Bottom Violet Bounce */}
      <pointLight position={[0, -3, 2]} intensity={12} color={ELECTRIC_VIOLET} distance={10} />

      <Suspense fallback={null}>
        <RiggedCharacterModel reducedMotion={reducedMotion} />
        <Environment resolution={128}>
          <Lightformer intensity={3.5} position={[0, 5, -2]} scale={[12, 4, 1]} color={SILVER_GLOW} />
          <Lightformer intensity={4.5} position={[-5, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color={ELECTRIC_VIOLET} />
          <Lightformer intensity={2.8} position={[5, -2, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color={CYAN_ACCENT} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
