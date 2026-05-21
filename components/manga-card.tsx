'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Eye, BookOpen, Flame, Sparkles, Crown, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Manga } from '@/lib/store'

interface MangaCardProps {
  manga: Manga
  variant?: 'default' | 'large' | 'compact' | 'featured'
  rank?: number
  showRank?: boolean
}

export function MangaCard({ manga, variant = 'default', rank, showRank = false }: MangaCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  if (variant === 'featured') {
    return (
      <Link href={`/manga/${manga.id}`}>
        <motion.div
          className="relative group rounded-xl overflow-hidden aspect-[3/4] cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={manga.cover}
              alt={manga.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {manga.isHot && (
              <motion.div
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/90 text-white text-[9px] font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Flame className="w-2.5 h-2.5" />
                HOT
              </motion.div>
            )}
            {manga.isNew && (
              <motion.div
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-[9px] font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-2.5 h-2.5" />
                YANGI
              </motion.div>
            )}
            {manga.isPremium && (
              <motion.div
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-500/90 text-black text-[9px] font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Crown className="w-2.5 h-2.5" />
                PREMIUM
              </motion.div>
            )}
          </div>

          {/* Rank Badge */}
          {showRank && rank && (
            <div className="absolute top-2 right-2">
              <motion.div
                className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px]',
                  rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                  rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                  rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                  rank > 3 && 'bg-secondary/80 text-foreground'
                )}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                #{rank}
              </motion.div>
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-medium">
                {manga.type.toUpperCase()}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-secondary/50 text-[8px]">
                {manga.genres[0]}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 mb-1">{manga.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                <span>{manga.rating}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Eye className="w-2.5 h-2.5" />
                <span>{formatViews(manga.views)}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <BookOpen className="w-2.5 h-2.5" />
                <span>{manga.chapters}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (variant === 'large') {
    return (
      <Link href={`/manga/${manga.id}`}>
        <motion.div
          className="relative group rounded-xl overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex gap-3 p-3 glass rounded-xl">
            {/* Cover */}
            <div className="relative flex-shrink-0 w-20 sm:w-24 aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={manga.cover}
                alt={manga.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {showRank && rank && (
                <div className="absolute top-1.5 left-1.5">
                  <div
                    className={cn(
                      'w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]',
                      rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                      rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                      rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                      rank > 3 && 'bg-secondary/80 text-foreground'
                    )}
                  >
                    #{rank}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5">
              <div className="flex items-center gap-1.5 mb-1">
                {manga.isHot && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[8px] font-medium">
                    <Flame className="w-2 h-2" />
                    HOT
                  </span>
                )}
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-medium">
                  {manga.type.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1 mb-0.5">{manga.title}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mb-2">{manga.description}</p>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  <span>{manga.rating}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Eye className="w-2.5 h-2.5" />
                  <span>{formatViews(manga.views)}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <BookOpen className="w-2.5 h-2.5" />
                  <span>{manga.chapters} bob</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {manga.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="px-1.5 py-0.5 rounded-full bg-secondary/50 text-[8px] text-muted-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/manga/${manga.id}`}>
        <motion.div
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer group"
          whileHover={{ x: 4 }}
        >
          {showRank && rank && (
            <div
              className={cn(
                'w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] flex-shrink-0',
                rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                rank > 3 && 'bg-secondary text-muted-foreground'
              )}
            >
              {rank}
            </div>
          )}
          <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0">
            <img
              src={manga.cover}
              alt={manga.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-medium text-foreground line-clamp-1">{manga.title}</h4>
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground mt-0.5">
              <span className="flex items-center gap-0.5">
                <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                {manga.rating}
              </span>
              <span>{manga.chapters} bob</span>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  // Default card - mobil uchun optimallashtirilgan
  return (
    <Link href={`/manga/${manga.id}`}>
      <motion.div
        className="relative group rounded-lg overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.04, y: -4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        style={{ transformOrigin: 'bottom center' }}
      >
        {/* Card glow on hover */}
        <motion.div
          className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{ background: 'linear-gradient(135deg, oklch(0.7 0.2 280 / 0.3), oklch(0.65 0.25 260 / 0.3))', filter: 'blur(4px)' }}
        />

        {/* Cover */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Badges */}
          <div className="absolute top-1 left-1 flex flex-col gap-0.5">
            {manga.isHot && (
              <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-orange-500/90 text-white text-[7px] font-medium">
                <Flame className="w-2 h-2" />
                HOT
              </span>
            )}
            {manga.isNew && (
              <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-primary/90 text-primary-foreground text-[7px] font-medium">
                <Sparkles className="w-2 h-2" />
                YANGI
              </span>
            )}
          </div>

          {/* Rank */}
          {showRank && rank && (
            <div className="absolute top-1 right-1">
              <div
                className={cn(
                  'w-5 h-5 rounded flex items-center justify-center font-bold text-[8px]',
                  rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                  rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                  rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                  rank > 3 && 'bg-secondary/80 text-foreground'
                )}
              >
                #{rank}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <motion.div
            className="absolute bottom-1.5 right-1.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ y: 10 }}
            whileHover={{ y: 0 }}
          >
            <motion.button
              className="p-1 rounded bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <Heart className="w-3 h-3 text-foreground" />
            </motion.button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="pt-1.5">
          <h3 className="text-[10px] sm:text-xs font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {manga.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-[8px] sm:text-[9px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-400 fill-yellow-400" />
              {manga.rating}
            </span>
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
}

export function MangaCarousel({
  title,
  subtitle,
  icon,
  mangas,
  variant = 'default',
  showRank = false,
  seeAllLink,
}: MangaCarouselProps) {
  return (
    <section className="py-4 sm:py-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          {icon && <div className="p-1.5 rounded-lg bg-secondary/50">{icon}</div>}
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {seeAllLink && (
          <Link
            href={seeAllLink}
            className="text-[10px] sm:text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Hammasi
          </Link>
        )}
      </div>
      
      <div className="relative">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 no-scrollbar">
          {mangas.map((manga, index) => (
            <motion.div
              key={manga.id}
              className={cn(
                'flex-shrink-0',
                variant === 'featured' && 'w-40 sm:w-52',
                variant === 'large' && 'w-64 sm:w-72',
                variant === 'default' && 'w-24 sm:w-32'
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MangaCard
                manga={manga}
                variant={variant}
                rank={showRank ? index + 1 : undefined}
                showRank={showRank}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-3 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-3 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
