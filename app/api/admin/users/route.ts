import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireRole, apiError, apiSuccess } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await requireRole('admin')
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))
    const offset = (page - 1) * limit
    const q = searchParams.get('q')
    const role = searchParams.get('role')

    const conditions: string[] = []
    const params: unknown[] = []
    let pi = 1

    if (q) { conditions.push(`(username ILIKE $${pi++} OR email ILIKE $${pi - 1})`); params.push(`%${q}%`) }
    if (role) { conditions.push(`role = $${pi++}`); params.push(role) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const users = await query(
      `SELECT id, username, email, role, subscription, level, diamonds, created_at
       FROM users ${where} ORDER BY created_at DESC LIMIT $${pi++} OFFSET $${pi++}`,
      [...params, limit, offset]
    )

    const [{ count }] = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM users ${where}`, params
    )

    return apiSuccess({ users, pagination: { page, limit, total: parseInt(count) } })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireRole('admin')
    const { id, role, subscription, diamonds } = await req.json()
    if (!id) return apiError('id talab qilinadi')

    const user = await queryOne(
      `UPDATE users SET
         role=COALESCE($1,role),
         subscription=COALESCE($2,subscription),
         diamonds=COALESCE($3,diamonds),
         updated_at=NOW()
       WHERE id=$4
       RETURNING id, username, email, role, subscription, diamonds`,
      [role, subscription, diamonds, id]
    )
    return apiSuccess({ user })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
