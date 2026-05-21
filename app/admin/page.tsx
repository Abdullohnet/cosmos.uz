'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BookOpen, Diamond, TrendingUp, DollarSign,
  Shield, ArrowUpRight, Settings, BarChart3, Home,
  UserCheck, Flag, Ban, Eye, Check, X, Search,
  Crown, Percent, Gift, Flame, Plus, ChevronRight,
  Edit2, Trash2, ToggleLeft, ToggleRight, AlertCircle,
  Megaphone, Calendar, FileText, Mail, Phone, Globe
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TranslatorApplication, Discount } from '@/lib/store'

// Mock applications
const mockApplications: TranslatorApplication[] = [
  { id: '1', fullName: 'Ali Karimov', email: 'ali@example.com', phone: '+998901234567', telegram: '@ali_uz', languages: ['Koreys', 'Ingliz'], experience: '2-3 yil', portfolioLinks: 't.me/ali_trans', previousManga: 'Solo Leveling 1-50', genres: ['Action', 'Fantasy'], motivation: 'O\'zbek o\'quvchilarga sifatli tarjima yetkazmoqchiman. Koreyscha yaxshi bilaman...', sampleText: 'Namuna tarjima...', status: 'pending', submittedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '2', fullName: 'Sardor Tursunov', email: 'sardor@example.com', phone: '+998911234567', telegram: '@sardor_t', languages: ['Yapon', 'Ingliz'], experience: '1-2 yil', portfolioLinks: '', previousManga: 'Demon Slayer 1-20 bob', genres: ['Action', 'Drama', 'Horror'], motivation: 'Yapon mangasini o\'zbek tiliga o\'girish orzuim edi...', sampleText: '', status: 'pending', submittedAt: new Date(Date.now() - 18000000).toISOString() },
  { id: '3', fullName: 'Dilshod Rahimov', email: 'dilshod@example.com', phone: '+998931234567', telegram: '@dilshod_manga', languages: ['Xitoy', 'Ingliz', 'Koreys'], experience: '3+ yil', portfolioLinks: 'youtube.com/dilshod', previousManga: '22 ta manga, 500+ bob', genres: ['Fantasy', 'Isekai', 'Romance'], motivation: 'Professional tarjimonman. O\'zbekistonda manga madaniyatini rivojlantirmoqchiman...', sampleText: 'Yaxshi namuna tarjima...', status: 'approved', submittedAt: new Date(Date.now() - 86400000).toISOString(), reviewedAt: new Date(Date.now() - 43200000).toISOString() },
  { id: '4', fullName: 'Zulfiya Xasanova', email: 'zulfiya@example.com', phone: '+998901112233', telegram: '@zulfiya_tr', languages: ['Koreys'], experience: 'Yangi boshlovchi (0-6 oy)', portfolioLinks: '', previousManga: 'Hali tarjima qilmaganman', genres: ['Romance', 'Slice of Life'], motivation: 'Koreyscha o\'qib tugatdim, endi amaliyot uchun...', sampleText: '', status: 'rejected', submittedAt: new Date(Date.now() - 172800000).toISOString(), reviewedAt: new Date(Date.now() - 86400000).toISOString(), reviewNote: 'Tajriba yetarli emas, keyinroq qayta ariza topshiring.' },
]

const mockDiscounts: Discount[] = [
  { id: '1', name: 'Yoz Chegirmasi', code: 'SUMMER50', type: 'percent', value: 50, target: 'all', startDate: '2025-06-01', endDate: '2025-08-31', maxUses: 1000, usedCount: 342, isActive: true },
  { id: '2', name: 'Yangi Foydalanuvchi', code: 'NEWUSER', type: 'fixed', value: 100, target: 'diamonds', startDate: '2025-01-01', endDate: '2025-12-31', maxUses: 9999, usedCount: 5820, isActive: true },
  { id: '3', name: 'Pro Obuna', code: 'PRO30', type: 'percent', value: 30, target: 'pro', startDate: '2025-05-01', endDate: '2025-05-31', maxUses: 500, usedCount: 500, isActive: false },
]

