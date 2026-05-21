import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { signToken, apiError, apiSuccess } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { googleId, email, name, avatar } = await req.json()

    if (!googleId || !email) return apiError('Google ma\'lumotlari to\'liq emas')

    let user = await queryOne<{ id: string; username: string; email: string; role: string }>(
      'SELECT id, username, email, role FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email.toLowerCase()]
    )

    if (!user) {
      const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') + Math.floor(Math.random() * 1000)
      const [newUser] = await query<{ id: string; username: string; email: string; role: string }>(
        `INSERT INTO users (username, email, password_hash, google_id, avatar, role)
         VALUES ($1, $2, '', $3, $4, 'user')
         RETURNING id, username, email, role`,
        [username, email.toLowerCase(), googleId, avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`]
      )
      user = newUser
    } else if (!user) {
      await queryOne('UPDATE users SET google_id = $1 WHERE email = $2', [googleId, email.toLowerCase()])
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

    return apiSuccess({ user: { id: user.id, username: user.username, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
