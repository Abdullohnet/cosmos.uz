import { NextRequest } from 'next/server'
import { pool, query, queryOne } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const chapters = await query(
      `SELECT c.id, c.number, c.title, c.views, c.is_premium, c.published_at,
              COUNT(cp.id) as page_count
       FROM chapters c
       LEFT JOIN chapter_pages cp ON cp.chapter_id = c.id
       WHERE c.manga_id = $1
       GROUP BY c.id
       ORDER BY c.number DESC`,
      [id]
    )
    return apiSuccess({ chapters })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const client = await pool.connect()
  try {
    const { id } = await params
    const auth = await requireAuth()

    if (auth.role !== 'admin') {
      if (auth.role !== 'translator') return apiError('Ruxsat yo\'q', 403)
      const manga = await queryOne<{ translator_id: string }>('SELECT translator_id FROM manga WHERE id=$1', [id])
      if (!manga) return apiError('Manga topilmadi', 404)
      if (manga.translator_id !== auth.userId) return apiError('Bu manga sizga tegishli emas', 403)
    }

    const { number, title, pages, is_premium } = await req.json()
    if (number == null) return apiError('Bob raqami kiritilishi shart')

    await client.query('BEGIN')

    const chapterRes = await client.query<{ id: string }>(
      `INSERT INTO chapters (manga_id, number, title, is_premium)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (manga_id, number) DO UPDATE SET title=EXCLUDED.title, is_premium=EXCLUDED.is_premium
       RETURNING id`,
      [id, number, title ?? `Bob ${number}`, is_premium ?? false]
    )
    const chapter = chapterRes.rows[0]

    if (pages?.length) {
      await client.query('DELETE FROM chapter_pages WHERE chapter_id = $1', [chapter.id])
      for (let i = 0; i < pages.length; i++) {
        await client.query(
          'INSERT INTO chapter_pages (chapter_id, page_number, image_url) VALUES ($1,$2,$3)',
          [chapter.id, i + 1, pages[i]]
        )
      }
    }

    await client.query(
      'UPDATE manga SET chapters_count = (SELECT COUNT(*) FROM chapters WHERE manga_id=$1), updated_at=NOW() WHERE id=$1',
      [id]
    )

    await client.query('COMMIT')
    return apiSuccess({ id: chapter.id, message: 'Bob qo\'shildi' }, 201)
  } catch (err: unknown) {
    await client.query('ROLLBACK')
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  } finally {
    client.release()
  }
}
