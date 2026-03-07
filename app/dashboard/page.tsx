import MindDump from '../components/MindDump'
import InsightStream from '../components/InsightStream'
import CognitiveLoad from '../components/CognitiveLoad'
import NeuralMap from '../components/NeuralMap'
import { getPendingCount, getRecentPatterns, getMentalLoad, getNeuralMapData } from '../actions'
import Link from 'next/link'
import { ArrowRight, Terminal, LogOut, Share2 } from 'lucide-react'
import { auth } from '@/auth'
import { logout } from '@/app/lib/auth-actions'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function RecentPatterns() {
  const recentPatterns = await getRecentPatterns()
  return <InsightStream patterns={recentPatterns} />
}

export default async function Dashboard() {
  const session = await auth()
  const pendingCount = await getPendingCount()
  const loadData = await getMentalLoad()
  const { thoughts, patterns } = await getNeuralMapData()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden bg-brand-white text-brand-black font-sans selection:bg-brand-black selection:text-brand-white">
      
      {/* Brand Header */}
      <header className="absolute top-8 left-8 right-8 md:top-12 md:left-12 md:right-12 z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1">
            <Link href="/" className="text-xl md:text-2xl font-display tracking-widest text-brand-black hover:text-brand-gray transition-colors uppercase">
            Praxis<span className="font-bold">AI</span>
            </Link>
            <div className="flex items-center gap-2 text-brand-black/40">
                <Terminal className="w-3 h-3" />
                <span className="font-mono text-[10px] uppercase tracking-widest">
                    Operator: {session?.user?.name || 'Unknown'}
                </span>
            </div>
        </div>

        <form action={logout}>
            <button 
                type="submit"
                className="group flex items-center gap-2 px-4 py-2 border border-brand-black/10 hover:border-brand-black transition-all font-mono text-[10px] uppercase tracking-widest"
            >
                <span>Terminate Session</span>
                <LogOut className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
        </form>
      </header>

      {/* Decorative Grid Lines - Fixed to screen */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-brand-black"></div>
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-brand-black"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-black"></div>
      </div>

      <div className="z-10 w-full flex flex-col items-center gap-16 mt-20 md:mt-24 max-w-6xl">
        <MindDump />
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
                <NeuralMap thoughts={thoughts} patterns={patterns} />
                <Suspense fallback={<InsightStream patterns={[]} loading={true} />}>
                    <RecentPatterns />
                </Suspense>
            </div>
            
            <div className="lg:col-span-4 space-y-8">
                <CognitiveLoad loadData={loadData} />
                
                {/* Quick Stats / Brain Power Card */}
                <div className="border border-black/5 bg-white/50 backdrop-blur-sm p-8 rounded-[2rem] space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-amber-500" />
                            <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">Synaptic Density</span>
                        </div>
                        <span className="font-display text-xl font-bold">{(thoughts.length * 1.2).toFixed(1)}<span className="text-xs font-normal opacity-30 ml-1">THz</span></span>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between font-mono text-[9px] uppercase text-black/40">
                            <span>Knowledge Retention</span>
                            <span>84%</span>
                        </div>
                        <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                            <div className="w-[84%] h-full bg-black" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
           <Link 
             href="/recall"
             className="pointer-events-auto group flex items-center gap-3 px-6 py-3 bg-black text-white font-display text-sm uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all shadow-2xl"
           >
             <span>Neural Review Pending ({pendingCount})</span>
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      )}

      <footer className="absolute bottom-8 right-8 text-[10px] text-brand-black/20 font-mono uppercase hidden md:block">
        Neural Handshake Verified • Praxis AI
      </footer>
    </main>
  )
}