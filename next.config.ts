import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 이미지 최적화 비활성화 (개발 중 이미지 에러 방지)
  },
};

export default nextConfig;