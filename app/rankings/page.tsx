'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, Star, Eye, Flame, Crown, Trophy,
  BookOpen, Users, Diamond, Calendar, ChevronRight
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { MangaCard } from '@/components/manga-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { Manga } from '@/lib/store'
import { apiGetMangas } from '@/lib/api'

const periods = [
  { id: 'daily', label: 'Bugun', icon: Flame },
  { id: 'weekly', label: 'Haftalik', icon: TrendingUp },
  { id: 'monthly', label: 'Oylik', icon: Calendar },
  { id: 'alltime', label: 'Barcha vaqt', icon: Trophy },
]

const categories = [
  { id: 'manga', label: 'Manga' },
  { id: 'manhwa', label: 'Manhwa' },
  { id: 'manhua', label: 'Manhua' },
]

const topReaders = [
  { rank: 1, name: 'MangaKing', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', level: 99, chapters: 15420, xp: 999999 },
  { rank: 2, name: 'OtakuMaster', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', level: 87, chapters: 12800, xp: 850000 },
  { rank: 3, name: 'WeebLord', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', level: 76, chapters: 10500, xp: 720000 },
  { rank: 4, name: 'MangaFan2024', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', level: 65, chapters: 8200, xp: 580000 },
  { rank: 5, name: 'ReadingNinja', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop', level: 58, chapters: 7100, xp: 450000 },
  { rank: 6, name: 'AnimeAddict', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', level: 52, chapters: 6300, xp: 380000 },
  { rank: 7, name: 'ScanHunter', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', level: 48, chapters: 5800, xp: 340000 },
]

const topTranslators = [
  { rank: 1, name: 'Webtoon UZ', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', manga: 120, followers: 150000, earnings: 25000000 },
  { rank: 2, name: 'MangaUZ', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', manga: 85, followers: 95000, earnings: 18000000 },
  { rank: 3, name: 'VizMedia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', manga: 200, followers: 500000, earnings: 42000000 },
  { rank: 4, name: 'TeamSL', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', manga: 45, followers: 25000, earnings: 8500000 },
  { rank: 5, name: 'FlameScans', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', manga: 38, followers: 18000, earnings: 6200000 },
]

export default function RankingsPage() {
  const [period, setPeriod] = useState('weekly')
  const [category, setCategory] = useState('manhwa')
  const [activeTab, setActiveTab] = useState<'manga' | 'readers' | 'translators'>('manga')
  const [mangas, setMangas] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiGetMangas({ limit: 50, sort: 'views' })
      .then(({ manga }) => { if (manga.length > 0) setMangas(manga) })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const sortedMangas = [...mangas].sort((a, b) => b.views - a.views)

  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  const formatMoney = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M so'm`
    return `${(n / 1000).toFixed(0)}K so'm`
  }

  const podiumMangas = sortedMangas.slice(0, 3)
  const restMangas = sortedMangas.slice(3)

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <FloatingOrbs />
      <Navbar />

      <main className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Reyting Jadvali</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Top Reytinglar</h1>
            <p className="text-muted-foreground">Eng mashhur manga, tarjimon va o&apos;quvchilar</p>
          </motion.div>

          {/* Main Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[
              { id: 'manga', label: 'Manga', icon: BookOpen },
              { id: 'readers', label: 'O\'quvchilar', icon: Users },
              { id: 'translators', label: 'Tarjimonlar', icon: Crown },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground glow-primary'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Manga Rankings */}
            {activeTab === 'manga' && (
              <motion.div
                key="manga"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Period Selector */}
                <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                  {periods.map(p => (
                    <motion.button
                      key={p.id}
                      onClick={() => setPeriod(p.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        period === p.id
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <p.icon className="w-4 h-4" />
                      {p.label}
                    </motion.button>
                  ))}
                </div>

                {/* Podium - Top 3 */}
                <div className="flex items-end justify-center gap-4 mb-12">
                  {/* 2nd place */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-3">
                      <div className="w-24 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden ring-4 ring-gray-400 shadow-xl">
                        <img src={podiumMangas[1]?.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center font-bold text-black text-sm shadow-lg">
                        2
                      </div>
                    </div>
                    <p className="text-xs font-medium text-center line-clamp-1 max-w-[80px]">{podiumMangas[1]?.title}</p>
                    <p className="text-[10px] text-muted-foreground">{formatNumber(podiumMangas[1]?.views || 0)} ko&apos;rish</p>
                    <div className="h-16 w-full bg-gradient-to-t from-gray-500/30 to-transparent rounded-t-lg mt-2" />
                  </motion.div>

                  {/* 1st place */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center -mb-2"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    </motion.div>
                    <div className="relative mb-3">
                      <div className="w-32 sm:w-40 aspect-[3/4] rounded-xl overflow-hidden ring-4 ring-yellow-400 shadow-2xl glow-primary">
                        <img src={podiumMangas[0]?.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-black text-lg shadow-lg">
                        1
                      </div>
                    </div>
                    <p className="text-sm font-bold text-center line-clamp-1 max-w-[110px]">{podiumMangas[0]?.title}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs">{podiumMangas[0]?.rating}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{formatNumber(podiumMangas[0]?.views || 0)} ko&apos;rish</p>
                    <div className="h-24 w-full bg-gradient-to-t from-yellow-500/30 to-transparent rounded-t-lg mt-2" />
                  </motion.div>

                  {/* 3rd place */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-3">
                      <div className="w-20 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden ring-4 ring-orange-400 shadow-xl">
                        <img src={podiumMangas[2]?.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-black text-sm shadow-lg">
                        3
                      </div>
                    </div>
                    <p className="text-xs font-medium text-center line-clamp-1 max-w-[70px]">{podiumMangas[2]?.title}</p>
                    <p className="text-[10px] text-muted-foreground">{formatNumber(podiumMangas[2]?.views || 0)} ko&apos;rish</p>
                    <div className="h-10 w-full bg-gradient-to-t from-orange-500/30 to-transparent rounded-t-lg mt-2" />
                  </motion.div>
                </div>

                {/* Rest of rankings */}
                <div className="glass rounded-2xl overflow-hidden">
                  {restMangas.map((manga, i) => (
                    <Link key={manga.id} href={`/manga/${manga.id}`}>
                      <motion.div
                        className={cn(
                          'flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors cursor-pointer',
                          i !== 0 && 'border-t border-border/30'
                        )}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-muted-foreground flex-shrink-0">
                          {i + 4}
                        </div>
                        <img
                          src={manga.cover}
                          alt={manga.title}
                          className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{manga.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              {manga.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {formatNumber(manga.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {manga.chapters} bob
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={cn(
                            'px-2 py-1 rounded-lg text-xs font-medium',
                            manga.status === 'ongoing' && 'bg-success/20 text-success',
                            manga.status === 'completed' && 'bg-primary/20 text-primary',
                            manga.status === 'hiatus' && 'bg-orange-500/20 text-orange-400',
                          )}>
                            {manga.status === 'ongoing' ? 'Davom etmoqda' : manga.status === 'completed' ? 'Tugallangan' : "To'xtatilgan"}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Readers */}
            {activeTab === 'readers' && (
              <motion.div
                key="readers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass rounded-2xl overflow-hidden">
                  {topReaders.map((reader, i) => (
                    <motion.div
                      key={reader.rank}
                      className={cn(
                        'flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors',
                        i !== 0 && 'border-t border-border/30'
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0',
                        i === 0 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                        i === 1 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                        i === 2 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                        i > 2 && 'bg-secondary text-muted-foreground',
                      )}>
                        {reader.rank}
                      </div>
                      <div className="relative">
                        <img src={reader.avatar} alt={reader.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[9px] font-bold text-primary-foreground">
                          {reader.level}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{reader.name}</p>
                        <p className="text-xs text-muted-foreground">{reader.chapters.toLocaleString()} bob o&apos;qilgan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{formatNumber(reader.xp)} XP</p>
                        <p className="text-xs text-muted-foreground">Daraja {reader.level}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Translators */}
            {activeTab === 'translators' && (
              <motion.div
                key="translators"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass rounded-2xl overflow-hidden">
                  {topTranslators.map((t, i) => (
                    <motion.div
                      key={t.rank}
                      className={cn(
                        'flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors',
                        i !== 0 && 'border-t border-border/30'
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0',
                        i === 0 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                        i === 1 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                        i === 2 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                        i > 2 && 'bg-secondary text-muted-foreground',
                      )}>
                        {t.rank}
                      </div>
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{t.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{t.manga} manga</span>
                          <span>{formatNumber(t.followers)} obunachi</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Diamond className="w-3 h-3 text-yellow-400" />
                          <span className="text-sm font-bold text-yellow-400">{formatMoney(t.earnings)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Jami daromad</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}
