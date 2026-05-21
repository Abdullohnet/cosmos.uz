import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireRole, apiError, apiSuccess } from '@/lib/auth'

export async function GET() {
  try {
    await requireRole('admin')
    const apps = await query(
      'SELECT * FROM translator_applications ORDER BY created_at DESC'
    )
    return apiSuccess({ applications: apps })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireRole('admin')
    const { id, action, note } = await req.json()

    if (!id || !['approve', 'reject'].includes(action)) {
      return apiError('Noto\'g\'ri so\'rov')
    }

    const status = action === 'approve' ? 'approved' : 'rejected'
    await queryOne(
      `UPDATE translator_applications SET status=$1, updated_at=NOW() WHERE id=$2`,
      [status, id]
    )

    const fullApp = await queryOne<{ full_name: string; email: string }>(
      'SELECT full_name, email FROM translator_applications WHERE id=$1', [id]
    )

    if (action === 'approve' && fullApp) {
      const existingUser = await queryOne<{ id: string }>(
        'SELECT id FROM users WHERE email=$1', [fullApp.email]
      )
      if (existingUser) {
        await queryOne('UPDATE users SET role=$1 WHERE id=$2', ['translator', existingUser.id])
        await queryOne(
          `INSERT INTO notifications (user_id, type, title, message, created_at)
           VALUES ($1, 'system', $2, $3, NOW())`,
          [
            existingUser.id,
            'Tabriklaymiz! Tarjimon sifatida tasdiqlandingiz',
            'Arizangiz ko\'rib chiqildi va tasdiqlandi. Endi siz MangaUZ platformasida tarjimon sifatida faoliyat yuritishingiz mumkin. Yangi imkoniyatlardan foydalanish uchun tizimdan chiqib, qayta kiring.'
          ]
        )
      } else {
        const bcrypt = await import('bcryptjs')
        const hash = await bcrypt.default.hash('manga2026', 10)
        const newUser = await queryOne<{ id: string }>(
          `INSERT INTO users (username, email, password_hash, role)
           VALUES ($1,$2,$3,'translator')
           ON CONFLICT (email) DO UPDATE SET role='translator'
           RETURNING id`,
          [fullApp.full_name.replace(/\s+/g, '_').toLowerCase(), fullApp.email, hash]
        )
        if (newUser) {
          await queryOne(
            `INSERT INTO notifications (user_id, type, title, message, created_at)
             VALUES ($1, 'system', $2, $3, NOW())`,
            [
              newUser.id,
              'Tabriklaymiz! Tarjimon sifatida tasdiqlandingiz',
              'Arizangiz ko\'rib chiqildi va tasdiqlandi. Tizimga kirish uchun emailingiz va vaqtinchalik parol: manga2026. Kirgach parolingizni o\'zgartiring.'
            ]
          )
        }
      }
    }

    if (action === 'reject' && fullApp) {
      const existingUser = await queryOne<{ id: string }>(
        'SELECT id FROM users WHERE email=$1', [fullApp.email]
      )
      if (existingUser) {
        await queryOne(
          `INSERT INTO notifications (user_id, type, title, message, created_at)
           VALUES ($1, 'system', $2, $3, NOW())`,
          [
            existingUser.id,
            'Tarjimon arizasi ko\'rib chiqildi',
            note
              ? `Arizangiz rad etildi. Sabab: ${note}. Qayta ariza topshirishingiz mumkin.`
              : 'Arizangiz hozircha rad etildi. Keyinroq qayta ariza topshirishingiz mumkin.'
          ]
        )
      }
    }

    return apiSuccess({
      message: action === 'approve'
        ? 'Ariza tasdiqlandi, foydalanuvchiga tarjimon roli berildi'
        : 'Ariza rad etildi'
    })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
