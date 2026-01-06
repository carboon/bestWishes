# BestWish - 赛博许愿机 🌟

一个具有赛博朋克风格的 AI 驱动许愿机应用，能够分析用户愿望中的逻辑漏洞并生成讽刺性的实现方案和配套图像。现已完全兼容 **Cloudflare Pages**，支持全球边缘计算部署。

![赛博朋克风格](https://img.shields.io/badge/风格-赛博朋克-00f2ff?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black?style=for-the-badge&logo=next.js)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-f38020?style=for-the-badge&logo=cloudflare)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

## ✨ 核心功能

### 🧠 AI 逻辑分析
- **多模型支持**：Claude 3.5 Sonnet、GLM-4、Moonshot 等
- **环境自适应**：根据部署环境自动选择最优模型
- **深度分析**：识别愿望中的逻辑漏洞和潜在问题
- **中文优化**：针对中文语境优化的提示词设计

### ⚡ 讽刺性实现
- **创意生成**：技术上满足愿望但结果出人意料的方案
- **邪恶许愿机**：带有黑色幽默的角色扮演
- **逻辑推理**：展示愿望实现的意外后果
- **文学性表达**：富有创意的文字描述

### 🎨 AI 图像生成
- **多模型支持**：FLUX.1-schnell、Kolors 等先进模型
- **环境优化**：测试环境使用 Kolors，生产环境使用 FLUX
- **视觉化呈现**：黑暗超现实主义风格图像
- **高质量输出**：1024x1024 分辨率，专业级效果

### 🛡️ 企业级特性
- **Edge Runtime 优化**：使用 Cloudflare Edge Runtime，全球低延迟访问
- **错误重试机制**：指数退避算法，最多 3 次重试
- **环境自适应**：测试/生产环境自动切换服务配置
- **全球服务支持**：服务端 API 调用，支持中国大陆用户
- **多服务回退**：主服务失败时自动切换到备用服务
- **SSR 优化**：完美的服务端渲染支持，无水合错误
- **Serverless 架构**：基于 Cloudflare Workers，按需计费，无服务器管理

## 🎯 技术架构

### 前端技术栈
- **Next.js 14** - App Router 架构，Edge Runtime 支持
- **TypeScript** - 类型安全开发，企业级代码质量
- **Tailwind CSS** - 实用优先的样式框架，响应式设计
- **Lucide React** - 现代化图标库，一致的视觉体验

### 部署架构
- **Cloudflare Pages** - 全球 CDN 分发，边缘计算
- **Cloudflare Workers** - API 路由运行在边缘节点
- **Edge Runtime** - 无状态函数，毫秒级冷启动
- **全球部署** - 300+ 边缘节点，就近访问

### AI 服务集成
- **LLM 服务** - 环境自适应配置：
  - 生产环境：`anthropic/claude-3.5-sonnet` → `glm-4-plus` → `moonshot-v1-8k`
  - 测试环境：`moonshot-v1-8k` → `glm-4-plus` → `anthropic/claude-3.5-sonnet`
- **图像生成服务** - 模型环境优化：
  - 生产环境：Together AI (`FLUX.1-schnell`) → SiliconFlow COM (`FLUX.1-schnell`)
  - 测试环境：SiliconFlow CN (`Kwai-Kolors/Kolors`) → Together AI (`FLUX.1-schnell`)

### 视觉设计特色
- **赛博朋克配色**：
  - 青蓝色 (`#00f2ff`) - 主要强调色
  - 紫色 (`#bc13fe`) - 次要强调色  
  - 粉色 (`#ff00bd`) - 装饰色
  - 深色背景 (`#0a0a0c`) - 卡片背景
- **动画效果**：
  - `glow` - 发光动画，支持文字和边框
  - `fade-in` - 淡入动画，0.8 秒过渡
  - `pulse-slow` - 慢速脉冲效果
  - `float` - 浮动效果

## 🚀 快速开始

### 1. 环境准备
```bash
# 克隆项目
git clone <repository-url>
cd bestwish

# 安装依赖
pnpm install
```

### 2. 环境变量配置
创建 `.env.local` 文件：
```bash
# LLM 服务 (选择其一)
OPENROUTER_API_KEY=your_openrouter_api_key    # 支持 Claude 3.5 Sonnet
ZHIPU_API_KEY=your_zhipu_api_key              # 智谱 GLM-4 系列
KIMI_API_KEY=your_kimi_api_key                # Moonshot 模型

# 图像生成服务 (根据环境选择)
TOGETHER_API_KEY=your_together_api_key        # Together AI FLUX (通用)
SILICONFLOW_API_KEY_CN=your_cn_key           # 硅基流动中国版 (测试环境)
SILICONFLOW_API_KEY_COM=your_com_key         # 硅基流动国际版 (生产环境)

# 环境配置
NODE_ENV=development                          # development | production

# 网站 URL (可选，用于 API 引用)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 环境配置说明

**测试环境 (NODE_ENV=development)：**
- LLM 优先级：Moonshot (Kimi) → 智谱 AI → OpenRouter
- 图像优先级：SiliconFlow CN (Kolors) → Together AI
- 适合开发调试，成本优化

**生产环境 (NODE_ENV=production)：**
- LLM 优先级：OpenRouter → 智谱 AI → Moonshot  
- 图像优先级：Together AI → SiliconFlow COM
- 企业级稳定性，全球服务覆盖

### 3. 启动开发服务器
```bash
# 本地开发
pnpm run dev

# 构建 Cloudflare Pages 版本
pnpm run pages:build

# 本地预览 Cloudflare 版本（需要 wrangler）
pnpm run preview
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 📁 项目结构

```
bestwish/
├── app/
│   ├── api/
│   │   └── wish/
│   │       └── route.ts          # 核心 API 路由，支持环境自适应
│   ├── components/
│   │   ├── WishInput.tsx         # 许愿输入组件，SSR 优化
│   │   └── ResultDisplay.tsx     # 结果展示组件，支持图像显示
│   ├── globals.css              # 全局样式和自定义类
│   ├── layout.tsx              # 根布局组件
│   └── page.tsx               # 主页面组件，完整的 SSR 支持
├── tailwind.config.js         # Tailwind 配置，包含自定义颜色和动画
├── next.config.js            # Next.js 配置，优化后的设置
└── package.json             # 项目依赖
```

## 🔧 API 接口详情

### POST `/api/wish`

**请求体：**
```json
{
  "wish": "用户的愿望文本"
}
```

**成功响应：**
```json
{
  "logic_analysis": "逻辑漏洞分析",
  "ironic_fulfillment": "讽刺性实现方案", 
  "image_url": "生成的图片 URL"
}
```

**错误响应：**
```json
{
  "error": "错误信息",
  "details": "详细错误描述"
}
```

**状态码：**
- `200` - 成功
- `400` - 请求参数错误
- `500` - 服务器错误

**注意：** Cloudflare Pages 版本已移除内存频率限制，建议在 Cloudflare Dashboard 中配置 Rate Limiting 规则。

## 🌍 环境配置策略

**测试环境优势：**
- 优先使用 Moonshot (Kimi) 进行文本分析，智谱 AI 作为备选
- 使用 SiliconFlow CN 的 Kolors 模型进行图像生成
- 降低网络延迟，提升开发体验
- 成本优化的服务组合

**生产环境优势：**
- 优先使用高质量模型（Claude 3.5 Sonnet）
- 稳定的国际服务（Together AI）
- 企业级可靠性保障
- 全球边缘节点部署

## 🎨 自定义配置

### 修改颜色主题
在 `tailwind.config.js` 中调整：
```javascript
colors: {
  'cyber-blue': '#00f2ff',    // 主要强调色
  'cyber-purple': '#bc13fe',  // 次要强调色
  'cyber-pink': '#ff00bd',    // 装饰色
  'dark-card': '#0a0a0c',     // 卡片背景
}
```

### 调整动画效果
```javascript
animation: {
  'glow': 'glow 2s ease-in-out infinite alternate',
  'fade-in': 'fade-in 0.8s ease-out forwards',
}
```

### 修改频率限制
在 Cloudflare Dashboard 中配置 Rate Limiting 规则：
```
路径: /api/wish
限制: 每分钟 5 次请求（可根据需要调整）
```

## 🚀 部署指南

### Cloudflare Pages 部署（推荐）

#### 方法一：通过 Cloudflare Dashboard
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** → **Create a project** → **Connect to Git**
3. 选择你的 GitHub 仓库
4. 配置构建设置：
   - **Framework preset**: Next.js
   - **Build command**: `pnpm run pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Node.js version**: 18 或更高版本

5. 在 **Environment variables** 中添加 API Keys：
   ```
   KIMI_API_KEY=your_kimi_api_key
   ZHIPU_API_KEY=your_zhipu_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   TOGETHER_API_KEY=your_together_api_key
   SILICONFLOW_API_KEY_CN=your_siliconflow_cn_key
   SILICONFLOW_API_KEY_COM=your_siliconflow_com_key
   NODE_ENV=production
   ```

6. 点击 **Save and Deploy**

#### 方法二：通过 Wrangler CLI
```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建并部署
pnpm run deploy
```

### 传统部署方式

#### Vercel 部署
1. 连接 GitHub 仓库到 Vercel
2. 在 Vercel 环境变量中设置 API 密钥
3. 设置 `NODE_ENV=production`
4. 自动部署完成

#### 手动部署
```bash
# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm start
```

## 🔍 故障排除

### 常见问题

**1. API 500 错误**
- 检查环境变量是否正确设置
- 确认 API 密钥有效且有足够配额
- 查看 Cloudflare Pages Functions 日志获取详细错误信息

**2. 图像生成失败**
- 确认对应环境的图像服务 API 密钥已配置
- 测试环境需要 `SILICONFLOW_API_KEY_CN`
- 生产环境需要 `TOGETHER_API_KEY` 或 `SILICONFLOW_API_KEY_COM`

**3. Cloudflare Pages 构建失败**
- 确认 Node.js 版本设置为 18 或更高
- 检查构建命令是否为 `pnpm run pages:build`
- 查看构建日志中的具体错误信息

**4. Edge Runtime 兼容性问题**
- 确保代码中没有使用 Node.js 特有的 API
- 检查第三方库是否支持 Edge Runtime
- 查看 Cloudflare Workers 兼容性文档

**5. SSR 水合错误**
- 已修复所有动态样式的 SSR 问题
- 如遇到新的水合错误，检查是否有新的随机元素

### 调试模式
开发环境下 API 会输出详细的调试信息：
```bash
# 本地开发调试
pnpm run dev

# Cloudflare 本地预览调试
pnpm run preview
```

### 性能监控
- 使用 Cloudflare Analytics 监控访问量和性能
- 查看 Workers 执行时间和错误率
- 监控 API 调用成功率和响应时间

## 🔒 安全特性

- **Edge Runtime 隔离**：每个请求在独立的沙箱环境中执行
- **输入验证**：严格的请求体验证
- **错误处理**：友好的错误信息，不暴露敏感信息
- **服务端渲染**：API 密钥安全存储在服务端
- **IP 识别**：支持 Cloudflare、代理和 CDN 环境的真实 IP 获取
- **全球 DDoS 防护**：Cloudflare 提供的企业级安全防护

## 🌍 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚡ Cloudflare Pages 优势

### 性能优势
- **全球 CDN**：300+ 边缘节点，就近访问
- **毫秒级冷启动**：Edge Runtime 快速响应
- **自动缓存**：静态资源全球缓存
- **HTTP/3 支持**：最新网络协议优化

### 成本优势
- **按需计费**：只为实际使用付费
- **免费额度**：每月 100,000 次请求免费
- **无服务器管理**：零运维成本
- **自动扩缩容**：应对流量峰值

### 开发体验
- **Git 集成**：推送代码自动部署
- **预览环境**：每个 PR 自动生成预览链接
- **实时日志**：Functions 执行日志实时查看
- **A/B 测试**：内置流量分割功能

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 支持与反馈

如有问题或建议，请通过以下方式联系：
- 创建 [GitHub Issue](../../issues)
- 发送邮件至项目维护者

---

*让 AI 揭示你愿望背后的真相 🔮*