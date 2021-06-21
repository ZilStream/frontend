module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
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
      {
        source: '/:path*',
        headers: [
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
      }
    ]
  }
}
