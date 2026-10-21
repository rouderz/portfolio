import type { NextConfig } from "next";

// BASE_PATH and SITE_URL are set by the deploy workflow (see README).
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
