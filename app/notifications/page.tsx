'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, BookOpen, Gift, Star, Sparkles, Check, 
  Trash2, Settings, Users, Diamond, ArrowLeft
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const notifIcons = {
  reward: { icon: Gift, color: 'bg-yellow-500/20 text-yellow-400' },
  chapter: { icon: BookOpen, color: 'bg-primary/20 text-primary' },
  system: { icon: Sparkles, color: 'bg-neon/20 text-neon' },
  achievement: { icon: Star, color: 'bg-success/20 text-success' },
  social: { icon: Users, color: 'bg-accent/20 text-accent' },
}

const mockExtraNotifs = [
  { id: '10', type: 'social' as const, title: 'Yangi obunachi', message: 'MangaKing sizga obuna bo\'ldi', read: true, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: '11', type: 'chapter' as const, title: 'Yangi bob', message: 'Tower of God 581-bob chiqdi!', read: true, createdAt: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: '12', type: 'achievement' as const, title: 'Yutuq ochildi!', message: '"Kitobxon" badji sizga berildi', read: true, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: '13', type: 'reward' as const, title: 'Kunlik mukofot', message: 'Tizimga kirginingiz uchun +10 olmoz', read: true, createdAt: new Date(Date.now() - 3600000 * 26).toISOString() },
  { id: '14', type: 'system' as const, title: 'Platforma yangilandi', message: 'Yangi o\'quvchi rejimi qo\'shildi', read: true, createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
]

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useUserStore()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [localDeleted, setLocalDeleted] = useState<string[]>([])

  const allNotifs = [...notifications, ...mockExtraNotifs]
    .filter(n => !localDeleted.includes(n.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filtered = filter === 'unread' ? allNotifs.filter(n => !n.read) : allNotifs
  const unreadCount = allNotifs.filter(n => !n.read).length

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (days > 0) return `${days} kun oldin`
    if (hours > 0) return `${hours} soat oldin`
    return `${mins} daqiqa oldin`
  }

  const deleteNotif = (id: string) => {
    setLocalDeleted(prev => [...prev, id])
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold">Bildirishnomalar</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllNotificationsRead} className="text-xs">
                <Check className="w-3.5 h-3.5 mr-1" />
                Hammasini o&apos;qish
              </Button>
            )}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-6">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'unread', label: `O'qilmagan (${unreadCount})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                  filter === f.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Bell className="w-14 h-14 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="font-semibold text-lg mb-2">Bildirishnoma yo&apos;q</h3>
              <p className="text-muted-foreground text-sm">
                {filter === 'unread' ? 'Barcha bildirishnomalar o\'qilgan' : 'Bildirishnomalar hali yo\'q'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((notif, i) => {
                  const config = notifIcons[notif.type as keyof typeof notifIcons] || notifIcons.system
                  const Icon = config.icon
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={cn(
                        'glass rounded-xl p-4 flex items-start gap-4 group cursor-pointer transition-colors hover:bg-secondary/30',
                        !notif.read && 'ring-1 ring-primary/20 bg-primary/5'
                      )}
                      onClick={() => markNotificationRead(notif.id)}
                    >
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', config.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm">{notif.title}</p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                            <button
                              onClick={e => { e.stopPropagation(); deleteNotif(notif.id) }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-secondary transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatTime(notif.createdAt)}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
