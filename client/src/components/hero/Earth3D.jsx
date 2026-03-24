import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ───────────────────────── Earth Globe ───────────────────────── */
function EarthGlobe({ scrollProgress = 0 }) {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const groupRef = useRef();

  // Drag rotation state
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0.41, y: 0 });

  // Load textures
  const [dayMap, nightMap, bumpMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth_day.jpg',
    '/textures/earth_night.jpg',
    '/textures/earth_topology.png',
  ]);

  // Custom shader for day/night blending
  const earthShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayMap },
        nightTexture: { value: nightMap },
        bumpTexture: { value: bumpMap },
        sunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D bumpTexture;
        uniform vec3 sunDirection;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;

          // Compute light intensity
          float intensity = dot(vNormal, sunDirection);
          float blendFactor = smoothstep(-0.15, 0.25, intensity);

          // Blend day and night
          vec3 color = mix(nightColor * 1.2, dayColor, blendFactor);

          // Add subtle specular highlight on oceans
          float bump = texture2D(bumpTexture, vUv).r;
          float specular = pow(max(dot(reflect(-sunDirection, vNormal), normalize(-vPosition)), 0.0), 20.0);
          color += vec3(0.15, 0.2, 0.35) * specular * (1.0 - bump) * blendFactor;



          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, [dayMap, nightMap, bumpMap]);

  // Pointer event handlers for drag rotation
  const onPointerDown = useCallback((e) => {
    e.stopPropagation();
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = { x: 0, y: 0 };
    // Capture pointer for smooth tracking
    e.target.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - previousMouse.current.x;
    const dy = e.clientY - previousMouse.current.y;
    dragVelocity.current = { x: dx * 0.003, y: dy * 0.003 };
    userRotation.current.y += dx * 0.005;
    userRotation.current.x += dy * 0.005;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback((e) => {
    isDragging.current = false;
  }, []);

  // Clouds material
  const cloudsMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Apply drag inertia when not dragging
    if (!isDragging.current) {
      // Decay velocity
      dragVelocity.current.x *= 0.95;
      dragVelocity.current.y *= 0.95;
      // Apply inertia
      userRotation.current.y += dragVelocity.current.x;
      userRotation.current.x += dragVelocity.current.y;
      // Auto-rotate when idle (very slow)
      if (Math.abs(dragVelocity.current.x) < 0.0005) {
        userRotation.current.y += delta * 0.08;
      }
    }

    // Apply user rotation to Earth and clouds
    if (earthRef.current) {
      earthRef.current.rotation.x = userRotation.current.x;
      earthRef.current.rotation.y = userRotation.current.y;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.x = userRotation.current.x;
      cloudsRef.current.rotation.y = userRotation.current.y + 0.1;
    }

    // Scroll-based transforms on the group
    const sp = typeof scrollProgress === 'number' ? scrollProgress : 0;

    // Earth rises up and shifts right as user scrolls
    const targetY = -1.2 + sp * 3.0;
    const targetX = sp * 2.0;
    const targetScale = 1 + sp * 0.5;

    // Smooth lerp for buttery movement
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.1;
    const currentScale = groupRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    groupRef.current.scale.setScalar(newScale);
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Earth sphere — interactive */}
      <mesh
        ref={earthRef}
        rotation={[0.41, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={earthShaderMaterial} attach="material" />
      </mesh>

      {/* Clouds layer */}
      <mesh ref={cloudsRef} rotation={[0.41, 0, 0]}>
        <sphereGeometry args={[2.015, 48, 48]} />
        <primitive object={cloudsMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* ───────────────────────── Star Field ───────────────────────── */
function StarField() {
  const starsRef = useRef();

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars
        radius={80}
        depth={60}
        count={4000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </group>
  );
}

/* ───────────────────────── Scene ───────────────────────── */
function Scene({ scrollProgress }) {
  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={2.0}
        color="#ffffff"
      />
      <directionalLight
        position={[-5, -2, -5]}
        intensity={0.15}
        color="#4488ff"
      />
      <StarField />
      <EarthGlobe scrollProgress={scrollProgress} />
    </>
  );
}

/* ───────────────────────── Loading Fallback ───────────────────────── */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-white/40 text-xs tracking-widest uppercase">Loading Earth</span>
      </div>
    </div>
  );
}

/* ───────────────────────── Main Export ───────────────────────── */
import { Suspense } from 'react';

export default function Earth3D({ scrollProgress = 0 }) {
  return (
    <div className="absolute inset-0 z-0">
      <LoadingFallback />
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent', cursor: 'grab' }}
        onPointerDown={(e) => e.target.style.cursor = 'grabbing'}
        onPointerUp={(e) => e.target.style.cursor = 'grab'}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
