'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Flame, BookOpen, Star, Users, Award,
  Crown, Diamond, ChevronRight, Sparkles, Zap,
  Clock, Heart, Eye, BookMarked
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { HeroSlider } from '@/components/hero-slider'
import { MangaCard, MangaCarousel } from '@/components/manga-card'
import { QuickViewModal } from '@/components/quick-view-modal'
import { genres } from '@/lib/store'
import type { Manga } from '@/lib/store'
import { apiGetMangas } from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return { count, ref }
}

function StatCard({ icon: Icon, value, label, color }: {
  icon: React.ElementType; value: number; label: string; color: string
}) {
  const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString()
  const { count, ref } = useCounter(value)
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="glass rounded-2xl p-4 sm:p-5 border border-border/30 hover:border-border/60 transition-colors relative overflow-hidden group"
    >
      <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500', color)} style={{ filter: 'blur(40px)' }} />
      <div className="relative">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color.replace('/5', '/20'))}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-2xl sm:text-3xl font-black tabular-nums">{fmt(count)}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </motion.div>
  )
}

const genreIcons: Record<string, string> = {
  'Action': '⚔️', 'Fantasy': '🧙', 'Romance': '💕', 'Comedy': '😂', 'Drama': '🎭',
  'Horror': '👻', 'Mystery': '🔍', 'Sci-Fi': '🚀', 'Slice of Life': '☀️', 'Sports': '⚽',
  'Supernatural': '✨', 'Thriller': '😰', 'Historical': '🏯', 'Isekai': '🌀', 'Shounen': '🔥',
  'Jangovar': '⚔️', 'Fantastika': '🧙', 'Romantika': '💕', 'Komediya': '😂',
  'Sehrli': '✨', 'Dahshat': '👻', 'Sport': '⚽', 'Tarixiy': '🏯', 'Mecha': '🤖',
}

interface TopTranslator { id: string; username: string; avatar: string; manga_count: number; followers: number }
interface TopUser { id: string; username: string; avatar: string; level: number; xp: number }

function EmptySection({ icon: Icon, title, desc, link, linkLabel }: {
  icon: React.ElementType; title: string; desc: string; link: string; linkLabel: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground/60 mb-4">{desc}</p>
      <Link href={link}>
        <Button variant="outline" size="sm" className="text-xs">{linkLabel}</Button>
      </Link>
    </div>
  )
}

