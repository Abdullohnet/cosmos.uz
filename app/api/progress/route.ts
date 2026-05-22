import { NextRequest } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth()
    const url = new URL(req.url)
    const mangaId = url.searchParams.get('manga_id')

    if (mangaId) {
      const progress = await queryOne<{ chapter_number: number; updated_at: string }>(
        'SELECT chapter_number, updated_at FROM reading_progress WHERE user_id=$1 AND manga_id=$2',
        [auth.userId, mangaId]
      )
      return apiSuccess({ progress: progress ?? null })
    }

    const allProgress = await query<{ manga_id: string; chapter_number: number; updated_at: string }>(
      `SELECT rp.manga_id, rp.chapter_number, rp.updated_at,
              m.title, m.cover, m.chapters_count
       FROM reading_progress rp
       JOIN manga m ON m.id = rp.manga_id
       WHERE rp.user_id = $1
       ORDER BY rp.updated_at DESC
       LIMIT 20`,
      [auth.userId]
    )
    return apiSuccess({ progress: allProgress })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    const { manga_id, chapter_number } = await req.json()

    if (!manga_id || chapter_number == null) return apiError('manga_id va chapter_number talab qilinadi')

    const manga = await queryOne<{ id: string }>('SELECT id FROM manga WHERE id=$1', [manga_id])
    if (!manga) return apiError('Manga topilmadi', 404)

    await queryOne(
      `INSERT INTO reading_progress (user_id, manga_id, chapter_number, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, manga_id)
       DO UPDATE SET chapter_number = EXCLUDED.chapter_number, updated_at = NOW()`,
      [auth.userId, manga_id, chapter_number]
    )

    await queryOne(
      'UPDATE users SET chapters_read = chapters_read + 1 WHERE id=$1',
      [auth.userId]
    )

    return apiSuccess({ saved: true })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
