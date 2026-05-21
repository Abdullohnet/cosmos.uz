'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowRight, 
  MessageCircle, Chrome, Sparkles, Diamond,
  Star, Users, BookOpen, Shield
} from 'lucide-react'
import { useUserStore, mockUser } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const { login } = useUserStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    login(mockUser)
    setShowSuccess(true)
    setTimeout(() => { router.push('/') }, 2000)
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    login(mockUser)
    setShowSuccess(true)
    setTimeout(() => { router.push('/') }, 2000)
  }

  const stats = [
    { icon: BookOpen, value: '50K+', label: "Manga sarlavhalari" },
    { icon: Users, value: '1M+', label: "Faol o'quvchilar" },
    { icon: Star, value: '5K+', label: 'Tarjimonlar' },
  ]

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Animated background */}
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
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, oklch(0.75 0.2 200) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '40%', left: '40%' }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(oklch(0.7 0.2 280) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.2 280) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Left Side — Form */}
      <div className="relative z-10 w-full lg:w-[480px] xl:w-[540px] flex items-center justify-center p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
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

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-title' : 'register-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mb-7"
            >
              <h1 className="text-3xl font-black mb-1.5 leading-tight">
                {isLogin ? (
                  <>Xush <span className="text-primary">kelibsiz!</span></>
                ) : (
                  <>Ro&apos;yxatdan <span className="text-primary">o&apos;ting</span></>
                )}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Davom etish uchun ma'lumotlaringizni kiriting"
                  : "Akkaunt yarating va o'qishni boshlang"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Toggle Tabs */}
          <div className="relative flex items-center p-1 rounded-xl bg-secondary/40 border border-border/40 mb-6">
            <motion.div
              className="absolute top-1 bottom-1 rounded-lg bg-primary"
              style={{ width: 'calc(50% - 4px)' }}
              animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`relative flex-1 py-2 text-sm font-semibold transition-colors duration-200 z-10 ${isLogin ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Kirish
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative flex-1 py-2 text-sm font-semibold transition-colors duration-200 z-10 ${!isLogin ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Ro&apos;yxatdan o&apos;tish
            </button>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <motion.button
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-border transition-all text-sm font-medium"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4" />
              <span>Google</span>
            </motion.button>
            <motion.button
              onClick={() => handleSocialLogin('telegram')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-border transition-all text-sm font-medium"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
            >
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span>Telegram</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted-foreground px-1">yoki email bilan</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            {isLogin && (
              <div className="flex items-center justify-between text-sm pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  <input type="checkbox" className="rounded border-border/50 w-3.5 h-3.5" />
                  <span className="text-xs">Eslab qolish</span>
                </label>
                <Link href="/forgot-password" className="text-primary hover:underline text-xs">
                  Parolni unutdingizmi?
                </Link>
              </div>
            )}

            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 glow-primary mt-1"
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
                  {isLogin ? 'Kirish' : 'Akkaunt yaratish'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {!isLogin && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Akkaunt yaratib,{' '}
              <Link href="/terms" className="text-primary hover:underline">Foydalanish shartlari</Link>
              {' '}va{' '}
              <Link href="/privacy" className="text-primary hover:underline">Maxfiylik siyosati</Link>
              {' '}ga rozilik bildirasiz
            </p>
          )}

          {/* Bonus Banner */}
          <motion.div
            className="mt-6 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 flex items-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
                Akkaunt ochganingizda <span className="text-yellow-400 font-medium">50 ta olmos</span> sovg&apos;a
              </p>
            </div>
          </motion.div>

          {/* Security badge */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Shield className="w-3.5 h-3.5 text-success" />
            <span>256-bit shifrlash bilan himoyalangan</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side — Visual */}
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

        {/* Floating manga cards */}
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

        {/* Content */}
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
              Millionlab o&apos;quvchilar bilan qo&apos;shiling va o&apos;zingizning sevimli mangangizni toping.
            </p>

            {/* Stats */}
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

            {/* Social proof */}
            <motion.div
              className="mt-8 flex items-center gap-3 p-3 rounded-xl glass border border-border/30 w-fit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop',
                  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop',
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop'
                ].map((src, i) => (
                  <img key={i} src={src} className="w-7 h-7 rounded-full border-2 border-background object-cover" alt="" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">1000+ foydalanuvchi baho berdi</p>
              </div>
            </motion.div>
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
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: '0 0 60px oklch(0.6 0.25 280 / 0.3)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <motion.div
                className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }}>
                  <Sparkles className="w-9 h-9 text-primary" />
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-2xl font-black mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Manga UZ ga <span className="text-primary">xush kelibsiz!</span>
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Muvaffaqiyatli kirdingiz. Bosh sahifaga yo&apos;naltirilmoqda...
              </motion.p>

              <motion.div
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-yellow-500/15 border border-yellow-500/25"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1, delay: 0.7 }}>
                  <Diamond className="w-5 h-5 text-yellow-400" />
                </motion.div>
                <span className="font-semibold text-sm">+50 ta Olmos bonus!</span>
              </motion.div>

              <motion.div className="mt-5 h-1 rounded-full bg-secondary/50 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'linear' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
