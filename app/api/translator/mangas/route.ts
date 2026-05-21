import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireRole, apiError, apiSuccess } from '@/lib/auth'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await requireRole('translator')
    const auth = await getAuthUser()
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))
    const offset = (page - 1) * limit

    const mangas = await query(
      `SELECT m.id, m.title, m.cover, m.status, m.type, m.rating, m.views,
              m.bookmarks, m.chapters_count, m.is_premium, m.created_at,
              COALESCE(array_agg(DISTINCT mg.genre) FILTER (WHERE mg.genre IS NOT NULL), '{}') AS genres
       FROM manga m
       LEFT JOIN manga_genres mg ON mg.manga_id = m.id
       WHERE m.translator_id = $1
       GROUP BY m.id
       ORDER BY m.updated_at DESC
       LIMIT $2 OFFSET $3`,
      [auth!.userId, limit, offset]
    )

    const [{ count }] = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM manga WHERE translator_id=$1',
      [auth!.userId]
    )

    const stats = await queryOne(
      `SELECT
         COALESCE(SUM(m.views),0) as total_views,
         COALESCE(SUM(m.bookmarks),0) as total_bookmarks,
         COUNT(m.id) as manga_count
       FROM manga m WHERE m.translator_id=$1`,
      [auth!.userId]
    )

    return apiSuccess({ mangas, stats, pagination: { page, limit, total: parseInt(count) } })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
