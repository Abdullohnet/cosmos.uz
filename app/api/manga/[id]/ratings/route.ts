import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth()
    const { id } = await params
    const body = await req.json()
    const score = parseInt(body.score)

    if (!score || score < 1 || score > 5) {
      return apiError('Baho 1 dan 5 gacha bo\'lishi kerak')
    }

    const manga = await queryOne<{ id: string }>('SELECT id FROM manga WHERE id=$1', [id])
    if (!manga) return apiError('Manga topilmadi', 404)

    await queryOne(
      `INSERT INTO ratings (user_id, manga_id, score, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, manga_id)
       DO UPDATE SET score = EXCLUDED.score, updated_at = NOW()`,
      [auth.userId, id, score]
    )

    const avg = await queryOne<{ avg: string; count: string }>(
      'SELECT ROUND(AVG(score)::numeric, 2) as avg, COUNT(*) as count FROM ratings WHERE manga_id=$1',
      [id]
    )

    const newRating = parseFloat(avg?.avg ?? '0')
    await queryOne('UPDATE manga SET rating=$1 WHERE id=$2', [newRating, id])

    return apiSuccess({ score, avgRating: newRating, ratingCount: parseInt(avg?.count ?? '0') })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
