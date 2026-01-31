'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Terminal, Cpu, Network, Shield } from 'lucide-react'
import AuthDecor from '../components/AuthDecor'
import NoiseOverlay from '../components/NoiseOverlay'
import GlitchText from '../components/GlitchText'
import TextScramble from '../components/TextScramble'

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-amber-500/30 selection:text-white relative overflow-hidden">
            <AuthDecor />
            <NoiseOverlay />

            <nav className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <Link href="/" className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Return to Base</span>
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 container mx-auto px-6 py-32 md:py-48 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-16"
                >
                    <div className="space-y-6 border-l-2 border-amber-500/50 pl-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="font-mono text-xs uppercase tracking-widest text-amber-500">System Doctrine</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display tracking-tighter uppercase leading-none">
                            The <GlitchText text="Manifesto" />
                        </h1>
                    </div>

                    <div className="space-y-12 font-mono text-gray-400 leading-relaxed text-sm md:text-base">
                        <section className="space-y-4">
                            <h2 className="text-white text-xl uppercase tracking-widest flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-emerald-500" />
                                01. Cognitive Augmentation
                            </h2>
                            <p>
                                <TextScramble>
                                    Human memory is fallible. We build systems not to replace the mind, but to extend it. Praxis AI serves as an external cortex—reliable, searchable, and infinite. We believe in the seamless integration of biological intuition and silicon precision.
                                </TextScramble>
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-white text-xl uppercase tracking-widest flex items-center gap-2">
                                <Network className="w-5 h-5 text-emerald-500" />
                                02. Decentralized Thought
                            </h2>
                            <p>
                                Information should not be siloed. We advocate for a neural network of knowledge where ideas can cross-pollinate without friction. The PathOS architecture is designed to break down walls between data points, creating a living, breathing archive of consciousness.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-white text-xl uppercase tracking-widest flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-emerald-500" />
                                03. Active Intelligence
                            </h2>
                            <p>
                                Passive storage is obsolete. Data must work. Our agents don&apos;t just retrieve; they synthesize, predict, and optimize. A resume is not a document; it is a dynamic representation of potential. A project is not a file; it is a proof of capability.
                            </p>
                        </section>

                         <section className="space-y-4">
                            <h2 className="text-white text-xl uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                04. Digital Sovereignty
                            </h2>
                            <p>
                                Your thoughts, your data. In an age of surveillance capitalism, Praxis AI stands for total user autonomy. Encryption is not a feature; it is the foundation. We are the guardians of your digital ghost.
                            </p>
                        </section>
                    </div>

                    <div className="pt-12 border-t border-white/10">
                        <p className="font-display text-2xl text-white uppercase tracking-wider text-center">
                            &quot;We do not predict the future. We compile it.&quot;
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
