'use client'
import { 
  MessageCircle, 
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, LogOut, Menu, RefreshCw, AlertCircle, Plus, Flag, Users, Eye, BookOpen, DollarSign, CheckCircle2, XCircle, Clock, Mail, Phone, Globe, UserCheck, Search, Percent, Diamond, Settings, BarChart3, Gift, Zap, Trash2, Flame, Check, X, LayoutDashboard } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type AdminTab = 'overview' | 'applications' | 'users' | 'discounts' | 'economy' | 'reports'

const navItems = [
  { id: 'overview', label: 'Umumiy ko\'rinish', icon: LayoutDashboard },
  { id: 'applications', label: 'Tarjimon Arizalar', icon: UserCheck },
  { id: 'users', label: 'Foydalanuvchilar', icon: Users },
  { id: 'discounts', label: 'Chegirmalar', icon: Percent },
  { id: 'economy', label: 'Iqtisodiyot', icon: Diamond },
  { id: 'reports', label: 'Shikoyatlar', icon: Flag },
]

// Helpers
const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString()
const fmtTime = (iso: string) => {
  const date = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60 / 60)
  if (diff < 24) return `${diff} soat oldin`
  return `${Math.floor(diff / 24)} kun oldin`
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    banned: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  const labels: Record<string, string> = {
    pending: 'Kutmoqda',
    approved: 'Tasdiqlangan',
    rejected: 'Rad etilgan',
    active: 'Faol',
    banned: 'Bloklangan',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border', styles[status] || styles.pending)}>
      {labels[status] || status}
    </span>
  )
}

