/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
  allowedDevOrigins: [
    '*.replit.dev',
    '*.sisko.replit.dev',
    process.env.REPLIT_DEV_DOMAIN,
  ].filter(Boolean),
}

export default nextConfig
