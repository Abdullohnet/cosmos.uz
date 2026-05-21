import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface User {
  id: string
  username: string
  email: string
  avatar: string
  level: number
  xp: number
  xpToNextLevel: number
  diamonds: number
  subscription: 'free' | 'standard' | 'pro' | 'proplus'
  role: 'user' | 'translator' | 'admin'
  createdAt: string
  bio?: string
  followers: number
  following: number
  readingStats: {
    chaptersRead: number
    timeSpent: number
    mangaCompleted: number
  }
  achievements: Achievement[]
  badges: Badge[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number
  maxProgress: number
}

export interface Badge {
  id: string
  name: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Manga {
  id: string
  title: string
  cover: string
  description: string
  author: string
  artist: string
  status: 'ongoing' | 'completed' | 'hiatus'
  type: 'manga' | 'manhwa' | 'manhua'
  genres: string[]
  tags: string[]
  rating: number
  views: number
  bookmarks: number
  chapters: number
  latestChapter: number
  updatedAt: string
  translatorId: string
  translatorName: string
  isHot?: boolean
  isNew?: boolean
  isPremium?: boolean
}

export interface Chapter {
  id: string
  mangaId: string
  number: number
  title: string
  pages: string[]
  isPremium: boolean
  price: number
  freeAfterDays?: number
  publishedAt: string
  views: number
}

export interface DiamondPack {
  id: string
  name: string
  diamonds: number
  bonusDiamonds: number
  price: number
  originalPrice?: number
  discount?: number
  isPopular?: boolean
  isLimited?: boolean
  expiresAt?: string
}

export interface Notification {
  id: string
  type: 'system' | 'chapter' | 'achievement' | 'reward' | 'social'
  title: string
  message: string
  read: boolean
  createdAt: string
}

// Store interfaces
interface UserStore {
  user: User | null
  isAuthenticated: boolean
  notifications: Notification[]
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addDiamonds: (amount: number) => void
  spendDiamonds: (amount: number) => boolean
  gainXP: (amount: number) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
}

interface MangaStore {
  mangas: Manga[]
  favorites: string[]
  readingHistory: { mangaId: string; chapterId: string; timestamp: string }[]
  readingProgress: Record<string, number>
  setMangas: (mangas: Manga[]) => void
  addToFavorites: (mangaId: string) => void
  removeFromFavorites: (mangaId: string) => void
  addToHistory: (mangaId: string, chapterId: string) => void
  updateProgress: (mangaId: string, chapter: number) => void
}

interface UIStore {
  theme: 'dark' | 'light'
  readerMode: 'vertical' | 'horizontal' | 'webtoon'
  readerTheme: 'default' | 'sepia' | 'night'
  brightness: number
  showParticles: boolean
  setTheme: (theme: 'dark' | 'light') => void
  setReaderMode: (mode: 'vertical' | 'horizontal' | 'webtoon') => void
  setReaderTheme: (theme: 'default' | 'sepia' | 'night') => void
  setBrightness: (brightness: number) => void
  toggleParticles: () => void
}

// Mock data
export const mockUser: User = {
  id: '1',
  username: 'MangaFan2024',
  email: 'fan@mangauz.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
  level: 24,
  xp: 2450,
  xpToNextLevel: 3000,
  diamonds: 1250,
  subscription: 'pro',
  role: 'user',
  createdAt: '2024-01-15',
  bio: 'Avid manga reader and collector. Love shounen and isekai!',
  followers: 156,
  following: 89,
  readingStats: {
    chaptersRead: 1847,
    timeSpent: 45600,
    mangaCompleted: 78
  },
  achievements: [
    { id: '1', name: 'First Steps', description: 'Read your first chapter', icon: '📖', progress: 1, maxProgress: 1, unlockedAt: '2024-01-15' },
    { id: '2', name: 'Bookworm', description: 'Read 100 chapters', icon: '📚', progress: 100, maxProgress: 100, unlockedAt: '2024-02-20' },
    { id: '3', name: 'Dedicated Reader', description: 'Read 1000 chapters', icon: '🏆', progress: 1847, maxProgress: 1000, unlockedAt: '2024-06-10' },
    { id: '4', name: 'Diamond Collector', description: 'Own 1000 diamonds', icon: '💎', progress: 1250, maxProgress: 1000, unlockedAt: '2024-03-05' },
  ],
  badges: [
    { id: '1', name: 'Early Adopter', icon: '⭐', rarity: 'rare' },
    { id: '2', name: 'Pro Member', icon: '👑', rarity: 'epic' },
    { id: '3', name: 'Top Reader', icon: '🔥', rarity: 'legendary' },
  ]
}

export const mockMangas: Manga[] = [
  {
    id: '1',
    title: 'Solo Leveling',
    cover: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=300&h=400&fit=crop',
    description: 'In a world where hunters must battle deadly monsters to protect humanity, Sung Jin-Woo is the weakest of all hunters.',
    author: 'Chugong',
    artist: 'Dubu',
    status: 'completed',
    type: 'manhwa',
    genres: ['Action', 'Fantasy', 'Adventure'],
    tags: ['OP MC', 'System', 'Dungeons'],
    rating: 4.9,
    views: 15000000,
    bookmarks: 890000,
    chapters: 179,
    latestChapter: 179,
    updatedAt: '2024-01-15',
    translatorId: 't1',
    translatorName: 'TeamSL',
    isHot: true,
  },
  {
    id: '2',
    title: 'Omniscient Reader',
    cover: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300&h=400&fit=crop',
    description: 'Kim Dokja was an average office worker whose sole interest was reading his favorite web novel.',
    author: 'Sing Shong',
    artist: 'Sleepy-C',
    status: 'ongoing',
    type: 'manhwa',
    genres: ['Action', 'Fantasy', 'Drama'],
    tags: ['Regression', 'Apocalypse', 'Smart MC'],
    rating: 4.8,
    views: 12000000,
    bookmarks: 750000,
    chapters: 165,
    latestChapter: 165,
    updatedAt: '2024-01-20',
    translatorId: 't2',
    translatorName: 'FlameScans',
    isHot: true,
    isNew: true,
  },
  {
    id: '3',
    title: 'Tower of God',
    cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&fit=crop',
    description: 'What do you desire? Fortune? Glory? Power? Revenge? Everything is at the top of the Tower.',
    author: 'SIU',
    artist: 'SIU',
    status: 'ongoing',
    type: 'manhwa',
    genres: ['Action', 'Adventure', 'Mystery'],
    tags: ['Tower', 'Powers', 'Betrayal'],
    rating: 4.7,
    views: 20000000,
    bookmarks: 1200000,
    chapters: 580,
    latestChapter: 580,
    updatedAt: '2024-01-18',
    translatorId: 't3',
    translatorName: 'Webtoon',
    isPremium: true,
  },
  {
    id: '4',
    title: 'The Beginning After The End',
    cover: 'https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?w=300&h=400&fit=crop',
    description: 'King Grey has unrivaled strength and prestige in a world governed by martial ability.',
    author: 'TurtleMe',
    artist: 'Fuyuki23',
    status: 'ongoing',
    type: 'manhwa',
    genres: ['Action', 'Fantasy', 'Romance'],
    tags: ['Reincarnation', 'Magic', 'OP MC'],
    rating: 4.9,
    views: 18000000,
    bookmarks: 950000,
    chapters: 190,
    latestChapter: 190,
    updatedAt: '2024-01-22',
    translatorId: 't4',
    translatorName: 'TapasMedia',
    isHot: true,
  },
  {
    id: '5',
    title: 'Demon Slayer',
    cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=400&fit=crop',
    description: 'Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
    author: 'Koyoharu Gotouge',
    artist: 'Koyoharu Gotouge',
    status: 'completed',
    type: 'manga',
    genres: ['Action', 'Supernatural', 'Drama'],
    tags: ['Demons', 'Swords', 'Family'],
    rating: 4.8,
    views: 25000000,
    bookmarks: 1500000,
    chapters: 205,
    latestChapter: 205,
    updatedAt: '2023-05-18',
    translatorId: 't5',
    translatorName: 'VizMedia',
  },
  {
    id: '6',
    title: 'Jujutsu Kaisen',
    cover: 'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=300&h=400&fit=crop',
    description: 'Yuji Itadori joins a secret organization of Jujutsu Sorcerers to eliminate a powerful Curse.',
    author: 'Gege Akutami',
    artist: 'Gege Akutami',
    status: 'ongoing',
    type: 'manga',
    genres: ['Action', 'Supernatural', 'School'],
    tags: ['Curses', 'Powers', 'Dark'],
    rating: 4.7,
    views: 22000000,
    bookmarks: 1300000,
    chapters: 250,
    latestChapter: 250,
    updatedAt: '2024-01-21',
    translatorId: 't6',
    translatorName: 'MangaPlus',
    isNew: true,
  },
  {
    id: '7',
    title: 'One Piece',
    cover: 'https://images.unsplash.com/photo-1624213111452-35e8d3d5cc18?w=300&h=400&fit=crop',
    description: 'Monkey D. Luffy explores the Grand Line in search of the legendary treasure One Piece.',
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    status: 'ongoing',
    type: 'manga',
    genres: ['Action', 'Adventure', 'Comedy'],
    tags: ['Pirates', 'Powers', 'Friendship'],
    rating: 4.9,
    views: 50000000,
    bookmarks: 3000000,
    chapters: 1100,
    latestChapter: 1100,
    updatedAt: '2024-01-19',
    translatorId: 't7',
    translatorName: 'ShuishaPlus',
    isHot: true,
  },
  {
    id: '8',
    title: 'Chainsaw Man',
    cover: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop',
    description: 'Denji is a young man trapped in poverty, working as a Devil Hunter with his chainsaw devil Pochita.',
    author: 'Tatsuki Fujimoto',
    artist: 'Tatsuki Fujimoto',
    status: 'ongoing',
    type: 'manga',
    genres: ['Action', 'Horror', 'Dark Fantasy'],
    tags: ['Devils', 'Gore', 'Unique Art'],
    rating: 4.6,
    views: 18000000,
    bookmarks: 1100000,
    chapters: 155,
    latestChapter: 155,
    updatedAt: '2024-01-17',
    translatorId: 't8',
    translatorName: 'MangaPlus',
    isNew: true,
  },
]

export const diamondPacks: DiamondPack[] = [
  { id: '1', name: 'Small Pack', diamonds: 100, bonusDiamonds: 0, price: 10000, isPopular: false },
  { id: '2', name: 'Starter Pack', diamonds: 300, bonusDiamonds: 30, price: 25000, originalPrice: 30000, discount: 17, isPopular: true },
  { id: '3', name: 'Mega Pack', diamonds: 600, bonusDiamonds: 100, price: 45000, originalPrice: 55000, discount: 18 },
  { id: '4', name: 'Ultra Pack', diamonds: 1200, bonusDiamonds: 300, price: 80000, originalPrice: 100000, discount: 20, isPopular: true },
  { id: '5', name: 'Legendary Pack', diamonds: 3000, bonusDiamonds: 1000, price: 180000, originalPrice: 250000, discount: 28, isLimited: true, expiresAt: '2024-02-01' },
]

export const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 
  'Supernatural', 'Thriller', 'Isekai', 'School', 'Martial Arts'
]

// User Store
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      notifications: [
        { id: '1', type: 'system', title: 'Welcome to Manga UZ!', message: 'Start your reading journey today', read: false, createdAt: new Date().toISOString() },
        { id: '2', type: 'reward', title: 'Daily Login Reward', message: 'You received 10 diamonds!', read: false, createdAt: new Date().toISOString() },
        { id: '3', type: 'chapter', title: 'New Chapter Available', message: 'Solo Leveling Chapter 179 is now available!', read: false, createdAt: new Date().toISOString() },
      ],
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updates } : null 
      })),
      addDiamonds: (amount) => set((state) => ({
        user: state.user ? { ...state.user, diamonds: state.user.diamonds + amount } : null
      })),
      spendDiamonds: (amount) => {
        const { user } = get()
        if (!user || user.diamonds < amount) return false
        set({ user: { ...user, diamonds: user.diamonds - amount } })
        return true
      },
      gainXP: (amount) => set((state) => {
        if (!state.user) return state
        let newXP = state.user.xp + amount
        let newLevel = state.user.level
        let newXPToNext = state.user.xpToNextLevel
        
        while (newXP >= newXPToNext) {
          newXP -= newXPToNext
          newLevel += 1
          newXPToNext = Math.floor(newXPToNext * 1.2)
        }
        
        return {
          user: {
            ...state.user,
            xp: newXP,
            level: newLevel,
            xpToNextLevel: newXPToNext
          }
        }
      }),
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substring(7),
            read: false,
            createdAt: new Date().toISOString()
          },
          ...state.notifications
        ]
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      })),
    }),
    {
      name: 'manga-uz-user',
    }
  )
)

