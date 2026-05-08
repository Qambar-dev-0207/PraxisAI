'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Thought } from '../../lib/types'
import { Search, Trash2, Tag, Calendar, Brain, Filter } from 'lucide-react'
import { deleteThought } from '../actions'

const IMPORTANCE_LABELS: Record<string, { label: string; color: string }> = {
  TODAY: { label: 'Today', color: 'bg-red-100 text-red-700 border-red-200' },
  WEEK: { label: 'Week', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  LATER: { label: 'Later', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  NOT_IMPORTANT: { label: 'Archived', color: 'bg-black/5 text-black/40 border-black/10' },
}

interface ThoughtsClientProps {
  thoughts: Thought[]
  userName: string
}

export default function ThoughtsClient({ thoughts, userName }: ThoughtsClientProps) {
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterImportance, setFilterImportance] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    thoughts.forEach(t => t.tags?.forEach(tag => set.add(tag)))
    return Array.from(set).sort()
  }, [thoughts])

  const filtered = useMemo(() => {
    return thoughts.filter(t => {
      const matchSearch = !search || t.content.toLowerCase().includes(search.toLowerCase()) || t.processedContent?.toLowerCase().includes(search.toLowerCase())
      const matchTag = !filterTag || t.tags?.includes(filterTag)
      const matchImportance = !filterImportance || t.importance === filterImportance
      return matchSearch && matchTag && matchImportance
    })
  }, [thoughts, search, filterTag, filterImportance])

  const handleDelete = async (id: string) => {
    if (!id || deletingId) return
    setDeletingId(id)
    await deleteThought(id)
    setDeletingId(null)
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tighter">
          {userName ? `${userName}'s` : 'Your'} Archive
        </h1>
        <p className="font-mono text-[11px] text-black/40 uppercase tracking-widest">
          {thoughts.length} thoughts captured • {thoughts.filter(t => !t.isArchived).length} active
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search thoughts..."
            className="w-full pl-11 pr-4 py-3 bg-black/[0.03] border border-black/8 rounded-xl font-mono text-sm focus:outline-none focus:border-black/30 placeholder:text-black/20 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black text-lg leading-none">×</button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Importance filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-black/30" />
            {(['TODAY', 'WEEK', 'LATER', 'NOT_IMPORTANT'] as const).map(imp => (
              <button
                key={imp}
                onClick={() => setFilterImportance(filterImportance === imp ? null : imp)}
                className={`px-3 py-1.5 rounded-full border font-mono text-[9px] uppercase tracking-widest transition-all ${filterImportance === imp ? 'bg-black text-white border-black' : 'border-black/10 text-black/40 hover:border-black/30'}`}
              >
                {IMPORTANCE_LABELS[imp].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Tag className="w-3.5 h-3.5 text-black/30" />
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full border font-mono text-[9px] uppercase tracking-widest transition-all ${filterTag === tag ? 'bg-amber-500 text-black border-amber-500' : 'border-black/10 text-black/40 hover:border-amber-500/50 hover:text-amber-600'}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="font-mono text-[10px] text-black/30 uppercase tracking-widest">
        {filtered.length} of {thoughts.length} shown
      </div>

      {/* Thoughts grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <Brain className="w-10 h-10 text-black/10 mx-auto" />
          <p className="font-mono text-[11px] text-black/30 uppercase tracking-widest">No thoughts match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((thought, i) => (
              <ThoughtCard
                key={thought.id ?? i}
                thought={thought}
                onDelete={handleDelete}
                isDeleting={deletingId === thought.id}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function ThoughtCard({ thought, onDelete, isDeleting }: {
  thought: Thought
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  const imp = IMPORTANCE_LABELS[thought.importance] ?? IMPORTANCE_LABELS.NOT_IMPORTANT

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isDeleting ? 0.3 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group bg-white border border-black/8 rounded-2xl p-5 flex flex-col gap-3 hover:border-black/20 hover:shadow-md transition-all duration-200"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span className={`px-2.5 py-1 rounded-full border text-[8px] font-mono uppercase tracking-widest ${imp.color}`}>
          {imp.label}
        </span>
        <button
          onClick={() => thought.id && onDelete(thought.id)}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-black/20 transition-all disabled:cursor-not-allowed"
          title="Delete thought"
        >
          {isDeleting ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Content */}
      <p className="font-display uppercase tracking-tighter text-lg leading-tight line-clamp-3 text-black">
        {thought.processedContent || thought.content}
      </p>

      {thought.content !== thought.processedContent && (
        <p className="font-mono text-[10px] text-black/40 leading-relaxed line-clamp-2 italic">
          "{thought.content}"
        </p>
      )}

      {/* Tags */}
      {thought.tags && thought.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {thought.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-black/5 rounded-full font-mono text-[8px] uppercase tracking-widest text-black/50">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: mastery + date */}
      <div className="flex items-center justify-between pt-3 border-t border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-16 h-0.5 bg-black/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${thought.masteryScore ?? 0}%` }} />
          </div>
          <span className="font-mono text-[8px] text-black/30">{thought.masteryScore ?? 0}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-black/25">
          <Calendar className="w-3 h-3" />
          <span className="font-mono text-[8px]" suppressHydrationWarning>
            {new Date(thought.createdAt as any).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
