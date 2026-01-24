'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Lock, Eye, Key, FileWarning } from 'lucide-react'
import AuthDecor from '../components/AuthDecor'
import NoiseOverlay from '../components/NoiseOverlay'
import GlitchText from '../components/GlitchText'

export default function PrivacyPage() {
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
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="font-mono text-xs uppercase tracking-widest text-red-500">Security Clearance: Public</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display tracking-tighter uppercase leading-none">
                            Privacy <GlitchText text="Protocol" />
                        </h1>
                        <p className="font-mono text-gray-500 uppercase tracking-widest">Last Updated: System Time 2026.01.25</p>
                    </div>

                    <div className="grid gap-12 font-mono text-gray-400 text-sm md:text-base">
                        
                        <div className="p-8 border border-white/10 bg-white/5 rounded-xl backdrop-blur-sm hover:border-red-500/30 transition-colors">
                            <h3 className="text-white text-lg uppercase tracking-widest mb-4 flex items-center gap-3">
                                <Lock className="w-5 h-5 text-red-500" /> Data Encryption
                            </h3>
                            <p>
                                All neural data (user inputs, resume data, career telemetry) is encrypted at rest using AES-256 protocols. Transit layers are secured via TLS 1.3. We operate on a Zero-Knowledge architecture where feasible—your private keys remain local.
                            </p>
                        </div>

                        <div className="p-8 border border-white/10 bg-white/5 rounded-xl backdrop-blur-sm hover:border-red-500/30 transition-colors">
                            <h3 className="text-white text-lg uppercase tracking-widest mb-4 flex items-center gap-3">
                                <Eye className="w-5 h-5 text-red-500" /> Data Collection
                            </h3>
                            <p>
                                We collect only mission-critical telemetry: authentication tokens, usage metrics for system optimization, and explicitly provided career data. We do not track biological identifiers or external browsing habits outside the Praxis ecosystem.
                            </p>
                        </div>

                        <div className="p-8 border border-white/10 bg-white/5 rounded-xl backdrop-blur-sm hover:border-red-500/30 transition-colors">
                            <h3 className="text-white text-lg uppercase tracking-widest mb-4 flex items-center gap-3">
                                <Key className="w-5 h-5 text-red-500" /> Third-Party Access
                            </h3>
                            <p>
                                No data is sold. Third-party integrations (e.g., LLM providers) receive only anonymized or user-approved contexts necessary for specific generation tasks. We maintain strict data processing agreements with all sub-processors.
                            </p>
                        </div>

                        <div className="p-8 border border-white/10 bg-white/5 rounded-xl backdrop-blur-sm hover:border-red-500/30 transition-colors">
                            <h3 className="text-white text-lg uppercase tracking-widest mb-4 flex items-center gap-3">
                                <FileWarning className="w-5 h-5 text-red-500" /> Data Purge
                            </h3>
                            <p>
                                Users retain the right to the "Right to be Forgotten." Initiating a Data Purge sequence will irrevocably wipe all user-associated records from our distributed nodes within 24 hours. This action is permanent and cannot be undone.
                            </p>
                        </div>

                    </div>
                </motion.div>
            </div>
        </main>
    )
}
