/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/Login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;