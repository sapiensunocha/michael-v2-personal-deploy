import type { NextConfig } from "next"; // Changed single quotes to double quotes
import type { Configuration } from "webpack"; // Changed single quotes to double quotes
// If you encounter "Cannot find module 'webpack' or its corresponding type declarations" (TS2307),
// you might need to install webpack and its types: yarn add -D webpack @types/webpack

// Temporarily disable withPWA to test Turbopack compatibility
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
// });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Other experimental flags can go here if needed, but not 'turbo' as a boolean.
    // Assuming you are using the app directory, keep this if relevant:
    // Casting to 'any' to resolve 'appDir' property error (TS2353),
    // potentially due to Next.js version differences in type definitions.
    appDir: true,
  } as any, // Explicitly cast to 'any' to bypass 'appDir' type error
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
  // ADDED WEBPACK CONFIGURATION FOR PATH ALIASES
  // Corrected TypeScript implicit 'any' type errors by explicitly typing parameters
  webpack(config: Configuration, { isServer }: { isServer: boolean }) {
    // No need for 'typedConfig' cast anymore as 'config' is now typed directly.
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@": require("path").join(__dirname, "src"),
      };
    }
    return config; // Return the typed config
  },
};

// module.exports = withPWA(nextConfig); // Temporarily comment this out
module.exports = nextConfig; // Use nextConfig directly
