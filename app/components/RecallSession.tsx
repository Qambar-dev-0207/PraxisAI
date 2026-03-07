'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { processRecallItem } from '../actions'
import { Check, Clock, Brain, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Thought } from '../../lib/types'
import TextScramble from './TextScramble'

interface RecallSessionProps {
  items: Thought[]
}

export default function RecallSession({ items }: RecallSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(true)
  const router = useRouter()

  const currentItem = items[currentIndex]

  useEffect(() => {
    setIsRevealed(false)
    setIsDecrypting(true)
    const timer = setTimeout(() => setIsDecrypting(false), 800)
    return () => clearTimeout(timer)
  }, [currentIndex])

  const handleAction = async (action: 'KEEP' | 'DONE' | 'SNOOZE' | 'INTEGRATED') => {
    if (!currentItem || !currentItem.id) return

    await processRecallItem(currentItem.id, action)

    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      router.refresh()
    }
  }

  if (!currentItem) return null

  // Create a masked version of the content for active recall
  const maskedContent = currentItem.content.split(' ').map((word, i) => {
      if (word.length > 3 && i % 3 === 0) return '_____'
      return word
  }).join(' ')

  const masteryPercentage = currentItem.masteryScore || 0

  return (
    <div className="w-full max-w-4xl relative min-h-[70vh] flex flex-col items-center justify-center py-12">
      {/* Mastery Progress Header */}
      <div className="absolute top-0 w-full flex flex-col items-center gap-2 mb-12">
          <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-500" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">Memory Progress</span>
          </div>
          <div className="w-64 h-1 bg-black/5 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${masteryPercentage}%` }}
                className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              />
          </div>
          <span className="font-mono text-[9px] text-amber-600/60 uppercase">{masteryPercentage}% Memory Strength</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-3 px-3 py-1 border border-black/5 bg-black/[0.02] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-black/50" suppressHydrationWarning>
                    Saved: {new Date(currentItem.createdAt).toLocaleDateString()} // Item: {currentIndex + 1}/{items.length}
                </span>
            </div>
            
            <div className="relative min-h-[120px] md:min-h-[160px] flex items-center justify-center px-4">
                <h2 className="text-2xl md:text-6xl font-display font-bold text-black leading-tight max-w-3xl">
                    {isRevealed ? (
                        <TextScramble trigger={isDecrypting}>{currentItem.content}</TextScramble>
                    ) : (
                        <span className="text-black/20 italic select-none blur-[2px] hover:blur-none transition-all duration-700">
                            {maskedContent}
                        </span>
                    )}
                </h2>
                
                {/* Reveal Toggle */}
                <button 
                    onClick={() => setIsRevealed(!isRevealed)}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-black/40 hover:text-amber-600 transition-colors group"
                >
                    {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {isRevealed ? 'Hide Source' : 'Show Original Thought'}
                </button>
            </div>
          </div>

          {/* INSIGHT DISPLAY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 max-w-3xl mx-auto">
              {currentItem.patterns && currentItem.patterns.length > 0 ? (
                  currentItem.patterns.map((pattern) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={pattern.id} 
                        className="bg-white border border-black/10 p-5 relative overflow-hidden group hover:border-amber-500/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 -rotate-45 translate-x-8 -translate-y-8" />
                        <div className="flex items-center gap-2 mb-3">
                             <div className="w-1 h-1 rounded-full bg-amber-500" />
                             <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-black/40">
                                {pattern.type} Linked
                             </span>
                        </div>
                        <h4 className="font-display font-bold uppercase tracking-wider text-sm mb-2 group-hover:text-amber-600 transition-colors">{pattern.title}</h4>
                        <p className="font-mono text-[11px] leading-relaxed text-black/60">
                            {pattern.insights && pattern.insights[0]?.content ? pattern.insights[0].content : pattern.description}
                        </p>
                    </motion.div>
                  ))
              ) : (
                <div className="md:col-span-2 text-center p-8 border border-dashed border-black/10 rounded-lg">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-black/30">No linked thoughts found</span>
                </div>
              )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 w-full px-4">
            <button
              onClick={() => handleAction('INTEGRATED')}
              className="flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 bg-black text-white hover:bg-amber-500 hover:text-black transition-all duration-300 group min-w-[160px] md:min-w-[200px]"
            >
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
              <div className="text-left">
                <span className="block font-display tracking-widest text-xs md:text-sm uppercase font-bold leading-none">Remembered</span>
                <span className="font-mono text-[7px] md:text-[8px] uppercase opacity-50 tracking-tighter mt-1 group-hover:opacity-100">+20% Memory</span>
              </div>
            </button>

            <button
              onClick={() => handleAction('DONE')}
              className="flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 border border-black/10 hover:border-black transition-all duration-300 min-w-[160px] md:min-w-[200px] bg-white"
            >
              <Check className="w-4 h-4 md:w-5 md:h-5" />
              <div className="text-left">
                <span className="block font-display tracking-widest text-xs md:text-sm uppercase font-bold leading-none">Reviewed</span>
                <span className="font-mono text-[7px] md:text-[8px] uppercase opacity-50 tracking-tighter mt-1">+10% Progress</span>
              </div>
            </button>

            <button
              onClick={() => handleAction('SNOOZE')}
              className="flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 border border-black/10 hover:text-amber-600 hover:border-amber-600 transition-all duration-300 min-w-[140px] md:min-w-[160px] bg-white group"
            >
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="font-display tracking-widest text-xs md:text-sm uppercase font-bold group-hover:translate-x-1 transition-transform">Snooze</span>
            </button>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* Progress Footer */}
      <div className="absolute -bottom-8 flex gap-3">
        {items.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'w-2 bg-black/10'}`} 
          />
        ))}
      </div>
    </div>
  )
}
