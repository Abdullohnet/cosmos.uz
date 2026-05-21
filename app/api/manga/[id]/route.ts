import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAuthUser, requireRole, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const manga = await queryOne(
      `SELECT m.*, u.username as translator_name,
              COALESCE(array_agg(DISTINCT mg.genre) FILTER (WHERE mg.genre IS NOT NULL), '{}') AS genres
       FROM manga m
       LEFT JOIN users u ON u.id = m.translator_id
       LEFT JOIN manga_genres mg ON mg.manga_id = m.id
       WHERE m.id = $1
       GROUP BY m.id, u.username`,
      [id]
    )
    if (!manga) return apiError('Manga topilmadi', 404)

    await queryOne('UPDATE manga SET views = views + 1 WHERE id = $1', [id])

    const chapters = await query(
      'SELECT id, number, title, views, is_premium, published_at FROM chapters WHERE manga_id = $1 ORDER BY number DESC',
      [id]
    )

    const auth = await getAuthUser()
    let isBookmarked = false
    let userRating = null
    if (auth) {
      const bm = await queryOne('SELECT 1 FROM bookmarks WHERE user_id=$1 AND manga_id=$2', [auth.userId, id])
      isBookmarked = !!bm
      const rt = await queryOne<{ score: number }>('SELECT score FROM ratings WHERE user_id=$1 AND manga_id=$2', [auth.userId, id])
      userRating = rt?.score ?? null
    }

    return apiSuccess({ manga, chapters, isBookmarked, userRating })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await requireRole('translator')
    const body = await req.json()
    const { title, cover, description, author, artist, status, is_premium } = body

    await queryOne(
      `UPDATE manga SET title=COALESCE($1,title), cover=COALESCE($2,cover),
       description=COALESCE($3,description), author=COALESCE($4,author),
       artist=COALESCE($5,artist), status=COALESCE($6,status),
       is_premium=COALESCE($7,is_premium), updated_at=NOW()
       WHERE id=$8`,
      [title, cover, description, author, artist, status, is_premium, id]
    )
    return apiSuccess({ message: 'Manga yangilandi' })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await requireRole('admin')
    await queryOne('DELETE FROM manga WHERE id=$1', [id])
    return apiSuccess({ message: 'Manga o\'chirildi' })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
