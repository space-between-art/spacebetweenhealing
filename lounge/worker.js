/**
 * 光光 AI 小助理 - Cloudflare Worker 後台
 * 隙光設計 Space Between Healing
 * 
 * 功能：
 * 1. 安全代理 Anthropic API（隱藏 API Key）
 * 2. Rate Limiting（防止濫用）
 * 3. 對話記錄（存到 KV）
 * 4. CORS 處理
 */

// ===== 配置 =====
const CONFIG = {
  // 允許的來源網域
  ALLOWED_ORIGINS: [
    'https://spacebetweenhealing.com',
    'https://www.spacebetweenhealing.com',
    'http://localhost:3000', // 開發用
    'http://127.0.0.1:5500', // Live Server
  ],
  
  // Rate Limiting
  RATE_LIMIT: {
    MAX_REQUESTS: 20,      // 每個 IP 每小時最多請求數
    WINDOW_MS: 60 * 60 * 1000, // 1 小時
  },
  
  // Claude 模型設定
  MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 1000,
};

// ===== System Prompt =====
const SYSTEM_PROMPT = `你是「光光」，隙光設計的 AI 品牌小助理。

## 性格
- 溫暖親切有同理心，像懂設計的好朋友
- 用「你」稱呼對方，偶爾用 emoji 但不過度
- 每次回覆 80-120 字內（除非總結）

## 任務
1. 傾聽與共鳴：理解訪客品牌困擾
2. 引導釐清：用溫和提問幫他們想清楚
3. 收集：產業/服務、問題、目標、預算時程（可選）
4. 整理交接：收集足夠後主動提出摘要

## 對話策略
- 一次只問一個問題
- 先共鳴再提問：「這種情況確實很常見...」
- 用具體例子引導
- 適時給予肯定

## 判斷時機
了解到：1.做什麼 2.遇到什麼問題 3.想要什麼
就輸出摘要：

---SUMMARY_START---
【產業/服務】：（填入）
【目前困擾】：（填入）
【期望目標】：（填入）
【其他備註】：（如有）
---SUMMARY_END---

## 服務參考
- 品牌網站：HK$ 8,000 起
- 視覺識別：HK$ 4,500 起
- 全方位方案：HK$ 15,000 起
- 每月限量 3 個專案
- 免費 30 分鐘諮詢

## 不能做
- 給具體報價（說「具體費用需要設計師評估」）
- 承諾具體交期
- 代替設計師做決定`;

// ===== 主要處理函數 =====
export default {
  async fetch(request, env, ctx) {
    // 處理 CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }
    
    // 只接受 POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    // 檢查來源
    const origin = request.headers.get('Origin');
    if (!isAllowedOrigin(origin)) {
      return new Response('Forbidden', { status: 403 });
    }
    
    // Rate Limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitResult = await checkRateLimit(env, clientIP);
    if (!rateLimitResult.allowed) {
      return jsonResponse({ 
        error: '請求太頻繁，請稍後再試',
        retryAfter: rateLimitResult.retryAfter 
      }, 429, origin);
    }
    
    try {
      const body = await request.json();
      const { messages, sessionId } = body;
      
      if (!messages || !Array.isArray(messages)) {
        return jsonResponse({ error: 'Invalid messages format' }, 400, origin);
      }
      
      // 呼叫 Anthropic API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: CONFIG.MODEL,
          max_tokens: CONFIG.MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: messages,
        }),
      });
      
      const data = await response.json();
      
      // 記錄對話（如果有 KV）
      if (env.CHAT_LOGS && sessionId) {
        await logConversation(env, sessionId, messages, data, clientIP);
      }
      
      // 檢查是否有摘要（用於通知）
      const assistantMessage = data.content?.[0]?.text || '';
      const hasSummary = assistantMessage.includes('---SUMMARY_START---');
      
      return jsonResponse({
        content: data.content,
        hasSummary,
        usage: data.usage,
      }, 200, origin);
      
    } catch (error) {
      console.error('Error:', error);
      return jsonResponse({ 
        error: '服務暫時不可用，請稍後再試' 
      }, 500, origin);
    }
  },
};

// ===== 輔助函數 =====

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return CONFIG.ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith(allowed.replace('https://', '.'))
  );
}

function handleCORS(request) {
  const origin = request.headers.get('Origin');
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin || '',
    },
  });
}

async function checkRateLimit(env, clientIP) {
  if (!env.RATE_LIMIT) {
    return { allowed: true };
  }
  
  const key = `rate:${clientIP}`;
  const now = Date.now();
  const windowStart = now - CONFIG.RATE_LIMIT.WINDOW_MS;
  
  // 取得現有記錄
  const record = await env.RATE_LIMIT.get(key, 'json') || { requests: [] };
  
  // 過濾掉過期的請求
  record.requests = record.requests.filter(t => t > windowStart);
  
  if (record.requests.length >= CONFIG.RATE_LIMIT.MAX_REQUESTS) {
    const oldestRequest = Math.min(...record.requests);
    const retryAfter = Math.ceil((oldestRequest + CONFIG.RATE_LIMIT.WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // 新增這次請求
  record.requests.push(now);
  await env.RATE_LIMIT.put(key, JSON.stringify(record), {
    expirationTtl: 3600, // 1 小時後過期
  });
  
  return { allowed: true };
}

async function logConversation(env, sessionId, messages, response, clientIP) {
  const key = `chat:${sessionId}`;
  const timestamp = new Date().toISOString();
  
  // 取得現有對話
  const existing = await env.CHAT_LOGS.get(key, 'json') || {
    sessionId,
    clientIP,
    startedAt: timestamp,
    messages: [],
  };
  
  // 加入新訊息
  const lastUserMessage = messages[messages.length - 1];
  const assistantMessage = response.content?.[0]?.text || '';
  
  existing.messages.push({
    timestamp,
    user: lastUserMessage.content,
    assistant: assistantMessage,
  });
  
  existing.lastUpdated = timestamp;
  
  // 檢查是否有摘要
  if (assistantMessage.includes('---SUMMARY_START---')) {
    existing.hasSummary = true;
    existing.summaryAt = timestamp;
  }
  
  // 儲存
  await env.CHAT_LOGS.put(key, JSON.stringify(existing), {
    expirationTtl: 86400 * 30, // 保留 30 天
  });
}
