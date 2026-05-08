import { getRecallItems } from '../actions'
import RecallSession from '../components/RecallSession'
import Link from 'next/link'
import { ArrowLeft, LogOut, Brain } from 'lucide-react'
import { logout } from '@/app/lib/auth-actions'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export default async function RecallPage() {
  const [session, items] = await Promise.all([
    auth(),
    getRecallItems(),
  ])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-brand-white relative text-brand-black">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-black/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="w-px h-4 bg-black/10" />
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-amber-500" />
            <span className="font-display text-base md:text-lg uppercase tracking-widest">Recall Session</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <span className="font-mono text-[9px] text-black/30 uppercase tracking-widest hidden sm:block">
              {items.length} pending
            </span>
          )}
          <span className="font-mono text-[9px] text-black/30 uppercase tracking-widest hidden md:block">
            {session?.user?.name}
          </span>
          <form action={logout}>
            <button type="submit" className="group flex items-center gap-1.5 px-3 py-1.5 border border-black/10 hover:border-black transition-all font-mono text-[9px] uppercase tracking-widest rounded-lg">
              <LogOut className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </header>

      {items.length > 0 ? (
        <RecallSession items={items} />
      ) : (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full border border-black/10 flex items-center justify-center mx-auto bg-black/[0.02]">
            <Brain className="w-10 h-10 text-black/15" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter text-brand-black">All Clear</h2>
            <p className="text-brand-gray font-mono text-[11px] uppercase tracking-widest">Your mind is fully up to date.</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-display tracking-widest uppercase hover:bg-amber-500 hover:text-black transition-all"
          >
            Continue
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      )}
    </main>
  )
}
