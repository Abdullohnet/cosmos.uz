import { NextRequest } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { apiError, apiSuccess } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      fullName, email, phone, telegram,
      languages, experience, portfolioLinks, previousManga,
      genres, motivation, sampleText
    } = body

    if (!fullName || !email || !motivation) {
      return apiError('Asosiy maydonlar to\'ldirilishi shart')
    }

    const existing = await queryOne(
      'SELECT id FROM translator_applications WHERE email = $1 AND status = \'pending\'',
      [email.toLowerCase()]
    )
    if (existing) {
      return apiError('Bu email bilan ariza allaqachon yuborilgan')
    }

    const [app] = await query<{ id: string }>(
      `INSERT INTO translator_applications
        (full_name, email, phone, telegram, languages, experience, portfolio_links, previous_manga, genres, motivation, sample_text)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        fullName,
        email.toLowerCase(),
        phone ?? '',
        telegram ?? '',
        languages ?? [],
        experience ?? '',
        portfolioLinks ?? '',
        previousManga ?? '',
        genres ?? [],
        motivation,
        sampleText ?? ''
      ]
    )

    return apiSuccess({ id: app.id, message: 'Ariza muvaffaqiyatli yuborildi!' }, 201)
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

