'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { saveThought, analyzeInput } from '../actions'
import { ArrowRight, CheckCircle, Mic, MicOff, Sparkles, Activity, Terminal } from 'lucide-react'

// Define types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const SpeechRecognitionConstructor = typeof window !== 'undefined' && 
  (window.SpeechRecognition || window.webkitSpeechRecognition)

interface ProcessedData {
  processedContent: string;
  tags: string[];
  suggestedImportance: 'TODAY' | 'WEEK' | 'LATER' | 'NOT_IMPORTANT';
}

export default function MindDump() {
  const [step, setStep] = useState<'INPUT' | 'ANALYZING' | 'IMPORTANCE' | 'SAVED'>('INPUT')
  const [content, setContent] = useState('')
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    if (step === 'INPUT' && !isListening) {
      inputRef.current?.focus()
      // Initialize Web Speech API
      if (SpeechRecognitionConstructor) {
        const recognition = new SpeechRecognitionConstructor() as SpeechRecognitionInstance
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        
        recognition.onstart = () => {
          setIsListening(true)
        }
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              setContent(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + transcript)
            }
          }
        }
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error)
          if (event.error !== 'no-speech') {
            alert(`Microphone error: ${event.error}`)
          }
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognitionRef.current = recognition
      }
    }
  }, [step, isListening])

  const startListening = () => {
    if (!SpeechRecognitionConstructor) {
      alert('Speech recognition is not supported in your browser.')
      return
    }
    recognitionRef.current?.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
  }

  const toggleListening = () => isListening ? stopListening() : startListening()

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && content.trim()) {
      setStep('ANALYZING')
      try {
        const result = await analyzeInput(content)
        setProcessedData(result)
        setStep('IMPORTANCE')
      } catch (err) {
        console.error('Analysis failed:', err)
        setStep('INPUT')
      }
    }
  }

  const handleSave = async (importance: 'TODAY' | 'WEEK' | 'LATER' | 'NOT_IMPORTANT') => {
    await saveThought(content, importance, processedData?.processedContent || content, processedData?.tags || [])
    setStep('SAVED')
    setTimeout(() => {
      setContent('')
      setProcessedData(null)
      setStep('INPUT')
    }, 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 min-h-[40vh] flex items-center justify-center">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: INPUT */}
        {step === 'INPUT' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-black/40">Active Interface // Quick Ingest</span>
                </div>
                
                <button 
                    onClick={toggleListening}
                    className={`group flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${isListening ? 'bg-brand-black text-brand-white border-brand-black' : 'bg-transparent text-brand-black/40 border-brand-black/10 hover:border-brand-black hover:text-brand-black'}`}
                >
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                        {isListening ? 'Listening' : 'Voice Mode'}
                    </span>
                    {isListening ? <MicOff className="w-3 h-3 animate-pulse" /> : <Mic className="w-3 h-3" />}
                </button>
            </div>

            <div className="relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-4xl md:text-6xl font-display uppercase tracking-tighter text-brand-black border-b border-brand-black/10 focus:border-brand-black outline-none pb-8 transition-all duration-700 placeholder:text-brand-black/5 pr-16"
                  placeholder={isListening ? "RECORDING..." : "ENTER THOUGHT"}
                  disabled={isListening}
                />
                <div className="absolute right-0 bottom-8">
                     <ArrowRight className={`w-8 h-8 transition-all duration-500 ${content.trim() ? 'opacity-100 translate-x-0 text-brand-black' : 'opacity-0 -translate-x-4 text-brand-black/20'}`} />
                </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center opacity-30">
                 <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-brand-black">
                    <Terminal className="w-3 h-3" />
                    <span>Press Enter to Synthesize</span>
                 </div>
                 <div className="font-mono text-[10px] tracking-widest uppercase text-brand-black">
                    SYSTEM_READY_1.0
                 </div>
            </div>
          </motion.div>
        )}

        {/* STEP 1.5: ANALYZING */}
        {step === 'ANALYZING' && (
             <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-8 text-brand-black"
             >
                <div className="relative">
                    <Activity className="w-16 h-16 animate-[pulse_1s_infinite] text-brand-black opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-brand-black/10 to-transparent animate-scan" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse text-brand-black">Neural Synthesis in Progress</p>
                    <div className="w-48 h-[1px] bg-brand-black/10 overflow-hidden">
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full bg-brand-black"
                        />
                    </div>
                </div>
             </motion.div>
        )}

        {/* STEP 2: IMPORTANCE */}
        {step === 'IMPORTANCE' && (
          <motion.div
            key="importance"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            {/* AI Summary Section */}
            {processedData && (
                <div className="mb-16 border border-brand-black/10 p-10 rounded-[2rem] bg-brand-black/5 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles className="w-32 h-32 text-brand-black" />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles className="w-4 h-4 text-brand-black" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-black/40">AI Synthesized Insight</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tighter text-brand-black leading-tight mb-8">
                        {processedData.processedContent}
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {processedData.tags?.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 border border-brand-black/10 font-mono text-[10px] uppercase tracking-widest text-brand-black/50 rounded-full hover:border-brand-black hover:text-brand-black transition-colors cursor-default">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="text-center mb-12">
                 <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-black/40">Select Trajectory</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <ImportanceBtn 
                label="Today" 
                sub="Critical"
                onClick={() => handleSave('TODAY')}
                suggested={processedData?.suggestedImportance === 'TODAY'}
              />
              <ImportanceBtn 
                label="Week" 
                sub="Upcoming"
                onClick={() => handleSave('WEEK')}
                suggested={processedData?.suggestedImportance === 'WEEK'} 
              />
              <ImportanceBtn 
                label="Later" 
                sub="Backlog"
                onClick={() => handleSave('LATER')}
                suggested={processedData?.suggestedImportance === 'LATER'} 
              />
               <ImportanceBtn 
                label="Clear" 
                sub="Discard"
                onClick={() => handleSave('NOT_IMPORTANT')}
                suggested={processedData?.suggestedImportance === 'NOT_IMPORTANT'} 
              />
            </div>
          </motion.div>
        )}

        {/* STEP 3: SAVED */}
        {step === 'SAVED' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-brand-black"
          >
            <div className="w-24 h-24 rounded-full border border-brand-black text-brand-black flex items-center justify-center mb-8 bg-brand-black/5">
                <CheckCircle className="w-12 h-12 stroke-[1px]" />
            </div>
            <h3 className="text-4xl font-display uppercase tracking-widest">Thought Archived</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest mt-4 opacity-40">System Resetting...</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

interface ImportanceBtnProps {
  label: string;
  sub: string;
  onClick: () => void;
  suggested: boolean;
}

function ImportanceBtn({ label, sub, onClick, suggested }: ImportanceBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center p-8 border rounded-[1.5rem] transition-all duration-500 overflow-hidden ${suggested ? 'border-brand-black bg-brand-black text-brand-white shadow-lg scale-105' : 'border-brand-black/10 hover:border-brand-black/50 bg-brand-white text-brand-black'}`}
    >
      {/* Corner Brackets */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-current opacity-20" />
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-current opacity-20" />
      
      {suggested && (
          <div className="absolute top-2 right-4 flex items-center gap-1 opacity-50">
              <Sparkles className="w-2 h-2" />
              <span className="text-[7px] font-bold uppercase tracking-widest">AI Rec</span>
          </div>
      )}
      
      <span className="text-2xl font-display uppercase tracking-tighter mb-1">{label}</span>
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">{sub}</span>
    </button>
  )
}
