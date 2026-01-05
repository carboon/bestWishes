import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BestWish - 赛博许愿机',
  description: '一个神秘的许愿机，探索你愿望背后的逻辑漏洞',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="matrix-bg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}