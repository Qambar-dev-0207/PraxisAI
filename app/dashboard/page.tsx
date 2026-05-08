import MindDump from '../components/MindDump'
import InsightStream from '../components/InsightStream'
import CognitiveLoad from '../components/CognitiveLoad'
import NeuralMap from '../components/NeuralMap'
import { getPendingCount, getRecentPatterns, getMentalLoad, getNeuralMapData, getDashboardStats } from '../actions'
import Link from 'next/link'
import { ArrowRight, Terminal, LogOut, Archive, Flame, Brain } from 'lucide-react'
import { auth } from '@/auth'
import { logout } from '@/app/lib/auth-actions'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function RecentPatterns() {
  const recentPatterns = await getRecentPatterns()
  return <InsightStream patterns={recentPatterns} />
}

export default async function Dashboard() {
  let session = null;
  let pendingCount = 0;
  let loadData = { load: 0, status: 'UNKNOWN', count: 0 };
  let thoughts: any[] = [];
  let patterns: any[] = [];
  let stats = null;

  try {
    const results = await Promise.all([
      auth(),
      getPendingCount(),
      getMentalLoad(),
      getNeuralMapData(),
      getDashboardStats(),
    ]);
    
    session = results[0];
    pendingCount = results[1] as number;
    loadData = results[2] as any;
    thoughts = (results[3] as any).thoughts;
    patterns = (results[3] as any).patterns;
    stats = results[4] as any;
  } catch (error) {
    console.error("Dashboard Data Fetch Failure:", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 relative overflow-hidden bg-brand-white text-brand-black font-sans selection:bg-brand-black selection:text-brand-white">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-black/5 px-5 py-3 md:px-10 md:py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex flex-col gap-0.5">
            <Link href="/" className="text-lg md:text-2xl font-display tracking-widest text-brand-black hover:text-brand-gray transition-colors uppercase">
              Praxis<span className="font-bold">AI</span>
            </Link>
            <div className="flex items-center gap-1.5 text-black/30">
              <Terminal className="w-2.5 h-2.5" />
              <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest truncate max-w-[100px] md:max-w-none">
                {session?.user?.name || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Quick nav */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            <Link href="/thoughts" className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-black/40 hover:text-black hover:bg-black/5 rounded-lg transition-all">
              <Archive className="w-3 h-3" />
              Archive
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak badge */}
          {stats && stats.streak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <Flame className="w-3 h-3 text-amber-600" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-700 font-bold">
                {stats.streak}d streak
              </span>
            </div>
          )}

          <Link
            href="/thoughts"
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 border border-black/10 hover:border-black/30 transition-all font-mono text-[9px] uppercase tracking-widest rounded-lg"
          >
            <Archive className="w-3 h-3" />
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-brand-black/10 hover:border-brand-black transition-all font-mono text-[8px] md:text-[10px] uppercase tracking-widest rounded-lg"
            >
              <span className="hidden sm:inline">Log Out</span>
              <LogOut className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </header>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-brand-black" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-brand-black" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-brand-black" />
      </div>

      <div className="z-10 w-full flex flex-col items-center gap-10 md:gap-14 mt-20 md:mt-24 max-w-6xl">

        {/* Mind Dump */}
        <MindDump />

        {/* Stats row */}
        {stats && (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard label="Total Thoughts" value={stats.totalThoughts} icon={<Brain className="w-4 h-4" />} />
            <StatCard label="Integrated" value={stats.archivedThoughts} icon={<Archive className="w-4 h-4" />} />
            <StatCard label="Avg Mastery" value={`${stats.avgMastery}%`} icon={<span className="text-[10px] font-bold">M</span>} highlight={stats.avgMastery > 60} />
            <StatCard label="Day Streak" value={stats.streak} icon={<Flame className="w-4 h-4" />} highlight={stats.streak > 2} amber={stats.streak > 0} />
          </div>
        )}

        {/* Main grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <NeuralMap thoughts={thoughts} patterns={patterns} />
            <Suspense fallback={<InsightStream patterns={[]} loading={true} />}>
              <RecentPatterns />
            </Suspense>
          </div>

          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <CognitiveLoad loadData={loadData} />

            {/* Archive quick link */}
            <Link
              href="/thoughts"
              className="group flex items-center justify-between p-5 md:p-6 border border-black/8 bg-white/60 hover:border-black/25 hover:bg-white transition-all rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/5 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                  <Archive className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-display uppercase tracking-widest text-sm">Memory Archive</span>
                  <span className="font-mono text-[9px] text-black/30 uppercase tracking-widest">
                    {(stats?.totalThoughts ?? 0) + (stats?.archivedThoughts ?? 0)} total thoughts
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>

      {/* Pending recall notification */}
      {pendingCount > 0 && (
        <div className="fixed bottom-6 md:bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
          <Link
            href="/recall"
            className="pointer-events-auto group flex items-center gap-3 px-5 py-2.5 md:px-6 md:py-3 bg-black text-white font-display text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all shadow-2xl rounded-full"
          >
            <Brain className="w-4 h-4 animate-pulse" />
            <span>{pendingCount} {pendingCount === 1 ? 'Memory' : 'Memories'} to Review</span>
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </main>
  )
}

function StatCard({
  label, value, icon, highlight, amber
}: {
  label: string; value: number | string; icon: React.ReactNode; highlight?: boolean; amber?: boolean
}) {
  return (
    <div className={`p-4 md:p-5 rounded-2xl border transition-all ${highlight ? amber ? 'bg-amber-500/8 border-amber-500/20' : 'bg-black/[0.03] border-black/10' : 'bg-white/60 border-black/8'}`}>
      <div className={`flex items-center gap-2 mb-2 ${amber && highlight ? 'text-amber-600' : 'text-black/30'}`}>
        {icon}
        <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <span className={`font-display text-2xl md:text-3xl font-bold tracking-tight ${amber && highlight ? 'text-amber-600' : 'text-black'}`}>
        {value}
      </span>
    </div>
  )
}
