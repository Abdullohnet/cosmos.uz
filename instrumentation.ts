export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initDatabase } = await import('./lib/db-init')
    try {
      await initDatabase()
      console.log('✅ DB ready')
    } catch (e) {
      console.error('❌ DB init failed:', e)
    }
  }
}
