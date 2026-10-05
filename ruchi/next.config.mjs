/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/Login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/Privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terms-and-conditions',
        permanent: true,
      },
      {
        source: '/Terms',
        destination: '/terms-and-conditions',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;