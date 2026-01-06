'use client'

import { useState, useEffect } from 'react'
import { Loader2, Circle } from 'lucide-react'

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
          text="正在审查愿望契约..." 
          active={currentStep >= 0} 
        />
        <StepItem 
          icon={currentStep >= 1 ? <Loader2 className="w-4 h-4 animate-spin"/> : <Circle className="w-4 h-4 text-gray-300"/>} 
          text="正在寻找逻辑漏洞..." 
          active={currentStep >= 1} 
        />
        <StepItem 
          icon={currentStep >= 2 ? <Loader2 className="w-4 h-4 animate-spin"/> : <Circle className="w-4 h-4 text-gray-300"/>} 
          text="正在构建讽刺现实..." 
          active={currentStep >= 2} 
        />
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* 2. 档案卡片文字结果 */}
      <div className="bg-[#fdfaf5] border border-[#e0dad0] shadow-md relative overflow-hidden rounded-sm">
        <div className="h-2 w-full bg-repeating-warning"></div> {/* 红黑条纹见CSS */}
        
        <div className="p-8 md:p-12 space-y-8">
          <div className="text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">原定愿望</span>
            <h2 className="text-2xl font-bold mt-4 font-serif italic text-[#2d2a32]">
              「 {result.wishText || "未定义愿望"} 」
            </h2>
          </div>

          <div className="border-t border-dashed border-gray-300 relative my-8">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#fdfaf5] px-4 text-[10px] text-gray-400">契约达成情况</span>
          </div>

          <div className="bg-white/50 border border-gray-100 p-6 relative">
            <h3 className="text-red-600 text-[10px] font-bold mb-4 uppercase">实现场景 (逻辑检查通过)</h3>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap font-serif">
              {result.crashImplementation}
            </p>
            {/* 印章效果 */}
            <div className="absolute bottom-2 right-6 opacity-40 rotate-[-15deg] border-4 border-double border-red-600 text-red-600 font-bold px-2 py-1 text-xl rounded">
              已达成
            </div>
          </div>
        </div>
      </div>

      {/* 3. 图片结果 (在下方展示) */}
      <div className="space-y-4">
        <div className="text-center text-[10px] text-gray-400 uppercase tracking-[0.3em]">视觉呈现 / VISUALIZATION</div>
        <div 
          className={`relative cursor-zoom-in transition-all duration-500 ease-in-out ${isZoomed ? 'fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center' : 'w-full'}`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img 
            src={result.generatedImage} 
            alt="Result" 
            className={`${isZoomed ? 'max-h-full max-w-full object-contain' : 'w-full rounded-sm shadow-lg border border-gray-200'}`}
          />
          {isZoomed && (
            <div className="absolute top-8 right-8 text-white text-sm">点击退出</div>
          )}
        </div>
      </div>

      <div className="flex justify-center pb-20">
        <button onClick={() => window.location.reload()} className="px-8 py-2 bg-[#2d2a32] text-white text-xs hover:bg-black">
          重新修正愿望 w
        </button>
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