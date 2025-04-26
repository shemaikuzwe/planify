import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    ppr: true,
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
