import { cookies } from 'next/headers'
import { apiSuccess } from '@/lib/auth'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  return apiSuccess({ message: 'Muvaffaqiyatli chiqildi' })
}
