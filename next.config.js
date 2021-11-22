module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
          // by next.js will be dropped. Doesn't make much sense, but how it is
        fs: false, // the solution
      };
  
      return config;
    }

    return config
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'strict-transport-security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'x-dns-prefetch-control',
            value: 'on',
          },
          {
            key: 'x-xss-protection',
            value: '1; mode=block',
          },
          {
            key: 'x-permitted-cross-domain-policies',
            value: 'none',
          },
          {
            key: 'x-frame-options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'x-download-options',
            value: 'noopen',
          },
          {
            key: 'x-content-type-options',
            value: 'nosniff',
          },
          {
            key: 'referrer-policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  }
}
