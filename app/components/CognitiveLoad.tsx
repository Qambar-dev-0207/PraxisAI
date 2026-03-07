'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Wind, AlertTriangle, Thermometer, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CognitiveLoadProps {
  loadData: {
    load: number
    status: 'LOW' | 'OPTIMAL' | 'HIGH' | 'CRITICAL' | 'UNKNOWN' | 'ERROR'
    count: number
  }
}

export default function CognitiveLoad({ loadData }: CognitiveLoadProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getStatusColor = () => {
    switch (loadData.status) {
      case 'CRITICAL': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'OPTIMAL': return 'text-amber-600'
      default: return 'text-black/40'
    }
  }

  const getBgColor = () => {
    switch (loadData.status) {
      case 'CRITICAL': return 'bg-red-500/5 border-red-500/10'
      case 'HIGH': return 'bg-orange-500/5 border-orange-500/10'
      case 'OPTIMAL': return 'bg-amber-500/5 border-amber-500/10'
      default: return 'bg-black/[0.02] border-black/5'
    }
  }

  const getRecommendation = () => {
    switch (loadData.status) {
      case 'CRITICAL': return "You've added a lot today. Consider taking a break."
      case 'HIGH': return "High mental load. Try a short breathing exercise."
      case 'OPTIMAL': return "You're in a good flow state."
      default: return "Ready to capture your thoughts."
    }
  }

  return (
    <div className="w-full relative group">
      <div className={`relative overflow-hidden p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-700 ${getBgColor()} backdrop-blur-xl h-full flex flex-col justify-between`}>
        
        {/* Animated Scanning Line */}
        <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent z-0 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col gap-6 md:gap-8">
            {/* Header Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className={`p-1.5 md:p-2 rounded-lg ${getBgColor()}`}>
                        <Shield className={`w-3.5 h-3.5 md:w-4 md:h-4 ${getStatusColor()}`} />
                    </div>
                    <div>
                        <span className="block font-mono text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-black/30">Mental State</span>
                        <span className={`text-xs md:text-sm font-display font-bold uppercase tracking-widest ${getStatusColor()}`}>{loadData.status}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block font-mono text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-black/30">Response Time</span>
                    <span className="text-xs md:text-sm font-display font-bold leading-none text-black/60">12ms</span>
                </div>
            </div>

            {/* Central Gauge Section */}
            <div className="flex flex-col items-center justify-center py-2 md:py-4">
                <div className="relative w-36 h-36 md:w-48 md:h-48">
                    {/* Multi-layered rings */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-dashed border-black/[0.03] rounded-full"
                    />
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-3 md:inset-4 border border-black/[0.02] rounded-full"
                    />
                    
                    {/* SVG Gauge */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                        <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-black/[0.03]" />
                        <motion.circle
                            initial={{ strokeDashoffset: 534 }}
                            animate={{ strokeDashoffset: 534 - (534 * loadData.load) / 100 }}
                            transition={{ duration: 2, ease: "circOut" }}
                            cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="534"
                            className={getStatusColor()}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl md:text-6xl font-display font-bold tracking-tighter leading-none">{Math.round(loadData.load)}</span>
                        <div className="flex flex-col items-center -mt-1">
                            <span className="font-mono text-[6px] md:text-[8px] uppercase tracking-[0.3em] text-black/30">Activity Level</span>
                            <div className="w-8 md:w-12 h-[1px] bg-black/10 mt-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingestion Info */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tighter leading-tight text-black">
                        Thoughts Saved: <span className="text-black/20">{loadData.count}</span>
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full animate-pulse ${loadData.status === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <p className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest text-black/60 italic">
                            {getRecommendation()}
                        </p>
                    </div>
                </div>

                {/* Technical Sub-metrics Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 md:pt-6 border-t border-black/5">
                    <div className="space-y-1 md:space-y-2">
                        <span className="block font-mono text-[6px] md:text-[7px] uppercase tracking-widest text-black/30">Focus Level</span>
                        <div className="flex items-center gap-2">
                            <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-500/50" />
                            <span className="font-display text-[8px] md:text-[10px] font-bold uppercase">Stable</span>
                        </div>
                    </div>
                    <div className="space-y-1 md:space-y-2 text-right">
                        <span className="block font-mono text-[6px] md:text-[7px] uppercase tracking-widest text-black/30">AI Status</span>
                        <span className="font-display text-[8px] md:text-[10px] font-bold uppercase text-amber-600">Active</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
