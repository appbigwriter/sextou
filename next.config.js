/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'puppeteer', 'whatsapp-web.js'],
  },
}

module.exports = nextConfig
