import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'
import { signToken, apiError, apiSuccess } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { googleId, email, name, avatar } = await req.json()

    if (!googleId || !email) return apiError('Google ma\'lumotlari to\'liq emas')

    const emailLower = email.toLowerCase()

    let user = await queryOne<{ id: string; username: string; email: string; role: string; avatar: string }>(
      'SELECT id, username, email, role, avatar FROM users WHERE email = $1',
      [emailLower]
    )

    if (!user) {
      const base = emailLower.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
      const username = (base || 'user') + Math.floor(Math.random() * 9000 + 1000)
      const hash = await bcrypt.hash(googleId + '_google_oauth', 10)
      const userAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      user = await queryOne<{ id: string; username: string; email: string; role: string; avatar: string }>(
        `INSERT INTO users (username, email, password_hash, avatar, diamonds)
         VALUES ($1, $2, $3, $4, 50)
         ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
         RETURNING id, username, email, role, avatar`,
        [username, emailLower, hash, userAvatar]
      )
      if (user) {
        await queryOne(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES ($1, 'system', 'MangaUZ ga xush kelibsiz! 🎉', 'Google orqali kirganingiz uchun 50 ta olmos sovg\'a!')`,
          [user.id]
        ).catch(() => {})
      }
    }

    if (!user) return apiError('Foydalanuvchi yaratilmadi', 500)

    const token = await signToken({ userId: user.id, username: user.username, role: user.role, email: user.email })
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return apiSuccess({ user: { id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar } })
  } catch (err) {
    console.error('Google auth error:', err)
    return apiError('Server xatosi', 500)
  }
}
