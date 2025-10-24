import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    middlewarePrefetch: 'flexible'
  }
}

export default nextConfig

