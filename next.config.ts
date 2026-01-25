import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  
  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  
  // Optimize package imports
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', '@react-three/fiber'],
  },
};

export default nextConfig;
