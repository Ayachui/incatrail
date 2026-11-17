const CAMPO_API_ORIGIN = (
  process.env.CAMPO_API_ORIGIN || "https://www.tzunki.com"
).replace(/\/$/, "");

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
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/life", destination: "/life/index.html" },
      { source: "/life/", destination: "/life/index.html" },
      { source: "/pastacalc", destination: "/pastacalc/index.html" },
      { source: "/pastacalc/", destination: "/pastacalc/index.html" },
      {
        source: "/api/campo/batch/:path*",
        destination: `${CAMPO_API_ORIGIN}/api/campo/batch/:path*`,
      },
      {
        source: "/api/campo/entities",
        destination: `${CAMPO_API_ORIGIN}/api/campo/entities`,
      },
      {
        source: "/api/campo/entity-lots",
        destination: `${CAMPO_API_ORIGIN}/api/campo/entity-lots`,
      },
      {
        source: "/api/itf/:path*",
        destination: `${CAMPO_API_ORIGIN}/api/itf/:path*`,
      },
      {
        source: "/api/ecosystem/:path*",
        destination: `${CAMPO_API_ORIGIN}/api/ecosystem/:path*`,
      },
      {
        source: "/api/oropurpura/:path*",
        destination: `${CAMPO_API_ORIGIN}/api/oropurpura/:path*`,
      },
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
      { source: "/pastacalc", headers: noIndex },
      { source: "/pastacalc/:path*", headers: noIndex },
    ];
  },
};

export default nextConfig;
