import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth()
    const { id } = await params

    if (auth.userId !== id && auth.role !== 'admin') return apiError('Ruxsat yo\'q', 403)

    const { amount, type, description } = await req.json()
    if (!amount || amount <= 0) return apiError('Noto\'g\'ri miqdor')

    const user = await queryOne<{ id: string; diamonds: number }>(
      'SELECT id, diamonds FROM users WHERE id=$1', [id]
    )
    if (!user) return apiError('Foydalanuvchi topilmadi', 404)

    const updated = await queryOne<{ diamonds: number }>(
      'UPDATE users SET diamonds = diamonds + $1, updated_at = NOW() WHERE id=$2 RETURNING diamonds',
      [amount, id]
    )

    await queryOne(
      `INSERT INTO diamond_transactions (user_id, amount, type, description)
       VALUES ($1, $2, $3, $4)`,
      [id, amount, type || 'purchase', description || 'Olmos xarid']
    ).catch(() => {})

    return apiSuccess({ diamonds: updated?.diamonds, added: amount })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Kirish talab qilinadi', 401)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
