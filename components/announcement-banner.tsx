'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Megaphone, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useUIStore } from '@/lib/store'

const BANNER_KEY = 'manga-uz-banner-dismissed'

const announcements = [
  { id: 'v2-launch', text: "🎉 Manga UZ 2.0 — yangi dizayn va funksiyalar!", link: '/premium', linkText: 'Batafsil' },
  { id: 'summer-promo', text: "☀️ Yoz chegirmasi: Premium'ga 50% chegirma!", link: '/premium', linkText: 'Yangilash' },
  { id: 'new-manga', text: "📚 Yangi 500+ manga qo'shildi!", link: '/browse?sort=new', linkText: "Ko'rish" },
]

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false)
  const [idx, setIdx] = useState(0)
  const { setBannerVisible } = useUIStore()

  useEffect(() => {
    const dismissed = sessionStorage.getItem(BANNER_KEY)
    if (!dismissed) {
      const t = setTimeout(() => {
        setVisible(true)
        setBannerVisible(true)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setIdx(prev => (prev + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [visible])

  const dismiss = () => {
    setVisible(false)
    setBannerVisible(false)
    sessionStorage.setItem(BANNER_KEY, '1')
  }

  const ann = announcements[idx]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed top-0 left-0 right-0 z-[70] h-10 overflow-hidden"
        >
          <div className="h-full bg-gradient-to-r from-primary via-accent to-primary relative overflow-hidden flex items-center">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative flex items-center justify-center w-full px-10 gap-2">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Megaphone className="w-3.5 h-3.5 text-primary-foreground/90 flex-shrink-0" />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-semibold text-primary-foreground">{ann.text}</span>
                  <Link href={ann.link} onClick={dismiss}
                    className="flex items-center gap-0.5 text-xs font-bold text-primary-foreground/80 hover:text-primary-foreground underline underline-offset-2 transition-colors">
                    {ann.linkText}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center gap-1 ml-2">
                {announcements.map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full bg-primary-foreground/40 cursor-pointer h-[5px]"
                    style={{ width: i === idx ? 16 : 5 }}
                    animate={{ width: i === idx ? 16 : 5 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIdx(i)}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={dismiss}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors text-primary-foreground/70 hover:text-primary-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
