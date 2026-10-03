import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Humanoid } from "./Humanoid";

export type SectionType = "hero" | "about" | "experience" | "skills" | "projects" | "process" | "contact";

interface CharacterControllerProps {
  reducedMotion?: boolean;
  onSectionChange?: (section: SectionType) => void;
}

/**
 * CharacterController:
 * Core State Machine orchestrating character position, rotation, scale,
 * and animation transitions between all portfolio sections.
 */
export function CharacterController({
  reducedMotion = false,
  onSectionChange,
}: CharacterControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();

  const [activeSection, setActiveSection] = useState<SectionType>("hero");
  const [activeAnimation, setActiveAnimation] = useState<string>("IDLE");
  const currentSectionRef = useRef<SectionType>("hero");

  useFrame((state, rawDelta) => {
    if (!groupRef.current) return;
    const dt = Math.min(rawDelta, 0.08);
    const isMobile = viewport.width < 6.0;

    // Viewport scroll measurement to detect active section
    const winH = window.innerHeight || 800;
    const aboutEl = document.getElementById("about");
    const expEl = document.getElementById("experience");
    const skillsEl = document.getElementById("skills");
    const projectsEl = document.getElementById("projects");
    const processEl = document.getElementById("process");
    const contactEl = document.getElementById("contact");

    const aboutTop = aboutEl ? aboutEl.getBoundingClientRect().top : winH * 2;
    const expTop = expEl ? expEl.getBoundingClientRect().top : winH * 2;
    const skillsTop = skillsEl ? skillsEl.getBoundingClientRect().top : winH * 2;
    const projectsTop = projectsEl ? projectsEl.getBoundingClientRect().top : winH * 2;
    const processTop = processEl ? processEl.getBoundingClientRect().top : winH * 2;
    const contactTop = contactEl ? contactEl.getBoundingClientRect().top : winH * 2;

    // Default Targets (Hero Section)
    let targetX = isMobile ? 0 : 1.45;
    let targetY = isMobile ? -0.95 : -1.05;
    let targetZ = isMobile ? -0.4 : 0.25;
    let targetRotY = isMobile ? 0 : -0.38 + (pointer.x * -0.2);
    let targetScale = isMobile ? 1.35 : 1.85;
    let nextSection: SectionType = "hero";
    let nextAnim = "IDLE";

    // Section Detection and Trajectory Targets
    if (aboutTop > winH * 0.45) {
      // 1. HERO SECTION:
      // Positioned on the right side, facing slightly left toward user and name
      nextSection = "hero";
      nextAnim = "IDLE";
      targetX = isMobile ? 0 : 1.45;
      targetY = isMobile ? -0.95 : -1.05;
      targetZ = isMobile ? -0.4 : 0.25;
      targetRotY = isMobile ? 0 : -0.38 + (pointer.x * -0.2);
      targetScale = isMobile ? 1.35 : 1.85;
    } else if (expTop > winH * 0.45) {
      // 2. ABOUT SECTION:
      // User Request: In about page look right side and raise the hand to placed the direction like visit the about content!
      // Character moves to FAR LEFT (-1.70), rotates right (+0.72 rad / ~41 deg) facing the About Me text,
      // and triggers the ABOUT_POINT animation with right arm raised gesturing toward the content!
      // Head lowered to -1.35 with scale 1.52 to ensure ~110px headroom completely below the floating navbar.
      nextSection = "about";
      nextAnim = "ABOUT_POINT";
      const progress = Math.min(1, Math.max(0, 1 - aboutTop / (winH * 0.45)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.45, -1.70, progress);
      targetY = isMobile ? -1.15 : THREE.MathUtils.lerp(-1.05, -1.35, progress);
      targetZ = isMobile ? -0.4 : 0.35;
      targetRotY = THREE.MathUtils.lerp(-0.38, 0.72, progress) + (pointer.x * 0.12);
      targetScale = isMobile ? 1.22 : 1.55;
    } else if (skillsTop > winH * 0.45) {
      // 3. EXPERIENCE SECTION:
      // Transitions from LEFT to FAR RIGHT (+1.75), standing in dedicated right stage column
      // Enters coding stance typing on floating holographic terminal
      // Moved to 1.75 so the character and holographic rings stand completely clear of the Bento card
      nextSection = "experience";
      nextAnim = "TECH_GESTURE";
      const progress = Math.min(1, Math.max(0, 1 - expTop / (winH * 0.45)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(-1.70, 1.75, progress);
      targetY = isMobile ? -1.15 : THREE.MathUtils.lerp(-1.35, -1.32, progress);
      targetZ = isMobile ? -0.5 : 0.15;
      targetRotY = THREE.MathUtils.lerp(0.72, Math.PI * 2.0 - 0.35, progress);
      targetScale = isMobile ? 1.24 : 1.56;
    } else if (projectsTop > winH * 0.45) {
      // 4. SKILLS SECTION:
      // Stands beside Technology Orbit on left side (-1.45), facing orbit (+0.48 rad)
      // Lowered to -1.36 for abundant headroom below navbar, scale 1.55
      // Enters complete skeletal chain SKILLS_PRESENT stance with upward open palm
      nextSection = "skills";
      nextAnim = "SKILLS_PRESENT";
      const progress = Math.min(1, Math.max(0, 1 - skillsTop / (winH * 0.45)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.75, -1.45, progress);
      targetY = isMobile ? -1.20 : THREE.MathUtils.lerp(-1.32, -1.36, progress);
      targetZ = isMobile ? -0.3 : 0.35;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 2.0 - 0.35, Math.PI * 4.0 + 0.48, progress) + (pointer.x * 0.12);
      targetScale = isMobile ? 1.25 : 1.55;
    } else if (processTop > winH * 0.45) {
      // 5. PROJECTS SECTION:
      // Glides to side (+1.8), attentive stance observing selected work
      nextSection = "projects";
      nextAnim = "PROJECTS_INSPECT";
      const progress = Math.min(1, Math.max(0, 1 - projectsTop / (winH * 0.45)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(-1.45, 1.8, progress);
      targetY = isMobile ? -0.95 : THREE.MathUtils.lerp(-1.36, -1.0, progress);
      targetZ = isMobile ? -0.4 : 0.25;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 4.0, Math.PI * 3.8, progress) + (pointer.x * 0.15);
      targetScale = isMobile ? 1.35 : 1.8;
    } else if (contactTop > winH * 0.55) {
      // 6. PROCESS SECTION (and transition through StackWall & Github):
      // Mid-screen centered position, harmonized with Bento card and circular floor pedestal
      nextSection = "process";
      const stage = (typeof window !== "undefined" && typeof (window as any).__processActiveStage === "number")
        ? (window as any).__processActiveStage
        : 0;
      const stageProgress = (typeof window !== "undefined" && typeof (window as any).__processProgress === "number")
        ? (window as any).__processProgress
        : 0;

      // Centered at mid-screen with comfortable scale (1.55) so head and pedestal are always in frame!
      targetX = isMobile ? 0 : 0.0;
      targetY = isMobile ? -1.0 : -1.05;
      targetZ = isMobile ? -0.35 : 0.22;
      targetScale = isMobile ? 1.25 : 1.55;

      // Choreographed movements for every scroll stage:
      if (stage === 0) {
        // Stage 01: Discover (Cyan) -> Holographic summon gesture pointing towards Discover slab
        nextAnim = "ABOUT_POINT";
        targetRotY = THREE.MathUtils.lerp(Math.PI * 3.8, Math.PI * 3.92, stageProgress * 4) + (pointer.x * 0.1);
      } else if (stage === 1) {
        // Stage 02: Design (Fuchsia) -> Spatial UI presentation gesture
        nextAnim = "SKILLS_PRESENT";
        targetRotY = Math.PI * 4.0 + (pointer.x * 0.12);
      } else if (stage === 2) {
        // Stage 03: Build (Purple) -> Coding stance / terminal engineering gesture
        nextAnim = "TECH_GESTURE";
        targetRotY = Math.PI * 4.0 - 0.08 + (pointer.x * 0.1);
      } else {
        // Stage 04: Deploy (Emerald) -> Production launch gesture / final confident rest pose
        if (stageProgress > 0.94) {
          nextAnim = "FINAL_POSE";
        } else {
          nextAnim = "PROJECTS_INSPECT";
        }
        targetRotY = Math.PI * 4.0 + (pointer.x * 0.12);
      }
    } else {
      // 7. CONTACT SECTION:
      // Glides to center, waving greeting in completion of portfolio journey!
      // Scale is kept balanced (1.56) and depth (0.32) so head and feet remain in frame like 1st img!
      nextSection = "contact";
      nextAnim = "WAVE";
      const progress = Math.min(1, Math.max(0, 1 - contactTop / (winH * 0.55)));
      targetX = isMobile ? 0 : 0.0;
      targetY = isMobile ? -0.95 : -1.05;
      targetZ = isMobile ? -0.3 : 0.32;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 3.8, Math.PI * 4.0, progress) + (pointer.x * -0.15);
      targetScale = isMobile ? 1.35 : 1.56;
    }

    // State notification on change
    if (nextSection !== currentSectionRef.current) {
      currentSectionRef.current = nextSection;
      setActiveSection(nextSection);
      setActiveAnimation(nextAnim);
      onSectionChange?.(nextSection);
    }

    // Smooth Transformation Interpolation
    const groupSpeed = reducedMotion ? 1.0 : dt * 4.5;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, groupSpeed);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, groupSpeed);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, groupSpeed);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, groupSpeed);

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, groupSpeed);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, groupSpeed);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, groupSpeed);
  });

  return (
    <group ref={groupRef} position={[1.45, -1.05, 0.25]} scale={1.85}>
      <Humanoid
        activeAnimation={activeAnimation}
        isTypingSection={activeSection === "experience"}
      />
    </group>
  );
}
