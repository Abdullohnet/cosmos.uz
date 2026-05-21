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

    if (action === 'approve') {
      const app = await queryOne<{ email: string }>(
        'SELECT email FROM translator_applications WHERE id=$1', [id]
      )
      if (app) {
        const existingUser = await queryOne<{ id: string }>(
          'SELECT id FROM users WHERE email=$1', [app.email]
        )
        if (existingUser) {
          await queryOne('UPDATE users SET role=$1 WHERE id=$2', ['translator', existingUser.id])
        } else {
          const bcrypt = await import('bcryptjs')
          const hash = await bcrypt.default.hash('manga2026', 10)
          const fullApp = await queryOne<{ full_name: string; email: string }>('SELECT full_name, email FROM translator_applications WHERE id=$1', [id])
          if (fullApp) {
            await queryOne(
              `INSERT INTO users (username, email, password_hash, role)
               VALUES ($1,$2,$3,'translator')
               ON CONFLICT (email) DO UPDATE SET role='translator'`,
              [fullApp.full_name.replace(/\s+/g, '_').toLowerCase(), fullApp.email, hash]
            )
          }
        }
      }
    }

    if (note) {
      await queryOne('UPDATE translator_applications SET status=$1 WHERE id=$2', [status, id])
    }

    return apiSuccess({ message: action === 'approve' ? 'Ariza tasdiqlandi, foydalanuvchiga tarjimon roli berildi' : 'Ariza rad etildi' })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return apiError('Avtorizatsiya talab qilinadi', 401)
    if (err instanceof Error && err.message === 'Forbidden') return apiError('Ruxsat yo\'q', 403)
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