// Main Component
export default function AdminPanel() {
  const router = useRouter()
  
  // State for admin auth
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [isLogging, setIsLogging] = useState(false)
  const [authError, setAuthError] = useState('')
  
  // Admin panel state
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [applications, setApplications] = useState<any[]>([])
  const [discounts, setDiscounts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [newDiscount, setNewDiscount] = useState({
    name: '', code: '', value: '', type: 'percent', maxUses: '',
    startDate: '', endDate: '', target: 'all'
  })

  // Check admin auth on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminAuth')
    const storedEmail = localStorage.getItem('adminEmail')
    if (storedAdmin === 'true' && storedEmail) {
      setIsAdmin(true)
      setAdminEmail(storedEmail)
    }
  }, [])

  // Handle login
  const handleLogin = () => {
    setIsLogging(true)
    setAuthError('')
    
    setTimeout(() => {
      if (loginEmail === 'saidabbos027@gmail.com' && loginPass === 'Abbos1226') {
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('adminEmail', loginEmail)
        setIsAdmin(true)
        setAdminEmail(loginEmail)
        router.refresh()
      } else {
        setAuthError('Email yoki parol noto‘g‘ri')
      }
      setIsLogging(false)
    }, 600)
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminEmail')
    setIsAdmin(false)
    setAdminEmail(null)
    window.location.href = '/'
  }

  // Load applications from localStorage
  const loadApplications = () => {
    try {
      const stored = localStorage.getItem('translatorApplications')
      if (stored) {
        const apps = JSON.parse(stored)
        setApplications(apps)
        console.log('Loaded applications:', apps)
      } else {
        // Demo applications
        const demoApps = [
          { id: '1', fullName: 'Ali Karimov', email: 'ali@example.com', phone: '+998901234567', telegram: '@ali', languages: ['O\'zbek', 'Ingliz'], experience: '3 yil', previousManga: 'Solo Leveling', genres: ['Action', 'Fantasy'], motivation: 'Men manga tarjimoni bo\'lishni juda xohlayman. O\'zbek o\'quvchilariga sifatli tarjimalar yetkazishni maqsad qilganman.', status: 'pending', submittedAt: new Date().toISOString() },
          { id: '2', fullName: 'Nilufar Ahmedova', email: 'nilufar@example.com', phone: '+998901234568', telegram: '@nilufar', languages: ['O\'zbek', 'Yapon'], experience: '5 yil', previousManga: 'Attack on Titan, Naruto', genres: ['Drama', 'Action'], motivation: 'Yapon tilini yaxshi bilaman va manga tarjimonligi mening orzuim. Ushbu sohada o\'z hissamni qo\'shmoqchiman.', status: 'pending', submittedAt: new Date(Date.now() - 86400000).toISOString() },
        ]
        setApplications(demoApps)
        localStorage.setItem('translatorApplications', JSON.stringify(demoApps))
      }
    } catch (error) {
      console.error('Error loading applications:', error)
    }
  }

  // Load users
  const loadUsers = () => {
    const demoUsers = [
      { id: '1', username: 'JohnDoe', email: 'john@example.com', role: 'user', subscription: 'standard', level: 5, status: 'active', avatar: 'J' },
      { id: '2', username: 'JaneSmith', email: 'jane@example.com', role: 'translator', subscription: 'pro', level: 12, status: 'active', avatar: 'J' },
      { id: '3', username: 'AdminUser', email: 'admin@example.com', role: 'admin', subscription: 'proplus', level: 99, status: 'active', avatar: 'A' },
    ]
    setUsers(demoUsers)
  }

  // Load discounts
  const loadDiscounts = () => {
    const demoDiscounts = [
      { id: '1', name: 'Yangi yil chegirmasi', code: 'NEWYEAR2024', value: 30, type: 'percent', maxUses: 100, usedCount: 45, startDate: '2024-12-20', endDate: '2025-01-10', target: 'all', isActive: true },
      { id: '2', name: 'Premium bonus', code: 'PREMIUM50', value: 50, type: 'fixed', maxUses: 50, usedCount: 12, startDate: '2024-12-01', endDate: '2025-01-31', target: 'pro', isActive: true },
    ]
    setDiscounts(demoDiscounts)
  }

  // Load all data
  useEffect(() => {
    if (isAdmin) {
      setLoading(true)
      loadApplications()
      loadUsers()
      loadDiscounts()
      setLoading(false)
    }
  }, [isAdmin])

  const stats = {
    totalUsers: users.length || 1248,
    totalViews: 456789,
    totalTranslators: users.filter(u => u.role === 'translator').length || 42,
    totalManga: 156,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    newUsersToday: 23,
  }

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  )

  const approveApp = (id: string) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status: 'approved' } : app
    )
    setApplications(updated)
    localStorage.setItem('translatorApplications', JSON.stringify(updated))
  }

  const rejectApp = (id: string) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status: 'rejected', reviewNote: rejectNote } : app
    )
    setApplications(updated)
    localStorage.setItem('translatorApplications', JSON.stringify(updated))
    setShowRejectModal(null)
    setRejectNote('')
  }

  const toggleUserBan = (id: string) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u))
  }

  const toggleDiscount = (id: string) => {
    setDiscounts(p => p.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d))
  }

  const addDiscount = () => {
    if (!newDiscount.name || !newDiscount.code || !newDiscount.value) return
    setDiscounts([...discounts, { 
      ...newDiscount, 
      id: Date.now().toString(), 
      value: Number(newDiscount.value), 
      maxUses: Number(newDiscount.maxUses) || 100, 
      usedCount: 0, 
      isActive: true 
    }])
    setShowDiscountForm(false)
  }

  // Login screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ParticlesBackground />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm p-6 rounded-2xl glass border border-border/30">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-bold text-xl">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Manga UZ boshqaruv tizimi</p>
          </div>
          <div className="space-y-4">
            <input type="email" className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50" placeholder="saidabbos027@gmail.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <input type="password" className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50" placeholder="Parol" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            {authError && <p className="text-red-400 text-xs flex items-center gap-1 bg-red-500/10 p-2 rounded-lg"><AlertCircle className="w-3.5 h-3.5" />{authError}</p>}
            <Button className="w-full py-2.5" disabled={isLogging} onClick={handleLogin}>{isLogging ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Kirish'}</Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Admin panel UI
  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 bg-background/95 backdrop-blur-xl border-r border-border/30 transform transition-transform duration-300 lg:relative lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="p-5 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
              <div><h2 className="font-bold text-sm">Admin Panel</h2><p className="text-[10px] text-muted-foreground">Manga UZ</p></div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              const pending = item.id === 'applications' ? stats.pendingApplications : 0
              const Icon = item.icon
              return (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground")}>
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  {pending > 0 && <span className="px-1.5 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-bold animate-pulse">{pending}</span>}
                </button>
              )
            })}
          </nav>
          <div className="p-3 border-t border-border/30">
            <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs text-emerald-400 font-medium">Admin: {adminEmail}</span></div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors"><LogOut className="w-4 h-4" />Chiqish</button>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 min-w-0">
          <div className="sticky top-16 z-30 border-b border-border/30 px-4 sm:px-6 py-3 flex items-center gap-4 bg-background/80 backdrop-blur-sm">
            <button className="lg:hidden p-2 rounded-lg hover:bg-secondary/50" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
            <h1 className="text-base font-bold">{navItems.find(n => n.id === activeTab)?.label}</h1>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                      <div className="glass rounded-2xl p-4 border"><p className="text-muted-foreground text-xs">Foydalanuvchilar</p><p className="text-2xl font-bold">{fmt(stats.totalUsers)}</p></div>
                      <div className="glass rounded-2xl p-4 border"><p className="text-muted-foreground text-xs">Ko'rishlar</p><p className="text-2xl font-bold">{fmt(stats.totalViews)}</p></div>
                      <div className="glass rounded-2xl p-4 border"><p className="text-muted-foreground text-xs">Mangalar</p><p className="text-2xl font-bold">{fmt(stats.totalManga)}</p></div>
                      <div className="glass rounded-2xl p-4 border"><p className="text-muted-foreground text-xs">Tarjimonlar</p><p className="text-2xl font-bold">{fmt(stats.totalTranslators)}</p></div>
                    </div>
                    <div className="glass rounded-2xl p-6 border text-center">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
                      <p className="text-muted-foreground">Admin panelga xush kelibsiz!</p>
                      <p className="text-xs text-muted-foreground mt-2">Kutilayotgan arizalar: {stats.pendingApplications} ta</p>
                    </div>
                  </div>
                )}

                {/* Applications Tab - TARJIMON ARIZALARI */}
                {activeTab === 'applications' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                        Kutmoqda: {applications.filter(a => a.status === 'pending').length}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Tasdiqlangan: {applications.filter(a => a.status === 'approved').length}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-red-500/15 text-red-400 border border-red-500/30">
                        Rad etilgan: {applications.filter(a => a.status === 'rejected').length}
                      </span>
                    </div>

                    {applications.length === 0 ? (
                      <div className="glass rounded-2xl p-12 text-center border">
                        <UserCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground">Hali arizalar yo'q</p>
                      </div>
                    ) : (
                      applications.map((app) => (
                        <div key={app.id} className="glass rounded-2xl p-5 border hover:border-primary/30 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-lg">{app.fullName}</h3>
                                <StatusBadge status={app.status} />
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{app.email}</span>
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{app.phone}</span>
                                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{app.telegram}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}
                              className="px-3 py-1.5 rounded-lg border border-border/50 hover:bg-secondary/50 text-xs transition-colors"
                            >
                              {selectedApp?.id === app.id ? 'Yig\'ish' : 'Batafsil'}
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs mb-3">
                            <span className="px-2 py-0.5 rounded bg-secondary/50">{app.experience}</span>
                            {app.languages?.slice(0, 3).map((lang: string) => (
                              <span key={lang} className="px-2 py-0.5 rounded bg-primary/10 text-primary">{lang}</span>
                            ))}
                            {app.genres?.slice(0, 3).map((genre: string) => (
                              <span key={genre} className="px-2 py-0.5 rounded bg-accent/10 text-accent-foreground">{genre}</span>
                            ))}
                            <span className="text-muted-foreground text-[10px] ml-auto">{fmtTime(app.submittedAt)}</span>
                          </div>

                          {/* Expanded details */}
                          {selectedApp?.id === app.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-border/30 space-y-3">
                              <div className="p-3 rounded-xl bg-secondary/30">
                                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Ilgari tarjima qilgan</p>
                                <p className="text-sm">{app.previousManga}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-secondary/30">
                                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Motivatsiya</p>
                                <p className="text-sm leading-relaxed">{app.motivation}</p>
                              </div>
                              {app.sampleText && (
                                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                                  <p className="text-[10px] text-primary mb-1 uppercase tracking-wider">Namuna tarjima</p>
                                  <p className="text-sm">{app.sampleText}</p>
                                </div>
                              )}
                              {app.portfolioLinks && (
                                <div className="p-3 rounded-xl bg-secondary/30">
                                  <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Portfolio</p>
                                  <p className="text-sm text-primary">{app.portfolioLinks}</p>
                                </div>
                              )}
                              {app.reviewNote && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                                  <p className="text-[10px] text-red-400 mb-1 uppercase tracking-wider">Rad etish sababi</p>
                                  <p className="text-sm">{app.reviewNote}</p>
                                </div>
                              )}
                            </motion.div>
                          )}

                          {/* Action buttons */}
                          {app.status === 'pending' && (
                            <div className="flex gap-3 mt-4 pt-3 border-t border-border/30">
                              <button onClick={() => approveApp(app.id)} className="flex-1 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" /> Tasdiqlash
                              </button>
                              <button onClick={() => setShowRejectModal(app.id)} className="flex-1 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                                <X className="w-4 h-4" /> Rad etish
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="space-y-4">
                    <div className="relative max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="Qidirish..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/50 border" value={userSearch} onChange={e => setUserSearch(e.target.value)} /></div>
                    <div className="glass rounded-2xl border overflow-hidden">
                      {filteredUsers.map(u => (
                        <div key={u.id} className="flex justify-between items-center p-4 border-b">
                          <div><p className="font-semibold">{u.username}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                          <StatusBadge status={u.status} />
                          <button onClick={() => toggleUserBan(u.id)} className={cn("px-3 py-1.5 rounded-lg text-xs", u.status === 'banned' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>{u.status === 'banned' ? 'Qoldir' : 'Bloklash'}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discounts Tab */}
                {activeTab === 'discounts' && (
                  <div className="space-y-4">
                    <button onClick={() => setShowDiscountForm(!showDiscountForm)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm"><Plus className="w-4 h-4 inline mr-1" />Yangi chegirma</button>
                    {showDiscountForm && (
                      <div className="glass rounded-2xl p-4 border border-primary/30">
                        <input placeholder="Nomi" className="w-full mb-2 p-2 rounded bg-secondary/50" onChange={e => setNewDiscount({...newDiscount, name: e.target.value})} />
                        <input placeholder="Kod" className="w-full mb-2 p-2 rounded bg-secondary/50" onChange={e => setNewDiscount({...newDiscount, code: e.target.value})} />
                        <input placeholder="Qiymat" type="number" className="w-full mb-2 p-2 rounded bg-secondary/50" onChange={e => setNewDiscount({...newDiscount, value: e.target.value})} />
                        <button onClick={addDiscount} className="w-full py-2 rounded-xl bg-primary text-white">Qo'shish</button>
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {discounts.map(d => (
                        <div key={d.id} className="glass rounded-2xl p-4 border">
                          <h3 className="font-bold">{d.name}</h3>
                          <code className="text-xs text-primary">{d.code}</code>
                          <p className="text-xl font-bold mt-2">{d.value}{d.type === 'percent' ? '%' : '💎'}</p>
                          <button onClick={() => toggleDiscount(d.id)} className="mt-2 w-full py-1.5 rounded-lg bg-secondary/50 text-xs">{d.isActive ? "O'chirish" : "Yoqish"}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Economy Tab */}
                {activeTab === 'economy' && (
                  <div className="glass rounded-2xl p-6 border max-w-md">
                    <h3 className="font-bold mb-4">Iqtisodiyot Sozlamalari</h3>
                    <div className="space-y-4">
                      <div><label className="text-xs text-muted-foreground mb-1 block">Olmoz narxi (so'm)</label><input type="number" defaultValue="100" className="w-full p-2 rounded-lg bg-secondary/50 border" /></div>
                      <div><label className="text-xs text-muted-foreground mb-1 block">Platforma ulushi (%)</label><input type="number" defaultValue="20" className="w-full p-2 rounded-lg bg-secondary/50 border" /></div>
                      <button className="w-full py-2 rounded-xl bg-primary text-white">Saqlash</button>
                    </div>
                  </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                  <div className="glass rounded-2xl p-12 text-center border"><Flag className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" /><p className="text-muted-foreground">Hali shikoyatlar yo'q</p></div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowRejectModal(null)}>
          <div className="w-full max-w-md p-5 glass rounded-2xl border border-red-500/30" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">Arizani rad etish</h3>
            <textarea className="w-full p-2 rounded-lg bg-secondary/50 border focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-3" rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Rad etish sababini yozing..." />
            <div className="flex gap-2"><button className="flex-1 py-2 rounded-lg bg-secondary" onClick={() => setShowRejectModal(null)}>Bekor</button><button className="flex-1 py-2 rounded-lg bg-red-500 text-white" onClick={() => rejectApp(showRejectModal)}>Rad etish</button></div>
          </div>
        </div>
      )}
    </div>
  )
}