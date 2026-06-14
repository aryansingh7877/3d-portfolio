"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Cyberpunk color palette
const colors = [
  "#00F5FF", // Electric Cyan
  "#8A2EFF", // Neon Purple
  "#FF007A", // Hot Pink
  "#FF7A00", // Neon Orange
  "#00FFB2", // Emerald Glow
  "#00FFD9", // Aqua
  "#2B4EFF", // Royal Blue
  "#A855F7", // Laser Violet
  "#FF00E4"  // Magenta
];

// Building Facade Custom Shader Material
const buildingVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const buildingFragmentShader = `
  uniform float uTime;
  uniform vec3 uCityColor;
  uniform float uRandomSeed;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  // Simple hash function for pseudo-random numbers
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    // If the normal is pointing upwards (roof) or downwards, color it dark matte
    if (abs(vNormal.y) > 0.5) {
      gl_FragColor = vec4(0.01, 0.01, 0.03, 1.0);
      return;
    }

    // Determine the horizontal coordinate based on face orientation (to tile windows cleanly)
    float horiz = abs(vNormal.x) > 0.5 ? vWorldPosition.z : vWorldPosition.x;
    float vert = vWorldPosition.y;

    // Window grid dimensions (width ~0.8m, height ~1.5m)
    vec2 windowSpacing = vec2(0.9, 1.6);
    vec2 coord = vec2(horiz, vert) / windowSpacing;

    vec2 windowId = floor(coord);
    vec2 windowUv = fract(coord);

    // Margins between windows (window occupies 70% of grid cell, margin is 30%)
    float isWindow = step(0.15, windowUv.x) * step(0.15, windowUv.y) * 
                    step(windowUv.x, 0.85) * step(windowUv.y, 0.85);

    // Random choice if window is illuminated (65% fill rate)
    float rand = hash(windowId + vec2(uRandomSeed));
    float isWindowOn = step(0.35, rand);

    // Pick a neon color for each active window
    vec3 neonColor = vec3(0.0);
    float colorVal = hash(windowId * 2.3 + vec2(uRandomSeed + 5.67));

    if (colorVal < 0.15) {
      neonColor = vec3(0.0, 0.96, 1.0);   // Cyan (#00F5FF)
    } else if (colorVal < 0.30) {
      neonColor = vec3(0.54, 0.18, 1.0);  // Neon Purple (#8A2EFF)
    } else if (colorVal < 0.45) {
      neonColor = vec3(1.0, 0.0, 0.48);   // Hot Pink (#FF007A)
    } else if (colorVal < 0.60) {
      neonColor = vec3(0.0, 1.0, 0.70);   // Emerald (#00FFB2)
    } else if (colorVal < 0.75) {
      neonColor = vec3(1.0, 0.48, 0.0);   // Neon Orange (#FF7A00)
    } else if (colorVal < 0.90) {
      neonColor = vec3(0.0, 1.0, 0.85);   // Aqua (#00FFD9)
    } else {
      neonColor = vec3(0.17, 0.31, 1.0);  // Royal Blue (#2B4EFF)
    }

    // Flicker/glow animation over time
    float flickerSpeed = 2.0 + hash(windowId) * 8.0;
    float flicker = 0.75 + 0.25 * sin(uTime * flickerSpeed + rand * 100.0);

    // Glitch fast blink for 4% of windows
    if (hash(windowId + 17.89) > 0.96) {
      flicker = step(0.5, sin(uTime * 30.0 + rand * 50.0));
    }

    // Multiply emissive color to trigger bright bloom
    vec3 windowEmissive = neonColor * flicker * 3.5;

    // Dark wall color
    vec3 baseWall = vec3(0.005, 0.005, 0.015);

    // Structural building borders (floor dividers and column shadows)
    float borderX = step(0.92, windowUv.x) + step(windowUv.x, 0.08);
    float borderY = step(0.92, windowUv.y) + step(windowUv.y, 0.08);
    vec3 structureColor = vec3(0.01, 0.01, 0.02) + (borderX + borderY) * vec3(0.008);

    // Mix facade base with windows
    vec3 color = mix(baseWall + structureColor, windowEmissive, isWindow * isWindowOn);

    // Edge neon line trim (50% chance per building, drawn vertical trims on corners)
    float hasTrims = step(0.5, hash(vec2(uRandomSeed, 123.45)));
    if (hasTrims > 0.5) {
      // Draw trim near the horizontal edges of building face coordinates
      float verticalTrim = step(0.98, vUv.x) + step(vUv.x, 0.02);
      color += verticalTrim * uCityColor * 2.5;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Volumetric Searchlight Beam Component
const beamVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Searchlight beam sways slowly based on height (uv.y goes 0 -> 1)
    vec3 pos = position;
    float sway = uv.y * uv.y * 2.0;
    pos.x += sin(uTime * 0.8 + position.y * 0.15) * sway;
    pos.z += cos(uTime * 0.6 + position.y * 0.20) * sway;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const beamFragmentShader = `
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    // Fade height-wise (bottom is solid, top is completely transparent)
    float heightFade = pow(1.0 - vUv.y, 2.5);
    
    // Soften edges using camera-space face normal (Fresnel)
    float edgeFade = pow(abs(vNormal.z), 3.0);
    
    float intensity = heightFade * edgeFade * 0.25;
    
    gl_FragColor = vec4(uColor, intensity);
  }
