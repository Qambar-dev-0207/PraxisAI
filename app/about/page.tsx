'use client'

import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
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

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    }

    return (
        <main ref={containerRef} className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-hidden font-mono flex flex-col justify-center">
            <AuthDecor />
            <NoiseOverlay />

            {/* Fixed Background HUD elements */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]"></div>
            </div>

            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Link href="/" className="group flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] text-white/50 hover:text-white transition-all">
                        <div className="w-6 h-px bg-white/20 group-hover:w-10 group-hover:bg-white transition-all"></div>
                        <span>Protocol: Return</span>
                    </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] text-white/30 uppercase tracking-[0.4em]">
                    Subject: Qambar_Syed.sys
                </motion.div>
            </nav>

            <section className="relative z-10 container mx-auto px-6 py-12">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                >
                    {/* Visual Identity Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8">
                        <div className="relative group max-w-xs mx-auto lg:mx-0">
                            {/* Decorative Frame */}
                            <div className="absolute -inset-3 border border-white/5 pointer-events-none group-hover:border-white/20 transition-colors duration-700"></div>
                            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40"></div>
                            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40"></div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40"></div>
                            
                            {/* Image Container with Scanning Effect */}
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5 border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000">
                                <Image 
                                    src="/pfp.jpeg" 
                                    alt="Mohammed Qambar Syed" 
                                    fill
                                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                                    priority
                                />
                                {/* Scan Line */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1/2 w-full -translate-y-full animate-[scan_4s_linear_infinite] pointer-events-none"></div>
                                
                                {/* HUD Overlays */}
                                <div className="absolute top-3 right-3 flex flex-col items-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[7px] uppercase tracking-tighter">ID: 7267-8441</div>
                                    <div className="w-10 h-0.5 bg-white/20 overflow-hidden">
                                        <div className="h-full bg-white w-2/3 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto lg:mx-0">
                            <div className="p-3 border border-white/5 bg-white/[0.02]">
                                <div className="text-[7px] text-white/30 uppercase mb-1">Cognitive Layer</div>
                                <div className="text-[10px] uppercase tracking-wider">Neural Networks</div>
                            </div>
                            <div className="p-3 border border-white/5 bg-white/[0.02]">
                                <div className="text-[7px] text-white/30 uppercase mb-1">Core Engine</div>
                                <div className="text-[10px] uppercase tracking-wider">Computer Vision</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-center space-y-10">
                        <div className="space-y-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-3 text-white/40"
                            >
                                <Fingerprint className="w-3 h-3" />
                                <span className="text-[9px] uppercase tracking-[0.5em]">Identity Verification Success</span>
                            </motion.div>
                            
                            <h1 className="text-5xl md:text-7xl font-display tracking-tight uppercase leading-[0.85]">
                                <GlitchText text="Qambar" />
                                <span className="block text-white/20"><GlitchText text="Syed" /></span>
                            </h1>
                        </div>

                        <div className="space-y-6 max-w-lg">
                            <div className="relative pl-6 border-l border-white/10">
                                <p className="text-base md:text-lg leading-relaxed text-white/80 font-light">
                                    <TextScramble>
                                        Architecting the intersection of Machine Learning and XR. Building autonomous systems that navigate human experience.
                                    </TextScramble>
                                </p>
                            </div>

                            <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-wider">
                                Focused on high-fidelity AI applications, from computer vision to agentic automation. Silicon intelligence as a seamless extension of biological potential.
                            </p>
                        </div>

                        {/* Social Terminal */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-white/20">
                                <Share2 className="w-2.5 h-2.5" />
                                <span className="text-[7px] uppercase tracking-[0.4em]">External Links Archive</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>
                            
                            <div className="flex flex-wrap gap-6">
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
                                            className="group flex flex-col items-center gap-1.5"
                                        >
                                            <social.icon className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                                            <span className="text-[7px] uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-colors">
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

            {/* Fixed Footer Info */}
            <div className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-end pointer-events-none z-50">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-2.5 h-2.5 text-white/20" />
                        <span className="text-[7px] text-white/20 uppercase">System_State: Stable</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <Cpu className="w-3 h-3 text-white/20" />
                    <span className="text-[7px] text-white/20 uppercase tracking-[0.3em]">Mantis_Protocol_v1.0.0</span>
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
