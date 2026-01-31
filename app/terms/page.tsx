'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertTriangle, Disc } from 'lucide-react'
import AuthDecor from '../components/AuthDecor'
import NoiseOverlay from '../components/NoiseOverlay'
import GlitchText from '../components/GlitchText'

export default function TermsPage() {
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
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="font-mono text-xs uppercase tracking-widest text-amber-500">Legal Bindings</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display tracking-tighter uppercase leading-none">
                            Terms of <GlitchText text="Service" />
                        </h1>
                        <p className="font-mono text-gray-500 uppercase tracking-widest">Neural Link Agreement v1.0</p>
                    </div>

                    <div className="space-y-12 font-mono text-gray-400 text-sm md:text-base leading-relaxed">
                        
                        <section>
                            <h3 className="text-white font-display text-2xl uppercase tracking-wider mb-4 border-b border-white/10 pb-2">1. Acceptance of Protocol</h3>
                            <p>
                                By accessing the Praxis AI interface (&quot;The System&quot;), you agree to be bound by these Terms. If you do not agree to these terms, do not initiate the connection protocol. The System reserves the right to terminate access for any entity violating these parameters.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-white font-display text-2xl uppercase tracking-wider mb-4 border-b border-white/10 pb-2">2. User Conduct</h3>
                            <ul className="space-y-2 list-disc list-inside marker:text-amber-500">
                                <li>You agree not to attempt to breach, reverse-engineer, or inject malicious code into The System.</li>
                                <li>You are responsible for maintaining the confidentiality of your neural link credentials (passwords).</li>
                                <li>You will not use The System for any unlawful purpose or to propagate prohibited content.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-white font-display text-2xl uppercase tracking-wider mb-4 border-b border-white/10 pb-2">3. Intellectual Property</h3>
                            <p>
                                The Praxis AI architecture, visual assets, and underlying code are the exclusive property of Mantis Protocol. User-generated content (e.g., resumes, specific query data) remains the property of the user, with a limited license granted to The System for processing purposes.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-white font-display text-2xl uppercase tracking-wider mb-4 border-b border-white/10 pb-2">4. Disclaimer of Warranty</h3>
                            <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded">
                                <p className="text-amber-500/80">
                                    THE SYSTEM IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND. WE DO NOT GUARANTEE UNINTERRUPTED UPTIME OR ABSOLUTE DATA PERMANENCE IN THE EVENT OF CATASTROPHIC SERVER FAILURE.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-white font-display text-2xl uppercase tracking-wider mb-4 border-b border-white/10 pb-2">5. Termination</h3>
                            <p>
                                We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of The System.
                            </p>
                        </section>

                    </div>
                </motion.div>
            </div>
        </main>
    )
}
