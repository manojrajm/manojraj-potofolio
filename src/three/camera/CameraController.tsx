import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SectionType } from "../character/CharacterController";

interface CameraControllerProps {
  reducedMotion?: boolean;
  activeSection?: SectionType;
}

/**
 * CameraController:
 * Dedicated camera director orchestrating smooth camera position lerping,
 * dynamic lookAt targets per section, and subtle cursor parallax.
 */
export function CameraController({
  reducedMotion = false,
}: CameraControllerProps) {
  const { camera, pointer } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0.5, 0.4, 0));
  const currentLookAt = useRef(new THREE.Vector3(0.5, 0.4, 0));

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.08);
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

    // Default Camera Target (Hero Section)
    let camX = 0;
    let camY = 0;
    let camZ = 7.2;
    let lookX = 0.5;
    let lookY = 0.4;
    let lookZ = 0;

    if (aboutTop > winH * 0.45) {
      // 1. Hero: Center-aligned wide lens focusing slightly on right stage
      camX = 0;
      camY = 0;
      camZ = 7.2;
      lookX = 0.5;
      lookY = 0.4;
    } else if (expTop > winH * 0.45) {
      // 2. About: Camera glides slightly right to frame character on left & copy on right
      camX = 0.2;
      camY = 0.1;
      camZ = 6.8;
      lookX = -0.4;
      lookY = 0.35;
    } else if (skillsTop > winH * 0.45) {
      // 3. Experience: Close-up corporate presentation angle
      camX = -0.2;
      camY = 0.05;
      camZ = 6.6;
      lookX = 0.55;
      lookY = 0.25;
    } else if (projectsTop > winH * 0.45) {
      // 4. Skills: Wide focal point capturing character in center
      camX = 0.0;
      camY = 0.1;
      camZ = 6.3;
      lookX = 0.0;
      lookY = 0.2;
    } else if (contactTop > winH * 0.55) {
      // 5. Projects: Framing cards and character
      camX = -0.3;
      camY = 0.0;
      camZ = 6.9;
      lookX = 0.4;
      lookY = 0.3;
    } else {
      // 6. Contact: Intimate close-up for final wave
      camX = 0.0;
      camY = -0.05;
      camZ = 5.9;
      lookX = 0.0;
      lookY = 0.35;
    }

    // Subtle cursor parallax
    if (!reducedMotion) {
      camX += pointer.x * 0.35;
      camY += pointer.y * 0.25;
    }

    // Camera Position Interpolation
    const speed = dt * 3.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, speed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY, speed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, speed);

    // LookAt Target Interpolation
    targetLookAt.current.set(lookX, lookY, lookZ);
    currentLookAt.current.lerp(targetLookAt.current, speed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
