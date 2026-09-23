import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Humanoid } from "./Humanoid";

export type SectionType = "hero" | "about" | "experience" | "skills" | "projects" | "contact";

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
    const contactEl = document.getElementById("contact");

    const aboutTop = aboutEl ? aboutEl.getBoundingClientRect().top : winH * 2;
    const expTop = expEl ? expEl.getBoundingClientRect().top : winH * 2;
    const skillsTop = skillsEl ? skillsEl.getBoundingClientRect().top : winH * 2;
    const projectsTop = projectsEl ? projectsEl.getBoundingClientRect().top : winH * 2;
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
      // Character moves to FAR LEFT (-1.75), rotates right (+0.75 rad / ~43 deg) facing the About Me text,
      // and triggers the ABOUT_POINT animation with right arm raised gesturing toward the content!
      nextSection = "about";
      nextAnim = "ABOUT_POINT";
      const progress = Math.min(1, Math.max(0, 1 - aboutTop / (winH * 0.45)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.45, -1.75, progress);
      targetY = isMobile ? -0.95 : THREE.MathUtils.lerp(-1.05, -1.0, progress);
      targetZ = isMobile ? -0.4 : 0.35;
      targetRotY = THREE.MathUtils.lerp(-0.38, 0.72, progress) + (pointer.x * 0.12);
      targetScale = isMobile ? 1.35 : 1.8;
    } else if (skillsTop > winH * 0.45) {
      // 3. EXPERIENCE SECTION:
      // Transitions from LEFT to FAR RIGHT (+1.65) with 360-degree spin
      // Enters coding stance typing on floating holographic terminal
      nextSection = "experience";
      nextAnim = "TECH_GESTURE";
      const progress = Math.min(1, Math.max(0, 1 - expTop / (winH * 0.45)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(-1.75, 1.65, progress);
      targetY = isMobile ? -0.95 : -1.02;
      targetZ = isMobile ? -0.5 : 0.15;
      targetRotY = THREE.MathUtils.lerp(0.72, Math.PI * 2.0 - 0.35, progress);
      targetScale = isMobile ? 1.3 : 1.78;
    } else if (projectsTop > winH * 0.45) {
      // 4. SKILLS SECTION:
      // Glides from RIGHT to DEAD CENTER (0.0)
      // Scales up to 1.95x, presenting full-stack constellation with wide arms
      nextSection = "skills";
      nextAnim = "SKILLS_PRESENT";
      const progress = Math.min(1, Math.max(0, 1 - skillsTop / (winH * 0.45)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.65, 0.0, progress);
      targetY = isMobile ? -1.05 : -1.15;
      targetZ = isMobile ? -0.3 : 0.65;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 2.0 - 0.35, Math.PI * 4.0, progress) + (pointer.x * 0.15);
      targetScale = isMobile ? 1.4 : 1.95;
    } else if (contactTop > winH * 0.55) {
      // 5. PROJECTS SECTION:
      // Glides to side (+1.8), attentive stance observing selected work
      nextSection = "projects";
      nextAnim = "PROJECTS_INSPECT";
      const progress = Math.min(1, Math.max(0, 1 - projectsTop / (winH * 0.45)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(0.0, 1.8, progress);
      targetY = isMobile ? -0.95 : -1.0;
      targetZ = isMobile ? -0.4 : 0.25;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 4.0, Math.PI * 3.8, progress) + (pointer.x * 0.15);
      targetScale = isMobile ? 1.35 : 1.8;
    } else {
      // 6. CONTACT SECTION:
      // Glides back to DEAD CENTER (0.0), faces directly forward
      // Waving hand greeting in completion of the portfolio journey!
      nextSection = "contact";
      nextAnim = "WAVE";
      const progress = Math.min(1, Math.max(0, 1 - contactTop / (winH * 0.55)));
      targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.8, 0.0, progress);
      targetY = isMobile ? -0.95 : -1.05;
      targetZ = isMobile ? -0.3 : 0.82;
      targetRotY = THREE.MathUtils.lerp(Math.PI * 3.8, Math.PI * 4.0, progress) + (pointer.x * -0.15);
      targetScale = isMobile ? 1.45 : 1.9;
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
