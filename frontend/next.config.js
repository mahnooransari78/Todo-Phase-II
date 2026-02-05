/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true, // Updated from experimental.typedRoutes
  images: {
    unoptimized: true,
  },
  // Removed swcMinify as it's not a valid option in this version
  // Removed output as 'server' is not valid, using default
};

module.exports = nextConfig;
