import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { query, queryOne } from '@/lib/db'
import { signToken, apiError, apiSuccess } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return apiError('Barcha maydonlar to\'ldirilishi shart')
    }
    if (password.length < 6) {
      return apiError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
    }
    if (username.length < 3) {
      return apiError('Foydalanuvchi nomi kamida 3 ta belgi bo\'lishi kerak')
    }

    const existing = await queryOne(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username]
    )
    if (existing) {
      return apiError('Bu email yoki foydalanuvchi nomi allaqachon mavjud')
    }

    const hash = await bcrypt.hash(password, 12)
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

    const [user] = await query<{
      id: string; username: string; email: string; role: string
      subscription: string; level: number; xp: number; xp_to_next_level: number
      diamonds: number; avatar: string; bio: string; followers: number; following: number
      chapters_read: number; time_spent: number; manga_completed: number; created_at: string
    }>(
      `INSERT INTO users (username, email, password_hash, avatar, diamonds)
       VALUES ($1, $2, $3, $4, 50)
       RETURNING id, username, email, role, subscription, level, xp, xp_to_next_level,
                 diamonds, avatar, bio, followers, following,
                 chapters_read, time_spent, manga_completed, created_at`,
      [username, email.toLowerCase(), hash, avatar]
    )

    const token = await signToken({ userId: user.id, username: user.username, role: user.role, email: user.email })
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    // Send welcome notification
    await queryOne(
      `INSERT INTO notifications (user_id, type, title, message)
       VALUES ($1, 'system', 'MangaUZ ga xush kelibsiz! 🎉', 'Ro''yxatdan o''tganingiz uchun 50 ta olmos sovg''a!')`,
      [user.id]
    ).catch(() => {})

    return apiSuccess({ user }, 201)
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
