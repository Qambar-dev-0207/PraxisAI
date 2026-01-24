'use client'

import Link from 'next/link'
import { Activity } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="w-full py-12 px-6 md:px-12 bg-black text-white border-t border-white/10 relative z-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
                
                <div className="space-y-4">
                    <h3 className="text-4xl font-display tracking-widest text-white">PRAXIS AI</h3>
                    <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                        © 2026 Mantis Protocol.<br/>
                        Decentralized Thought Archive.<br/>
                        All thoughts reserved.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 font-mono text-xs text-gray-400 uppercase tracking-wider">
                    <Link href="/about" className="hover:text-white transition-colors">About</Link>
                    <a href="#" className="hover:text-white transition-colors">Manifesto</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>

                <div className="font-mono text-[10px] text-green-500 uppercase tracking-widest flex items-center gap-2 border border-green-900/30 px-3 py-1 rounded-full bg-green-900/10">
                    <Activity className="w-3 h-3" />
                    <span>System Operational</span>
                </div>

            </div>
        </footer>
    )
}
