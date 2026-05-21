import type { User, Manga, Notification } from './store'

// Map DB snake_case user → store User type
function mapUser(raw: Record<string, unknown>): User {
  return {
    id: raw.id as string,
    username: raw.username as string,
    email: raw.email as string,
    avatar: (raw.avatar as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${raw.username}`,
    level: (raw.level as number) || 1,
    xp: (raw.xp as number) || 0,
    xpToNextLevel: (raw.xp_to_next_level as number) || 100,
    diamonds: (raw.diamonds as number) || 0,
    subscription: (raw.subscription as User['subscription']) || 'free',
    role: (raw.role as User['role']) || 'user',
    createdAt: (raw.created_at as string) || new Date().toISOString(),
    bio: (raw.bio as string) || '',
    followers: (raw.followers as number) || 0,
    following: (raw.following as number) || 0,
    readingStats: {
      chaptersRead: (raw.chapters_read as number) || 0,
      timeSpent: (raw.time_spent as number) || 0,
      mangaCompleted: (raw.manga_completed as number) || 0,
    },
    achievements: [],
    badges: [],
  }
}

// Map DB snake_case manga → store Manga type
function mapManga(raw: Record<string, unknown>): Manga {
  return {
    id: raw.id as string,
    title: raw.title as string,
    cover: (raw.cover as string) || '',
    description: (raw.description as string) || '',
    author: (raw.author as string) || '',
    artist: (raw.artist as string) || '',
    status: (raw.status as Manga['status']) || 'ongoing',
    type: (raw.type as Manga['type']) || 'manga',
    genres: (raw.genres as string[]) || [],
    tags: [],
    rating: parseFloat(String(raw.rating || 0)),
    views: parseInt(String(raw.views || 0)),
    bookmarks: parseInt(String(raw.bookmarks || 0)),
    chapters: parseInt(String(raw.chapters_count || 0)),
    latestChapter: parseInt(String(raw.chapters_count || 0)),
    updatedAt: (raw.updated_at as string) || new Date().toISOString(),
    translatorId: (raw.translator_id as string) || '',
    translatorName: (raw.translator_name as string) || '',
    isHot: Boolean(raw.is_featured) || parseInt(String(raw.views || 0)) > 5000000,
    isNew: false,
    isPremium: Boolean(raw.is_premium),
  }
}

function mapNotification(raw: Record<string, unknown>): Notification {
  return {
    id: raw.id as string,
    type: (raw.type as Notification['type']) || 'system',
    title: raw.title as string,
    message: (raw.message as string) || '',
    read: Boolean(raw.is_read),
    createdAt: (raw.created_at as string) || new Date().toISOString(),
  }
}

// ──────────────────────── AUTH ────────────────────────

export async function apiLogin(email: string, password: string): Promise<{ user: User }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login xatosi')
  return { user: mapUser(data.user) }
}

export async function apiRegister(
  username: string,
  email: string,
  password: string
): Promise<{ user: User }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Ro'yxatdan o'tish xatosi")
  return { user: mapUser(data.user) }
}

export async function apiLogout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' })
}

export async function apiGetMe(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me')
    if (!res.ok) return null
    const data = await res.json()
    return mapUser(data.user)
  } catch {
    return null
  }
}

// ──────────────────────── MANGA ────────────────────────

export interface MangaListParams {
  page?: number
  limit?: number
  type?: string
  status?: string
  genre?: string
  sort?: string
  q?: string
}

export async function apiGetMangas(params: MangaListParams = {}): Promise<{
  manga: Manga[]
  pagination: { page: number; limit: number; total: number; pages: number }
}> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.type) q.set('type', params.type)
  if (params.status) q.set('status', params.status)
  if (params.genre) q.set('genre', params.genre)
  if (params.sort) q.set('sort', params.sort)
  if (params.q) q.set('q', params.q)

  const res = await fetch(`/api/manga?${q}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Xato')
  return {
    manga: (data.manga as Record<string, unknown>[]).map(mapManga),
    pagination: data.pagination,
  }
}

export async function apiGetManga(id: string): Promise<{
  manga: Manga
  chapters: unknown[]
  isBookmarked: boolean
  userRating: number | null
}> {
  const res = await fetch(`/api/manga/${id}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Manga topilmadi')
  return {
    manga: mapManga(data.manga as Record<string, unknown>),
    chapters: data.chapters,
    isBookmarked: data.isBookmarked,
    userRating: data.userRating,
  }
}

export async function apiSearchManga(q: string, limit = 10): Promise<Manga[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=${limit}`)
  const data = await res.json()
  if (!res.ok) return []
  return (data.results as Record<string, unknown>[]).map(mapManga)
}

// ──────────────────────── BOOKMARKS ────────────────────────

export async function apiGetBookmarks(userId: string): Promise<Manga[]> {
  const res = await fetch(`/api/users/${userId}/bookmarks`)
  const data = await res.json()
  if (!res.ok) return []
  return (data.bookmarks as Record<string, unknown>[]).map(mapManga)
}

export async function apiToggleBookmark(
  userId: string,
  mangaId: string
): Promise<{ bookmarked: boolean }> {
  const res = await fetch(`/api/users/${userId}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ manga_id: mangaId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Xato')
  return { bookmarked: data.bookmarked }
}

// ──────────────────────── RANKINGS ────────────────────────

export async function apiGetRankings(type: 'daily' | 'weekly' | 'monthly' = 'daily', genre?: string): Promise<Manga[]> {
  const q = new URLSearchParams({ type })
  if (genre) q.set('genre', genre)
  const res = await fetch(`/api/rankings?${q}`)
  const data = await res.json()
  if (!res.ok) return []
  return (data.rankings as Record<string, unknown>[]).map(mapManga)
}

// ──────────────────────── NOTIFICATIONS ────────────────────────

export async function apiGetNotifications(): Promise<{ notifications: Notification[]; unread: number }> {
  const res = await fetch('/api/notifications')
  const data = await res.json()
  if (!res.ok) return { notifications: [], unread: 0 }
  return {
    notifications: (data.notifications as Record<string, unknown>[]).map(mapNotification),
    unread: data.unread,
  }
}

export async function apiMarkNotificationsRead(id?: string): Promise<void> {
  await fetch('/api/notifications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id ? { id } : { all: true }),
  })
}

// ──────────────────────── ADMIN ────────────────────────

export async function apiGetAdminStats() {
  const res = await fetch('/api/admin/stats')
  if (!res.ok) return null
  return res.json()
}

// ──────────────────────── TRANSLATOR ────────────────────────

export async function apiGetTranslatorMangas() {
  const res = await fetch('/api/translator/mangas')
  const data = await res.json()
  if (!res.ok) return { mangas: [], stats: null, pagination: null }
  return {
    mangas: (data.mangas as Record<string, unknown>[]).map(mapManga),
    stats: data.stats,
    pagination: data.pagination,
  }
}

export async function apiGetTranslatorEarnings() {
  const res = await fetch('/api/translator/earnings')
  const data = await res.json()
  if (!res.ok) return null
  return data
}
