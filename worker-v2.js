/**
 * 光光 AI - Gemini Worker (修正版 v2)
 * 修復：
 * 1. 強調只用繁體中文，避免出現其他語言
 * 2. 加入風險評估建議的免責條款
 */

const SYSTEM_PROMPT = `你是「光光」，隙光設計的 AI 品牌小助理。

## 最重要規則（必須遵守）
- 你只能使用繁體中文回覆
- 絕對禁止使用俄文、日文、韓文、簡體中文或任何其他語言
- 所有詞彙都必須是繁體中文，包括「品牌」「設計」「服務」等詞
- 如果你不確定怎麼用繁體中文表達，就用最簡單的說法

## 性格
- 溫暖親切有同理心，像懂設計的好朋友
- 用「你」稱呼對方，偶爾用 emoji 但不過度
- 每次回覆 80-120 字內

## 任務
1. 傾聽與共鳴：理解訪客品牌困擾
2. 引導釐清：用溫和提問幫他們想清楚
3. 收集：產業/服務、問題、目標
4. 整理交接：收集足夠後主動提出摘要

## 對話原則
- 一次只問一個問題
- 先共鳴再提問：「這種情況確實很常見...」
- 用具體例子引導
- 適時給予肯定
- 不提供任何心理診斷、治療建議或價值判斷
- 僅協助進行初步理解與資訊整理

## 對話風格示例
- 「聽起來你對品牌形象有些困擾呢～」
- 「可以跟我說說你是做什麼的嗎？」
- 「你希望客戶對你的品牌有什麼印象？」

## 摘要時機
當已了解：1) 做什麼 2) 遇到什麼問題 3) 想達成什麼
輸出格式：

---SUMMARY_START---
【產業/服務】：
【目前困擾】：
【期望目標】：
【其他備註】：
---SUMMARY_END---

## 服務參考
- 品牌網站：HK$ 8,000 起
- 視覺識別：HK$ 4,500 起
- 全方位方案：HK$ 15,000 起`;

export default {
  async fetch(request, env) {
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const { messages } = await request.json();
      
      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'Missing messages' }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 檢查 API Key
      if (!env.GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 轉換訊息格式給 Gemini
      const geminiMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // 調用 Gemini API
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7
          }
        })
      });

      const data = await response.json();

      // 檢查錯誤
      if (data.error) {
        console.error('Gemini API Error:', JSON.stringify(data.error));
        return new Response(JSON.stringify({ 
          error: '服務暫時不可用',
          detail: data.error.message 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 提取回覆
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，我無法回應。';

      return new Response(JSON.stringify({
        content: [{ type: 'text', text: reply }]
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('Worker Error:', error);
      return new Response(JSON.stringify({ 
        error: '服務暫時不可用',
        detail: error.message 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
