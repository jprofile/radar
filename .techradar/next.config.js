const config = require("./data/config.json");
const basePath =
  config.basePath && config.basePath !== "/" ? config.basePath : "";

/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath,
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    unoptimized: true, // ← añado esto porque usamos export y no tenemos servidor
  },
};

module.exports = nextConfig;
