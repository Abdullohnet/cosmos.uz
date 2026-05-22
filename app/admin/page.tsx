'use client'

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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    banned: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  const labels: Record<string, string> = {
    pending: 'Kutmoqda',
    approved: 'Tasdiqlangan',
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
  const [newDiscount, setNewDiscount] = useState({
    name: '', code: '', value: '', type: 'percent', maxUses: '',
    startDate: '', endDate: '', target: 'all'
  })

  // Check admin auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedAdmin = localStorage.getItem('adminAuth')
      const storedEmail = localStorage.getItem('adminEmail')
      const adminExpiry = localStorage.getItem('adminExpiry')
      
      // Check if session expired
      if (adminExpiry && Date.now() > parseInt(adminExpiry)) {
        // Session expired, clear localStorage
        localStorage.removeItem('adminAuth')
        localStorage.removeItem('adminEmail')
        localStorage.removeItem('adminExpiry')
        setIsAdmin(false)
        setAdminEmail(null)
        return
      }
      
      if (storedAdmin === 'true' && storedEmail) {
        setIsAdmin(true)
        setAdminEmail(storedEmail)
      } else {
        setIsAdmin(false)
        setAdminEmail(null)
      }
    }
    
    checkAuth()
  }, [])

  // Handle login
  const handleLogin = () => {
    setIsLogging(true)
    setAuthError('')
    
    setTimeout(() => {
      if (loginEmail === 'saidabbos027@gmail.com' && loginPass === 'Abbos1226') {
        // Set session expiry (24 hours from now)
        const expiry = Date.now() + (24 * 60 * 60 * 1000)
        
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('adminEmail', loginEmail)
        localStorage.setItem('adminExpiry', expiry.toString())
        
        setIsAdmin(true)
        setAdminEmail(loginEmail)
        router.refresh()
      } else {
        setAuthError('Email yoki parol noto‘g‘ri')
      }
      setIsLogging(false)
    }, 600)
  }

  // Handle logout - completely clear all admin data
  const handleLogout = () => {
    // Clear all admin-related localStorage items
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('adminExpiry')
    
    // Clear any other potential admin data
    localStorage.removeItem('adminSession')
    sessionStorage.removeItem('adminSession')
    
    // Reset state
    setIsAdmin(false)
    setAdminEmail(null)
    
    // Clear all form states
    setLoginEmail('')
    setLoginPass('')
    setAuthError('')
    
    // Force hard reload to clear any cached state
    // router.push emas, window.location.href ishlatamiz
    window.location.href = '/'
  }

  // Demo data
  const demoUsers = [
    { id: '1', username: 'JohnDoe', email: 'john@example.com', role: 'user', subscription: 'standard', level: 5, status: 'active', avatar: 'J' },
    { id: '2', username: 'JaneSmith', email: 'jane@example.com', role: 'translator', subscription: 'pro', level: 12, status: 'active', avatar: 'J' },
    { id: '3', username: 'AdminUser', email: 'admin@example.com', role: 'admin', subscription: 'proplus', level: 99, status: 'active', avatar: 'A' },
  ]

  const demoApplications = [
    { id: '1', fullName: 'Ali Karimov', email: 'ali@example.com', phone: '+998901234567', telegram: '@ali', languages: ['O\'zbek', 'Ingliz'], experience: '3 yil', status: 'pending', submittedAt: new Date().toISOString() },
    { id: '2', fullName: 'Nilufar Ahmedova', email: 'nilufar@example.com', phone: '+998901234568', telegram: '@nilufar', languages: ['O\'zbek', 'Yapon'], experience: '5 yil', status: 'approved', submittedAt: new Date().toISOString() },
  ]

  const demoDiscounts = [
    { id: '1', name: 'Yangi yil chegirmasi', code: 'NEWYEAR2024', value: 30, type: 'percent', maxUses: 100, usedCount: 45, startDate: '2024-12-20', endDate: '2025-01-10', target: 'all', isActive: true },
    { id: '2', name: 'Premium bonus', code: 'PREMIUM50', value: 50, type: 'fixed', maxUses: 50, usedCount: 12, startDate: '2024-12-01', endDate: '2025-01-31', target: 'pro', isActive: true },
  ]

  // Load data
  useEffect(() => {
    if (isAdmin) {
      setLoading(true)
      setTimeout(() => {
        setUsers(demoUsers)
        setApplications(demoApplications)
        setDiscounts(demoDiscounts)
        setLoading(false)
      }, 500)
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
    setApplications(p => p.map(a => a.id === id ? { ...a, status: 'approved' } : a))
  }

  const rejectApp = (id: string) => {
    setApplications(p => p.map(a => a.id === id ? { ...a, status: 'rejected', reviewNote: rejectNote } : a))
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
    if (!newDiscount.name || !newDiscount.code || !newDiscount.value) {
      return
    }
    setDiscounts([...discounts, { 
      ...newDiscount, 
      id: Date.now().toString(), 
      value: Number(newDiscount.value), 
      maxUses: Number(newDiscount.maxUses) || 100, 
      usedCount: 0, 
      isActive: true 
    }])
    setShowDiscountForm(false)
    setNewDiscount({
      name: '', code: '', value: '', type: 'percent', maxUses: '',
      startDate: '', endDate: '', target: 'all'
    })
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
            <input 
              type="email" 
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="Email" 
              value={loginEmail} 
              onChange={e => setLoginEmail(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleLogin()} 
            />
            <input 
              type="password" 
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="Parol" 
              value={loginPass} 
              onChange={e => setLoginPass(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleLogin()} 
            />
            {authError && (
              <p className="text-red-400 text-xs flex items-center gap-1 bg-red-500/10 p-2 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" />
                {authError}
              </p>
            )}
            <Button className="w-full py-2.5" disabled={isLogging} onClick={handleLogin}>
              {isLogging ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Kirish'}
            </Button>
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
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background/95 backdrop-blur-xl border-r border-border/30 transform transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-5 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Admin Panel</h2>
                <p className="text-[10px] text-muted-foreground">Manga UZ</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              const pending = item.id === 'applications' ? stats.pendingApplications : 0
              const Icon = item.icon
              return (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }} 
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}>
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  {pending > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-bold animate-pulse">
                      {pending}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
          
          <div className="p-3 border-t border-border/30">
            <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Admin: {adminEmail}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Chiqish
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 min-w-0">
          <div className="sticky top-16 z-30 border-b border-border/30 px-4 sm:px-6 py-3 flex items-center gap-4 bg-background/80 backdrop-blur-sm">
            <button className="lg:hidden p-2 rounded-lg hover:bg-secondary/50" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
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
                      <div className="glass rounded-2xl p-4 border">
                        <p className="text-muted-foreground text-xs">Foydalanuvchilar</p>
                        <p className="text-2xl font-bold">{fmt(stats.totalUsers)}</p>
                      </div>
                      <div className="glass rounded-2xl p-4 border">
                        <p className="text-muted-foreground text-xs">Ko'rishlar</p>
                        <p className="text-2xl font-bold">{fmt(stats.totalViews)}</p>
                      </div>
                      <div className="glass rounded-2xl p-4 border">
                        <p className="text-muted-foreground text-xs">Mangalar</p>
                        <p className="text-2xl font-bold">{fmt(stats.totalManga)}</p>
                      </div>
                      <div className="glass rounded-2xl p-4 border">
                        <p className="text-muted-foreground text-xs">Tarjimonlar</p>
                        <p className="text-2xl font-bold">{fmt(stats.totalTranslators)}</p>
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-6 border text-center">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
                      <p className="text-muted-foreground">Admin panelga xush kelibsiz!</p>
                    </div>
                  </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                        Kutmoqda: {applications.filter(a => a.status === 'pending').length}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Tasdiqlangan: {applications.filter(a => a.status === 'approved').length}
                      </span>
                    </div>
                    {applications.map(app => (
                      <div key={app.id} className="glass rounded-2xl p-4 border hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{app.fullName}</h3>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                          <StatusBadge status={app.status} />
                        </div>
                        {app.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => approveApp(app.id)} 
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs transition-colors"
                            >
                              <Check className="w-3 h-3 inline mr-1" />Tasdiqlash
                            </button>
                            <button 
                              onClick={() => setShowRejectModal(app.id)} 
                              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-colors"
                            >
                              <X className="w-3 h-3 inline mr-1" />Rad etish
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="space-y-4">
                    <div className="relative max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        placeholder="Qidirish..." 
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                        value={userSearch} 
                        onChange={e => setUserSearch(e.target.value)} 
                      />
                    </div>
                    <div className="glass rounded-2xl border overflow-hidden">
                      {filteredUsers.map(u => (
                        <div key={u.id} className="flex justify-between items-center p-4 border-b last:border-0">
                          <div>
                            <p className="font-semibold">{u.username}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                          <StatusBadge status={u.status} />
                          <button 
                            onClick={() => toggleUserBan(u.id)} 
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs transition-colors",
                              u.status === 'banned' 
                                ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400" 
                                : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                            )}
                          >
                            {u.status === 'banned' ? 'Qoldir' : 'Bloklash'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discounts Tab */}
                {activeTab === 'discounts' && (
                  <div className="space-y-4">
                    <button 
                      onClick={() => setShowDiscountForm(!showDiscountForm)} 
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />Yangi chegirma
                    </button>
                    {showDiscountForm && (
                      <div className="glass rounded-2xl p-4 border border-primary/30">
                        <input 
                          placeholder="Nomi" 
                          className="w-full mb-2 p-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                          onChange={e => setNewDiscount({...newDiscount, name: e.target.value})} 
                        />
                        <input 
                          placeholder="Kod" 
                          className="w-full mb-2 p-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                          onChange={e => setNewDiscount({...newDiscount, code: e.target.value})} 
                        />
                        <input 
                          placeholder="Qiymat" 
                          type="number" 
                          className="w-full mb-2 p-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                          onChange={e => setNewDiscount({...newDiscount, value: e.target.value})} 
                        />
                        <button 
                          onClick={addDiscount} 
                          className="w-full py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                        >
                          Qo'shish
                        </button>
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {discounts.map(d => (
                        <div key={d.id} className="glass rounded-2xl p-4 border">
                          <h3 className="font-bold">{d.name}</h3>
                          <code className="text-xs text-primary">{d.code}</code>
                          <p className="text-xl font-bold mt-2">{d.value}{d.type === 'percent' ? '%' : '💎'}</p>
                          <button 
                            onClick={() => toggleDiscount(d.id)} 
                            className="mt-2 w-full py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-xs transition-colors"
                          >
                            {d.isActive ? "O'chirish" : "Yoqish"}
                          </button>
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
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Olmoz narxi (so'm)</label>
                        <input type="number" defaultValue="100" className="w-full p-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Platforma ulushi (%)</label>
                        <input type="number" defaultValue="20" className="w-full p-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      </div>
                      <button className="w-full py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors">
                        Saqlash
                      </button>
                    </div>
                  </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                  <div className="glass rounded-2xl p-12 text-center border">
                    <Flag className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Hali shikoyatlar yo'q</p>
                  </div>
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
            <textarea 
              className="w-full p-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-3" 
              rows={3} 
              value={rejectNote} 
              onChange={e => setRejectNote(e.target.value)} 
              placeholder="Rad etish sababini yozing..." 
            />
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors" onClick={() => setShowRejectModal(null)}>
                Bekor
              </button>
              <button className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors" onClick={() => rejectApp(showRejectModal)}>
                Rad etish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}