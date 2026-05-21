import { queryOne, query } from '@/lib/db'
import { requireRole, apiError, apiSuccess } from '@/lib/auth'

export async function GET() {
  try {
    await requireRole('admin')

    const [users, manga, views, translators, newToday, pendingApps] = await Promise.all([
      queryOne<{ count: string }>('SELECT COUNT(*) as count FROM users'),
      queryOne<{ count: string }>('SELECT COUNT(*) as count FROM manga'),
      queryOne<{ total: string }>('SELECT COALESCE(SUM(views),0) as total FROM manga'),
      queryOne<{ count: string }>('SELECT COUNT(*) as count FROM users WHERE role=\'translator\''),
      queryOne<{ count: string }>('SELECT COUNT(*) as count FROM users WHERE created_at > NOW() - INTERVAL \'1 day\''),
      queryOne<{ count: string }>('SELECT COUNT(*) as count FROM translator_applications WHERE status=\'pending\''),
    ])

    const recentUsers = await query(
      `SELECT id, username, email, role, subscription, level, created_at
       FROM users ORDER BY created_at DESC LIMIT 10`
    )

    const topManga = await query(
      `SELECT id, title, cover, views, rating, chapters_count, status
       FROM manga ORDER BY views DESC LIMIT 10`
    )

    return apiSuccess({
      stats: {
        totalUsers: parseInt(users?.count ?? '0'),
        totalManga: parseInt(manga?.count ?? '0'),
        totalViews: parseInt(views?.total ?? '0'),
        totalTranslators: parseInt(translators?.count ?? '0'),
        newUsersToday: parseInt(newToday?.count ?? '0'),
        pendingApplications: parseInt(pendingApps?.count ?? '0'),
      },
      recentUsers,
      topManga,
    })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
