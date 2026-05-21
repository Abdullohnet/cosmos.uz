'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Diamond, Crown, Upload, Users, BookOpen, 
  MessageCircle, Mail, Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    browse: [
      { label: 'Trendda', href: '/browse?sort=trending' },
      { label: 'Mashhur', href: '/browse?sort=popular' },
      { label: 'Yangiliklar', href: '/browse?sort=latest' },
      { label: 'Tugallangan', href: '/browse?status=completed' },
      { label: 'Janrlar', href: '/genres' },
    ],
    community: [
      { label: 'Forum', href: '/forum' },
      { label: 'Telegram', href: '#' },
      { label: 'Reyting', href: '/rankings' },
      { label: 'Tadbirlar', href: '/events' },
    ],
    support: [
      { label: 'Yordam', href: '/help' },
      { label: 'Aloqa', href: '/contact' },
      { label: 'Shikoyat', href: '/report' },
      { label: 'FAQ', href: '/faq' },
    ],
    legal: [
      { label: 'Foydalanish shartlari', href: '/terms' },
      { label: 'Maxfiylik siyosati', href: '/privacy' },
      { label: 'Qoidalar', href: '/guidelines' },
    ],
  }

  const socialLinks = [
    { icon: Send, href: '#', label: 'Telegram' },
    { icon: MessageCircle, href: '#', label: 'Discord' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="relative mt-12 border-t border-border/50">
      {/* Top CTA Section */}
      <div className="container mx-auto px-3 sm:px-4 -mt-12">
        <motion.div
          className="relative rounded-xl overflow-hidden glass-strong p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold mb-1">Manga Inqilobiga Qo&apos;shiling</h3>
              <p className="text-xs text-muted-foreground">
                Tarjimon bo&apos;ling va sevimli ishingizdan pul ishlang
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/apply/translator">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary text-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Tarjimon bo&apos;lish
                </Button>
              </Link>
              <Link href="/premium">
                <Button size="sm" variant="outline" className="border-primary/50 text-xs">
                  <Crown className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                  Premium
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-3 sm:px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <div>
                <span className="text-base font-bold text-foreground">Manga</span>
                <span className="text-base font-bold text-primary"> UZ</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-xs mb-3 max-w-xs">
              Manga va manhwa ixlosmandlari uchun eng zo&apos;r platforma. O&apos;qing, tarjima qiling va pul ishlang.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-1.5 text-primary mb-0.5">
                  <BookOpen className="w-3 h-3" />
                  <span className="text-[10px]">Manga</span>
                </div>
                <p className="text-sm font-bold">50K+</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-1.5 text-primary mb-0.5">
                  <Users className="w-3 h-3" />
                  <span className="text-[10px]">Foydalanuvchilar</span>
                </div>
                <p className="text-sm font-bold">1M+</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="p-1.5 rounded-lg bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-xs mb-3">Ko&apos;rish</h4>
            <ul className="space-y-1.5">
              {footerLinks.browse.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs mb-3">Jamiyat</h4>
            <ul className="space-y-1.5">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs mb-3">Yordam</h4>
            <ul className="space-y-1.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs mb-3">Huquqiy</h4>
            <ul className="space-y-1.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-muted-foreground">
            <p>&copy; {currentYear} Manga UZ. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Diamond className="w-3 h-3 text-yellow-400" />
                100 Olmoz = 10,000 so&apos;m
              </span>
              <span className="hidden sm:inline">|</span>
              <span>O&apos;zbekistonda ishlab chiqilgan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
