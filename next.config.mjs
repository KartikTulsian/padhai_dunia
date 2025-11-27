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
        // Retain the existing configuration
        hostname: "images.pexels.com" 
      },
    ],
  },
};

export default nextConfig;