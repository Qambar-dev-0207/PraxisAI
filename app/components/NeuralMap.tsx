'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float, Line, Sphere, Grid, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Thought, Pattern } from '../../lib/types'

interface NodeData {
  id: string
  label: string
  position: THREE.Vector3
  importance: string
  tags: string[]
  level: number
}

interface LinkData {
  start: THREE.Vector3
  end: THREE.Vector3
  type: string
}

function Node({ data, onSelect, isSelected }: { data: NodeData; onSelect: (d: NodeData) => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const color = data.importance === 'TODAY' ? '#f59e0b' : data.importance === 'WEEK' ? '#000000' : '#9ca3af'
  const scale = data.importance === 'TODAY' ? 1.5 : 1.0

  useFrame((state) => {
    if (meshRef.current && (hovered || isSelected)) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1)
    } else if (meshRef.current) {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  return (
    <group position={data.position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Node Body */}
        <Sphere
          ref={meshRef}
          args={[0.4 * scale, 32, 32]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSelect(data)}
        >
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || isSelected ? 8 : 0.8}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Level Marker Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5 * scale, 0.55 * scale, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </Float>

      {/* Label - Prominent Title */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.22}
        color={hovered || isSelected ? "black" : "rgba(0,0,0,0.4)"}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {data.label.length > 25 ? data.label.substring(0, 25) + '...' : data.label}
      </Text>
      
      {/* Index Tag */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.1}
        color="rgba(0,0,0,0.2)"
        anchorX="center"
        anchorY="middle"
      >
        ITEM_{data.id.substring(0,4).toUpperCase()}
      </Text>
    </group>
  )
}

function ConnectionLine({ link }: { link: LinkData }) {
  const lineRef = useRef<any>(null)
  const opacity = link.type === 'PATTERN' ? 0.8 : 0.15
  const color = link.type === 'PATTERN' ? '#f59e0b' : '#000000'

  useFrame((state) => {
    if (lineRef.current && link.type === 'PATTERN') {
        const t = state.clock.getElapsedTime()
        lineRef.current.material.dashOffset = -t * 2
        lineRef.current.material.opacity = 0.4 + Math.sin(t * 2) * 0.3
    }
  })

  // Calculate curve for branching feel
  const points = useMemo(() => {
      const mid = new THREE.Vector3().addVectors(link.start, link.end).multiplyScalar(0.5)
      mid.y += (link.end.x - link.start.x) * 0.2 // Add some "branch" curve
      return new THREE.QuadraticBezierCurve3(link.start, mid, link.end).getPoints(20)
  }, [link.start, link.end])

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={link.type === 'PATTERN' ? 3 : 0.8}
      transparent
      opacity={opacity}
      dashed={link.type === 'PATTERN'}
      dashScale={5}
      dashSize={0.5}
      gapSize={0.2}
    />
  )
}

