'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { processRecallItem } from '../actions'
import { Check, Clock, Brain, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Thought } from '../../lib/types'
import TextScramble from './TextScramble'

interface RecallSessionProps {
  items: Thought[]
}

export default function RecallSession({ items }: RecallSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(true)
  const [isDone, setIsDone] = useState(false)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  const currentItem = items[currentIndex]

  useEffect(() => {
    setIsRevealed(false)
    setIsDecrypting(true)
    const timer = setTimeout(() => setIsDecrypting(false), 600)
    return () => clearTimeout(timer)
  }, [currentIndex])

  const handleAction = async (action: 'KEEP' | 'DONE' | 'SNOOZE' | 'INTEGRATED') => {
    if (!currentItem?.id || processingAction) return
    setProcessingAction(action)

    await processRecallItem(currentItem.id, action)
    setProcessingAction(null)

    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsDone(true)
    }
  }

  const maskedContent = currentItem?.content
    .split(' ')
    .map((word, i) => (word.length > 3 && i % 3 === 0 ? '_____' : word))
    .join(' ') ?? ''

  const masteryPercentage = currentItem?.masteryScore ?? 0

  if (isDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8 text-brand-black"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-24 h-24 rounded-full border border-brand-black flex items-center justify-center bg-brand-black/5"
        >
          <CheckCircle className="w-12 h-12 stroke-[1px]" />
        </motion.div>

        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter">Session Complete</h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-black/40">
            {items.length} {items.length === 1 ? 'memory' : 'memories'} reviewed
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Brain className="w-4 h-4 text-amber-600" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700">
            Neural pathways reinforced
          </span>
        </div>

        <div className="flex gap-3 mt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-black text-white font-display text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    )
  }

  if (!currentItem) return null

  return (
    <div className="w-full max-w-4xl relative min-h-[70vh] flex flex-col items-center justify-center py-12">

      {/* Header: progress + mastery */}
      <div className="absolute top-0 w-full flex flex-col items-center gap-2">
        <div className="flex items-center justify-between w-full max-w-sm">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-amber-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">Memory Progress</span>
          </div>
          <span className="font-mono text-[10px] text-black/30">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
        <div className="w-full max-w-sm h-1 bg-black/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${masteryPercentage}%` }}
            className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
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
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {/* Thought display */}
          <div className="text-center mb-14 mt-10">
            <div className="mb-6 inline-flex items-center gap-3 px-3 py-1 border border-black/5 bg-black/[0.02] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50" suppressHydrationWarning>
                Saved {new Date(currentItem.createdAt as any).toLocaleDateString()}
              </span>
            </div>

            <div className="relative min-h-[100px] md:min-h-[140px] flex items-center justify-center px-4">
              <h2 className="text-2xl md:text-5xl font-display font-bold text-black leading-tight max-w-3xl">
                {isRevealed ? (
                  <TextScramble trigger={isDecrypting}>{currentItem.content}</TextScramble>
                ) : (
                  <span className="text-black/20 italic select-none blur-[2px] hover:blur-none transition-all duration-500 cursor-pointer" onClick={() => setIsRevealed(true)}>
                    {maskedContent}
                  </span>
                )}
              </h2>

              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-black/40 hover:text-amber-600 transition-colors"
              >
                {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {isRevealed ? 'Hide' : 'Reveal'}
              </button>
            </div>
          </div>

          {/* Patterns */}
          {(currentItem as any).patterns && (currentItem as any).patterns.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14 max-w-3xl mx-auto">
              {(currentItem as any).patterns.map((pattern: any) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={pattern.id}
                  className="bg-white border border-black/10 p-5 relative overflow-hidden hover:border-amber-500/30 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-black/40">{pattern.type}</span>
                  </div>
                  <h4 className="font-display font-bold uppercase tracking-wider text-sm mb-2">{pattern.title}</h4>
                  <p className="font-mono text-[11px] leading-relaxed text-black/60">
                    {pattern.insights?.[0]?.content ?? pattern.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 w-full px-4">
            <ActionButton
              onClick={() => handleAction('INTEGRATED')}
              loading={processingAction === 'INTEGRATED'}
              disabled={!!processingAction}
              primary
              icon={<ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />}
              label="Remembered"
              sublabel="+20% Memory"
            />
            <ActionButton
              onClick={() => handleAction('DONE')}
              loading={processingAction === 'DONE'}
              disabled={!!processingAction}
              icon={<Check className="w-4 h-4 md:w-5 md:h-5" />}
              label="Reviewed"
              sublabel="+10% Progress"
            />
            <ActionButton
              onClick={() => handleAction('SNOOZE')}
              loading={processingAction === 'SNOOZE'}
              disabled={!!processingAction}
              icon={<Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />}
              label="Snooze"
              sublabel="Tomorrow"
              amber
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot progress */}
      <div className="absolute -bottom-8 flex gap-2">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-amber-500' : idx < currentIndex ? 'w-2 bg-black/30' : 'w-2 bg-black/10'}`}
          />
        ))}
      </div>
    </div>
  )
}

interface ActionButtonProps {
  onClick: () => void
  loading: boolean
  disabled: boolean
  icon: React.ReactNode
  label: string
  sublabel: string
  primary?: boolean
  amber?: boolean
}

function ActionButton({ onClick, loading, disabled, icon, label, sublabel, primary, amber }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 transition-all duration-300 group min-w-[150px] md:min-w-[190px] disabled:opacity-50 disabled:cursor-not-allowed
        ${primary
          ? 'bg-black text-white hover:bg-amber-500 hover:text-black'
          : amber
            ? 'border border-black/10 bg-white hover:text-amber-600 hover:border-amber-600'
            : 'border border-black/10 bg-white hover:border-black'
        }`}
    >
      {loading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
      ) : icon}
      <div className="text-left">
        <span className="block font-display tracking-widest text-xs md:text-sm uppercase font-bold leading-none">{label}</span>
        <span className="font-mono text-[7px] md:text-[8px] uppercase opacity-50 tracking-tighter mt-1 block group-hover:opacity-100">{sublabel}</span>
      </div>
    </button>
  )
}
