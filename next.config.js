/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'pic-school.vercel.app', // Vercel本番ドメイン
      'pic-school-git-main-yoshis-projects-421cbceb.vercel.app', // Vercelプレビュードメイン
      'supabase.co', // Supabase本番ドメイン
      'vimeo.com',
      'i.vimeocdn.com',
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'pic-school.vercel.app',
        'pic-school-git-main-yoshis-projects-421cbceb.vercel.app',
      ],
    },
  },
};

module.exports = nextConfig;
