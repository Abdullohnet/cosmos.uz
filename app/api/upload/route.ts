import { NextRequest } from 'next/server'
import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) return apiError('Avtorizatsiya talab qilinadi', 401)

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return apiError('Fayl topilmadi')

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) return apiError('Fayl hajmi 10MB dan oshmasligi kerak')

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) return apiError('Faqat JPG, PNG, WEBP yoki GIF formatlar ruxsat etilgan')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return apiSuccess({ url: dataUrl, name: file.name, size: file.size, type: file.type })
  } catch (err) {
    console.error(err)
    return apiError('Server xatosi', 500)
  }
}

export const config = {
  api: { bodyParser: false },
}
