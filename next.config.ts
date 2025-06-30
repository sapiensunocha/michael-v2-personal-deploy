import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Removed 'appDir' to avoid warnings in newer Next.js versions.
  } as any,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dlf1ffdww/video/upload/**",
      },
    ],
    unoptimized: true, // Disable image optimization to avoid sharp issues
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
        "@": require("path").join(__dirname, "src"),
      };
    }
    return config;
  },
};

module.exports = nextConfig;