`;

const VolumetricBeam = ({ height, color }: { height: number; color: string }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), [color]);

  // Position is centered on the beam height. We place the bottom of the cylinder at building height.
  // Cylinder height is 40, so offset is building height + 20.
  return (
    <mesh position={[0, height + 20, 0]}>
      <cylinderGeometry args={[0.05, 6, 40, 16, 8, true]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={beamVertexShader}
        fragmentShader={beamFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Moving Neon Traffic Trails (Roads)
const roadVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const roadFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    // Scrolling dashed lights simulating moving cars
    float speed = 3.5;
    float dash = step(0.85, fract(vUv.x * 20.0 - uTime * speed));
    gl_FragColor = vec4(uColor * dash * 4.0, dash * 0.75);
  }
`;

const Road = ({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), [color]);

  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const position: [number, number, number] = [
    (start[0] + end[0]) / 2,
    0.1, // slightly above ground floor
    (start[2] + end[2]) / 2
  ];

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, angle]}>
      <planeGeometry args={[length, 0.25]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={roadVertexShader}
        fragmentShader={roadFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Flying Cyberpunk Drones Component
const Drone = ({ index }: { index: number }) => {
  const ref = useRef<THREE.Group>(null);
  const color = colors[index % colors.length];

  const wingLMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const wingRMaterial = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    // Drone flight orbits around city center
    const speed = 0.25 + (index % 3) * 0.08;
    const radius = 25 + (index % 5) * 8;
    const angle = t * speed + index * 1.8;

    // Coordinate math: sine height oscillations
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.position.y = 12 + Math.sin(t * 2.0 + index) * 4 + (index % 3) * 4;

    // Small tilt matching forward motion direction
    ref.current.rotation.z = -Math.sin(angle) * 0.12;
    ref.current.rotation.x = Math.cos(angle) * 0.12;
    ref.current.rotation.y = -angle + Math.PI / 2;

    // Blink wings lights (dual navigation lights red/green)
    const blink = Math.sin(t * 12 + index) > 0;
    if (wingLMaterial.current) {
      wingLMaterial.current.color.set(blink ? "#ff0044" : "#1a0008");
    }
    if (wingRMaterial.current) {
      wingRMaterial.current.color.set(!blink ? "#00ff66" : "#001a0a");
    }
  });

  return (
    <group ref={ref}>
      {/* Central glowing capsule body */}
      <mesh>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      
      {/* Flight wing frames */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.15]} />
        <meshStandardMaterial color="#0b0b12" roughness={0.7} />
      </mesh>

      {/* Nav lights wings */}
      <mesh position={[0.6, 0, 0]}>
        <sphereGeometry args={[0.07, 4, 4]} />
        <meshBasicMaterial ref={wingLMaterial} toneMapped={false} />
      </mesh>
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[0.07, 4, 4]} />
        <meshBasicMaterial ref={wingRMaterial} toneMapped={false} />
      </mesh>

      {/* Searchlight cone pointing downward */}
      <mesh position={[0, -0.3, 0.2]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.3, 1.5, 8, 1, true]} />
        <meshBasicMaterial color={color} opacity={0.12} transparent blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

// Individual Skyscraper Component
interface SkyscraperProps {
  x: number;
  z: number;
  height: number;
  width: number;
  depth: number;
  shape: "rect" | "cylinder" | "double";
  accentColor: string;
  seed: number;
  hasBeam: boolean;
  hasAntenna: boolean;
  hasHelipad: boolean;
}

