import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "favmemory.s3.sa-east-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
