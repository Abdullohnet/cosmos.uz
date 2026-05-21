'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, Flame, BookOpen, Star, Users, Award,
  Crown, Diamond, ChevronRight, Sparkles, Zap
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { HeroSlider } from '@/components/hero-slider'
import { MangaCard, MangaCarousel } from '@/components/manga-card'
import { mockMangas, genres } from '@/lib/store'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  // Sort mangas for different sections
  const trendingMangas = [...mockMangas].sort((a, b) => b.views - a.views)
  const topRatedMangas = [...mockMangas].sort((a, b) => b.rating - a.rating)
  const latestMangas = [...mockMangas].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  const hotMangas = mockMangas.filter(m => m.isHot)

  // Mock translators
  const topTranslators = [
    { id: 't1', name: 'TeamSL', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', manga: 45, followers: 25000 },
    { id: 't2', name: 'FlameScans', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', manga: 38, followers: 18000 },
    { id: 't3', name: 'Webtoon UZ', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', manga: 120, followers: 150000 },
    { id: 't4', name: 'MangaUZ', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', manga: 85, followers: 95000 },
    { id: 't5', name: 'VizMedia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', manga: 200, followers: 500000 },
  ]

  // Mock top users
  const topUsers = [
    { id: 'u1', name: 'MangaKing', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', level: 99, xp: 999999 },
    { id: 'u2', name: 'OtakuMaster', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', level: 87, xp: 850000 },
    { id: 'u3', name: 'WeebLord', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', level: 76, xp: 720000 },
    { id: 'u4', name: 'MangaFan2024', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', level: 65, xp: 580000 },
    { id: 'u5', name: 'ReadingNinja', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop', level: 58, xp: 450000 },
  ]

  // Janrlar O'zbek tilida
  const genresUz = ['Jangovar', 'Fantastika', 'Romantika', 'Komediya', 'Drama', 'Sehrli', 'Dahshat', 'Sport', 'Tarixiy', 'Mecha']

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <ParticlesBackground />
      <FloatingOrbs />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <HeroSlider mangas={mockMangas} />
      
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-3 sm:px-4 pb-8">
        {/* Kunlik Top */}
        <section className="py-4 sm:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </motion.div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">Kunlik Top</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Bugungi eng mashhurlar</p>
              </div>
            </div>
            <Link href="/rankings">
              <Button variant="ghost" size="sm" className="text-primary text-xs h-7">
                Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {trendingMangas.slice(0, 6).map((manga, index) => (
              <motion.div
                key={manga.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MangaCard manga={manga} rank={index + 1} showRank />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bugun Eng Ko'p O'qilgan */}
        <section className="py-4 sm:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">Bugun Eng Ko&apos;p O&apos;qilgan</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Jamiyatda trendda</p>
              </div>
            </div>
            <Link href="/browse?sort=views">
              <Button variant="ghost" size="sm" className="text-primary text-xs h-7">
                Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
          
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 no-scrollbar">
            {hotMangas.map((manga, index) => (
              <motion.div
                key={manga.id}
                className="flex-shrink-0 w-40 sm:w-52"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MangaCard manga={manga} variant="featured" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Janr bo'yicha eng yaxshilari */}
        <section className="py-4 sm:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <motion.div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-neon/20 to-primary/20">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-neon" />
              </motion.div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">Janr Bo&apos;yicha</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Sevimli kategoriyalaringizni kashf qiling</p>
              </div>
            </div>
            <Link href="/genres">
              <Button variant="ghost" size="sm" className="text-primary text-xs h-7">
                Barcha janrlar <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-4">
            {genresUz.map((genre, index) => (
              <motion.button
                key={genre}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-[10px] sm:text-xs font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {genre}
              </motion.button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-3">
            {mockMangas.slice(0, 4).map((manga, index) => (
              <motion.div
                key={manga.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MangaCard manga={manga} variant="large" rank={index + 1} showRank />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Premium CTA Banner */}
        <section className="py-4 sm:py-6">
          <motion.div
            className="relative rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-gradient" />
            <div className="relative glass-strong p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                    <h2 className="text-base sm:text-lg md:text-xl font-bold">Premium&apos;ga O&apos;ting</h2>
                  </div>
                  <p className="text-muted-foreground text-[10px] sm:text-xs max-w-md">
                    Reklamasiz o&apos;qish, erta boblar, eksklyuziv kosmetikalar va tarjimonlarni qo&apos;llab-quvvatlang
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/premium">
                    <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold text-xs">
                      <Zap className="w-3.5 h-3.5 mr-1.5" />
                      Yangilash
                    </Button>
                  </Link>
                  <div className="text-center">
                    <p className="text-lg sm:text-xl font-bold text-yellow-400">50%</p>
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground">CHEGIRMA</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Eng yuqori baholangan */}
        <MangaCarousel
          title="Eng Yuqori Baholangan"
          subtitle="Eng yaxshi reytingga ega"
          icon={<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
          mangas={topRatedMangas}
          seeAllLink="/browse?sort=rating"
        />

        {/* Uch ustunli layout */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 py-4 sm:py-6">
          {/* Top Tarjimonlar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-success/20 to-neon/20">
                  <Award className="w-4 h-4 text-success" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold">Top Tarjimonlar</h3>
              </div>
              
              <div className="space-y-2">
                {topTranslators.map((translator, index) => (
                  <motion.div
                    key={translator.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <img
                      src={translator.avatar}
                      alt={translator.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[10px] sm:text-xs truncate">{translator.name}</p>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground">{translator.manga} manga</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-muted-foreground">{(translator.followers / 1000).toFixed(0)}K</p>
                      <p className="text-[7px] text-muted-foreground">obunachilar</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Link href="/translators">
                <Button variant="ghost" size="sm" className="w-full mt-3 text-primary text-[10px] h-7">
                  Barcha Tarjimonlar
                </Button>
              </Link>
            </div>
          </div>

          {/* Top Foydalanuvchilar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold">Top O&apos;quvchilar</h3>
              </div>
              
              <div className="space-y-2">
                {topUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/50"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background flex items-center justify-center">
                        <span className="text-[7px] font-bold text-primary">{user.level}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[10px] sm:text-xs truncate">{user.name}</p>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground">Daraja {user.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-primary font-medium">{(user.xp / 1000).toFixed(0)}K</p>
                      <p className="text-[7px] text-muted-foreground">XP</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Link href="/leaderboard">
                <Button variant="ghost" size="sm" className="w-full mt-3 text-primary text-[10px] h-7">
                  Reyting Jadvali
                </Button>
              </Link>
            </div>
          </div>

          {/* Olmoz Do'koni */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-3 sm:p-4 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-diamond/20 to-yellow-500/20">
                  <Diamond className="w-4 h-4 text-yellow-400" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold">Olmoz Do&apos;koni</h3>
              </div>
              
              <div className="space-y-3">
                <motion.div
                  className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-medium">Boshlang&apos;ich Paket</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[8px]">-17%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-400" />
                      <span className="font-bold text-xs">330</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">25,000 so&apos;m</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 right-0 px-1.5 py-0.5 rounded-bl-lg bg-primary text-primary-foreground text-[7px] font-medium">
                    MASHHUR
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-medium">Ultra Paket</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[8px]">-20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-400" />
                      <span className="font-bold text-xs">1,500</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">80,000 so&apos;m</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <div className="absolute top-0 right-0 px-1.5 py-0.5 rounded-bl-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[7px] font-medium">
                    CHEKLANGAN
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-medium">Afsonaviy Paket</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[8px]">-28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-400" />
                      <span className="font-bold text-xs">4,000</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">180,000 so&apos;m</span>
                  </div>
                </motion.div>
              </div>
              
              <Link href="/shop">
                <Button size="sm" className="w-full mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold text-[10px] h-7">
                  <Diamond className="w-3 h-3 mr-1.5" />
                  Do&apos;konga O&apos;tish
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Yaqinda Yangilangan */}
        <MangaCarousel
          title="Yaqinda Yangilangan"
          subtitle="Eng so'nggi boblar"
          icon={<BookOpen className="w-4 h-4 text-primary" />}
          mangas={latestMangas}
          seeAllLink="/browse?sort=latest"
        />

        {/* Sizga Tavsiya */}
        <MangaCarousel
          title="Sizga Tavsiya"
          subtitle="Sizning didingizga mos"
          icon={<Sparkles className="w-4 h-4 text-accent" />}
          mangas={[...mockMangas].slice().reverse()}
          seeAllLink="/browse"
        />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
