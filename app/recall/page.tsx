import { getRecallItems } from '../actions'
import RecallSession from '../components/RecallSession'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RecallPage() {
  const items = await getRecallItems()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-brand-white relative text-brand-black">
      <Link 
        href="/dashboard" 
        className="absolute top-8 left-8 text-brand-gray hover:text-brand-black flex items-center gap-2 transition-colors font-mono text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Return
      </Link>

      {items.length > 0 ? (
        <RecallSession items={items} />
      ) : (
        <div className="text-center">
          <h2 className="text-4xl font-display text-brand-black mb-4">All Clear</h2>
          <p className="text-brand-gray mb-8 font-light tracking-wide">Your mind is up to date.</p>
          <Link 
            href="/dashboard"
            className="inline-block px-8 py-3 border border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-white transition-all font-display tracking-widest uppercase"
          >
            Continue
          </Link>
        </div>
      )}
    </main>
  )
}