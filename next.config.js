const withTM = require('next-transpile-modules')([
  // 'unified',
  // 'unist-util-visit',
  // 'unist-util-map',
  // 'bail',
  // 'is-plain-obj',
  // 'trough',
]);

const withBundleAnalyzer = (
  ({ enabled = true } = {}) =>
  (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        if (enabled && !options.isServer) {
          const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: './analyze/client.html',
              excludeAssets: /polyfills-.*\.js/,
              defaultSizes: 'gzip',
            }),
          );
        }

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }
        return config;
      },
    });
  }
)({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type import('next/dist/server/config-shared').NextConfig
 */
const config = withBundleAnalyzer({
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
});

config.excludeDefaultMomentLocales = true;
config.experimental = config.experimental || {};
config.optimizeFonts = true;
config.webpack5 = true;
config.httpAgentOptions = { keepAlive: true };
config.reactStrictMode = true;
config.compress = true;
config.productionBrowserSourceMaps = true;
config.generateEtags = true;
config.poweredByHeader = false;

// config.experimental.optimizeCss = true;
config.experimental.optimizeImages = true;
config.experimental.workerThreads = true;
config.experimental.scrollRestoration = true;
config.experimental.esmExternals = true;
config.experimental.gzipSize = true;
// config.experimental.swcMinify = true;
// config.experimental.swcLoader = true;
// config.experimental.concurrentFeatures = true;

const origin = process.env.NEXT_PUBLIC_HOST || process.env.NEXT_PUBLIC_VERCEL_URL || 'typeofweb.com';
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
const host = `${protocol}://${origin}`;

config.headers = () => {
  return Promise.resolve([
    {
      source: '/(.*)',
      has: [
        {
          type: 'host',
          value: host,
        },
      ],
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: host,
        },
      ],
    },
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Expect-CT',
          value: `max-age=0, report-uri="https://typeofweb.report-uri.com/r/d/ct/reportOnly"`,
        },
      ],
    },
  ]);
};

module.exports = config;
