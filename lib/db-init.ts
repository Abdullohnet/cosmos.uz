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

    // Create real admin account (saidabbos027@gmail.com / cosmos1226)
    // Password hash for 'cosmos1226'
    await client.query(`
      INSERT INTO users (username, email, password_hash, role, subscription, level, xp, xp_to_next_level, diamonds, avatar, bio)
      VALUES (
        'Admin_MangaUZ',
        'saidabbos027@gmail.com',
        '$2b$12$G2mKP3cuU/OSgdLmv6ZOk.kuyfTRuW6S8b1X8TblWMbpcQcT6HVTC',
        'admin',
        'proplus',
        99,
        9999,
        10000,
        99999,
        'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminMangaUZ',
        'MangaUZ platformasining bosh administratori.'
      )
      ON CONFLICT (email) DO UPDATE SET
        role = 'admin',
        subscription = 'proplus',
        password_hash = '$2b$12$G2mKP3cuU/OSgdLmv6ZOk.kuyfTRuW6S8b1X8TblWMbpcQcT6HVTC',
        updated_at = NOW();
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
