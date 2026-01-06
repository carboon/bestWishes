import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '愿望实现器 - 智能愿望分析平台',
  description: '基于AI的愿望分析系统，探索每个愿望背后的可能性与后果。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}