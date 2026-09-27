import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Landing page photography is served from Unsplash.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
