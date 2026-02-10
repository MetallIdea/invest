import type { NextConfig } from "next";

const nextConfig: NextConfig & {
  experimental: {
    instrumentationHook: boolean;
  };
} = {
  /* config options here */
  basePath: process.env.BASE_PATH,
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
