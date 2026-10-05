/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/Login',
      },
    ];
  },
};

export default nextConfig;