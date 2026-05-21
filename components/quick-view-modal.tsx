'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  X, Star, Eye, BookOpen, Heart, Play, Crown,
  Flame, Sparkles, Calendar, User, Brush, Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Manga } from '@/lib/store'
import { useMangaStore } from '@/lib/store'
import { useToast } from './toast'

interface QuickViewModalProps {
  manga: Manga | null
  onClose: () => void
}

const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString()

export function QuickViewModal({ manga, onClose }: QuickViewModalProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useMangaStore()
  const { show } = useToast()

  if (!manga) return null

  const isFav = favorites.includes(manga.id)

  const toggleFav = () => {
    if (isFav) {
      removeFromFavorites(manga.id)
      show('Sevimlilardan olib tashlandi', 'info')
    } else {
      addToFavorites(manga.id)
      show(`${manga.title} sevimlilarga qo'shildi! ❤️`, 'success')
    }
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    ongoing: { label: 'Davom etmoqda', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
    completed: { label: 'Tugallangan', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
    hiatus: { label: "To'xtatilgan", color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30' },
  }
  const status = statusMap[manga.status] || statusMap.ongoing

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[150] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* Backdrop */}
        <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

        {/* Modal */}
        <motion.div
          className="relative glass-strong border border-border/40 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}>

          {/* Blurred cover background */}
          <div className="absolute inset-0 overflow-hidden">
            <img src={manga.cover} alt="" className="w-full h-full object-cover blur-2xl scale-110 opacity-20" />
          </div>

          {/* Close */}
          <motion.button onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-xl bg-background/60 border border-border/40 hover:bg-secondary/80 transition-colors">
            <X className="w-4 h-4" />
          </motion.button>

          <div className="relative p-5">
            <div className="flex gap-4">
              {/* Cover */}
              <div className="relative flex-shrink-0 w-28 aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
                <img src={manga.cover} alt={manga.title} className="w-full h-full object-cover" />
                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                  {manga.isHot && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/90 text-white text-[8px] font-bold">
                      <Flame className="w-2 h-2" />HOT
                    </span>
                  )}
                  {manga.isPremium && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-500/90 text-black text-[8px] font-bold">
                      <Crown className="w-2 h-2" />PRO
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[10px] font-bold">
                    {manga.type.toUpperCase()}
                  </span>
                  <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold border', status.color)}>
                    {status.label}
                  </span>
                </div>
                <h2 className="font-black text-lg leading-tight mb-2">{manga.title}</h2>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-foreground font-bold">{manga.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{fmt(manga.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{manga.chapters} bob</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-3 h-3 flex-shrink-0" />
                    <span>{manga.author}</span>
                  </div>
                  {manga.translatorName && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Brush className="w-3 h-3 flex-shrink-0" />
                      <span className="text-primary font-medium">{manga.translatorName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed line-clamp-3">{manga.description}</p>

            {/* Genres & Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {manga.genres.map(g => (
                <span key={g} className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">{g}</span>
              ))}
              {manga.tags.slice(0, 3).map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">#{t}</span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-4">
              <Link href={`/read/${manga.id}/1`} className="flex-1">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm glow-primary">
                  <Play className="w-4 h-4 fill-current" />
                  O'qishni boshlash
                </motion.button>
              </Link>
              <motion.button onClick={toggleFav} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                className={cn('p-2.5 rounded-xl border transition-colors',
                  isFav ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'border-border/50 hover:bg-secondary/60')}>
                <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
              </motion.button>
              <Link href={`/manga/${manga.id}`}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl border border-border/50 hover:bg-secondary/60 transition-colors text-xs font-medium px-3">
                  Batafsil
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
