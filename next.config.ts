import type { NextConfig } from "next";
import type { Configuration } from "webpack";
import path from "path"; // Needed for alias path resolution

// Optional: PWA support (disabled for now)
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
// });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  } as any,

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
            ? "/api/disaster-service/:path*"
            : "https://disaster-data-tracker-1044744936985.us-central1.run.app/:path*",
      },
    ];
  },

  webpack(config: Configuration, { isServer }: { isServer: boolean }) {
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@": path.join(__dirname, "src"),
      };
    }
    return config;
  },
};

// module.exports = withPWA(nextConfig);
module.exports = nextConfig;