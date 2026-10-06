/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/Login',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;