export default function NeuralMap({ thoughts, patterns }: { thoughts: Thought[]; patterns: Pattern[] }) {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)

  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, NodeData>()
    
    // 1. Sort thoughts by time to create the "Workflow Flow"
    const sortedThoughts = [...thoughts].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    // 2. Position thoughts in a branching workflow (Left to Right)
    const xSpacing = 6
    const ySpread = 10
    const zSpread = 8

    sortedThoughts.forEach((t, i) => {
      // Calculate hierarchical level based on time
      const level = Math.floor(i / 3) 
      const subIndex = i % 3

      // Position: X flows with time, Y/Z spread for branching
      const position = new THREE.Vector3(
        (level * xSpacing) - (sortedThoughts.length * xSpacing / 6), // Center the flow
        (subIndex - 1) * (ySpread / (level + 1)) + (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * zSpread
      )

      nodeMap.set(t.id!, {
        id: t.id!,
        label: t.processedContent || t.content,
        importance: t.importance,
        tags: t.tags,
        level,
        position
      })
    })

    const nodeArray = Array.from(nodeMap.values())
    const linkArray: LinkData[] = []

    // 3. Connect Primary Branches via Patterns
    patterns.forEach(p => {
        const ids = p.relatedThoughtIds.map(id => id.toString())
        for (let i = 0; i < ids.length; i++) {
            for (let j = i + 1; j < ids.length; j++) {
                const startNode = nodeMap.get(ids[i])
                const endNode = nodeMap.get(ids[j])
                if (startNode && endNode) {
                    linkArray.push({ start: startNode.position, end: endNode.position, type: 'PATTERN' })
                }
            }
        }
    })

    // 4. Connect Sequential Workflow (Temporal Links)
    for (let i = 0; i < sortedThoughts.length - 1; i++) {
        const start = nodeMap.get(sortedThoughts[i].id!)
        const end = nodeMap.get(sortedThoughts[i+1].id!)
        if (start && end && start.level !== end.level) {
            linkArray.push({ start: start.position, end: end.position, type: 'FLOW' })
        }
    }

    return { nodes: nodeArray, links: linkArray }
  }, [thoughts, patterns])

  return (
    <div className="w-full h-[400px] md:h-[700px] border border-black/5 rounded-[2rem] md:rounded-[3.5rem] bg-white/40 backdrop-blur-xl relative overflow-hidden group shadow-inner">
      
      {/* HUD Overlays */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10 pointer-events-none">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-black/60">Your Mind Map</span>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <p className="font-mono text-[8px] md:text-[9px] text-black/30 uppercase tracking-widest bg-black/5 px-2 py-1 rounded inline-block">
                Timeline View
            </p>
            <p className="font-mono text-[8px] md:text-[9px] text-black/30 uppercase tracking-widest bg-black/5 px-2 py-1 rounded inline-block">
                Connected Thoughts
            </p>
          </div>
      </div>

      {selectedNode && (
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:right-10 md:left-auto z-10 max-w-sm bg-white/90 backdrop-blur-2xl border border-black/10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center gap-2 mb-4 border-b border-black/5 pb-4">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">Thought Details</span>
              </div>
              <p className="font-display text-base md:text-lg leading-tight mb-6 text-black font-bold uppercase tracking-tighter">
                &quot;{selectedNode.label}&quot;
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                  {selectedNode.tags.map(t => (
                      <span key={t} className="text-[8px] md:text-[9px] px-2 py-0.5 md:px-3 md:py-1 bg-black/5 border border-black/5 rounded-full font-mono uppercase text-black/60 tracking-widest">#{t}</span>
                  ))}
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="w-full py-3 bg-black text-white font-mono text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-500 hover:text-black transition-all rounded-xl"
              >
                Close [X]
              </button>
          </div>
      )}

      <Canvas camera={{ position: [0, 0, 30], fov: 40 }}>
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[20, 20, 20]} intensity={2} color="#f59e0b" />
        <pointLight position={[-20, -20, -20]} intensity={1} />
        
        <Stars radius={50} depth={50} count={500} factor={2} saturation={0} fade speed={0.5} />
        
        {/* Spatial Grid */}
        <Grid 
            infiniteGrid 
            fadeDistance={60} 
            fadeStrength={5} 
            cellSize={2} 
            sectionSize={10} 
            sectionColor="#f59e0b" 
            sectionThickness={0.5} 
            cellColor="#000000" 
            cellThickness={0.2} 
            position={[0, -12, 0]}
        />

        <group>
            {nodes.map(node => (
                <Node 
                    key={node.id} 
                    data={node} 
                    onSelect={setSelectedNode} 
                    isSelected={selectedNode?.id === node.id} 
                />
            ))}
            {links.map((link, i) => (
                <ConnectionLine key={i} link={link} />
            ))}
        </group>

        <EffectComposer enableNormalPass>
            <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} height={300} intensity={1.2} />
            <Noise opacity={0.015} />
        </EffectComposer>

        <OrbitControls 
            enableDamping 
            dampingFactor={0.05} 
            minDistance={15} 
            maxDistance={60} 
            enablePan={false}
            rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
