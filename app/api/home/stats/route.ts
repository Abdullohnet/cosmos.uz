import { query } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const [translators, topUsers] = await Promise.all([
      query<{ id: string; username: string; avatar: string; manga_count: number; followers: number }>(
        `SELECT u.id, u.username, u.avatar, u.followers,
                COUNT(m.id)::int AS manga_count
         FROM users u
         LEFT JOIN manga m ON m.translator_id = u.id
         WHERE u.role IN ('translator','admin')
         GROUP BY u.id
         ORDER BY manga_count DESC, u.followers DESC
         LIMIT 5`
      ),
      query<{ id: string; username: string; avatar: string; level: number; xp: number }>(
        `SELECT id, username, avatar, level, xp
         FROM users
         ORDER BY xp DESC, level DESC
         LIMIT 5`
      ),
    ])
    return apiSuccess({ translators, topUsers })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
