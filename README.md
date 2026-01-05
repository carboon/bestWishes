# BestWish - 赛博许愿机

一个具有赛博朋克风格的许愿机页面，使用 Next.js 14 App Router、Tailwind CSS 和 Lucide React 图标库构建。

## 功能特性

- 🌟 **神秘的许愿输入框** - 深色主题，带有赛博朋克风格的发光效果
- 🧠 **AI 逻辑漏洞分析** - 分析用户愿望中的逻辑问题
- ⚡ **崩坏实现描述** - 提供超现实的愿望实现方案
- 🖼️ **图片生成区域** - 预留的 AI 图片生成展示区域
- 🎨 **酷炫视觉效果** - 赛博朋克/黑魔法风格的 UI 设计

## 技术栈

- **Next.js 14** - 使用最新的 App Router
- **TypeScript** - 类型安全的开发体验
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 现代化的图标库

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
bestWish/
├── app/
│   ├── components/
│   │   ├── WishInput.tsx      # 许愿输入组件
│   │   └── ResultDisplay.tsx  # 结果展示组件
│   ├── globals.css           # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx            # 主页面
├── public/                 # 静态资源
└── ...配置文件
```

## 样式特色

- **赛博朋克配色**：青色 (#00ffff)、紫色 (#8b5cf6)、粉色 (#ff00ff)
- **发光效果**：CSS 动画实现的霓虹灯效果
- **粒子背景**：动态的背景粒子动画
- **渐变边框**：多彩渐变的边框效果
- **自定义滚动条**：符合主题的滚动条样式

## 自定义配置

可以在 `tailwind.config.js` 中修改：
- 自定义颜色主题
- 动画效果参数
- 响应式断点

## 部署

```bash
npm run build
npm start
```

## 许可证

MIT License