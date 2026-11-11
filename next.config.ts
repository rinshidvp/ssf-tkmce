import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: false },
      { source: "/ml", destination: "/", permanent: false },
      { source: "/ar", destination: "/", permanent: false },
      { source: "/en/:path*", destination: "/:path*", permanent: false },
      { source: "/ml/:path*", destination: "/:path*", permanent: false },
      { source: "/ar/:path*", destination: "/:path*", permanent: false },
      { source: "/gallery", destination: "/memories", permanent: true },
    ];
  },
};

export default nextConfig;
