'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Upload, Plus, BookOpen, Diamond, TrendingUp, Eye,
  Star, Clock, ChevronRight, ArrowUpRight,
  FileText, Image, Calendar, Megaphone, DollarSign,
  BarChart3, Settings, MessageSquare, Users, Home,
  Check, X, Lock, Unlock, Layers,
  AlertCircle, ChevronDown, Trash2, Edit2
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ParticlesBackground } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { apiGetTranslatorMangas, apiGetTranslatorEarnings } from '@/lib/api'
import type { Manga } from '@/lib/store'

type TabId = 'overview' | 'manga' | 'chapters' | 'earnings' | 'promote'

const recentChapters = [
  { id: 1, manga: 'Solo Leveling', chapter: 179, views: 12500, earnings: 25000, status: 'published', date: '2 soat oldin', isPaid: false },
  { id: 2, manga: 'Tower of God', chapter: 520, views: 8400, earnings: 18000, status: 'published', date: '5 soat oldin', isPaid: true },
  { id: 3, manga: 'Solo Leveling', chapter: 178, views: 18200, earnings: 32000, status: 'published', date: '1 kun oldin', isPaid: false },
  { id: 4, manga: 'The Beginning After The End', chapter: 156, views: 6800, earnings: 12000, status: 'scheduled', date: 'Ertaga 10:00', isPaid: true },
]

