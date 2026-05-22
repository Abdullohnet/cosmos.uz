import { NextRequest } from 'next/server'
import { getAuthUser, apiError, apiSuccess } from '@/lib/auth'

const MAX_SIZE = 50 * 1024 * 1024
const ALL_ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']

async function uploadToTelegramSafe(buffer: Buffer, filename: string, mimeType: string): Promise<string | null> {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID_REAL || '-1003812463064'

  if (!BOT_TOKEN || BOT_TOKEN.trim() === '') return null

  try {
    const { uploadToTelegram } = await import('@/lib/telegram-storage')
    const tgFile = await uploadToTelegram(buffer, filename, mimeType)
    return `/api/tg-file/${encodeURIComponent(tgFile.fileId)}`
  } catch {
    return null
  }
}

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

    // Try Telegram first
    const tgUrl = await uploadToTelegramSafe(buffer, file.name, file.type)
    if (tgUrl) {
      return apiSuccess({ url: tgUrl, name: file.name, size: file.size, type: file.type })
    }

    // Fallback: base64 data URL (for images only)
    if (file.type.startsWith('image/')) {
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`
      return apiSuccess({ url: dataUrl, name: file.name, size: file.size, type: file.type })
    }

    return apiError('Telegram sozlanmagan. PDF yuklab bo\'lmaydi, faqat rasmlar qo\'llab-quvvatlanadi.')
  } catch (err) {
    console.error('Upload error:', err)
    const msg = err instanceof Error ? err.message : 'Server xatosi'
    return apiError(msg, 500)
  }
}
