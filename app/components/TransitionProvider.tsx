'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const TransitionContext = createContext<{
  startTransition: (href: string) => Promise<void>
}>({ startTransition: async () => {} })

export const useTransition = () => useContext(TransitionContext)

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayText, setDisplayText] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile on mount
  useEffect(() => {
    const isMobileDevice = window.matchMedia('(max-width: 768px)').matches
    setIsMobile(isMobileDevice)
  }, [])

  // Reset state when path changes (navigation complete)
  useEffect(() => {
    setIsTransitioning(false)
  }, [pathname])

  const startTransition = async (href: string) => {
    if (href === pathname) return
    
    setDisplayText("INITIALIZING...")
    setIsTransitioning(true)
    
    // Shorter transition on mobile for snappier UX
    const transitionDelay = isMobile ? 400 : 800
    await new Promise(resolve => setTimeout(resolve, transitionDelay)) 
    
    router.push(href)
  }

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {/* The Content */}
      {children}

      {/* The Curtain */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="cover"
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: isMobile ? 0.4 : 0.8, ease: [0.76, 0, 0.24, 1] }}
            style={{ originY: 1 }} // Grow from bottom
          >
             <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isMobile ? 0.1 : 0.4 }}
                className="text-white font-mono text-xs uppercase tracking-[0.5em]"
             >
                {displayText}
             </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Route Change Reveal (Separate from manual trigger) */}
       <RouteReveal isMobile={isMobile} />

    </TransitionContext.Provider>
  )
}

function RouteReveal({ isMobile }: { isMobile: boolean }) {
    return (
        <motion.div
            className="fixed inset-0 z-[9998] bg-black pointer-events-none"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: isMobile ? 0.4 : 0.8, ease: [0.76, 0, 0.24, 1], delay: isMobile ? 0.1 : 0.2 }}
            style={{ originY: 0 }} // Shrink to top
        />
    )
}
