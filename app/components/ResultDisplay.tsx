'use client'

import { useState, useEffect } from 'react'
import { Loader2, Circle } from 'lucide-react'
import MagicLampButton from './MagicLampButton'

interface ResultDisplayProps {
  result: { logicFlaws: string; crashImplementation: string; generatedImage: string; wishText?: string } | null
  isAnalyzing: boolean
}

export default function ResultDisplay({ result, isAnalyzing }: ResultDisplayProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // 动态步骤进度效果
  useEffect(() => {
    if (isAnalyzing) {
      setCurrentStep(0)
      const timer1 = setTimeout(() => setCurrentStep(1), 1000)
      const timer2 = setTimeout(() => setCurrentStep(2), 2500)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [isAnalyzing])

  // 1. 加载中的“三步走”逻辑
  if (isAnalyzing) {
    return (
      <div className="w-full max-w-md mx-auto space-y-8 py-12">
        <StepItem 
          icon={currentStep >= 0 ? <Loader2 className="w-4 h-4 animate-spin"/> : <Circle className="w-4 h-4 text-gray-300"/>} 
          text="正在分析愿望内容..." 
          active={currentStep >= 0} 
        />
        <StepItem 
          icon={currentStep >= 1 ? <Loader2 className="w-4 h-4 animate-spin"/> : <Circle className="w-4 h-4 text-gray-300"/>} 
          text="正在评估实现方案..." 
          active={currentStep >= 1} 
        />
        <StepItem 
          icon={currentStep >= 2 ? <Loader2 className="w-4 h-4 animate-spin"/> : <Circle className="w-4 h-4 text-gray-300"/>} 
          text="正在生成结果报告..." 
          active={currentStep >= 2} 
        />
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* 2. 档案卡片 - 文字和图片并排布局 */}
      <div className="bg-[#fdfaf5] border border-[#e0dad0] shadow-md relative overflow-hidden rounded-sm">
        <div className="h-2 w-full bg-repeating-warning"></div> {/* 红黑条纹见CSS */}
        
        <div className="p-8 md:p-12 space-y-8">
          <div className="text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">愿望内容</span>
            <h2 className="text-2xl font-bold mt-4 font-serif italic text-[#2d2a32]">
              「 {result.wishText || "未知愿望"} 」
            </h2>
          </div>

          <div className="border-t border-dashed border-gray-300 relative my-8">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#fdfaf5] px-4 text-[10px] text-gray-400">实现结果</span>
          </div>

          {/* 文字和图片并排布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* 左侧：文字内容 */}
            <div className="bg-white/50 border border-gray-100 p-4 lg:p-6 relative order-2 lg:order-1">
              <h3 className="text-blue-600 text-[10px] font-bold mb-4 uppercase">愿望实现方案</h3>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap font-serif">
                {result.crashImplementation}
              </p>
              {/* 印章效果 */}
              <div className="absolute bottom-2 right-4 lg:right-6 opacity-40 rotate-[-15deg] border-4 border-double border-blue-600 text-blue-600 font-bold px-2 py-1 text-lg lg:text-xl rounded">
                已处理
              </div>
            </div>

            {/* 右侧：图片内容 */}
            <div className="space-y-4 order-1 lg:order-2">
              <div className="text-center text-[10px] text-gray-400 uppercase tracking-[0.3em]">视觉呈现 / VISUALIZATION</div>
              <div 
                className={`relative cursor-zoom-in transition-all duration-500 ease-in-out ${isZoomed ? 'fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center' : 'w-full'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {result.generatedImage ? (
                  <img 
                    src={result.generatedImage} 
                    alt="Result" 
                    className={`${isZoomed ? 'max-h-full max-w-full object-contain' : 'w-full rounded-sm shadow-lg border border-gray-200'}`}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center">
                    <span className="text-gray-400 text-sm">图像生成失败</span>
                  </div>
                )}
                {isZoomed && (
                  <div className="absolute top-8 right-8 text-white text-sm">点击退出</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 重新许愿按钮 - 使用魔法神灯组件 */}
      <div className="flex justify-center pb-20">
        <MagicLampButton onClick={() => window.location.reload()}>
          重新许愿
        </MagicLampButton>
      </div>
    </div>
  )
}

function StepItem({ icon, text, active }: { icon: React.ReactNode, text: string, active: boolean }) {
  return (
    <div className={`flex items-center space-x-4 transition-opacity ${active ? 'opacity-100' : 'opacity-30'}`}>
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  )
}