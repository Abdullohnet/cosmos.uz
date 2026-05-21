import { NextRequest } from 'next/server'
import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'
import { uploadToTelegram } from '@/lib/telegram-storage'

const MAX_SIZE = 50 * 1024 * 1024
const ALL_ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) return apiError('Avtorizatsiya talab qilinadi', 401)
    if (auth.role !== 'translator' && auth.role !== 'admin') {
      return apiError('Faqat tarjimonlar fayl yuklay oladi', 403)
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return apiError('Fayl topilmadi')
    if (file.size > MAX_SIZE) return apiError('Fayl hajmi 50MB dan oshmasligi kerak')
    if (!ALL_ALLOWED.includes(file.type)) {
      return apiError('Faqat JPG, PNG, WEBP, GIF yoki PDF formatlar ruxsat etilgan')
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const tgFile = await uploadToTelegram(buffer, file.name, file.type)
    const proxyUrl = `/api/tg-file/${encodeURIComponent(tgFile.fileId)}`

    return apiSuccess({
      url: proxyUrl,
      fileId: tgFile.fileId,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (err) {
    console.error('Upload error:', err)
    const msg = err instanceof Error ? err.message : 'Server xatosi'
    return apiError(msg, 500)
  }
}
