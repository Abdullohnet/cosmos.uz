'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Star, Eye, BookOpen, Clock, Heart, Share2, Flag,
  ChevronDown, ChevronRight, Play, Diamond, Lock, Crown,
  MessageCircle, Users, Calendar, Tag, ArrowLeft
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { MangaCard } from '@/components/manga-card'
import { mockMangas, useMangaStore, useUserStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function MangaDetailPage() {
  const params = useParams()
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAllChapters, setShowAllChapters] = useState(false)
  const [activeTab, setActiveTab] = useState<'chapters' | 'comments'>('chapters')
  
  const { addToFavorites, removeFromFavorites, favorites } = useMangaStore()
  const { user, isAuthenticated } = useUserStore()

  // Find manga by id
  const manga = mockMangas.find(m => m.id === params.id) || mockMangas[0]
  const isFav = favorites.includes(manga.id)

  // Mock chapters
  const chapters = Array.from({ length: Math.min(manga.chapters, 50) }, (_, i) => ({
    id: `ch-${i + 1}`,
    number: manga.chapters - i,
    title: `Chapter ${manga.chapters - i}`,
    isPremium: i < 5,
    price: i < 5 ? 10 : 0,
    publishedAt: new Date(Date.now() - i * 86400000 * 3).toLocaleDateString(),
    views: Math.floor(Math.random() * 100000) + 10000,
  }))

  // Related manga
  const relatedManga = mockMangas.filter(m => m.id !== manga.id).slice(0, 6)

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const handleFavorite = () => {
    if (isFav) {
      removeFromFavorites(manga.id)
    } else {
      addToFavorites(manga.id)
    }
    setIsFavorite(!isFav)
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <FloatingOrbs />
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-16">
        {/* Background */}
        <div className="absolute inset-0 h-96">
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full h-full object-cover blur-2xl opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-8">
          {/* Back Button */}
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cover */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative w-56 md:w-72 mx-auto lg:mx-0">
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {manga.isHot && (
                    <span className="px-2 py-1 rounded-lg bg-orange-500/90 text-white text-xs font-medium">
                      HOT
                    </span>
                  )}
                  {manga.isPremium && (
                    <span className="px-2 py-1 rounded-lg bg-yellow-500/90 text-black text-xs font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Type & Status */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm font-medium">
                  {manga.type.toUpperCase()}
                </span>
                <span className={cn(
                  'px-3 py-1 rounded-lg text-sm font-medium',
                  manga.status === 'ongoing' && 'bg-success/20 text-success',
                  manga.status === 'completed' && 'bg-neon/20 text-neon',
                  manga.status === 'hiatus' && 'bg-orange-500/20 text-orange-400'
                )}>
                  {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{manga.title}</h1>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-foreground">{manga.rating}</span>
                  <span className="text-sm">(12.5K ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-5 h-5" />
                  <span>{formatViews(manga.views)} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-5 h-5" />
                  <span>{manga.chapters} chapters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5" />
                  <span>{formatViews(manga.bookmarks)} bookmarks</span>
                </div>
              </div>

              {/* Author & Artist */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Author: </span>
                  <span className="font-medium">{manga.author}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Artist: </span>
                  <span className="font-medium">{manga.artist}</span>
                </div>
              </div>

              {/* Translator */}
              <Link href={`/translator/${manga.translatorId}`}>
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Translated by</p>
                    <p className="text-sm font-medium">{manga.translatorName}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {manga.genres.map((genre) => (
                  <Link key={genre} href={`/browse?genre=${genre}`}>
                    <motion.span
                      className="px-3 py-1 rounded-full bg-secondary/50 text-sm hover:bg-secondary transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      {genre}
                    </motion.span>
                  </Link>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {manga.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-border/50 text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">{manga.description}</p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/read/${manga.id}/1`}>
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Start Reading
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(isFav && 'bg-red-500/20 border-red-500/50 text-red-400')}
                  onClick={handleFavorite}
                >
                  <Heart className={cn('w-5 h-5 mr-2', isFav && 'fill-current')} />
                  {isFav ? 'Favorited' : 'Add to Favorites'}
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline">
                  <Flag className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-border/50 mb-6">
          <button
            onClick={() => setActiveTab('chapters')}
            className={cn(
              'px-4 py-3 font-medium transition-colors border-b-2 -mb-px',
              activeTab === 'chapters'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Chapters ({manga.chapters})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={cn(
              'px-4 py-3 font-medium transition-colors border-b-2 -mb-px',
              activeTab === 'comments'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Comments (2.4K)
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'chapters' && (
                <motion.div
                  key="chapters"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Chapter List */}
                  <div className="glass rounded-2xl overflow-hidden">
                    {chapters.slice(0, showAllChapters ? chapters.length : 10).map((chapter, index) => (
                      <Link
                        key={chapter.id}
                        href={chapter.isPremium && !isAuthenticated ? '/login' : `/read/${manga.id}/${chapter.number}`}
                      >
                        <motion.div
                          className={cn(
                            'flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer',
                            index !== 0 && 'border-t border-border/30'
                          )}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-medium">
                              {chapter.number}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{chapter.title}</h4>
                                {chapter.isPremium && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 text-xs">
                                    <Diamond className="w-3 h-3" />
                                    {chapter.price}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{chapter.publishedAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {formatViews(chapter.views)} views
                            </span>
                            {chapter.isPremium ? (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>

                  {chapters.length > 10 && (
                    <Button
                      variant="ghost"
                      className="w-full mt-4"
                      onClick={() => setShowAllChapters(!showAllChapters)}
                    >
                      {showAllChapters ? 'Show Less' : `Show All ${chapters.length} Chapters`}
                      <ChevronDown className={cn('w-4 h-4 ml-2 transition-transform', showAllChapters && 'rotate-180')} />
                    </Button>
                  )}
                </motion.div>
              )}

              {activeTab === 'comments' && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Comments Coming Soon</h3>
                    <p className="text-muted-foreground">
                      The comment system is under development.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Translator */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Support the Translator</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Show your appreciation by supporting {manga.translatorName}
              </p>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                <Diamond className="w-4 h-4 mr-2" />
                Send Diamonds
              </Button>
            </div>

            {/* Related Manga */}
            <div>
              <h3 className="font-semibold mb-4">You Might Also Like</h3>
              <div className="grid grid-cols-2 gap-3">
                {relatedManga.slice(0, 4).map((m) => (
                  <MangaCard key={m.id} manga={m} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
