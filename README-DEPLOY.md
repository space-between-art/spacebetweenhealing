# 網站修訂藍圖 完整實作指南
## CSI 申請導向全站升級

根據「網站修訂藍圖.docx」完成以下頁面修訂：

---

## 📦 檔案清單

```
site-update/
├── index.html           # 首頁 - 語氣轉向教育，強調文化項目
├── about.html           # 關於頁 - 新增療癒設計哲學專區
├── services.html        # 服務頁 - 加入療癒方法論，免費診斷
├── portfolio.html       # 作品頁 - 分類商業 vs 文化項目
├── lounge.html          # 會客室 → 品牌療癒實驗室
├── lounge-chat.html     # AI 對話介面（放入 lounge/ 資料夾）
└── worker-v4-diagnostic.js  # Cloudflare Worker
```

---

## 🎯 各頁面修訂摘要

### 1. index.html（首頁）

**痛點區塊升級：**
- 標題：「你是否也有這些困擾？」→「這些問題，你並不孤單」
- 新增副標：「很多創業者都經歷過這些困境。好消息是，這些問題都有解決方案。」
- 語氣從「推銷」轉向「共情教育」

**AI 入口區塊升級：**
- Badge：「AI 品牌小助理」→「智能品牌情緒診斷系統 BETA」
- 標題：「不確定需要什麼？跟光光聊聊」→「不確定問題在哪？讓 AI 幫你診斷」
- 特點：「無壓力」→「AI 驅動的品牌初步分析」
- CTA：「與光光聊天」→「開始品牌健康診斷」

**新增文化項目區塊：**
- 新增 `cultural-highlight` 區塊
- 放大「隙光創作 Space Between Art」作為文化旗艦項目

**合作夥伴網絡：**
- 強調「如需額外專業，我們有攝影師、文案、工程師等合作夥伴網絡支援」
- 解決「產能有限」的疑慮

**Hero CTA 調整：**
- 主按鈕：「預約免費諮詢」→「免費品牌診斷」

### 2. about.html（關於頁）

**新增「療癒設計哲學」專區：**
- 三張卡片：品牌的「病」、設計的「藥」、隙光的「療癒」
- 闡述設計如何帶來療癒

**新增「療癒設計方法論」區塊：**
- 三步驟：診斷 → 處方 → 療癒
- 深色背景，視覺突出

**新增「合作夥伴網絡」說明：**
- 解釋雖然核心團隊精簡，但有可靠的合作網絡

**品牌故事強化：**
- 強調「隙光」命名背後的療癒意涵

### 3. services.html（服務頁）

**新增療癒設計方法論區塊：**
- 標題：「為什麼我們的設計與眾不同？」
- 解釋診斷 → 處方 → 療癒的流程

**新增免費 AI 診斷區塊：**
- 深色卡片，突出展示
- CTA 導向 lounge/chat.html

**語氣調整：**
- 從「賣服務」轉為「提供解決方案」
- CTA：「預約諮詢」→「開始免費診斷」

### 4. portfolio.html（作品頁）

**分類標籤：**
- 新增「全部作品」「商業項目」「文化項目」標籤

**文化項目徽章：**
- 為隙光創作添加「文化項目」徽章

**影響力數據：**
- 新增「項目影響力」區塊
- 展示：5+ 原創長篇作品、40萬+ 字數

### 5. lounge.html（品牌療癒實驗室）

**頁面重新定位：**
- 「會客室」→「品牌療癒實驗室 Brand Therapy Lab」
- 定位語：「中小企品牌健康檢測中心」

**視覺升級：**
- Glassmorphism 毛玻璃效果
- 緩慢流動色彩 CSS 動畫
- AI 頭像旋轉光環

**AI 區塊升級：**
- 「AI 品牌小助理」→「智能品牌情緒診斷系統 BETA」
- CTA：「開始聊天」→「開始品牌健康診斷」

**Footer：**
- 新增「Powered by Guangguang AI Diagnostic System × 隙光設計團隊」

### 6. lounge-chat.html（對話介面）

**定位升級：**
- 標題：「品牌健康診斷」
- Header：「智能品牌情緒診斷系統 BETA」

**診斷報告卡片：**
- 「需求摘要」→「品牌初步診斷報告」
- 分區：基本資料、情緒狀態、診斷發現、初步建議

### 7. worker-v4-diagnostic.js

**System Prompt 升級：**
- 品牌健康五維度診斷框架
- 情緒切入對話流程
- 結構化診斷摘要格式
- 作為 CSI 申請的技術 IP 記錄

---

## 🚀 部署步驟

### Step 1: 更新 Worker（Cloudflare）

1. 登入 Cloudflare Dashboard
2. 進入 Workers & Pages → guangguang-ai
3. 用 `worker-v4-diagnostic.js` 替換現有代碼
4. 點擊 "Save and Deploy"

### Step 2: 上傳網站檔案（GitHub）

```bash
# 替換對應檔案
cp index.html /your-repo/
cp about.html /your-repo/
cp services.html /your-repo/
cp portfolio.html /your-repo/
cp lounge.html /your-repo/

# lounge-chat.html 需要放入 lounge 資料夾
mkdir -p /your-repo/lounge
cp lounge-chat.html /your-repo/lounge/chat.html

# Commit & Push
git add .
git commit -m "feat: 全站 CSI 申請導向升級"
git push
```

### Step 3: 導航更新

所有頁面的導航已統一更新：
- 「會客室」→「療癒實驗室」

---

## ✅ 驗證清單

- [ ] 首頁 AI 區塊顯示「智能品牌情緒診斷系統 BETA」
- [ ] 首頁顯示文化項目區塊（隙光創作）
- [ ] 關於頁顯示療癒設計哲學三張卡片
- [ ] 關於頁顯示療癒設計方法論
- [ ] 服務頁顯示免費 AI 診斷區塊
- [ ] 作品頁顯示文化項目徽章和影響力數據
- [ ] 會客室標題為「品牌療癒實驗室」
- [ ] 會客室有 Glassmorphism 效果
- [ ] AI 對話介面正常運作
- [ ] 診斷報告卡片正確顯示分區

---

## 📋 CSI 申請重點

此次升級支持以下 CSI 申請要點：

1. **技術 IP**：Worker System Prompt 詳細記錄診斷邏輯
2. **工具屬性**：Lounge 頁面轉型為「品牌健康檢測工具」
3. **專業定位**：強調「AI 驅動」、「診斷系統」技術詞彙
4. **公眾教育**：療癒設計哲學、方法論內容
5. **文化項目**：放大隙光創作作為非商業旗艦項目
6. **團隊感**：Footer 添加 "Powered by" 顯示技術團隊

---

## 🔮 下一步（藍圖中長期目標）

**短期 (1-2 週)：**
- [ ] 完成品牌療癒系列第 2 篇文章
- [ ] 測試 AI 診斷對話流程

**中期 (3-4 週)：**
- [ ] 完成品牌療癒系列全 4 篇文章
- [ ] 開發 PDF 診斷報告功能（Phase 2）

**長期 (1-2 月)：**
- [ ] CSI 申請文件準備
- [ ] 聯繫合作夥伴（NGO、設計師協會）
- [ ] 開發品牌情緒光譜視覺化（Phase 3）

---

*更新日期：2025-12-21*
*根據「網站修訂藍圖.docx」完整實作*
