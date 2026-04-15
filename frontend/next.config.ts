import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// In production (Firebase App Hosting), backend is on the same host under /_/backend
// In development, proxy to the local backend server
const backendUrl = isProd ? '/_/backend' : 'http://localhost:5000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
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
