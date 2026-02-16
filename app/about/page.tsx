'use client'

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { 
    Mail, Github, Linkedin, Twitter, Terminal, Cpu, Fingerprint, 
    Share2, Activity, Shield, Zap, Database, Network, 
    Code, Brackets, Binary, Radio, Workflow
} from 'lucide-react'
import AuthDecor from '../components/AuthDecor'
import NoiseOverlay from '../components/NoiseOverlay'
import TextScramble from '../components/TextScramble'
import GlitchText from '../components/GlitchText'
import MagneticButton from '../components/MagneticButton'

const SKILLS = [
    { name: 'Neural Networks', level: 94, status: 'STABLE' },
    { name: 'Computer Vision', level: 88, status: 'OPTIMIZED' },
    { name: 'XR Development', level: 82, status: 'SYNCING' },
    { name: 'Agentic AI', level: 91, status: 'ACTIVE' },
    { name: 'Full-Stack Eng', level: 85, status: 'STABLE' }
]

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const [activeSection, setActiveSection] = useState(0)
    
    // Header parallax
    const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
    const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

    return (
        <main ref={containerRef} className="min-h-[200vh] bg-[#020202] text-white selection:bg-amber-500/30 selection:text-white relative font-mono cursor-default">
            <AuthDecor />
            <NoiseOverlay />

            {/* PathOS High-Fidelity Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.03),transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#fbbf2403_1px,transparent_1px),linear-gradient(to_bottom,#fbbf2403_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* Persistent Sidebar UI */}
            <div className="fixed left-0 top-0 h-full w-16 border-r border-white/5 flex flex-col items-center py-12 gap-12 z-50 bg-black/20 backdrop-blur-xl">
                 <div className="w-8 h-8 rounded-full border border-amber-500/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                 </div>
                 <div className="flex-1 flex flex-col gap-8 justify-center">
                    {['DOSSIER', 'METRICS', 'NODES'].map((label, i) => (
                        <button 
                            key={i} 
                            onClick={() => window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' })}
                            className="text-[10px] uppercase tracking-[0.5em] -rotate-90 origin-center whitespace-nowrap text-white/20 hover:text-amber-500 transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                 </div>
                 <div className="text-[10px] uppercase tracking-widest text-white/10 -rotate-90 mb-8">
                    SYS_v2.1
                 </div>
            </div>

            {/* Section 01: The Identity (Hero) */}
            <section className="relative min-h-screen z-10 pl-16 flex items-center">
                <div className="container mx-auto px-12 py-24">
                    <motion.div 
                        style={{ y: headerY, opacity: headerOpacity }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center"
                    >
                        {/* Profile Visual */}
                        <div className="lg:col-span-5 relative group">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className="relative aspect-[4/5] w-full max-w-md mx-auto"
                            >
                                {/* Multi-layered Border */}
                                <div className="absolute -inset-8 border border-amber-500/5 pointer-events-none" />
                                <div className="absolute -inset-4 border border-amber-500/10 pointer-events-none" />
                                
                                <div className="relative h-full w-full overflow-hidden border border-amber-500/20 bg-amber-950/10 group-hover:border-amber-500/60 transition-colors duration-700">
                                    <Image 
                                        src="/pfp.jpeg" 
                                        alt="Qambar Syed" 
                                        fill
                                        sizes="(max-width: 768px) 100vw, 500px"
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.02] group-hover:scale-100"
                                        priority
                                    />
                                    {/* HUD Elements */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-[1px] bg-amber-500" />
                                            <span className="text-[8px] text-amber-500 uppercase tracking-widest">Operator Dossier</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-white/40">7267-8441-PROD</div>
                                    </div>
                                    
                                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                        <div className="space-y-1">
                                            <div className="text-[7px] text-white/30 uppercase tracking-[0.3em]">Neural_Status</div>
                                            <div className="text-[9px] text-amber-500 uppercase font-bold tracking-widest">Optimized // stable</div>
                                        </div>
                                        <Fingerprint className="w-5 h-5 text-amber-500/40" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Title Section */}
                        <div className="lg:col-span-7 space-y-12">
                            <div className="space-y-4">
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4 text-amber-500/40"
                                >
                                    <Binary className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-[0.6em] font-bold">Initializing Handshake...</span>
                                </motion.div>
                                
                                <h1 className="text-7xl md:text-9xl font-display uppercase tracking-tighter leading-[0.8]">
                                    <span className="block text-white">
                                        <GlitchText text="Qambar" />
                                    </span>
                                    <span className="block text-transparent stroke-text opacity-40">
                                        <GlitchText text="Syed" />
                                    </span>
                                </h1>
                            </div>

                            <div className="space-y-8 max-w-xl">
                                <div className="p-8 border-l-2 border-amber-500/40 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px]" />
                                    <p className="text-xl md:text-2xl leading-relaxed text-white/90 font-light">
                                        <TextScramble>
                                            Redefining human capability through autonomous silicon agents. 
                                            Building at the intersection of Computer Vision, LLMs, and Spatial Computing.
                                        </TextScramble>
                                    </p>
                                </div>
                                <div className="flex gap-12">
                                    <div className="space-y-2">
                                        <div className="text-[8px] text-white/30 uppercase tracking-[0.4em]">Current_Sector</div>
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">Machine Learning Eng.</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[8px] text-white/30 uppercase tracking-[0.4em]">Focus_Area</div>
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">Autonomous Agents</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
                    <span className="text-[9px] uppercase tracking-[0.5em] rotate-180 [writing-mode:vertical-lr]">Scroll to Access</span>
                    <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* Section 02: Neural Metrics (Skills) */}
            <section className="relative min-h-screen z-10 pl-16 flex items-center bg-[#050505]">
                <div className="container mx-auto px-12 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Metrics Content */}
                        <div className="lg:col-span-4 space-y-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-amber-500">
                                    <Workflow className="w-5 h-5" />
                                    <h2 className="text-xs font-bold uppercase tracking-[0.4em]">System_Metrics</h2>
                                </div>
                                <p className="text-sm text-white/50 leading-relaxed uppercase tracking-wider">
                                    Evaluation of cognitive sub-systems and technical proficiencies. Data reflects current operational capacity across core domains.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {SKILLS.map((skill, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] uppercase tracking-widest text-white/80">{skill.name}</span>
                                            <span className="text-[10px] font-bold text-amber-500">{skill.level}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                                className="h-full bg-amber-500 rounded-full"
                                            />
                                        </div>
                                        <div className="flex justify-between text-[7px] uppercase tracking-tighter text-white/20 font-bold">
                                            <span>Sub_Sys: 0{i + 1}</span>
                                            <span>Status: {skill.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technical Grid Visual */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: Code, title: 'Inference Engines', desc: 'Implementing high-throughput transformer models and real-time vision pipelines.' },
                                { icon: Radio, title: 'Spatial Handshake', desc: 'Synthesizing XR experiences with low-latency neural data bridges.' },
                                { icon: Database, title: 'Data Sovereignty', desc: 'Architecting secure, distributed ledgers for private cognitive archives.' },
                                { icon: Shield, title: 'Agentic Safety', desc: 'Hardening autonomous protocols against adversarial neural injection.' }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                        <item.icon className="w-16 h-16" />
                                    </div>
                                    <item.icon className="w-5 h-5 text-amber-500 mb-6" />
                                    <h4 className="text-lg font-display uppercase tracking-wider text-white mb-4">{item.title}</h4>
                                    <p className="text-xs text-white/40 leading-relaxed font-mono uppercase tracking-wide">{item.desc}</p>
                                    
                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[8px] text-white/20 uppercase tracking-[0.3em]">Protocol_v.4.1</span>
                                        <div className="w-2 h-2 rounded-full bg-amber-500/20 group-hover:bg-amber-500 animate-pulse" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 03: External Nodes (Socials) */}
            <section className="relative min-h-screen z-10 pl-16 flex items-center">
                <div className="container mx-auto px-12 py-24 text-center">
                    <div className="space-y-16">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-xs font-bold uppercase tracking-[0.8em] text-amber-500/60">External_Network_Grid</h2>
                            <p className="text-3xl md:text-5xl font-display uppercase tracking-tighter leading-tight">
                                Establish <span className="text-white">Connection</span> with the Source.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                            {[
                                { icon: Twitter, label: 'X_PROFILE', href: 'https://x.com/__Qambar__', detail: '@__QAMBAR__' },
                                { icon: Github, label: 'SOURCE_CODE', href: 'https://github.com/Qambar-dev-0207', detail: 'GIT_LOCAL' },
                                { icon: Linkedin, label: 'NEURAL_LINK', href: 'https://linkedin.com/in/mohammed-qambar-0466132b9', detail: 'ID_7267' },
                                { icon: Mail, label: 'DIRECT_COMMS', href: 'mailto:work.qambar@gmail.com', detail: 'PRIORITY_1' }
                            ].map((node, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <MagneticButton>
                                        <a 
                                            href={node.href} 
                                            target="_blank" 
                                            className="group flex flex-col items-center gap-6"
                                        >
                                            <div className="relative">
                                                <div className="absolute -inset-4 border border-amber-500/0 rounded-full group-hover:border-amber-500/20 group-hover:scale-110 transition-all duration-700" />
                                                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500/5 transition-all duration-500 bg-black/40 backdrop-blur-md">
                                                    <node.icon className="w-8 h-8 text-white/40 group-hover:text-amber-500 transition-colors" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-colors">
                                                    {node.label}
                                                </div>
                                                <div className="text-[8px] font-mono uppercase tracking-widest text-amber-500/20 group-hover:text-amber-500/60 transition-colors">
                                                    {node.detail}
                                                </div>
                                            </div>
                                        </a>
                                    </MagneticButton>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-24 opacity-20">
                            <div className="h-px w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-white to-transparent" />
                            <p className="mt-8 text-[10px] uppercase tracking-[1em]">All systems operational // End of Dossier</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Persistent HUD Footer */}
            <div className="fixed bottom-0 left-16 right-0 p-8 flex justify-between items-end pointer-events-none z-50">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-black/80 backdrop-blur-2xl px-5 py-2 border border-white/5 rounded-full pointer-events-auto hover:border-amber-500/40 transition-colors group">
                        <Terminal className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span className="text-[9px] text-white/60 uppercase tracking-[0.3em] font-bold group-hover:text-white transition-colors">PathOS_Session_Stable</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 pointer-events-auto">
                    <div className="flex items-center gap-4 bg-black/80 backdrop-blur-2xl px-5 py-2 border border-amber-500/20 rounded-full">
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                        <span className="text-[9px] text-amber-500 uppercase tracking-[0.4em] font-bold">Encrypted_Link</span>
                    </div>
                    <Link href="/" className="group flex items-center gap-4 text-[9px] uppercase tracking-[0.5em] text-white/30 hover:text-amber-500 transition-all">
                        <span>Return to Mainframe</span>
                        <div className="w-8 h-px bg-white/10 group-hover:w-12 group-hover:bg-amber-500 transition-all" />
                    </Link>
                </div>
            </div>

            <style jsx global>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
                }
                ::-webkit-scrollbar {
                    width: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(251, 191, 36, 0.2);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(251, 191, 36, 0.5);
                }
            `}</style>
        </main>
    )
}
