/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // The protocol used by the placeholder service
        hostname: 'via.placeholder.com', // <-- ADD THIS DOMAIN
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "media.example.com", // ✅ your actual image host
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // if you also use pexels images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
};

export default nextConfig;