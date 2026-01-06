/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'paper-bg': '#f4f7f6',      // 页面底色：极浅灰绿
        'contract-bg': '#fdfaf5',   // 契约卡片色：米白色纸张
        'bureau-black': '#2d2a32',  // 沉稳的墨黑色
        'archive-red': '#b91c1c',   // 警示红色
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'], // 增加衬线体用于引用
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'stamp': 'stamp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'stamp': {
          '0%': { opacity: '0', transform: 'scale(2) rotate(-15deg)' },
          '100%': { opacity: '0.6', transform: 'scale(1) rotate(-15deg)' }
        }
      }
    },
  },
  plugins: [],
}