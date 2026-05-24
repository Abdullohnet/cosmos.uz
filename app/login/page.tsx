'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Diamond, Star, Users, BookOpen, Shield, LogIn, AlertCircle } from 'lucide-react'
import { useUserStore, mockUser, mockTranslatorUser, mockAdminUser } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successRole, setSuccessRole] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [siteStats, setSiteStats] = useState({ totalManga: 156, totalUsers: 1248, totalTranslators: 42 })

  const { login, logout, isAuthenticated, setUser } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) logout()
    
    // Load demo stats
    try {
      const savedStats = localStorage.getItem('siteStats')
      if (savedStats) {
        setSiteStats(JSON.parse(savedStats))
      }
    } catch (e) {}
  }, [])

  // Demo users database
  const demoUsers = [
    { 
      email: 'saidabbos027@gmail.com', 
      password: 'Abbos1226', 
      user: {
        ...mockAdminUser,
        id: 'admin_001',
        username: 'Saidabbos Admin',
        email: 'saidabbos027@gmail.com',
        role: 'admin'
      }
    },
    { 
      email: 'translator@mangauz.com', 
      password: 'translator123', 
      user: {
        ...mockTranslatorUser,
        role: 'translator'
      }
    },
    { 
      email: 'user@mangauz.com', 
      password: 'user123', 
      user: {
        ...mockUser,
        role: 'user'
      }
    },
    { 
      email: 'admin@mangauz.com', 
      password: 'admin123', 
      user: {
        ...mockAdminUser,
        role: 'admin'
      }
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      let foundUser = null

      if (isLogin) {
        // Login - find by email and password
        foundUser = demoUsers.find(u => u.email === email && u.password === password)
        
        if (!foundUser) {
          setErrorMsg('Email yoki parol noto‘g‘ri')
          setIsLoading(false)
          return
        }
      } else {
        // Register - check if email already exists
        const existingUser = demoUsers.find(u => u.email === email)
        if (existingUser) {
          setErrorMsg('Bu email allaqachon ro‘yxatdan o‘tgan')
          setIsLoading(false)
          return
        }
        
        if (!username || username.length < 3) {
          setErrorMsg('Foydalanuvchi nomi kamida 3 belgidan iborat bo‘lishi kerak')
          setIsLoading(false)
          return
        }
        
        if (password.length < 6) {
          setErrorMsg('Parol kamida 6 belgidan iborat bo‘lishi kerak')
          setIsLoading(false)
          return
        }
        
        // Create new user
        foundUser = {
          email,
          password,
          user: {
            ...mockUser,
            id: Date.now().toString(),
            username: username,
            email: email,
            role: 'user',
            createdAt: new Date().toISOString()
          }
        }
      }

      const user = foundUser.user
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAuthenticated', 'true')
      
      // Update store
      login(user)
      
      setSuccessRole(user.role === 'admin' ? 'Admin' : user.role === 'translator' ? 'Tarjimon' : 'Foydalanuvchi')
      setShowSuccess(true)
      
      const dest = user.role === 'admin' ? '/admin' : user.role === 'translator' ? '/translator' : '/'
      
      setTimeout(() => {
        router.push(dest)
      }, 1800)
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Xato yuz berdi')
    } finally {
      setIsLoading(false)
    }
  }

  // Quick login helper
  const quickLogin = (email: string, password: string, role: string) => {
    setEmail(email)
    setPassword(password)
    setTimeout(() => {
      const formEvent = new Event('submit') as any
      handleSubmit(formEvent)
    }, 100)
  }

  const fmtCount = (n: number) => n === 0 ? '—' : n >= 1000 ? `${(n/1000).toFixed(n >= 10000 ? 0 : 1)}K+` : `${n}+`

  const stats = [
    { icon: BookOpen, value: fmtCount(siteStats.totalManga), label: "Manga sarlavhalari" },
    { icon: Users, value: fmtCount(siteStats.totalUsers), label: "Ro'yxatdan o'tganlar" },
    { icon: Star, value: fmtCount(siteStats.totalTranslators), label: 'Tarjimonlar' },
  ]

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, oklch(0.6 0.25 280) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '-10%', left: '-10%' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, oklch(0.6 0.3 260) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ bottom: '0%', right: '-5%' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(oklch(0.7 0.2 280) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.2 280) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Login Form Section */}
      <div className="relative z-10 w-full lg:w-[500px] xl:w-[560px] flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md py-4"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 group w-fit">
            <motion.div
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-primary-foreground font-black text-xl">M</span>
            </motion.div>
            <div>
              <span className="text-2xl font-black text-foreground tracking-tight">Manga</span>
              <span className="text-2xl font-black text-primary tracking-tight"> UZ</span>
            </div>
          </Link>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-title' : 'register-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-black mb-1.5 leading-tight">
                {isLogin ? (
                  <>Xush <span className="text-primary">kelibsiz!</span></>
                ) : (
                  <>Akkaunt <span className="text-primary">yarating</span></>
                )}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Davom etish uchun ma'lumotlaringizni kiriting"
                  : "Ro'yxatdan o'ting va o'qishni boshlang"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Toggle Buttons */}
          <div className="relative flex items-center p-1 rounded-xl bg-secondary/40 border border-border/40 mb-6">
            <motion.div
              className="absolute top-1 bottom-1 rounded-lg bg-primary"
              style={{ width: 'calc(50% - 4px)' }}
              animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`relative flex-1 py-2.5 text-sm font-semibold transition-colors duration-200 z-10 ${isLogin ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Kirish
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative flex-1 py-2.5 text-sm font-semibold transition-colors duration-200 z-10 ${!isLogin ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Foydalanuvchi nomi"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/40 border border-border/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="Email manzil"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/40 border border-border/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-secondary/40 border border-border/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  <input type="checkbox" className="rounded border-border/50 w-3.5 h-3.5" />
                  <span className="text-xs">Eslab qolish</span>
                </label>
                <button type="button" className="text-primary hover:underline text-xs">
                  Parolni unutdingizmi?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 glow-primary"
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isLogin ? 'Kirish' : 'Akkaunt yaratish'}
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Accounts Section - Only for testing */}
          {isLogin && (
            <div className="mt-6 p-3 rounded-xl bg-secondary/30 border border-border/30">
              <p className="text-xs text-center text-muted-foreground mb-2">Demo hisoblar (test uchun):</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => quickLogin('saidabbos027@gmail.com', 'Abbos1226', 'admin')}
                  className="text-xs px-2 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('translator@mangauz.com', 'translator123', 'translator')}
                  className="text-xs px-2 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                >
                  📖 Translator
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('user@mangauz.com', 'user123', 'user')}
                  className="text-xs px-2 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  👤 User
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Akkaunt yaratib,{' '}
              <Link href="/terms" className="text-primary hover:underline">Foydalanish shartlari</Link>
              {' '}va{' '}
              <Link href="/privacy" className="text-primary hover:underline">Maxfiylik siyosati</Link>
              {' '}ga rozilik bildirasiz
            </p>
          )}

          {/* Bonus Card */}
          <motion.div
            className="mt-6 p-3.5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 flex items-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div
              className="p-2 rounded-lg bg-yellow-500/20 flex-shrink-0"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <Diamond className="w-5 h-5 text-yellow-400" />
            </motion.div>
            <div>
              <p className="font-semibold text-sm">Yangi foydalanuvchi bonusi!</p>
              <p className="text-xs text-muted-foreground">
                Akkaunt ochganingizda <span className="text-yellow-400 font-medium">50 ta olmos</span> sovg'a
              </p>
            </div>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit shifrlash bilan himoyalangan</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1400&h=1800&fit=crop"
            alt="Manga Art"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[
            { src: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=280&fit=crop', left: '62%', top: '12%', rotate: '-8deg', delay: 0 },
            { src: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=200&h=280&fit=crop', left: '76%', top: '32%', rotate: '6deg', delay: 0.3 },
            { src: 'https://images.unsplash.com/photo-1559570278-f8a4c7e5e786?w=200&h=280&fit=crop', left: '58%', top: '56%', rotate: '-4deg', delay: 0.6 },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="absolute w-28 rounded-lg overflow-hidden shadow-2xl border border-white/10"
              style={{ left: card.left, top: card.top, rotate: card.rotate }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: card.delay + 0.8, duration: 0.5 },
                scale: { delay: card.delay + 0.8, duration: 0.5 },
                y: { delay: card.delay + 1.5, duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              <img src={card.src} alt="" className="w-full h-40 object-cover" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-end p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium mb-5"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Premium tajriba
            </motion.div>

            <h2 className="text-4xl xl:text-5xl font-black mb-4 leading-tight">
              Cheksiz hikoyalar<br />
              <span className="text-primary">dunyosiga</span> kiring
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              O'zbek tilida manga va manhwa o'qing. Tarjimonlar jamoasiga qo'shiling.
            </p>

            <div className="flex items-center gap-6 mt-8">
              {stats.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="text-2xl font-black text-primary">{value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 25 }}
              className="relative glass-strong rounded-2xl p-8 max-w-sm text-center mx-4 border border-primary/20"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }}>
                  <Sparkles className="w-9 h-9 text-primary" />
                </motion.div>
              </motion.div>
              <h2 className="text-2xl font-black mb-2">
                <span className="text-primary">{successRole}</span> sifatida kirdingiz!
              </h2>
              <p className="text-muted-foreground text-sm mb-6">Muvaffaqiyatli kirdingiz. Yo'naltirilmoqda...</p>
              <motion.div className="mt-4 h-1 rounded-full bg-secondary/50 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: 'linear' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}