import { getAllThoughts } from '../actions'
import ThoughtsClient from './ThoughtsClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/auth'
import { logout } from '@/app/lib/auth-actions'
import { LogOut } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ThoughtsPage() {
  const [session, thoughts] = await Promise.all([
    auth(),
    getAllThoughts(200),
  ])

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-black/5 px-6 py-4 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
          <div className="w-px h-4 bg-black/10" />
          <span className="font-display text-lg uppercase tracking-widest">Memory Archive</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-black/30 uppercase hidden sm:block">
            {thoughts.length} thoughts
          </span>
          <form action={logout}>
            <button type="submit" className="flex items-center gap-2 px-3 py-1.5 border border-black/10 hover:border-black transition-all font-mono text-[9px] uppercase tracking-widest rounded-lg">
              <LogOut className="w-3 h-3" />
            </button>
          </form>
        </div>
      </header>

      <div className="pt-24 pb-16 max-w-5xl mx-auto px-6">
        <ThoughtsClient thoughts={thoughts} userName={session?.user?.name ?? ''} />
      </div>
    </main>
  )
}
