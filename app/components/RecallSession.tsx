'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { processRecallItem } from '../actions'
import { Check, Clock, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RecallSessionProps {
  items: any[]
}

export default function RecallSession({ items }: RecallSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  const currentItem = items[currentIndex]

  const handleAction = async (action: 'KEEP' | 'DONE') => {
    if (!currentItem) return

    await processRecallItem(currentItem.id, action)

    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      router.refresh()
    }
  }

  if (!currentItem) return null

  return (
    <div className="w-full max-w-2xl relative min-h-[50vh] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full text-center"
        >
          <div className="mb-4 text-brand-gray font-mono text-xs uppercase tracking-widest opacity-60">
            From <span suppressHydrationWarning>{new Date(currentItem.createdAt).toLocaleDateString()}</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-light text-brand-black leading-tight mb-8">
            &quot;{currentItem.content}&quot;
          </h2>

          {/* INSIGHT DISPLAY */}
          {currentItem.patterns && currentItem.patterns.length > 0 && (
            <div className="mb-12 mx-auto max-w-lg">
                {currentItem.patterns.map((pattern: any) => (
                    <div key={pattern.id} className="bg-brand-black/5 border border-brand-black/10 p-6 rounded-xl text-left backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-black animate-pulse" />
                             <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-black/60">
                                {pattern.type} DETECTED
                             </span>
                        </div>
                        <h4 className="font-display uppercase tracking-wider text-lg mb-2">{pattern.title}</h4>
                        <p className="font-mono text-xs leading-relaxed opacity-70">
                            {pattern.insights[0]?.content || pattern.description}
                        </p>
                    </div>
                ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6 justify-center w-full">
            <button
              onClick={() => handleAction('DONE')}
              className="group flex items-center justify-center gap-3 px-8 py-4 border border-brand-gray hover:border-brand-black hover:bg-brand-black hover:text-brand-white transition-all w-full md:w-auto"
            >
              <Check className="w-5 h-5" />
              <span className="font-display tracking-widest text-lg uppercase">Done</span>
            </button>

            <button
              onClick={() => handleAction('KEEP')}
              className="group flex items-center justify-center gap-3 px-8 py-4 border border-brand-gray hover:border-brand-black hover:bg-brand-black hover:text-brand-white transition-all w-full md:w-auto"
            >
              <Clock className="w-5 h-5" />
              <span className="font-display tracking-widest text-lg uppercase">Snooze</span>
            </button>
          </div>

        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-16 flex gap-2">
        {items.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-brand-black' : 'bg-brand-light-gray'}`} 
          />
        ))}
      </div>
    </div>
  )
}
