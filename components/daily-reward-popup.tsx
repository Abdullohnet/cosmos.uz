'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Diamond, X, Flame, Gift, Star, CheckCircle2 } from 'lucide-react'
import { useUserStore } from '@/lib/store'

const STORAGE_KEY = 'manga-uz-last-reward'

const streakDays = [
  { day: 1, reward: 10, label: 'Dush' },
  { day: 2, reward: 20, label: 'Sesh' },
  { day: 3, reward: 30, label: 'Chor' },
  { day: 4, reward: 40, label: 'Pay' },
  { day: 5, reward: 50, label: 'Juma' },
  { day: 6, reward: 75, label: 'Shan' },
  { day: 7, reward: 150, label: 'Yak', bonus: true },
]

export function DailyRewardPopup() {
  const [show, setShow] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [streak, setStreak] = useState(1)
  const { isAuthenticated, addDiamonds } = useUserStore()

  useEffect(() => {
    if (!isAuthenticated) return
    const lastReward = localStorage.getItem(STORAGE_KEY)
    const now = Date.now()
    if (!lastReward || now - Number(lastReward) > 23 * 3600 * 1000) {
      const timer = setTimeout(() => setShow(true), 2000)
      const streakData = localStorage.getItem('manga-uz-streak')
      const currentStreak = streakData ? ((Number(streakData) % 7) || 7) : 1
      setStreak(currentStreak)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated])

  const handleClaim = () => {
    const currentDay = streakDays[streak - 1]
    addDiamonds(currentDay.reward)
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    const nextStreak = (streak % 7) + 1
    localStorage.setItem('manga-uz-streak', String(nextStreak))
    setClaimed(true)
    setTimeout(() => setShow(false), 2500)
  }

  const handleClose = () => setShow(false)

  if (!isAuthenticated) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ scale: 0.75, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.75, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="relative glass-strong rounded-3xl p-6 w-full max-w-sm border border-border/40 shadow-2xl overflow-hidden"
          >
            {/* BG glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, oklch(0.6 0.25 280 / 0.25) 0%, transparent 60%)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative text-center mb-5">
              <motion.div
                className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30 border border-orange-500/40 flex items-center justify-center"
                animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Flame className="w-8 h-8 text-orange-400" />
              </motion.div>
              <h2 className="text-xl font-black mb-0.5">Kunlik Mukofot!</h2>
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span><span className="text-orange-400 font-bold">{streak}</span>-kun seriyasi</span>
              </div>
            </div>

            {/* Streak days */}
            <div className="grid grid-cols-7 gap-1 mb-5">
              {streakDays.map((d) => {
                const isPast = d.day < streak
                const isCurrent = d.day === streak
                return (
                  <motion.div
                    key={d.day}
                    className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-b from-primary/30 to-accent/20 border-primary/60 shadow-lg shadow-primary/20'
                        : isPast
                        ? 'bg-secondary/30 border-border/20 opacity-60'
                        : 'bg-secondary/20 border-border/20 opacity-40'
                    }`}
                    animate={isCurrent ? { scale: [1, 1.06, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-[8px] text-muted-foreground font-medium">{d.label}</span>
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : d.bonus ? (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Diamond className={`w-4 h-4 ${isCurrent ? 'text-primary' : 'text-muted-foreground/50'}`} />
                    )}
                    <span className={`text-[8px] font-bold ${isCurrent ? 'text-primary' : 'text-muted-foreground/60'}`}>
                      +{d.reward}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Reward highlight */}
            <motion.div
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border border-yellow-500/30 mb-4"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <Gift className="w-7 h-7 text-yellow-400" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">Bugungi mukofot</p>
                <div className="flex items-center gap-1.5">
                  <Diamond className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-black text-yellow-400">+{streakDays[streak - 1]?.reward}</span>
                  <span className="text-sm font-medium">olmos</span>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!claimed ? (
                <motion.button
                  key="claim"
                  onClick={handleClaim}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 glow-primary"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Gift className="w-4 h-4" />
                  Mukofotni Olish
                </motion.button>
              ) : (
                <motion.div
                  key="claimed"
                  className="w-full py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Olindi! +{streakDays[streak - 1]?.reward} olmos
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
