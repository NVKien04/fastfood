import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pizza-ui.keisoft.vn',
        port: '',
        pathname: '/api/images/**',
      },
    ],
  },
};

export default nextConfig;
