'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { saveThought, analyzeInput } from '../actions'
import {
  ArrowRight, CheckCircle, Mic, MicOff, Sparkles, Activity,
  Terminal, Zap, ZapOff, BookOpen, Layers, ArrowLeft
} from 'lucide-react'
import { useBinauralBeats } from '../hooks/useBinauralBeats'
import { AIAnalysis } from '../../lib/types'

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: {
    [key: number]: { [key: number]: { transcript: string }; isFinal: boolean; length: number }
    length: number
  }
}
interface SpeechRecognitionErrorEvent extends Event { error: string }
interface SpeechRecognitionInstance {
  continuous: boolean; interimResults: boolean; lang: string
  onstart: () => void; onresult: (e: SpeechRecognitionEvent) => void
  onerror: (e: SpeechRecognitionErrorEvent) => void; onend: () => void
  start: () => void; stop: () => void
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

type Step = 'INPUT' | 'ANALYZING' | 'IMPORTANCE' | 'SAVING' | 'SAVED'

export default function MindDump() {
  const [step, setStep] = useState<Step>('INPUT')
  const [content, setContent] = useState('')
  const [processedData, setProcessedData] = useState<AIAnalysis | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [analyzeError, setAnalyzeError] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const { isActive: isFocusMode, toggle: toggleFocus } = useBinauralBeats()

  const SpeechRecognitionCtor = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null

  // Init speech recognition once
  useEffect(() => {
    if (!SpeechRecognitionCtor) return
    const r = new SpeechRecognitionCtor() as SpeechRecognitionInstance
    r.continuous = true
    r.interimResults = true
    r.lang = 'en-US'
    r.onstart = () => setIsListening(true)
    r.onresult = (e: SpeechRecognitionEvent) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const t = e.results[i][0].transcript
          setContent(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + t)
        }
      }
    }
    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error !== 'no-speech') console.error('Speech error:', e.error)
    }
    r.onend = () => setIsListening(false)
    recognitionRef.current = r
    return () => { try { r.stop() } catch {} }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-grow textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.max(80, Math.min(el.scrollHeight, 300)) + 'px'
  }, [])

  useEffect(() => {
    if (step === 'INPUT') {
      textareaRef.current?.focus()
      autoResize()
    }
  }, [step, autoResize])

  const resetToInput = useCallback(() => {
    setStep('INPUT')
    setAnalyzeError(false)
  }, [])

  // Escape to go back from IMPORTANCE step
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step === 'IMPORTANCE') resetToInput()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step, resetToInput])

  const handleSubmit = async () => {
    if (!content.trim()) return
    setStep('ANALYZING')
    setAnalyzeError(false)
    try {
      const result = await analyzeInput(content)
      setProcessedData(result)
      setStep('IMPORTANCE')
    } catch {
      setAnalyzeError(true)
      setStep('INPUT')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && content.trim()) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSave = async (importance: 'TODAY' | 'WEEK' | 'LATER' | 'NOT_IMPORTANT') => {
    setStep('SAVING')
    await saveThought(content, importance, processedData?.processedContent || content, processedData?.tags || [])
    setStep('SAVED')
    setTimeout(() => {
      setContent('')
      setProcessedData(null)
      setStep('INPUT')
    }, 2000)
  }

  const toggleListening = () => {
    if (!SpeechRecognitionCtor) { alert('Speech recognition not supported in your browser.'); return }
    if (isListening) recognitionRef.current?.stop()
    else recognitionRef.current?.start()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 min-h-[40vh] flex items-center justify-center">
      <AnimatePresence mode="wait">

        {/* INPUT */}
        {step === 'INPUT' && (
          <motion.div key="input" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="w-full">
            <div className="flex justify-between items-center mb-8 md:mb-12 flex-wrap gap-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-black/40">Quick Capture</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={toggleFocus}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 text-[9px] md:text-[10px] font-mono uppercase tracking-widest ${isFocusMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-brand-black/40 border-brand-black/10 hover:border-brand-black hover:text-brand-black'}`}
                >
                  {isFocusMode ? <Zap className="w-3 h-3 animate-pulse" /> : <ZapOff className="w-3 h-3" />}
                  <span className="hidden sm:inline">{isFocusMode ? 'Music On' : 'Focus Music'}</span>
                </button>
                {SpeechRecognitionCtor && (
                  <button
                    onClick={toggleListening}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 text-[9px] md:text-[10px] font-mono uppercase tracking-widest ${isListening ? 'bg-brand-black text-brand-white border-brand-black' : 'bg-transparent text-brand-black/40 border-brand-black/10 hover:border-brand-black hover:text-brand-black'}`}
                  >
                    {isListening ? <MicOff className="w-3 h-3 animate-pulse" /> : <Mic className="w-3 h-3" />}
                    <span className="hidden sm:inline">{isListening ? 'Listening' : 'Voice'}</span>
                  </button>
                )}
              </div>
            </div>

            {analyzeError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl font-mono text-[10px] text-red-600 uppercase tracking-widest">
                AI analysis failed. Check API key or try again.
              </div>
            )}

            <div className="relative group">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => { setContent(e.target.value); autoResize() }}
                onKeyDown={handleKeyDown}
                rows={2}
                className="w-full bg-transparent text-2xl md:text-5xl font-display uppercase tracking-tighter text-brand-black border-b border-brand-black/10 focus:border-brand-black outline-none pb-5 md:pb-8 pt-2 transition-all duration-700 placeholder:text-brand-black/5 resize-none leading-tight"
                placeholder={isListening ? "LISTENING..." : "WHAT'S ON YOUR MIND?"}
                disabled={isListening}
                style={{ height: '80px' }}
              />
            </div>

            <div className="mt-6 md:mt-8 flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-brand-black opacity-30">
                <Terminal className="w-3 h-3" />
                <span>Enter to analyze • Shift+Enter for newline</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className={`flex items-center gap-2 px-4 py-2 bg-black text-white font-mono text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 ${content.trim() ? 'opacity-100 hover:bg-amber-500 hover:text-black' : 'opacity-20 cursor-not-allowed'}`}
              >
                <span>Analyze</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ANALYZING */}
        {step === 'ANALYZING' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8 text-brand-black">
            <div className="relative">
              <Activity className="w-16 h-16 animate-[pulse_1s_infinite] text-brand-black opacity-50" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse text-brand-black">Analyzing your thought...</p>
              <div className="w-48 h-[1px] bg-brand-black/10 overflow-hidden">
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-full h-full bg-brand-black" />
              </div>
            </div>
          </motion.div>
        )}

        {/* SAVING */}
        {step === 'SAVING' && (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8 text-brand-black">
            <Activity className="w-16 h-16 animate-spin text-brand-black opacity-50" style={{ animationDuration: '3s' }} />
            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse text-brand-black">Saving to memory...</p>
              <div className="w-48 h-[1px] bg-brand-black/10 overflow-hidden">
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-full h-full bg-brand-black" />
              </div>
            </div>
          </motion.div>
        )}

        {/* IMPORTANCE */}
        {step === 'IMPORTANCE' && (
          <motion.div key="importance" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full">

            {/* Back button */}
            <button
              onClick={resetToInput}
              className="flex items-center gap-2 mb-8 font-mono text-[10px] uppercase tracking-widest text-brand-black/40 hover:text-brand-black transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              <span>Edit thought (Esc)</span>
            </button>

            {!processedData && (
              <div className="mb-8 px-5 py-4 bg-amber-500/8 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-1">AI Analysis Unavailable</p>
                  <p className="font-mono text-[10px] text-amber-600/70">
                    Set GEMINI_API_KEY in .env to enable AI analysis. You can still save this thought manually below.
                  </p>
                </div>
              </div>
            )}

            {processedData && (
              <div className="space-y-5 mb-10">
                <div className="border border-brand-black/10 p-6 md:p-10 rounded-[2rem] bg-brand-black/5 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-32 h-32 text-brand-black" />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-black/40">AI Summary</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-display uppercase tracking-tighter text-brand-black leading-tight mb-6">
                    {processedData.processedContent}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {processedData.tags?.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 border border-brand-black/10 font-mono text-[10px] uppercase tracking-widest text-brand-black/50 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 border border-black/5 bg-white rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-black/40">
                      <BookOpen className="w-3 h-3" />
                      <span className="font-mono text-[9px] uppercase tracking-widest">Writing Tip</span>
                    </div>
                    <p className="font-mono text-[11px] leading-relaxed italic text-black/80">
                      &quot;{processedData.linguisticPrecision || "Your thought is clear and concise."}&quot;
                    </p>
                  </div>
                  {processedData.perspectiveShifts && processedData.perspectiveShifts.length > 0 && (
                    <div className="p-5 border border-black/5 bg-white rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-black/40">
                        <Layers className="w-3 h-3" />
                        <span className="font-mono text-[9px] uppercase tracking-widest">Perspectives</span>
                      </div>
                      <div className="space-y-3">
                        {processedData.perspectiveShifts.map((shift, i) => (
                          <div key={i}>
                            <span className="block font-display text-[9px] uppercase tracking-wider font-bold mb-1 text-amber-600">{shift.label}</span>
                            <p className="font-mono text-[10px] text-black/60 leading-relaxed border-l border-black/10 pl-3">{shift.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-black/40">When should we review this?</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
              {([
                { key: 'TODAY', label: 'Today', sub: 'Critical', color: 'text-red-600' },
                { key: 'WEEK', label: 'Week', sub: 'Upcoming', color: 'text-amber-600' },
                { key: 'LATER', label: 'Later', sub: 'Backlog', color: 'text-blue-600' },
                { key: 'NOT_IMPORTANT', label: 'Clear', sub: 'Discard', color: 'text-black/30' },
              ] as const).map(({ key, label, sub }) => (
                <ImportanceBtn
                  key={key}
                  label={label}
                  sub={sub}
                  onClick={() => handleSave(key)}
                  suggested={processedData?.suggestedImportance === key}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* SAVED */}
        {step === 'SAVED' && (
          <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-brand-black">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-full border border-brand-black flex items-center justify-center mb-6 bg-brand-black/5"
            >
              <CheckCircle className="w-10 h-10 stroke-[1px]" />
            </motion.div>
            <h3 className="text-3xl font-display uppercase tracking-widest">Saved!</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest mt-3 opacity-40">Ready for the next thought...</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

interface ImportanceBtnProps {
  label: string; sub: string; onClick: () => void; suggested: boolean
}

function ImportanceBtn({ label, sub, onClick, suggested }: ImportanceBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center p-4 md:p-6 border rounded-[1.2rem] md:rounded-[1.5rem] transition-all duration-300 overflow-hidden ${suggested ? 'border-brand-black bg-brand-black text-brand-white shadow-lg scale-105' : 'border-brand-black/10 hover:border-brand-black/50 hover:bg-black/5 bg-brand-white text-brand-black'}`}
    >
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-current opacity-20" />
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-current opacity-20" />
      {suggested && (
        <div className="absolute top-2 right-4 flex items-center gap-1 opacity-50">
          <Sparkles className="w-2 h-2" />
          <span className="text-[7px] font-bold uppercase tracking-widest">AI Rec</span>
        </div>
      )}
      <span className="text-lg md:text-2xl font-display uppercase tracking-tighter mb-1">{label}</span>
      <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">{sub}</span>
    </button>
  )
}
