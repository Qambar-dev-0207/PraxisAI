'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { Mail, Github, Linkedin, Twitter, Terminal, Cpu, Fingerprint, Share2, Activity, Shield, Zap, Database, Network } from 'lucide-react'
import AuthDecor from '../components/AuthDecor'
import NoiseOverlay from '../components/NoiseOverlay'
import TextScramble from '../components/TextScramble'
import GlitchText from '../components/GlitchText'
import MagneticButton from '../components/MagneticButton'

export default function AboutPage() {
    const containerRef = useRef(null)

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
        <main ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 selection:text-white relative overflow-hidden font-mono">
            <AuthDecor />
            <NoiseOverlay />

            {/* PathOS Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#fbbf2408_1px,transparent_1px),linear-gradient(to_bottom,#fbbf2408_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.02),transparent)]"></div>
            </div>

            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center border-b border-amber-500/10 bg-black/20 backdrop-blur-md">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Link href="/" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-amber-500/50 hover:text-amber-500 transition-all">
                        <div className="w-8 h-px bg-amber-500/20 group-hover:w-12 group-hover:bg-amber-500 transition-all"></div>
                        <span>PathOS // Terminal</span>
                    </Link>
                </motion.div>
                <div className="flex items-center gap-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:flex items-center gap-3 px-3 py-1 border border-amber-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] text-amber-500/60 uppercase tracking-widest">Neural Link: Active</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] text-white/30 uppercase tracking-[0.4em]">
                        ID: Q_SYED.SYS
                    </motion.div>
                </div>
            </nav>

            <section className="relative z-10 container mx-auto px-6 pt-32 pb-24">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                    {/* Visual Identity & Stats Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
                        <div className="relative group mx-auto lg:mx-0">
                            {/* Decorative Frame */}
                            <div className="absolute -inset-4 border border-amber-500/10 pointer-events-none group-hover:border-amber-500/30 transition-colors duration-700"></div>
                            <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500/60"></div>
                            <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500/60"></div>
                            
                            {/* Image Container with Scanning Effect */}
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-amber-950/20 border border-amber-500/20 grayscale hover:grayscale-0 transition-all duration-1000">
                                <Image 
                                    src="/pfp.jpeg" 
                                    alt="Mohammed Qambar Syed" 
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                                    priority
                                />
                                {/* Scanning HUD Overlay */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent h-1/3 w-full animate-[scan_4s_linear_infinite]"></div>
                                    <div className="absolute top-4 left-4 space-y-1">
                                        <div className="w-12 h-0.5 bg-amber-500/40"></div>
                                        <div className="w-8 h-0.5 bg-amber-500/20"></div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 text-right">
                                        <div className="text-[8px] text-amber-500/60 uppercase tracking-tighter mb-1">Face_ID_Match</div>
                                        <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">99.82%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Specs Panel */}
                        <div className="grid grid-cols-1 gap-2 border border-amber-500/10 p-4 bg-amber-950/5">
                            <div className="flex justify-between items-center border-b border-amber-500/5 pb-2">
                                <span className="text-[8px] text-amber-500/40 uppercase tracking-widest">Processor</span>
                                <span className="text-[10px] text-white/80 uppercase">Neural_Core v4</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-amber-500/5 pb-2">
                                <span className="text-[8px] text-amber-500/40 uppercase tracking-widest">Architecture</span>
                                <span className="text-[10px] text-white/80 uppercase">Distributed_AI</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[8px] text-amber-500/40 uppercase tracking-widest">Security</span>
                                <span className="text-[10px] text-amber-500 uppercase">Quantum_Safe</span>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 border border-amber-500/10 bg-amber-950/10 group hover:border-amber-500/40 transition-colors">
                                <Activity className="w-4 h-4 text-amber-500 mb-3" />
                                <div className="text-[8px] text-amber-500/40 uppercase mb-1">Projects_Depl</div>
                                <div className="text-xl font-display text-white">42+</div>
                            </div>
                            <div className="p-4 border border-amber-500/10 bg-amber-950/10 group hover:border-amber-500/40 transition-colors">
                                <Shield className="w-4 h-4 text-amber-500 mb-3" />
                                <div className="text-[8px] text-amber-500/40 uppercase mb-1">Sec_Level</div>
                                <div className="text-xl font-display text-white">OMEGA</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col space-y-12">
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-3 text-amber-500/60"
                            >
                                <Fingerprint className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-[0.5em]">Auth_Session: QAMBAR_SYED_OS</span>
                            </motion.div>
                            
                            <h1 className="text-6xl md:text-8xl font-display tracking-tight uppercase leading-[0.8] text-white">
                                <GlitchText text="Qambar" />
                                <span className="block text-amber-500/20"><GlitchText text="Syed" /></span>
                            </h1>

                            <div className="flex flex-wrap gap-4 pt-2">
                                {['Machine Learning', 'Computer Vision', 'XR Development', 'Agentic Systems'].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 border border-amber-500/20 text-[9px] uppercase tracking-widest text-amber-500/60 bg-amber-500/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="relative pl-6 border-l-2 border-amber-500/40">
                                    <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light">
                                        <TextScramble>
                                            Architecting the intersection of Machine Learning and XR. Building autonomous systems that navigate human experience.
                                        </TextScramble>
                                    </p>
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed uppercase tracking-wider">
                                    Focused on high-fidelity AI applications, from computer vision to agentic automation. Silicon intelligence as a seamless extension of biological potential.
                                </p>
                            </div>

                            <div className="space-y-8 p-6 bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] group-hover:bg-amber-500/10 transition-colors"></div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500 flex items-center gap-2">
                                    <Terminal className="w-3 h-3" /> Core_Directives
                                </h3>
                                <ul className="space-y-4 font-mono text-[10px] text-white/60">
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-500">01</span>
                                        <span>OPTIMIZE COGNITIVE LOAD VIA DISTRIBUTED NEURAL ARCHITECTURES.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-500">02</span>
                                        <span>SYNTHESIZE IMMERSIVE INTERFACES FOR HUMAN-MACHINE SYMBIOSIS.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-500">03</span>
                                        <span>IMPLEMENT QUANTUM-RESISTANT AGENTIC PROTOCOLS.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* System Architecture Section */}
                        <div className="space-y-6 pt-8 border-t border-amber-500/10">
                             <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40 flex items-center gap-3">
                                    <Cpu className="w-4 h-4 text-amber-500" /> System_Architecture
                                </h2>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-4 h-1 bg-amber-500/20"></div>
                                    ))}
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: Zap, title: 'Inference', val: '0.04s', sub: 'Neural_Response' },
                                    { icon: Database, title: 'Memory', val: '4.2PB', sub: 'Distributed_Ledger' },
                                    { icon: Network, title: 'Sync', val: 'Realtime', sub: 'Handshake_Protocol' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                                        <stat.icon className="w-3 h-3 text-amber-500/40 mb-3" />
                                        <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1">{stat.title}</div>
                                        <div className="text-lg text-white font-display uppercase">{stat.val}</div>
                                        <div className="text-[7px] text-amber-500/20 uppercase mt-1">{stat.sub}</div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* External Links */}
                        <div className="space-y-6 pt-8">
                            <div className="flex items-center gap-3 text-white/20">
                                <Share2 className="w-3 h-3 text-amber-500/40" />
                                <span className="text-[8px] uppercase tracking-[0.4em]">External_Data_Nodes</span>
                                <div className="flex-1 h-px bg-amber-500/10"></div>
                            </div>
                            
                            <div className="flex flex-wrap gap-8">
                                {[
                                    { icon: Twitter, label: 'X_PROFILE', href: 'https://x.com/__Qambar__' },
                                    { icon: Github, label: 'SOURCE_CODE', href: 'https://github.com/Qambar-dev-0207' },
                                    { icon: Linkedin, label: 'NEURAL_LINK', href: 'https://linkedin.com/in/mohammed-qambar-0466132b9' },
                                    { icon: Mail, label: 'DIRECT_COMMS', href: 'mailto:work.qambar@gmail.com' }
                                ].map((social, i) => (
                                    <MagneticButton key={i}>
                                        <a 
                                            href={social.href} 
                                            target="_blank" 
                                            className="group flex flex-col items-center gap-2"
                                        >
                                            <div className="w-10 h-10 rounded-full border border-amber-500/10 flex items-center justify-center group-hover:border-amber-500/60 group-hover:bg-amber-500/5 transition-all duration-500">
                                                <social.icon className="w-4 h-4 text-white/40 group-hover:text-amber-500 transition-colors" />
                                            </div>
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

            {/* Fixed Footer HUD Info */}
            <div className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-end pointer-events-none z-50">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 border border-white/5 rounded-full">
                        <Terminal className="w-2.5 h-2.5 text-amber-500/40" />
                        <span className="text-[8px] text-white/40 uppercase tracking-widest">System_State: Stable</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 border border-amber-500/20 rounded-full">
                        <Cpu className="w-3 h-3 text-amber-500/60" />
                        <span className="text-[8px] text-amber-500/60 uppercase tracking-[0.3em]">PathOS_v2.1.0_PROD</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(300%); }
                }
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(251, 191, 36, 0.1);
                }
            `}</style>
        </main>
    )
}
