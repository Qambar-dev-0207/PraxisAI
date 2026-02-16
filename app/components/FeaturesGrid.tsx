'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { Zap, Brain, ArrowRight, Network, Mic, Database, Binary, Activity } from 'lucide-react'

// Optimized Feature Data
interface Feature {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    light: boolean;
    visual: React.ReactNode;
}

function FeatureCard({ feature, isMobile }: { feature: Feature, isMobile: boolean }) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    
    // Tilt effect transforms - disabled on mobile
    const rotateX = useTransform(y, [-0.5, 0.5], isMobile ? ["0deg", "0deg"] : ["2deg", "-2deg"])
    const rotateY = useTransform(x, [-0.5, 0.5], isMobile ? ["0deg", "0deg"] : ["-2deg", "2deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return // Skip mouse events on mobile
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
                        {`// READY`}
                     </div>
                     <div className={`w-14 h-14 rounded-full border ${borderColor} flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 cursor-pointer`}>
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                     </div>
                </div>

            </div>
        </motion.div>
    )
}

const BinaryVisual = () => {
    const [bits, setBits] = useState<number[]>([])
    
    useEffect(() => {
        setBits(Array.from({ length: 64 }).map(() => Math.round(Math.random())))
    }, [])

    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-5 text-black">
             <div className="font-mono text-[10px] grid grid-cols-8 gap-2 leading-none">
                {bits.map((bit, i) => (
                    <span key={i}>{bit}</span>
                ))}
             </div>
        </div>
    )
}

const features: Feature[] = [
  {
    id: 1,
    title: "Smart Listening",
    subtitle: "CAPTURE ENGINE",
    description: "Whether you talk or type, the system instantly catches your raw thoughts. It records the context so you don't have to remember the details.",
    icon: <Mic className="w-6 h-6" />,
    light: true,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="text-[12rem] md:text-[16rem] font-display font-bold tracking-tighter text-black/5 select-none whitespace-nowrap uppercase">
                Voice
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent h-full w-full animate-scan" />
        </div>
    )
  },
  {
    id: 2,
    title: "Digital Vault",
    subtitle: "RAW MEMORY STORE",
    description: "Your ideas are kept in a secure, chronological archive. It's like having a search engine for your own brain that never forgets a single entry.",
    icon: <Database className="w-6 h-6" />,
    light: false,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="grid grid-cols-4 gap-4 opacity-20">
                {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                        className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_#fbbf24]" 
                    />
                ))}
             </div>
        </div>
    )
  },
  {
    id: 3,
    title: "Reading the Vibe",
    subtitle: "SEMANTIC ENCODER",
    description: "The system doesn't just look at words; it understands the core concept of your thoughts, turning messy notes into organized data.",
    icon: <Binary className="w-6 h-6" />,
    light: true,
    visual: <BinaryVisual />
  },
  {
    id: 4,
    title: "Habit Spotting",
    subtitle: "PATTERN ANALYZER",
    description: "PathOS looks for habits in how you think. It notices recurring themes, contradictions, or long-term motifs in your daily entries.",
    icon: <Network className="w-6 h-6" />,
    light: false,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <div className="w-64 h-64 border border-white/20 rounded-full flex items-center justify-center relative">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full border-t-2 border-amber-500 rounded-full"
                />
                <Network className="w-12 h-12 text-white/40" />
             </div>
        </div>
    )
  },
  {
    id: 5,
    title: "The Aha! Moment",
    subtitle: "INSIGHT GENERATOR",
    description: "It connects current problems to past solutions. It gives you the big-picture view of your life that's usually hidden in the noise.",
    icon: <Zap className="w-6 h-6" />,
    light: true,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-50/30 overflow-hidden">
             <div className="w-96 h-96 border border-amber-500/5 rounded-full flex items-center justify-center relative">
                 <div className="w-1/2 h-1/2 bg-gradient-to-tr from-transparent to-amber-500/10 absolute top-0 right-0 rounded-tr-full origin-bottom-left animate-spin" style={{ animationDuration: '4s' }} />
             </div>
             <div className="absolute text-xs font-mono tracking-widest opacity-30 mt-32 text-amber-900">
                 CONNECTING NODES...
             </div>
        </div>
    )
  },
  {
    id: 6,
    title: "Memory Trainer",
    subtitle: "COGNITIVE TRAINER",
    description: "Through quick briefings and smart quizzes, the system trains you on your own knowledge—turning past notes into active skills.",
    icon: <Brain className="w-6 h-6" />,
    light: false,
    visual: (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <div className="w-[120%] h-[120%] border-[0.5px] border-white/20 rounded-full animate-[spin_60s_linear_infinite]" />
             <div className="absolute w-[80%] h-[80%] border-[0.5px] border-white/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
             <div className="absolute w-[40%] h-[40%] border-[0.5px] border-white/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
        </div>
    )
  }
]

export default function FeaturesGrid() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
        const mobile = window.innerWidth < 768
        requestAnimationFrame(() => {
            setIsMobile(mobile)
        })
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({ 
    target: targetRef,
    offset: ["start start", "end end"]
  })
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"])

  return (
    <section ref={targetRef} className={`relative bg-white ${isMobile ? 'h-auto py-24' : 'h-[450vh]'}`}>
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
        {mounted && (
            <motion.div 
                style={{ x: isMobile ? 0 : x }} 
                className={`z-10 will-change-transform ${isMobile ? 'flex flex-col gap-8 px-6 mt-12' : 'flex gap-8 px-8 md:gap-16 md:px-32 items-center h-full'}`}
            >
            {features.map((feature) => (
                <div key={feature.id} className={isMobile ? 'w-full' : ''}>
                    <FeatureCard feature={feature} isMobile={isMobile} />
                </div>
            ))}
            {!isMobile && <div className="w-[10vw]"></div>}
            </motion.div>
        )}
        
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
