'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MessageCircle, BookOpen, Globe,
  Star, FileText, ChevronRight, ChevronLeft, Check,
  Upload, Sparkles, Send, ArrowLeft
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { TranslatorApplication } from '@/lib/store'

const allLanguages = ['Ingliz', 'Koreys', 'Yapon', 'Xitoy', 'Rus', 'Turk', 'Arab', 'Frantsuz', 'Nemis', 'Ispan']
const allGenres = ['Action', 'Fantasy', 'Romance', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Isekai', 'Thriller']
const experienceOptions = ['Yangi boshlovchi (0-6 oy)', '1 yildan kam', '1-2 yil', '2-3 yil', '3+ yil', '5+ yil (professional)']

const steps = [
  { id: 1, title: 'Shaxsiy ma\'lumot', icon: User, desc: 'Ism, email va aloqa' },
  { id: 2, title: 'Tajriba', icon: BookOpen, desc: 'Til va portfolio' },
  { id: 3, title: 'Motivatsiya', icon: Sparkles, desc: 'Nima uchun tarjimon?' },
]

type FormData = {
  fullName: string; email: string; phone: string; telegram: string
  languages: string[]; experience: string; portfolioLinks: string; previousManga: string
  genres: string[]; motivation: string; sampleText: string
}

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '', telegram: '',
    languages: [], experience: '', portfolioLinks: '', previousManga: '',
    genres: [], motivation: '', sampleText: ''
  })

  const update = (key: keyof FormData, value: string | string[]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggleArr = (key: 'languages' | 'genres', val: string) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(x => x !== val) : [...prev[key], val]
    }))
  }

  const canNext = () => {
    if (step === 1) return form.fullName && form.email && form.phone && form.telegram
    if (step === 2) return form.languages.length > 0 && form.experience && form.previousManga
    if (step === 3) return form.motivation.length >= 50 && form.genres.length > 0
    return false
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ParticlesBackground />
        <FloatingOrbs />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative z-10 text-center max-w-md mx-auto px-6"
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Check className="w-12 h-12 text-success" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3">Ariza Yuborildi! 🎉</h1>
          <p className="text-muted-foreground mb-2">
            Hurmatli <span className="text-foreground font-medium">{form.fullName}</span>, arizangiz muvaffaqiyatli qabul qilindi.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Admin jamoamiz 1-3 ish kuni ichida arizangizni ko'rib chiqadi va <span className="text-primary">{form.email}</span> manzilingizga javob yuboradi.
          </p>
          <div className="glass rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-xs text-muted-foreground">Keyingi qadamlar:</p>
            {['Arizangiz ko\'rib chiqiladi', 'Email orqali xabardor qilinasiz', 'Tasdiqlansa tarjimon paneliga kirish beriladi'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                {t}
              </div>
            ))}
          </div>
          <Link href="/"><Button className="bg-gradient-to-r from-primary to-accent">Bosh sahifaga qaytish</Button></Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <FloatingOrbs />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Ortga qaytish
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Tarjimon bo'lish</span>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Tarjimon Arizasi</h1>
            <p className="text-muted-foreground">Manga UZ jamoasiga qo'shiling va o'z hikoyangizni o'zbek tiliga yetkazing</p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <motion.div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium',
                    step === s.id ? 'bg-primary text-primary-foreground shadow-lg' :
                    step > s.id ? 'bg-success/20 text-success' : 'bg-secondary/50 text-muted-foreground'
                  )}
                  animate={{ scale: step === s.id ? 1.05 : 1 }}
                >
                  {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.id}</span>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className={cn('h-0.5 w-6 sm:w-12 transition-colors', step > s.id ? 'bg-success' : 'bg-border')} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="glass rounded-2xl p-6 sm:p-8">
            <AnimatePresence mode="wait">

              {/* Step 1 */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold mb-1">Shaxsiy ma'lumot</h2>
                    <p className="text-sm text-muted-foreground">Kim ekanligingizni bizga ayting</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { key: 'fullName', label: 'To\'liq ism', placeholder: 'Abdullayev Sardor', icon: User },
                      { key: 'email', label: 'Email manzil', placeholder: 'sardor@example.com', icon: Mail },
                      { key: 'phone', label: 'Telefon raqam', placeholder: '+998 90 123 45 67', icon: Phone },
                      { key: 'telegram', label: 'Telegram username', placeholder: '@sardor_uz', icon: MessageCircle },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label} *</label>
                        <div className="relative">
                          <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder={f.placeholder}
                            value={form[f.key as keyof FormData] as string}
                            onChange={e => update(f.key as keyof FormData, e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground">
                      💡 Telegram username'ingiz kerak — tasdiqlash xabarini Telegram orqali yuboramiz.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold mb-1">Tajriba va Portfolio</h2>
                    <p className="text-sm text-muted-foreground">Qaysi tillardan tarjima qilasiz va tajribangiz qanday?</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Bilgan tillaringiz * (bir nechta tanlang)</label>
                    <div className="flex flex-wrap gap-2">
                      {allLanguages.map(lang => (
                        <button
                          key={lang}
                          onClick={() => toggleArr('languages', lang)}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                            form.languages.includes(lang)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-secondary/50 border-border/50 hover:border-primary/50'
                          )}
                        >
                          <Globe className="w-3 h-3" />
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Tajriba darajasi *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {experienceOptions.map(exp => (
                        <button
                          key={exp}
                          onClick={() => update('experience', exp)}
                          className={cn(
                            'px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all',
                            form.experience === exp
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-secondary/30 border-border/50 hover:border-primary/50'
                          )}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ilgari tarjima qilgan manga/manhwalar *</label>
                    <textarea
                      placeholder="Masalan: Solo Leveling 1-50 bob, Tower of God..."
                      value={form.previousManga}
                      onChange={e => update('previousManga', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Agar yangi boshlovchi bo'lsangiz — "Hali tarjima qilmaganman" deb yozing</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Portfolio yoki ijtimoiy tarmoq havolalari</label>
                    <input
                      type="text"
                      placeholder="https://t.me/... yoki https://..."
                      value={form.portfolioLinks}
                      onChange={e => update('portfolioLinks', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold mb-1">Motivatsiya va Janrlar</h2>
                    <p className="text-sm text-muted-foreground">Nima uchun tarjimon bo'lmoqchisiz?</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Siz tarjima qilmoqchi bo'lgan janrlar *</label>
                    <div className="flex flex-wrap gap-2">
                      {allGenres.map(g => (
                        <button
                          key={g}
                          onClick={() => toggleArr('genres', g)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                            form.genres.includes(g)
                              ? 'bg-accent/20 border-accent text-accent-foreground'
                              : 'bg-secondary/50 border-border/50 hover:border-accent/50'
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      Motivatsiya xati * <span className="text-[10px]">({form.motivation.length}/50 minimal)</span>
                    </label>
                    <textarea
                      placeholder="Nima uchun tarjimon bo'lmoqchisiz? Manga UZga qanday hissa qo'sha olasiz? O'zbek o'quvchilar uchun nima qilmoqchisiz?..."
                      value={form.motivation}
                      onChange={e => update('motivation', e.target.value)}
                      rows={5}
                      className={cn(
                        'w-full px-3 py-2.5 rounded-xl bg-secondary/50 border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-colors',
                        form.motivation.length > 0 && form.motivation.length < 50 ? 'border-destructive/50' : 'border-border/50'
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      Namuna tarjima <span className="text-[10px] text-muted-foreground">(ixtiyoriy, lekin tavsiya etiladi)</span>
                    </label>
                    <textarea
                      placeholder="Istalgan manga yoki manhwadan qisqa namuna tarjima qiling..."
                      value={form.sampleText}
                      onChange={e => update('sampleText', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Ariza xulosasi:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground">Ism:</span><span className="font-medium truncate">{form.fullName}</span>
                      <span className="text-muted-foreground">Tajriba:</span><span className="font-medium">{form.experience || '—'}</span>
                      <span className="text-muted-foreground">Tillar:</span><span className="font-medium">{form.languages.join(', ') || '—'}</span>
                      <span className="text-muted-foreground">Janrlar:</span><span className="font-medium">{form.genres.slice(0,3).join(', ')}{form.genres.length > 3 ? '...' : ''}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <Button
                variant="outline"
                onClick={() => setStep(s => s - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Orqaga
              </Button>

              <div className="flex items-center gap-1">
                {steps.map(s => (
                  <div key={s.id} className={cn('w-2 h-2 rounded-full transition-colors', step === s.id ? 'bg-primary' : step > s.id ? 'bg-success' : 'bg-border')} />
                ))}
              </div>

              {step < 3 ? (
                <Button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canNext()}
                  className="gap-2 bg-gradient-to-r from-primary to-accent"
                >
                  Keyingi <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canNext() || loading}
                  className="gap-2 bg-gradient-to-r from-primary to-accent min-w-[130px]"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <><Send className="w-4 h-4" /> Yuborish</>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
