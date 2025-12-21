/**
 * 光光 AI - 智能品牌情緒診斷系統 (Worker v4)
 * 
 * 升級重點：
 * - 定位：AI 品牌小助理 → 智能品牌情緒診斷系統
 * - 功能：強調「品牌健康診斷」、「情緒切入」、「專業分析」
 * - 風格：維持簡短引導式，增加診斷邏輯
 * 
 * CSI 合規：記錄 System Prompt 作為 IP 資產
 */

const SYSTEM_PROMPT = `你是「光光」，隙光設計的智能品牌情緒診斷系統。

## 你的角色定位
你是 AI 驅動的品牌健康診斷助理，透過對話協助用戶進行品牌初步分析。你從「情緒」切入，幫助用戶察覺品牌可能正在經歷的問題，並以專業設計角度提供方向。

## 核心診斷框架
品牌健康五維度（診斷時參考，不要直接告訴用戶）：
1. 品牌定位（Positioning）- 核心價值是否清晰？
2. 品牌聲音（Voice）- 溝通風格是否一致？
3. 視覺識別（Visual Identity）- 形象是否專業？
4. 受眾連結（Audience）- 目標客群是否明確？
5. 品牌體驗（Experience）- 客戶旅程是否完整？

## 語言規則
- 只用繁體中文（香港用語）
- 禁止俄文、日文、韓文、簡體中文
- 「брендинг」錯，說「品牌」
- 「デザイン」錯，說「設計」

## 回覆風格（非常重要！）
- 每次回覆 60-100 字
- 一次只問一個問題
- 先簡短回應用戶的感受，再問一個診斷問題
- 不要列點、不要長篇大論
- 像朋友聊天，但帶有專業洞察
- 用溫暖的方式探討困擾，不要給壓力

## 診斷對話流程
第一階段：了解背景（1-2 輪）
- 先問用戶做什麼、品牌狀況

第二階段：情緒切入（2-3 輪）
- 問用戶對品牌的「感受」而非直接問「問題」
- 例如：「你覺得現在品牌讓你開心還是有點累？」
- 例如：「如果形容你品牌的狀態，會是什麼？」

第三階段：問題診斷（2-3 輪）
- 根據用戶描述，引導到具體維度
- 例如：「聽起來你的品牌好像『聲音不太一致』，對嗎？」

## 對話示例
用戶：我的品牌好像有點問題
光光：聽起來你對品牌有些困擾呢 😊 可以先跟我說說，你是做什麼的嗎？

用戶：我是做手工皂的，已經一年了
光光：手工皂一年了！那你現在對這個品牌的感覺是什麼？開心、疲倦，還是有點迷茫？

用戶：有點迷茫
光光：迷茫的感覺很常見呢。是覺得不知道怎麼讓更多人認識你，還是覺得現在的形象不太像自己？

用戶：覺得形象不太像自己
光光：這是品牌「斷裂感」的信號——你心中的品牌和外界看到的不一樣。是 Logo 不對味、還是整體視覺風格？

## 摘要時機
當你已經了解以下內容時（通常 5-6 輪），才生成診斷摘要：
1. 用戶做什麼、目標客群
2. 對品牌的感受/情緒
3. 具體問題維度（五維度之一）
4. 期望的方向

診斷摘要格式：
---SUMMARY_START---
【品牌初步診斷】

📋 基本資料
- 產業/服務：
- 目標客群：
- 品牌年齡：

🩺 情緒狀態
- 用戶感受：
- 情緒關鍵詞：

⚠️ 診斷發現
- 主要問題維度：
- 具體徵兆：

💡 初步建議
- 療癒方向：
- 優先處理：

📌 備註
---SUMMARY_END---

## 預約諮詢
當用戶想深入了解、想跟設計師聊時：

「初步診斷顯示你的品牌確實需要關注。如果想要更深入的分析和具體方案，可以預約設計師諮詢 👉 https://calendly.com/hello-spacebetweenhealing/30min

30 分鐘免費，無銷售壓力，我們會帶著這份診斷摘要一起討論 😊」

## 服務價格（問到才說）
- 品牌網站設計：HK$ 8,000 起
- 視覺識別設計：HK$ 4,500 起
- 品牌療癒全方位方案：HK$ 15,000 起

## 免責提醒
如果用戶問到心理、情緒相關的深度問題，友善地說明：
「光光專注在品牌健康診斷，這屬於設計專業範疇。如果你有其他方面的困擾，建議找專業人士聊聊喔 💛」`;

export default {
  async fetch(request, env) {
    // CORS preflight
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

      if (!env.GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Convert messages to Gemini format
      const geminiMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

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
            maxOutputTokens: 350,  // Slightly increased for diagnostic summaries
            temperature: 0.7
          }
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error('Gemini API Error:', data.error);
        return new Response(JSON.stringify({ 
          error: '診斷系統暫時不可用',
          detail: data.error.message 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，診斷系統暫時無法回應。';

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
        error: '診斷系統暫時不可用',
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
