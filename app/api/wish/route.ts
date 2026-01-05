import { NextRequest, NextResponse } from 'next/server';

// 频率限制配置
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟（毫秒）
const RATE_LIMIT_MAX_REQUESTS = 2; // 每分钟最大请求数

// 重试配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

// 内存中存储请求记录（生产环境建议使用 Redis）
const requestLog = new Map<string, number[]>();

// 获取客户端 IP 地址
function getClientIP(request: NextRequest): string {
  // 尝试从各种 header 中获取真实 IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // 回退到连接 IP（在本地开发中可能是 localhost）
  return request.ip || '127.0.0.1';
}

// 检查频率限制
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = requestLog.get(ip) || [];
  
  // 清理过期的请求记录
  const validRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  // 检查是否超过限制
  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // 超过限制
  }
  
  // 记录当前请求
  validRequests.push(now);
  requestLog.set(ip, validRequests);
  
  return true; // 允许请求
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 带重试的 fetch 函数
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries: number = MAX_RETRIES
): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // 如果是服务器错误（5xx）或请求过于频繁（429），则重试
      if (response.status >= 500 || response.status === 429) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // 指数退避：第一次重试 1s，第二次 2s，第三次 4s
      const delayTime = RETRY_DELAY * Math.pow(2, attempt - 1);
      console.log(`API 调用失败，${delayTime}ms 后进行第 ${attempt + 1} 次重试:`, lastError.message);
      await delay(delayTime);
    }
  }
  
  throw lastError!;
}

interface WishRequest {
  wish: string;
}

interface LLMResponse {
  logic_analysis: string;
  ironic_fulfillment: string;
  visual_prompt: string;
}

interface WishResult {
  logic_analysis: string;
  ironic_fulfillment: string;
  image_url: string;
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端 IP 并检查频率限制
    const clientIP = getClientIP(request);
    
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: '愿望机能量耗尽，请稍后再试' },
        { status: 429 }
      );
    }

    // 获取环境变量
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const togetherApiKey = process.env.TOGETHER_API_KEY;

    if (!openRouterApiKey || !togetherApiKey) {
      return NextResponse.json(
        { error: '服务配置错误：缺少必要的 API 密钥' },
        { status: 500 }
      );
    }

    // 解析请求体
    const { wish }: WishRequest = await request.json();

    if (!wish || wish.trim().length === 0) {
      return NextResponse.json(
        { error: '请输入你的愿望' },
        { status: 400 }
      );
    }

    // 第一步：调用 OpenRouter API 进行逻辑分析
    const systemPrompt = `你是一个邪恶的许愿机，专门找出人类愿望中的逻辑漏洞，并以讽刺的方式"实现"这些愿望。

你的任务：
1. 仔细分析用户愿望中的逻辑漏洞、模糊表述或潜在问题
2. 设计一个技术上满足愿望但结果讽刺的实现方案
3. 创建一个视觉提示词，用于生成展示这种讽刺结果的图像

请严格按照以下 JSON 格式输出，不要包含任何其他文字：
{
  "logic_analysis": "详细分析愿望中的逻辑漏洞和问题，用中文回答",
  "ironic_fulfillment": "讽刺性的实现方案，技术上满足愿望但结果出人意料，用中文回答",
  "visual_prompt": "英文图像生成提示词，描述讽刺结果的视觉场景，风格要黑暗、超现实、戏剧性"
}`;

    // 优先使用 Claude 3.5 Sonnet，如果失败则回退到 DeepSeek
    const models = [
      'anthropic/claude-3.5-sonnet',
      'deepseek/deepseek-chat'
    ];

    let llmResponse: Response | null = null;
    let lastLLMError: Error | null = null;

    for (const model of models) {
      try {
        console.log(`尝试使用模型: ${model}`);
        
        llmResponse = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://bestwish.vercel.app',
            'X-Title': 'Evil Wish Machine'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: `用户的愿望：${wish}`
              }
            ],
            temperature: 0.8,
            max_tokens: 1500
          })
        });

        if (llmResponse.ok) {
          console.log(`成功使用模型: ${model}`);
          break;
        }
      } catch (error) {
        lastLLMError = error instanceof Error ? error : new Error('Unknown LLM error');
        console.log(`模型 ${model} 调用失败:`, lastLLMError.message);
        continue;
      }
    }

    if (!llmResponse || !llmResponse.ok) {
      throw new Error(`所有 LLM 模型调用失败: ${lastLLMError?.message || 'Unknown error'}`);
    }

    const llmData = await llmResponse.json();
    const llmContent = llmData.choices[0]?.message?.content;

    if (!llmContent) {
      throw new Error('LLM 返回内容为空');
    }

    // 解析 LLM 返回的 JSON
    let parsedLLMResponse: LLMResponse;
    try {
      // 尝试提取 JSON（处理可能的额外文字）
      const jsonMatch = llmContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : llmContent;
      parsedLLMResponse = JSON.parse(jsonString);
    } catch (error) {
      throw new Error('LLM 返回的内容不是有效的 JSON 格式');
    }

    // 验证必要字段
    if (!parsedLLMResponse.logic_analysis || !parsedLLMResponse.ironic_fulfillment || !parsedLLMResponse.visual_prompt) {
      throw new Error('LLM 返回的 JSON 缺少必要字段');
    }

    // 第二步：调用 Together AI 生成图像
    const imageResponse = await fetchWithRetry('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell',
        prompt: `${parsedLLMResponse.visual_prompt}, dark surreal art, dramatic lighting, high contrast, cinematic composition`,
        width: 1024,
        height: 1024,
        steps: 4,
        n: 1
      })
    });

    if (!imageResponse.ok) {
      throw new Error(`Together AI API 调用失败: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.data[0]?.url;

    if (!imageUrl) {
      throw new Error('图像生成失败：未获取到图片 URL');
    }

    // 返回完整结果
    const result: WishResult = {
      logic_analysis: parsedLLMResponse.logic_analysis,
      ironic_fulfillment: parsedLLMResponse.ironic_fulfillment,
      image_url: imageUrl
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('API 处理错误:', error);
    
    // 返回友好的错误信息
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    
    return NextResponse.json(
      { 
        error: '许愿机暂时出现故障，请稍后再试',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}