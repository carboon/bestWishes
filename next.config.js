/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router 在 Next.js 14 中已经是稳定功能，不需要 experimental.appDir
  
  // Cloudflare Pages 优化配置
  images: {
    unoptimized: true, // Cloudflare Pages 不支持 Next.js 图片优化
  },
  
  // 保持默认输出模式以支持 API 路由
}

module.exports = nextConfig