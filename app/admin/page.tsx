'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BookOpen, Diamond, TrendingUp, DollarSign,
  Shield, Settings, BarChart3,
  UserCheck, Flag, Ban, Eye, Check, X, Search,
  Crown, Percent, Gift, Flame, Plus, ChevronRight,
  Edit2, Trash2, AlertCircle,
  Megaphone, FileText, Mail, Phone, Globe,
  Activity, Server, Zap, ArrowUp, ArrowDown,
  CheckCircle2, XCircle, Clock, RefreshCw, ChevronDown,
  LayoutDashboard, LogOut, Menu
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TranslatorApplication, Discount } from '@/lib/store'
import { apiGetAdminStats } from '@/lib/api'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockApplications: TranslatorApplication[] = [
  { id: '1', fullName: 'Ali Karimov', email: 'ali@example.com', phone: '+998901234567', telegram: '@ali_uz', languages: ['Koreys', 'Ingliz'], experience: '2-3 yil', portfolioLinks: 't.me/ali_trans', previousManga: 'Solo Leveling 1-50', genres: ['Action', 'Fantasy'], motivation: "O'zbek o'quvchilarga sifatli tarjima yetkazmoqchiman. Koreyscha yaxshi bilaman va 2 yildan beri tarjima qilyapman.", sampleText: 'Namuna tarjima matn...', status: 'pending', submittedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '2', fullName: 'Sardor Tursunov', email: 'sardor@example.com', phone: '+998911234567', telegram: '@sardor_t', languages: ['Yapon', 'Ingliz'], experience: '1-2 yil', portfolioLinks: '', previousManga: 'Demon Slayer 1-20 bob', genres: ['Action', 'Drama', 'Horror'], motivation: "Yapon mangasini o'zbek tiliga o'girish orzuim edi. Yaponchani B2 darajasida bilaman.", sampleText: '', status: 'pending', submittedAt: new Date(Date.now() - 18000000).toISOString() },
  { id: '3', fullName: 'Dilshod Rahimov', email: 'dilshod@example.com', phone: '+998931234567', telegram: '@dilshod_manga', languages: ['Xitoy', 'Ingliz', 'Koreys'], experience: '3+ yil', portfolioLinks: 'youtube.com/dilshod', previousManga: '22 ta manga, 500+ bob', genres: ['Fantasy', 'Isekai', 'Romance'], motivation: "Professional tarjimonman. O'zbekistonda manga madaniyatini rivojlantirmoqchiman.", sampleText: 'Sifatli namuna tarjima...', status: 'approved', submittedAt: new Date(Date.now() - 86400000).toISOString(), reviewedAt: new Date(Date.now() - 43200000).toISOString() },
  { id: '4', fullName: 'Zulfiya Xasanova', email: 'zulfiya@example.com', phone: '+998901112233', telegram: '@zulfiya_tr', languages: ['Koreys'], experience: 'Yangi boshlovchi (0-6 oy)', portfolioLinks: '', previousManga: 'Hali tarjima qilmaganman', genres: ['Romance', 'Slice of Life'], motivation: "Koreyscha o'qib tugatdim, endi amaliyot uchun...", sampleText: '', status: 'rejected', submittedAt: new Date(Date.now() - 172800000).toISOString(), reviewedAt: new Date(Date.now() - 86400000).toISOString(), reviewNote: "Tajriba yetarli emas, keyinroq qayta ariza topshiring." },
]

const mockDiscounts: Discount[] = [
  { id: '1', name: 'Yoz Chegirmasi', code: 'SUMMER50', type: 'percent', value: 50, target: 'all', startDate: '2025-06-01', endDate: '2025-08-31', maxUses: 1000, usedCount: 342, isActive: true },
  { id: '2', name: 'Yangi Foydalanuvchi', code: 'NEWUSER', type: 'fixed', value: 100, target: 'diamonds', startDate: '2025-01-01', endDate: '2025-12-31', maxUses: 9999, usedCount: 5820, isActive: true },
  { id: '3', name: 'Pro Obuna', code: 'PRO30', type: 'percent', value: 30, target: 'pro', startDate: '2025-05-01', endDate: '2025-05-31', maxUses: 500, usedCount: 500, isActive: false },
]

