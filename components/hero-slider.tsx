'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Star, BookOpen, Eye, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Manga } from '@/lib/store'

interface HeroSliderProps {
  mangas: Manga[]
}

export function HeroSlider({ mangas }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  const featuredMangas = mangas.slice(0, 5)

  if (featuredMangas.length === 0) {
    return (
      <div className="relative w-full h-[40vh] sm:h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-8 h-8 text-primary/40" />
          </div>
          <p className="text-muted-foreground text-sm">Manga yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % featuredMangas.length)
    }, 6000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [featuredMangas.length])

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % featuredMangas.length)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + featuredMangas.length) % featuredMangas.length)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const currentManga = featuredMangas[currentIndex]

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  // O'zbek tiliga tarjima
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'ongoing': 'Davom etmoqda',
      'completed': 'Tugallangan',
      'hiatus': 'To\'xtatilgan',
    }
    return statusMap[status] || status
  }

  return (
    <section className="relative h-[55vh] min-h-[380px] max-h-[550px] overflow-hidden">
      {/* Background */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <img
              src={currentManga.cover}
              alt={currentManga.title}
              className="w-full h-full object-cover blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 h-full flex items-center">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-8 items-center w-full">
          {/* Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl"
            >
              {/* Badges */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                {currentManga.isHot && (
                  <motion.span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/90 text-white text-[10px] sm:text-xs font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Flame className="w-3 h-3" />
                    TRENDDA
                  </motion.span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] sm:text-xs font-medium">
                  {currentManga.type.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary/50 text-[10px] sm:text-xs">
                  {getStatusText(currentManga.status)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 line-clamp-2">
                {currentManga.title}
              </h1>

              {/* Stats */}
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 text-muted-foreground text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-foreground">{currentManga.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{formatViews(currentManga.views)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{currentManga.chapters} bob</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 mb-2 sm:mb-3">
                {currentManga.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-0.5 rounded-full bg-secondary/50 text-[10px] sm:text-xs text-muted-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm">
                {currentManga.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href={`/read/${currentManga.id}/1`}>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary px-4 sm:px-6 text-xs sm:text-sm"
                  >
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 fill-current" />
                    O&apos;qishni boshlash
                  </Button>
                </Link>
                <Link href={`/manga/${currentManga.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10 text-xs sm:text-sm"
                  >
                    Batafsil
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Cover */}
          <div className="flex justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="relative w-32 sm:w-40 lg:w-52 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl glow-primary">
                  <img
                    src={currentManga.cover}
                    alt={currentManga.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>
                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/20 blur-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-accent/20 blur-xl"
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-2 z-20 hidden sm:block">
        <motion.button
          onClick={prevSlide}
          className="p-2 rounded-full glass hover:bg-secondary/50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      </div>
      <div className="absolute bottom-1/2 translate-y-1/2 right-2 z-20 hidden sm:block">
        <motion.button
          onClick={nextSlide}
          className="p-2 rounded-full glass hover:bg-secondary/50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {featuredMangas.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/50 hover:bg-muted-foreground'
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </section>
  )
}
