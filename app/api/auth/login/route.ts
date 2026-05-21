import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/db'
import { signToken, apiError, apiSuccess } from '@/lib/auth'
import { cookies } from 'next/headers'

interface DBUser {
  id: string
  username: string
  email: string
  password_hash: string
  role: string
  subscription: string
  level: number
  xp: number
  xp_to_next_level: number
  diamonds: number
  avatar: string
  bio: string
  followers: number
  following: number
  chapters_read: number
  time_spent: number
  manga_completed: number
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return apiError('Email va parol kiritilishi shart')
    }

    const user = await queryOne<DBUser>(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (!user) {
      return apiError('Email yoki parol noto\'g\'ri')
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return apiError('Email yoki parol noto\'g\'ri')
    }

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

    const { password_hash: _, ...safeUser } = user
    return apiSuccess({ user: safeUser })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
