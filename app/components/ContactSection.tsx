'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Twitter } from 'lucide-react'
import MagneticButton from './MagneticButton'

export default function ContactSection() {
    return (
        <section className="w-full py-24 px-6 md:px-12 bg-black text-white relative overflow-hidden z-20">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.05]" 
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
             </div>

             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 items-center">
                
                {/* Text Side */}
                <div className="space-y-8">
                    <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none">
                        Initiate<br/>Protocol
                    </h2>
                    <p className="font-mono text-gray-400 max-w-md leading-relaxed">
                        Ready to integrate? Join the network. We are archiving the collective consciousness, one thought at a time.
                    </p>
                    
                    <div className="flex gap-6 pt-4 border-t border-white/10">
                        <a href="https://x.com/__Qambar__" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-white text-gray-500 transition-colors">
                            <Twitter className="w-4 h-4" /> @__Qambar__
                        </a>
                        <a href="https://github.com/Qambar-dev-0207" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-white text-gray-500 transition-colors">
                            <Github className="w-4 h-4" /> /Qambar-dev-0207
                        </a>
                    </div>
                </div>

                {/* Form Side (Stylized as a terminal input) */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm"
                >
                    <form className="space-y-8">
                        <div className="space-y-2 group">
                            <label className="font-mono text-xs uppercase tracking-widest text-gray-500 group-focus-within:text-white transition-colors">Identity</label>
                            <input type="text" placeholder="Designation / Name" className="w-full bg-transparent border-b border-white/20 py-4 font-display text-2xl focus:outline-none focus:border-white transition-colors placeholder:text-white/10 text-white" />
                        </div>
                        <div className="space-y-2 group">
                            <label className="font-mono text-xs uppercase tracking-widest text-gray-500 group-focus-within:text-white transition-colors">Frequency</label>
                            <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/20 py-4 font-display text-2xl focus:outline-none focus:border-white transition-colors placeholder:text-white/10 text-white" />
                        </div>
                        <MagneticButton>
                            <button className="w-full py-6 mt-8 bg-white text-black font-display text-xl uppercase tracking-widest hover:bg-gray-200 transition-colors flex justify-between items-center px-6 group rounded-xl">
                                <span>Transmit Data</span>
                                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </MagneticButton>
                    </form>
                </motion.div>

             </div>
        </section>
    )
}
