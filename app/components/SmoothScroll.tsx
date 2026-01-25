'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Check if on mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.1 : isMobile ? 0.6 : 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isMobile, // Disable smooth wheel on mobile for better feel
      wheelMultiplier: isMobile ? 0.8 : 1,
      touchMultiplier: isMobile ? 1.2 : 1.5,
      syncTouch: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
