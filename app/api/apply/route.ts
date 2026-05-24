// app/api/apply/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const {
      fullName, email, phone, telegram,
      languages, experience, portfolioLinks, previousManga,
      genres, motivation, sampleText
    } = body

    // Validatsiya
    if (!fullName || fullName.length < 3) {
      return NextResponse.json(
        { success: false, error: 'To\'liq ism kamida 3 belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Yaroqli email manzil kiriting' },
        { status: 400 }
      )
    }

    if (!phone || phone.length < 9) {
      return NextResponse.json(
        { success: false, error: 'Telefon raqam to\'g\'ri kiritilishi kerak' },
        { status: 400 }
      )
    }

    if (!telegram || telegram.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Telegram username kiriting' },
        { status: 400 }
      )
    }

    if (!languages || languages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kamida bitta til tanlang' },
        { status: 400 }
      )
    }

    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Tajriba darajasini tanlang' },
        { status: 400 }
      )
    }

    if (!previousManga || previousManga.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ilgari tarjima qilgan mangalaringizni yozing' },
        { status: 400 }
      )
    }

    if (!genres || genres.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kamida bitta janr tanlang' },
        { status: 400 }
      )
    }

    if (!motivation || motivation.length < 50) {
      return NextResponse.json(
        { success: false, error: 'Motivatsiya xati kamida 50 belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Arizani localStorage'ga saqlash uchun ma'lumot tayyorlaymiz
    const application = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      telegram: telegram.trim(),
      languages: languages,
      experience: experience,
      portfolioLinks: portfolioLinks || '',
      previousManga: previousManga.trim(),
      genres: genres,
      motivation: motivation.trim(),
      sampleText: sampleText || '',
      status: 'pending',
      submittedAt: new Date().toISOString()
    }

    console.log('✅ New application received:', application)
    console.log('📧 Email:', email)
    console.log('👤 Name:', fullName)

    // Muvaffaqiyatli javob qaytarish
    return NextResponse.json(
      { 
        success: true, 
        message: 'Arizangiz muvaffaqiyatli yuborildi!',
        applicationId: application.id
      },
      { status: 201 }
    )
    
  } catch (error: any) {
    console.error('❌ Server error:', error)
    return NextResponse.json(
      { success: false, error: 'Serverda xatolik yuz berdi. Keyinroq urinib ko\'ring.' },
      { status: 500 }
    )
  }
}