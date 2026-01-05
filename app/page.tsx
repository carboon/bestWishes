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
    
    try {
      const response = await fetch('/api/wish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wish: wishText }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // 更新结果状态，映射 API 返回的字段到组件期望的字段
      setResult({
        logicFlaws: data.logic_analysis,
        crashImplementation: data.ironic_fulfillment,
        generatedImage: data.image_url
      })

    } catch (error) {
      console.error('许愿处理失败:', error)
      
      // 设置错误状态，显示友好的错误信息
      setResult({
        logicFlaws: '分析过程中出现错误，请稍后重试',
        crashImplementation: '实现方案生成失败，邪恶许愿机暂时离线',
        generatedImage: ''
      })
    } finally {
      setIsAnalyzing(false)
    }
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