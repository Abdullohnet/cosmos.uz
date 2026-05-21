'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown, Check, Sparkles, Zap, Shield, Star, 
  Diamond, BookOpen, Eye, Bell, Palette, Gift,
  ChevronDown, X
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const plans = [
  {
    id: 'standard',
    name: 'Standard',
    price: 29000,
    period: 'oy',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
    icon: Shield,
    badge: null,
    features: [
      { text: 'Reklama yo\'q', included: true },
      { text: 'Tezroq yuklash', included: true },
      { text: 'XP +20% boost', included: true },
      { text: 'Maxsus profil ramkasi', included: true },
      { text: 'Erta boblar', included: false },
      { text: 'Premium kosmetikalar', included: false },
      { text: 'Animatsiyali profil effektlari', included: false },
      { text: 'Ustuvor qo\'llab-quvvatlash', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59000,
    period: 'oy',
    color: 'from-primary to-accent',
    borderColor: 'border-primary/50',
    glowColor: 'shadow-primary/30',
    icon: Star,
    badge: 'MASHHUR',
    features: [
      { text: 'Reklama yo\'q', included: true },
      { text: 'Tezroq yuklash', included: true },
      { text: 'XP +50% boost', included: true },
      { text: 'Maxsus profil ramkasi', included: true },
      { text: 'Erta boblar (1 hafta)', included: true },
      { text: 'Premium kosmetikalar', included: true },
      { text: 'Animatsiyali profil effektlari', included: false },
      { text: 'Ustuvor qo\'llab-quvvatlash', included: false },
    ],
  },
  {
    id: 'proplus',
    name: 'Pro+',
    price: 99000,
    period: 'oy',
    color: 'from-yellow-500 to-orange-500',
    borderColor: 'border-yellow-500/50',
    glowColor: 'shadow-yellow-500/30',
    icon: Crown,
    badge: 'PREMIUM',
    features: [
      { text: 'Reklama yo\'q', included: true },
      { text: 'Ultra tez yuklash', included: true },
      { text: 'XP +100% boost', included: true },
      { text: 'Eksklyuziv profil ramkasi', included: true },
      { text: 'Erta boblar (2 hafta)', included: true },
      { text: 'Barcha premium kosmetikalar', included: true },
      { text: 'Animatsiyali profil effektlari', included: true },
      { text: 'Ustuvor qo\'llab-quvvatlash', included: true },
    ],
  },
]

const faqs = [
  { q: 'Premium obunani qanday bekor qilish mumkin?', a: 'Sozlamalar > Obuna bo\'limidan istalgan vaqt bekor qilishingiz mumkin. Bekor qilishdan keyin joriy davr tugagungacha premium imkoniyatlardan foydalanishda davom etasiz.' },
  { q: 'Obunani yangilasam nima bo\'ladi?', a: 'Yuqoriroq reja tanlasangiz, farq qiymati qaytariladi va yangi reja darhol aktivlashadi.' },
  { q: 'Qanday to\'lov usullarini qabul qilasiz?', a: 'Payme, Click, Paynet va Uzum Bank orqali to\'lov qabul qilinadi.' },
  { q: 'Erta boblar nima?', a: 'Pro va Pro+ foydalanuvchilari yangi boblarni boshqa o\'quvchilardan 1-2 hafta oldin o\'qiy oladi.' },
]

export default function PremiumPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { user, isAuthenticated } = useUserStore()

  const getPrice = (price: number) => {
    if (billing === 'yearly') return Math.floor(price * 10)
    return price
  }

  const formatPrice = (price: number) => {
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return formatted + ' UZS'
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <FloatingOrbs />
      <Navbar />

      <main className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-6"
            >
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Premium Obunalar</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              O&apos;qish tajribangizni{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                yuksalting
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-xl mx-auto mb-8"
            >
              Reklamasiz, tez va eksklyuziv imkoniyatlar bilan manga o&apos;qishni yangi darajaga olib chiqing
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-secondary/50 border border-border/50"
            >
              <button
                onClick={() => setBilling('monthly')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  billing === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                )}
              >
                Oylik
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  billing === 'yearly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                )}
              >
                Yillik
                <span className="px-1.5 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold">
                  -17%
                </span>
              </button>
            </motion.div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {plans.map((plan, i) => {
              const Icon = plan.icon
              const isCurrentPlan = user?.subscription === plan.id
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'relative glass rounded-2xl p-6 border-2 flex flex-col',
                    plan.borderColor,
                    plan.id === 'pro' && 'scale-105',
                  )}
                  style={{ boxShadow: `0 0 40px var(--${plan.glowColor})` }}
                >
                  {plan.badge && (
                    <div className={cn(
                      'absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black',
                      `bg-gradient-to-r ${plan.color}`
                    )}>
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={cn(
                      'w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br',
                      plan.color
                    )}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-3xl font-bold">{formatPrice(getPrice(plan.price))}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {billing === 'yearly' ? 'yil' : 'oy'} uchun
                      {billing === 'yearly' && (
                        <span className="text-success ml-1">
                          ({formatPrice(plan.price)}/oy)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className={cn('flex items-center gap-3 text-sm', !f.included && 'opacity-40')}>
                        {f.included ? (
                          <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br', plan.color)}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                            <X className="w-3 h-3" />
                          </div>
                        )}
                        {f.text}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrentPlan ? (
                    <div className="w-full py-3 rounded-xl bg-secondary/50 text-center text-sm font-medium text-muted-foreground">
                      Joriy rejaningiz
                    </div>
                  ) : (
                    <Link href={isAuthenticated ? '#' : '/login'}>
                      <Button
                        className={cn(
                          'w-full font-semibold bg-gradient-to-r text-white',
                          plan.color,
                          plan.id === 'proplus' && 'text-black'
                        )}
                      >
                        {isAuthenticated ? 'Obuna bo\'lish' : 'Kirish'}
                      </Button>
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Benefits grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Premium imkoniyatlar</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Eye, title: 'Reklama yo\'q', desc: 'To\'liq immersiv o\'qish tajribasi', color: 'text-primary' },
                { icon: Zap, title: 'Erta boblar', desc: 'Hammadan 2 hafta oldin o\'qing', color: 'text-yellow-400' },
                { icon: Palette, title: 'Eksklyuziv kosmetikalar', desc: 'Maxsus ramkalar va badlar', color: 'text-pink-400' },
                { icon: Gift, title: 'Bonus olmozlar', desc: 'Har oyda bonus olmozlar', color: 'text-success' },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className="glass rounded-xl p-5 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={cn('w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary flex items-center justify-center', b.color)}>
                    <b.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Ko&apos;p so&apos;raladigan savollar</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  className="glass rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-medium text-sm">{faq.q}</span>
                    <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-4', openFaq === i && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
