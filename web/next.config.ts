import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pizza-ui.keisoft.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dodostatic.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.dodostatic.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.dodostatic.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
