import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// Priority: NEXT_PUBLIC_API_URL (set in Vercel/hosting env vars)
// Fallback: /_/backend (Firebase App Hosting), then localhost:5000 (dev)
const backendUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (isProd ? '/_/backend' : 'http://localhost:5000');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: 'ibb.co' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'http', hostname: 'localhost' }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/productimages/:path*',
        destination: `${backendUrl}/productimages/:path*`,
      },
    ];
  },
};

export default nextConfig;
