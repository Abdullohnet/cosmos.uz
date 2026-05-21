'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Bell, User, Diamond, Menu, X, Home, BookOpen,
  TrendingUp, Crown, Settings, LogOut, Gift, Sparkles,
  ChevronDown, Star, Upload, PenLine, ArrowRight, Clock, Flame,
  Sun, Moon
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useUserStore, useUIStore, mockMangas } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, notifications, markNotificationRead, markAllNotificationsRead, logout } = useUserStore()
  const { bannerVisible } = useUIStore()
  const { theme, setTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])
  const unreadCount = notifications.filter(n => !n.read).length

  // Live search results
  const searchResults = searchQuery.length > 1
    ? mockMangas.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  const recentSearches = ['Solo Leveling', 'One Piece', 'Naruto']

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { href: '/', label: 'Bosh sahifa', icon: Home },
    { href: '/browse', label: "Ko'rish", icon: BookOpen },
    { href: '/rankings', label: 'Reyting', icon: TrendingUp },
    { href: '/premium', label: 'Premium', icon: Crown },
  ]

  const showDropdown = isSearchFocused && (searchQuery.length > 1 ? searchResults.length > 0 : true)

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          bannerVisible ? 'top-10' : 'top-0',
          isScrolled ? 'glass-strong py-2' : 'bg-transparent py-4'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                  <span className="text-primary-foreground font-black text-base">M</span>
                </div>
                <motion.div
                  className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary to-accent opacity-0 blur-lg group-hover:opacity-50 transition-opacity"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div className="block">
                <span className="text-lg font-bold text-foreground">Manga</span>
                <span className="text-lg font-bold text-primary"> UZ</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all flex items-center gap-1.5"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Live Search */}
            <div className="hidden md:flex flex-1 max-w-sm mx-3" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Manga, muallif qidirish..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl border border-border/40 shadow-2xl overflow-hidden z-50"
                    >
                      {searchQuery.length <= 1 ? (
                        <div className="p-3">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">
                            So'nggi qidiruvlar
                          </p>
                          {recentSearches.map((s, i) => (
                            <motion.button key={i} onClick={() => setSearchQuery(s)}
                              whileHover={{ x: 4 }}
                              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-left">
                              <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{s}</span>
                            </motion.button>
                          ))}
                          <div className="border-t border-border/30 mt-2 pt-2">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">
                              Trendda
                            </p>
                            {mockMangas.filter(m => m.isHot).slice(0, 3).map(m => (
                              <Link key={m.id} href={`/manga/${m.id}`} onClick={() => setIsSearchFocused(false)}>
                                <motion.div whileHover={{ x: 4 }}
                                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                                  <Flame className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                                  <span className="text-sm truncate">{m.title}</span>
                                  <span className="ml-auto text-[10px] text-muted-foreground flex-shrink-0">{m.type}</span>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          {searchResults.map((m, i) => (
                            <Link key={m.id} href={`/manga/${m.id}`} onClick={() => { setIsSearchFocused(false); setSearchQuery('') }}>
                              <motion.div
                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/50 transition-colors"
                                whileHover={{ x: 4 }}
                              >
                                <img src={m.cover} alt={m.title}
                                  className="w-9 h-12 rounded-lg object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold truncate">{m.title}</p>
                                  <p className="text-xs text-muted-foreground">{m.author}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] text-muted-foreground">{m.rating}</span>
                                    <span className="text-[10px] text-muted-foreground">• {m.chapters} bob</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              </motion.div>
                            </Link>
                          ))}
                          <Link href={`/browse?q=${searchQuery}`} onClick={() => { setIsSearchFocused(false); setSearchQuery('') }}>
                            <div className="px-3 py-2.5 border-t border-border/30 text-sm text-primary hover:bg-secondary/30 transition-colors flex items-center gap-2">
                              <Search className="w-3.5 h-3.5" />
                              <span>"{searchQuery}" uchun barcha natijalar</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                            </div>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5">
              {/* Mobile Search */}
              <button className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Theme Toggle */}
              <motion.button
                onClick={() => mounted && setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors relative overflow-hidden"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                {!mounted ? (
                  <div className="w-5 h-5" />
                ) : (
                  <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                      <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Sun className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    ) : (
                      <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Moon className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.button>

              {/* Apply CTA */}
              <Link href="/apply" className="hidden lg:block flex-shrink-0">
                <motion.div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/40 text-primary text-xs font-semibold hover:from-primary/30 hover:to-accent/30 transition-all"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <PenLine className="w-3 h-3" />
                  Muallif
                </motion.div>
              </Link>

              {isAuthenticated && user ? (
                <>
                  {/* Diamond */}
                  <Link href="/shop">
                    <motion.div
                      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 cursor-pointer"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      <Diamond className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-xs font-bold text-yellow-400">{user.diamonds.toLocaleString()}</span>
                    </motion.div>
                  </Link>

                  {/* Notifications */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <AnimatePresence>
                        {unreadCount > 0 && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center font-bold">
                            {unreadCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <>
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-80 rounded-xl glass-strong border border-border/40 shadow-2xl overflow-hidden z-50"
                          >
                            <div className="p-3.5 border-b border-border/40 flex items-center justify-between">
                              <h3 className="font-bold text-sm">Bildirishnomalar</h3>
                              {unreadCount > 0 && (
                                <button onClick={markAllNotificationsRead}
                                  className="text-[10px] text-primary hover:underline">
                                  Barchasini o'qildi
                                </button>
                              )}
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                              {notifications.slice(0, 5).map(n => (
                                <motion.div key={n.id} whileHover={{ x: 4 }}
                                  className={cn('px-3.5 py-3 border-b border-border/20 cursor-pointer hover:bg-secondary/30 transition-colors', !n.read && 'bg-primary/5')}
                                  onClick={() => markNotificationRead(n.id)}>
                                  <div className="flex items-start gap-3">
                                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                                      n.type === 'reward' && 'bg-yellow-500/20 text-yellow-400',
                                      n.type === 'chapter' && 'bg-primary/20 text-primary',
                                      n.type === 'system' && 'bg-neon/20 text-neon',
                                      n.type === 'achievement' && 'bg-success/20 text-success',
                                    )}>
                                      {n.type === 'reward' && <Gift className="w-3.5 h-3.5" />}
                                      {n.type === 'chapter' && <BookOpen className="w-3.5 h-3.5" />}
                                      {n.type === 'system' && <Sparkles className="w-3.5 h-3.5" />}
                                      {n.type === 'achievement' && <Star className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold truncate">{n.title}</p>
                                      <p className="text-[10px] text-muted-foreground truncate">{n.message}</p>
                                    </div>
                                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            <Link href="/notifications">
                              <div className="p-3 text-center text-xs text-primary hover:bg-secondary/30 transition-colors font-medium">
                                Barcha bildirishnomalar →
                              </div>
                            </Link>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-secondary/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative">
                        <img src={user.avatar} alt={user.username}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background flex items-center justify-center border border-border/50">
                          <span className="text-[9px] font-black text-primary">{user.level}</span>
                        </div>
                      </div>
                      <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground hidden sm:block transition-transform duration-200', isProfileOpen && 'rotate-180')} />
                    </motion.button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <>
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            className="absolute right-0 top-full mt-2 w-60 rounded-xl glass-strong border border-border/40 shadow-2xl overflow-hidden z-50"
                          >
                            {/* User header */}
                            <div className="p-4 border-b border-border/30">
                              <div className="flex items-center gap-3">
                                <img src={user.avatar} alt={user.username}
                                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/40" />
                                <div className="min-w-0">
                                  <p className="font-bold text-sm truncate">{user.username}</p>
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <span className="text-primary font-medium">Lvl {user.level}</span>
                                    <span>·</span>
                                    <span>{user.xp}/{user.xpToNextLevel} XP</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                                  transition={{ duration: 0.6, delay: 0.1 }}
                                />
                              </div>
                            </div>

                            <div className="p-1.5">
                              {[
                                { href: '/profile', icon: User, label: 'Mening profilim' },
                                { href: '/shop', icon: Diamond, label: 'Olmos do\'koni', badge: user.diamonds, badgeColor: 'text-yellow-400' },
                              ].map(item => (
                                <Link key={item.href} href={item.href} onClick={() => setIsProfileOpen(false)}>
                                  <motion.div whileHover={{ x: 3 }}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                                    <item.icon className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm flex-1">{item.label}</span>
                                    {'badge' in item && <span className={cn('text-xs font-bold', item.badgeColor)}>{item.badge}</span>}
                                  </motion.div>
                                </Link>
                              ))}
                              {user.role === 'translator' && (
                                <Link href="/translator" onClick={() => setIsProfileOpen(false)}>
                                  <motion.div whileHover={{ x: 3 }}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                                    <Upload className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Tarjimon paneli</span>
                                  </motion.div>
                                </Link>
                              )}
                              {user.role === 'admin' && (
                                <Link href="/admin" onClick={() => setIsProfileOpen(false)}>
                                  <motion.div whileHover={{ x: 3 }}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Admin panel</span>
                                  </motion.div>
                                </Link>
                              )}
                              <Link href="/settings" onClick={() => setIsProfileOpen(false)}>
                                <motion.div whileHover={{ x: 3 }}
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                                  <Settings className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">Sozlamalar</span>
                                </motion.div>
                              </Link>
                              <div className="my-1 border-t border-border/30" />
                              <motion.button
                                whileHover={{ x: 3 }}
                                onClick={() => { logout(); setIsProfileOpen(false) }}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors w-full text-left text-destructive"
                              >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm">Chiqish</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link href="/login">
                    <Button variant="ghost" size="sm"
                      className="text-muted-foreground hover:text-foreground text-xs h-8">
                      Kirish
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm"
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary text-xs h-8">
                      Ro&apos;yxat
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile/Tablet Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hidden md:block lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5 text-muted-foreground" /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5 text-muted-foreground" /></motion.div>
                  }
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu (md-lg) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="glass-strong border-b border-border/40 shadow-2xl">
              <div className="container mx-auto px-4 py-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Manga qidirish..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors">
                        <link.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
