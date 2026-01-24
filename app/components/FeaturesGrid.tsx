'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { Zap, Shield, Brain, Repeat, ArrowRight, Terminal, Lock, Activity, Compass, Network } from 'lucide-react'

// Optimized Feature Data
const features = [
  {
    id: 1,
    title: "Frictionless Ingestion",
    subtitle: "SYSTEM 01",
    description: "Capture raw chaos instantly. 400ms latency. Voice, text, or neural link. We structure the noise so you don't have to.",
    icon: <Zap className="w-6 h-6" />,
    light: true,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="text-[12rem] md:text-[16rem] font-display font-bold tracking-tighter text-black/5 select-none whitespace-nowrap">
                0.04s
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent h-full w-full animate-scan" />
        </div>
    )
  },
  {
    id: 2,
    title: "Neural Synthesis",
    subtitle: "SYSTEM 02",
    description: "AI runs in the background, weaving connections between isolated thoughts. It tells you how your past ideas fuel your current problems.",
    icon: <Network className="w-6 h-6" />,
    light: false,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="grid grid-cols-4 gap-4 opacity-30">
                {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                        className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" 
                    />
                ))}
             </div>
             {/* Connecting Lines (Simulated) */}
             <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <path d="M100 100 L 200 200" stroke="white" strokeWidth="1" />
                <path d="M200 200 L 300 100" stroke="white" strokeWidth="1" />
             </svg>
        </div>
    )
  },
  {
    id: 3,
    title: "Active Recall",
    subtitle: "SYSTEM 03",
    description: "Don't just store; train. The system quizzes you on your own knowledge, turning passive archives into active reflexes.",
    icon: <Brain className="w-6 h-6" />,
    light: false,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <div className="w-[120%] h-[120%] border-[0.5px] border-white/20 rounded-full animate-[spin_60s_linear_infinite]" />
             <div className="absolute w-[80%] h-[80%] border-[0.5px] border-white/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
             <div className="absolute w-[40%] h-[40%] border-[0.5px] border-white/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
        </div>
    )
  },
  {
    id: 4,
    title: "The Navigator",
    subtitle: "SYSTEM 04",
    description: "Agency at scale. The system flags cognitive loops and suggests the next most high-leverage thought path. It doesn't just mirror; it guides.",
    icon: <Compass className="w-6 h-6" />,
    light: true,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 overflow-hidden">
             {/* Radar / Compass Animation */}
             <div className="w-96 h-96 border border-black/5 rounded-full flex items-center justify-center relative">
                 <div className="w-full h-[1px] bg-black/5 absolute" />
                 <div className="h-full w-[1px] bg-black/5 absolute" />
                 <div className="w-1/2 h-1/2 bg-gradient-to-tr from-transparent to-black/5 absolute top-0 right-0 rounded-tr-full origin-bottom-left animate-spin" style={{ animationDuration: '4s' }} />
             </div>
             <div className="absolute text-xs font-mono tracking-widest opacity-30 mt-32">
                 CALCULATING TRAJECTORY...
             </div>
        </div>
    )
  }
]

