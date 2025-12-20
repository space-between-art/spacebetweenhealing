# 光光 AI 小助理 - Cloudflare Worker 部署指南

## 📋 前置準備

1. **Cloudflare 帳號**（免費）
2. **Anthropic API Key**
3. **Node.js**（用於 Wrangler CLI）

---

## 🚀 部署步驟

### 步驟 1：安裝 Wrangler CLI

```bash
npm install -g wrangler
```

### 步驟 2：登入 Cloudflare

```bash
wrangler login
```
會開啟瀏覽器讓你授權。

### 步驟 3：建立 KV 命名空間

```bash
# Rate Limiting 用
wrangler kv:namespace create "RATE_LIMIT"

# 對話記錄用
wrangler kv:namespace create "CHAT_LOGS"
```

執行後會顯示類似：
```
🌀 Creating namespace with title "guangguang-ai-RATE_LIMIT"
✨ Success!
Add the following to your configuration file:
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "xxxxxxxxxxxxxxxxxxxx"
```

**將這些 ID 填入 `wrangler.toml`**

### 步驟 4：設定 API Key（安全方式）

```bash
wrangler secret put ANTHROPIC_API_KEY
```
然後輸入你的 Anthropic API Key。

### 步驟 5：部署

```bash
wrangler deploy
```

部署成功後會顯示：
```
✨ Successfully published your Worker!
https://guangguang-ai.YOUR-SUBDOMAIN.workers.dev
```

---

## 🔧 自訂網域（可選）

如果想用 `api.spacebetweenhealing.com`：

1. 在 Cloudflare Dashboard 進入你的網域
2. Workers Routes → Add Route
3. 設定：
   - Route: `api.spacebetweenhealing.com/*`
   - Worker: `guangguang-ai`

然後在 `wrangler.toml` 取消註解 routes 設定。

---

## 📊 監控和日誌

### 查看即時日誌
```bash
wrangler tail
```

### 查看對話記錄
```bash
# 列出所有對話
wrangler kv:key list --namespace-id=YOUR_CHAT_LOGS_ID

# 查看特定對話
wrangler kv:key get "chat:SESSION_ID" --namespace-id=YOUR_CHAT_LOGS_ID
```

---

## 💰 費用

**Cloudflare Workers 免費額度**：
- 每天 100,000 次請求
- 對一般網站綽綽有餘

**Anthropic API**：
- Claude Sonnet: ~$3 / 1M input tokens, ~$15 / 1M output tokens
- 一次對話約 $0.01-0.05

---

## 🔒 安全功能

此 Worker 包含：

1. **CORS 保護** - 只允許你的網域存取
2. **Rate Limiting** - 每 IP 每小時 20 次請求
3. **API Key 隱藏** - 前端看不到 Key
4. **對話記錄** - 可追蹤所有互動

---

## ❓ 常見問題

### Q: 部署後 API 回傳 403？
A: 檢查 `worker.js` 中的 `ALLOWED_ORIGINS` 是否包含你的網域。

### Q: Rate Limit 太嚴格？
A: 修改 `CONFIG.RATE_LIMIT.MAX_REQUESTS`（預設 20 次/小時）

### Q: 想關閉對話記錄？
A: 移除 `wrangler.toml` 中的 `CHAT_LOGS` KV 設定即可。

---

## 📞 需要幫助？

聯繫：hello@spacebetweenhealing.com
