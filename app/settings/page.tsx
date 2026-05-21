'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, User, Bell, Shield, Palette, Eye,
  Moon, Sun, Globe, LogOut, Trash2, ChevronRight,
  ArrowLeft, Check, Smartphone, Lock, Mail
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { useUserStore, useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const settingsSections = [
  {
    id: 'account',
    label: 'Hisob',
    icon: User,
    items: [
      { id: 'username', label: 'Foydalanuvchi nomi', type: 'text', value: '' },
      { id: 'email', label: 'Email manzil', type: 'email', value: '' },
      { id: 'bio', label: 'Bio', type: 'textarea', value: '' },
    ],
  },
  {
    id: 'notifications',
    label: 'Bildirishnomalar',
    icon: Bell,
    items: [
      { id: 'new_chapter', label: 'Yangi bob chiqdi', type: 'toggle', value: true },
      { id: 'achievements', label: 'Yutuqlar', type: 'toggle', value: true },
      { id: 'rewards', label: 'Mukofotlar', type: 'toggle', value: true },
      { id: 'social', label: 'Ijtimoiy bildirishnomalar', type: 'toggle', value: false },
      { id: 'promotional', label: 'Aksiya va reklama', type: 'toggle', value: false },
    ],
  },
  {
    id: 'reading',
    label: 'O\'qish sozlamalari',
    icon: Eye,
    items: [
      { id: 'reader_mode', label: 'O\'qish rejimi', type: 'select', value: 'webtoon', options: ['webtoon', 'vertical', 'horizontal'] },
      { id: 'auto_next', label: 'Avtomatik keyingi bob', type: 'toggle', value: true },
      { id: 'show_comments', label: 'Izohlarni ko\'rsatish', type: 'toggle', value: true },
    ],
  },
  {
    id: 'appearance',
    label: 'Ko\'rinish',
    icon: Palette,
    items: [
      { id: 'theme', label: 'Mavzu', type: 'theme', value: 'dark' },
      { id: 'particles', label: 'Zarralar animatsiyasi', type: 'toggle', value: true },
      { id: 'language', label: 'Til', type: 'select', value: 'uz', options: ['uz', 'ru', 'en'] },
    ],
  },
  {
    id: 'privacy',
    label: 'Maxfiylik',
    icon: Shield,
    items: [
      { id: 'public_profile', label: 'Ochiq profil', type: 'toggle', value: true },
      { id: 'show_reading_history', label: 'O\'qish tarixini ko\'rsatish', type: 'toggle', value: false },
      { id: 'allow_messages', label: 'Xabar olishga ruxsat', type: 'toggle', value: true },
    ],
  },
]

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

  const { user, logout, isAuthenticated } = useUserStore()
  const { showParticles, toggleParticles } = useUIStore()

  const handleToggle = (id: string) => {
    if (id === 'particles') toggleParticles()
    setToggleStates(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentSection = settingsSections.find(s => s.id === activeSection)

  const langLabels: Record<string, string> = { uz: 'O\'zbek', ru: 'Русский', en: 'English' }
  const modeLabels: Record<string, string> = { webtoon: 'Webtoon', vertical: 'Vertikal', horizontal: 'Gorizontal' }

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
                {settingsSections.map((section, i) => {
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
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
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

              {/* Danger Zone */}
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
              {currentSection && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                      <div className="p-2 rounded-xl bg-primary/20">
                        <currentSection.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="font-bold text-lg">{currentSection.label}</h2>
                    </div>

                    <div className="space-y-6">
                      {currentSection.items.map((item) => (
                        <div key={item.id} className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.label}</p>
                          </div>

                          {item.type === 'toggle' && (
                            <button
                              onClick={() => handleToggle(item.id)}
                              className={cn(
                                'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
                                (item.id === 'particles' ? showParticles : toggleStates[item.id])
                                  ? 'bg-primary'
                                  : 'bg-secondary'
                              )}
                            >
                              <span className={cn(
                                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                                (item.id === 'particles' ? showParticles : toggleStates[item.id])
                                  ? 'translate-x-5'
                                  : 'translate-x-0'
                              )} />
                            </button>
                          )}

                          {item.type === 'text' && (
                            <input
                              type="text"
                              defaultValue={user?.username || ''}
                              placeholder={item.label}
                              className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full max-w-xs"
                            />
                          )}

                          {item.type === 'email' && (
                            <input
                              type="email"
                              defaultValue={user?.email || ''}
                              placeholder={item.label}
                              className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full max-w-xs"
                            />
                          )}

                          {item.type === 'textarea' && (
                            <textarea
                              defaultValue={user?.bio || ''}
                              placeholder="O'zingiz haqingizda..."
                              rows={3}
                              className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full max-w-xs resize-none"
                            />
                          )}

                          {item.type === 'select' && item.options && (
                            <select
                              defaultValue={item.value}
                              className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                              {item.options.map(opt => (
                                <option key={opt} value={opt}>
                                  {item.id === 'language' ? langLabels[opt] : item.id === 'reader_mode' ? modeLabels[opt] : opt}
                                </option>
                              ))}
                            </select>
                          )}

                          {item.type === 'theme' && (
                            <div className="flex items-center gap-2">
                              <button className="w-9 h-9 rounded-lg bg-zinc-900 border-2 border-primary flex items-center justify-center">
                                <Moon className="w-4 h-4 text-white" />
                              </button>
                              <button className="w-9 h-9 rounded-lg bg-gray-100 border-2 border-border flex items-center justify-center">
                                <Sun className="w-4 h-4 text-gray-700" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-4 border-t border-border/50 flex justify-end">
                      <Button
                        onClick={handleSave}
                        className={cn(
                          'gap-2 transition-all',
                          saved && 'bg-success hover:bg-success'
                        )}
                      >
                        {saved ? (
                          <>
                            <Check className="w-4 h-4" />
                            Saqlandi!
                          </>
                        ) : (
                          'Saqlash'
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Security section extra */}
                  {activeSection === 'privacy' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass rounded-xl p-6 mt-4"
                    >
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Xavfsizlik
                      </h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-3 text-sm">
                          <Lock className="w-4 h-4" />
                          Parolni o&apos;zgartirish
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 text-sm">
                          <Mail className="w-4 h-4" />
                          Emailni tasdiqlash
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 text-sm">
                          <Smartphone className="w-4 h-4" />
                          Ikki bosqichli tekshiruv
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
