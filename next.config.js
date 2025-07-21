const { i18n } = require('./next-i18next.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable static generation for better performance
  output: 'standalone',

  // i18n configuration
  i18n,

  // Optimize images
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },

  // Enable compression and optimize builds
  compress: true,
  poweredByHeader: false,

  // Vercel-specific optimizations for TTFB
  generateEtags: false,

  // External packages to optimize
  serverExternalPackages: ['mongoose'],

  // Critical performance optimizations for TTFB
  experimental: {
    optimizePackageImports: ['three'],
    // Better memory management
    workerThreads: false,
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Split chunks for better loading
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          three: {
            test: /[\\/]node_modules[\\/]three[\\/]/,
            name: 'three',
            chunks: 'async',
            priority: 10,
          },
        },
      };
    }
    return config;
  },

  // Cache static assets
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },

  // Add redirects for better SEO and avoid processing
  async redirects() {
    return [
      // Add any redirects here to avoid server processing
    ]
  },

  // Configure rewrite for API optimization
  async rewrites() {
    return {
      // Runs BEFORE Next.js checks filesystem routes, so our proxy
      // wins over any `/proxy/*` pages or API routes.
      beforeFiles: [
        {
          source: '/proxy/:path*',
          destination: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/:path*`,
        },
      ],
    };
  }
}

module.exports = nextConfig