const mockUsers = [
  { id: '1', username: 'MangaKing', email: 'king@example.com', level: 99, role: 'translator', subscription: 'proplus', joinDate: '2024-01-01', status: 'active', avatar: 'MK' },
  { id: '2', username: 'OtakuMaster', email: 'otaku@example.com', level: 87, role: 'user', subscription: 'pro', joinDate: '2024-02-15', status: 'active', avatar: 'OM' },
  { id: '3', username: 'WeebLord', email: 'weeb@example.com', level: 76, role: 'user', subscription: 'free', joinDate: '2024-03-20', status: 'banned', avatar: 'WL' },
  { id: '4', username: 'ReadingNinja', email: 'ninja@example.com', level: 65, role: 'user', subscription: 'standard', joinDate: '2024-04-10', status: 'active', avatar: 'RN' },
  { id: '5', username: 'AnimeAddict', email: 'anime@example.com', level: 52, role: 'translator', subscription: 'pro', joinDate: '2024-05-05', status: 'active', avatar: 'AA' },
]

type AdminTab = 'overview' | 'applications' | 'users' | 'discounts' | 'economy' | 'reports'

const navItems: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
  { id: 'overview', label: 'Umumiy ko\'rinish', icon: LayoutDashboard },
  { id: 'applications', label: 'Tarjimon Arizalar', icon: UserCheck },
  { id: 'users', label: 'Foydalanuvchilar', icon: Users },
  { id: 'discounts', label: 'Chegirmalar', icon: Percent },
  { id: 'economy', label: 'Iqtisodiyot', icon: Diamond },
  { id: 'reports', label: 'Shikoyatlar', icon: Flag },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString()
