import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface Hub {
  name: string;
  lat: number;
  lon: number;
  color: string;
}

const COIMBATORE: Hub = {
  name: "Coimbatore (HQ)",
  lat: 11.0168,
  lon: 76.9558,
  color: "#10b981", // Emerald origin
};

const GLOBAL_HUBS: Hub[] = [
  { name: "Silicon Valley", lat: 37.7749, lon: -122.4194, color: "#38bdf8" }, // Cyan
  { name: "London", lat: 51.5074, lon: -0.1278, color: "#a855f7" }, // Purple
  { name: "Singapore", lat: 1.3521, lon: 103.8198, color: "#f472b6" }, // Pink
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, color: "#fbbf24" }, // Amber
  { name: "Berlin", lat: 52.5200, lon: 13.4050, color: "#38bdf8" }, // Cyan
  { name: "Sydney", lat: -33.8688, lon: 151.2093, color: "#a855f7" }, // Purple
];

/**
 * Converts Latitude and Longitude to 3D Cartesian Vector3 on sphere
 */
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Creates circular glowing sprite texture for dot-matrix particles
 */
function createDotTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.35, "rgba(168, 85, 247, 0.95)");
    gradient.addColorStop(0.7, "rgba(56, 189, 248, 0.5)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function HolographicGlobe({ radius = 1.75 }: { radius?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringPulsesRef = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();
  const isMobile = viewport.width < 6.0;

  // 1. Generate Fibonacci Dot-Matrix Sphere Points (~1,500 particles)
  const { positions, colors } = useMemo(() => {
    const count = 1600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorViolet = new THREE.Color("#8b5cf6");
    const colorCyan = new THREE.Color("#38bdf8");
    const colorPink = new THREE.Color("#ec4899");

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Latitude-based Cyber Color Shift
      const normY = (y / radius + 1) / 2; // 0 to 1
      const c = normY > 0.65 ? colorCyan : normY < 0.35 ? colorPink : colorViolet;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, [radius]);

  // 2. Generate 3D Arcs connecting Coimbatore to Global Tech Hubs
  const originPos = useMemo(
    () => latLonToVector3(COIMBATORE.lat, COIMBATORE.lon, radius),
    [radius]
  );

  const arcGeometries = useMemo(() => {
    return GLOBAL_HUBS.map((hub) => {
      const destPos = latLonToVector3(hub.lat, hub.lon, radius);
      const dist = originPos.distanceTo(destPos);
      const mid = originPos.clone().add(destPos).multiplyScalar(0.5);
      // Lift control point above sphere surface for elegant arc
      const altitude = radius + dist * 0.32;
      const control = mid.normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(originPos, control, destPos);
      const points = curve.getPoints(36);
      return {
        geo: new THREE.BufferGeometry().setFromPoints(points),
        hub,
        destPos,
      };
    });
  }, [originPos, radius]);

  const dotTexture = useMemo(() => createDotTexture(), []);

  // Frame loop for auto-rotation and interactive cursor parallax
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.08);

    // Visibility management: check distance to contact section
    const contactEl = document.getElementById("contact");
    const winH = window.innerHeight || 800;
    const contactTop = contactEl ? contactEl.getBoundingClientRect().top : winH * 2;

    // Fade into visibility as user scrolls into the contact section
    const isContactVisible = contactTop < winH * 1.35;
    groupRef.current.visible = isContactVisible;

    if (!isContactVisible) return;

    // Smooth Slow Auto-Rotation
    groupRef.current.rotation.y += 0.22 * dt;

    // Subtle pointer parallax tilt
    const targetRotX = pointer.y * -0.12;
    const targetRotZ = pointer.x * 0.08;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      dt * 3.0
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotZ,
      dt * 3.0
    );

    // Pulse radar rings
    if (ringPulsesRef.current) {
      const pulseTime = state.clock.elapsedTime * 2.2;
      ringPulsesRef.current.children.forEach((child, idx) => {
        const ring = child as THREE.Mesh;
        const phase = (pulseTime + idx * 0.6) % 2.0;
        const scale = 1.0 + phase * 1.5;
        const opacity = Math.max(0, 1.0 - phase / 2.0);
        ring.scale.set(scale, scale, scale);
        if (ring.material instanceof THREE.MeshBasicMaterial) {
          ring.material.opacity = opacity * 0.75;
        }
      });
    }
  });

  return (
    <group
      ref={groupRef}
      position={isMobile ? [0, 0.2, -1.2] : [1.95, -0.15, -0.8]}
      scale={isMobile ? 0.78 : 1.05}
    >
      {/* Occlusion Core Sphere (Dark interior so back dots look occluded) */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 32, 32]} />
        <meshBasicMaterial color="#070410" transparent opacity={0.88} />
      </mesh>

      {/* Atmospheric Outer Rim Glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.03, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 1. Dot-Matrix Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          map={dotTexture}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Global Connection Bézier Arcs */}
      {arcGeometries.map(({ geo, hub }, idx) => (
        <line key={`arc-${hub.name}-${idx}`} geometry={geo}>
          <lineBasicMaterial
            color={hub.color}
            transparent
            opacity={0.7}
            linewidth={1.5}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}

      {/* 3. Origin Pin (Coimbatore, India) */}
      <group position={originPos}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={COIMBATORE.color} toneMapped={false} />
        </mesh>
      </group>

      {/* 4. Destination Hub Pins */}
      {arcGeometries.map(({ destPos, hub }, idx) => (
        <group key={`pin-${hub.name}-${idx}`} position={destPos}>
          <mesh>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshBasicMaterial color={hub.color} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* 5. Pulsing Radar Wave Rings */}
      <group ref={ringPulsesRef}>
        {/* Coimbatore Pulse */}
        <mesh position={originPos} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.08, 24]} />
          <meshBasicMaterial
            color={COIMBATORE.color}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Destination Pulses */}
        {arcGeometries.map(({ destPos, hub }, idx) => (
          <mesh
            key={`pulse-${hub.name}-${idx}`}
            position={destPos}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.04, 0.07, 24]} />
            <meshBasicMaterial
              color={hub.color}
              transparent
              opacity={0.75}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Equator & Longitude Guide Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.998, radius * 1.002, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}
