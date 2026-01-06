'use client'

import { useState } from 'react'

interface MagicLampButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export default function MagicLampButton({ onClick, children }: MagicLampButtonProps) {
  const [isRubbing, setIsRubbing] = useState(false)

  const handleClick = () => {
    setIsRubbing(true)
    setTimeout(() => {
      setIsRubbing(false)
      onClick()
    }, 800)
  }

  return (
    <button 
      onClick={handleClick}
      disabled={isRubbing}
      className="group relative overflow-hidden transform hover:scale-105 transition-all duration-300"
    >
      {/* 神灯容器 */}
      <div className={`relative w-28 h-20 ${isRubbing ? 'animate-pulse' : ''}`}>
        {/* 简化版神灯 SVG */}
        <svg 
          viewBox="0 0 140 100" 
          className="w-full h-full drop-shadow-xl"
          fill="none"
        >
          {/* 神灯主体 - 更简洁的设计 */}
          <path 
            d="M30 60 Q30 40 50 40 L90 40 Q110 40 110 60 L105 75 Q100 80 85 80 L55 80 Q45 80 40 75 Z" 
            fill="url(#modernLampBody)" 
            stroke="#92400E" 
            strokeWidth="2"
          />
          
          {/* 神灯嘴 */}
          <path 
            d="M110 50 Q125 45 130 40 Q135 35 130 30 Q125 35 110 40" 
            fill="url(#modernLampSpout)" 
            stroke="#92400E" 
            strokeWidth="2"
          />
          
          {/* 神灯把手 */}
          <path 
            d="M35 55 Q20 50 15 55 Q10 60 15 65 Q20 60 35 65" 
            fill="none" 
            stroke="#92400E" 
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* 装饰宝石 */}
          <circle cx="70" cy="60" r="4" fill="#EF4444" className="animate-pulse" />
          <circle cx="70" cy="60" r="2" fill="#FCA5A5" />
          
          {/* 魔法烟雾 - 动态效果 */}
          <g className={`${isRubbing ? 'animate-bounce' : 'group-hover:animate-pulse'}`}>
            <path 
              d="M130 30 Q135 25 140 20 Q135 15 130 20 Q125 25 130 30" 
              fill="url(#magicSmoke)" 
              opacity="0.8"
            />
            <circle cx="135" cy="17" r="2.5" fill="#A78BFA" opacity="0.6" />
            <circle cx="138" cy="12" r="2" fill="#C4B5FD" opacity="0.5" />
            <circle cx="140" cy="8" r="1.5" fill="#DDD6FE" opacity="0.4" />
          </g>
          
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="modernLampBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="30%" stopColor="#FCD34D" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            
            <linearGradient id="modernLampSpout" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            <radialGradient id="magicSmoke" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </radialGradient>
          </defs>
        </svg>
        
        {/* 发光光环 */}
        <div className={`absolute inset-0 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 rounded-full blur-lg opacity-20 ${isRubbing ? 'opacity-60 animate-ping' : 'group-hover:opacity-40'} transition-all duration-300 -z-10`}></div>
        
        {/* 魔法粒子 */}
        {isRubbing && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${10 + Math.random() * 40}%`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 按钮文字 */}
      <div className="mt-3 text-center">
        <span className={`text-sm font-semibold ${isRubbing ? 'text-purple-600 animate-pulse' : 'text-amber-700 group-hover:text-amber-800'} transition-colors`}>
          {isRubbing ? '魔法生效中...' : children}
        </span>
      </div>
    </button>
  )
}