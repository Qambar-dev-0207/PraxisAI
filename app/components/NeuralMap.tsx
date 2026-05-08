'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float, Line, Sphere, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Thought, Pattern } from '../../lib/types'
import { GitCommit } from 'lucide-react'

interface NodeData {
  id: string
  label: string
  position: THREE.Vector3
  importance: string
  tags: string[]
}

interface LinkData {
  start: THREE.Vector3
  end: THREE.Vector3
  type: string
}

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function Node({ data, onSelect, isSelected }: { data: NodeData; onSelect: (d: NodeData) => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const color = data.importance === 'TODAY' ? '#f59e0b' : data.importance === 'WEEK' ? '#000000' : '#9ca3af'
  const baseScale = data.importance === 'TODAY' ? 1.4 : 1.0

  useFrame(() => {
    if (!meshRef.current) return
    const target = hovered || isSelected ? 1.3 : 1.0
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1)
  })

  return (
    <group position={data.position}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
        <Sphere
          ref={meshRef}
          args={[0.38 * baseScale, 32, 32]}
          onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
          onClick={() => onSelect(data)}
        >
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || isSelected ? 6 : 0.8}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </Sphere>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.48 * baseScale, 0.53 * baseScale, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </Float>
      <Text
        position={[0, 1.1, 0]}
        fontSize={0.2}
        color={hovered || isSelected ? "#000000" : "rgba(0,0,0,0.35)"}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {data.label.length > 28 ? data.label.substring(0, 28) + '…' : data.label}
      </Text>
    </group>
  )
}

function ConnectionLine({ link }: { link: LinkData }) {
  const lineRef = useRef<any>(null)

  useFrame((state) => {
    if (!lineRef.current || link.type !== 'PATTERN') return
    const t = state.clock.getElapsedTime()
    lineRef.current.material.dashOffset = -t * 1.5
    lineRef.current.material.opacity = 0.35 + Math.sin(t * 2) * 0.25
  })

  const points = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(link.start, link.end).multiplyScalar(0.5)
    mid.y += (link.end.x - link.start.x) * 0.15
    return new THREE.QuadraticBezierCurve3(link.start, mid, link.end).getPoints(20)
  }, [link.start, link.end])

  return (
    <Line
      ref={lineRef}
      points={points}
      color={link.type === 'PATTERN' ? '#f59e0b' : '#000000'}
      lineWidth={link.type === 'PATTERN' ? 2.5 : 0.6}
      transparent
      opacity={link.type === 'PATTERN' ? 0.7 : 0.12}
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
    if (!thoughts.length) return { nodes: [], links: [] }

    const nodeMap = new Map<string, NodeData>()
    const sorted = [...thoughts].sort((a, b) =>
      new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime()
    )

    const xSpacing = 6
    const ySpread = 8
    const zSpread = 6

    sorted.forEach((t, i) => {
      const level = Math.floor(i / 3)
      const subIndex = i % 3
      const seed = i * 137.508

      const position = new THREE.Vector3(
        (level * xSpacing) - (sorted.length * xSpacing / 6),
        (subIndex - 1) * (ySpread / Math.max(level + 1, 1)) + (seededRandom(seed) - 0.5) * 2,
        (seededRandom(seed + 7) - 0.5) * zSpread
      )

      nodeMap.set(t.id!, {
        id: t.id!,
        label: t.processedContent || t.content,
        importance: t.importance,
        tags: t.tags,
        position,
      })
    })

    const nodeArray = Array.from(nodeMap.values())
    const linkArray: LinkData[] = []

    patterns.forEach(p => {
      const ids = (p.relatedThoughtIds as any[]).map((id: any) => id.toString())
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const s = nodeMap.get(ids[i])
          const e = nodeMap.get(ids[j])
          if (s && e) linkArray.push({ start: s.position, end: e.position, type: 'PATTERN' })
        }
      }
    })

    for (let i = 0; i < sorted.length - 1; i++) {
      const s = nodeMap.get(sorted[i].id!)
      const e = nodeMap.get(sorted[i + 1].id!)
      if (s && e) {
        const sLevel = Math.floor(i / 3)
        const eLevel = Math.floor((i + 1) / 3)
        if (sLevel !== eLevel) linkArray.push({ start: s.position, end: e.position, type: 'FLOW' })
      }
    }

    return { nodes: nodeArray, links: linkArray }
  }, [thoughts, patterns])

  const isEmpty = nodes.length === 0

  return (
    <div className="w-full h-[350px] md:h-[600px] border border-black/5 rounded-[2rem] md:rounded-[3rem] bg-white/40 backdrop-blur-xl relative overflow-hidden shadow-inner">

      {/* HUD */}
      <div className="absolute top-5 left-5 md:top-8 md:left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-black/50">Mind Map</span>
        </div>
        <div className="flex gap-2">
          <span className="font-mono text-[8px] text-black/30 uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded">
            {nodes.length} nodes
          </span>
          <span className="font-mono text-[8px] text-black/30 uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded">
            {links.filter(l => l.type === 'PATTERN').length} patterns
          </span>
        </div>
      </div>

      {/* Selected node info panel */}
      {selectedNode && (
        <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:right-8 md:left-auto z-10 max-w-xs bg-white/90 backdrop-blur-2xl border border-black/10 p-5 md:p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2 mb-3 border-b border-black/5 pb-3">
            <div className={`w-2 h-2 rounded-full ${selectedNode.importance === 'TODAY' ? 'bg-amber-500' : 'bg-black'}`} />
            <span className="font-mono text-[9px] uppercase tracking-widest text-black/40 font-bold">{selectedNode.importance}</span>
          </div>
          <p className="font-display text-sm md:text-base leading-tight mb-4 text-black font-bold uppercase tracking-tighter">
            &ldquo;{selectedNode.label}&rdquo;
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {selectedNode.tags.map(t => (
              <span key={t} className="text-[8px] px-2 py-0.5 bg-black/5 rounded-full font-mono uppercase text-black/50 tracking-widest">#{t}</span>
            ))}
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="w-full py-2 bg-black text-white font-mono text-[9px] uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all rounded-lg"
          >
            Close [Esc]
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-black/20">
          <GitCommit className="w-12 h-12 opacity-20" />
          <p className="font-mono text-[10px] uppercase tracking-[0.4em]">No thoughts yet — start capturing above</p>
        </div>
      ) : (
        <Canvas camera={{ position: [0, 0, 28], fov: 45 }}>
          <color attach="background" args={['#fafafa']} />
          <ambientLight intensity={0.9} />
          <pointLight position={[20, 20, 20]} intensity={1.5} color="#f59e0b" />
          <pointLight position={[-20, -20, -20]} intensity={0.8} />
          <Stars radius={50} depth={50} count={400} factor={2} saturation={0} fade speed={0.3} />

          <group>
            {nodes.map(node => (
              <Node key={node.id} data={node} onSelect={setSelectedNode} isSelected={selectedNode?.id === node.id} />
            ))}
            {links.map((link, i) => (
              <ConnectionLine key={i} link={link} />
            ))}
          </group>

          <EffectComposer enableNormalPass>
            <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} height={300} intensity={0.8} />
          </EffectComposer>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={12}
            maxDistance={55}
            enablePan={false}
            rotateSpeed={0.4}
          />
        </Canvas>
      )}
    </div>
  )
}
