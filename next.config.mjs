/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
