/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Avoid corrupt / stale webpack filesystem cache on Windows after route refactors
  // (ENOENT for .next/server/app/page.js, missing vendor-chunks, white screen in dev).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/life", destination: "/life/index.html" },
      { source: "/life/", destination: "/life/index.html" },
    ];
  },
  async headers() {
    const noIndex = [
      {
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive, nosnippet",
      },
    ];
    return [
      { source: "/life", headers: noIndex },
      { source: "/life/:path*", headers: noIndex },
    ];
  },
};

export default nextConfig;
