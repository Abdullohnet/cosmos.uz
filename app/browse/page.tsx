'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown,
  BookOpen, Star, Eye, Flame, Sparkles, TrendingUp, Filter
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground } from '@/components/particles'
import { MangaCard } from '@/components/manga-card'
import { Button } from '@/components/ui/button'
import { mockMangas, genres } from '@/lib/store'
import { cn } from '@/lib/utils'

const types = ['Barchasi', 'Manga', 'Manhwa', 'Manhua']
const statuses = ['Barchasi', 'Davom etmoqda', 'Tugallangan', 'To\'xtatilgan']
const sortOptions = [
  { label: 'Mashhurlik', value: 'popular' },
  { label: 'Reyting', value: 'rating' },
  { label: 'Yangi', value: 'latest' },
  { label: 'Ko\'p o\'qilgan', value: 'views' },
  { label: 'A-Z', value: 'az' },
]

export default function BrowsePage() {
  const [search, setSearch] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState('Barchasi')
  const [selectedStatus, setSelectedStatus] = useState('Barchasi')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedType('Barchasi')
    setSelectedStatus('Barchasi')
    setSortBy('popular')
    setSearch('')
  }

  const filtered = useMemo(() => {
    let result = [...mockMangas]

    if (search) {
      result = result.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.author.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (selectedType !== 'Barchasi') {
      result = result.filter(m => m.type.toLowerCase() === selectedType.toLowerCase())
    }
    if (selectedStatus !== 'Barchasi') {
      const statusMap: Record<string, string> = {
        'Davom etmoqda': 'ongoing',
        'Tugallangan': 'completed',
        "To'xtatilgan": 'hiatus',
      }
      result = result.filter(m => m.status === statusMap[selectedStatus])
    }
    if (selectedGenres.length > 0) {
      result = result.filter(m => selectedGenres.some(g => m.genres.includes(g)))
    }

    switch (sortBy) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'views': result.sort((a, b) => b.views - a.views); break
      case 'latest': result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()); break
      case 'az': result.sort((a, b) => a.title.localeCompare(b.title)); break
      default: result.sort((a, b) => b.views - a.views)
    }

    return result
  }, [search, selectedGenres, selectedType, selectedStatus, sortBy])

  const activeFilterCount = selectedGenres.length +
    (selectedType !== 'Barchasi' ? 1 : 0) +
    (selectedStatus !== 'Barchasi' ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="p-2 rounded-xl bg-primary/20">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Manga Ko&apos;rish</h1>
            </motion.div>
            <p className="text-muted-foreground">50,000+ manga, manhwa va manhualarda qidiring</p>
          </div>

          {/* Search + Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Manga nomi yoki muallif bo'yicha qidiring..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={cn('gap-2', activeFilterCount > 0 && 'border-primary text-primary')}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtr
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-1.5 rounded-md transition-colors', viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('p-1.5 rounded-md transition-colors', viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="glass rounded-xl p-4 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Filter className="w-4 h-4 text-primary" />
                      Filtrlar
                    </h3>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-destructive hover:underline"
                      >
                        Hammasini tozalash
                      </button>
                    )}
                  </div>

                  {/* Sort */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Saralash</p>
                    <div className="flex flex-wrap gap-2">
                      {sortOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            sortBy === opt.value
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary/50 hover:bg-secondary'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Turi</p>
                    <div className="flex flex-wrap gap-2">
                      {types.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedType(t)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            selectedType === t
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary/50 hover:bg-secondary'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Holati</p>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedStatus(s)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            selectedStatus === s
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary/50 hover:bg-secondary'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Genres */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Janrlar</p>
                    <div className="flex flex-wrap gap-2">
                      {genres.map(g => (
                        <button
                          key={g}
                          onClick={() => toggleGenre(g)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            selectedGenres.includes(g)
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-secondary/50 hover:bg-secondary'
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{filtered.length}</span> ta natija topildi
            </p>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <Search className="w-14 h-14 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">Hech narsa topilmadi</h3>
                <p className="text-muted-foreground mb-4">Boshqa kalit so&apos;z yoki filtr sinab ko&apos;ring</p>
                <Button onClick={clearFilters}>Filtrlarni tozalash</Button>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3"
              >
                {filtered.map((manga, i) => (
                  <motion.div
                    key={manga.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <MangaCard manga={manga} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {filtered.map((manga, i) => (
                  <motion.div
                    key={manga.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <MangaCard manga={manga} variant="large" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}
