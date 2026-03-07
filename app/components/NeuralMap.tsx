'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { Thought, Pattern } from '../../lib/types'

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

function Node({ data, onSelect }: { data: NodeData; onSelect: (d: NodeData) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const color = data.importance === 'TODAY' ? '#f59e0b' : data.importance === 'WEEK' ? '#000000' : '#9ca3af'
  const scale = data.importance === 'TODAY' ? 1.2 : 0.8

  return (
    <group position={data.position}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere
          ref={meshRef}
          args={[0.3 * scale, 16, 16]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSelect(data)}
        >
          <meshPhysicalMaterial
            color={color}
            emissive={hovered ? color : '#000'}
            emissiveIntensity={hovered ? 2 : 0}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      </Float>
      {hovered && (
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.15}
          color="black"
          font="/fonts/mono.ttf"
          anchorX="center"
          anchorY="middle"
        >
          {data.label.substring(0, 20)}...
        </Text>
      )}
    </group>
  )
}

function ConnectionLine({ link }: { link: LinkData }) {
  const opacity = link.type === 'PATTERN' ? 0.4 : 0.1
  const color = link.type === 'PATTERN' ? '#f59e0b' : '#000000'

  return (
    <Line
      points={[link.start, link.end]}
      color={color}
      lineWidth={link.type === 'PATTERN' ? 1 : 0.5}
      transparent
      opacity={opacity}
    />
  )
}

export default function NeuralMap({ thoughts, patterns }: { thoughts: Thought[]; patterns: Pattern[] }) {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)

  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, NodeData>()
    
    // Generate Node Positions (Spherical distribution for now)
    thoughts.forEach((t, i) => {
      const phi = Math.acos(-1 + (2 * i) / thoughts.length)
      const theta = Math.sqrt(thoughts.length * Math.PI) * phi
      const r = 8 + Math.random() * 2

      nodeMap.set(t.id!, {
        id: t.id!,
        label: t.content,
        importance: t.importance,
        tags: t.tags,
        position: new THREE.Vector3(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi)
        )
      })
    })

    const nodeArray = Array.from(nodeMap.values())
    const linkArray: LinkData[] = []

    // Links from Patterns
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

    // Auto-links by Tags (Synaptic Affinity)
    for (let i = 0; i < nodeArray.length; i++) {
        for (let j = i + 1; j < nodeArray.length; j++) {
            const commonTags = nodeArray[i].tags.filter(tag => nodeArray[j].tags.includes(tag))
            if (commonTags.length > 0) {
                linkArray.push({ start: nodeArray[i].position, end: nodeArray[j].position, type: 'TAG' })
            }
        }
    }

    return { nodes: nodeArray, links: linkArray }
  }, [thoughts, patterns])

  return (
    <div className="w-full h-[600px] border border-black/5 rounded-[3rem] bg-white/50 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-8 left-8 z-10 space-y-2 pointer-events-none">
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">Neural Synapse Map // Interactive</span>
          </div>
          <p className="font-mono text-[9px] text-black/30 uppercase">Drag to rotate • Scroll to zoom</p>
      </div>

      {selectedNode && (
          <div className="absolute bottom-8 right-8 z-10 max-w-xs bg-black text-white p-6 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <span className="font-mono text-[8px] uppercase tracking-widest text-white/40 mb-2 block">Fragment Data</span>
              <p className="font-display text-sm leading-relaxed mb-4">&quot;{selectedNode.label}&quot;</p>
              <div className="flex flex-wrap gap-1">
                  {selectedNode.tags.map(t => (
                      <span key={t} className="text-[7px] px-2 py-0.5 border border-white/20 rounded-full font-mono uppercase">#{t}</span>
                  ))}
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="mt-4 font-mono text-[8px] uppercase tracking-widest text-amber-500 hover:text-white transition-colors"
              >
                Close Trace [X]
              </button>
          </div>
      )}

      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <group>
            {nodes.map(node => (
                <Node key={node.id} data={node} onSelect={setSelectedNode} />
            ))}
            {links.map((link, i) => (
                <ConnectionLine key={i} link={link} />
            ))}
        </group>

        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  )
}
