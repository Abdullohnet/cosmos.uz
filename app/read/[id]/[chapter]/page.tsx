'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, Settings, X, Home, List,
  ZoomIn, ZoomOut, Sun, Moon, Maximize, Minimize,
  ArrowUp, ArrowDown, Heart, MessageCircle, Share2,
  BookOpen, ChevronDown, Play, Sparkles, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore, useMangaStore, useUserStore } from '@/lib/store'
import type { Manga } from '@/lib/store'
import { apiGetManga } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function ReaderPage() {
  const params = useParams()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [showUI, setShowUI] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [showChapterList, setShowChapterList] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { readerMode, readerTheme, brightness, setReaderMode, setReaderTheme, setBrightness } = useUIStore()
  const { updateProgress } = useMangaStore()
  const { gainXP, isAuthenticated } = useUserStore()

  const [manga, setManga] = useState<Manga | null>(null)
  const chapterNumber = parseInt(params.chapter as string) || 1

  useEffect(() => {
    if (!params.id) return
    apiGetManga(params.id as string)
      .then(({ manga }) => setManga(manga))
      .catch(() => {})
  }, [params.id])

  const pages = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    url: `https://images.unsplash.com/photo-${1612178537253 + i * 1000}-bccd437b730e?w=800&h=1200&fit=crop`,
  }))

  const totalChapters = manga?.chapters ?? 999
  const hasPrevChapter = chapterNumber > 1
  const hasNextChapter = chapterNumber < totalChapters

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setScrollProgress(total > 0 ? Math.round((scrolled / total) * 100) : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && readerMode === 'horizontal') {
        setCurrentPage(prev => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight' && readerMode === 'horizontal') {
        setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))
      } else if (e.key === 'Escape') {
        setShowSettings(false); setShowChapterList(false)
      } else if (e.key === 'f') {
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [readerMode, pages.length])

  useEffect(() => {
    if (!manga) return
    updateProgress(manga.id, chapterNumber)
    if (isAuthenticated) gainXP(5)
  }, [chapterNumber, manga?.id, updateProgress, gainXP, isAuthenticated])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleMouseMove = () => {
      setShowUI(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowUI(false), 3500)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => { window.removeEventListener('mousemove', handleMouseMove); clearTimeout(timeout) }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const goToChapter = (chapter: number) => {
    if (!manga) return
    router.push(`/read/${manga.id}/${chapter}`)
    setShowChapterList(false)
    window.scrollTo({ top: 0 })
  }

  const readerThemes = {
    default: 'bg-background',
    sepia: 'bg-amber-50 dark:bg-amber-950',
    night: 'bg-zinc-950',
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div
      className={cn('min-h-screen relative', readerThemes[readerTheme])}
      style={{ filter: `brightness(${brightness}%)` }}
    >
      {/* ── Reading progress bar (top) ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-secondary/30">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent to-indigo-500"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* ── Top Bar ── */}
      <AnimatePresence>
        {showUI && (
          <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0.5 left-0 right-0 z-50 glass-strong border-b border-border/30"
          >
            <div className="container mx-auto px-4 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/manga/${manga.id}`}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                      <X className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <div className="hidden sm:block">
                    <h1 className="font-semibold text-sm leading-tight line-clamp-1">{manga.title}</h1>
                    <p className="text-xs text-muted-foreground">{chapterNumber}-bob • {scrollProgress}% o'qildi</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChapterList(!showChapterList)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-secondary/60 text-sm transition-colors">
                    <List className="w-4 h-4" />
                    {chapterNumber}/{totalChapters}
                    <ChevronDown className="w-3 h-3" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                    <Settings className="w-5 h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </motion.button>
                  <Link href="/">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                      <Home className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Settings Panel ── */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSettings(false)} />
            <motion.div
              initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 glass-strong border-l border-border/40 p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold">O'qish sozlamalari</h2>
                <button onClick={() => setShowSettings(false)} className="p-1.5 rounded-lg hover:bg-secondary/60">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">O'qish rejimi</h3>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { mode: 'webtoon', icon: ArrowDown, label: 'Webtoon' },
                    { mode: 'vertical', icon: ArrowDown, label: 'Vertikal' },
                    { mode: 'horizontal', icon: ChevronRight, label: 'Gorizontal' },
                  ] as const).map(({ mode, icon: Icon, label }) => (
                    <button key={mode} onClick={() => setReaderMode(mode)}
                      className={cn('p-2.5 rounded-xl border-2 transition-all text-center',
                        readerMode === mode ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40')}>
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[10px]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Mavzu</h3>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { theme: 'default', icon: Sun, label: 'Oddiy' },
                    { theme: 'sepia', icon: BookOpen, label: 'Sepia' },
                    { theme: 'night', icon: Moon, label: 'Tun' },
                  ] as const).map(({ theme, icon: Icon, label }) => (
                    <button key={theme} onClick={() => setReaderTheme(theme)}
                      className={cn('p-2.5 rounded-xl border-2 transition-all text-center',
                        readerTheme === theme ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40')}>
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[10px]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Yorqinlik: {brightness}%
                </h3>
                <input type="range" min="50" max="150" value={brightness}
                  onChange={e => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-primary" />
              </div>

              {readerMode === 'horizontal' && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                    Zoom: {zoom}%
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setZoom(p => Math.max(50, p - 10))}
                      className="p-1.5 rounded-lg border border-border/50 hover:bg-secondary">
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input type="range" min="50" max="200" value={zoom}
                      onChange={e => setZoom(parseInt(e.target.value))} className="flex-1 accent-primary" />
                    <button onClick={() => setZoom(p => Math.min(200, p + 10))}
                      className="p-1.5 rounded-lg border border-border/50 hover:bg-secondary">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-secondary/30">
                <h3 className="text-xs font-semibold mb-2">Klaviatura</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>← → : Betlar o'tish</p>
                  <p>F : To'liq ekran</p>
                  <p>Esc : Yopish</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Chapter List ── */}
      <AnimatePresence>
        {showChapterList && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowChapterList(false)} />
            <motion.div
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm glass-strong rounded-2xl shadow-2xl overflow-hidden border border-border/40">
              <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                <h3 className="font-bold text-sm">Boblar ro'yxati</h3>
                <span className="text-xs text-muted-foreground">{totalChapters} ta bob</span>
              </div>
              <div className="overflow-y-auto max-h-72">
                {Array.from({ length: Math.min(totalChapters, 30) }, (_, i) => totalChapters - i).map(ch => (
                  <button key={ch} onClick={() => goToChapter(ch)}
                    className={cn('w-full px-4 py-2.5 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between text-sm',
                      ch === chapterNumber && 'bg-primary/10 text-primary')}>
                    <span>{ch}-bob</span>
                    {ch === chapterNumber && (
                      <span className="flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        <Check className="w-2.5 h-2.5" />Joriy
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Reader Content ── */}
      <main className="pt-12 pb-4">
        {readerMode === 'webtoon' || readerMode === 'vertical' ? (
          <div ref={scrollRef} className="max-w-2xl mx-auto px-1 sm:px-2">
            {pages.map((page, index) => (
              <motion.div key={page.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="relative mb-0.5">
                <img src={page.url} alt={`Bet ${index + 1}`} className="w-full h-auto" loading="lazy" />
              </motion.div>
            ))}

            {/* ══ END OF CHAPTER BANNER ══ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="my-6 mx-2"
            >
              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/40">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-muted-foreground font-medium">{chapterNumber}-bob tugadi</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>

              {/* Manga info card */}
              <div className="glass rounded-2xl overflow-hidden border border-border/30 mb-4">
                <div className="flex gap-4 p-4">
                  <img src={manga.cover} alt={manga.title}
                    className="w-16 h-22 rounded-xl object-cover flex-shrink-0 shadow-lg"
                    style={{ height: '88px' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary font-semibold mb-0.5">{manga.title}</p>
                    <p className="text-sm font-bold mb-1">{chapterNumber}-bob o'qildi</p>
                    <p className="text-xs text-muted-foreground">
                      {hasNextChapter
                        ? `${chapterNumber + 1}-bob tayyor!`
                        : 'Bu so\'nggi bob. Yangi bob tez orada!'}
                    </p>
                  </div>
                </div>

                {/* Big Next Chapter button */}
                {hasNextChapter ? (
                  <motion.button
                    onClick={() => goToChapter(chapterNumber + 1)}
                    className="w-full py-4 bg-gradient-to-r from-primary via-accent to-indigo-500 text-white font-bold text-base flex items-center justify-center gap-3 relative overflow-hidden"
                    whileHover={{ brightness: 1.1 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <Play className="w-5 h-5 fill-current relative z-10" />
                    <span className="relative z-10">{chapterNumber + 1}-bobni o'qish</span>
                    <ChevronRight className="w-5 h-5 relative z-10" />
                  </motion.button>
                ) : (
                  <div className="w-full py-4 bg-secondary/50 text-muted-foreground font-medium text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Yangi bob tez orada...
                  </div>
                )}
              </div>

              {/* Prev / Manga page quick nav */}
              <div className="grid grid-cols-2 gap-3">
                {hasPrevChapter && (
                  <motion.button
                    onClick={() => goToChapter(chapterNumber - 1)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    {chapterNumber - 1}-bob
                  </motion.button>
                )}
                <Link href={`/manga/${manga.id}`} className={hasPrevChapter ? '' : 'col-span-2'}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors text-sm font-medium">
                    <BookOpen className="w-4 h-4" />
                    Manga sahifasi
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

        ) : (
          // Horizontal Mode
          <div className="h-[calc(100vh-7rem)] flex items-center justify-center px-4">
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
              <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                disabled={currentPage === 0} />
              <button onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                disabled={currentPage === pages.length - 1} />
              <AnimatePresence mode="wait">
                <motion.img key={currentPage} src={pages[currentPage].url}
                  alt={`Bet ${currentPage + 1}`}
                  className="max-h-full max-w-full object-contain"
                  style={{ transform: `scale(${zoom / 100})` }}
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }} />
              </AnimatePresence>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass text-sm font-medium">
                {currentPage + 1} / {pages.length}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Fixed side navigation (always visible on desktop) ── */}
      <AnimatePresence>
        {hasPrevChapter && (
          <motion.button
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            onClick={() => goToChapter(chapterNumber - 1)}
            whileHover={{ scale: 1.05, x: 4 }} whileTap={{ scale: 0.95 }}
            className="fixed left-3 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-1.5 p-3 rounded-2xl glass-strong border border-border/40 hover:border-border/80 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-[9px] text-muted-foreground writing-mode-vertical"
              style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
              {chapterNumber - 1}-bob
            </span>
          </motion.button>
        )}
        {hasNextChapter && (
          <motion.button
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onClick={() => goToChapter(chapterNumber + 1)}
            whileHover={{ scale: 1.05, x: -4 }} whileTap={{ scale: 0.95 }}
            className="fixed right-3 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-b from-primary/20 to-accent/20 border border-primary/40 hover:border-primary/70 transition-colors group glow-primary"
          >
            <ChevronRight className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
            <span className="text-[9px] text-primary font-semibold"
              style={{ writingMode: 'vertical-lr' }}>
              {chapterNumber + 1}-bob
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Bottom Bar ── */}
      <AnimatePresence>
        {showUI && (
          <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/30"
          >
            {/* Chapter scroll progress */}
            {(readerMode === 'webtoon' || readerMode === 'vertical') && (
              <div className="h-0.5 bg-secondary/50">
                <motion.div className="h-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${scrollProgress}%` }} transition={{ duration: 0.1 }} />
              </div>
            )}

            <div className="container mx-auto px-3 py-2">
              <div className="flex items-center gap-2">
                {/* Prev chapter */}
                <motion.button
                  onClick={() => hasPrevChapter && goToChapter(chapterNumber - 1)}
                  whileHover={hasPrevChapter ? { scale: 1.03 } : {}}
                  whileTap={hasPrevChapter ? { scale: 0.97 } : {}}
                  disabled={!hasPrevChapter}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors border',
                    hasPrevChapter
                      ? 'border-border/50 hover:bg-secondary/60 text-foreground'
                      : 'border-transparent text-muted-foreground/40 cursor-not-allowed'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{chapterNumber - 1}-bob</span>
                </motion.button>

                {/* Center actions */}
                <div className="flex items-center gap-1 flex-1 justify-center">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl hover:bg-secondary/60 transition-colors">
                    <Heart className="w-4 h-4" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setShowChapterList(true)}
                    className="px-3 py-1.5 rounded-xl hover:bg-secondary/60 transition-colors text-xs font-medium flex items-center gap-1">
                    <List className="w-3.5 h-3.5" />
                    {chapterNumber}/{totalChapters}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl hover:bg-secondary/60 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Next chapter — BIG prominent button */}
                <motion.button
                  onClick={() => hasNextChapter && goToChapter(chapterNumber + 1)}
                  whileHover={hasNextChapter ? { scale: 1.04 } : {}}
                  whileTap={hasNextChapter ? { scale: 0.96 } : {}}
                  disabled={!hasNextChapter}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative overflow-hidden',
                    hasNextChapter
                      ? 'bg-gradient-to-r from-primary to-accent text-white glow-primary shadow-lg'
                      : 'bg-secondary/30 text-muted-foreground/40 cursor-not-allowed'
                  )}
                >
                  {hasNextChapter && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    />
                  )}
                  <span className="relative z-10 hidden sm:inline">{chapterNumber + 1}-bob</span>
                  <ChevronRight className="w-4 h-4 relative z-10" />
                </motion.button>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}
