const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID_REAL || '-1003812463064'
const API = `https://api.telegram.org/bot${BOT_TOKEN}`

export interface TelegramFile {
  fileId: string
  fileUniqueId: string
  url: string
}

export async function uploadToTelegram(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<TelegramFile> {
  if (!BOT_TOKEN || !CHANNEL_ID) {
    throw new Error('Telegram sozlamalari topilmadi')
  }

  const formData = new FormData()
  const blob = new Blob([buffer], { type: mimeType })

  formData.append('document', blob, filename)
  formData.append('chat_id', CHANNEL_ID)
  formData.append('disable_notification', 'true')

  const res = await fetch(`${API}/sendDocument`, { method: 'POST', body: formData })
  const data = await res.json() as {
    ok: boolean
    description?: string
    result?: { document: { file_id: string; file_unique_id: string } }
  }

  if (!data.ok) throw new Error(data.description || 'Telegram xatosi')

  const doc = data.result!.document
  const url = await getTelegramFileUrl(doc.file_id)
  return { fileId: doc.file_id, fileUniqueId: doc.file_unique_id, url }
}

export async function getTelegramFileUrl(fileId: string): Promise<string> {
  const res = await fetch(`${API}/getFile?file_id=${fileId}`)
  const data = await res.json() as {
    ok: boolean
    result?: { file_path: string }
  }
  if (!data.ok || !data.result) throw new Error('Fayl topilmadi')
  return `https://api.telegram.org/file/bot${BOT_TOKEN}/${data.result.file_path}`
}

export async function refreshTelegramUrl(fileId: string): Promise<string> {
  return getTelegramFileUrl(fileId)
}
