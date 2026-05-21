'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Upload, Plus, BookOpen, Diamond, TrendingUp, Eye, 
  Star, Clock, ChevronRight, ArrowUpRight, ArrowDownRight,
  FileText, Image, Calendar, Megaphone, DollarSign, 
  BarChart3, Settings, MessageSquare, Users, Home,
  ChevronDown, Check, X
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function TranslatorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'manga' | 'chapters' | 'analytics' | 'earnings' | 'promote'>('overview')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Mock data
  const stats = {
    totalManga: 12,
    totalChapters: 245,
    totalViews: 1250000,
    todayViews: 15420,
    totalEarnings: 2500000,
    todayEarnings: 125000,
    diamonds: 8500,
    followers: 12500,
  }

  const myMangas = [
    { id: 1, title: 'Solo Leveling', cover: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=200&h=300&fit=crop', chapters: 179, views: 450000, earnings: 850000, status: 'active' },
    { id: 2, title: 'Tower of God', cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=300&fit=crop', chapters: 520, views: 380000, earnings: 720000, status: 'active' },
    { id: 3, title: 'The Beginning After The End', cover: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=200&h=300&fit=crop', chapters: 156, views: 220000, earnings: 450000, status: 'paused' },
  ]

  const recentChapters = [
    { id: 1, manga: 'Solo Leveling', chapter: 179, views: 12500, earnings: 25000, status: 'published', date: '2 soat oldin' },
    { id: 2, manga: 'Tower of God', chapter: 520, views: 8400, earnings: 18000, status: 'published', date: '5 soat oldin' },
    { id: 3, manga: 'Solo Leveling', chapter: 178, views: 18200, earnings: 32000, status: 'published', date: '1 kun oldin' },
    { id: 4, manga: 'The Beginning After The End', chapter: 156, views: 6800, earnings: 12000, status: 'scheduled', date: 'Ertaga 10:00' },
  ]

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatMoney = (num: number) => {
    return `${(num / 1000).toFixed(0)}K so'm`
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />
      
      <main className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Tarjimon Paneli</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Manga va daromadlaringizni boshqaring</p>
            </div>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary text-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Yangi Manga
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <motion.div 
              className="glass rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/20">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Jami Manga</span>
              </div>
              <p className="text-xl font-bold">{stats.totalManga}</p>
              <p className="text-[10px] text-muted-foreground">{stats.totalChapters} bob</p>
            </motion.div>

            <motion.div 
              className="glass rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-success/20">
                  <Eye className="w-4 h-4 text-success" />
                </div>
                <span className="text-xs text-muted-foreground">Ko&apos;rishlar</span>
              </div>
              <p className="text-xl font-bold">{formatNumber(stats.totalViews)}</p>
              <div className="flex items-center gap-1 text-[10px] text-success">
                <ArrowUpRight className="w-3 h-3" />
                <span>+{formatNumber(stats.todayViews)} bugun</span>
              </div>
            </motion.div>

            <motion.div 
              className="glass rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-yellow-500/20">
                  <Diamond className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-xs text-muted-foreground">Olmozlar</span>
              </div>
              <p className="text-xl font-bold text-yellow-400">{formatNumber(stats.diamonds)}</p>
              <p className="text-[10px] text-muted-foreground">= {formatMoney(stats.diamonds * 100)}</p>
            </motion.div>

            <motion.div 
              className="glass rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-accent/20">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground">Obunachilar</span>
              </div>
              <p className="text-xl font-bold">{formatNumber(stats.followers)}</p>
              <div className="flex items-center gap-1 text-[10px] text-success">
                <ArrowUpRight className="w-3 h-3" />
                <span>+124 bu hafta</span>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'overview', label: 'Umumiy', icon: Home },
              { id: 'manga', label: 'Mangalarim', icon: BookOpen },
              { id: 'chapters', label: 'Boblar', icon: FileText },
              { id: 'analytics', label: 'Statistika', icon: BarChart3 },
              { id: 'earnings', label: 'Daromad', icon: DollarSign },
              { id: 'promote', label: 'Reklama', icon: Megaphone },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* My Mangas */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold">Mening Mangalarim</h2>
                  <Link href="/translator/manga">
                    <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
                      Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {myMangas.map((manga, index) => (
                    <motion.div
                      key={manga.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={manga.cover}
                        alt={manga.title}
                        className="w-12 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium truncate">{manga.title}</h3>
                          <span className={cn(
                            'px-1.5 py-0.5 rounded-full text-[9px] font-medium',
                            manga.status === 'active' ? 'bg-success/20 text-success' : 'bg-yellow-500/20 text-yellow-400'
                          )}>
                            {manga.status === 'active' ? 'Faol' : 'To\'xtatilgan'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span>{manga.chapters} bob</span>
                          <span>{formatNumber(manga.views)} ko&apos;rish</span>
                          <span className="text-yellow-400">{formatMoney(manga.earnings)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Bob
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Chapters */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold">So&apos;nggi Boblar</h2>
                  <Link href="/translator/chapters">
                    <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
                      Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentChapters.map((chapter, index) => (
                    <motion.div
                      key={chapter.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{chapter.manga}</span>
                          <span className="text-[10px] text-muted-foreground">#{chapter.chapter}</span>
                          <span className={cn(
                            'px-1.5 py-0.5 rounded-full text-[9px] font-medium',
                            chapter.status === 'published' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                          )}>
                            {chapter.status === 'published' ? 'Chop etildi' : 'Rejalashtirilgan'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                          <span>{formatNumber(chapter.views)} ko&apos;rish</span>
                          <span className="text-yellow-400">{formatMoney(chapter.earnings)}</span>
                          <span>{chapter.date}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Earnings Card */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h2 className="text-sm font-bold">Daromad</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                    <p className="text-[10px] text-muted-foreground mb-1">Bugun</p>
                    <p className="text-lg font-bold text-yellow-400">{formatMoney(stats.todayEarnings)}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground mb-1">Bu oy</p>
                    <p className="text-lg font-bold">{formatMoney(stats.totalEarnings)}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground mb-1">Yechib olish mumkin</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-success">{formatMoney(1850000)}</p>
                      <Button size="sm" className="h-7 text-xs bg-success hover:bg-success/90">
                        Yechish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass rounded-xl p-4">
                <h2 className="text-sm font-bold mb-3">Tezkor Amallar</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs h-9">
                    <Upload className="w-4 h-4 mr-2" />
                    Bob Yuklash
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-9">
                    <Megaphone className="w-4 h-4 mr-2" />
                    Reklama Qilish
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-9">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Sharhlar
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-9">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Batafsil Statistika
                  </Button>
                </div>
              </div>

              {/* Promotion */}
              <div className="glass rounded-xl p-4 border border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-bold">Reklama</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Mangangizni bosh sahifada reklama qiling va ko&apos;proq o&apos;quvchilarni jalb qiling!
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">1 kun</span>
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-400" />
                      <span className="font-medium">100</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">1 hafta</span>
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-400" />
                      <span className="font-medium">500</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">1 oy</span>
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-400" />
                      <span className="font-medium">1,500</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full text-xs bg-gradient-to-r from-primary to-accent">
                  Reklama Qilish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-strong rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Yangi Manga Qo&apos;shish</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Manga Nomi</label>
                  <input
                    type="text"
                    placeholder="Masalan: Solo Leveling"
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Muqova Rasmi</label>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Rasm yuklash uchun bosing</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tavsif</label>
                  <textarea
                    placeholder="Manga haqida qisqacha..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Turi</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>Manhwa</option>
                      <option>Manga</option>
                      <option>Manhua</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Holat</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>Davom etmoqda</option>
                      <option>Tugallangan</option>
                    </select>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-accent">
                  <Upload className="w-4 h-4 mr-2" />
                  Manga Qo&apos;shish
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
