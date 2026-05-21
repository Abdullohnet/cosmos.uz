import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const auth = await getAuthUser()
    if (!auth || (auth.userId !== id && auth.role !== 'admin')) {
      return apiError('Ruxsat yo\'q', 403)
    }

    const bookmarks = await query(
      `SELECT m.id, m.title, m.cover, m.status, m.type, m.rating, m.chapters_count, b.created_at as bookmarked_at
       FROM bookmarks b
       JOIN manga m ON m.id = b.manga_id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [id]
    )
    return apiSuccess({ bookmarks })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const auth = await getAuthUser()
    if (!auth || auth.userId !== id) return apiError('Ruxsat yo\'q', 403)

    const { manga_id } = await req.json()
    if (!manga_id) return apiError('manga_id talab qilinadi')

    const existing = await queryOne(
      'SELECT id FROM bookmarks WHERE user_id=$1 AND manga_id=$2',
      [id, manga_id]
    )

    if (existing) {
      await queryOne('DELETE FROM bookmarks WHERE user_id=$1 AND manga_id=$2', [id, manga_id])
      await queryOne('UPDATE manga SET bookmarks = bookmarks - 1 WHERE id=$1', [manga_id])
      return apiSuccess({ bookmarked: false })
    } else {
      await queryOne('INSERT INTO bookmarks (user_id, manga_id) VALUES ($1,$2)', [id, manga_id])
      await queryOne('UPDATE manga SET bookmarks = bookmarks + 1 WHERE id=$1', [manga_id])
      return apiSuccess({ bookmarked: true })
    }
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
