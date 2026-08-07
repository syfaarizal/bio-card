import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing CDN
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh", // UploadThing file URLs
      },
      {
        protocol: "https",
        hostname: "i.scdn.co", // Spotify album art
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co", // Spotify mosaic art
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com", // Spotify album art CDN
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
}

export default nextConfig
