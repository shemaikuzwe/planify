import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  cacheOnNavigation: process.env.NODE_ENV === "production",
  disable: process.env.NODE_ENV === "development",
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/app", revision }],
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
// export default withSerwist(nextConfig);

export default nextConfig;
