'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Bell, User, Diamond, Menu, X, Home, BookOpen, 
  TrendingUp, Crown, Settings, LogOut, Gift, Sparkles,
  ChevronDown, Flame, Star, Clock, Upload
} from 'lucide-react'
import { useUserStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { user, isAuthenticated, notifications, markNotificationRead, markAllNotificationsRead, login, logout } = useUserStore()

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDemoLogin = () => {
    const { mockUser } = require('@/lib/store')
    login(mockUser)
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/browse', label: 'Browse', icon: BookOpen },
    { href: '/rankings', label: 'Rankings', icon: TrendingUp },
    { href: '/premium', label: 'Premium', icon: Crown },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'glass-strong py-2' : 'bg-transparent py-4'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                  <span className="text-primary-foreground font-bold text-lg">M</span>
                </div>
                <motion.div
                  className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary to-accent opacity-0 blur-lg group-hover:opacity-50 transition-opacity"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-foreground">Manga</span>
                <span className="text-xl font-bold text-primary"> UZ</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <motion.div
                className="relative w-full"
                initial={false}
                animate={{ width: isSearchOpen ? '100%' : '100%' }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search manga, authors, genres..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setIsSearchOpen(false)}
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>

              {isAuthenticated && user ? (
                <>
                  {/* Diamond Balance */}
                  <Link href="/shop">
                    <motion.div
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Diamond className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-400">
                        {user.diamonds.toLocaleString()}
                      </span>
                      <motion.div
                        className="w-5 h-5 rounded-full bg-yellow-500/30 flex items-center justify-center"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-xs text-yellow-400">+</span>
                      </motion.div>
                    </motion.div>
                  </Link>

                  {/* Notifications */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      {unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium"
                        >
                          {unreadCount}
                        </motion.span>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsNotificationsOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-80 rounded-xl glass-strong border border-border/50 shadow-xl overflow-hidden z-50"
                          >
                            <div className="p-4 border-b border-border/50 flex items-center justify-between">
                              <h3 className="font-semibold">Notifications</h3>
                              {unreadCount > 0 && (
                                <button
                                  onClick={markAllNotificationsRead}
                                  className="text-xs text-primary hover:underline"
                                >
                                  Mark all read
                                </button>
                              )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                              {notifications.slice(0, 5).map((notification) => (
                                <motion.div
                                  key={notification.id}
                                  className={cn(
                                    'p-3 border-b border-border/30 cursor-pointer hover:bg-secondary/30 transition-colors',
                                    !notification.read && 'bg-primary/5'
                                  )}
                                  onClick={() => markNotificationRead(notification.id)}
                                  whileHover={{ x: 4 }}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={cn(
                                      'w-8 h-8 rounded-full flex items-center justify-center',
                                      notification.type === 'reward' && 'bg-yellow-500/20 text-yellow-400',
                                      notification.type === 'chapter' && 'bg-primary/20 text-primary',
                                      notification.type === 'system' && 'bg-neon/20 text-neon',
                                      notification.type === 'achievement' && 'bg-success/20 text-success',
                                    )}>
                                      {notification.type === 'reward' && <Gift className="w-4 h-4" />}
                                      {notification.type === 'chapter' && <BookOpen className="w-4 h-4" />}
                                      {notification.type === 'system' && <Sparkles className="w-4 h-4" />}
                                      {notification.type === 'achievement' && <Star className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{notification.title}</p>
                                      <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                                    </div>
                                    {!notification.read && (
                                      <div className="w-2 h-2 rounded-full bg-primary" />
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            <Link href="/notifications">
                              <div className="p-3 text-center text-sm text-primary hover:bg-secondary/30 transition-colors">
                                View all notifications
                              </div>
                            </Link>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-secondary/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/50"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary">{user.level}</span>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    </motion.button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-64 rounded-xl glass-strong border border-border/50 shadow-xl overflow-hidden z-50"
                          >
                            <div className="p-4 border-b border-border/50">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar}
                                  alt={user.username}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
                                />
                                <div>
                                  <p className="font-semibold">{user.username}</p>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-primary">Level {user.level}</span>
                                    <span className="text-muted-foreground">
                                      {user.xp}/{user.xpToNextLevel} XP
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-primary to-accent"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                                  transition={{ duration: 0.5, delay: 0.2 }}
                                />
                              </div>
                            </div>
                            <div className="p-2">
                              <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
                                <motion.div
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                  whileHover={{ x: 4 }}
                                >
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">My Profile</span>
                                </motion.div>
                              </Link>
                              <Link href="/shop" onClick={() => setIsProfileOpen(false)}>
                                <motion.div
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                  whileHover={{ x: 4 }}
                                >
                                  <Diamond className="w-4 h-4 text-yellow-400" />
                                  <span className="text-sm">Diamond Shop</span>
                                  <span className="ml-auto text-xs text-yellow-400 font-medium">{user.diamonds}</span>
                                </motion.div>
                              </Link>
                              {user.role === 'translator' && (
                                <Link href="/translator" onClick={() => setIsProfileOpen(false)}>
                                  <motion.div
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                    whileHover={{ x: 4 }}
                                  >
                                    <Upload className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Translator Dashboard</span>
                                  </motion.div>
                                </Link>
                              )}
                              {user.role === 'admin' && (
                                <Link href="/admin" onClick={() => setIsProfileOpen(false)}>
                                  <motion.div
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                    whileHover={{ x: 4 }}
                                  >
                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Admin Panel</span>
                                  </motion.div>
                                </Link>
                              )}
                              <Link href="/settings" onClick={() => setIsProfileOpen(false)}>
                                <motion.div
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                  whileHover={{ x: 4 }}
                                >
                                  <Settings className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">Settings</span>
                                </motion.div>
                              </Link>
                              <div className="my-2 border-t border-border/50" />
                              <motion.button
                                onClick={() => {
                                  logout()
                                  setIsProfileOpen(false)
                                }}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors w-full text-left text-destructive"
                                whileHover={{ x: 4 }}
                              >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm">Log Out</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDemoLogin}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Log In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"
                    onClick={handleDemoLogin}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="glass-strong border-b border-border/50 shadow-xl">
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search manga..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Mobile Nav Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <link.icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{link.label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Mobile Diamond Balance */}
                {isAuthenticated && user && (
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.div
                      className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Diamond className="w-5 h-5 text-yellow-400" />
                      <span className="font-semibold text-yellow-400">
                        {user.diamonds.toLocaleString()} Diamonds
                      </span>
                      <span className="text-xs text-yellow-400/70">Tap to buy more</span>
                    </motion.div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 pt-20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search manga, authors, genres..."
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-secondary/50 border border-border/50 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Quick Search Tags */}
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Solo Leveling', 'One Piece', 'Action', 'Romance', 'Isekai'].map((tag) => (
                    <motion.button
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-secondary/50 text-sm hover:bg-secondary transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tag}
                    </motion.button>
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
