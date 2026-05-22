import { apiSuccess, apiError } from '@/lib/auth'
import { initDatabase } from '@/lib/db-init'

export async function POST() {
  try {
    await initDatabase()
    return apiSuccess({ message: 'Database initialized successfully' })
  } catch (err) {
    console.error(err)
    return apiError('DB init failed', 500)
  }
}

export async function GET() {
  try {
    await initDatabase()
    return apiSuccess({ message: 'Database initialized successfully' })
  } catch (err) {
    console.error(err)
    return apiError('DB init failed', 500)
  }
}
