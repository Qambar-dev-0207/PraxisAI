'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { ArrowLeft, Mail, Github, Linkedin, Globe, Twitter, Terminal, Cpu, Fingerprint, Share2 } from 'lucide-react'
import AuthDecor from '../components/AuthDecor'
import NoiseOverlay from '../components/NoiseOverlay'
import TextScramble from '../components/TextScramble'
import GlitchText from '../components/GlitchText'
import MagneticButton from '../components/MagneticButton'

export default function AboutPage() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    }

    return (
        <main ref={containerRef} className="min-h-[150vh] bg-black text-white selection:bg-white selection:text-black relative overflow-hidden font-mono">
            <AuthDecor />
            <NoiseOverlay />

            {/* Fixed Background HUD elements */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]"></div>
            </div>

            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Link href="/" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/50 hover:text-white transition-all">
                        <div className="w-8 h-px bg-white/20 group-hover:w-12 group-hover:bg-white transition-all"></div>
                        <span>Protocol: Return</span>
                    </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] text-white/30 uppercase tracking-[0.4em]">
                    Subject: Qambar_Syed.sys
                </motion.div>
            </nav>

            <section className="relative z-10 container mx-auto px-6 pt-40 pb-20">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-20"
                >
                    {/* Visual Identity Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-5 space-y-12">
                        <div className="relative group">
                            {/* Decorative Frame */}
                            <div className="absolute -inset-4 border border-white/5 pointer-events-none group-hover:border-white/20 transition-colors duration-700"></div>
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/40"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/40"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/40"></div>
                            
                            {/* Image Container with Scanning Effect */}
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5 border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000">
                                <Image 
                                    src="/pfp.jpeg" 
                                    alt="Mohammed Qambar Syed" 
                                    fill
                                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                                    priority
                                />
                                {/* Scan Line */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1/2 w-full -translate-y-full animate-[scan_4s_linear_infinite] pointer-events-none"></div>
                                
                                {/* HUD Overlays */}
                                <div className="absolute top-4 right-4 flex flex-col items-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[8px] uppercase tracking-tighter">ID: 7267-8441</div>
                                    <div className="w-12 h-1 bg-white/20 overflow-hidden">
                                        <div className="h-full bg-white w-2/3 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-white/5 bg-white/[0.02]">
                                <div className="text-[8px] text-white/30 uppercase mb-2">Cognitive Layer</div>
                                <div className="text-xs uppercase tracking-wider">Neural Networks</div>
                            </div>
                            <div className="p-4 border border-white/5 bg-white/[0.02]">
                                <div className="text-[8px] text-white/30 uppercase mb-2">Core Engine</div>
                                <div className="text-xs uppercase tracking-wider">Computer Vision</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-center space-y-16">
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-3 text-white/40"
                            >
                                <Fingerprint className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-[0.5em]">Identity Verification Success</span>
                            </motion.div>
                            
                            <h1 className="text-6xl md:text-8xl font-display tracking-tight uppercase leading-[0.85]">
                                <GlitchText text="Qambar" />
                                <span className="block text-white/20"><GlitchText text="Syed" /></span>
                            </h1>
                        </div>

                        <div className="space-y-8 max-w-xl">
                            <div className="relative pl-8 border-l border-white/10">
                                <p className="text-lg md:text-xl leading-relaxed text-white/80 font-light">
                                    <TextScramble>
                                        Architecting the intersection of Machine Learning and XR. Building autonomous systems that don't just process data, but navigate human experience.
                                    </TextScramble>
                                </p>
                            </div>

                            <p className="text-sm text-white/50 leading-loose">
                                Focused on high-fidelity AI applications, from computer vision modules to agentic career automation. My work is driven by the belief that silicon intelligence should serve as a seamless extension of biological potential.
                            </p>
                        </div>

                        {/* Social Terminal */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-white/20">
                                <Share2 className="w-3 h-3" />
                                <span className="text-[8px] uppercase tracking-[0.4em]">External Links Archive</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>
                            
                            <div className="flex flex-wrap gap-8">
                                {[
                                    { icon: Twitter, label: 'X_Profile', href: 'https://x.com/__Qambar__' },
                                    { icon: Github, label: 'Source_Code', href: 'https://github.com/Qambar-dev-0207' },
                                    { icon: Linkedin, label: 'Neural_Link', href: 'https://linkedin.com/in/mohammed-qambar-0466132b9' },
                                    { icon: Mail, label: 'Direct_Comms', href: 'mailto:work.qambar@gmail.com' }
                                ].map((social, i) => (
                                    <MagneticButton key={i}>
                                        <a 
                                            href={social.href} 
                                            target="_blank" 
                                            className="group flex flex-col items-center gap-2"
                                        >
                                            <social.icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                                            <span className="text-[8px] uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-colors">
                                                {social.label}
                                            </span>
                                        </a>
                                    </MagneticButton>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Scrolling Footer Info */}
            <div className="fixed bottom-0 left-0 w-full p-8 flex justify-between items-end pointer-events-none z-50">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-white/20" />
                        <span className="text-[8px] text-white/20 uppercase">System_State: Stable</span>
                    </div>
                    <div className="w-32 h-0.5 bg-white/5">
                        <motion.div 
                            style={{ scaleX: scrollYProgress }} 
                            className="h-full bg-white/40 origin-left"
                        />
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <Cpu className="w-4 h-4 text-white/20" />
                    <span className="text-[8px] text-white/20 uppercase tracking-[0.3em]">Mantis_Protocol_v1.0.0</span>
                </div>
            </div>

            {/* Custom Keyframes for Scanning Effect */}
            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
            `}</style>
        </main>
    )
}
