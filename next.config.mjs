/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ['@storefront-ui/react'],
  images: {
    domains: [
      'assets.qa.amalcloud.net',
      'fakestoreapi.com',
      'images.unsplash.com',
      'un4shop.com'
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "un4software.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.qa.amalcloud.net",
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "f.nooncdn.com",
      },
    ],
  },
};

export default nextConfig;
