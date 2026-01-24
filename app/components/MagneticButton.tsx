'use client'

import { useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function MagneticButton({ children, className }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const xSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
    const ySpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        const posX = e.clientX - (left + width / 2)
        const posY = e.clientY - (top + height / 2)
        x.set(posX * 0.3)
        y.set(posY * 0.3)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
