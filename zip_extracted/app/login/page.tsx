'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowRight, 
  MessageCircle, Chrome, Sparkles, X, Diamond
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Login with mock user
    login(mockUser)
    setShowSuccess(true)
    
    // Redirect after animation
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    login(mockUser)
    setShowSuccess(true)
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Background Effects */}
      <ParticlesBackground />
      <FloatingOrbs />

      {/* Left Side - Form */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span className="text-primary-foreground font-bold text-xl">M</span>
            </motion.div>
            <div>
              <span className="text-2xl font-bold text-foreground">Manga</span>
              <span className="text-2xl font-bold text-primary"> UZ</span>
            </div>
          </Link>

          {/* Form Card */}
          <motion.div
            className="glass-strong rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Toggle */}
            <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-secondary/50 mb-8">
              <motion.button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  !isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </motion.button>
            </div>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center mb-6"
              >
                <h1 className="text-2xl font-bold mb-2">
                  {isLogin ? 'Welcome Back!' : 'Join Manga UZ'}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {isLogin 
                    ? 'Enter your credentials to continue reading' 
                    : 'Create an account and start your journey'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <motion.button
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5" />
                <span className="text-sm">Google</span>
              </motion.button>
              <motion.button
                onClick={() => handleSocialLogin('telegram')}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Telegram</span>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Terms */}
            {!isLogin && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            )}
          </motion.div>

          {/* Bonus Banner */}
          <motion.div
            className="mt-6 p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Diamond className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-sm">First-time bonus!</p>
                <p className="text-xs text-muted-foreground">
                  Get 50 free diamonds when you create an account
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=1200&h=1600&fit=crop"
            alt="Manga Art"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-medium">Premium Experience</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-balance">
              Dive into a World of Endless Stories
            </h2>
            <p className="text-muted-foreground max-w-md text-pretty">
              Join millions of readers and discover your next favorite manga. Read, collect, and support your favorite creators.
            </p>
            
            <div className="flex items-center gap-8 mt-8">
              <div>
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Manga Titles</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">1M+</p>
                <p className="text-sm text-muted-foreground">Active Readers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">5K+</p>
                <p className="text-sm text-muted-foreground">Translators</p>
              </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative glass-strong rounded-2xl p-8 max-w-sm text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-success/20 to-neon/20 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <Sparkles className="w-10 h-10 text-success" />
                </motion.div>
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">Welcome to Manga UZ!</h2>
              <p className="text-muted-foreground mb-6">
                You&apos;ve successfully logged in. Redirecting you to the homepage...
              </p>
              
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
                <Diamond className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">+50 Diamonds Bonus!</span>
              </div>
              
              <motion.div
                className="mt-6 h-1 rounded-full bg-secondary overflow-hidden"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
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
