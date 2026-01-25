'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GlitchText from './GlitchText'

interface PageLoaderProps {
  isLoading: boolean
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
  const [displayText, setDisplayText] = useState('INITIALIZING')
  const [dotCount, setDotCount] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
  }, [])

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4)
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) {
    return null
  }

  const dots = '.'.repeat(dotCount)
  const animationDuration = prefersReducedMotion ? 0 : 0.8

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: animationDuration, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
    >
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="grid grid-cols-12 h-full w-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="border-r border-black h-full"
                animate={{
                  opacity: [0.02, 0.1, 0.02],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {!prefersReducedMotion && (
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-black/20"
          animate={{
            rotate: 360,
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="w-full h-full border border-black/10"
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}

      {!prefersReducedMotion && (
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 border border-black/20"
          animate={{
            rotate: -360,
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="w-full h-full border border-black/10"
            animate={{ scale: [1.2, 0.8, 1.2] }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}

      <div className="relative z-10 text-center space-y-8">
        {!prefersReducedMotion && (
          <motion.div
            className="mx-auto w-16 h-16 mb-8 relative"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="32" cy="32" r="30" />
              <circle cx="32" cy="32" r="20" />
              <circle cx="32" cy="32" r="10" />
              <motion.circle
                cx="32"
                cy="32"
                r="24"
                strokeWidth="0.5"
                opacity="0.3"
                animate={{
                  r: [24, 32, 24],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </svg>
          </motion.div>
        )}

        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-display tracking-tight text-black">
            <GlitchText text="PRAXIS" trigger={isLoading && !prefersReducedMotion} />
          </h2>
          <p className="font-mono text-sm md:text-base text-black/60 tracking-widest uppercase">
            {displayText}
            <span className="inline-block w-2">{dots}</span>
          </p>
        </div>

        {!prefersReducedMotion && (
          <motion.div className="w-64 h-0.5 bg-black/10 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-black"
              animate={{
                x: [-256, 256],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}

        {!prefersReducedMotion && (
          <motion.p className="font-mono text-xs text-black/40 tracking-wider">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              NEURAL PATHWAYS ENGAGING
            </motion.span>
          </motion.p>
        )}
      </div>

      {!prefersReducedMotion && [...Array(5)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-black/20 rounded-full"
          animate={{
            x: [0, 100 * Math.cos((i / 5) * Math.PI * 2), 0],
            y: [0, 100 * Math.sin((i / 5) * Math.PI * 2), 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-2px',
            marginTop: '-2px',
          }}
        />
      ))}

      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage:
                'linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, 0.05) 25%, rgba(0, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.05) 76%, transparent 77%, transparent)',
              backgroundSize: '100% 4px',
            }}
            animate={{
              y: [0, 4],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
            }}
          />
        </div>
      )}
    </motion.div>
  )
}

