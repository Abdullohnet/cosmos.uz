import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth()
    const { id } = await params

    if (auth.userId !== id) return apiError('Ruxsat yo\'q', 403)

    const { amount } = await req.json()
    if (!amount || amount < 0) return apiError('Noto\'g\'ri miqdor')

    const user = await queryOne<{ level: number; xp: number; xp_to_next_level: number }>(
      'SELECT level, xp, xp_to_next_level FROM users WHERE id=$1',
      [id]
    )
    if (!user) return apiError('Foydalanuvchi topilmadi', 404)

    let newXP = user.xp + amount
    let newLevel = user.level
    let newXPToNext = user.xp_to_next_level

    while (newXP >= newXPToNext) {
      newXP -= newXPToNext
      newLevel += 1
      newXPToNext = Math.floor(newXPToNext * 1.2)
    }

    const updated = await queryOne<{ level: number; xp: number; xp_to_next_level: number }>(
      `UPDATE users SET xp=$1, level=$2, xp_to_next_level=$3, updated_at=NOW()
       WHERE id=$4 RETURNING level, xp, xp_to_next_level`,
      [newXP, newLevel, newXPToNext, id]
    )

    const leveledUp = newLevel > user.level

    if (leveledUp) {
      await queryOne(
        `INSERT INTO notifications (user_id, type, title, message)
         VALUES ($1, 'achievement', 'Yangi daraja! 🎉', $2)`,
        [id, `Tabriklaymiz! Siz ${newLevel}-darajaga ko'tarildingiz! 🌟`]
      ).catch(() => {})
    }

    return apiSuccess({ ...updated, leveledUp, previousLevel: user.level })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Kirish talab qilinadi', 401)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
