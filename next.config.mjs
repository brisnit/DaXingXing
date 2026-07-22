/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Mock/demo data is used throughout the MVP; remote render placeholders
  // are generated via inline SVG so no external image hosts are required.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