const Skyscraper = ({
  x,
  z,
  height,
  width,
  depth,
  shape,
  accentColor,
  seed,
  hasBeam,
  hasAntenna,
  hasHelipad
}: SkyscraperProps) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const antennaLightRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
    // Flashing rooftop red warning light
    if (antennaLightRef.current) {
      const blink = Math.sin(t * 6 + seed) > 0;
      antennaLightRef.current.color.set(blink ? "#ff0033" : "#220000");
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCityColor: { value: new THREE.Color(accentColor) },
    uRandomSeed: { value: seed }
  }), [accentColor, seed]);

  // Main shader material shared settings
  const shaderElement = (
    <shaderMaterial
      ref={materialRef}
      vertexShader={buildingVertexShader}
      fragmentShader={buildingFragmentShader}
      uniforms={uniforms}
    />
  );

  return (
    <group position={[x, 0, z]}>
      {/* Tower Geometry */}
      {shape === "rect" && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width, height, depth]} />
          {shaderElement}
        </mesh>
      )}

      {shape === "cylinder" && (
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry args={[width / 2, width / 2, height, 16]} />
          {shaderElement}
        </mesh>
      )}

      {shape === "double" && (
        <group>
          {/* Lower thicker tier */}
          <mesh position={[0, (height * 0.6) / 2, 0]}>
            <boxGeometry args={[width, height * 0.6, depth]} />
            {shaderElement}
          </mesh>
          {/* Upper narrower tier */}
          <mesh position={[0, height * 0.6 + (height * 0.4) / 2, 0]}>
            <boxGeometry args={[width * 0.7, height * 0.4, depth * 0.7]} />
            {shaderElement}
          </mesh>
        </group>
      )}

      {/* Volumetric Beam Searchlights */}
      {hasBeam && <VolumetricBeam height={height} color={accentColor} />}

      {/* Rooftop Helipad ring details */}
      {hasHelipad && shape === "rect" && (
        <mesh position={[0, height + 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[width * 0.25, width * 0.28, 16]} />
          <meshBasicMaterial color={accentColor} toneMapped={false} />
        </mesh>
      )}

      {/* Warning Antenna Spire */}
      {hasAntenna && (
        <group position={[0, height, 0]}>
          {/* Metal pole */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.03, 0.05, 3, 4]} />
            <meshStandardMaterial color="#0c0c16" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Warning beacon bulb */}
          <mesh position={[0, 3.0, 0]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshBasicMaterial ref={antennaLightRef} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// City Generator Component
const City = () => {
  const GRID_SIZE = 12;
  const CELL_SPACING = 8;

  // Generate buildings layout and configurations
  const cityData = useMemo(() => {
    const buildings: SkyscraperProps[] = [];
    const roadsList: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];

    const centerCoord = ((GRID_SIZE - 1) * CELL_SPACING) / 2;
    const maxDist = Math.sqrt(centerCoord * centerCoord * 2);

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const posX = x * CELL_SPACING - centerCoord;
        const posZ = z * CELL_SPACING - centerCoord;

        // Skip buildings on roads (avenues at cells modulo 4)
        const isRoadX = x % 4 === 0;
        const isRoadZ = z % 4 === 0;

        if (isRoadX || isRoadZ) {
          continue;
        }

        // Calculate distance weight from center for skyscrapers heights gradient
        const dist = Math.sqrt(posX * posX + posZ * posZ);
        const centerWeight = Math.max(0.0, 1.0 - dist / maxDist);

        // Random height: center buildings taller, outer buildings shorter
        const seed = Math.random();
        const baseHeight = 6.0 + centerWeight * 26.0;
        const height = baseHeight + seed * 16.0;

        // Random building dims
        const width = 3.8 + Math.random() * 1.6;
        const depth = 3.8 + Math.random() * 1.6;

        // Random shape choice
        let shape: "rect" | "cylinder" | "double" = "rect";
        const shapeSeed = Math.random();
        if (shapeSeed < 0.2) {
          shape = "cylinder";
        } else if (shapeSeed < 0.45 && height > 22) {
          shape = "double";
        }

        // Color and features
        const color = colors[Math.floor(Math.random() * colors.length)];
        const hasBeam = height > 28 && Math.random() < 0.22;
        const hasAntenna = Math.random() < 0.6;
        const hasHelipad = !hasBeam && shape === "rect" && Math.random() < 0.35;

        buildings.push({
          x: posX,
          z: posZ,
          height,
          width,
          depth,
          shape,
          accentColor: color,
          seed: seed * 1000,
          hasBeam,
          hasAntenna,
          hasHelipad
        });
      }
    }

    // Generate road traffic lines layout (along the empty cells)
    for (let i = 0; i <= GRID_SIZE; i += 4) {
      const roadCoord = i * CELL_SPACING - centerCoord;
      const extent = (GRID_SIZE * CELL_SPACING) / 2 + 10;

      // North-South roads
      roadsList.push({
        start: [roadCoord, 0.1, -extent],
        end: [roadCoord, 0.1, extent],
        color: i % 8 === 0 ? "#00F5FF" : "#FF007A"
      });

      // East-West roads
      roadsList.push({
        start: [-extent, 0.1, roadCoord],
        end: [extent, 0.1, roadCoord],
        color: i % 8 === 0 ? "#FF7A00" : "#8A2EFF"
      });
    }

    return { buildings, roadsList };
  }, []);

  return (
    <group>
      {/* Render skyscrapers */}
      {cityData.buildings.map((props, idx) => (
        <Skyscraper key={`building-${idx}`} {...props} />
      ))}

      {/* Render roads traffic light trails */}
      {cityData.roadsList.map((road, idx) => (
        <Road key={`road-${idx}`} {...road} />
      ))}

      {/* Render active flying drones */}
      {Array.from({ length: 12 }).map((_, idx) => (
        <Drone key={`drone-${idx}`} index={idx} />
      ))}
    </group>
  );
};

