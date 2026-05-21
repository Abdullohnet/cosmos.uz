'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Diamond, Crown, Star, BookOpen, Clock, Heart, Settings,
  Trophy, TrendingUp, Calendar, Edit2, Camera, ChevronRight,
  Eye, Users, MessageCircle, Award, Sparkles, Zap, Shield
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { useUserStore, useMangaStore, mockMangas } from '@/lib/store'
import { MangaCard } from '@/components/manga-card'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, isAuthenticated } = useUserStore()
  const { favorites, readingHistory } = useMangaStore()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'stats', label: 'Stats', icon: TrendingUp },
  ]

  // Mock library data
  const libraryMangas = mockMangas.slice(0, 6)
  const favoriteMangas = mockMangas.filter(m => favorites.includes(m.id))
  const recentlyRead = mockMangas.slice(0, 4)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ${hours % 24}h`
    return `${hours}h ${minutes % 60}m`
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ParticlesBackground />
        <Navbar />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-primary to-accent">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <FloatingOrbs />
      <Navbar />

      <main className="relative z-10 pt-20">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 md:h-64 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?w=1600&h=400&fit=crop"
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <button className="absolute top-4 right-4 p-2 rounded-lg glass hover:bg-secondary/50 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="container mx-auto px-4">
            <div className="relative -mt-20 flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative group">
                <motion.div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-4 ring-background"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                  {/* Animated border for premium */}
                  {user.subscription !== 'free' && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
                        backgroundSize: '200% 200%',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <button className="absolute bottom-2 right-2 p-2 rounded-lg bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4" />
                </button>
                {/* Level Badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold glow-primary">
                  {user.level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{user.username}</h1>
                  {user.subscription !== 'free' && (
                    <span className={cn(
                      'px-2 py-1 rounded-lg text-xs font-medium',
                      user.subscription === 'proplus' && 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black',
                      user.subscription === 'pro' && 'bg-gradient-to-r from-primary to-accent text-primary-foreground',
                      user.subscription === 'standard' && 'bg-secondary text-foreground'
                    )}>
                      <Crown className="w-3 h-3 inline mr-1" />
                      {user.subscription.toUpperCase()}
                    </span>
                  )}
                  {user.role === 'translator' && (
                    <span className="px-2 py-1 rounded-lg bg-success/20 text-success text-xs font-medium">
                      Translator
                    </span>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-4 max-w-lg">{user.bio}</p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{user.followers.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.following.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">following</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">Joined {user.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link href="/shop">
                  <motion.div
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Diamond className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-yellow-400">{user.diamonds.toLocaleString()}</span>
                  </motion.div>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="container mx-auto px-4 mt-8">
          <motion.div
            className="p-6 rounded-2xl glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Level {user.level}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next level</p>
                <p className="font-bold text-primary">Level {user.level + 1}</p>
              </div>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {(user.xpToNextLevel - user.xp).toLocaleString()} XP needed for next level
            </p>
          </motion.div>
        </div>

        {/* Badges */}
        <div className="container mx-auto px-4 mt-6">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {user.badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer',
                  badge.rarity === 'legendary' && 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30',
                  badge.rarity === 'epic' && 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30',
                  badge.rarity === 'rare' && 'bg-primary/20 border border-primary/30',
                  badge.rarity === 'common' && 'bg-secondary border border-border/50'
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-lg">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 mt-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-border/50">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-secondary text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                whileHover={{ y: -2 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{user.readingStats.chaptersRead.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Chapters Read</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-neon" />
                    <p className="text-2xl font-bold">{formatTime(user.readingStats.timeSpent)}</p>
                    <p className="text-sm text-muted-foreground">Time Reading</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <p className="text-2xl font-bold">{user.readingStats.mangaCompleted}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Award className="w-6 h-6 mx-auto mb-2 text-success" />
                    <p className="text-2xl font-bold">{user.achievements.length}</p>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                  </div>
                </div>

                {/* Continue Reading */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Continue Reading</h2>
                    <Link href="/library" className="text-primary text-sm hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentlyRead.map((manga) => (
                      <MangaCard key={manga.id} manga={manga} />
                    ))}
                  </div>
                </section>

                {/* Recent Activity */}
                <section>
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="glass rounded-xl divide-y divide-border/50">
                    {[
                      { action: 'Read Chapter 179', manga: 'Solo Leveling', time: '2 hours ago' },
                      { action: 'Added to favorites', manga: 'Omniscient Reader', time: '5 hours ago' },
                      { action: 'Earned achievement', manga: 'Bookworm Badge', time: '1 day ago' },
                      { action: 'Read Chapter 165', manga: 'Omniscient Reader', time: '1 day ago' },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        className="p-4 flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.manga}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {libraryMangas.map((manga) => (
                    <MangaCard key={manga.id} manga={manga} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {favoriteMangas.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {favoriteMangas.map((manga) => (
                      <MangaCard key={manga.id} manga={manga} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start adding manga to your favorites to see them here
                    </p>
                    <Link href="/browse">
                      <Button>Browse Manga</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {user.achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className={cn(
                      'glass rounded-xl p-4 flex items-center gap-4',
                      achievement.unlockedAt ? 'opacity-100' : 'opacity-50'
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        {achievement.unlockedAt && (
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {!achievement.unlockedAt && (
                        <div className="mt-2">
                          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.progress}/{achievement.maxProgress}
                          </p>
                        </div>
                      )}
                    </div>
                    {achievement.unlockedAt && (
                      <p className="text-xs text-muted-foreground">{achievement.unlockedAt}</p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Reading Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Chapters</span>
                        <span className="font-bold">{user.readingStats.chaptersRead.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Time Spent</span>
                        <span className="font-bold">{formatTime(user.readingStats.timeSpent)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Manga Completed</span>
                        <span className="font-bold">{user.readingStats.mangaCompleted}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Average per Day</span>
                        <span className="font-bold">12 chapters</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Account Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Current Level</span>
                        <span className="font-bold">{user.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total XP Earned</span>
                        <span className="font-bold">{(user.xp + 50000).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Achievements</span>
                        <span className="font-bold">{user.achievements.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Diamonds Spent</span>
                        <span className="font-bold">5,430</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Genre Preferences */}
                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Favorite Genres</h3>
                  <div className="space-y-3">
                    {['Action', 'Fantasy', 'Romance', 'Comedy', 'Adventure'].map((genre, index) => (
                      <div key={genre}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{genre}</span>
                          <span className="text-sm text-muted-foreground">{100 - index * 15}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - index * 15}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
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
