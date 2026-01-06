# Cloudflare Pages 部署指南

## 迁移完成的修改

### 1. 代码修改
- ✅ 在 `app/api/wish/route.ts` 中添加了 `export const runtime = 'edge'`
- ✅ 重构了频率限制逻辑以兼容 Edge Runtime（无状态环境）
- ✅ 更新了 Next.js 配置以支持 Cloudflare Pages

### 2. 依赖安装
- ✅ 安装了 `@cloudflare/next-on-pages` 适配器
- ✅ 添加了 Cloudflare 相关的构建脚本

### 3. 配置文件
- ✅ 创建了 `wrangler.toml` 配置文件

## 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 页面
3. 点击 **Create a project** > **Connect to Git**
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **Framework preset**: Next.js
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (保持默认)

6. 在 **Environment variables** 中添加你的 API Keys：
   ```
   KIMI_API_KEY=your_kimi_api_key
   ZHIPU_API_KEY=your_zhipu_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   TOGETHER_API_KEY=your_together_api_key
   SILICONFLOW_API_KEY_CN=your_siliconflow_cn_key
   SILICONFLOW_API_KEY_COM=your_siliconflow_com_key
   NODE_ENV=production
   ```

7. 点击 **Save and Deploy**

### 方法二：通过 Wrangler CLI

1. 安装 Wrangler CLI：
   ```bash
   npm install -g wrangler
   ```

2. 登录 Cloudflare：
   ```bash
   wrangler login
   ```

3. 构建并部署：
   ```bash
   npm run deploy
   ```

## 重要注意事项

### 频率限制
当前的频率限制功能在 Edge Runtime 中已被简化。生产环境建议使用以下方案之一：

1. **Cloudflare KV 存储**（推荐）
2. **Upstash Redis**
3. **Cloudflare Rate Limiting 规则**

### 环境差异
- Cloudflare Pages 使用 Edge Runtime，不支持所有 Node.js API
- 内存状态无法在请求间保持
- 每个请求可能在不同的全球节点执行

### 性能优化
- 图片优化已禁用（`unoptimized: true`）
- API 路由会自动转换为 Cloudflare Workers

## 验证部署

部署完成后，访问你的 Cloudflare Pages 域名，测试以下功能：
1. 页面正常加载
2. 许愿功能正常工作
3. 图片生成正常显示
4. API 响应时间合理

## 故障排除

如果遇到问题，检查：
1. Cloudflare Pages 的 **Functions** 日志
2. 环境变量是否正确设置
3. API Keys 是否有效
4. 构建日志中的错误信息