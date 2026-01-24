'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import TransitionLink from './components/TransitionLink'
import TextScramble from './components/TextScramble'
import GlitchText from './components/GlitchText'
import NoiseOverlay from './components/NoiseOverlay'
import FeaturesGrid from './components/FeaturesGrid'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import MagneticButton from './components/MagneticButton'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import { ArrowRight, Globe, Layers, Activity } from 'lucide-react'
import AuthDecor from './components/AuthDecor'

// Dynamic import for 3D scene to avoid SSR issues
const MantisScene = dynamic(() => import('./components/MantisScene'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black -z-10" />
})

function Counter({ from, to, duration = 2 }: { from: number, to: number, duration?: number }) {
    const [count, setCount] = useState(from)
    
    useEffect(() => {
        let start = from
        const increment = (to - from) / (duration * 60)
        const handle = setInterval(() => {
            start += increment
            if (start >= to) {
                setCount(to)
                clearInterval(handle)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(handle)
    }, [from, to, duration])

    return <>{count.toLocaleString()}</>
}

export default function LandingPage() {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <main ref={containerRef} className="min-h-screen relative text-black selection:bg-amber-500/30 selection:text-black bg-white">
      
      <AuthDecor />
      <NoiseOverlay />
      
      {/* 3D Background - Fixed */}
      <MantisScene />

      {/* Grid Lines - Subtle Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] grid grid-cols-4 md:grid-cols-12 h-full w-full">
         <div className="border-r border-black h-full col-span-1 md:col-span-1"></div>
         <div className="border-r border-black h-full col-span-1 md:col-span-3"></div>
         <div className="border-r border-black h-full col-span-1 md:col-span-4"></div>
         <div className="border-r border-black h-full col-span-1 md:col-span-3"></div>
      </div>

      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-start text-black">
        <div className="flex flex-col gap-1">
            <h3 className="font-mono text-xs uppercase tracking-widest opacity-60">
               <GlitchText text="Architect" />
            </h3>
            <p className="font-display text-xl tracking-wide">Qambar</p>
        </div>
        
        <div className="flex flex-col items-end gap-1 text-right">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-xs uppercase tracking-widest opacity-60">System Online</span>
             </div>
             <p className="font-mono text-[10px] opacity-40">V 1.0.0</p>
        </div>
      </header>

      {/* HERO SECTION - Wrapped to handle overflow locally */}
      <div className="relative z-10 container mx-auto px-6 min-h-screen flex flex-col justify-center pb-0 overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
            
            {/* Typography Section with Parallax */}
            <motion.div style={{ y: y1, opacity }} className="col-span-1 md:col-span-6 flex flex-col justify-between h-[75vh] md:h-auto md:block md:space-y-12 relative z-20 pt-20 md:pt-0">
                <motion.div 
                   initial={{ opacity: 0, y: 100 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-[12vw] md:text-[8vw] font-display tracking-tighter uppercase leading-[0.8] text-black">
                        <span className="block overflow-hidden pl-3">
                             <GlitchText text="Praxis" trigger={true} />
                        </span>
                        <span className="block overflow-hidden pl-12 md:pl-27 ">
                             <GlitchText text="AI" trigger={true} />
                        </span>
                    </h1>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8 md:items-start pl-2">
                    <div className="md:w-px md:h-24 bg-black/20 hidden md:block" /> {/* Vertical Divider */}
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="space-y-8"
                    >
                        <p className="font-mono text-xs md:text-sm max-w-xs leading-relaxed opacity-70 uppercase tracking-wide text-black">
                            <TextScramble trigger={true}>
                                We don&apos;t just store memory; we optimize it. From passive archive to active cognitive navigation.
                            </TextScramble>
                        </p>

                        <MagneticButton className="inline-block">
                            <TransitionLink 
                            href="/dashboard"
                            className="group relative flex items-center gap-4 text-xl font-display uppercase tracking-wider text-white bg-black/90 backdrop-blur-md px-6 py-3 rounded-full border border-black/5 hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                            >
                                <span>Initialize</span>
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <ArrowRight className="w-4 h-4 text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                </div>
                            </TransitionLink>
                        </MagneticButton>
                    </motion.div>
                </div>
            </motion.div>
            
            {/* Overlay Stats - Pushed to far right */}
            <motion.div style={{ y: y2 }} className="hidden md:flex col-span-6 flex-col justify-end h-full min-h-[50vh] pb-12 items-end opacity-60 text-black pointer-events-none">
                 <div className="space-y-4 text-right">
                    <div className="flex items-center justify-end gap-4 border-b border-black/20 pb-2">
                        <span className="font-mono text-xs">GLOBAL NODES</span>
                        <Globe className="w-4 h-4 " />
                        <span className="font-display text-xl">
                            <Counter from={0} to={8402} />
                        </span>
                    </div>
                    <div className="flex items-center justify-end gap-4 border-b border-black/20 pb-2">
                        <span className="font-mono text-xs">NEURAL LINKS</span>
                        <Activity className="w-4 h-4 " />
                        <span className="font-display text-xl">
                            <Counter from={0} to={1240} /> K
                        </span>
                    </div>
                    <div className="flex items-center justify-end gap-4 border-b border-black/20 pb-2">
                        <span className="font-mono text-xs">MEMORY BLOCKS</span>
                        <Layers className="w-4 h-4 " />
                        <span className="font-display text-xl">
                            <Counter from={0} to={41} />.2 TB
                        </span>
                    </div>
                 </div>
            </motion.div>

        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-0 w-full px-6 flex justify-between items-end text-black pointer-events-none"
        >
            <div className="hidden md:block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">
                    Scroll to Explore
                </span>
            </div>
            <div className="text-right">
                <h4 className="font-mono text-[10px] uppercase opacity-40 mb-1">Mission</h4>
                <p className="font-display text-lg">Augment Intelligence</p>
            </div>
        </motion.div>
      </div>

      {/* FEATURE GRID SECTION */}
      <div className="relative z-20 bg-white">
         <FeaturesGrid />
      </div>

      {/* CONTACT & FOOTER */}
      <div className="relative z-20 bg-white">
         <ContactSection />
         <Footer />
      </div>

    </main>
  )
}