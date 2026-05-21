import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'
import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const user = await queryOne(
      `SELECT id, username, email, role, subscription, level, xp, xp_to_next_level,
              diamonds, avatar, bio, followers, following,
              chapters_read, time_spent, manga_completed, created_at
       FROM users WHERE id = $1`,
      [id]
    )
    if (!user) return apiError('Foydalanuvchi topilmadi', 404)
    return apiSuccess({ user })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const auth = await getAuthUser()
    if (!auth) return apiError('Avtorizatsiya talab qilinadi', 401)
    if (auth.userId !== id && auth.role !== 'admin') return apiError('Ruxsat yo\'q', 403)

    const { username, bio, avatar } = await req.json()

    const user = await queryOne(
      `UPDATE users SET
         username=COALESCE($1, username),
         bio=COALESCE($2, bio),
         avatar=COALESCE($3, avatar),
         updated_at=NOW()
       WHERE id=$4
       RETURNING id, username, email, role, bio, avatar, subscription, level, diamonds`,
      [username, bio, avatar, id]
    )
    return apiSuccess({ user })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
