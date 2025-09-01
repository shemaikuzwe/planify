import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental:{
   ppr:true,
   useCache: true,
   reactCompiler:true
  }
};

export default nextConfig;
