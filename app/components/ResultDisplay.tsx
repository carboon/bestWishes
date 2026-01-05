'use client'

import { Brain, Zap, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ResultDisplayProps {
  result: {
    logicFlaws: string
    crashImplementation: string
    generatedImage: string
  } | null
  isAnalyzing: boolean
}

export default function ResultDisplay({ result, isAnalyzing }: ResultDisplayProps) {
  if (isAnalyzing) {
    return (
      <div className="w-full max-w-6xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 分析中的占位卡片 */}
          {[
            { icon: Brain, title: '逻辑漏洞分析', color: 'cyber-blue' },
            { icon: Zap, title: '崩坏实现描述', color: 'cyber-purple' },
            { icon: ImageIcon, title: '生成图片', color: 'cyber-pink' }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg blur opacity-25"></div>
              <div className="relative bg-dark-card border border-gray-700 rounded-lg p-6 h-80">
                <div className="flex items-center space-x-3 mb-4">
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                
                <div className="flex flex-col items-center justify-center h-48">
                  <Loader2 className={`w-12 h-12 text-${item.color} animate-spin mb-4`} />
                  <p className="text-gray-400 text-center">AI 正在分析中...</p>
                  
                  {/* 加载动画点 */}
                  <div className="flex space-x-1 mt-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 bg-${item.color} rounded-full animate-pulse`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="w-full max-w-6xl mx-auto z-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 逻辑漏洞分析 */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-dark-card border border-gray-700 rounded-lg p-6 h-80 overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-cyber-blue" />
              <h3 className="text-lg font-semibold text-white">逻辑漏洞分析</h3>
            </div>
            
            <div className="text-gray-300 text-sm leading-relaxed overflow-y-auto h-48 custom-scrollbar">
              <pre className="whitespace-pre-wrap font-sans">{result.logicFlaws}</pre>
            </div>
            
            {/* 装饰性边框效果 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent"></div>
          </div>
        </div>

        {/* 崩坏实现描述 */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-purple to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-dark-card border border-gray-700 rounded-lg p-6 h-80 overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-6 h-6 text-cyber-purple" />
              <h3 className="text-lg font-semibold text-white">崩坏实现描述</h3>
            </div>
            
            <div className="text-gray-300 text-sm leading-relaxed overflow-y-auto h-48 custom-scrollbar">
              <pre className="whitespace-pre-wrap font-sans">{result.crashImplementation}</pre>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent"></div>
          </div>
        </div>

        {/* 生成图片 */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-pink to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-dark-card border border-gray-700 rounded-lg p-6 h-80 overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <ImageIcon className="w-6 h-6 text-cyber-pink" />
              <h3 className="text-lg font-semibold text-white">生成图片</h3>
            </div>
            
            <div className="flex items-center justify-center h-48 bg-gray-900 rounded-lg border border-gray-600">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-cyber-pink mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 text-sm">图片生成功能</p>
                <p className="text-gray-500 text-xs mt-1">即将上线</p>
              </div>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-pink to-transparent"></div>
          </div>
        </div>
      </div>

      {/* 重新许愿按钮 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg text-white hover:from-gray-600 hover:to-gray-500 transition-all duration-300 hover:scale-105"
        >
          重新许愿
        </button>
      </div>
    </div>
  )
}