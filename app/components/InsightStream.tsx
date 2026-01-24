'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, AlertTriangle, Repeat, Network, ChevronDown, CheckSquare } from 'lucide-react'

interface InsightStreamProps {
  patterns: any[]
}

export default function InsightStream({ patterns }: InsightStreamProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!patterns || patterns.length === 0) return null

  const getIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'RECURRENCE': return <Repeat className="w-4 h-4 text-brand-black" />
      case 'CONTRADICTION': return <AlertTriangle className="w-4 h-4 text-brand-black" />
      case 'CONNECTION': return <Network className="w-4 h-4 text-brand-black" />
      default: return <Activity className="w-4 h-4 text-brand-black" />
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-6">
      <div className="flex items-center gap-4 mb-8 opacity-60">
        <div className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-black">
          Neural Log // Recent Patterns
        </h3>
        <div className="h-[1px] flex-grow bg-brand-black/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patterns.map((pattern, i) => {
          const hasAction = !!pattern.suggestedAction;
          const isExpanded = expandedId === pattern.id;

          return (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => hasAction && toggleExpand(pattern.id)}
              className={`group relative bg-white border p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${hasAction ? 'cursor-pointer border-brand-black/20 hover:border-brand-black' : 'border-black/5 hover:border-black/20'}`}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-black/5 rounded-lg group-hover:bg-black/10 transition-colors">
                    {getIcon(pattern.insights[0]?.type || 'GENERIC')}
                  </div>
                  <span className="font-mono text-[9px] text-black/40 uppercase tracking-widest" suppressHydrationWarning>
                    {new Date(pattern.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="font-display text-lg leading-tight mb-2 group-hover:translate-x-1 transition-transform">
                  {pattern.title}
                </h4>
                
                <p className="text-xs font-mono text-black/60 leading-relaxed mb-4 flex-grow">
                  {pattern.description}
                </p>

                {/* Footer / Action Trigger */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                   <div className="flex items-center gap-2">
                        <div className="h-[1px] w-4 bg-black/20 group-hover:w-8 transition-all" />
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                        {Math.round(pattern.confidence * 100)}% Conf.
                        </span>
                   </div>
                   
                   {hasAction && (
                       <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-colors ${isExpanded ? 'text-brand-black' : 'text-brand-black/40 group-hover:text-brand-black'}`}>
                           <span>{isExpanded ? 'Close' : 'Resolve'}</span>
                           <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                       </div>
                   )}
                </div>

                {/* Expanded Action Steps */}
                <AnimatePresence>
                    {isExpanded && pattern.suggestedAction && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-2 border-t border-brand-black/10">
                                <div className="flex items-center gap-2 mb-3 text-brand-black">
                                    <CheckSquare className="w-3 h-3" />
                                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Recommended Protocol</span>
                                </div>
                                <div className="text-xs font-mono leading-relaxed text-black/70 whitespace-pre-line bg-black/5 p-3 rounded-lg border border-black/10">
                                    {pattern.suggestedAction}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}