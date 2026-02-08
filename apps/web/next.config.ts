import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ohmynextjs/core', '@ohmynextjs/db', '@ohmynextjs/auth'],
};

export default nextConfig;