function FeatureCard({ feature }: { feature: any }) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    
    // Tilt effect transforms
    const rotateX = useTransform(y, [-0.5, 0.5], ["2deg", "-2deg"])
    const rotateY = useTransform(x, [-0.5, 0.5], ["-2deg", "2deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const borderColor = feature.light ? 'border-black/10' : 'border-white/10'
    const textColor = feature.light ? 'text-black' : 'text-white'
    const subTextColor = feature.light ? 'text-black/60' : 'text-white/60'
    const bgColor = feature.light ? 'bg-[#F2F2F2]' : 'bg-[#0A0A0A]'

    return (
        <motion.div 
            style={{ 
                rotateX, 
                rotateY, 
                transformStyle: "preserve-3d" 
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`group relative h-[65vh] w-[85vw] md:w-[35vw] shrink-0 rounded-[2rem] border ${borderColor} ${bgColor} flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-2xl z-10`}
        >
            {/* Visual Background Layer */}
            <div className="absolute inset-0 pointer-events-none" style={{ transform: "translateZ(10px)" }}>
                {feature.visual}
            </div>

            {/* Corner Accents */}
            <div className={`absolute top-6 left-6 w-3 h-3 border-t border-l ${borderColor} opacity-50`} />
            <div className={`absolute top-6 right-6 w-3 h-3 border-t border-r ${borderColor} opacity-50`} />
            <div className={`absolute bottom-6 left-6 w-3 h-3 border-b border-l ${borderColor} opacity-50`} />
            <div className={`absolute bottom-6 right-6 w-3 h-3 border-b border-r ${borderColor} opacity-50`} />

            {/* Content Container */}
            <div className="relative z-20 flex flex-col justify-between h-full p-8 md:p-12" style={{ transform: "translateZ(30px)" }}>
                
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className={`flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase ${subTextColor}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        <span>{feature.subtitle}</span>
                    </div>
                    <div className={`p-3 rounded-2xl border ${borderColor} backdrop-blur-md bg-white/5`}>
                        {feature.icon}
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-6">
                    <h3 className={`text-4xl md:text-5xl font-display uppercase tracking-tighter leading-[0.9] ${textColor}`}>
                        {feature.title.split(' ').map((word: string, i: number) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h3>
                    
                    <div className="w-12 h-[1px] bg-current opacity-20" />
                    
                    <p className={`font-mono text-sm leading-relaxed max-w-xs ${subTextColor}`}>
                        {feature.description}
                    </p>
                </div>

                {/* Action Area */}
                <div className="flex justify-between items-end">
                     <div className={`font-mono text-[10px] ${subTextColor} opacity-50`}>
                        // READY
                     </div>
                     <div className={`w-14 h-14 rounded-full border ${borderColor} flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 cursor-pointer`}>
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                     </div>
                </div>

            </div>
        </motion.div>
    )
}

export default function FeaturesGrid() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({ 
    target: targetRef,
    offset: ["start start", "end end"]
  })
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"])

  return (
    <section ref={targetRef} className={`relative bg-white ${isMobile ? 'h-auto py-24' : 'h-[300vh]'}`}>
      <div className={`${isMobile ? 'relative h-auto' : 'sticky top-0 flex h-screen items-center overflow-hidden'}`}>
        
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-12 gap-4 pointer-events-none opacity-[0.03] px-12">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-full border-r border-black/50"></div>
            ))}
        </div>

        {/* Section Title Background */}
        <div className={`absolute left-12 z-0 ${isMobile ? 'top-0' : 'top-12'}`}>
             <h2 className="text-[12vw] font-display text-black opacity-[0.02] uppercase tracking-tighter leading-none whitespace-nowrap">
                System Capabilities
             </h2>
        </div>

        {/* Scrolling Container */}
        <motion.div 
            style={{ x: isMobile ? 0 : x }} 
            className={`z-10 will-change-transform ${isMobile ? 'flex flex-col gap-8 px-6 mt-12' : 'flex gap-8 px-8 md:gap-16 md:px-32 items-center h-full'}`}
        >
          {features.map((feature) => (
            <div key={feature.id} className={isMobile ? 'w-full' : ''}>
                 <FeatureCard feature={feature} />
            </div>
          ))}
          {!isMobile && <div className="w-[10vw]"></div>}
        </motion.div>
        
        {/* Progress Bar - Desktop Only */}
        {!isMobile && (
            <div className="absolute bottom-12 left-12 right-12 h-[1px] bg-black/5 overflow-hidden">
                <motion.div 
                    style={{ scaleX: scrollYProgress }}
                    className="h-full bg-black origin-left"
                />
            </div>
        )}

      </div>
    </section>
  )
}
