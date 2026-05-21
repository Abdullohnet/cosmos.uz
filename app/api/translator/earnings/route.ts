import { query, queryOne } from '@/lib/db'
import { requireRole, getAuthUser, apiError, apiSuccess } from '@/lib/auth'

export async function GET() {
  try {
    await requireRole('translator')
    const auth = await getAuthUser()

    const earnings = await queryOne(
      `SELECT
         COALESCE(SUM(m.views) * 0.001, 0) as total_earned,
         COALESCE(SUM(m.views) * 0.001 * 0.3, 0) as this_month,
         COUNT(DISTINCT m.id) as manga_count,
         COALESCE(SUM(m.bookmarks), 0) as total_subscribers
       FROM manga m WHERE m.translator_id=$1`,
      [auth!.userId]
    )

    const topMangas = await query(
      `SELECT id, title, cover, views, bookmarks, chapters_count, status
       FROM manga WHERE translator_id=$1
       ORDER BY views DESC LIMIT 5`,
      [auth!.userId]
    )

    return apiSuccess({ earnings, topMangas })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
