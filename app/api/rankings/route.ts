import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { apiError, apiSuccess } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') ?? 'daily'
    const genre = searchParams.get('genre')
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))

    const allowedTypes = ['daily', 'weekly', 'monthly', 'alltime']
    const safeType = allowedTypes.includes(type) ? type : 'daily'

    let intervalDays = 1
    if (safeType === 'weekly') intervalDays = 7
    if (safeType === 'monthly') intervalDays = 30
    if (safeType === 'alltime') intervalDays = 36500

    const params: unknown[] = [limit, intervalDays]
    let genreCondition = ''

    if (genre) {
      params.push(genre)
      genreCondition = `AND EXISTS (SELECT 1 FROM manga_genres mg2 WHERE mg2.manga_id = m.id AND mg2.genre = $${params.length})`
    }

    const manga = await query(
      `SELECT m.id, m.title, m.cover, m.status, m.type, m.rating, m.views,
              m.bookmarks, m.chapters_count, m.is_premium,
              COALESCE(array_agg(DISTINCT mg.genre) FILTER (WHERE mg.genre IS NOT NULL), '{}') AS genres
       FROM manga m
       LEFT JOIN manga_genres mg ON mg.manga_id = m.id
       WHERE m.updated_at > NOW() - ($2 * INTERVAL '1 day') ${genreCondition}
       GROUP BY m.id
       ORDER BY m.views DESC
       LIMIT $1`,
      params
    )

    return apiSuccess({ rankings: manga, type: safeType, total: manga.length })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
