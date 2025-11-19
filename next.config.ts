import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/100nin-isssyu' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/100nin-isssyu/' : '',
};

export default nextConfig;
