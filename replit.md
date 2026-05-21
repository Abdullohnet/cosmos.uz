# MangaUZ — Manhwa o'qish platformasi

## Loyiha haqida
MangaUZ — o'zbek tilida manhwa/manga o'qish uchun to'liq funksional veb-platforma. Real foydalanuvchilar ro'yxatdan o'tib, tarjimonlar manhwa yuklab, oddiy o'quvchilar esa barcha kontentni bepul ko'rishi mumkin.

## Texnologiyalar
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Replit built-in)
- **Auth**: JWT + bcryptjs
- **UI**: Tailwind CSS + Shadcn UI + Framer Motion
- **State**: Zustand

## Asosiy funksiyalar

### Foydalanuvchilar uchun
- Ro'yxatdan o'tish / kirish (email + parol)
- Manhwa o'qish (vertikal, gorizontal, webtoon rejimlar)
- Kitobxona (bookmark)
- Reyting va reytinglar
- Profil va statistika

### Tarjimonlar uchun
- Tarjimon sifatida ariza topshirish (/apply)
- Manga/manhwa yaratish
- Boblar yuklash (rasm URL yoki fayl)
- Daromad statistikasi

### Admin uchun
- Foydalanuvchilarni boshqarish
- Tarjimon arizalarini tasdiqlash/rad etish
- Sayt statistikasi

## Demo akkauntlar
- **Admin**: admin@mangauz.com / admin123
- **Tarjimon**: translator@mangauz.com / demo1234
- **Foydalanuvchi**: fan@mangauz.com / demo1234

## Muhim fayllar
- `lib/db.ts` — PostgreSQL ulanish
- `lib/auth.ts` — JWT autentifikatsiya
- `lib/api.ts` — Client-side API funksiyalar
- `app/api/` — Server API route'lari
- `app/translator/page.tsx` — Tarjimon paneli
- `app/admin/page.tsx` — Admin paneli

## Foydalanuvchi preferences
- Interfeys o'zbek tilida
- Dark mode asosiy tema
- Mobilga moslashgan dizayn
