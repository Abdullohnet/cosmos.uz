import { NextRequest, NextResponse } from 'next/server'
import { getTelegramFileUrl } from '@/lib/telegram-storage'

interface Params { params: Promise<{ fileId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { fileId } = await params
    const decoded = decodeURIComponent(fileId)
    const tgUrl = await getTelegramFileUrl(decoded)

    const res = await fetch(tgUrl)
    if (!res.ok) {
      return new NextResponse('Fayl topilmadi', { status: 404 })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('TG proxy error:', err)
    return new NextResponse('Server xatosi', { status: 500 })
  }
}
