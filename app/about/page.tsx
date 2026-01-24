'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Github, Linkedin, Globe, Twitter } from 'lucide-react'
import AuthDecor from '../components/AuthDecor'
import NoiseOverlay from '../components/NoiseOverlay'
import TextScramble from '../components/TextScramble'

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white relative overflow-hidden">
            <AuthDecor />
            <NoiseOverlay />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <Link href="/" className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 container mx-auto px-6 min-h-screen flex flex-col justify-center max-w-2xl py-24">
                
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    {/* Profile Section */}
                    <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                        <div className="relative w-40 h-40 grayscale hover:grayscale-0 transition-all duration-700 border border-white/10 p-1">
                            <div className="absolute inset-0 border border-white/20 -m-2 pointer-events-none"></div>
                            <Image 
                                src="/pfp.jpeg" 
                                alt="Mohammed Qambar Syed" 
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div>
                                <h1 className="text-4xl font-display tracking-tight uppercase leading-none mb-2">
                                    Mohammed Qambar Syed
                                </h1>
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                                    ML & XR Developer / AI Engineer
                                </p>
                            </div>

                            <p className="font-mono text-sm leading-relaxed text-white/70">
                                <TextScramble>
                                    Aspiring Machine Learning and XR Developer focused on building intelligent systems, automation workflows, and full-stack AI applications. Experienced in developing production-level solutions for job automation, computer vision, and safety monitoring.
                                </TextScramble>
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4 border-t border-white/5">
                                <a href="https://x.com/__Qambar__" target="_blank" className="text-white/40 hover:text-white transition-colors"><Twitter className="w-4 h-4"/></a>
                                <a href="https://github.com/Qambar-dev-0207" target="_blank" className="text-white/40 hover:text-white transition-colors"><Github className="w-4 h-4"/></a>
                                <a href="https://linkedin.com/in/mohammed-qambar-0466132b9" target="_blank" className="text-white/40 hover:text-white transition-colors"><Linkedin className="w-4 h-4"/></a>
                                <a href="https://qambars-portfolio.netlify.app" target="_blank" className="text-white/40 hover:text-white transition-colors"><Globe className="w-4 h-4"/></a>
                                <a href="mailto:work.qambar@gmail.com" className="text-white/40 hover:text-white transition-colors"><Mail className="w-4 h-4"/></a>
                            </div>
                        </div>
                    </div>

                    {/* Minimal Quote/Manifesto */}
                    <div className="pt-12 border-t border-white/5 opacity-20">
                        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-center">
                            Augmenting Human Potential through Silicon Intelligence
                        </p>
                    </div>

                </motion.div>

            </div>
        </main>
    )
}