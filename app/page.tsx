'use client'

import { useState } from 'react'
import { Sparkles, Zap, Brain, Image as ImageIcon, Send } from 'lucide-react'
import WishInput from './components/WishInput'
import ResultDisplay from './components/ResultDisplay'

export default function BestWishPage() {
  const [wish, setWish] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    logicFlaws: string
    crashImplementation: string
    generatedImage: string
  } | null>(null)

  const handleWishSubmit = async (wishText: string) => {
    setWish(wishText)
    setIsAnalyzing(true)
    
    // 模拟 AI 分析过程
    setTimeout(() => {
      setResult({
        logicFlaws: `你的愿望"${wishText}"存在以下逻辑漏洞：\n\n1. 时间悖论：如果愿望涉及改变过去，可能导致因果循环\n2. 范围模糊：愿望的具体实现边界不明确\n3. 副作用忽略：未考虑愿望实现后的连锁反应`,
        crashImplementation: `崩坏实现方案：\n\n• 扭曲现实法则，强制执行愿望逻辑\n• 忽略物理定律约束，直接修改世界状态\n• 使用量子纠缠技术，同步多维度实现\n• 激活时空裂缝，从平行宇宙获取资源`,
        generatedImage: '/api/placeholder/400/300'
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 背景粒子效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* 主标题 */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-6xl font-bold text-cyber-gradient mb-4 animate-glow">
          BestWish
        </h1>
        <p className="text-xl text-gray-300 mb-2">赛博许愿机</p>
        <p className="text-sm text-gray-500">探索你愿望背后的逻辑漏洞</p>
        
        {/* 装饰性图标 */}
        <div className="flex justify-center space-x-4 mt-6">
          <Sparkles className="w-6 h-6 text-cyber-blue animate-pulse" />
          <Zap className="w-6 h-6 text-cyber-purple animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Brain className="w-6 h-6 text-cyber-pink animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* 许愿输入区域 */}
      <WishInput 
        onSubmit={handleWishSubmit}
        isAnalyzing={isAnalyzing}
      />

      {/* 结果展示区域 */}
      {(result || isAnalyzing) && (
        <ResultDisplay 
          result={result}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* 底部装饰 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}