/** @type {import('next').NextConfig} */
// Temporarily disable withPWA to test Turbopack compatibility
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
// });

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Other experimental flags can go here if needed, but not 'turbo' as a boolean.
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dlf1ffdww/video/upload/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/disaster-service/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "/api/disaster-service/:path*" // Use local API route in development
            : "https://disaster-data-tracker-1044744936985.us-central1.run.app/:path*", // External API in production
      },
    ];
  },
};

// module.exports = withPWA(nextConfig); // Temporarily comment this out
module.exports = nextConfig; // Use nextConfig directly