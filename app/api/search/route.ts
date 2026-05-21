import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { apiError, apiSuccess } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const limit = Math.min(30, parseInt(searchParams.get('limit') ?? '10'))

    if (!q || q.length < 2) {
      return apiSuccess({ results: [] })
    }

    const results = await query(
      `SELECT m.id, m.title, m.cover, m.type, m.status, m.rating, m.chapters_count,
              COALESCE(array_agg(DISTINCT mg.genre) FILTER (WHERE mg.genre IS NOT NULL), '{}') AS genres
       FROM manga m
       LEFT JOIN manga_genres mg ON mg.manga_id = m.id
       WHERE m.title ILIKE $1 OR m.author ILIKE $1 OR m.description ILIKE $1
       GROUP BY m.id
       ORDER BY m.views DESC
       LIMIT $2`,
      [`%${q}%`, limit]
    )

    return apiSuccess({ results, query: q })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
