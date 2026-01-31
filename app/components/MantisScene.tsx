import { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Helper function to generate random data once
const generateParticleData = (count: number) => {
  const initPos = new Float32Array(count * 3)
  const targetPos = new Float32Array(count * 3)
  const rotations = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count)
    const theta = Math.sqrt(count * Math.PI) * phi

    const r = 1.8
    const x = r * Math.cos(theta) * Math.sin(phi)
    const y = r * Math.sin(theta) * Math.sin(phi)
    const z = r * Math.cos(phi)

    initPos[i * 3] = x
    initPos[i * 3 + 1] = y
    initPos[i * 3 + 2] = z

    const explodeFactor = 4 + Math.random() * 4
    targetPos[i * 3] = x * explodeFactor + (Math.random() - 0.5) * 3
    targetPos[i * 3 + 1] = y * explodeFactor + (Math.random() - 0.5) * 3
    targetPos[i * 3 + 2] = z * explodeFactor + (Math.random() - 0.5) * 3

    rotations[i * 3] = Math.random() * Math.PI
    rotations[i * 3 + 1] = Math.random() * Math.PI
    rotations[i * 3 + 2] = Math.random() * Math.PI
  }

  return { initialPositions: initPos, targetPositions: targetPos, randomRotations: rotations }
}

function AbstractShape() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const isMobile = viewport.width < 5.5 // Breakpoint for mobile layout in 3D units

  // Reduce particle count on mobile for better performance
  const count = isMobile ? 60 : 400
  
  // Store data in refs to avoid re-renders and keep it mutable but persistent
  const dataRef = useRef<{ initialPositions: Float32Array, targetPositions: Float32Array, randomRotations: Float32Array } | null>(null)
  const tempObjRef = useRef<THREE.Object3D>(new THREE.Object3D())

  // Initialize data once on mount using useEffect (not during render)
  useEffect(() => {
    // Regenerate data only if count changes (mobile <-> desktop switch)
    dataRef.current = generateParticleData(count)
  }, [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Optimization: Cache scrollY to avoid layout thrashing, though in loop it's unavoidable without scroll listener
    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight
    
    // Normalize scroll influence (0 to 1.5)
    const scrollProgress = Math.min(Math.max(scrollY / viewportHeight, 0), 1.5)
    const mixFactor = scrollProgress
    
    const tempObj = tempObjRef.current

    if (meshRef.current && dataRef.current) {
      const { initialPositions, targetPositions, randomRotations } = dataRef.current

      // Group rotation
      meshRef.current.rotation.y = t * 0.1
      meshRef.current.rotation.x = t * 0.05

      // Optimization: Use a simpler loop for mobile if needed, but reducing count is best
      for (let i = 0; i < count; i++) {
        const ix = initialPositions[i * 3]
        const iy = initialPositions[i * 3 + 1]
        const iz = initialPositions[i * 3 + 2]

        const tx = targetPositions[i * 3]
        const ty = targetPositions[i * 3 + 1]
        const tz = targetPositions[i * 3 + 2]

        // Smooth Lerp Position
        tempObj.position.x = ix + (tx - ix) * mixFactor
        tempObj.position.y = iy + (ty - iy) * mixFactor
        tempObj.position.z = iz + (tz - iz) * mixFactor

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
            clearcoat={isMobile ? 0 : 1} // Disable clearcoat on mobile
            clearcoatRoughness={0.1}
            iridescence={isMobile ? 0 : 1.5} // Disable iridescence on mobile
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-transparent pointer-events-none">
      <Canvas 
        camera={{ position: [-4, 0, 9], fov: 35 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]} // Cap DPR on mobile
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} 
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