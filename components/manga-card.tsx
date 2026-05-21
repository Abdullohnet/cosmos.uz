'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Eye, BookOpen, Flame, Sparkles, Crown, Heart, Info, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Manga } from '@/lib/store'
import { useMangaStore } from '@/lib/store'
import { useToast } from './toast'

interface MangaCardProps {
  manga: Manga
  variant?: 'default' | 'large' | 'compact' | 'featured'
  rank?: number
  showRank?: boolean
  onQuickView?: () => void
}

export function MangaCard({ manga, variant = 'default', rank, showRank = false, onQuickView }: MangaCardProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useMangaStore()
  const { show } = useToast()

  const fmt = (v: number) =>
    v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toString()

  const isFav = favorites.includes(manga.id)

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (isFav) { removeFromFavorites(manga.id); show('Sevimlilardan olib tashlandi', 'info') }
    else { addToFavorites(manga.id); show(`${manga.title} qo'shildi! ❤️`, 'success') }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    onQuickView?.()
  }

  // ── Featured ──
  if (variant === 'featured') {
    return (
      <Link href={`/manga/${manga.id}`}>
        <motion.div className="relative group rounded-xl overflow-hidden aspect-[3/4] cursor-pointer"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div className="absolute inset-0">
            <img src={manga.cover} alt={manga.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {manga.isHot && (
              <motion.div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/90 text-white text-[9px] font-bold"
                initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Flame className="w-2.5 h-2.5" />HOT
              </motion.div>
            )}
            {manga.isNew && (
              <motion.div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/90 text-white text-[9px] font-bold"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
                <Sparkles className="w-2.5 h-2.5" />YANGI
              </motion.div>
            )}
            {manga.isPremium && (
              <motion.div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-500/90 text-black text-[9px] font-bold"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                <Crown className="w-2.5 h-2.5" />PRO
              </motion.div>
            )}
          </div>
          {showRank && rank && (
            <div className="absolute top-2 right-2">
              <motion.div className={cn('w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px]',
                rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                rank > 3 && 'bg-secondary/80 text-foreground')}
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                #{rank}
              </motion.div>
            </div>
          )}
          {/* Hover actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onQuickView && (
              <motion.button onClick={handleQuickView} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-colors">
                <Info className="w-3 h-3 text-foreground" />
              </motion.button>
            )}
            <motion.button onClick={toggleFav} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              className={cn('p-1.5 rounded-lg bg-background/80 backdrop-blur-sm transition-colors',
                isFav ? 'text-red-400' : 'hover:bg-red-500/20')}>
              <Heart className={cn('w-3 h-3', isFav && 'fill-current')} />
            </motion.button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 mb-1">{manga.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" /><span>{manga.rating}</span></div>
              <div className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /><span>{fmt(manga.views)}</span></div>
              <div className="flex items-center gap-0.5"><BookOpen className="w-2.5 h-2.5" /><span>{manga.chapters}</span></div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  // ── Large ──
  if (variant === 'large') {
    return (
      <Link href={`/manga/${manga.id}`}>
        <motion.div className="relative group rounded-xl overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="flex gap-3 p-3 glass rounded-xl border border-border/20 hover:border-border/50 transition-colors">
            <div className="relative flex-shrink-0 w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden">
              <img src={manga.cover} alt={manga.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              {showRank && rank && (
                <div className="absolute top-1.5 left-1.5">
                  <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center font-black text-[9px]',
                    rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                    rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                    rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                    rank > 3 && 'bg-secondary/80 text-foreground')}>
                    #{rank}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 py-0.5">
              <div className="flex items-center gap-1.5 mb-1">
                {manga.isHot && <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[8px] font-bold"><Flame className="w-2 h-2" />HOT</span>}
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-bold">{manga.type.toUpperCase()}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">{manga.title}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mb-2">{manga.description}</p>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-muted-foreground">
                <div className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" /><span>{manga.rating}</span></div>
                <div className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /><span>{fmt(manga.views)}</span></div>
                <div className="flex items-center gap-0.5"><BookOpen className="w-2.5 h-2.5" /><span>{manga.chapters} bob</span></div>
              </div>
            </div>
            {/* Quick actions */}
            <div className="flex flex-col gap-1.5 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {onQuickView && (
                <motion.button onClick={handleQuickView} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-xl hover:bg-secondary/60 transition-colors">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </motion.button>
              )}
              <motion.button onClick={toggleFav} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className={cn('p-1.5 rounded-xl transition-colors', isFav ? 'text-red-400' : 'hover:bg-secondary/60 text-muted-foreground')}>
                <Heart className={cn('w-3.5 h-3.5', isFav && 'fill-current')} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  // ── Compact ──
  if (variant === 'compact') {
    return (
      <Link href={`/manga/${manga.id}`}>
        <motion.div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer group"
          whileHover={{ x: 4 }}>
          {showRank && rank && (
            <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center font-black text-[9px] flex-shrink-0',
              rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
              rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
              rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
              rank > 3 && 'bg-secondary text-muted-foreground')}>
              {rank}
            </div>
          )}
          <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <img src={manga.cover} alt={manga.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{manga.title}</h4>
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground mt-0.5">
              <span className="flex items-center gap-0.5"><Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />{manga.rating}</span>
              <span>{manga.chapters} bob</span>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  // ── Default ──
  return (
    <Link href={`/manga/${manga.id}`}>
      <motion.div className="relative group rounded-lg overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        style={{ transformOrigin: 'bottom center' }}>
        {/* Glow */}
        <motion.div className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{ background: 'linear-gradient(135deg, oklch(0.7 0.2 280 / 0.3), oklch(0.65 0.25 260 / 0.3))', filter: 'blur(4px)' }} />

        <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
          <img src={manga.cover} alt={manga.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-1 left-1 flex flex-col gap-0.5">
            {manga.isHot && <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-orange-500/90 text-white text-[7px] font-bold"><Flame className="w-2 h-2" />HOT</span>}
            {manga.isNew && <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-primary/90 text-white text-[7px] font-bold"><Sparkles className="w-2 h-2" />YANGI</span>}
          </div>

          {showRank && rank && (
            <div className="absolute top-1 right-1">
              <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center font-black text-[8px]',
                rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                rank > 3 && 'bg-secondary/80 text-foreground')}>
                #{rank}
              </div>
            </div>
          )}

          {/* Hover quick actions */}
          <motion.div className="absolute bottom-1.5 inset-x-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onQuickView && (
              <motion.button onClick={handleQuickView} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-background/85 backdrop-blur-sm hover:bg-primary/30 transition-colors">
                <Info className="w-3 h-3" />
                <span className="text-[9px] font-semibold">Ko'rish</span>
              </motion.button>
            )}
            <motion.button onClick={toggleFav} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className={cn('p-1.5 rounded-lg bg-background/85 backdrop-blur-sm transition-colors',
                isFav ? 'text-red-400' : 'hover:bg-red-500/20')}>
              <Heart className={cn('w-3 h-3', isFav && 'fill-current')} />
            </motion.button>
          </motion.div>
        </div>

        <div className="pt-1.5">
          <h3 className="text-[10px] sm:text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{manga.title}</h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-[8px] sm:text-[9px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-400 fill-yellow-400" />{manga.rating}</span>
            <span>{manga.latestChapter}-bob</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

interface MangaCarouselProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  mangas: Manga[]
  variant?: 'default' | 'large' | 'featured'
  showRank?: boolean
  seeAllLink?: string
  onQuickView?: (manga: Manga) => void
}

export function MangaCarousel({ title, subtitle, icon, mangas, variant = 'default', showRank = false, seeAllLink, onQuickView }: MangaCarouselProps) {
  return (
    <section className="py-3 sm:py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <div className="p-1.5 rounded-lg bg-secondary/50">{icon}</div>}
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {seeAllLink && (
          <Link href={seeAllLink} className="text-[10px] sm:text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-0.5">
            Hammasi <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 no-scrollbar">
          {mangas.map((manga, i) => (
            <motion.div key={manga.id}
              className={cn('flex-shrink-0',
                variant === 'featured' && 'w-40 sm:w-52',
                variant === 'large' && 'w-64 sm:w-72',
                variant === 'default' && 'w-24 sm:w-32')}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <MangaCard manga={manga} variant={variant}
                rank={showRank ? i + 1 : undefined} showRank={showRank}
                onQuickView={onQuickView ? () => onQuickView(manga) : undefined} />
            </motion.div>
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-3 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-3 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
