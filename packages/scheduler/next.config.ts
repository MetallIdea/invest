import type { NextConfig } from "next";

const nextConfig: NextConfig & {
  experimental: {
    instrumentationHook: boolean;
  };
} = {
  /* config options here */
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
