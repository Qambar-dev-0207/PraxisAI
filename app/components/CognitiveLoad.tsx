'use client'

import { motion } from 'framer-motion'
import { Activity, Zap, Wind, AlertTriangle, Thermometer, Brain } from 'lucide-react'
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
      case 'CRITICAL': return 'text-red-600 bg-red-500/10 border-red-500/20'
      case 'HIGH': return 'text-orange-600 bg-orange-500/10 border-orange-500/20'
      case 'OPTIMAL': return 'text-amber-600 bg-amber-500/10 border-amber-500/20'
      default: return 'text-black/40 bg-black/5 border-black/10'
    }
  }

  const getRecommendation = () => {
    switch (loadData.status) {
      case 'CRITICAL': return "System Overload. Initiate immediate 'Cooling Protocol' (15m Meditation)."
      case 'HIGH': return "High Cognitive Load. Recommendation: Break current cycle. 5m Breathwork."
      case 'OPTIMAL': return "Optimal Synergy. System performing within peak parameters."
      default: return "Low Input Detected. Ready for data ingestion."
    }
  }

  const getIcon = () => {
    switch (loadData.status) {
      case 'CRITICAL': return <AlertTriangle className="w-4 h-4" />
      case 'HIGH': return <Thermometer className="w-4 h-4" />
      case 'OPTIMAL': return <Zap className="w-4 h-4" />
      default: return <Wind className="w-4 h-4" />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border border-black/5 bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] relative overflow-hidden group">
        
        {/* Background Glitch Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-amber-500/10 transition-colors" />

        {/* Load Gauge (3 cols) */}
        <div className="md:col-span-3 flex flex-col items-center justify-center relative">
            <svg className="w-32 h-32 transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    className="text-black/5"
                />
                <motion.circle
                    initial={{ strokeDashoffset: 364 }}
                    animate={{ strokeDashoffset: 364 - (364 * loadData.load) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="364"
                    className={`${loadData.status === 'CRITICAL' ? 'text-red-500' : loadData.status === 'HIGH' ? 'text-orange-500' : 'text-amber-500'}`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-3xl font-display font-bold leading-none">{Math.round(loadData.load)}</span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-black/40">Load Index</span>
            </div>
        </div>

        {/* Status Info (6 cols) */}
        <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 border rounded-full font-mono text-[9px] uppercase tracking-widest ${getStatusColor()}`}>
                    {getIcon()}
                    <span>Status: {loadData.status}</span>
                </div>
                <div className="h-[1px] flex-grow bg-black/5" />
            </div>

            <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black">
                Cognitive Resources: <span className="text-black/40">{loadData.count} Ingestions Today</span>
            </h3>

            <p className="font-mono text-xs leading-relaxed text-black/60 max-w-md">
                <span className="text-amber-600">&gt;</span> {getRecommendation()}
            </p>
        </div>

        {/* Technical Data (3 cols) */}
        <div className="md:col-span-3 border-l border-black/5 pl-6 hidden md:block space-y-6">
             <div>
                <span className="block font-mono text-[8px] uppercase tracking-widest text-black/30 mb-1">Processing Rate</span>
                <div className="flex items-end gap-1">
                    <span className="font-display text-xl leading-none">0.82</span>
                    <span className="font-mono text-[10px] text-black/40 pb-0.5">T/s</span>
                </div>
             </div>
             <div>
                <span className="block font-mono text-[8px] uppercase tracking-widest text-black/30 mb-1">Neural Entropy</span>
                <div className="flex items-end gap-1">
                    <span className="font-display text-xl leading-none text-amber-600">Stable</span>
                    <Activity className="w-3 h-3 text-amber-500/50 mb-1" />
                </div>
             </div>
        </div>

      </div>
    </div>
  )
}
