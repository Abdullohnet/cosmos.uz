import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const auth = await getAuthUser()

    const comments = await query<{
      id: string; content: string; likes_count: number; created_at: string
      user_id: string; username: string; avatar: string
      user_liked: boolean
    }>(
      `SELECT c.id, c.content, c.likes_count, c.created_at,
              u.id as user_id, u.username, u.avatar,
              ${auth ? `EXISTS(SELECT 1 FROM comment_likes cl WHERE cl.comment_id=c.id AND cl.user_id=$3)` : 'false'} as user_liked
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.manga_id = $1
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET ${offset}`,
      auth ? [id, limit, auth.userId] : [id, limit]
    )

    const total = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM comments WHERE manga_id=$1',
      [id]
    )

    return apiSuccess({
      comments,
      pagination: {
        page,
        limit,
        total: parseInt(total?.count || '0'),
        pages: Math.ceil(parseInt(total?.count || '0') / limit),
      }
    })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const auth = await getAuthUser()
    if (!auth) return apiError('Kirish talab qilinadi', 401)

    const { content } = await req.json()
    if (!content || content.trim().length === 0) return apiError('Izoh matni bo\'sh bo\'lmasin')
    if (content.trim().length > 1000) return apiError('Izoh 1000 ta belgidan oshmasin')

    const manga = await queryOne<{ id: string }>('SELECT id FROM manga WHERE id=$1', [id])
    if (!manga) return apiError('Manga topilmadi', 404)

    const comment = await queryOne<{
      id: string; content: string; likes_count: number; created_at: string
    }>(
      `INSERT INTO comments (manga_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, likes_count, created_at`,
      [id, auth.userId, content.trim()]
    )

    const user = await queryOne<{ username: string; avatar: string }>(
      'SELECT username, avatar FROM users WHERE id=$1',
      [auth.userId]
    )

    // Add XP for commenting
    await queryOne(
      `UPDATE users SET xp = xp + 2, updated_at = NOW() WHERE id=$1`,
      [auth.userId]
    )

    return apiSuccess({
      comment: {
        ...comment,
        user_id: auth.userId,
        username: user?.username,
        avatar: user?.avatar,
        user_liked: false,
      }
    }, 201)
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const auth = await getAuthUser()
    if (!auth) return apiError('Kirish talab qilinadi', 401)

    const url = new URL(req.url)
    const commentId = url.searchParams.get('comment_id')
    if (!commentId) return apiError('comment_id talab qilinadi')

    const comment = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM comments WHERE id=$1 AND manga_id=$2',
      [commentId, id]
    )
    if (!comment) return apiError('Izoh topilmadi', 404)
    if (comment.user_id !== auth.userId && auth.role !== 'admin') {
      return apiError('Ruxsat yo\'q', 403)
    }

    await queryOne('DELETE FROM comments WHERE id=$1', [commentId])
    return apiSuccess({ deleted: true })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
