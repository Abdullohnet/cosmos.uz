import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth()
    const { id: commentId } = await params

    const comment = await queryOne<{ id: string; likes_count: number }>(
      'SELECT id, likes_count FROM comments WHERE id=$1',
      [commentId]
    )
    if (!comment) return apiError('Izoh topilmadi', 404)

    const existing = await queryOne(
      'SELECT 1 FROM comment_likes WHERE comment_id=$1 AND user_id=$2',
      [commentId, auth.userId]
    )

    let liked: boolean
    let newCount: number

    if (existing) {
      await queryOne('DELETE FROM comment_likes WHERE comment_id=$1 AND user_id=$2', [commentId, auth.userId])
      await queryOne('UPDATE comments SET likes_count = GREATEST(0, likes_count - 1) WHERE id=$1', [commentId])
      liked = false
      newCount = Math.max(0, comment.likes_count - 1)
    } else {
      await queryOne(
        'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [commentId, auth.userId]
      )
      await queryOne('UPDATE comments SET likes_count = likes_count + 1 WHERE id=$1', [commentId])
      liked = true
      newCount = comment.likes_count + 1
    }

    return apiSuccess({ liked, likes_count: newCount })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Kirish talab qilinadi', 401)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