export default function HomePage() {
  const [quickViewManga, setQuickViewManga] = useState<Manga | null>(null)
  const [activeGenre, setActiveGenre] = useState<string | null>(null)
  const [mangas, setMangas] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [topTranslators, setTopTranslators] = useState<TopTranslator[]>([])
  const [topUsers, setTopUsers] = useState<TopUser[]>([])

  useEffect(() => {
    Promise.all([
      apiGetMangas({ limit: 50, sort: 'views' }).then(({ manga }) => setMangas(manga)).catch(() => {}),
      fetch('/api/home/stats').then(r => r.json()).then(d => {
        if (d.success) {
          setTopTranslators(d.data.translators || [])
          setTopUsers(d.data.topUsers || [])
        }
      }).catch(() => {}),
    ]).finally(() => setIsLoading(false))
  }, [])

  const trendingMangas = [...mangas].sort((a, b) => b.views - a.views)
  const topRatedMangas = [...mangas].sort((a, b) => b.rating - a.rating)
  const latestMangas = [...mangas].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  const hotMangas = mangas.filter(m => m.isHot).length > 0 ? mangas.filter(m => m.isHot) : mangas.slice(0, 5)
  const filteredByGenre = activeGenre ? mangas.filter(m => m.genres.includes(activeGenre)) : mangas.slice(0, 4)
  const genresUz = genres.slice(0, 12)
  const isEmpty = !isLoading && mangas.length === 0

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <FloatingOrbs />
      <Navbar />
      <HeroSlider mangas={mangas} />

      <main className="relative z-10 container mx-auto px-3 sm:px-4 pb-8">

        {isEmpty ? (
          <div className="py-20 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                <BookMarked className="w-12 h-12 text-primary/60" />
              </div>
              <h2 className="text-2xl font-black mb-3">Hali manga yo&apos;q</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Tarjimonlar manga yuklashni boshlasa, shu yerda ko&apos;rinadi.
                Siz ham tarjimon bo&apos;lib keling!
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/apply">
                  <Button className="gap-2">
                    <Star className="w-4 h-4" />
                    Tarjimon bo&apos;lish
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button variant="outline">Catalog</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* ── Kunlik Top ── */}
            {trendingMangas.length > 0 && (
              <section className="py-3 sm:py-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <motion.div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20"
                      animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Flame className="w-4 h-4 text-orange-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold">Kunlik Top</h2>
                      <p className="text-[10px] text-muted-foreground">Bugungi eng mashhurlar</p>
                    </div>
                  </div>
                  <Link href="/rankings">
                    <Button variant="ghost" size="sm" className="text-primary text-xs h-7 gap-0.5">
                      Hammasi <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                  {trendingMangas.slice(0, 6).map((manga, i) => (
                    <motion.div key={manga.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <MangaCard manga={manga} rank={i + 1} showRank onQuickView={() => setQuickViewManga(manga)} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Trendda ── */}
            {hotMangas.length > 0 && (
              <section className="py-3 sm:py-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20"
                      animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </motion.div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold">Trendda</h2>
                      <p className="text-[10px] text-muted-foreground">Jamiyatda mashhur</p>
                    </div>
                  </div>
                  <Link href="/browse?sort=views">
                    <Button variant="ghost" size="sm" className="text-primary text-xs h-7 gap-0.5">
                      Hammasi <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 no-scrollbar">
                  {hotMangas.map((manga, i) => (
                    <motion.div key={manga.id} className="flex-shrink-0 w-40 sm:w-52"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                      <MangaCard manga={manga} variant="featured" onQuickView={() => setQuickViewManga(manga)} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Genre Explorer ── */}
            <section className="py-3 sm:py-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-neon/20 to-primary/20">
                    <Sparkles className="w-4 h-4 text-neon" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold">Janr Explorer</h2>
                    <p className="text-[10px] text-muted-foreground">Kategoriya tanlang</p>
                  </div>
                </div>
                <Link href="/browse">
                  <Button variant="ghost" size="sm" className="text-primary text-xs h-7 gap-0.5">
                    Barchasi <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
                <motion.button
                  onClick={() => setActiveGenre(null)}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={cn('flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border',
                    activeGenre === null
                      ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-lg'
                      : 'bg-secondary/50 border-border/40 hover:bg-secondary text-muted-foreground')}>
                  ✨ Barchasi
                </motion.button>
                {genresUz.map((genre, i) => (
                  <motion.button key={genre}
                    onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className={cn('flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border',
                      activeGenre === genre
                        ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-lg'
                        : 'bg-secondary/50 border-border/40 hover:bg-secondary text-muted-foreground')}>
                    <span>{genreIcons[genre] || '📚'}</span>
                    {genre}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeGenre || 'all'}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid md:grid-cols-2 gap-3">
                  {filteredByGenre.slice(0, 4).map((manga, i) => (
                    <motion.div key={manga.id}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <MangaCard manga={manga} variant="large" rank={i + 1} showRank onQuickView={() => setQuickViewManga(manga)} />
                    </motion.div>
                  ))}
                  {filteredByGenre.length === 0 && (
                    <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                      Bu janrda hozircha manga yo&apos;q
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </section>

            {/* ── Premium CTA ── */}
            <section className="py-3 sm:py-5">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
                <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-white/5 to-accent/10"
                  animate={{ x: ['0%', '100%', '0%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                <div className="relative glass-strong p-5 sm:p-7 border border-primary/20">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-base sm:text-lg font-black">Premium&apos;ga O&apos;ting</h2>
                      </div>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Reklamasiz o&apos;qish, erta boblar, eksklyuziv kosmetikalar
                      </p>
                    </div>
                    <Link href="/premium">
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm shadow-lg">
                        <Zap className="w-4 h-4" />
                        Yangilash
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ── Top Rated ── */}
            {topRatedMangas.length > 0 && (
              <MangaCarousel
                title="Eng Yuqori Baholangan"
                subtitle="Reytingi eng baland"
                icon={<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                mangas={topRatedMangas}
                seeAllLink="/browse?sort=rating"
                onQuickView={setQuickViewManga}
              />
            )}

            {/* ── 3-column ── */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 py-3 sm:py-5">
              {/* Top Translators */}
              <div className="glass rounded-2xl p-4 border border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-neon/20">
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold">Top Tarjimonlar</h3>
                </div>
                {topTranslators.length === 0 ? (
                  <EmptySection icon={Users} title="Hozircha yo'q" desc="Tarjimonlar qo'shilgach ko'rinadi" link="/apply" linkLabel="Tarjimon bo'lish" />
                ) : (
                  <div className="space-y-2">
                    {topTranslators.map((t, i) => (
                      <motion.div key={t.id} whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-secondary/40 transition-colors cursor-pointer">
                        <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0',
                          i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                          i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                          i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' : 'bg-secondary text-muted-foreground')}>
                          {i + 1}
                        </div>
                        <img src={t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.username}`} alt={t.username} className="w-8 h-8 rounded-full object-cover ring-2 ring-border" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[11px] truncate">{t.username}</p>
                          <p className="text-[9px] text-muted-foreground">{t.manga_count} manga</p>
                        </div>
                        <p className="text-[9px] text-muted-foreground flex-shrink-0">{t.followers >= 1000 ? `${(t.followers / 1000).toFixed(0)}K` : t.followers}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Users */}
              <div className="glass rounded-2xl p-4 border border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold">Top O&apos;quvchilar</h3>
                </div>
                {topUsers.length === 0 ? (
                  <EmptySection icon={Users} title="Hozircha yo'q" desc="O'quvchilar qo'shilgach ko'rinadi" link="/login" linkLabel="Ro'yxatdan o'tish" />
                ) : (
                  <div className="space-y-2">
                    {topUsers.map((u, i) => (
                      <motion.div key={u.id} whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-secondary/40 transition-colors cursor-pointer">
                        <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0',
                          i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                          i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                          i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' : 'bg-secondary text-muted-foreground')}>
                          {i + 1}
                        </div>
                        <div className="relative flex-shrink-0">
                          <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt={u.username} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background border border-border/50 flex items-center justify-center">
                            <span className="text-[7px] font-black text-primary">{u.level}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[11px] truncate">{u.username}</p>
                          <p className="text-[9px] text-muted-foreground">Daraja {u.level}</p>
                        </div>
                        <p className="text-[9px] text-primary font-bold flex-shrink-0">{u.xp >= 1000 ? `${(u.xp / 1000).toFixed(0)}K` : u.xp} XP</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Diamond Shop */}
              <div className="glass rounded-2xl p-4 border border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                    <Diamond className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold">Olmos Do&apos;koni</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "Boshlang'ich", diamonds: 330, price: "25,000", discount: 17, color: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30', badge: null },
                    { name: 'Ultra Paket', diamonds: 1500, price: "80,000", discount: 20, color: 'from-primary/10 to-accent/10 border-primary/30', badge: 'MASHHUR' },
                    { name: 'Afsonaviy', diamonds: 4000, price: "180,000", discount: 28, color: 'from-purple-500/10 to-pink-500/10 border-purple-500/30', badge: 'CHEKLANGAN' },
                  ].map((pack, i) => (
                    <motion.div key={pack.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={cn('relative p-3 rounded-xl bg-gradient-to-r border overflow-hidden cursor-pointer', pack.color)}>
                      {pack.badge && (
                        <span className={cn('absolute top-0 right-0 px-1.5 py-0.5 rounded-bl-lg text-[7px] font-bold',
                          i === 1 ? 'bg-primary text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white')}>
                          {pack.badge}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold">{pack.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Diamond className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs font-black">{pack.diamonds >= 1000 ? `${(pack.diamonds / 1000).toFixed(1)}K` : pack.diamonds}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[8px] font-bold">-{pack.discount}%</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{pack.price} so&apos;m</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Link href="/shop">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-black font-bold text-[11px] flex items-center justify-center gap-1.5">
                    <Diamond className="w-3.5 h-3.5" />
                    Do&apos;konga o&apos;tish
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* ── Latest ── */}
            {latestMangas.length > 0 && (
              <MangaCarousel
                title="Yaqinda Yangilangan"
                subtitle="Eng so'nggi boblar"
                icon={<Clock className="w-4 h-4 text-primary" />}
                mangas={latestMangas}
                seeAllLink="/browse?sort=latest"
                onQuickView={setQuickViewManga}
              />
            )}

            {/* ── For You ── */}
            {mangas.length > 0 && (
              <MangaCarousel
                title="Sizga Tavsiya"
                subtitle="Sizning didingizga mos"
                icon={<Sparkles className="w-4 h-4 text-accent" />}
                mangas={[...mangas].sort(() => Math.random() - 0.5)}
                seeAllLink="/browse"
                onQuickView={setQuickViewManga}
              />
            )}
          </>
        )}
      </main>

      <Footer />
      <QuickViewModal manga={quickViewManga} onClose={() => setQuickViewManga(null)} />
    </div>
  )
}
