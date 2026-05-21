'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, User, Bell, Shield, Palette, Eye,
  Moon, Sun, LogOut, Trash2, ChevronRight,
  ArrowLeft, Check, Lock, AlertCircle, KeyRound
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { useUserStore, useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account')
  const [saved, setSaved] = useState(false)
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    new_chapter: true,
    achievements: true,
    rewards: true,
    social: false,
    promotional: false,
    auto_next: true,
    show_comments: true,
    particles: true,
    public_profile: true,
    show_reading_history: false,
    allow_messages: true,
  })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)

  const { user, logout, isAuthenticated, login } = useUserStore()
  const { showParticles, toggleParticles } = useUIStore()

  const handleToggle = (id: string) => {
    if (id === 'particles') toggleParticles()
    setToggleStates(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSaveAccount = async () => {
    if (!user) return
    setSaveLoading(true)
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username || undefined,
          bio: bio || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xato')
      login({ ...user, ...data.data.user })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      // silent
    } finally {
      setSaveLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    if (newPassword !== confirmPassword) {
      setPwError('Yangi parollar mos kelmadi')
      return
    }
    if (newPassword.length < 6) {
      setPwError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
      return
    }
    setPwLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xato')
      setPwSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPwSuccess(false), 3000)
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : 'Xato yuz berdi')
    } finally {
      setPwLoading(false)
    }
  }

  const sections = [
    { id: 'account', label: 'Hisob', icon: User },
    { id: 'security', label: 'Xavfsizlik', icon: Shield },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    { id: 'reading', label: 'O\'qish', icon: Eye },
    { id: 'appearance', label: 'Ko\'rinish', icon: Palette },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold">Sozlamalar</h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl overflow-hidden">
                {sections.map((section, i) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                        i !== 0 && 'border-t border-border/30',
                        activeSection === section.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{section.label}</span>
                      {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  )
                })}

                <div className="border-t border-border/30">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Chiqish</span>
                  </button>
                </div>
              </div>

              <div className="glass rounded-xl p-4 mt-4 border border-destructive/20">
                <h3 className="text-sm font-semibold text-destructive mb-3">Xavfli hudud</h3>
                <Button variant="destructive" size="sm" className="w-full text-xs gap-2">
                  <Trash2 className="w-3.5 h-3.5" />
                  Hisobni o&apos;chirish
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* HISOB */}
                  {activeSection === 'account' && (
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                        <div className="p-2 rounded-xl bg-primary/20">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="font-bold text-lg">Hisob ma&apos;lumotlari</h2>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-2">Foydalanuvchi nomi</label>
                          <input
                            type="text"
                            defaultValue={user?.username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={user?.username || 'Foydalanuvchi nomi'}
                            className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-2">Email manzil</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3 py-2.5 rounded-lg bg-secondary/30 border border-border/30 text-sm opacity-60 cursor-not-allowed"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Email manzil o&apos;zgartirib bo&apos;lmaydi</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-2">Bio</label>
                          <textarea
                            defaultValue={user?.bio || ''}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="O'zingiz haqingizda..."
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          />
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                        <Button onClick={handleSaveAccount} disabled={saveLoading} className="gap-2">
                          {saved ? (
                            <><Check className="w-4 h-4" /> Saqlandi!</>
                          ) : saveLoading ? (
                            <motion.div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity }} />
                          ) : 'Saqlash'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* XAVFSIZLIK — PAROL O'ZGARTIRISH */}
                  {activeSection === 'security' && (
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                        <div className="p-2 rounded-xl bg-primary/20">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="font-bold text-lg">Xavfsizlik</h2>
                      </div>

                      <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <KeyRound className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">Parolni o&apos;zgartirish</p>
                          <p className="text-xs text-muted-foreground">Hisobingizni himoya qilish uchun kuchli parol tanlang</p>
                        </div>
                      </div>

                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-2">
                            <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                            Joriy parol
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-2">
                            <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                            Yangi parol
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Kamida 6 ta belgi"
                            required
                            className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-2">
                            <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                            Yangi parolni tasdiqlang
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Qayta kiriting"
                            required
                            className={cn(
                              'w-full px-3 py-2.5 rounded-lg bg-secondary/50 border text-sm focus:outline-none focus:ring-2',
                              confirmPassword && newPassword !== confirmPassword
                                ? 'border-destructive/50 focus:ring-destructive/30'
                                : 'border-border/50 focus:ring-primary/50'
                            )}
                          />
                          {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-destructive mt-1">Parollar mos kelmadi</p>
                          )}
                        </div>

                        <AnimatePresence>
                          {pwError && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium"
                            >
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              {pwError}
                            </motion.div>
                          )}
                          {pwSuccess && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium"
                            >
                              <Check className="w-4 h-4 flex-shrink-0" />
                              Parol muvaffaqiyatli o&apos;zgartirildi!
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            disabled={pwLoading || (!!confirmPassword && newPassword !== confirmPassword)}
                            className="gap-2"
                          >
                            {pwLoading ? (
                              <motion.div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity }} />
                            ) : (
                              <><KeyRound className="w-4 h-4" /> Parolni o&apos;zgartirish</>
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* BILDIRISHNOMALAR */}
                  {activeSection === 'notifications' && (
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                        <div className="p-2 rounded-xl bg-primary/20">
                          <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="font-bold text-lg">Bildirishnomalar</h2>
                      </div>
                      <div className="space-y-5">
                        {[
                          { id: 'new_chapter', label: 'Yangi bob chiqdi', desc: 'Bookmark qilgan manhwalaringiz yangi bobi chiqqanda' },
                          { id: 'achievements', label: 'Yutuqlar', desc: 'Yangi yutuqqa ega bo\'lganda' },
                          { id: 'rewards', label: 'Mukofotlar', desc: 'Olmos va sovg\'alar olganda' },
                          { id: 'social', label: 'Ijtimoiy', desc: 'Izohlar va reaksiyalar' },
                          { id: 'promotional', label: 'Aksiya va reklama', desc: 'Maxsus takliflar va yangiliklar' },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle(item.id)}
                              className={cn(
                                'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
                                toggleStates[item.id] ? 'bg-primary' : 'bg-secondary'
                              )}
                            >
                              <span className={cn(
                                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                                toggleStates[item.id] ? 'translate-x-5' : 'translate-x-0'
                              )} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* O'QISH */}
                  {activeSection === 'reading' && (
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                        <div className="p-2 rounded-xl bg-primary/20">
                          <Eye className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="font-bold text-lg">O&apos;qish sozlamalari</h2>
                      </div>
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium">O&apos;qish rejimi</p>
                            <p className="text-xs text-muted-foreground">Sahifalarni qanday ko&apos;rsatish</p>
                          </div>
                          <select className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                            <option value="webtoon">Webtoon</option>
                            <option value="vertical">Vertikal</option>
                            <option value="horizontal">Gorizontal</option>
                          </select>
                        </div>
                        {[
                          { id: 'auto_next', label: 'Avtomatik keyingi bob', desc: 'Bob tugaganda avtomatik o\'tish' },
                          { id: 'show_comments', label: 'Izohlarni ko\'rsatish', desc: 'O\'qish sahifasida izohlar' },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle(item.id)}
                              className={cn(
                                'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
                                toggleStates[item.id] ? 'bg-primary' : 'bg-secondary'
                              )}
                            >
                              <span className={cn(
                                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                                toggleStates[item.id] ? 'translate-x-5' : 'translate-x-0'
                              )} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KO'RINISH */}
                  {activeSection === 'appearance' && (
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                        <div className="p-2 rounded-xl bg-primary/20">
                          <Palette className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="font-bold text-lg">Ko&apos;rinish</h2>
                      </div>
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium">Mavzu</p>
                            <p className="text-xs text-muted-foreground">Sayt rangi</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="w-9 h-9 rounded-lg bg-zinc-900 border-2 border-primary flex items-center justify-center">
                              <Moon className="w-4 h-4 text-white" />
                            </button>
                            <button className="w-9 h-9 rounded-lg bg-gray-100 border-2 border-border flex items-center justify-center opacity-40 cursor-not-allowed" disabled>
                              <Sun className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium">Zarralar animatsiyasi</p>
                            <p className="text-xs text-muted-foreground">Fon animatsiyasi (ishlash tezligiga ta&apos;sir qiladi)</p>
                          </div>
                          <button
                            onClick={() => handleToggle('particles')}
                            className={cn(
                              'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
                              showParticles ? 'bg-primary' : 'bg-secondary'
                            )}
                          >
                            <span className={cn(
                              'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                              showParticles ? 'translate-x-5' : 'translate-x-0'
                            )} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