const mockUsers = [
  { id: '1', username: 'MangaKing', email: 'king@example.com', level: 99, role: 'translator', subscription: 'proplus', joinDate: '2024-01-01', status: 'active' },
  { id: '2', username: 'OtakuMaster', email: 'otaku@example.com', level: 87, role: 'user', subscription: 'pro', joinDate: '2024-02-15', status: 'active' },
  { id: '3', username: 'WeebLord', email: 'weeb@example.com', level: 76, role: 'user', subscription: 'free', joinDate: '2024-03-20', status: 'banned' },
  { id: '4', username: 'ReadingNinja', email: 'ninja@example.com', level: 65, role: 'user', subscription: 'standard', joinDate: '2024-04-10', status: 'active' },
  { id: '5', username: 'AnimeAddict', email: 'anime@example.com', level: 52, role: 'translator', subscription: 'pro', joinDate: '2024-05-05', status: 'active' },
]

type AdminTab = 'overview' | 'applications' | 'users' | 'discounts' | 'economy' | 'promotions' | 'reports'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [applications, setApplications] = useState(mockApplications)
  const [discounts, setDiscounts] = useState(mockDiscounts)
  const [users, setUsers] = useState(mockUsers)
  const [selectedApp, setSelectedApp] = useState<TranslatorApplication | null>(null)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const [economySettings, setEconomySettings] = useState({
    diamondPrice: 100, platformCut: 20, translatorCut: 80, minWithdraw: 100000,
    dailyLoginReward: 10, referralBonus: 50,
  })
  const [newDiscount, setNewDiscount] = useState({ name: '', code: '', type: 'percent', value: '', target: 'all', startDate: '', endDate: '', maxUses: '' })
  const [econSaved, setEconSaved] = useState(false)

  const stats = { totalUsers: 125000, newUsersToday: 342, activeUsers: 18500, totalManga: 850, totalViews: 15000000, todayViews: 125000, totalRevenue: 850000000, todayRevenue: 12500000, totalDiamondsSold: 2500000, pendingApplications: applications.filter(a => a.status === 'pending').length }

  const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n.toString()
  const fmtMoney = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M so'm` : `${(n/1000).toFixed(0)}K so'm`
  const fmtTime = (iso: string) => { const h = Math.floor((Date.now()-new Date(iso).getTime())/3600000); return h < 24 ? `${h} soat oldin` : `${Math.floor(h/24)} kun oldin` }

  const approveApp = (id: string) => setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved', reviewedAt: new Date().toISOString() } : a))
  const rejectApp = (id: string) => { setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected', reviewedAt: new Date().toISOString(), reviewNote: rejectNote || 'Admin tomonidan rad etildi.' } : a)); setShowRejectModal(null); setRejectNote('') }
  const toggleDiscount = (id: string) => setDiscounts(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d))
  const deleteDiscount = (id: string) => setDiscounts(prev => prev.filter(d => d.id !== id))
  const toggleUserBan = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u))
  const addDiscount = () => {
    if (!newDiscount.name || !newDiscount.code || !newDiscount.value) return
    setDiscounts(prev => [...prev, { id: Date.now().toString(), name: newDiscount.name, code: newDiscount.code, type: newDiscount.type as 'percent'|'fixed', value: Number(newDiscount.value), target: newDiscount.target as any, startDate: newDiscount.startDate || new Date().toISOString().split('T')[0], endDate: newDiscount.endDate || '2099-12-31', maxUses: Number(newDiscount.maxUses) || 9999, usedCount: 0, isActive: true }])
    setNewDiscount({ name: '', code: '', type: 'percent', value: '', target: 'all', startDate: '', endDate: '', maxUses: '' })
    setShowDiscountForm(false)
  }
  const saveEconomy = () => { setEconSaved(true); setTimeout(() => setEconSaved(false), 2000) }

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))

  const tabs: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: 'overview', label: 'Umumiy', icon: Home },
    { id: 'applications', label: 'Arizalar', icon: UserCheck, badge: stats.pendingApplications },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users },
    { id: 'discounts', label: 'Chegirmalar', icon: Percent },
    { id: 'economy', label: 'Iqtisodiyot', icon: Diamond },
    { id: 'promotions', label: 'Aksiyalar', icon: Megaphone },
    { id: 'reports', label: 'Shikoyatlar', icon: Flag },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />

      <main className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Platformani to'liq boshqaring</p>
              </div>
            </div>
            {stats.pendingApplications > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 cursor-pointer" onClick={() => setActiveTab('applications')}>
                <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">{stats.pendingApplications} yangi ariza</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Foydalanuvchilar', value: fmt(stats.totalUsers), sub: `+${stats.newUsersToday} bugun`, icon: Users, color: 'primary' },
              { label: 'Ko\'rishlar', value: fmt(stats.totalViews), sub: `+${fmt(stats.todayViews)} bugun`, icon: Eye, color: 'success' },
              { label: 'Olmozlar', value: fmt(stats.totalDiamondsSold), sub: `= ${fmtMoney(stats.totalDiamondsSold * 100)}`, icon: Diamond, color: 'yellow' },
              { label: 'Daromad', value: fmtMoney(stats.totalRevenue), sub: `+${fmtMoney(stats.todayRevenue)} bugun`, icon: DollarSign, color: 'accent' },
            ].map((s, i) => (
              <motion.div key={s.label} className="glass rounded-xl p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('p-1.5 rounded-lg', s.color === 'yellow' ? 'bg-yellow-500/20' : `bg-${s.color}/20`)}>
                    <s.icon className={cn('w-4 h-4', s.color === 'yellow' ? 'text-yellow-400' : `text-${s.color}`)} />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className={cn('text-xl font-bold', s.color === 'yellow' && 'text-yellow-400')}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors relative',
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary')}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.badge ? <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-yellow-400 text-black text-[9px] font-bold">{tab.badge}</span> : null}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  {/* Pending apps */}
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold">Kutilayotgan Arizalar</h2>
                        <span className="px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px]">{stats.pendingApplications}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs text-primary h-7" onClick={() => setActiveTab('applications')}>
                        Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {applications.filter(a => a.status === 'pending').slice(0, 3).map((app, i) => (
                        <motion.div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{app.fullName}</p>
                            <p className="text-[10px] text-muted-foreground">{app.languages.join(', ')} • {app.experience} • {fmtTime(app.submittedAt)}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Button size="sm" className="h-7 text-xs bg-success hover:bg-success/90" onClick={() => approveApp(app.id)}><Check className="w-3 h-3 mr-1" />Tasdiqlash</Button>
                            <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => setShowRejectModal(app.id)}><X className="w-3 h-3" /></Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="glass rounded-xl p-4">
                    <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Platform Statistikasi</h2>
                    {[
                      { label: 'Faol foydalanuvchilar', val: (stats.activeUsers/stats.totalUsers*100).toFixed(1), color: 'from-primary to-accent' },
                      { label: 'Premium foydalanuvchilar', val: '8.5', color: 'from-yellow-400 to-orange-500' },
                      { label: 'Server yuklamasi', val: '32', color: 'bg-success' },
                    ].map(b => (
                      <div key={b.label} className="mb-3">
                        <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{b.label}</span><span className="font-medium">{b.val}%</span></div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <motion.div className={cn('h-full rounded-full bg-gradient-to-r', b.color)} initial={{ width: 0 }} animate={{ width: `${b.val}%` }} transition={{ duration: 1 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <div className="glass rounded-xl p-4">
                    <h2 className="text-sm font-bold mb-3">Tezkor Amallar</h2>
                    <div className="space-y-2">
                      {[
                        { icon: Percent, label: 'Chegirma Qo\'shish', tab: 'discounts' },
                        { icon: Megaphone, label: 'Aksiya Yaratish', tab: 'promotions' },
                        { icon: Users, label: 'Foydalanuvchilar', tab: 'users' },
                        { icon: Diamond, label: 'Iqtisodiyot', tab: 'economy' },
                      ].map(a => (
                        <Button key={a.label} variant="outline" className="w-full justify-start text-xs h-9" onClick={() => setActiveTab(a.tab as AdminTab)}>
                          <a.icon className="w-4 h-4 mr-2" />{a.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3"><Flame className="w-4 h-4 text-orange-400" /><h2 className="text-sm font-bold">Faol Aksiyalar</h2></div>
                    {discounts.filter(d => d.isActive).map(d => (
                      <div key={d.id} className="p-2 rounded-lg bg-secondary/30 mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">{d.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/20 text-success">Faol</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{d.type === 'percent' ? `${d.value}% chegirma` : `${d.value} olmoz bonus`} • {d.code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* APPLICATIONS */}
            {activeTab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  {['pending', 'approved', 'rejected'].map(s => (
                    <div key={s} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                      s === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : s === 'approved' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive')}>
                      {s === 'pending' ? 'Kutmoqda' : s === 'approved' ? 'Tasdiqlangan' : 'Rad etilgan'}:
                      <span className="font-bold">{applications.filter(a => a.status === s).length}</span>
                    </div>
                  ))}
                </div>

                {applications.map((app, i) => (
                  <motion.div key={app.id} className="glass rounded-xl overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{app.fullName}</h3>
                            <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium',
                              app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              app.status === 'approved' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive')}>
                              {app.status === 'pending' ? 'Kutmoqda' : app.status === 'approved' ? 'Tasdiqlangan' : 'Rad etilgan'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{app.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{app.phone}</span>
                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{app.languages.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>Tajriba: <span className="text-foreground">{app.experience}</span></span>
                            <span>•</span>
                            <span>{fmtTime(app.submittedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}>
                            <Eye className="w-3 h-3 mr-1" />Ko'rish
                          </Button>
                          {app.status === 'pending' && (
                            <>
                              <Button size="sm" className="h-8 text-xs bg-success hover:bg-success/90" onClick={() => approveApp(app.id)}><Check className="w-3 h-3 mr-1" />Tasdiqlash</Button>
                              <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => setShowRejectModal(app.id)}><X className="w-3 h-3 mr-1" />Rad</Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {selectedApp?.id === app.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-border/30 mt-4 pt-4 space-y-3">
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-[10px] text-muted-foreground mb-1">Ilgari tarjima qilganlar</p>
                                <p className="text-xs">{app.previousManga}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-[10px] text-muted-foreground mb-1">Janrlar</p>
                                <p className="text-xs">{app.genres.join(', ')}</p>
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30">
                              <p className="text-[10px] text-muted-foreground mb-1">Motivatsiya xati</p>
                              <p className="text-xs leading-relaxed">{app.motivation}</p>
                            </div>
                            {app.sampleText && (
                              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-[10px] text-primary mb-1">Namuna tarjima</p>
                                <p className="text-xs leading-relaxed">{app.sampleText}</p>
                              </div>
                            )}
                            {app.reviewNote && (
                              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <p className="text-[10px] text-destructive mb-1">Rad etish sababi</p>
                                <p className="text-xs">{app.reviewNote}</p>
                              </div>
                            )}
                            {app.portfolioLinks && (
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-[10px] text-muted-foreground mb-1">Portfolio</p>
                                <p className="text-xs text-primary">{app.portfolioLinks}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Foydalanuvchi qidirish..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="glass rounded-xl overflow-hidden">
                  {filteredUsers.map((u, i) => (
                    <div key={u.id} className={cn('flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors', i !== 0 && 'border-t border-border/30')}>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {u.username[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{u.username}</p>
                          <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] font-medium',
                            u.role === 'translator' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground')}>
                            {u.role === 'translator' ? 'Tarjimon' : 'Foydalanuvchi'}
                          </span>
                          <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] font-medium',
                            u.subscription === 'free' ? 'bg-secondary text-muted-foreground' :
                            u.subscription === 'proplus' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-primary/20 text-primary')}>
                            {u.subscription.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{u.email} • Daraja {u.level}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={cn('px-2 py-1 rounded-lg text-[10px] font-medium', u.status === 'active' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive')}>
                          {u.status === 'active' ? 'Faol' : 'Bloklangan'}
                        </span>
                        <Button size="sm" variant={u.status === 'active' ? 'destructive' : 'outline'} className="h-7 text-xs" onClick={() => toggleUserBan(u.id)}>
                          <Ban className="w-3 h-3 mr-1" />{u.status === 'active' ? 'Blok' : 'Ochish'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* DISCOUNTS */}
            {activeTab === 'discounts' && (
              <motion.div key="discounts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex justify-end">
                  <Button className="gap-2 bg-gradient-to-r from-primary to-accent" onClick={() => setShowDiscountForm(!showDiscountForm)}>
                    <Plus className="w-4 h-4" />Yangi Chegirma
                  </Button>
                </div>

                {/* New discount form */}
                <AnimatePresence>
                  {showDiscountForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="glass rounded-xl p-5 border border-primary/30 space-y-4">
                        <h3 className="font-semibold text-sm flex items-center gap-2"><Percent className="w-4 h-4 text-primary" />Yangi Chegirma Yaratish</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            { key: 'name', label: 'Chegirma nomi', placeholder: 'Yoz Chegirmasi' },
                            { key: 'code', label: 'Kod', placeholder: 'SUMMER50' },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                              <input value={newDiscount[f.key as keyof typeof newDiscount]} onChange={e => setNewDiscount(p => ({...p, [f.key]: e.target.value.toUpperCase()}))}
                                placeholder={f.placeholder} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                            </div>
                          ))}
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Tur</label>
                            <select value={newDiscount.type} onChange={e => setNewDiscount(p => ({...p, type: e.target.value}))}
                              className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                              <option value="percent">Foiz (%)</option>
                              <option value="fixed">Sobit (olmoz)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Qiymat</label>
                            <input type="number" value={newDiscount.value} onChange={e => setNewDiscount(p => ({...p, value: e.target.value}))}
                              placeholder={newDiscount.type === 'percent' ? '50' : '100'} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Qo'llaniladigan joy</label>
                            <select value={newDiscount.target} onChange={e => setNewDiscount(p => ({...p, target: e.target.value}))}
                              className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                              <option value="all">Hammasi</option>
                              <option value="standard">Standard obuna</option>
                              <option value="pro">Pro obuna</option>
                              <option value="proplus">Pro+ obuna</option>
                              <option value="diamonds">Olmoz paketlar</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Boshlanish sanasi</label>
                            <input type="date" value={newDiscount.startDate} onChange={e => setNewDiscount(p => ({...p, startDate: e.target.value}))}
                              className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Tugash sanasi</label>
                            <input type="date" value={newDiscount.endDate} onChange={e => setNewDiscount(p => ({...p, endDate: e.target.value}))}
                              className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Max foydalanish soni</label>
                            <input type="number" value={newDiscount.maxUses} onChange={e => setNewDiscount(p => ({...p, maxUses: e.target.value}))}
                              placeholder="9999" className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowDiscountForm(false)}>Bekor</Button>
                          <Button className="bg-gradient-to-r from-primary to-accent" onClick={addDiscount}>Saqlash</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Discount list */}
                <div className="glass rounded-xl overflow-hidden">
                  {discounts.map((d, i) => (
                    <div key={d.id} className={cn('flex items-center gap-4 p-4', i !== 0 && 'border-t border-border/30')}>
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0', d.isActive ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground')}>
                        {d.type === 'percent' ? `${d.value}%` : `+${d.value}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{d.name}</p>
                          <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-mono">{d.code}</span>
                          {!d.isActive && <span className="text-[10px] text-muted-foreground">Tugagan</span>}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                          <span>{d.target === 'all' ? 'Hammaga' : d.target + ' uchun'}</span>
                          <span>{d.usedCount}/{d.maxUses} foydalanilgan</span>
                          <span>{d.startDate} → {d.endDate}</span>
                        </div>
                        <div className="mt-1 h-1 rounded-full bg-secondary overflow-hidden w-32">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((d.usedCount/d.maxUses)*100, 100)}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => toggleDiscount(d.id)} className={cn('transition-colors', d.isActive ? 'text-success' : 'text-muted-foreground')}>
                          {d.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                        </button>
                        <button onClick={() => deleteDiscount(d.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ECONOMY */}
            {activeTab === 'economy' && (
              <motion.div key="economy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl">
                <div className="glass rounded-xl p-6 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Diamond className="w-5 h-5 text-yellow-400" />
                    <h2 className="font-bold">Olmoz Iqtisodiyoti Sozlamalari</h2>
                  </div>
                  {[
                    { key: 'diamondPrice', label: '1 Olmoz narxi (so\'m)', min: 50, max: 500 },
                    { key: 'platformCut', label: 'Platform ulushi (%)', min: 5, max: 50 },
                    { key: 'translatorCut', label: 'Tarjimon ulushi (%)', min: 50, max: 95 },
                    { key: 'minWithdraw', label: 'Minimal yechish summasi (so\'m)', min: 10000, max: 1000000 },
                    { key: 'dailyLoginReward', label: 'Kunlik kirish mukofoti (olmoz)', min: 1, max: 100 },
                    { key: 'referralBonus', label: 'Referal bonus (olmoz)', min: 10, max: 500 },
                  ].map(f => (
                    <div key={f.key}>
                      <div className="flex justify-between text-sm mb-2">
                        <label className="text-muted-foreground">{f.label}</label>
                        <span className="font-bold text-primary">{economySettings[f.key as keyof typeof economySettings].toLocaleString()}</span>
                      </div>
                      <input type="range" min={f.min} max={f.max}
                        value={economySettings[f.key as keyof typeof economySettings]}
                        onChange={e => setEconomySettings(p => ({...p, [f.key]: Number(e.target.value)}))}
                        className="w-full accent-primary" />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                        <span>{f.min.toLocaleString()}</span><span>{f.max.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <p className="text-xs text-muted-foreground mb-2">Hisoblash: 1000 olmoz sotilganda</p>
                    <div className="flex justify-between text-sm">
                      <span>Platform oladi:</span><span className="font-bold">{((economySettings.diamondPrice * 1000 * economySettings.platformCut / 100)/1000).toFixed(0)}K so'm</span>
                    </div>
                    <div className="flex justify-between text-sm text-success">
                      <span>Tarjimon oladi:</span><span className="font-bold">{((economySettings.diamondPrice * 1000 * economySettings.translatorCut / 100)/1000).toFixed(0)}K so'm</span>
                    </div>
                  </div>
                  <Button className={cn('w-full bg-gradient-to-r from-primary to-accent transition-all', econSaved && 'from-success to-success')} onClick={saveEconomy}>
                    {econSaved ? <><Check className="w-4 h-4 mr-2" />Saqlandi!</> : 'Saqlash'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* PROMOTIONS */}
            {activeTab === 'promotions' && (
              <motion.div key="promotions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Megaphone, title: 'E\'lon yaratish', desc: 'Foydalanuvchilarga e\'lon yuborish', color: 'from-primary to-accent' },
                    { icon: Gift, title: 'Tadbir yaratish', desc: 'Mavsumiy musobaqalar va tadbirlar', color: 'from-yellow-500 to-orange-500' },
                    { icon: Flame, title: 'Trendi boshqarish', desc: 'Qaysi manga trending bo\'lishini belgilash', color: 'from-orange-500 to-red-500' },
                    { icon: Crown, title: 'Premium aksiya', desc: 'Obunalarga maxsus chegirma berish', color: 'from-purple-500 to-pink-500' },
                    { icon: Diamond, title: 'Olmoz bonusi', desc: 'Barcha foydalanuvchilarga olmoz berish', color: 'from-cyan-500 to-blue-500' },
                    { icon: Calendar, title: 'Mavsumiy tema', desc: 'Sayt dizaynini mavsumga moslash', color: 'from-green-500 to-teal-500' },
                  ].map((item, i) => (
                    <motion.div key={item.title} className="glass rounded-xl p-5 cursor-pointer hover:ring-1 hover:ring-primary/50 transition-all"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}>
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br', item.color)}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* REPORTS */}
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="glass rounded-xl overflow-hidden">
                  {[
                    { id: 1, type: 'spam', target: 'toxic_user123', reporter: 'manga_fan', date: '1 soat oldin', status: 'pending' },
                    { id: 2, type: 'copyright', target: 'Fake Solo Leveling manga', reporter: 'official_team', date: '3 soat oldin', status: 'pending' },
                    { id: 3, type: 'inappropriate', target: 'Sharh #12345', reporter: 'user_456', date: '5 soat oldin', status: 'resolved' },
                  ].map((r, i) => (
                    <div key={r.id} className={cn('flex items-center justify-between p-4', i !== 0 && 'border-t border-border/30')}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', r.type === 'spam' ? 'bg-yellow-500/20 text-yellow-400' : r.type === 'copyright' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400')}>
                            {r.type === 'spam' ? 'Spam' : r.type === 'copyright' ? 'Mualliflik' : 'Noto\'g\'ri'}
                          </span>
                          <span className={cn('px-2 py-0.5 rounded text-[10px]', r.status === 'pending' ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success')}>
                            {r.status === 'pending' ? 'Kutmoqda' : 'Hal qilindi'}
                          </span>
                        </div>
                        <p className="text-sm">{r.target}</p>
                        <p className="text-[10px] text-muted-foreground">{r.reporter} • {r.date}</p>
                      </div>
                      {r.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs"><Eye className="w-3 h-3 mr-1" />Ko'rish</Button>
                          <Button size="sm" variant="destructive" className="h-7 text-xs"><Ban className="w-3 h-3" /></Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowRejectModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md glass-strong rounded-2xl p-6" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold mb-3">Rad etish sababi</h3>
              <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                placeholder="Nima uchun rad etilayotganini yozing (ixtiyoriy)..."
                rows={4} className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4" />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowRejectModal(null)}>Bekor</Button>
                <Button variant="destructive" onClick={() => rejectApp(showRejectModal)}><X className="w-4 h-4 mr-1" />Rad etish</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
