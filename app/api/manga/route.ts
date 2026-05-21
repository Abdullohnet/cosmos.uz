import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAuthUser, requireRole, apiError, apiSuccess } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))
    const offset = (page - 1) * limit
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const genre = searchParams.get('genre')
    const sort = searchParams.get('sort') ?? 'views'
    const q = searchParams.get('q')

    const allowed = ['views', 'rating', 'created_at', 'bookmarks']
    const sortCol = allowed.includes(sort) ? sort : 'views'

    const conditions: string[] = []
    const params: unknown[] = []
    let pi = 1

    if (type) { conditions.push(`m.type = $${pi++}`); params.push(type) }
    if (status) { conditions.push(`m.status = $${pi++}`); params.push(status) }
    if (q) { conditions.push(`m.title ILIKE $${pi++}`); params.push(`%${q}%`) }
    if (genre) {
      conditions.push(`EXISTS (SELECT 1 FROM manga_genres mg WHERE mg.manga_id = m.id AND mg.genre = $${pi++})`)
      params.push(genre)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const mangas = await query(
      `SELECT m.id, m.title, m.cover, m.status, m.type, m.rating, m.views,
              m.bookmarks, m.chapters_count, m.is_premium, m.is_featured,
              m.created_at, m.updated_at,
              COALESCE(array_agg(DISTINCT mg.genre) FILTER (WHERE mg.genre IS NOT NULL), '{}') AS genres
       FROM manga m
       LEFT JOIN manga_genres mg ON mg.manga_id = m.id
       ${where}
       GROUP BY m.id
       ORDER BY m.${sortCol} DESC
       LIMIT $${pi++} OFFSET $${pi++}`,
      [...params, limit, offset]
    )

    const [{ count }] = await query<{ count: string }>(
      `SELECT COUNT(DISTINCT m.id) as count FROM manga m ${where}`,
      params
    )

    return apiSuccess({
      manga: mangas,
      pagination: { page, limit, total: parseInt(count), pages: Math.ceil(parseInt(count) / limit) },
    })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole('translator')
    const auth = await getAuthUser()
    const { title, cover, description, author, artist, status, type, genres, is_premium } = await req.json()

    if (!title) return apiError('Sarlavha kiritilishi shart')

    const [manga] = await query<{ id: string }>(
      `INSERT INTO manga (title, cover, description, author, artist, status, type, is_premium, translator_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [title, cover ?? '', description ?? '', author ?? '', artist ?? '', status ?? 'ongoing', type ?? 'manga', is_premium ?? false, auth!.userId]
    )

    if (genres?.length) {
      for (const genre of genres) {
        await queryOne('INSERT INTO manga_genres (manga_id, genre) VALUES ($1,$2) ON CONFLICT DO NOTHING', [manga.id, genre])
      }
    }

    return apiSuccess({ id: manga.id, message: 'Manga yaratildi' }, 201)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
