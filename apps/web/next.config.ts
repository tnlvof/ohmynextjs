import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@ohmynextjs/core',
    '@ohmynextjs/db',
    '@ohmynextjs/auth',
    '@ohmynextjs/payment',
    '@ohmynextjs/admin',
  ],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