const fmtMoney = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M so'm` : `${(n / 1000).toFixed(0)}K so'm`
const fmtTime = (iso: string) => { const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000); return h < 24 ? `${h} soat oldin` : `${Math.floor(h / 24)} kun oldin` }

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color, trend }: any) {
  const colors: Record<string, string> = {
    primary: 'from-primary/30 to-primary/5 border-primary/30 text-primary',
    success: 'from-emerald-500/30 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    yellow: 'from-yellow-500/30 to-yellow-500/5 border-yellow-500/30 text-yellow-400',
    accent: 'from-indigo-500/30 to-indigo-500/5 border-indigo-500/30 text-indigo-400',
  }
  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5', colors[color])}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="absolute -right-4 -top-4 opacity-10">
        <Icon className="w-24 h-24" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-current/10">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <div className="flex items-center gap-1.5">
        {trend === 'up' ? <ArrowUp className="w-3 h-3 text-emerald-400" /> : <ArrowDown className="w-3 h-3 text-red-400" />}
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: any }> = {
    pending: { label: 'Kutmoqda', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: Clock },
    approved: { label: 'Tasdiqlangan', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
    rejected: { label: 'Rad etilgan', cls: 'bg-red-500/15 text-red-400 border-red-500/30', icon: XCircle },
    active: { label: 'Faol', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
    banned: { label: 'Bloklangan', cls: 'bg-red-500/15 text-red-400 border-red-500/30', icon: Ban },
  }
  const s = map[status] || map.pending
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border', s.cls)}>
      <s.icon className="w-3 h-3" />{s.label}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [applications, setApplications] = useState(mockApplications)
  const [discounts, setDiscounts] = useState(mockDiscounts)
  const [users, setUsers] = useState(mockUsers)
  const [selectedApp, setSelectedApp] = useState<TranslatorApplication | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [econSaved, setEconSaved] = useState(false)
  const [newDiscount, setNewDiscount] = useState({ name: '', code: '', type: 'percent', value: '', target: 'all', startDate: '', endDate: '', maxUses: '' })
  const [economySettings, setEconomySettings] = useState({
    diamondPrice: 100, platformCut: 20, translatorCut: 80, minWithdraw: 100000,
    dailyLoginReward: 10, referralBonus: 50,
  })
  const [apiStats, setApiStats] = useState<any>(null)

  useEffect(() => {
    apiGetAdminStats().then(data => { if (data) setApiStats(data) }).catch(() => {})
  }, [])

  const stats = {
    totalUsers: apiStats?.total_users ?? 125000,
    newUsersToday: apiStats?.new_users_today ?? 342,
    activeUsers: apiStats?.active_users ?? 18500,
    totalViews: apiStats?.total_views ?? 15000000,
    todayViews: apiStats?.today_views ?? 125000,
    totalRevenue: apiStats?.total_revenue ?? 850000000,
    todayRevenue: apiStats?.today_revenue ?? 12500000,
    totalDiamondsSold: apiStats?.total_diamonds_sold ?? 2500000,
    pendingApplications: applications.filter(a => a.status === 'pending').length
  }

  const approveApp = (id: string) => setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved', reviewedAt: new Date().toISOString() } : a))
  const rejectApp = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected', reviewedAt: new Date().toISOString(), reviewNote: rejectNote || 'Admin tomonidan rad etildi.' } : a))
    setShowRejectModal(null); setRejectNote('')
  }
  const toggleUserBan = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u))
  const toggleDiscount = (id: string) => setDiscounts(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d))
  const deleteDiscount = (id: string) => setDiscounts(prev => prev.filter(d => d.id !== id))
  const addDiscount = () => {
    if (!newDiscount.name || !newDiscount.code || !newDiscount.value) return
    setDiscounts(prev => [...prev, { id: Date.now().toString(), name: newDiscount.name, code: newDiscount.code, type: newDiscount.type as any, value: Number(newDiscount.value), target: newDiscount.target as any, startDate: newDiscount.startDate || new Date().toISOString().split('T')[0], endDate: newDiscount.endDate || '2099-12-31', maxUses: Number(newDiscount.maxUses) || 9999, usedCount: 0, isActive: true }])
    setNewDiscount({ name: '', code: '', type: 'percent', value: '', target: 'all', startDate: '', endDate: '', maxUses: '' })
    setShowDiscountForm(false)
  }
  const saveEconomy = () => { setEconSaved(true); setTimeout(() => setEconSaved(false), 2500) }
  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))

  const currentTab = navItems.find(n => n.id === activeTab)

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />

      {/* ── Reject Modal ── */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRejectModal(null)} />
            <motion.div className="relative glass-strong rounded-2xl p-6 w-full max-w-md border border-border/50"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-red-500/20"><XCircle className="w-5 h-5 text-red-400" /></div>
                <div>
                  <h3 className="font-bold">Arizani rad etish</h3>
                  <p className="text-xs text-muted-foreground">Rad etish sababini yozing</p>
                </div>
              </div>
              <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                placeholder="Masalan: Tajriba yetarli emas, portfolio kuchsiz..."
                className="w-full p-3 rounded-xl bg-secondary/50 border border-border/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px] mb-4" />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowRejectModal(null)}>Bekor qilish</Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => rejectApp(showRejectModal)}>
                  <XCircle className="w-4 h-4 mr-2" />Rad etish
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <div className="flex pt-16 min-h-screen relative z-10">

        {/* ── Sidebar ── */}
        <motion.aside
          className={cn(
            'fixed left-0 top-16 bottom-0 z-40 w-64 glass-strong border-r border-border/30 flex flex-col',
            'transition-transform duration-300',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          {/* Sidebar Header */}
          <div className="p-5 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Admin Panel</h2>
                <p className="text-[10px] text-muted-foreground">Manga UZ boshqaruv</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item, i) => {
              const isActive = activeTab === item.id
              const pending = item.id === 'applications' ? stats.pendingApplications : 0
              return (
                <motion.button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                    isActive ? 'bg-primary text-primary-foreground glow-primary' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  )}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {pending > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-bold animate-pulse">
                      {pending}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-border/30">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Tizim ishlayapti</span>
              <span className="ml-auto text-[10px] text-muted-foreground">32% yuklama</span>
            </div>
          </div>
        </motion.aside>

        {/* ── Main Content ── */}
        <main className="flex-1 lg:ml-64 min-w-0">
          {/* Top Bar */}
          <div className="sticky top-16 z-30 glass-strong border-b border-border/30 px-4 sm:px-6 py-3 flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold flex items-center gap-2">
                {currentTab && <currentTab.icon className="w-4 h-4 text-primary" />}
                {currentTab?.label}
              </h1>
            </div>
            {stats.pendingApplications > 0 && activeTab !== 'applications' && (
              <motion.button
                className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-medium"
                onClick={() => setActiveTab('applications')}
                animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <AlertCircle className="w-3.5 h-3.5" />
                {stats.pendingApplications} yangi ariza
              </motion.button>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">

              {/* ════════════ OVERVIEW ════════════ */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard label="Foydalanuvchilar" value={fmt(stats.totalUsers)} sub={`+${stats.newUsersToday} bugun`} icon={Users} color="primary" trend="up" />
                    <StatCard label="Ko'rishlar" value={fmt(stats.totalViews)} sub={`+${fmt(stats.todayViews)} bugun`} icon={Eye} color="success" trend="up" />
                    <StatCard label="Olmozlar" value={fmt(stats.totalDiamondsSold)} sub={`= ${fmtMoney(stats.totalDiamondsSold * 100)}`} icon={Diamond} color="yellow" trend="up" />
                    <StatCard label="Daromad" value={fmtMoney(stats.totalRevenue)} sub={`+${fmtMoney(stats.todayRevenue)} bugun`} icon={DollarSign} color="accent" trend="up" />
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Pending Apps */}
                    <div className="lg:col-span-2 glass rounded-2xl p-5 border border-border/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-yellow-500/20"><UserCheck className="w-4 h-4 text-yellow-400" /></div>
                          <h2 className="font-bold">Kutilayotgan Arizalar</h2>
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">{stats.pendingApplications}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs text-primary h-8 gap-1" onClick={() => setActiveTab('applications')}>
                          Hammasi <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2.5">
                        {applications.filter(a => a.status === 'pending').slice(0, 3).map((app, i) => (
                          <motion.div key={app.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/20 hover:border-border/50 transition-colors"
                            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                              {app.fullName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{app.fullName}</p>
                              <p className="text-[11px] text-muted-foreground">{app.languages.join(', ')} • {app.experience} • {fmtTime(app.submittedAt)}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => approveApp(app.id)}
                                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors">
                                <Check className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowRejectModal(app.id)}
                                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                        {applications.filter(a => a.status === 'pending').length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400/50" />
                            <p className="text-sm">Barcha arizalar ko'rib chiqildi!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Side stats */}
                    <div className="space-y-4">
                      {/* Platform Health */}
                      <div className="glass rounded-2xl p-5 border border-border/30">
                        <div className="flex items-center gap-2 mb-4">
                          <Activity className="w-4 h-4 text-primary" />
                          <h3 className="font-bold text-sm">Platform Holati</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { label: 'Faol foydalanuvchilar', val: (stats.activeUsers / stats.totalUsers * 100).toFixed(1), color: 'from-primary to-accent' },
                            { label: 'Premium foydalanuvchilar', val: '8.5', color: 'from-yellow-400 to-orange-500' },
                            { label: 'Server yuklamasi', val: '32', color: 'from-emerald-500 to-teal-500' },
                          ].map(b => (
                            <div key={b.label}>
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-muted-foreground">{b.label}</span>
                                <span className="font-semibold">{b.val}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                <motion.div className={cn('h-full rounded-full bg-gradient-to-r', b.color)}
                                  initial={{ width: 0 }} animate={{ width: `${b.val}%` }} transition={{ duration: 1.2, delay: 0.3 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Active Discounts */}
                      <div className="glass rounded-2xl p-5 border border-border/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <h3 className="font-bold text-sm">Faol Aksiyalar</h3>
                        </div>
                        <div className="space-y-2">
                          {discounts.filter(d => d.isActive).map(d => (
                            <div key={d.id} className="p-2.5 rounded-xl bg-secondary/30 border border-border/20">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold">{d.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Faol</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground">{d.code} • {d.type === 'percent' ? `${d.value}% chegirma` : `${d.value} olmoz bonus`}</p>
                              <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
                                  style={{ width: `${(d.usedCount / d.maxUses) * 100}%` }} />
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1">{d.usedCount}/{d.maxUses} foydalanilgan</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════════════ APPLICATIONS ════════════ */}
              {activeTab === 'applications' && (
                <motion.div key="applications" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { status: 'pending', label: 'Kutmoqda', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
                      { status: 'approved', label: 'Tasdiqlangan', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
                      { status: 'rejected', label: 'Rad etilgan', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
                    ].map(s => (
                      <div key={s.status} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border', s.cls)}>
                        {s.label}: <span className="font-bold">{applications.filter(a => a.status === s.status).length}</span>
                      </div>
                    ))}
                  </div>

                  {applications.map((app, i) => (
                    <motion.div key={app.id} className="glass rounded-2xl overflow-hidden border border-border/30 hover:border-border/60 transition-colors"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 text-white',
                            app.status === 'approved' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                            app.status === 'rejected' ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-primary to-accent')}>
                            {app.fullName.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <h3 className="font-bold text-base">{app.fullName}</h3>
                              <StatusBadge status={app.status} />
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{app.email}</span>
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{app.phone}</span>
                              <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{app.languages.join(', ')}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="px-2 py-0.5 rounded-md bg-secondary text-xs">{app.experience}</span>
                              {app.genres.map(g => <span key={g} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">{g}</span>)}
                              <span className="text-xs text-muted-foreground ml-auto">{fmtTime(app.submittedAt)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <motion.button whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 hover:bg-secondary/50 text-xs font-medium transition-colors">
                              <Eye className="w-3 h-3" />
                              {selectedApp?.id === app.id ? 'Yig\'ish' : "Ko'rish"}
                            </motion.button>
                            {app.status === 'pending' && (
                              <>
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => approveApp(app.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors">
                                  <Check className="w-3 h-3" />Tasdiqlash
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowRejectModal(app.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold border border-red-500/30 transition-colors">
                                  <X className="w-3 h-3" />Rad etish
                                </motion.button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Expanded */}
                        <AnimatePresence>
                          {selectedApp?.id === app.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-border/30 mt-4 pt-4">
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-secondary/40">
                                  <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Ilgari tarjima qilgan</p>
                                  <p className="text-sm">{app.previousManga}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/40">
                                  <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Telegram</p>
                                  <p className="text-sm text-primary">{app.telegram}</p>
                                </div>
                              </div>
                              <div className="mt-3 p-3 rounded-xl bg-secondary/40">
                                <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Motivatsiya xati</p>
                                <p className="text-sm leading-relaxed">{app.motivation}</p>
                              </div>
                              {app.sampleText && (
                                <div className="mt-3 p-3 rounded-xl bg-primary/8 border border-primary/20">
                                  <p className="text-[10px] text-primary mb-1.5 uppercase tracking-wider font-semibold">Namuna tarjima</p>
                                  <p className="text-sm leading-relaxed">{app.sampleText}</p>
                                </div>
                              )}
                              {app.reviewNote && (
                                <div className="mt-3 p-3 rounded-xl bg-red-500/8 border border-red-500/20">
                                  <p className="text-[10px] text-red-400 mb-1.5 uppercase tracking-wider font-semibold">Rad etish sababi</p>
                                  <p className="text-sm">{app.reviewNote}</p>
                                </div>
                              )}
                              {app.portfolioLinks && (
                                <div className="mt-3 p-3 rounded-xl bg-secondary/40">
                                  <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Portfolio</p>
                                  <p className="text-sm text-primary">{app.portfolioLinks}</p>
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

              {/* ════════════ USERS ════════════ */}
              {activeTab === 'users' && (
                <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                        placeholder="Ism yoki email orqali qidirish..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border/30 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span>{filteredUsers.length} ta</span>
                    </div>
                  </div>

                  <div className="glass rounded-2xl border border-border/30 overflow-hidden">
                    {/* Table header */}
                    <div className="hidden sm:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-3 px-5 py-3 border-b border-border/30 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      <span>Foydalanuvchi</span>
                      <span>Email</span>
                      <span>Rol</span>
                      <span>Obuna</span>
                      <span>Holat</span>
                      <span>Amal</span>
                    </div>
                    <div className="divide-y divide-border/20">
                      {filteredUsers.map((user, i) => (
                        <motion.div key={user.id}
                          className={cn('grid sm:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] items-center gap-3 px-5 py-4 hover:bg-secondary/20 transition-colors',
                            user.status === 'banned' && 'opacity-60')}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                          <div className="flex items-center gap-3">
                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0',
                              user.role === 'translator' ? 'bg-gradient-to-br from-primary to-accent' : 'bg-gradient-to-br from-secondary to-secondary/50 !text-foreground')}>
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{user.username}</p>
                              <p className="text-[10px] text-muted-foreground">Lv {user.level}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground truncate hidden sm:block">{user.email}</p>
                          <span className={cn('text-xs font-medium hidden sm:block',
                            user.role === 'translator' ? 'text-primary' : user.role === 'admin' ? 'text-yellow-400' : 'text-muted-foreground')}>
                            {user.role === 'translator' ? 'Tarjimon' : user.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}
                          </span>
                          <span className={cn('text-xs font-medium hidden sm:block',
                            user.subscription === 'proplus' ? 'text-yellow-400' : user.subscription === 'pro' ? 'text-primary' : user.subscription === 'standard' ? 'text-blue-400' : 'text-muted-foreground')}>
                            {user.subscription.toUpperCase()}
                          </span>
                          <div className="hidden sm:block"><StatusBadge status={user.status} /></div>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleUserBan(user.id)}
                            className={cn('flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                              user.status === 'banned'
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30')}>
                            {user.status === 'banned' ? 'Qoldir' : 'Bloklash'}
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════════════ DISCOUNTS ════════════ */}
              {activeTab === 'discounts' && (
                <motion.div key="discounts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{discounts.length} ta chegirma</p>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowDiscountForm(!showDiscountForm)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors glow-primary">
                      <Plus className="w-4 h-4" />Yangi chegirma
                    </motion.button>
                  </div>

                  {/* Add Form */}
                  <AnimatePresence>
                    {showDiscountForm && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden">
                        <div className="glass rounded-2xl p-5 border border-primary/30 space-y-4">
                          <h3 className="font-bold flex items-center gap-2"><Percent className="w-4 h-4 text-primary" />Yangi chegirma qo'shish</h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[
                              { key: 'name', placeholder: 'Nom (masalan: Yoz chegirmasi)' },
                              { key: 'code', placeholder: 'Kod (masalan: SUMMER50)' },
                              { key: 'value', placeholder: 'Qiymat (50 yoki 100)', type: 'number' },
                              { key: 'maxUses', placeholder: 'Maksimal foydalanish', type: 'number' },
                              { key: 'startDate', placeholder: 'Boshlanish sanasi', type: 'date' },
                              { key: 'endDate', placeholder: 'Tugash sanasi', type: 'date' },
                            ].map(f => (
                              <input key={f.key} type={f.type || 'text'} placeholder={f.placeholder}
                                value={(newDiscount as any)[f.key]}
                                onChange={e => setNewDiscount(p => ({ ...p, [f.key]: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                            ))}
                            <select value={newDiscount.type} onChange={e => setNewDiscount(p => ({ ...p, type: e.target.value }))}
                              className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                              <option value="percent">Foiz chegirma (%)</option>
                              <option value="fixed">Olmoz bonus</option>
                            </select>
                            <select value={newDiscount.target} onChange={e => setNewDiscount(p => ({ ...p, target: e.target.value }))}
                              className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                              <option value="all">Hammaga</option>
                              <option value="standard">Standard</option>
                              <option value="pro">Pro</option>
                              <option value="proplus">Pro+</option>
                              <option value="diamonds">Olmozlar</option>
                            </select>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowDiscountForm(false)}>Bekor qilish</Button>
                            <Button className="flex-1 bg-primary" onClick={addDiscount}><Plus className="w-4 h-4 mr-2" />Qo'shish</Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {discounts.map((d, i) => (
                      <motion.div key={d.id}
                        className={cn('glass rounded-2xl p-5 border transition-all', d.isActive ? 'border-border/40' : 'border-border/20 opacity-60')}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold">{d.name}</h3>
                            <code className="text-xs px-2 py-0.5 rounded-md bg-primary/15 text-primary font-mono mt-1 inline-block">{d.code}</code>
                          </div>
                          <div className={cn('text-lg font-black', d.type === 'percent' ? 'text-primary' : 'text-yellow-400')}>
                            {d.type === 'percent' ? `${d.value}%` : `+${d.value}💎`}
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground mb-3">
                          <div className="flex justify-between">
                            <span>Maqsad:</span>
                            <span className="text-foreground font-medium capitalize">{d.target === 'all' ? 'Hammaga' : d.target}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Muddat:</span>
                            <span className="text-foreground font-medium">{d.startDate} — {d.endDate}</span>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Foydalanilgan:</span>
                              <span className="text-foreground font-medium">{d.usedCount}/{d.maxUses}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
                                style={{ width: `${(d.usedCount / d.maxUses) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleDiscount(d.id)}
                            className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                              d.isActive ? 'bg-secondary/50 border-border/50 text-muted-foreground hover:bg-secondary' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30')}>
                            {d.isActive ? "O'chirish" : 'Yoqish'}
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteDiscount(d.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ════════════ ECONOMY ════════════ */}
              {activeTab === 'economy' && (
                <motion.div key="economy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="max-w-2xl space-y-4">
                    <div className="glass rounded-2xl p-6 border border-border/30">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-yellow-500/20"><Diamond className="w-5 h-5 text-yellow-400" /></div>
                        <div>
                          <h3 className="font-bold">Iqtisodiyot Sozlamalari</h3>
                          <p className="text-xs text-muted-foreground">Diamond narxlari va daromad taqsimoti</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { key: 'diamondPrice', label: 'Olmoz narxi (so\'m)', icon: Diamond },
                          { key: 'platformCut', label: 'Platforma ulushi (%)', icon: BarChart3 },
                          { key: 'translatorCut', label: 'Tarjimon ulushi (%)', icon: UserCheck },
                          { key: 'minWithdraw', label: 'Min. yechish (so\'m)', icon: DollarSign },
                          { key: 'dailyLoginReward', label: 'Kunlik bonus (olmoz)', icon: Gift },
                          { key: 'referralBonus', label: 'Referal bonus (olmoz)', icon: Zap },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
                              <f.icon className="w-3.5 h-3.5" />{f.label}
                            </label>
                            <input type="number"
                              value={(economySettings as any)[f.key]}
                              onChange={e => setEconomySettings(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                              className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono" />
                          </div>
                        ))}
                      </div>
                      <motion.button onClick={saveEconomy} whileTap={{ scale: 0.97 }}
                        className={cn('mt-6 w-full py-3 rounded-xl font-semibold text-sm transition-all',
                          econSaved ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary')}>
                        {econSaved ? <><CheckCircle2 className="w-4 h-4 inline mr-2" />Saqlandi!</> : <><Settings className="w-4 h-4 inline mr-2" />Sozlamalarni Saqlash</>}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════════════ REPORTS ════════════ */}
              {activeTab === 'reports' && (
                <motion.div key="reports" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="glass rounded-2xl p-12 border border-border/30 text-center">
                    <Flag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="font-bold text-lg mb-2">Shikoyatlar bo'limi</h3>
                    <p className="text-muted-foreground text-sm">Hali shikoyatlar yo'q. Bu ajoyib!</p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
