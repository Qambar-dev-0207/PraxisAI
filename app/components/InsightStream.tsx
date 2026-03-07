'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, AlertTriangle, Repeat, Network, ChevronDown, CheckSquare, Sparkles, Send } from 'lucide-react'
import { Pattern } from '../../lib/types'
import { resolveContradiction } from '../actions'

interface InsightStreamProps {
  patterns: Pattern[];
  loading?: boolean;
}

export default function InsightStream({ patterns, loading }: InsightStreamProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [resolutionText, setResolutionText] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  if (!loading && (!patterns || patterns.length === 0)) return null

  const getIcon = (type: string | undefined) => {
    switch (type?.toUpperCase()) {
      case 'RECURRENCE': return <Repeat className="w-4 h-4" />
      case 'CONTRADICTION': return <AlertTriangle className="w-4 h-4 text-amber-600" />
      case 'CONNECTION': return <Network className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const toggleExpand = (id: string | undefined) => {
    if (!id) return
    setExpandedId(expandedId === id ? null : id)
    setResolutionText('')
  }

  const handleResolve = async (id: string) => {
    if (!resolutionText.trim()) return
    setIsResolving(true)
    await resolveContradiction(id, resolutionText)
    setIsResolving(false)
    setExpandedId(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-6 pb-32">
      <div className="flex items-center gap-4 mb-8 opacity-60">
        <div className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-black">
          AI Insights // Recent Patterns
        </h3>
        <div className="h-[1px] flex-grow bg-brand-black/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
            [...Array(3)].map((_, i) => (
                <div key={i} className="bg-brand-black/5 border border-brand-black/10 p-6 rounded-2xl animate-pulse h-64 flex flex-col justify-end">
                    <div className="mt-4 flex flex-col items-center gap-2">
                        <Activity className="w-4 h-4 text-brand-black opacity-20 animate-spin" />
                        <span className="text-[7px] font-mono uppercase tracking-widest opacity-30">Analyzing...</span>
                    </div>
                </div>
            ))
        ) : (
            patterns.map((pattern, i) => {
                const isContradiction = pattern.type === 'CONTRADICTION';
                const hasAction = !!pattern.suggestedAction || isContradiction;
                const isExpanded = expandedId === pattern.id;

                return (
                    <motion.div
                    key={pattern.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group relative bg-white border p-6 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col ${hasAction ? 'border-brand-black/20' : 'border-black/5'} ${isExpanded ? 'md:col-span-2 md:row-span-2 ring-2 ring-amber-500/20' : ''}`}
                    >
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg transition-colors ${isContradiction ? 'bg-amber-500/10 text-amber-600' : 'bg-black/5'}`}>
                                {getIcon(pattern.type)}
                            </div>
                            <span className="font-mono text-[9px] text-black/40 uppercase tracking-widest" suppressHydrationWarning>
                                {new Date(pattern.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <h4 className="font-display text-lg leading-tight mb-2 group-hover:translate-x-1 transition-transform">
                            {pattern.title}
                        </h4>
                        
                        <p className="text-xs font-mono text-black/60 leading-relaxed mb-6 flex-grow">
                            {pattern.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                            <span className="text-[9px] font-bold font-mono uppercase tracking-widest opacity-40">
                                {Math.round(pattern.confidence * 100)}% Confidence
                            </span>
                            
                            {hasAction && (
                                <button 
                                    onClick={() => toggleExpand(pattern.id)}
                                    className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-colors px-3 py-1 rounded-full ${isExpanded ? 'bg-black text-white' : 'bg-black/5 text-black/40 hover:bg-black hover:text-white'}`}
                                >
                                    <span>{isExpanded ? 'Close' : isContradiction ? 'Resolve Conflict' : 'See Action'}</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                            )}
                        </div>

                        {/* Expanded Action Section */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-6 mt-6 border-t border-brand-black/10 space-y-4">
                                        {isContradiction ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-amber-600">
                                                    <Sparkles className="w-3 h-3" />
                                                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Help Resolve Conflict</span>
                                                </div>
                                                <p className="text-[11px] font-mono text-black/70 italic bg-amber-500/5 p-4 border-l-2 border-amber-500">
                                                    &quot;You have two thoughts that seem to disagree. How would you explain this?&quot;
                                                </p>
                                                <div className="relative">
                                                    <textarea 
                                                        value={resolutionText}
                                                        onChange={(e) => setResolutionText(e.target.value)}
                                                        className="w-full bg-black/5 border border-black/10 rounded-xl p-4 font-mono text-xs focus:outline-none focus:border-amber-500 min-h-[100px] resize-none"
                                                        placeholder="Type your thoughts here..."
                                                    />
                                                    <button 
                                                        disabled={isResolving || !resolutionText.trim()}
                                                        onClick={() => handleResolve(pattern.id!)}
                                                        className="absolute bottom-4 right-4 p-2 bg-black text-white rounded-lg hover:bg-amber-500 hover:text-black transition-all disabled:opacity-30"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-brand-black">
                                                    <CheckSquare className="w-3 h-3" />
                                                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Suggested Action</span>
                                                </div>
                                                <div className="text-xs font-mono leading-relaxed text-black/70 bg-black/5 p-4 rounded-xl border border-black/10">
                                                    {pattern.suggestedAction}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    </motion.div>
                )
            })
        )}
      </div>
    </div>
  )
}
