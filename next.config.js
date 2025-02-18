/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        pathname: '**'
      }
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