// Manga Store
export const useMangaStore = create<MangaStore>()(
  persist(
    (set) => ({
      mangas: mockMangas,
      favorites: [],
      readingHistory: [],
      readingProgress: {},
      setMangas: (mangas) => set({ mangas }),
      addToFavorites: (mangaId) => set((state) => ({
        favorites: [...state.favorites, mangaId]
      })),
      removeFromFavorites: (mangaId) => set((state) => ({
        favorites: state.favorites.filter((id) => id !== mangaId)
      })),
      addToHistory: (mangaId, chapterId) => set((state) => ({
        readingHistory: [
          { mangaId, chapterId, timestamp: new Date().toISOString() },
          ...state.readingHistory.filter((h) => h.mangaId !== mangaId).slice(0, 49)
        ]
      })),
      updateProgress: (mangaId, chapter) => set((state) => ({
        readingProgress: { ...state.readingProgress, [mangaId]: chapter }
      })),
    }),
    {
      name: 'manga-uz-manga',
    }
  )
)

// UI Store
export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      readerMode: 'webtoon',
      readerTheme: 'default',
      brightness: 100,
      showParticles: true,
      setTheme: (theme) => set({ theme }),
      setReaderMode: (mode) => set({ readerMode: mode }),
      setReaderTheme: (theme) => set({ readerTheme: theme }),
      setBrightness: (brightness) => set({ brightness }),
      toggleParticles: () => set((state) => ({ showParticles: !state.showParticles })),
    }),
    {
      name: 'manga-uz-ui',
    }
  )
)
