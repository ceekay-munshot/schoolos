import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static UI/UX mock — export to `out/` so it deploys to any static host
  // (Cloudflare Pages, etc.) with no server runtime.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
