import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { signToken, apiError, apiSuccess } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { uid, email, displayName, photoURL } = await req.json()

    if (!uid || !email) return apiError('Firebase ma\'lumotlari to\'liq emas')

    const emailLower = email.toLowerCase()

    let user = await queryOne<{ id: string; username: string; email: string; role: string; avatar: string }>(
      'SELECT id, username, email, role, avatar FROM users WHERE google_id = $1 OR email = $2',
      [uid, emailLower]
    )

    if (!user) {
      const base = emailLower.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
      const username = base + Math.floor(Math.random() * 9000 + 1000)
      const avatar = photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      const rows = await query<{ id: string; username: string; email: string; role: string; avatar: string }>(
        `INSERT INTO users (username, email, password_hash, google_id, avatar, role, subscription, diamonds, xp)
         VALUES ($1, $2, '', $3, $4, 'user', 'free', 50, 0)
         RETURNING id, username, email, role, avatar`,
        [username, emailLower, uid, avatar]
      )
      user = rows[0]
    } else {
      await queryOne(
        'UPDATE users SET google_id = $1, avatar = COALESCE(NULLIF($2,\'\'), avatar) WHERE id = $3',
        [uid, photoURL || '', user.id]
      )
    }

    if (!user) return apiError('Foydalanuvchi yaratilmadi', 500)

    const token = await signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    })

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return apiSuccess({
      user: { id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar },
    })
  } catch (err) {
    console.error('Firebase auth error:', err)
    return apiError('Server xatosi', 500)
  }
}
