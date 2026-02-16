'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  targetY: number;
}

export default function AuthDecor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    
    // Generate particles on client side only - use rAF to avoid synchronous state update warning
    requestAnimationFrame(() => {
        const newParticles = [...Array(20)].map((_, i) => ({
            id: i,
            initialX: Math.random() * window.innerWidth,
            initialY: Math.random() * window.innerHeight,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
            targetY: Math.random() * -100
        }))
        setParticles(newParticles)
    })

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-white -z-10">
      {/* 1. Base Grid - Moving */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ 
             backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg) translateY(0)',
             transformOrigin: 'top center',
             animation: 'gridMove 20s linear infinite' 
           }} 
      />

      {/* 2. Spotlight Follower - Subtle Gray */}
      <motion.div
        className="absolute w-[800px] h-[800px] bg-gradient-to-r from-black/5 to-transparent rounded-full blur-[100px] pointer-events-none"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: 'spring', damping: 50, stiffness: 50 }}
      />

      {/* 3. Floating Data Particles - Dark */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-black/20 rounded-full"
          initial={{ 
            x: p.initialX, 
            y: p.initialY,
            opacity: 0 
          }}
          animate={{ 
            y: [null, p.targetY],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: p.delay 
          }}
        />
      ))}

      {/* 4. Vignette - Light */}
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, #ffffff 90%)" />
    </div>
  )
}
