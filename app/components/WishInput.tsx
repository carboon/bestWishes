'use client'

import { useState, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface WishInputProps {
  onSubmit: (wish: string) => void
  isAnalyzing: boolean
}

export default function WishInput({ onSubmit, isAnalyzing }: WishInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isAnalyzing) {
      onSubmit(inputValue.trim())
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 z-10">
      <form onSubmit={handleSubmit} className="relative">
        {/* 神秘的输入框 */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="在此输入你的愿望... 让AI分析其中的逻辑漏洞"
              className="w-full h-32 px-6 py-4 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all duration-300"
              disabled={isAnalyzing}
            />
            
            {/* 输入框内的装饰效果 */}
            {isClient && (
              <div className="absolute top-2 right-2 flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-cyber-blue rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={!inputValue.trim() || isAnalyzing}
            className="group relative px-8 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg font-semibold text-black transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
            
            <div className="relative flex items-center space-x-2">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>分析中...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>许愿</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* 字符计数 */}
        <div className="text-right mt-2">
          <span className="text-xs text-gray-500">
            {inputValue.length}/500
          </span>
        </div>
      </form>
    </div>
  )
}