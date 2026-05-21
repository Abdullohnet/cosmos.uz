import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) return apiError('Avtorizatsiya talab qilinadi', 401)

    const { searchParams } = new URL(req.url)
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))

    const notifications = await query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2',
      [auth.userId, limit]
    )
    const [{ count }] = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id=$1 AND is_read=false',
      [auth.userId]
    )

    return apiSuccess({ notifications, unread: parseInt(count) })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) return apiError('Avtorizatsiya talab qilinadi', 401)

    const { id, all } = await req.json()
    if (all) {
      await queryOne('UPDATE notifications SET is_read=true WHERE user_id=$1', [auth.userId])
    } else if (id) {
      await queryOne('UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2', [id, auth.userId])
    }
    return apiSuccess({ message: 'Yangilandi' })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
