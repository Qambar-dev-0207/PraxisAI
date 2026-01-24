'use client'

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function AbstractShape() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const isMobile = viewport.width < 5.5 // Breakpoint for mobile layout in 3D units

  const count = 500
  const tempObj = new THREE.Object3D()
  
  // Store data in refs to avoid re-renders and keep it mutable but persistent
  const dataRef = useRef<{ initialPositions: Float32Array, targetPositions: Float32Array, randomRotations: Float32Array } | null>(null)

  // Initialize data once on mount
  if (!dataRef.current) {
    const initPos = new Float32Array(count * 3)
    const targetPos = new Float32Array(count * 3)
    const rotations = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // 1. Fibonacci Sphere Distribution for a smooth "Solid Ball" surface
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi

      const r = 1.8 // Match the original scale
      const x = r * Math.cos(theta) * Math.sin(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(phi)

      initPos[i * 3] = x
      initPos[i * 3 + 1] = y
      initPos[i * 3 + 2] = z

      // 2. Exploded position: Random direction * distance
      const explodeFactor = 4 + Math.random() * 4
      targetPos[i * 3] = x * explodeFactor + (Math.random() - 0.5) * 3
      targetPos[i * 3 + 1] = y * explodeFactor + (Math.random() - 0.5) * 3
      targetPos[i * 3 + 2] = z * explodeFactor + (Math.random() - 0.5) * 3

      // 3. Random rotations
      rotations[i * 3] = Math.random() * Math.PI
      rotations[i * 3 + 1] = Math.random() * Math.PI
      rotations[i * 3 + 2] = Math.random() * Math.PI
    }
    dataRef.current = { initialPositions: initPos, targetPositions: targetPos, randomRotations: rotations }
  }

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight
    
    // Normalize scroll influence (0 to 1.5)
    const scrollProgress = Math.min(Math.max(scrollY / viewportHeight, 0), 1.5)
    const mixFactor = scrollProgress

    if (meshRef.current && dataRef.current) {
      const { initialPositions, targetPositions, randomRotations } = dataRef.current

      // Group rotation
      meshRef.current.rotation.y = t * 0.1
      meshRef.current.rotation.x = t * 0.05

      for (let i = 0; i < count; i++) {
        const ix = initialPositions[i * 3]
        const iy = initialPositions[i * 3 + 1]
        const iz = initialPositions[i * 3 + 2]

        const tx = targetPositions[i * 3]
        const ty = targetPositions[i * 3 + 1]
        const tz = targetPositions[i * 3 + 2]

        // Smooth Lerp Position
        tempObj.position.x = THREE.MathUtils.lerp(ix, tx, mixFactor)
        tempObj.position.y = THREE.MathUtils.lerp(iy, ty, mixFactor)
        tempObj.position.z = THREE.MathUtils.lerp(iz, tz, mixFactor)

        // Rotation
        tempObj.rotation.x = randomRotations[i*3] + t * 0.2
        tempObj.rotation.y = randomRotations[i*3+1] + t * 0.2
        
        // Scale: Smaller particles for a more refined look
        const scale = THREE.MathUtils.lerp(0.25, 0.08, mixFactor)
        tempObj.scale.set(scale, scale, scale)

        tempObj.updateMatrix()
        meshRef.current.setMatrixAt(i, tempObj.matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }

    if (wireframeRef.current) {
        // Wireframe expands and fades out as it "bursts"
        wireframeRef.current.rotation.y = -t * 0.05
        wireframeRef.current.scale.setScalar(2.4 + scrollProgress * 2)
        if (wireframeRef.current.material instanceof THREE.Material) {
            wireframeRef.current.material.opacity = Math.max(0.03 - scrollProgress * 0.05, 0)
        }
    }
  })

  return (
    <group scale={isMobile ? 0.55 : 1} position={isMobile ? [0, 0, 0] : [0, 0, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* The Bursting Particles */}
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshPhysicalMaterial
            color="#000000"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={1.5}
            iridescenceIOR={1.8}
            iridescenceThicknessRange={[100, 400]}
            envMapIntensity={2}
            />
        </instancedMesh>

        {/* The Outer Wireframe Shell */}
        <mesh ref={wireframeRef} scale={2.4}>
            <icosahedronGeometry args={[1, 3]} />
            <meshStandardMaterial
            color="#000000"
            wireframe={true}
            transparent={true}
            opacity={0.03}
            />
        </mesh>
        </Float>
    </group>
  )
}

export default function MantisScene() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-transparent pointer-events-none">
      <Canvas 
        camera={{ position: [-4, 0, 9], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }} 
      >
        <Suspense fallback={null}>
            {/* Transparent background so HTML background shows */}
            {/* <color attach="background" args={['#ffffff']} /> */}
            
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
            <pointLight position={[-10, -10, -10]} intensity={1} color="white" />
            <directionalLight position={[0, 5, 5]} intensity={2} color="#ffffff" />
            
            <AbstractShape />
            
            <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  )
}