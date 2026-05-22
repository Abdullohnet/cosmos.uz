import { pool } from './db'

export async function initDatabase() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user','translator','admin')),
        subscription VARCHAR(20) DEFAULT 'free' CHECK (subscription IN ('free','standard','pro','proplus')),
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        xp_to_next_level INTEGER DEFAULT 100,
        diamonds INTEGER DEFAULT 0,
        avatar TEXT,
        bio TEXT,
        followers INTEGER DEFAULT 0,
        following INTEGER DEFAULT 0,
        chapters_read INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        manga_completed INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS manga (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        cover TEXT,
        description TEXT,
        author VARCHAR(100),
        artist VARCHAR(100),
        status VARCHAR(20) DEFAULT 'ongoing' CHECK (status IN ('ongoing','completed','hiatus')),
        type VARCHAR(20) DEFAULT 'manhwa' CHECK (type IN ('manga','manhwa','manhua')),
        rating NUMERIC(3,2) DEFAULT 0,
        views INTEGER DEFAULT 0,
        bookmarks INTEGER DEFAULT 0,
        chapters_count INTEGER DEFAULT 0,
        is_premium BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        translator_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS manga_genres (
        manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
        genre VARCHAR(50),
        PRIMARY KEY (manga_id, genre)
      );

      CREATE TABLE IF NOT EXISTS chapters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
        number NUMERIC(6,1) NOT NULL,
        title VARCHAR(255),
        is_premium BOOLEAN DEFAULT false,
        views INTEGER DEFAULT 0,
        published_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(manga_id, number)
      );

      CREATE TABLE IF NOT EXISTS chapter_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
        page_number INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        UNIQUE(chapter_id, page_number)
      );

      CREATE TABLE IF NOT EXISTS bookmarks (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (user_id, manga_id)
      );

      CREATE TABLE IF NOT EXISTS ratings (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
        score INTEGER CHECK (score BETWEEN 1 AND 5),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (user_id, manga_id)
      );

      CREATE TABLE IF NOT EXISTS reading_progress (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
        chapter_number NUMERIC(6,1) NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (user_id, manga_id)
      );

      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS comment_likes (
        comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (comment_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(30) DEFAULT 'system',
        title VARCHAR(255) NOT NULL,
        message TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS translator_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(30),
        telegram VARCHAR(100),
        languages TEXT,
        experience TEXT,
        portfolio_links TEXT,
        previous_manga TEXT,
        genres TEXT,
        motivation TEXT,
        sample_text TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ,
        review_note TEXT
      );

      CREATE TABLE IF NOT EXISTS diamond_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        type VARCHAR(30) NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    // Seed demo users
    await client.query(`
      INSERT INTO users (id, username, email, password_hash, role, subscription, level, xp, xp_to_next_level, diamonds, avatar, bio, followers, following, chapters_read, time_spent, manga_completed)
      VALUES
        ('00000000-0000-0000-0000-000000000001', 'Admin_MangaUZ', 'admin@mangauz.com',
         '$2b$12$Ssr25UKZh9OVdtN77ozgdeIfFANZquTKu6iUyte0RSp3SQ5IfqNKq',
         'admin', 'proplus', 99, 9999, 10000, 99999,
         'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', 'Manga UZ platformasining bosh administratori.',
         50000, 10, 10000, 500000, 500),
        ('00000000-0000-0000-0000-000000000002', 'TeamSL_Translator', 'translator@mangauz.com',
         '$2b$12$BHjdAYJZ4JeK2DrfToZrtevKg7glfEwVb/sMk5Hg.gxaGV1aLDTD6',
         'translator', 'proplus', 45, 4200, 5000, 8500,
         'https://api.dicebear.com/7.x/avataaars/svg?seed=Translator', 'O''zbek manga platformasining top tarjimoni.',
         12500, 45, 5200, 120000, 234),
        ('00000000-0000-0000-0000-000000000003', 'MangaFan2024', 'fan@mangauz.com',
         '$2b$12$BHjdAYJZ4JeK2DrfToZrtevKg7glfEwVb/sMk5Hg.gxaGV1aLDTD6',
         'user', 'pro', 24, 2450, 3000, 1250,
         'https://api.dicebear.com/7.x/avataaars/svg?seed=Fan', 'Avid manga reader and collector.',
         156, 89, 1847, 45600, 78)
      ON CONFLICT (email) DO NOTHING;
    `)

    // Seed manga
    await client.query(`
      INSERT INTO manga (id, title, cover, description, author, artist, status, type, rating, views, bookmarks, chapters_count, is_featured, translator_id)
      VALUES
        ('10000000-0000-0000-0000-000000000001', 'Solo Leveling',
         'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=300&h=400&fit=crop',
         'In a world where hunters must battle deadly monsters to protect humanity, Sung Jin-Woo is the weakest of all hunters.',
         'Chugong', 'Dubu', 'completed', 'manhwa', 4.9, 15000000, 890000, 179, true,
         '00000000-0000-0000-0000-000000000002'),
        ('10000000-0000-0000-0000-000000000002', 'Omniscient Reader',
         'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300&h=400&fit=crop',
         'Kim Dokja was an average office worker whose sole interest was reading his favorite web novel.',
         'Sing Shong', 'Sleepy-C', 'ongoing', 'manhwa', 4.8, 12000000, 750000, 165, true,
         '00000000-0000-0000-0000-000000000002'),
        ('10000000-0000-0000-0000-000000000003', 'Tower of God',
         'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&fit=crop',
         'What do you desire? Fortune? Glory? Power? Revenge? Everything is at the top of the Tower.',
         'SIU', 'SIU', 'ongoing', 'manhwa', 4.7, 20000000, 1200000, 580, false,
         '00000000-0000-0000-0000-000000000002'),
        ('10000000-0000-0000-0000-000000000004', 'The Beginning After The End',
         'https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?w=300&h=400&fit=crop',
         'King Grey has unrivaled strength and prestige in a world governed by martial ability.',
         'TurtleMe', 'Fuyuki23', 'ongoing', 'manhwa', 4.9, 18000000, 950000, 190, true,
         '00000000-0000-0000-0000-000000000002'),
        ('10000000-0000-0000-0000-000000000005', 'Demon Slayer',
         'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=400&fit=crop',
         'Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
         'Koyoharu Gotouge', 'Koyoharu Gotouge', 'completed', 'manga', 4.8, 25000000, 1500000, 205, false,
         '00000000-0000-0000-0000-000000000002'),
        ('10000000-0000-0000-0000-000000000006', 'Jujutsu Kaisen',
         'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=300&h=400&fit=crop',
         'Yuji Itadori joins a secret organization of Jujutsu Sorcerers to eliminate a powerful Curse.',
         'Gege Akutami', 'Gege Akutami', 'ongoing', 'manga', 4.7, 22000000, 1300000, 250, false,
         '00000000-0000-0000-0000-000000000002')
      ON CONFLICT DO NOTHING;
    `)

    // Seed manga genres
    await client.query(`
      INSERT INTO manga_genres (manga_id, genre) VALUES
        ('10000000-0000-0000-0000-000000000001', 'Action'),
        ('10000000-0000-0000-0000-000000000001', 'Fantasy'),
        ('10000000-0000-0000-0000-000000000001', 'Adventure'),
        ('10000000-0000-0000-0000-000000000002', 'Action'),
        ('10000000-0000-0000-0000-000000000002', 'Fantasy'),
        ('10000000-0000-0000-0000-000000000002', 'Drama'),
        ('10000000-0000-0000-0000-000000000003', 'Action'),
        ('10000000-0000-0000-0000-000000000003', 'Adventure'),
        ('10000000-0000-0000-0000-000000000003', 'Mystery'),
        ('10000000-0000-0000-0000-000000000004', 'Action'),
        ('10000000-0000-0000-0000-000000000004', 'Fantasy'),
        ('10000000-0000-0000-0000-000000000004', 'Romance'),
        ('10000000-0000-0000-0000-000000000005', 'Action'),
        ('10000000-0000-0000-0000-000000000005', 'Supernatural'),
        ('10000000-0000-0000-0000-000000000005', 'Drama'),
        ('10000000-0000-0000-0000-000000000006', 'Action'),
        ('10000000-0000-0000-0000-000000000006', 'Supernatural'),
        ('10000000-0000-0000-0000-000000000006', 'School')
      ON CONFLICT DO NOTHING;
    `)

    // Seed chapters for Solo Leveling (sample 5 chapters)
    await client.query(`
      INSERT INTO chapters (id, manga_id, number, title, is_premium, views)
      VALUES
        ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1, '1-bob: Dungeons paydo bo''ladi', false, 500000),
        ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 2, '2-bob: Zaif ovchi', false, 450000),
        ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 3, '3-bob: Tizim', false, 420000),
        ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 4, '4-bob: Ovchi sinflar', false, 400000),
        ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 5, '5-bob: Birinchi vazifa', false, 380000)
      ON CONFLICT DO NOTHING;
    `)

    // Seed chapter pages for chapter 1 (Solo Leveling)
    await client.query(`
      INSERT INTO chapter_pages (chapter_id, page_number, image_url)
      VALUES
        ('20000000-0000-0000-0000-000000000001', 1, 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800&h=1200&fit=crop'),
        ('20000000-0000-0000-0000-000000000001', 2, 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=1200&fit=crop'),
        ('20000000-0000-0000-0000-000000000001', 3, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=1200&fit=crop'),
        ('20000000-0000-0000-0000-000000000001', 4, 'https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?w=800&h=1200&fit=crop'),
        ('20000000-0000-0000-0000-000000000001', 5, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=1200&fit=crop'),
        ('20000000-0000-0000-0000-000000000001', 6, 'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=800&h=1200&fit=crop'),
        ('20000000-0000-0000-0000-000000000001', 7, 'https://images.unsplash.com/photo-1624213111452-35e8d3d5cc18?w=800&h=1200&fit=crop'),
        ('20000000-0000-0000-0000-000000000001', 8, 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=1200&fit=crop')
      ON CONFLICT DO NOTHING;
    `)

    // Seed sample comments
    await client.query(`
      INSERT INTO comments (manga_id, user_id, content, likes_count)
      VALUES
        ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003',
         'Bu manga juda zo''r! Har bir bob yangi hayajon olib keladi 🔥', 42),
        ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
         'Tarjimon ajoyib ish qilmoqda, sifat zo''r 👏', 28),
        ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003',
         'Omniscient Reader eng yaxshi manhwa! 🌟', 35)
      ON CONFLICT DO NOTHING;
    `)

    console.log('✅ Database initialized successfully')
    return true
  } catch (err) {
    console.error('❌ DB init error:', err)
    throw err
  } finally {
    client.release()
  }
}
