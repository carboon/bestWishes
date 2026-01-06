'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageLampButtonProps {
  onClick: () => void
  children: React.ReactNode
  imageSrc?: string // 可选的神灯图片路径
}

export default function ImageLampButton({ onClick, children, imageSrc }: ImageLampButtonProps) {
  const [isRubbing, setIsRubbing] = useState(false)

  const handleClick = () => {
    setIsRubbing(true)
    setTimeout(() => {
      setIsRubbing(false)
      onClick()
    }, 1000)
  }

  return (
    <button 
      onClick={handleClick}
      disabled={isRubbing}
      className="group relative transform hover:scale-105 transition-all duration-300 focus:outline-none"
    >
      <div className="relative">
        {/* 如果提供了图片，使用图片；否则使用默认的 SVG */}
        {imageSrc ? (
          <div className={`relative w-32 h-24 ${isRubbing ? 'animate-pulse' : ''}`}>
            <Image
              src={imageSrc}
              alt="Magic Lamp"
              fill
              className="object-contain drop-shadow-xl"
            />
            {/* 发光效果 */}
            <div className={`absolute inset-0 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 rounded-full blur-xl opacity-20 ${isRubbing ? 'opacity-60 animate-ping' : 'group-hover:opacity-40'} transition-all duration-300 -z-10`}></div>
          </div>
        ) : (
          // 默认 emoji 神灯
          <div className={`text-6xl ${isRubbing ? 'animate-bounce' : 'group-hover:animate-pulse'} transition-all duration-300`}>
            🪔
          </div>
        )}
        
        {/* 魔法粒子效果 */}
        {isRubbing && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-lg animate-ping"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 60}%`,
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '1.5s'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 按钮文字 */}
      <div className="mt-4 text-center">
        <span className={`text-base font-semibold ${isRubbing ? 'text-purple-600 animate-pulse' : 'text-amber-700 group-hover:text-amber-800'} transition-colors`}>
          {isRubbing ? '🌟 魔法生效中... 🌟' : children}
        </span>
      </div>
    </button>
  )
}