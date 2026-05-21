import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { apiError, apiSuccess } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') ?? 'daily'
    const genre = searchParams.get('genre')
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))

    let interval = '1 day'
    if (type === 'weekly') interval = '7 days'
    if (type === 'monthly') interval = '30 days'

    const genreFilter = genre
      ? `AND EXISTS (SELECT 1 FROM manga_genres mg WHERE mg.manga_id = m.id AND mg.genre = '${genre.replace(/'/g, "''")}')`
      : ''

    const manga = await query(
      `SELECT m.id, m.title, m.cover, m.status, m.type, m.rating, m.views,
              m.bookmarks, m.chapters_count, m.is_premium,
              COALESCE(array_agg(DISTINCT mg.genre) FILTER (WHERE mg.genre IS NOT NULL), '{}') AS genres
       FROM manga m
       LEFT JOIN manga_genres mg ON mg.manga_id = m.id
       WHERE m.updated_at > NOW() - INTERVAL '${interval}' ${genreFilter}
       GROUP BY m.id
       ORDER BY m.views DESC
       LIMIT $1`,
      [limit]
    )

    return apiSuccess({ rankings: manga, type, total: manga.length })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
