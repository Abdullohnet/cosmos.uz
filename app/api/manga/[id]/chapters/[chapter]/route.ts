import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string; chapter: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id, chapter } = await params
    const chapterNum = parseFloat(chapter)

    const ch = await queryOne(
      `SELECT c.id, c.number, c.title, c.is_premium, c.published_at,
              m.title as manga_title, m.chapters_count
       FROM chapters c
       JOIN manga m ON m.id = c.manga_id
       WHERE c.manga_id = $1 AND c.number = $2`,
      [id, chapterNum]
    )

    if (!ch) return apiError('Bob topilmadi', 404)

    await queryOne('UPDATE chapters SET views = views + 1 WHERE id = $1', [(ch as { id: string }).id])

    const pages = await query(
      'SELECT page_number, image_url FROM chapter_pages WHERE chapter_id = $1 ORDER BY page_number ASC',
      [(ch as { id: string }).id]
    )

    const [prev, next] = await Promise.all([
      queryOne<{ number: number }>('SELECT number FROM chapters WHERE manga_id=$1 AND number < $2 ORDER BY number DESC LIMIT 1', [id, chapterNum]),
      queryOne<{ number: number }>('SELECT number FROM chapters WHERE manga_id=$1 AND number > $2 ORDER BY number ASC LIMIT 1', [id, chapterNum]),
    ])

    return apiSuccess({ chapter: ch, pages, prevChapter: prev?.number ?? null, nextChapter: next?.number ?? null })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
