/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // En Vercel no necesitás esto, pero no rompe nada:
  images: { unoptimized: true },
};
export default nextConfig;
