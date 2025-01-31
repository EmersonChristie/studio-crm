/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ],
    domains: [
      'picsum.photos',
      'loremflickr.com',
      'placehold.co',
      'placeholder.com',
      'dummyimage.com'
      // Add other domains you'll use for images here
      // For example: 'your-storage-bucket.s3.amazonaws.com',
      // 'your-cdn.com',
      // etc.
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
