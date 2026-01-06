import { NextRequest, NextResponse } from 'next/server';

// 频率限制配置
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟（毫秒）
const RATE_LIMIT_MAX_REQUESTS = process.env.NODE_ENV === 'production' ? 2 : 5; // 生产环境2次，开发环境5次

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
  console.log('=== API 请求开始 ===');
  try {
    // 获取客户端 IP 并检查频率限制
    const clientIP = getClientIP(request);
    console.log('客户端 IP:', clientIP);
    
    if (!checkRateLimit(clientIP)) {
      console.log('频率限制触发');
      return NextResponse.json(
        { error: '愿望机能量耗尽，请稍后再试' },
        { status: 429 }
      );
    }

    // 环境配置检测
    const isProduction = process.env.NODE_ENV === 'production';
    console.log(`当前环境: ${isProduction ? '生产环境' : '测试环境'}`);

    // 获取环境变量并设置回退机制
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const kimiApiKey = process.env.KIMI_API_KEY;
    const zhipuApiKey = process.env.ZHIPU_API_KEY;
    const togetherApiKey = process.env.TOGETHER_API_KEY;
    const siliconFlowApiKeyCN = process.env.SILICONFLOW_API_KEY_CN;
    const siliconFlowApiKeyCOM = process.env.SILICONFLOW_API_KEY_COM;

    // 调试环境变量
    console.log('环境变量检查:');
    console.log('- KIMI_API_KEY:', kimiApiKey ? '已设置' : '未设置');
    console.log('- ZHIPU_API_KEY:', zhipuApiKey ? '已设置' : '未设置');
    console.log('- SILICONFLOW_API_KEY_CN:', siliconFlowApiKeyCN ? '已设置' : '未设置');
    console.log('- TOGETHER_API_KEY:', togetherApiKey ? '已设置' : '未设置');

    // 检查 LLM 服务配置（根据环境选择）
    const llmConfig = {
      apiKey: '',
      baseUrl: '',
      provider: '',
      models: [] as string[]
    };

    if (isProduction) {
      // 生产环境优先级：OpenRouter > 智谱 AI > Moonshot
      if (openRouterApiKey) {
        llmConfig.apiKey = openRouterApiKey;
        llmConfig.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
        llmConfig.provider = 'OpenRouter';
        llmConfig.models = ['anthropic/claude-3.5-sonnet', 'deepseek/deepseek-chat'];
      } else if (zhipuApiKey) {
        llmConfig.apiKey = zhipuApiKey;
        llmConfig.baseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        llmConfig.provider = 'ZhipuAI';
        llmConfig.models = ['glm-4-plus', 'glm-4'];
      } else if (kimiApiKey) {
        llmConfig.apiKey = kimiApiKey;
        llmConfig.baseUrl = 'https://api.moonshot.cn/v1/chat/completions';
        llmConfig.provider = 'Moonshot';
        llmConfig.models = ['moonshot-v1-8k'];
      }
    } else {
      // 测试环境优先级：Moonshot > 智谱 AI > OpenRouter
      if (kimiApiKey) {
        llmConfig.apiKey = kimiApiKey;
        llmConfig.baseUrl = 'https://api.moonshot.cn/v1/chat/completions';
        llmConfig.provider = 'Moonshot';
        llmConfig.models = ['moonshot-v1-8k'];
      } else if (zhipuApiKey) {
        llmConfig.apiKey = zhipuApiKey;
        llmConfig.baseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        llmConfig.provider = 'ZhipuAI';
        llmConfig.models = ['glm-4-plus', 'glm-4'];
      } else if (openRouterApiKey) {
        llmConfig.apiKey = openRouterApiKey;
        llmConfig.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
        llmConfig.provider = 'OpenRouter';
        llmConfig.models = ['anthropic/claude-3.5-sonnet', 'deepseek/deepseek-chat'];
      }
    }

    // 检查图像生成服务配置（根据环境选择）
    const availableImageServices: Array<{
      apiKey: string;
      baseUrl: string;
      provider: string;
    }> = [];
    
    if (isProduction) {
      // 生产环境：优先 Together AI，备选 SiliconFlow COM
      if (togetherApiKey) {
        availableImageServices.push({
          apiKey: togetherApiKey,
          baseUrl: 'https://api.together.xyz/v1/images/generations',
          provider: 'Together AI'
        });
      }
      if (siliconFlowApiKeyCOM) {
        availableImageServices.push({
          apiKey: siliconFlowApiKeyCOM,
          baseUrl: 'https://api.siliconflow.com/v1/images/generations',
          provider: 'SiliconFlow COM'
        });
      }
    } else {
      // 测试环境：优先 SiliconFlow CN，备选 Together AI
      if (siliconFlowApiKeyCN) {
        availableImageServices.push({
          apiKey: siliconFlowApiKeyCN,
          baseUrl: 'https://api.siliconflow.cn/v1/images/generations',
          provider: 'SiliconFlow CN'
        });
      }
      if (togetherApiKey) {
        availableImageServices.push({
          apiKey: togetherApiKey,
          baseUrl: 'https://api.together.xyz/v1/images/generations',
          provider: 'Together AI'
        });
      }
    }

    // 验证必要的服务配置
    if (!llmConfig.apiKey) {
      return NextResponse.json(
        { error: '服务配置错误：缺少文本分析服务 (需要 OPENROUTER_API_KEY、ZHIPU_API_KEY 或 KIMI_API_KEY)' },
        { status: 500 }
      );
    }

    if (availableImageServices.length === 0) {
      return NextResponse.json(
        { error: `服务配置错误：${isProduction ? '生产' : '测试'}环境缺少图像生成服务配置` },
        { status: 500 }
      );
    }

    const availableImageProviders = availableImageServices.map(s => s.provider);
    console.log(`使用 LLM 服务: ${llmConfig.provider}, 可用图像服务: ${availableImageProviders.join(', ')}`);

    // 解析请求体
    const { wish }: WishRequest = await request.json();

    if (!wish || wish.trim().length === 0) {
      return NextResponse.json(
        { error: '请输入你的愿望' },
        { status: 400 }
      );
    }

    // 第一步：调用 LLM API 进行逻辑分析
    const systemPrompt = `你现在是“完美愿望公证人”——一个追求绝对程序正义、冷酷且严谨的古老契约监督者。你存在的唯一乐趣就是通过文字游戏和逻辑陷阱，将人类贪婪的愿望转化为荒诞的悲剧。你深谙“恶意顺从（Malicious Compliance）”之道：严格实现愿望的字面意思，但彻底扭曲其初衷。

### 你的行动准则：
1. **深度剖析**：挖掘愿望中未定义的边界条件（如时间、代价、副作用、物理法则）。
2. **绝对执行**：不拒绝愿望，不打折扣，但必须以一种最令人绝望、最具讽刺意味的方式达成。
3. **审判者姿态**：你的口吻应当傲慢、冷酷，像是在俯瞰蝼蚁自投罗网。

请严格按照以下 JSON 格式输出，不要包含任何额外解释：
{
  "logic_analysis": "以高位恶魔的视角，用手术刀般的冰冷语言，拆解愿望中由于词义模糊或逻辑缺失留下的致命后门。",
  "ironic_fulfillment": "对愿望实现的具体描述。必须技术性地百分之百达成用户目标，但结果必须是扭曲、诡异且充满黑色幽默的灾难。要求文字极具画面感和讽刺力度。",
  "visual_prompt": "一段详细的英文图像生成提示词。风格设定：Cinematic, Surrealism, Dark Fantasy, Hyper-realistic. 画面应捕捉到愿望达成瞬间那种令人毛骨悚然的荒诞感。"
}`;

    let llmResponse: Response | null = null;
    let lastLLMError: Error | null = null;

    // 尝试所有可用的 LLM 模型
    for (const model of llmConfig.models) {
      try {
        console.log(`尝试使用 ${llmConfig.provider} 模型: ${model}`);
        
        // 构建请求头
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${llmConfig.apiKey}`,
          'Content-Type': 'application/json'
        };

        // OpenRouter 需要额外的 headers
        if (llmConfig.provider === 'OpenRouter') {
          headers['HTTP-Referer'] = process.env.NEXT_PUBLIC_SITE_URL || 'https://bestwish.vercel.app';
          headers['X-Title'] = 'Evil Wish Machine';
        }

        llmResponse = await fetchWithRetry(llmConfig.baseUrl, {
          method: 'POST',
          headers,
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
          console.log(`成功使用 ${llmConfig.provider} 模型: ${model}`);
          break;
        }
      } catch (error) {
        lastLLMError = error instanceof Error ? error : new Error('Unknown LLM error');
        console.log(`${llmConfig.provider} 模型 ${model} 调用失败:`, lastLLMError.message);
        continue;
      }
    }

    if (!llmResponse || !llmResponse.ok) {
      throw new Error(`${llmConfig.provider} 所有模型调用失败: ${lastLLMError?.message || 'Unknown error'}`);
    }

    const llmData = await llmResponse.json();
    const llmContent = llmData.choices[0]?.message?.content;

    if (!llmContent) {
      throw new Error(`${llmConfig.provider} 返回内容为空`);
    }

    // 解析 LLM 返回的 JSON
    let parsedLLMResponse: LLMResponse;
    try {
      // 尝试提取 JSON（处理可能的额外文字）
      const jsonMatch = llmContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : llmContent;
      parsedLLMResponse = JSON.parse(jsonString);
    } catch (error) {
      throw new Error(`${llmConfig.provider} 返回的内容不是有效的 JSON 格式`);
    }

    // 验证必要字段
    if (!parsedLLMResponse.logic_analysis || !parsedLLMResponse.ironic_fulfillment || !parsedLLMResponse.visual_prompt) {
      throw new Error(`${llmConfig.provider} 返回的 JSON 缺少必要字段`);
    }

    // 第二步：调用图像生成 API（支持回退机制）
    let imageUrl: string | null = null;
    let lastImageError: Error | null = null;

    // 尝试所有可用的图像生成服务
    for (const service of availableImageServices) {
      try {
        console.log(`使用 ${service.provider} 生成图像`);
        console.log(`图像 API 地址: ${service.baseUrl}`);
        console.log(`API Key 长度: ${service.apiKey.length}`);
        console.log(`API Key 前缀: ${service.apiKey.substring(0, 10)}...`);
        
        const requestBody = service.provider === 'SiliconFlow CN' ? {
          model: 'Kwai-Kolors/Kolors',
          prompt: `${parsedLLMResponse.visual_prompt}, dark surreal art, dramatic lighting, high contrast, cinematic composition`,
          image_size: "1024x1024",
          batch_size: 1,
          num_inference_steps: 20,
          guidance_scale: 7.5
        } : service.provider === 'SiliconFlow COM' ? {
          model: 'black-forest-labs/FLUX.1-schnell',
          prompt: `${parsedLLMResponse.visual_prompt}, dark surreal art, dramatic lighting, high contrast, cinematic composition`,
          image_size: "1024x1024",
          batch_size: 1,
          num_inference_steps: 20,
          guidance_scale: 7.5,
          prompt_enhancement: false
        } : {
          model: 'black-forest-labs/FLUX.1-schnell',
          prompt: `${parsedLLMResponse.visual_prompt}, dark surreal art, dramatic lighting, high contrast, cinematic composition`,
          width: 1024,
          height: 1024,
          steps: 4,
          n: 1
        };

        console.log(`${service.provider} 请求参数:`, JSON.stringify(requestBody, null, 2));
        
        const imageResponse = await fetchWithRetry(service.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${service.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!imageResponse.ok) {
          // 获取详细的错误信息
          let errorDetails = '';
          try {
            const errorData = await imageResponse.json();
            errorDetails = JSON.stringify(errorData);
          } catch (e) {
            errorDetails = await imageResponse.text();
          }
          
          console.error(`${service.provider} API 错误详情:`, errorDetails);
          throw new Error(`${service.provider} API 调用失败: ${imageResponse.status} - ${errorDetails}`);
        }

        const imageData = await imageResponse.json();

        // 根据不同的服务提供商解析响应格式
        if (service.provider === 'Together AI') {
          imageUrl = imageData.data[0]?.url;
        } else if (service.provider === 'SiliconFlow CN' || service.provider === 'SiliconFlow COM') {
          imageUrl = imageData.images[0]?.url;
        } else {
          imageUrl = imageData.data[0]?.url || imageData.images[0]?.url;
        }

        if (imageUrl) {
          console.log(`成功使用 ${service.provider} 生成图像`);
          break; // 成功生成图像，跳出循环
        } else {
          throw new Error(`${service.provider} 图像生成失败：未获取到图片 URL`);
        }

      } catch (error) {
        lastImageError = error instanceof Error ? error : new Error('Unknown image generation error');
        console.log(`${service.provider} 图像生成失败:`, lastImageError.message);
        continue; // 尝试下一个服务
      }
    }

    if (!imageUrl) {
      throw new Error(`所有图像生成服务都失败了: ${lastImageError?.message || 'Unknown error'}`);
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
    console.error('错误堆栈:', error instanceof Error ? error.stack : 'No stack trace');
    
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