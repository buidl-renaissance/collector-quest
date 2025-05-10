import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ['inngest'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        async_hooks: false,
      };
    }

    // Handle node: protocol imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:async_hooks': false,
      'node:events': false,
      'node:stream': false,
      'node:util': false,
    };

    return config;
  },
};

export default nextConfig;
