/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Replace with your actual ImageKit URL endpoint host.
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "images.unsplash.com" }, // demo images only
    ],
  },
};

module.exports = nextConfig;
