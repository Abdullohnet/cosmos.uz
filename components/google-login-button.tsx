'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

interface GoogleLoginButtonProps {
  onError?: (msg: string) => void
  onLoading?: (v: boolean) => void
}

const isConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
)

export function GoogleLoginButton({ onError, onLoading }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const { login } = useUserStore()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setLoading(true)
    onLoading?.(true)
    try {
      const { signInWithGoogle } = await import('@/lib/firebase')
      const { uid, email, displayName, photoURL } = await signInWithGoogle()

      const res = await fetch('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email, displayName, photoURL }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xato')

      login(data.data.user)
      const dest = data.data.user.role === 'admin' ? '/admin'
        : data.data.user.role === 'translator' ? '/translator' : '/'
      router.push(dest)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google login xatosi'
      if (!msg.includes('popup-closed')) onError?.(msg)
    } finally {
      setLoading(false)
      onLoading?.(false)
    }
  }

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border/20 bg-secondary/10 text-muted-foreground/40 text-sm cursor-not-allowed select-none">
        <GoogleIcon className="w-4 h-4" />
        Google (sozlanmagan)
      </div>
    )
  }

  return (
    <motion.button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-border transition-all text-sm font-medium disabled:opacity-60"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <GoogleIcon className="w-4 h-4" />
      )}
      <span>{loading ? 'Kutilmoqda...' : 'Google orqali kirish'}</span>
    </motion.button>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
