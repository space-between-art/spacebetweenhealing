# 網站修訂藍圖實作指南
## CSI 申請導向升級

本次更新根據「網站修訂藍圖.docx」完成以下核心修訂：

---

## 📦 檔案清單

```
blueprint-update/
├── lounge.html              # 會客室 → 品牌療癒實驗室
├── lounge/
│   └── chat.html            # AI 對話介面（診斷系統定位）
└── worker-v4-diagnostic.js  # 升級版 Cloudflare Worker
```

---

## 🎯 核心升級內容

### 1. Lounge 頁面（最高優先級）

**品牌定位升級：**
- 頁面名稱：「會客室」→「品牌療癒實驗室 Brand Therapy Lab」
- 定位標語：「中小企品牌健康檢測中心」
- AI 系統：「AI 品牌小助理」→「智能品牌情緒診斷系統」
- CTA：「開始聊天」→「開始品牌健康診斷」

**視覺升級：**
- ✅ Glassmorphism 毛玻璃效果（半透明磨砂玻璃質感）
- ✅ 緩慢流動色彩 CSS 動畫（color-flow animation）
- ✅ AI 頭像光環旋轉動畫
- ✅ 文章卡片毛玻璃效果

**新增元素：**
- Hero Badge：「中小企品牌健康檢測中心」
- AI System Badge：「智能品牌情緒診斷系統 BETA」
- Footer：「Powered by Guangguang AI Diagnostic System × 隙光設計團隊」

### 2. Chat 對話介面

**定位升級：**
- 標題：「品牌健康診斷」
- 副標：「智能品牌情緒診斷系統 BETA」
- 歡迎語：強調「AI 驅動的品牌情緒診斷系統」

**摘要卡片升級：**
- 標題：「需求摘要」→「品牌初步診斷報告」
- 新增分類區塊：基本資料、情緒狀態、診斷發現、初步建議
- Email 主題：「[光光診斷] 品牌健康診斷報告」

### 3. Worker v4（診斷系統版）

**System Prompt 升級：**
- 角色定位：品牌健康診斷助理
- 品牌健康五維度診斷框架：
  1. 品牌定位（Positioning）
  2. 品牌聲音（Voice）
  3. 視覺識別（Visual Identity）
  4. 受眾連結（Audience）
  5. 品牌體驗（Experience）

**診斷對話流程：**
1. 了解背景（1-2 輪）
2. 情緒切入（2-3 輪）- 問「感受」而非「問題」
3. 問題診斷（2-3 輪）

**診斷摘要格式：**
```
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
---SUMMARY_END---
```

---

## 🚀 部署步驟

### Step 1: 更新 Worker（Cloudflare）

1. 登入 Cloudflare Dashboard
2. 進入 Workers & Pages → guangguang-ai
3. 用 `worker-v4-diagnostic.js` 替換現有代碼
4. 點擊 "Save and Deploy"

### Step 2: 上傳網站檔案（GitHub）

```bash
# 替換 lounge.html
cp lounge.html /your-repo/lounge.html

# 替換 chat.html
cp lounge/chat.html /your-repo/lounge/chat.html

# Commit & Push
git add .
git commit -m "feat: 品牌療癒實驗室升級 - CSI 申請導向"
git push
```

### Step 3: 驗證

- [ ] 訪問 lounge.html，確認標題為「品牌療癒實驗室」
- [ ] 確認 Glassmorphism 效果正常顯示
- [ ] 測試 AI 對話，確認診斷流程正確
- [ ] 確認診斷摘要卡片正確顯示

---

## 📋 CSI 申請重點提示

根據藍圖，此次升級支持以下 CSI 申請要點：

1. **技術 IP 記錄**：Worker System Prompt 已詳細記錄診斷邏輯，可作為項目知識產權
2. **工具屬性**：Lounge 頁面轉型為「品牌健康檢測工具」而非純資訊頁
3. **專業定位**：強調「AI 驅動」、「診斷系統」、「品牌健康」等技術詞彙
4. **團隊感**：Footer 添加 "Powered by" 顯示技術團隊支持

---

## 🔮 下一步（藍圖中長期目標）

- [ ] 完成品牌療癒入門系列其餘 3 篇文章
- [ ] 開發 PDF 診斷報告自動生成功能（Phase 2）
- [ ] 開發品牌情緒光譜視覺化（Phase 3）
- [ ] 更新 index.html 首頁語調
- [ ] 更新 about.html 添加療癒設計哲學區塊
- [ ] 更新 services.html 語調調整

---

*更新日期：2025-12-21*
*根據「網站修訂藍圖.docx」實作*
