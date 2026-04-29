"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";

function RotatingWireGlobe({ speed }: { speed: number }) {
  const groupRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.2 * speed;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          color="#C4B5FD"
          depthWrite={false}
          opacity={0.52}
          transparent
          wireframe
        />
      </mesh>
      <mesh scale={1.02}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#93C5FD"
          depthWrite={false}
          opacity={0.36}
          transparent
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function HeroGlobe() {
  const [hovered, setHovered] = useState(false);
  const speed = hovered ? 1.9 : 1;

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[200px] md:max-w-[260px] lg:max-w-[320px]"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ fov: 42, position: [0, 0, 2.65] }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <RotatingWireGlobe speed={speed} />
      </Canvas>
    </div>
  );
}
