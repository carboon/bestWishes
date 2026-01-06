'use client'

import { useState } from 'react'
import WishInput from './components/WishInput'
import ResultDisplay from './components/ResultDisplay'

export default function BestWishPage() {
  // 基础状态
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    logicFlaws: string
    crashImplementation: string
    generatedImage: string
    wishText?: string
  } | null>(null)

  const handleWishSubmit = async (wishText: string) => {
    // 记录当前愿望，用于结果展示
    setIsAnalyzing(true)
    setResult(null) // 重置之前的结果
    
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

      // 更新结果状态，并附带原始愿望文本
      setResult({
        logicFlaws: data.logic_analysis,
        crashImplementation: data.ironic_fulfillment,
        generatedImage: data.image_url,
        wishText: wishText // 传递给 ResultDisplay 显示在卡片顶部
      })

    } catch (error) {
      console.error('许愿处理失败:', error)
      setResult({
        logicFlaws: '分析过程中出现错误，档案室暂时失联',
        crashImplementation: '契约生成失败，请核对网络连接后重试',
        generatedImage: '',
        wishText: wishText
      })
    } finally {
      // 停止加载状态
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f4f7f6] pt-20 pb-10 px-4">
      {/* 主标题区域 */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl font-bold text-[#2d2a32] mb-4 tracking-tight">
          愿望实现器
        </h1>
        <p className="text-lg text-gray-500 font-serif italic italic opacity-80">
          " 每个愿望都有其代价，你准备好了吗？ "
        </p>
      </div>

      {/* 动态展示区域：输入框 vs 结果展示 */}
      <div className="w-full max-w-6xl">
        {!result && !isAnalyzing ? (
          <div className="max-w-2xl mx-auto">
            <WishInput 
              onSubmit={handleWishSubmit}
              isAnalyzing={isAnalyzing}
            />
          </div>
        ) : (
          <ResultDisplay 
            result={result}
            isAnalyzing={isAnalyzing}
          />
        )}
      </div>

      {/* 底部装饰与免责声明（参照示例图） */}
      <footer className="mt-auto w-full max-w-2xl text-center space-y-4 pt-20">
        <div className="border-t border-dashed border-gray-300 w-full mb-8"></div>
        
        <p className="text-[11px] text-gray-400 font-serif italic leading-relaxed">
          每一个愿望背后都隐藏着不可预知的后果。本系统基于逻辑分析，不对结果承担责任。<br/>
          AI 引擎：Claude-3.5-Sonnet / GLM-4-Plus / Moonshot-v1
        </p>
        
        <div className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center justify-center space-x-2">
          <span>© 2026 愿望实现器</span>
          <span className="text-gray-300">|</span>
          <a href="https://github.com/carboon/bestWishes" className="underline hover:text-gray-600 transition-colors">GitHub Source</a>
        </div>
        
        <p className="text-[10px] text-gray-300 tracking-[0.5em] uppercase pb-8">
          BUYER BEWARE
        </p>
      </footer>
    </div>
  )
}