'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, X, ChevronRight, Play } from 'lucide-react'
import { useMangaStore, mockMangas } from '@/lib/store'
import { usePathname } from 'next/navigation'

export function ContinueReadingWidget() {
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)
  const { readingHistory, readingProgress } = useMangaStore()
  const pathname = usePathname()

  // Hide on reader, login, apply pages
  const hideOn = ['/read/', '/login', '/apply']
  const shouldHide = hideOn.some(p => pathname.includes(p))

  useEffect(() => {
    if (shouldHide || readingHistory.length === 0 || dismissed) return
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [shouldHide, readingHistory.length, dismissed])

  if (shouldHide || readingHistory.length === 0 || dismissed) return null

  const lastRead = readingHistory[0]
  const manga = mockMangas.find(m => m.id === lastRead.mangaId)
  if (!manga) return null

  const progress = readingProgress[manga.id] || 1
  const progressPercent = Math.min(Math.round((progress / manga.chapters) * 100), 100)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 80, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-20 lg:bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="glass-strong border border-primary/30 rounded-2xl p-3 shadow-2xl overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <div className="relative flex items-center gap-3">
              {/* Cover */}
              <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src={manga.cover} alt={manga.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-0.5">
                  Davom ettirish
                </p>
                <h4 className="text-sm font-bold truncate">{manga.title}</h4>
                <p className="text-xs text-muted-foreground">{progress}-bob</p>

                {/* Progress bar */}
                <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5">{progressPercent}% o'qildi</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <Link href={`/read/${manga.id}/${progress}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-white glow-primary">
                    <Play className="w-4 h-4 fill-current" />
                  </motion.button>
                </Link>
                <motion.button
                  onClick={() => { setDismissed(true); setVisible(false) }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl border border-border/50 hover:bg-secondary/60 transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
