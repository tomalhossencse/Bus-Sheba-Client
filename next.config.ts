import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_API_URL || "https://bus-sheba.vercel.app/api/v1";

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "i.ibb.co.com" },
      { hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
