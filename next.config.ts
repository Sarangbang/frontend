import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
  unoptimized: true,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
    {
      protocol: 'https',
      hostname: 'ilsim-uploaded-files.s3.ap-northeast-2.amazonaws.com',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '8080', // 개발 환경 프록시 경로도 대응
    },
  ],
},
};

export default nextConfig;