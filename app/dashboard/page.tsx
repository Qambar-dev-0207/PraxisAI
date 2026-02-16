import MindDump from '../components/MindDump'
import InsightStream from '../components/InsightStream'
import { getPendingCount, getRecentPatterns } from '../actions'
import Link from 'next/link'
import { ArrowRight, Terminal, LogOut } from 'lucide-react'
import { auth } from '@/auth'
import { logout } from '@/app/lib/auth-actions'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const session = await auth()
  const pendingCount = await getPendingCount()
  const recentPatterns = await getRecentPatterns()

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

      <div className="z-10 w-full flex flex-col items-center gap-12 mt-20 md:mt-0">
        <MindDump />
        <InsightStream patterns={recentPatterns} />
      </div>

      {pendingCount > 0 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
           <Link 
             href="/recall"
             className="pointer-events-auto group flex items-center gap-3 px-6 py-3 bg-brand-black text-brand-white font-display text-sm uppercase tracking-[0.2em] hover:bg-brand-gray transition-colors shadow-lg"
           >
             <span>Review Pending ({pendingCount})</span>
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      )}

      <footer className="absolute bottom-8 right-8 text-[10px] text-brand-black/20 font-mono uppercase hidden md:block">
        System Active • V 1.0.0
      </footer>
    </main>
  )
}