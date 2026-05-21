import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { BackToTop } from '@/components/back-to-top'
import { ToastContainer } from '@/components/toast'
import { ContinueReadingWidget } from '@/components/continue-reading-widget'
import { DailyRewardPopup } from '@/components/daily-reward-popup'
import { AnnouncementBanner } from '@/components/announcement-banner'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Manga UZ - Premium Manga & Manhwa Platformasi',
  description: "Manga va manhwa ixlosmandlari uchun eng zo'r platforma. O'qing, tarjima qiling va pul ishlang. 50,000+ sarlavha.",
  keywords: ['manga', 'manhwa', 'manhua', 'webtoon', 'comics', 'manga o\'qish', 'uzbekiston', 'anime', 'manga uz'],
  authors: [{ name: 'Manga UZ Team' }],
  openGraph: {
    title: 'Manga UZ - Premium Manga & Manhwa Platformasi',
    description: "Manga va manhwa ixlosmandlari uchun eng zo'r platforma.",
    type: 'website',
    locale: 'uz_UZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manga UZ - Premium Manga & Manhwa Platformasi',
    description: "Manga va manhwa ixlosmandlari uchun eng zo'r platforma.",
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d0b14' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0b14' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen pb-16 lg:pb-0">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="manga-uz-theme">
          <AnnouncementBanner />
          {children}
          <MobileBottomNav />
          <BackToTop />
          <ToastContainer />
          <ContinueReadingWidget />
          <DailyRewardPopup />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
