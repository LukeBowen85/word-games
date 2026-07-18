import type { NextConfig } from "next";

const repositoryName = "word-games";
const isProduction =
  process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  basePath: isProduction
    ? `/${repositoryName}`
    : "",

  assetPrefix: isProduction
    ? `/${repositoryName}/`
    : "",

  images: {
    unoptimized: true,
  },

  allowedDevOrigins: [
    "192.168.1.76",
  ],
};

export default nextConfig;