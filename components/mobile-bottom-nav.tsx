'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BookOpen, TrendingUp, Crown, User } from 'lucide-react'
import { useUserStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Bosh' },
  { href: '/browse', icon: BookOpen, label: "Ko'rish" },
  { href: '/rankings', icon: TrendingUp, label: 'Reyting' },
  { href: '/premium', icon: Crown, label: 'Premium' },
  { href: '/profile', icon: User, label: 'Profil' },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { isAuthenticated } = useUserStore()

  const hideOn = ['/login', '/apply']
  if (hideOn.some(p => pathname.startsWith(p))) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      {/* Blur background */}
      <div className="glass-strong border-t border-border/40 px-2 pt-2 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all relative"
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-primary/15"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="relative"
                >
                  <item.icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {/* Crown special effect */}
                  {item.href === '/premium' && (
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-400"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-[9px] font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