// Smooth Camera Controller with parallax scrolling integration
const CameraController = () => {
  const { camera } = useThree();
  const currentScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      currentScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Base orbit metrics
    const baseRadius = 46.0;
    const baseSpeed = 0.015;
    const baseHeight = 32.0;

    // Calculate document scroll percentage for dampening scroll parallax
    let scrollRatio = 0;
    if (typeof document !== "undefined") {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRatio = currentScrollY.current / (maxScroll || 1);
    }

    // Parallax variables
    const scrollAngleOffset = scrollRatio * Math.PI * 0.22;
    const scrollHeightOffset = scrollRatio * 16.0;
    const scrollRadiusOffset = scrollRatio * 6.0;

    // Animate target camera position
    const currentAngle = t * baseSpeed + scrollAngleOffset;
    const x = Math.sin(currentAngle) * (baseRadius - scrollRadiusOffset);
    const z = Math.cos(currentAngle) * (baseRadius - scrollRadiusOffset);
    const y = Math.max(14.0, baseHeight - scrollHeightOffset + Math.sin(t * 0.04) * 3.0);

    // Apply smooth linear interpolation (lerp) for micro-animations
    const targetPos = new THREE.Vector3(x, y, z);
    camera.position.lerp(targetPos, 0.04);

    // Look-at focal point (shifts down slightly as scrolling proceeds)
    const lookTarget = new THREE.Vector3(0, 6.0 - scrollRatio * 5.0, 0);
    camera.lookAt(lookTarget);
  });

  return null;
};

// Main Background Wrapper Component
export default function CyberpunkBackground() {
  return (
    <div className="fixed inset-0 w-full h-full z-[-10] bg-[#050509]">
      <Canvas
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping
        }}
        camera={{ position: [0, 35, 46], fov: 55, near: 1, far: 250 }}
      >
        <color attach="background" args={["#050509"]} />
        <fog attach="fog" args={["#050509", 15, 120]} />

        {/* Ambient environment setup */}
        <ambientLight intensity={0.15} />
        
        {/* Soft violet overhead atmospheric lighting */}
        <directionalLight position={[0, 40, 0]} intensity={0.4} color="#8A2EFF" />

        {/* Diagonal cyber cyan/pink fill key lights */}
        <directionalLight position={[30, 20, 30]} intensity={0.5} color="#00F5FF" />
        <directionalLight position={[-30, 20, -30]} intensity={0.4} color="#FF007A" />

        <City />
        
        {/* Animated Cyber Smog & Particle Reflections */}
        <Sparkles count={400} scale={90} size={5} speed={0.15} opacity={0.4} color="#8A2EFF" />
        <Sparkles count={300} scale={70} size={7} speed={0.25} opacity={0.6} color="#00F5FF" />
        <Sparkles count={200} scale={110} size={9} speed={0.08} opacity={0.3} color="#FF007A" />

        <CameraController />

        {/* Premium Bloom Post-processing configuration */}
        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.25} // Low threshold to allow nice window and neon trim emission bloom
            mipmapBlur
            intensity={1.8}
          />
          <Vignette eskil={false} offset={0.12} darkness={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
