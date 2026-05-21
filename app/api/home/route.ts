import { query, queryOne } from '@/lib/db'
import { apiError, apiSuccess } from '@/lib/auth'

export async function GET() {
  try {
    const [featured, latest, popular, stats] = await Promise.all([
      query(
        `SELECT id, title, cover, type, status, rating, views, chapters_count, description
         FROM manga ORDER BY views DESC LIMIT 8`
      ),
      query(
        `SELECT id, title, cover, type, status, rating, views, chapters_count
         FROM manga ORDER BY created_at DESC LIMIT 12`
      ),
      query(
        `SELECT id, title, cover, type, status, rating, views, chapters_count
         FROM manga ORDER BY rating DESC LIMIT 12`
      ),
      Promise.all([
        queryOne<{ count: string }>('SELECT COUNT(*) as count FROM manga'),
        queryOne<{ count: string }>('SELECT COUNT(*) as count FROM users'),
        queryOne<{ count: string }>('SELECT COUNT(*) as count FROM users WHERE role=\'translator\''),
      ]),
    ])

    const [mangaCount, userCount, translatorCount] = stats

    return apiSuccess({
      featured,
      latest,
      popular,
      stats: {
        totalManga: parseInt(mangaCount?.count ?? '0'),
        totalUsers: parseInt(userCount?.count ?? '0'),
        totalTranslators: parseInt(translatorCount?.count ?? '0'),
      },
    })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