export default function TranslatorDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [showMangaModal, setShowMangaModal] = useState(false)
  const [showChapterModal, setShowChapterModal] = useState(false)
  const [uploadMode, setUploadMode] = useState<'pdf' | 'images'>('pdf')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [chapterForm, setChapterForm] = useState({
    manga: '', number: '', title: '', isPaid: false, price: '10', scheduleDate: '', freeAfterDays: '7'
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const pdfRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLInputElement>(null)

  const [myMangas, setMyMangas] = useState<Manga[]>([])
  const [apiStats, setApiStats] = useState<any>(null)

  useEffect(() => {
    apiGetTranslatorMangas().then(({ mangas, stats }) => {
      if (mangas.length > 0) setMyMangas(mangas)
      if (stats) setApiStats(stats)
    }).catch(() => {})
  }, [])

  const stats = {
    totalManga: apiStats?.manga_count ?? myMangas.length || 3,
    totalChapters: myMangas.reduce((s, m) => s + m.chapters, 0) || 245,
    totalViews: apiStats?.total_views ?? myMangas.reduce((s, m) => s + m.views, 0) || 1250000,
    todayViews: 15420, totalEarnings: 2500000, todayEarnings: 125000, diamonds: 8500, followers: 12500
  }
  const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : n.toString()
  const fmtMoney = (n: number) => `${(n/1000).toFixed(0)}K so'm`

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (uploadMode === 'pdf') {
      const pdf = files.find(f => f.type === 'application/pdf')
      if (pdf) setPdfFile(pdf)
    } else {
      const imgs = files.filter(f => f.type.startsWith('image/'))
      setImageFiles(prev => [...prev, ...imgs])
    }
  }

  const handleUpload = async () => {
    setUploading(true); setUploadProgress(0)
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80))
      setUploadProgress(i)
    }
    setUploading(false); setUploadDone(true)
    setTimeout(() => { setShowChapterModal(false); setUploadDone(false); setPdfFile(null); setImageFiles([]) }, 2000)
  }

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'overview', label: 'Umumiy', icon: Home },
    { id: 'manga', label: 'Mangalarim', icon: BookOpen },
    { id: 'chapters', label: 'Boblar', icon: FileText },
    { id: 'earnings', label: 'Daromad', icon: DollarSign },
    { id: 'promote', label: 'Reklama', icon: Megaphone },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />

      <main className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold">Tarjimon Paneli</h1>
              <p className="text-xs text-muted-foreground">Manga va daromadlaringizni boshqaring</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => setShowChapterModal(true)}>
                <Upload className="w-3.5 h-3.5" />Bob yuklash
              </Button>
              <Button className="text-sm bg-gradient-to-r from-primary to-accent gap-1.5" onClick={() => setShowMangaModal(true)}>
                <Plus className="w-4 h-4" />Yangi Manga
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Jami Manga', value: stats.totalManga, sub: `${stats.totalChapters} bob`, icon: BookOpen, color: 'primary' },
              { label: 'Ko\'rishlar', value: fmt(stats.totalViews), sub: `+${fmt(stats.todayViews)} bugun`, icon: Eye, color: 'success' },
              { label: 'Olmozlar', value: fmt(stats.diamonds), sub: `= ${fmtMoney(stats.diamonds * 100)}`, icon: Diamond, color: 'yellow' },
              { label: 'Obunachilar', value: fmt(stats.followers), sub: '+124 bu hafta', icon: Users, color: 'accent' },
            ].map((s, i) => (
              <motion.div key={s.label} className="glass rounded-xl p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('p-1.5 rounded-lg', s.color === 'yellow' ? 'bg-yellow-500/20' : `bg-${s.color}/20`)}>
                    <s.icon className={cn('w-4 h-4', s.color === 'yellow' ? 'text-yellow-400' : `text-${s.color}`)} />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className={cn('text-xl font-bold', s.color === 'yellow' && 'text-yellow-400')}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary')}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold">Mening Mangalarim</h2>
                      <Button variant="ghost" size="sm" className="text-xs text-primary h-7" onClick={() => setActiveTab('manga')}>
                        Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {myMangas.map((manga, i) => (
                        <motion.div key={manga.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                          <img src={manga.cover} alt={manga.title} className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium truncate">{manga.title}</h3>
                              <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0',
                                manga.status === 'active' ? 'bg-success/20 text-success' : 'bg-yellow-500/20 text-yellow-400')}>
                                {manga.status === 'active' ? 'Faol' : 'To\'xtatilgan'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                              <span>{manga.chapters} bob</span>
                              <span>{fmt(manga.views)} ko'rish</span>
                              <span className="text-yellow-400">{fmtMoney(manga.earnings)}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7 text-xs flex-shrink-0" onClick={() => setShowChapterModal(true)}>
                            <Plus className="w-3 h-3 mr-1" />Bob
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold">So'nggi Boblar</h2>
                      <Button variant="ghost" size="sm" className="text-xs text-primary h-7" onClick={() => setActiveTab('chapters')}>
                        Hammasi <ChevronRight className="w-3 h-3 ml-0.5" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {recentChapters.map((ch, i) => (
                        <motion.div key={ch.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">{ch.manga}</span>
                              <span className="text-[10px] text-muted-foreground">#{ch.chapter}</span>
                              <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] font-medium',
                                ch.status === 'published' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary')}>
                                {ch.status === 'published' ? 'Chop etildi' : 'Rejalashtirilgan'}
                              </span>
                              {ch.isPaid && <Diamond className="w-3 h-3 text-yellow-400" />}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                              <span>{fmt(ch.views)} ko'rish</span>
                              <span className="text-yellow-400">{fmtMoney(ch.earnings)}</span>
                              <span>{ch.date}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Settings className="w-3 h-3" /></Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-yellow-400" />
                      <h2 className="text-sm font-bold">Daromad</h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Bugun', val: fmtMoney(stats.todayEarnings), gradient: true },
                        { label: 'Bu oy', val: fmtMoney(stats.totalEarnings), gradient: false },
                        { label: 'Yechib olish mumkin', val: fmtMoney(1850000), gradient: false, action: true },
                      ].map(e => (
                        <div key={e.label} className={cn('p-3 rounded-lg', e.gradient ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30' : 'bg-secondary/30')}>
                          <p className="text-[10px] text-muted-foreground mb-1">{e.label}</p>
                          <div className="flex items-center justify-between">
                            <p className={cn('text-lg font-bold', e.gradient && 'text-yellow-400', e.action && 'text-success')}>{e.val}</p>
                            {e.action && <Button size="sm" className="h-7 text-xs bg-success hover:bg-success/90">Yechish</Button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4 border border-primary/30">
                    <div className="flex items-center gap-2 mb-2"><Megaphone className="w-4 h-4 text-primary" /><h2 className="text-sm font-bold">Reklama</h2></div>
                    <p className="text-xs text-muted-foreground mb-3">Mangangizni bosh sahifada ko'rsating!</p>
                    {[['1 kun', '100'], ['1 hafta', '500'], ['1 oy', '1,500']].map(([dur, price]) => (
                      <div key={dur} className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{dur}</span>
                        <div className="flex items-center gap-1"><Diamond className="w-3 h-3 text-yellow-400" /><span className="font-medium">{price}</span></div>
                      </div>
                    ))}
                    <Button className="w-full text-xs mt-2 bg-gradient-to-r from-primary to-accent" onClick={() => setActiveTab('promote')}>Reklama Qilish</Button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'manga' && (
              <motion.div key="mg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex justify-end mb-4">
                  <Button className="gap-2 bg-gradient-to-r from-primary to-accent" onClick={() => setShowMangaModal(true)}>
                    <Plus className="w-4 h-4" />Yangi Manga Qo'shish
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myMangas.map((manga, i) => (
                    <motion.div key={manga.id} className="glass rounded-xl overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <img src={manga.cover} alt={manga.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <h3 className="font-bold text-sm">{manga.title}</h3>
                        </div>
                        <span className={cn('absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium',
                          manga.status === 'active' ? 'bg-success/90 text-white' : 'bg-yellow-500/90 text-white')}>
                          {manga.status === 'active' ? 'Faol' : 'To\'xtatilgan'}
                        </span>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                          {[['Bob', manga.chapters], ['Ko\'rish', fmt(manga.views)], ['Daromad', fmtMoney(manga.earnings)]].map(([l, v]) => (
                            <div key={l as string}>
                              <p className="text-[10px] text-muted-foreground">{l}</p>
                              <p className="text-xs font-bold">{v}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs"><Edit2 className="w-3 h-3 mr-1" />Tahrirlash</Button>
                          <Button size="sm" className="flex-1 h-7 text-xs bg-gradient-to-r from-primary to-accent" onClick={() => setShowChapterModal(true)}>
                            <Plus className="w-3 h-3 mr-1" />Bob
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'chapters' && (
              <motion.div key="ch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex justify-end mb-4">
                  <Button className="gap-2 bg-gradient-to-r from-primary to-accent" onClick={() => setShowChapterModal(true)}>
                    <Upload className="w-4 h-4" />Bob Yuklash
                  </Button>
                </div>
                <div className="glass rounded-xl overflow-hidden">
                  {recentChapters.map((ch, i) => (
                    <div key={ch.id} className={cn('flex items-center gap-4 p-4', i !== 0 && 'border-t border-border/30')}>
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-sm flex-shrink-0">#{ch.chapter}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{ch.manga}</span>
                          <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] font-medium', ch.status === 'published' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary')}>
                            {ch.status === 'published' ? 'Chop etildi' : 'Rejalashtirilgan'}
                          </span>
                          {ch.isPaid ? <span className="flex items-center gap-0.5 text-[9px] text-yellow-400 font-medium"><Lock className="w-2.5 h-2.5" />To'liq</span>
                            : <span className="flex items-center gap-0.5 text-[9px] text-success font-medium"><Unlock className="w-2.5 h-2.5" />Bepul</span>}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                          <span>{fmt(ch.views)} ko'rish</span><span className="text-yellow-400">{fmtMoney(ch.earnings)}</span><span>{ch.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit2 className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'earnings' && (
              <motion.div key="earn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl space-y-4">
                {[
                  { label: 'Bugungi daromad', val: fmtMoney(stats.todayEarnings), color: 'text-yellow-400' },
                  { label: 'Oylik daromad', val: fmtMoney(stats.totalEarnings), color: 'text-foreground' },
                  { label: 'Jami daromad', val: fmtMoney(stats.totalEarnings * 12), color: 'text-success' },
                ].map(e => (
                  <div key={e.label} className="glass rounded-xl p-5 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{e.label}</p>
                    <p className={cn('text-2xl font-bold', e.color)}>{e.val}</p>
                  </div>
                ))}
                <div className="glass rounded-xl p-5">
                  <h3 className="text-sm font-bold mb-4">Yechib olish</h3>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 mb-4">
                    <span className="text-sm">Mavjud balans</span>
                    <span className="text-lg font-bold text-success">{fmtMoney(1850000)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">To'lov usullari: Payme, Click, Paynet, Uzum Bank</p>
                  <Button className="w-full bg-success hover:bg-success/90">Yechib olish</Button>
                </div>
              </motion.div>
            )}

            {activeTab === 'promote' && (
              <motion.div key="pr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl">
                <div className="glass rounded-xl p-6 space-y-4">
                  <h2 className="font-bold flex items-center gap-2"><Megaphone className="w-5 h-5 text-primary" />Reklama Boshqaruvi</h2>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Qaysi manga reklamasini qilasiz?</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                      {myMangas.map(m => <option key={m.id}>{m.title}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[['1 kun', '100', '~500 tashrif'], ['3 kun', '250', '~1,500 tashrif'], ['1 hafta', '500', '~4,000 tashrif'], ['1 oy', '1,500', '~18,000 tashrif']].map(([dur, price, est]) => (
                      <div key={dur} className="p-3 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:border-primary/50 transition-colors">
                        <p className="text-sm font-bold">{dur}</p>
                        <div className="flex items-center gap-1 mt-1"><Diamond className="w-3.5 h-3.5 text-yellow-400" /><span className="font-bold text-yellow-400">{price}</span></div>
                        <p className="text-[10px] text-muted-foreground mt-1">{est}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent">Reklama Boshlash</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* New Manga Modal */}
      <AnimatePresence>
        {showMangaModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowMangaModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-strong rounded-2xl p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">Yangi Manga Qo'shish</h2>
                <button onClick={() => setShowMangaModal(false)} className="p-1.5 rounded-lg hover:bg-secondary/50"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {[['Manga Nomi', 'text', 'Masalan: Solo Leveling'], ['Muallif', 'text', 'Asl muallif ismi'], ['Rassom', 'text', 'Rassom ismi']].map(([label, type, placeholder]) => (
                  <div key={label as string}>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
                    <input type={type as string} placeholder={placeholder as string} className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Muqova Rasmi</label>
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Rasm yuklash uchun bosing</p>
                    <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, WEBP (max 5MB)</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tavsif</label>
                  <textarea placeholder="Manga haqida qisqacha..." rows={3} className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Turi</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                      <option>Manhwa</option><option>Manga</option><option>Manhua</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Holat</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                      <option>Davom etmoqda</option><option>Tugallangan</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent">
                  <Plus className="w-4 h-4 mr-2" />Manga Qo'shish
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Upload Modal */}
      <AnimatePresence>
        {showChapterModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => { if (!uploading) setShowChapterModal(false) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg glass-strong rounded-2xl p-6 my-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2"><Upload className="w-5 h-5 text-primary" />Bob Yuklash</h2>
                {!uploading && <button onClick={() => setShowChapterModal(false)} className="p-1.5 rounded-lg hover:bg-secondary/50"><X className="w-5 h-5" /></button>}
              </div>

              {uploadDone ? (
                <motion.div className="text-center py-8" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <p className="font-bold text-lg">Muvaffaqiyatli yuklandi!</p>
                  <p className="text-sm text-muted-foreground mt-1">Bob tez orada chop etiladi</p>
                </motion.div>
              ) : uploading ? (
                <div className="py-8 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-secondary" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                        className="text-primary transition-all duration-200"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - uploadProgress / 100)}`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{uploadProgress}%</span>
                  </div>
                  <p className="text-sm font-medium">Yuklanmoqda...</p>
                  <p className="text-xs text-muted-foreground mt-1">{uploadMode === 'pdf' ? 'PDF qayta ishlanmoqda' : 'Rasmlar yuklanmoqda'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Chapter info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Manga tanlang</label>
                      <select value={chapterForm.manga} onChange={e => setChapterForm(p => ({...p, manga: e.target.value}))}
                        className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                        <option value="">— Tanlang —</option>
                        {myMangas.map(m => <option key={m.id} value={m.title}>{m.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Bob raqami</label>
                      <input type="number" placeholder="180" value={chapterForm.number} onChange={e => setChapterForm(p => ({...p, number: e.target.value}))}
                        className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Bob sarlavhasi (ixtiyoriy)</label>
                    <input type="text" placeholder="Masalan: Qaytish" value={chapterForm.title} onChange={e => setChapterForm(p => ({...p, title: e.target.value}))}
                      className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>

                  {/* Upload mode toggle */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Yuklash usuli</label>
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/50 border border-border/50">
                      <button onClick={() => { setUploadMode('pdf'); setPdfFile(null); setImageFiles([]) }}
                        className={cn('flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all',
                          uploadMode === 'pdf' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                        <FileText className="w-3.5 h-3.5" />PDF fayl
                      </button>
                      <button onClick={() => { setUploadMode('images'); setPdfFile(null); setImageFiles([]) }}
                        className={cn('flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all',
                          uploadMode === 'images' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                        <Layers className="w-3.5 h-3.5" />Alohida rasmlar
                      </button>
                    </div>
                  </div>

                  {/* Drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => uploadMode === 'pdf' ? pdfRef.current?.click() : imgRef.current?.click()}
                    className={cn(
                      'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
                      isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border/50 hover:border-primary/50 hover:bg-secondary/30'
                    )}>
                    <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={e => { if (e.target.files?.[0]) setPdfFile(e.target.files[0]) }} />
                    <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files) setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]) }} />

                    {uploadMode === 'pdf' ? (
                      pdfFile ? (
                        <div>
                          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-primary">{pdfFile.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{(pdfFile.size / 1024 / 1024).toFixed(1)} MB</p>
                          <p className="text-[10px] text-success mt-1">✓ PDF tayyor — sahifalar avtomatik bo'linadi</p>
                        </div>
                      ) : (
                        <div>
                          <FileText className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm font-medium">PDF faylni bu yerga tashlang</p>
                          <p className="text-[10px] text-muted-foreground mt-1">yoki bosib tanlang • max 100MB</p>
                          <div className="mt-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-[10px] text-primary">✨ PDF avtomatik ravishda sahifalarga bo'linadi va optimallashtiriladi</p>
                          </div>
                        </div>
                      )
                    ) : (
                      imageFiles.length > 0 ? (
                        <div>
                          <div className="flex gap-1 justify-center mb-2 flex-wrap">
                            {imageFiles.slice(0, 4).map((f, i) => (
                              <div key={i} className="w-10 h-14 rounded-lg bg-secondary flex items-center justify-center text-[10px] text-muted-foreground overflow-hidden">
                                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {imageFiles.length > 4 && <div className="w-10 h-14 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold">+{imageFiles.length-4}</div>}
                          </div>
                          <p className="text-sm font-medium text-primary">{imageFiles.length} ta rasm tanlandi</p>
                          <button className="text-[10px] text-destructive mt-1" onClick={e => { e.stopPropagation(); setImageFiles([]) }}>Hammasini o'chirish</button>
                        </div>
                      ) : (
                        <div>
                          <Layers className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm font-medium">Rasmlarni bu yerga tashlang</p>
                          <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, WEBP • Bir vaqtda ko'plab rasm</p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Paid/Free toggle */}
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">To'liq bob</p>
                        <p className="text-[10px] text-muted-foreground">O'quvchilar olmoz to'lab o'qiydi</p>
                      </div>
                      <button onClick={() => setChapterForm(p => ({...p, isPaid: !p.isPaid}))}
                        className={cn('relative w-11 h-6 rounded-full transition-colors', chapterForm.isPaid ? 'bg-primary' : 'bg-secondary border border-border')}>
                        <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', chapterForm.isPaid ? 'left-5.5 translate-x-0.5' : 'left-0.5')} />
                      </button>
                    </div>
                    {chapterForm.isPaid && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground mb-1 block">Narx (olmoz)</label>
                          <input type="number" value={chapterForm.price} onChange={e => setChapterForm(p => ({...p, price: e.target.value}))} min="1"
                            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground mb-1 block">Necha kundan keyin bepul bo'lsin? (0 = hech qachon)</label>
                          <input type="number" value={chapterForm.freeAfterDays} onChange={e => setChapterForm(p => ({...p, freeAfterDays: e.target.value}))} min="0"
                            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Schedule */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Nashr vaqti (bo'sh qoldirsa — hozir chop etiladi)</label>
                    <input type="datetime-local" value={chapterForm.scheduleDate} onChange={e => setChapterForm(p => ({...p, scheduleDate: e.target.value}))}
                      className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent"
                    disabled={(uploadMode === 'pdf' && !pdfFile) && (uploadMode === 'images' && imageFiles.length === 0)}
                    onClick={handleUpload}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {chapterForm.scheduleDate ? 'Rejalashtirish' : 'Hozir Chop Etish'}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
