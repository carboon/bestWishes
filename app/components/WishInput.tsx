'use client'

import { useState } from 'react'
import { PenLine, Loader2 } from 'lucide-react'

export default function WishInput({ onSubmit, isAnalyzing }: { onSubmit: (w: string) => void, isAnalyzing: boolean }) {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 animate-fade-in">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(inputValue); }}>
        <div className="relative group">
          {/* 标签装饰 */}
          <div className="absolute -top-3 left-4 bg-[#f4f7f6] px-2 text-[10px] text-gray-400 uppercase tracking-widest z-10">
            愿望描述 / WISH DESCRIPTION
          </div>
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请详细描述你的愿望..."
            maxLength={100}
            className="w-full h-32 px-6 py-6 bg-white border border-gray-300 rounded-sm text-gray-900 placeholder-gray-300 resize-none focus:outline-none focus:border-gray-900 transition-all shadow-sm font-serif text-lg"
            disabled={isAnalyzing}
          />
          
          <div className="absolute bottom-2 right-4 text-xs text-gray-400">
            {inputValue.length}/100
          </div>
        </div>

        <div className="flex flex-col items-center mt-6">
          <button
            type="submit"
            disabled={!inputValue.trim() || isAnalyzing}
            className="px-12 py-3 bg-[#2d2a32] text-white font-medium rounded-sm tracking-widest hover:bg-black transition-all disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" /> : '提交愿望'}
          </button>
          
          {/* 快捷选项 */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['希望拥有超能力', '想要财富自由', '渴望真爱降临'].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setInputValue(item)}
                className="px-3 py-1 border border-dashed border-gray-300 text-[10px] text-gray-500 hover:border-gray-900"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}