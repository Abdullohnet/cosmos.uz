'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, BookOpen, Diamond, TrendingUp, DollarSign, 
  Shield, AlertTriangle, ChevronRight, ArrowUpRight, ArrowDownRight,
  Settings, MessageSquare, BarChart3, Home, UserCheck, UserX,
  Megaphone, Calendar, Flag, Ban, Eye, Check, X, Search,
  Crown, Percent, Gift, Flame, FileText
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'manga' | 'translators' | 'reports' | 'economy' | 'events'>('overview')

  // Mock data
  const stats = {
    totalUsers: 125000,
    newUsersToday: 342,
    activeUsers: 18500,
    totalManga: 850,
    totalChapters: 25000,
    totalViews: 15000000,
    todayViews: 125000,
    totalRevenue: 850000000,
    todayRevenue: 12500000,
    totalDiamondsSold: 2500000,
    pendingTranslators: 12,
    pendingReports: 8,
  }

  const pendingTranslators = [
    { id: 1, name: 'Ali Karimov', email: 'ali@example.com', portfolio: '15 manga', experience: '2 yil', date: '2 soat oldin' },
    { id: 2, name: 'Sardor Tursunov', email: 'sardor@example.com', portfolio: '8 manga', experience: '1 yil', date: '5 soat oldin' },
    { id: 3, name: 'Dilshod Rahimov', email: 'dilshod@example.com', portfolio: '22 manga', experience: '3 yil', date: '1 kun oldin' },
  ]

  const recentReports = [
    { id: 1, type: 'spam', target: 'Foydalanuvchi: toxic_user123', reporter: 'manga_fan', date: '1 soat oldin', status: 'pending' },
    { id: 2, type: 'copyright', target: 'Manga: Fake Solo Leveling', reporter: 'official_team', date: '3 soat oldin', status: 'pending' },
    { id: 3, type: 'inappropriate', target: 'Sharh: #12345', reporter: 'user_456', date: '5 soat oldin', status: 'resolved' },
  ]

  const topManga = [
    { id: 1, title: 'Solo Leveling', views: 2500000, revenue: 45000000, chapters: 179 },
    { id: 2, title: 'Tower of God', views: 1800000, revenue: 32000000, chapters: 520 },
    { id: 3, title: 'The Beginning After The End', views: 1200000, revenue: 24000000, chapters: 156 },
  ]

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatMoney = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M so'm`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K so'm`
    return `${num} so'm`
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
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Panel</h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Platformani to&apos;liq boshqaring</p>
            </div>
            <div className="flex items-center gap-2">
              {stats.pendingTranslators > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <UserCheck className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs text-yellow-400">{stats.pendingTranslators} kutmoqda</span>
                </div>
              )}
              {stats.pendingReports > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                  <Flag className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs text-red-400">{stats.pendingReports} shikoyat</span>
                </div>
              )}
            </div>
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
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Foydalanuvchilar</span>
              </div>
              <p className="text-xl font-bold">{formatNumber(stats.totalUsers)}</p>
              <div className="flex items-center gap-1 text-[10px] text-success">
                <ArrowUpRight className="w-3 h-3" />
                <span>+{stats.newUsersToday} bugun</span>
              </div>
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
                <span className="text-xs text-muted-foreground">Olmoz Sotildi</span>
              </div>
              <p className="text-xl font-bold text-yellow-400">{formatNumber(stats.totalDiamondsSold)}</p>
              <p className="text-[10px] text-muted-foreground">= {formatMoney(stats.totalDiamondsSold * 100)}</p>
            </motion.div>

            <motion.div 
              className="glass rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-accent/20">
                  <DollarSign className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground">Daromad</span>
              </div>
              <p className="text-xl font-bold">{formatMoney(stats.totalRevenue)}</p>
              <div className="flex items-center gap-1 text-[10px] text-success">
                <ArrowUpRight className="w-3 h-3" />
                <span>+{formatMoney(stats.todayRevenue)} bugun</span>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'overview', label: 'Umumiy', icon: Home },
              { id: 'users', label: 'Foydalanuvchilar', icon: Users },
              { id: 'manga', label: 'Manga', icon: BookOpen },
              { id: 'translators', label: 'Tarjimonlar', icon: UserCheck },
              { id: 'reports', label: 'Shikoyatlar', icon: Flag },
              { id: 'economy', label: 'Iqtisodiyot', icon: DollarSign },
              { id: 'events', label: 'Tadbirlar', icon: Calendar },
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
              {/* Pending Translators */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold">Kutilayotgan Tarjimonlar</h2>
                    <span className="px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px]">
                      {pendingTranslators.length}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
                    Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {pendingTranslators.map((translator, index) => (
                    <motion.div
                      key={translator.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{translator.name}</span>
                          <span className="text-[10px] text-muted-foreground">{translator.email}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                          <span>{translator.portfolio}</span>
                          <span>{translator.experience}</span>
                          <span>{translator.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" className="h-7 text-xs bg-success hover:bg-success/90">
                          <Check className="w-3 h-3 mr-1" />
                          Tasdiqlash
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs">
                          <X className="w-3 h-3 mr-1" />
                          Rad
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Reports */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold">So&apos;nggi Shikoyatlar</h2>
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px]">
                      {recentReports.filter(r => r.status === 'pending').length} yangi
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
                    Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {recentReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'px-1.5 py-0.5 rounded text-[9px] font-medium',
                            report.type === 'spam' && 'bg-yellow-500/20 text-yellow-400',
                            report.type === 'copyright' && 'bg-red-500/20 text-red-400',
                            report.type === 'inappropriate' && 'bg-orange-500/20 text-orange-400',
                          )}>
                            {report.type === 'spam' ? 'Spam' : report.type === 'copyright' ? 'Mualliflik huquqi' : 'Noto\'g\'ri kontent'}
                          </span>
                          <span className={cn(
                            'px-1.5 py-0.5 rounded text-[9px] font-medium',
                            report.status === 'pending' ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'
                          )}>
                            {report.status === 'pending' ? 'Kutilmoqda' : 'Hal qilindi'}
                          </span>
                        </div>
                        <p className="text-xs mt-1">{report.target}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Xabar bergan: {report.reporter} • {report.date}
                        </p>
                      </div>
                      {report.status === 'pending' && (
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Ko&apos;rish
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7 text-xs">
                            <Ban className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Top Manga */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold">Top Manga</h2>
                  <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
                    Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {topManga.map((manga, index) => (
                    <motion.div
                      key={manga.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px]',
                          index === 0 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
                          index === 1 && 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
                          index === 2 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
                        )}>
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{manga.title}</p>
                          <p className="text-[10px] text-muted-foreground">{manga.chapters} bob</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">{formatNumber(manga.views)} ko&apos;rish</p>
                        <p className="text-[10px] text-yellow-400">{formatMoney(manga.revenue)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="glass rounded-xl p-4">
                <h2 className="text-sm font-bold mb-3">Tezkor Amallar</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs h-9">
                    <Megaphone className="w-4 h-4 mr-2" />
                    E&apos;lon Yaratish
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-9">
                    <Gift className="w-4 h-4 mr-2" />
                    Tadbir Yaratish
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-9">
                    <Percent className="w-4 h-4 mr-2" />
                    Chegirma Qo&apos;shish
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-9">
                    <Crown className="w-4 h-4 mr-2" />
                    Premium Sozlamalari
                  </Button>
                </div>
              </div>

              {/* Economy Settings */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Diamond className="w-4 h-4 text-yellow-400" />
                  <h2 className="text-sm font-bold">Olmoz Iqtisodiyoti</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">1 Olmoz narxi</span>
                    <span className="text-xs font-medium">100 so&apos;m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Platform ulushi</span>
                    <span className="text-xs font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Tarjimon ulushi</span>
                    <span className="text-xs font-medium text-success">80%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Minimal yechish</span>
                    <span className="text-xs font-medium">100,000 so&apos;m</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                  <Settings className="w-3 h-3 mr-1.5" />
                  Sozlamalar
                </Button>
              </div>

              {/* Active Promotions */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <h2 className="text-sm font-bold">Faol Aksiyalar</h2>
                </div>
                
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Yoz Chegirmasi</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-success/20 text-success text-[9px]">Faol</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">50% chegirma • 5 kun qoldi</p>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Yangi Foydalanuvchi</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-success/20 text-success text-[9px]">Faol</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">100 bonus olmoz • Doimiy</p>
                  </div>
                </div>
                
                <Button size="sm" className="w-full mt-3 text-xs bg-gradient-to-r from-primary to-accent">
                  <Plus className="w-3 h-3 mr-1.5" />
                  Yangi Aksiya
                </Button>
              </div>

              {/* Platform Stats */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-bold">Platform Statistikasi</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Faol foydalanuvchilar</span>
                      <span className="font-medium">{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Premium foydalanuvchilar</span>
                      <span className="font-medium">8.5%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: '8.5%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Server yuklamasi</span>
                      <span className="font-medium text-success">32%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full bg-success"
                        initial={{ width: 0 }}
                        animate={{ width: '32%' }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
