import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'
import { queryOne } from '@/lib/db'

interface DBUser {
  id: string; username: string; email: string; role: string; subscription: string
  level: number; xp: number; xp_to_next_level: number; diamonds: number
  avatar: string; bio: string; followers: number; following: number
  chapters_read: number; time_spent: number; manga_completed: number; created_at: string
}

export async function GET() {
  try {
    const auth = await getAuthUser()
    if (!auth) return apiError('Avtorizatsiya talab qilinadi', 401)

    const user = await queryOne<DBUser>(
      `SELECT id, username, email, role, subscription, level, xp, xp_to_next_level,
              diamonds, avatar, bio, followers, following,
              chapters_read, time_spent, manga_completed, created_at
       FROM users WHERE id = $1`,
      [auth.userId]
    )
    if (!user) return apiError('Foydalanuvchi topilmadi', 404)
    return apiSuccess({ user })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
