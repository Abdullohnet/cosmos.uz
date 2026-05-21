'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Diamond, Crown, Star, BookOpen, Clock, Heart, Settings,
  Trophy, TrendingUp, Calendar, Edit2, Camera, ChevronRight,
  Eye, Users, MessageCircle, Award, Sparkles, Zap, Shield,
  BookMarked, Activity, Check, Lock
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { useUserStore, useMangaStore } from '@/lib/store'
import type { Manga } from '@/lib/store'
import { apiGetBookmarks, apiGetMangas } from '@/lib/api'
import { MangaCard } from '@/components/manga-card'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'library' | 'favorites' | 'achievements' | 'stats'

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'overview', label: 'Asosiy', icon: Eye },
  { id: 'library', label: 'Kutubxona', icon: BookOpen },
  { id: 'favorites', label: 'Sevimlilar', icon: Heart },
  { id: 'achievements', label: 'Yutuqlar', icon: Trophy },
  { id: 'stats', label: 'Statistika', icon: TrendingUp },
]

const recentActivity = [
  { action: '179-bobni o\'qidi', manga: 'Solo Leveling', time: '2 soat oldin', icon: BookOpen, color: 'text-primary' },
  { action: 'Sevimlilarga qo\'shdi', manga: 'Omniscient Reader', time: '5 soat oldin', icon: Heart, color: 'text-red-400' },
  { action: 'Yutuq oldi', manga: '📚 Kitobxon', time: '1 kun oldin', icon: Trophy, color: 'text-yellow-400' },
  { action: '165-bobni o\'qidi', manga: 'Omniscient Reader', time: '1 kun oldin', icon: BookOpen, color: 'text-primary' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const { user, isAuthenticated } = useUserStore()
  const { favorites } = useMangaStore()
  const [libraryMangas, setLibraryMangas] = useState<Manga[]>([])
  const [favoriteMangas, setFavoriteMangas] = useState<Manga[]>([])
  const [recentlyRead, setRecentlyRead] = useState<Manga[]>([])

  useEffect(() => {
    apiGetMangas({ limit: 8, sort: 'views' }).then(({ manga }) => {
      setLibraryMangas(manga.slice(0, 6))
      setRecentlyRead(manga.slice(0, 4))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) return
    apiGetBookmarks(user.id).then(bookmarks => {
      if (bookmarks.length > 0) setFavoriteMangas(bookmarks)
    }).catch(() => {})
  }, [user?.id])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}k ${hours % 24}s`
    return `${hours}s ${minutes % 60}d`
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ParticlesBackground />
        <Navbar />
        <motion.div className="text-center px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-6 border border-primary/30">
            <Shield className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Kirish talab etiladi</h1>
          <p className="text-muted-foreground mb-6">Profilingizni ko'rish uchun tizimga kiring</p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-primary to-accent px-8 glow-primary">Kirish</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const subGradient =
    user.subscription === 'proplus' ? 'from-yellow-400 via-orange-500 to-red-500' :
    user.subscription === 'pro' ? 'from-primary via-accent to-indigo-600' :
    user.subscription === 'standard' ? 'from-blue-500 to-cyan-500' : ''

  const xpPercent = Math.round((user.xp / user.xpToNextLevel) * 100)

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <FloatingOrbs />
      <Navbar />

      <main className="relative z-10 pt-16">

        {/* ── Cover + Avatar ── */}
        <div className="relative">
          <div className="h-52 md:h-72 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?w=1600&h=400&fit=crop"
              alt="Muqova" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />

            {/* Edit cover */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 p-2 rounded-xl glass border border-border/40 hover:bg-secondary/60 transition-colors">
              <Camera className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="container mx-auto px-4 sm:px-6">
            <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end gap-4">

              {/* Avatar */}
              <div className="relative group">
                {user.subscription !== 'free' && (
                  <motion.div className={cn('absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-80', subGradient)}
                    animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                )}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-background">
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-1.5 rounded-lg bg-background/80">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
                {/* Level badge */}
                <motion.div whileHover={{ scale: 1.1 }}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-sm text-white glow-primary shadow-lg">
                  {user.level}
                </motion.div>
              </div>

              {/* Info + actions */}
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black">{user.username}</h1>
                  {user.subscription !== 'free' && (
                    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r', subGradient)}>
                      <Crown className="w-3 h-3" />{user.subscription.toUpperCase()}
                    </span>
                  )}
                  {user.role === 'translator' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      <Edit2 className="w-3 h-3" />Tarjimon
                    </span>
                  )}
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                      <Shield className="w-3 h-3" />Admin
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3 max-w-md">{user.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">{user.followers.toLocaleString()}</span>
                    <span className="text-muted-foreground">ta'kidchilar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">{user.following.toLocaleString()}</span>
                    <span className="text-muted-foreground">ta'kidlanganlar</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{user.createdAt} dan</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href="/shop">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 cursor-pointer">
                    <Diamond className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-yellow-400 text-sm">{user.diamonds.toLocaleString()}</span>
                  </motion.div>
                </Link>
                <Link href="/settings">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors">
                    <Settings className="w-5 h-5" />
                  </motion.button>
                </Link>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors text-sm font-medium">
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Tahrirlash</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* ── XP Bar ── */}
        <div className="container mx-auto px-4 sm:px-6 mt-6">
          <motion.div className="glass rounded-2xl p-5 border border-border/30"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Daraja {user.level}</h3>
                  <p className="text-xs text-muted-foreground">{user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Keyingi daraja</p>
                <p className="font-bold text-primary text-sm">Daraja {user.level + 1}</p>
                <p className="text-[11px] text-muted-foreground">{(user.xpToNextLevel - user.xp).toLocaleString()} XP qoldi</p>
              </div>
            </div>
            <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary via-accent to-indigo-500 rounded-full"
                initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 text-right">{xpPercent}% to'lgan</p>
          </motion.div>
        </div>

        {/* ── Badges ── */}
        <div className="container mx-auto px-4 sm:px-6 mt-4">
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {user.badges.map((badge, i) => (
              <motion.div key={badge.id}
                className={cn(
                  'flex-shrink-0 px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer border',
                  badge.rarity === 'legendary' && 'bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border-yellow-500/30',
                  badge.rarity === 'epic' && 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 border-purple-500/30',
                  badge.rarity === 'rare' && 'bg-primary/10 border-primary/30',
                  badge.rarity === 'common' && 'bg-secondary border-border/40'
                )}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}>
                <span className="text-base">{badge.icon}</span>
                <span className="text-xs font-semibold whitespace-nowrap">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="container mx-auto px-4 sm:px-6 mt-6">
          <div className="relative flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-border/40 pb-0">
            {tabs.map(tab => (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
                whileHover={{ y: -1 }}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="profileUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="container mx-auto px-4 sm:px-6 py-6 pb-24">
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: BookOpen, value: user.readingStats.chaptersRead.toLocaleString(), label: "O'qilgan boblar", color: 'from-primary/20 to-primary/5 border-primary/30', iconColor: 'text-primary' },
                    { icon: Clock, value: formatTime(user.readingStats.timeSpent), label: "Sarflangan vaqt", color: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30', iconColor: 'text-indigo-400' },
                    { icon: Trophy, value: user.readingStats.mangaCompleted.toString(), label: "Tugallangan", color: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30', iconColor: 'text-yellow-400' },
                    { icon: Award, value: user.achievements.length.toString(), label: "Yutuqlar", color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30', iconColor: 'text-emerald-400' },
                  ].map((s, i) => (
                    <motion.div key={s.label}
                      className={cn('relative overflow-hidden rounded-2xl border p-4 bg-gradient-to-br', s.color)}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -2 }}>
                      <s.icon className={cn('w-5 h-5 mb-2', s.iconColor)} />
                      <p className="text-xl font-black">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Continue Reading */}
                  <div className="glass rounded-2xl p-5 border border-border/30">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold flex items-center gap-2">
                        <BookMarked className="w-4 h-4 text-primary" />O'qishni davom ettirish
                      </h2>
                      <Link href="/library" className="text-primary text-xs hover:underline flex items-center gap-1">
                        Hammasi <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {recentlyRead.slice(0, 4).map((manga) => (
                        <MangaCard key={manga.id} manga={manga} />
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass rounded-2xl p-5 border border-border/30">
                    <h2 className="font-bold flex items-center gap-2 mb-4">
                      <Activity className="w-4 h-4 text-primary" />So'nggi Faollik
                    </h2>
                    <div className="space-y-1">
                      {recentActivity.map((act, i) => (
                        <motion.div key={i}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors"
                          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                          <div className={cn('p-1.5 rounded-lg bg-secondary/50 flex-shrink-0', act.color)}>
                            <act.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{act.manga}</p>
                            <p className="text-xs text-muted-foreground">{act.action}</p>
                          </div>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">{act.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LIBRARY */}
            {activeTab === 'library' && (
              <motion.div key="library" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {libraryMangas.map(manga => <MangaCard key={manga.id} manga={manga} />)}
                </div>
              </motion.div>
            )}

            {/* FAVORITES */}
            {activeTab === 'favorites' && (
              <motion.div key="favorites" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {favoriteMangas.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {favoriteMangas.map(manga => <MangaCard key={manga.id} manga={manga} />)}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <motion.div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4"
                      animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Heart className="w-8 h-8 text-red-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2">Sevimlilar bo'sh</h3>
                    <p className="text-muted-foreground text-sm mb-5">Manga kartasidagi yurakcha belgisini bosing</p>
                    <Link href="/browse">
                      <Button className="bg-gradient-to-r from-primary to-accent">
                        <BookOpen className="w-4 h-4 mr-2" />Manga ko'rish
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <motion.div key="achievements" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {user.achievements.map((ach, i) => (
                    <motion.div key={ach.id}
                      className={cn('glass rounded-2xl p-4 border flex items-center gap-4 transition-all',
                        ach.unlockedAt ? 'border-primary/20 bg-primary/3' : 'border-border/20 opacity-60')}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      whileHover={{ x: 3 }}>
                      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border',
                        ach.unlockedAt ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30' : 'bg-secondary border-border/30')}>
                        {ach.unlockedAt ? ach.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-sm">{ach.name}</h3>
                          {ach.unlockedAt && <Sparkles className="w-3.5 h-3.5 text-yellow-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{ach.description}</p>
                        {!ach.unlockedAt && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Jarayon</span>
                              <span className="font-semibold">{ach.progress}/{ach.maxProgress}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                              <motion.div className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }} />
                            </div>
                          </div>
                        )}
                        {ach.unlockedAt && (
                          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />{ach.unlockedAt} da ochildi
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STATS */}
            {activeTab === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="glass rounded-2xl p-6 border border-border/30">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />O'qish Statistikasi
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Jami boblar', value: user.readingStats.chaptersRead.toLocaleString() },
                        { label: "Sarflangan vaqt", value: formatTime(user.readingStats.timeSpent) },
                        { label: 'Tugatilgan manga', value: user.readingStats.mangaCompleted.toString() },
                        { label: 'Kunlik o\'rtacha', value: '12 bob' },
                      ].map(s => (
                        <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                          <span className="text-sm text-muted-foreground">{s.label}</span>
                          <span className="font-bold text-sm">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 border border-border/30">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />Hisob Statistikasi
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Joriy daraja', value: `Daraja ${user.level}` },
                        { label: "Jami XP", value: (user.xp + 50000).toLocaleString() },
                        { label: "Yutuqlar soni", value: user.achievements.length.toString() },
                        { label: 'Sarflangan olmoz', value: '5,430' },
                      ].map(s => (
                        <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                          <span className="text-sm text-muted-foreground">{s.label}</span>
                          <span className="font-bold text-sm">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Genre chart */}
                <div className="glass rounded-2xl p-6 border border-border/30">
                  <h3 className="font-bold mb-5 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />Sevimli Janrlar
                  </h3>
                  <div className="space-y-3">
                    {[
                      { genre: 'Action', percent: 42, color: 'from-red-500 to-orange-500' },
                      { genre: 'Fantasy', percent: 28, color: 'from-primary to-accent' },
                      { genre: 'Drama', percent: 18, color: 'from-indigo-500 to-purple-500' },
                      { genre: 'Romance', percent: 8, color: 'from-pink-500 to-rose-500' },
                      { genre: 'Horror', percent: 4, color: 'from-gray-600 to-gray-800' },
                    ].map((g, i) => (
                      <div key={g.genre}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium">{g.genre}</span>
                          <span className="text-muted-foreground">{g.percent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <motion.div className={cn('h-full rounded-full bg-gradient-to-r', g.color)}
                            initial={{ width: 0 }} animate={{ width: `${g.percent}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }} />
                        </div>
                      </div>
                    ))}
                  </div>
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
