'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Star, Eye, BookOpen, Heart, Share2, Flag,
  ChevronDown, ChevronRight, Play, Diamond, Lock, Crown,
  MessageCircle, Users, Calendar, ArrowLeft, Sparkles,
  Check, TrendingUp, Zap
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground } from '@/components/particles'
import { MangaCard } from '@/components/manga-card'
import { mockMangas, useMangaStore, useUserStore } from '@/lib/store'
import { useToast } from '@/components/toast'
import { cn } from '@/lib/utils'

export default function MangaDetailPage() {
  const params = useParams()
  const [showAllChapters, setShowAllChapters] = useState(false)
  const [activeTab, setActiveTab] = useState<'chapters' | 'comments'>('chapters')
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const { show } = useToast()

  const { addToFavorites, removeFromFavorites, favorites } = useMangaStore()
  const { isAuthenticated } = useUserStore()

  const manga = mockMangas.find(m => m.id === params.id) || mockMangas[0]
  const isFav = favorites.includes(manga.id)

  const chapters = Array.from({ length: Math.min(manga.chapters, 50) }, (_, i) => ({
    id: `ch-${i + 1}`,
    number: manga.chapters - i,
    title: `${manga.chapters - i}-bob`,
    isPremium: i < 3,
    price: i < 3 ? 10 : 0,
    publishedAt: new Date(Date.now() - i * 86400000 * 3).toLocaleDateString('uz-UZ'),
    views: Math.floor(Math.random() * 100000) + 10000,
  }))

  const relatedManga = mockMangas.filter(m => m.id !== manga.id).slice(0, 6)

  const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString()

  const handleFavorite = () => {
    if (isFav) {
      removeFromFavorites(manga.id)
      show('Sevimlilardan olib tashlandi', 'info')
    } else {
      addToFavorites(manga.id)
      show(`${manga.title} sevimlilarga qo'shildi! ❤️`, 'success')
    }
  }

  const handleRating = (r: number) => {
    setUserRating(r)
    show(`${r} yulduz baho berdingiz! ⭐`, 'success')
  }

  const statusMap: Record<string, { label: string; color: string; dot: string }> = {
    ongoing: { label: 'Davom etmoqda', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
    completed: { label: 'Tugallangan', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
    hiatus: { label: "To'xtatilgan", color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  }
  const status = statusMap[manga.status] || statusMap.ongoing

  const tabs = [
    { id: 'chapters', label: 'Boblar', icon: BookOpen, count: manga.chapters },
    { id: 'comments', label: 'Izohlar', icon: MessageCircle, count: '2.4K' },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative pt-16">
        {/* Blurred background */}
        <div className="absolute inset-0 h-[420px] overflow-hidden">
          <img src={manga.cover} alt="" className="w-full h-full object-cover blur-3xl opacity-25 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-6 pb-10">
          {/* Back */}
          <Link href="/">
            <motion.button whileHover={{ x: -3 }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Orqaga
            </motion.button>
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cover */}
            <motion.div className="flex-shrink-0"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
              <div className="relative w-44 sm:w-56 mx-auto lg:mx-0">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 blur-xl opacity-60" />
                <img src={manga.cover} alt={manga.title}
                  className="relative w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl" />
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                  {manga.isHot && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                      className="px-2 py-1 rounded-lg bg-orange-500/90 text-white text-[10px] font-bold flex items-center gap-1">
                      🔥 HOT
                    </motion.span>
                  )}
                  {manga.isPremium && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
                      className="px-2 py-1 rounded-lg bg-yellow-500/90 text-black text-[10px] font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3" />PREMIUM
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold">
                  {manga.type.toUpperCase()}
                </span>
                <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5', status.color)}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                  {status.label}
                </span>
                {manga.isNew && (
                  <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />YANGI
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 leading-tight">{manga.title}</h1>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{manga.rating}</span>
                  <span className="text-xs text-muted-foreground">(12.5K)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Eye className="w-4 h-4" /><span>{fmt(manga.views)} ko'rildi</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <BookOpen className="w-4 h-4" /><span>{manga.chapters} bob</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Heart className="w-4 h-4" /><span>{fmt(manga.bookmarks)} saqlagan</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4 text-sm">
                <div><span className="text-muted-foreground">Muallif: </span><span className="font-semibold">{manga.author}</span></div>
                <div><span className="text-muted-foreground">Artist: </span><span className="font-semibold">{manga.artist}</span></div>
              </div>

              {/* Translator pill */}
              <Link href={`/translator/${manga.translatorId}`}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-secondary/60 hover:bg-secondary border border-border/30 transition-colors mb-4">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Tarjimon</p>
                    <p className="text-xs font-bold">{manga.translatorName}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-1" />
                </motion.div>
              </Link>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-3">
                {manga.genres.map(g => (
                  <Link key={g} href={`/browse?genre=${g}`}>
                    <motion.span whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                      className="px-3 py-1 rounded-full bg-secondary/60 text-xs hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer border border-border/30">
                      {g}
                    </motion.span>
                  </Link>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {manga.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-border/40 text-[10px] text-muted-foreground">#{t}</span>
                ))}
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xl">{manga.description}</p>

              {/* Rate it */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs text-muted-foreground">Baho bering:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button key={star}
                      whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRating(star)}
                    >
                      <Star className={cn('w-5 h-5 transition-colors',
                        star <= (hoverRating || userRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/40'
                      )} />
                    </motion.button>
                  ))}
                </div>
                {userRating > 0 && <span className="text-xs text-yellow-400 font-medium">{userRating}/5</span>}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link href={`/read/${manga.id}/1`}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold glow-primary text-sm">
                    <Play className="w-4 h-4 fill-current" />
                    O'qishni boshlash
                  </motion.button>
                </Link>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                  onClick={handleFavorite}
                  className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-colors',
                    isFav ? 'bg-red-500/15 border-red-500/40 text-red-400' : 'border-border/50 hover:bg-secondary/60')}>
                  <Heart className={cn('w-4 h-4', isFav && 'fill-current')} />
                  {isFav ? 'Saqlangan' : 'Saqlash'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { navigator.share?.({ title: manga.title, url: window.location.href }).catch(() => {}); show('Havola nusxalandi!', 'success') }}
                  className="p-2.5 rounded-xl border border-border/50 hover:bg-secondary/60 transition-colors">
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl border border-border/50 hover:bg-secondary/60 transition-colors">
                  <Flag className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="relative z-10 container mx-auto px-4 pb-16">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border/40 mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80')}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                activeTab === tab.id ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground')}>
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tab Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'chapters' && (
                <motion.div key="chapters"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                  <div className="glass rounded-2xl overflow-hidden border border-border/30">
                    {chapters.slice(0, showAllChapters ? chapters.length : 12).map((ch, i) => (
                      <Link key={ch.id}
                        href={ch.isPremium && !isAuthenticated ? '/login' : `/read/${manga.id}/${ch.number}`}>
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                          className={cn(
                            'flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors cursor-pointer',
                            i !== 0 && 'border-t border-border/20'
                          )}
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0',
                              i === 0 ? 'bg-gradient-to-br from-primary/30 to-accent/30 text-primary' : 'bg-secondary/60 text-muted-foreground'
                            )}>
                              {ch.number}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{ch.title}</span>
                                {ch.isPremium && (
                                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 text-[10px] font-bold">
                                    <Diamond className="w-2.5 h-2.5" />{ch.price}
                                  </span>
                                )}
                                {i === 0 && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-bold">YANGI</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[10px] text-muted-foreground">{ch.publishedAt}</p>
                                <span className="text-[10px] text-muted-foreground">· {fmt(ch.views)} ko'rildi</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {ch.isPremium ? (
                              <Lock className="w-4 h-4 text-muted-foreground/60" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>

                  {chapters.length > 12 && (
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => setShowAllChapters(!showAllChapters)}
                      className="w-full mt-3 py-3 rounded-xl border border-border/40 hover:bg-secondary/40 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      {showAllChapters ? 'Kamroq ko\'rsatish' : `Barcha ${chapters.length} ta bobni ko'rish`}
                      <motion.div animate={{ rotate: showAllChapters ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>
                  )}
                </motion.div>
              )}

              {activeTab === 'comments' && (
                <motion.div key="comments"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                  {/* Mock comments */}
                  <div className="space-y-3">
                    {[
                      { name: 'MangaFan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60', text: 'Bu manga juda zo\'r! Har bir bob yangi hayajon olib keladi 🔥', time: '2 soat oldin', likes: 42 },
                      { name: 'OtakuMaster', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60', text: 'Tarjimon ajoyib ish qilmoqda, sifat zo\'r 👏', time: '5 soat oldin', likes: 28 },
                      { name: 'ReadingNinja', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=60', text: 'Keyingi bobni kutolmayman!!!', time: '1 kun oldin', likes: 15 },
                    ].map((c, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass rounded-xl p-4 border border-border/20">
                        <div className="flex items-start gap-3">
                          <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold">{c.name}</span>
                              <span className="text-[10px] text-muted-foreground">{c.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{c.text}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-red-400 transition-colors">
                                <Heart className="w-3 h-3" />{c.likes}
                              </button>
                              <button className="text-[11px] text-muted-foreground hover:text-primary transition-colors">Javob berish</button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Comment input */}
                    <div className="glass rounded-xl p-4 border border-border/20">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <input type="text" placeholder="Izoh yozing..."
                            className="w-full bg-secondary/50 border border-border/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                          <div className="flex justify-end mt-2">
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                              className="px-4 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 transition-colors">
                              Yuborish
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Support Translator */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5 border border-border/30">
              <h3 className="font-bold mb-1">Tarjimonni qo'llab-quvvatlang</h3>
              <p className="text-xs text-muted-foreground mb-4">
                {manga.translatorName} ni olmos yuborish orqali qo'llab-quvvatlang
              </p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => show('Diamond yuborildi! 💎', 'success')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-black font-bold text-sm flex items-center justify-center gap-2">
                <Diamond className="w-4 h-4" />
                Olmos yuborish
              </motion.button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="glass rounded-2xl p-5 border border-border/30 space-y-3">
              <h3 className="font-bold text-sm">Statistika</h3>
              {[
                { label: 'Ko\'rishlar', value: fmt(manga.views), icon: Eye, color: 'text-blue-400' },
                { label: 'Saqlanganlar', value: fmt(manga.bookmarks), icon: Heart, color: 'text-red-400' },
                { label: 'Boblar', value: manga.chapters.toString(), icon: BookOpen, color: 'text-primary' },
                { label: 'Reyting', value: `${manga.rating}/10`, icon: Star, color: 'text-yellow-400' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                    {stat.label}
                  </div>
                  <span className="text-sm font-bold">{stat.value}</span>
                </div>
              ))}
            </motion.div>

            {/* Related */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="font-bold text-sm mb-3">O'xshash mangalar</h3>
              <div className="grid grid-cols-3 gap-2">
                {relatedManga.slice(0, 6).map(m => (
                  <MangaCard key={m.id} manga={m} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
