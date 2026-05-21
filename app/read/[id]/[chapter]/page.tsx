'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ChevronLeft, ChevronRight, Settings, X, Home, List,
  ZoomIn, ZoomOut, Sun, Moon, Maximize, Minimize,
  ArrowUp, ArrowDown, Heart, MessageCircle, Share2,
  BookOpen, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockMangas, useUIStore, useMangaStore, useUserStore } from '@/lib/store'
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
  
  const { readerMode, readerTheme, brightness, setReaderMode, setReaderTheme, setBrightness } = useUIStore()
  const { updateProgress } = useMangaStore()
  const { gainXP, isAuthenticated } = useUserStore()

  // Find manga and chapter
  const manga = mockMangas.find(m => m.id === params.id) || mockMangas[0]
  const chapterNumber = parseInt(params.chapter as string) || 1

  // Mock pages
  const pages = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    url: `https://images.unsplash.com/photo-${1612178537253 + i * 1000}-bccd437b730e?w=800&h=1200&fit=crop`,
  }))

  const totalChapters = manga.chapters
  const hasPrevChapter = chapterNumber > 1
  const hasNextChapter = chapterNumber < totalChapters

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && readerMode === 'horizontal') {
        setCurrentPage(prev => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight' && readerMode === 'horizontal') {
        setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))
      } else if (e.key === 'Escape') {
        setShowSettings(false)
        setShowChapterList(false)
      } else if (e.key === 'f') {
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [readerMode, pages.length])

  // Update reading progress
  useEffect(() => {
    updateProgress(manga.id, chapterNumber)
    if (isAuthenticated) {
      gainXP(5) // Gain XP for reading
    }
  }, [chapterNumber, manga.id, updateProgress, gainXP, isAuthenticated])

  // Auto-hide UI
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleMouseMove = () => {
      setShowUI(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowUI(false), 3000)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
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
    router.push(`/read/${manga.id}/${chapter}`)
    setShowChapterList(false)
  }

  const readerThemes = {
    default: 'bg-background',
    sepia: 'bg-amber-50 dark:bg-amber-950',
    night: 'bg-zinc-950',
  }

  return (
    <div 
      className={cn(
        'min-h-screen relative',
        readerThemes[readerTheme]
      )}
      style={{ filter: `brightness(${brightness}%)` }}
    >
      {/* Top Bar */}
      <AnimatePresence>
        {showUI && (
          <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 glass-strong"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href={`/manga/${manga.id}`}>
                    <Button variant="ghost" size="icon">
                      <X className="w-5 h-5" />
                    </Button>
                  </Link>
                  <div className="hidden sm:block">
                    <h1 className="font-medium text-sm line-clamp-1">{manga.title}</h1>
                    <p className="text-xs text-muted-foreground">Chapter {chapterNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Chapter Selector */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChapterList(!showChapterList)}
                    className="hidden sm:flex"
                  >
                    <List className="w-4 h-4 mr-2" />
                    Ch. {chapterNumber}/{totalChapters}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Settings */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="w-5 h-5" />
                  </Button>

                  {/* Fullscreen */}
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </Button>

                  {/* Home */}
                  <Link href="/">
                    <Button variant="ghost" size="icon">
                      <Home className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/50"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 glass-strong border-l border-border/50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Reader Settings</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Reading Mode */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Reading Mode</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['webtoon', 'vertical', 'horizontal'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setReaderMode(mode)}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all text-center',
                        readerMode === mode
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/50'
                      )}
                    >
                      {mode === 'webtoon' && <ArrowDown className="w-5 h-5 mx-auto mb-1" />}
                      {mode === 'vertical' && <ArrowDown className="w-5 h-5 mx-auto mb-1" />}
                      {mode === 'horizontal' && <ChevronRight className="w-5 h-5 mx-auto mb-1" />}
                      <span className="text-xs capitalize">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['default', 'sepia', 'night'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setReaderTheme(theme)}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all',
                        readerTheme === theme
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/50'
                      )}
                    >
                      {theme === 'default' && <Sun className="w-5 h-5 mx-auto mb-1" />}
                      {theme === 'sepia' && <BookOpen className="w-5 h-5 mx-auto mb-1 text-amber-600" />}
                      {theme === 'night' && <Moon className="w-5 h-5 mx-auto mb-1" />}
                      <span className="text-xs capitalize">{theme}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brightness */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Brightness: {brightness}%</h3>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Zoom (for horizontal mode) */}
              {readerMode === 'horizontal' && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Zoom: {zoom}%</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={zoom}
                      onChange={(e) => setZoom(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Keyboard Shortcuts */}
              <div className="p-4 rounded-lg bg-secondary/30">
                <h3 className="text-sm font-medium mb-2">Keyboard Shortcuts</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>← → : Navigate pages</li>
                  <li>F : Toggle fullscreen</li>
                  <li>Esc : Close panels</li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chapter List Panel */}
      <AnimatePresence>
        {showChapterList && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/50"
              onClick={() => setShowChapterList(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-md glass-strong rounded-2xl shadow-xl max-h-96 overflow-hidden"
            >
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold">Select Chapter</h3>
              </div>
              <div className="overflow-y-auto max-h-72">
                {Array.from({ length: totalChapters }, (_, i) => totalChapters - i).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => goToChapter(ch)}
                    className={cn(
                      'w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between',
                      ch === chapterNumber && 'bg-primary/10 text-primary'
                    )}
                  >
                    <span>Chapter {ch}</span>
                    {ch === chapterNumber && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reader Content */}
      <main className="pt-16 pb-20">
        {readerMode === 'webtoon' || readerMode === 'vertical' ? (
          // Vertical/Webtoon Mode
          <div
            ref={scrollRef}
            className="max-w-3xl mx-auto px-2"
          >
            {pages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative mb-1"
              >
                <img
                  src={page.url}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          // Horizontal Mode
          <div className="h-[calc(100vh-8rem)] flex items-center justify-center px-4">
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
              {/* Navigation Areas */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                disabled={currentPage === 0}
              />
              <button
                onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
                className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                disabled={currentPage === pages.length - 1}
              />

              {/* Current Page */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPage}
                  src={pages[currentPage].url}
                  alt={`Page ${currentPage + 1}`}
                  className="max-h-full max-w-full object-contain"
                  style={{ transform: `scale(${zoom / 100})` }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              {/* Page Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass">
                <span className="text-sm font-medium">
                  {currentPage + 1} / {pages.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Bar */}
      <AnimatePresence>
        {showUI && (
          <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-strong"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Previous Chapter */}
                <Button
                  variant="ghost"
                  disabled={!hasPrevChapter}
                  onClick={() => goToChapter(chapterNumber - 1)}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* Center Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Next Chapter */}
                <Button
                  variant="ghost"
                  disabled={!hasNextChapter}
                  onClick={() => goToChapter(chapterNumber + 1)}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>

              {/* Progress Bar (for vertical modes) */}
              {(readerMode === 'webtoon' || readerMode === 'vertical') && (
                <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: '50%' }}
                  />
                </div>
              )}
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}
