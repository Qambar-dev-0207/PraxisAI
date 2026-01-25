'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const lastUpdateRef = useRef(0)

  useEffect(() => {
    // Disable cursor on mobile/touch devices
    const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice()) {
      setIsMobile(true)
      return
    }

    const updateMousePosition = (e: MouseEvent) => {
      const now = Date.now()
      // Throttle to ~60fps for better performance
      if (now - lastUpdateRef.current > 16) {
        setMousePosition({ x: e.clientX, y: e.clientY })
        lastUpdateRef.current = now
        
        const target = e.target as HTMLElement
        const isClickable = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')
        setIsHovering(!!isClickable)
      }
    }

    window.addEventListener('mousemove', updateMousePosition, { passive: true })
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  if (isMobile) return null

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 900, damping: 30 }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 0.5,
          opacity: isHovering ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </>
  )
}

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1, // Hide dot when hovering
        }}
        transition={{ type: "spring", stiffness: 900, damping: 30 }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 0.5,
          opacity: isHovering ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </>
  )
}