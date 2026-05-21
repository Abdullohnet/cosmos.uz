import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/db'
import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) return apiError('Avtorizatsiya talab qilinadi', 401)

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return apiError('Barcha maydonlar to\'ldirilishi shart')
    }
    if (newPassword.length < 6) {
      return apiError('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak')
    }

    const user = await queryOne<{ id: string; password_hash: string }>(
      'SELECT id, password_hash FROM users WHERE id = $1',
      [auth.userId]
    )
    if (!user) return apiError('Foydalanuvchi topilmadi', 404)

    const valid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!valid) return apiError('Joriy parol noto\'g\'ri')

    const hash = await bcrypt.hash(newPassword, 10)
    await queryOne('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, auth.userId])

    return apiSuccess({ message: 'Parol muvaffaqiyatli o\'zgartirildi' })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}
