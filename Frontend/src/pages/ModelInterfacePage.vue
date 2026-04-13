<script setup lang="ts">
import { computed, ref } from 'vue'

const gatewayUrl = ref('https://api.clinicalnexus.ai/v2/inference')
const accessProtocol = ref('Bearer 令牌 (JWT)')
const region = ref('美东一区（高可用）')
const apiKey = ref('••••••••••••••••••••••••••')
const showKey = ref(false)

const requestPayload = ref(`{
  "request_id": "RX-7729-CLN",
  "patient_context": {
    "modality": "CT_SCAN",
    "anatomical_region": "THORAX",
    "contrast_enhanced": true
  },
  "inference_params": {
    "confidence_threshold": 0.85,
    "segmentation_enabled": true,
    "multi_path_review": false,
    "denoise_filter": "median_3x3"
  },
  "metadata": {
    "priority": "STAT",
    "reviewer_id": 22910
  }
}`)

const logs = ref([
  { time: '[14:22:10]', level: 'INFO', message: '正在与主网关建立握手连接...' },
  { time: '[14:22:11]', level: 'SUCCESS', message: '已连接到 10.0.1.254:8443（会话 ID：449x-cc2）' },
  { time: '[14:22:12]', level: 'WARN', message: '美东区域检测到延迟抖动（+110ms）' },
  { time: '[14:22:15]', level: 'INFO', message: '负载校验完成，可开始推理。' },
])

const maskedApiKey = computed(() => (showKey.value ? 'ck_live_9h2m_kz81_4aa20e7b31' : apiKey.value))
</script>

<template>
  <section class="brand-page model-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">集成工作台</p>
        <div class="title-row">
          <h1 class="page-title">临床影像分析模型 v2.1</h1>
          <span class="status-badge">已启用</span>
        </div>
        <p class="page-desc">用于核心推理链路的配置管理、负载校验与网关运行控制。</p>
      </div>

      <div class="page-actions">
        <button type="button" class="secondary-button">撤销更改</button>
        <button type="button" class="primary-button">保存配置</button>
      </div>
    </div>

    <div class="model-grid">
      <div class="left-column">
        <article class="card-shell config-card">
          <div class="panel-title-row">
            <div>
              <p class="panel-kicker">接口配置</p>
              <h2>生产网关</h2>
            </div>
          </div>

          <div class="form-stack">
            <div class="field-group field-group-wide">
              <label>生产网关地址</label>
              <div class="input-shell">
                <span class="method-pill">POST</span>
                <input v-model="gatewayUrl" type="text" aria-label="网关地址" />
                <button type="button" class="mini-action" aria-label="复制网关地址">⧉</button>
              </div>
            </div>

            <div class="field-grid">
              <div class="field-group">
                <label>访问协议</label>
                <select v-model="accessProtocol" aria-label="访问协议">
                  <option>Bearer 令牌 (JWT)</option>
                  <option>OAuth 2.0</option>
                  <option>mTLS 服务认证</option>
                </select>
              </div>

              <div class="field-group">
                <label>部署区域</label>
                <select v-model="region" aria-label="部署区域">
                  <option>美东一区（高可用）</option>
                  <option>欧洲西二区（监管）</option>
                  <option>亚太新加坡一区</option>
                </select>
              </div>
            </div>

            <div class="field-group field-group-wide">
              <div class="label-row">
                <label>当前 API 密钥</label>
                <button type="button" class="text-link">轮换密钥</button>
              </div>
              <div class="input-shell">
                <input :value="maskedApiKey" type="text" readonly aria-label="当前 API 密钥" />
                <button type="button" class="mini-action" @click="showKey = !showKey" :aria-label="showKey ? '隐藏 API 密钥' : '显示 API 密钥'">◔</button>
              </div>
            </div>
          </div>
        </article>

        <article class="card-shell runner-card">
          <div class="runner-head">
            <div>
              <p class="panel-kicker">测试运行器</p>
              <h2>推理沙箱</h2>
            </div>
            <button type="button" class="primary-button compact-button">运行推理</button>
          </div>

          <div class="runner-meta">
            <span><i class="dot dot-green"></i>服务在线</span>
            <span><i class="dot dot-blue"></i>平均延迟：420ms</span>
            <span><i class="dot dot-slate"></i>模型显存：14.2 GB</span>
          </div>
        </article>
      </div>

      <article class="payload-card">
        <div class="payload-head">
          <div>
            <span class="payload-kicker">请求负载（JSON）</span>
            <strong>已校验传输体</strong>
          </div>
          <span class="payload-meta">UTF-8</span>
        </div>

        <div class="payload-body">
          <div class="line-numbers">
            <span v-for="line in 18" :key="line">{{ line }}</span>
          </div>
          <pre>{{ requestPayload }}</pre>
        </div>

        <div class="payload-footer">
          <span><i class="dot dot-green"></i>JSON 有效</span>
          <span><i class="dot dot-slate"></i>大小：1.2 KB</span>
        </div>
      </article>
    </div>

    <article class="logs-card">
      <div class="logs-head">
        <div class="logs-tabs">
          <span class="tab active">实时日志</span>
          <span class="tab">历史记录</span>
        </div>
        <div class="logs-tools">
          <button type="button" class="logs-tool" aria-label="清空日志">⌫</button>
          <button type="button" class="logs-tool" aria-label="展开日志">⤢</button>
        </div>
      </div>

      <div class="logs-body">
        <div v-for="entry in logs" :key="entry.time + entry.message" class="log-line">
          <span class="log-time">{{ entry.time }}</span>
          <span class="log-level" :class="`level-${entry.level.toLowerCase()}`">{{ entry.level }}</span>
          <span class="log-message">{{ entry.message }}</span>
        </div>
        <div class="log-tail">正在监听请求...</div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.brand-page {
  height: 100%;
  padding: 24px;
  overflow: auto;
  background:
    radial-gradient(circle at top left, rgba(22, 89, 193, 0.08), transparent 18%),
    linear-gradient(180deg, #f7f9fc 0%, #eef3fa 100%);
}

.page-head,
.page-actions,
.title-row,
.model-grid,
.panel-title-row,
.field-grid,
.label-row,
.runner-head,
.runner-meta,
.payload-head,
.payload-footer,
.logs-head,
.logs-tabs,
.logs-tools,
.log-line,
.input-shell {
  display: flex;
  align-items: center;
}

.page-head {
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.eyebrow,
.panel-kicker,
.field-group label,
.payload-kicker,
.tab {
  color: #6b7280;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.page-title {
  margin: 6px 0;
  font-size: 40px;
  line-height: 1;
  font-weight: 800;
  color: #111827;
}

.page-desc {
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.6;
}

.title-row { gap: 12px; }
.page-actions { gap: 12px; }

.primary-button,
.secondary-button,
.compact-button,
.mini-action,
.text-link,
.logs-tool {
  border: none;
  cursor: pointer;
}

.primary-button,
.secondary-button {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
}

.compact-button { min-height: 40px; }

.primary-button {
  background: linear-gradient(135deg, #1659c1, #0f4fa8);
  color: #fff;
  box-shadow: 0 16px 28px rgba(22, 89, 193, 0.18);
}

.secondary-button {
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.status-badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: #e8efff;
  color: #1659c1;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.model-grid { gap: 20px; }

.left-column {
  flex: 1.02;
  display: grid;
  gap: 20px;
}

.card-shell,
.logs-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(230, 237, 245, 0.95);
  border-radius: 22px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
}

.config-card,
.runner-card {
  padding: 20px;
}

.payload-card {
  flex: 0.78;
  min-width: 340px;
  background: #121a2d;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 28px 54px rgba(15, 23, 42, 0.22);
}

.panel-title-row,
.runner-head {
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.panel-title-row h2,
.runner-head h2 {
  margin: 4px 0 0;
  font-size: 18px;
  color: #111827;
  font-weight: 800;
}

.form-stack {
  display: grid;
  gap: 18px;
}

.field-group {
  display: grid;
  gap: 8px;
}

.field-group-wide {
  grid-column: 1 / -1;
}

.field-grid { gap: 14px; }
.field-grid > * { flex: 1; }

.input-shell,
.field-group select {
  min-height: 48px;
  border: 1px solid #e5edf5;
  border-radius: 14px;
  background: #f8fbff;
}

.input-shell input,
.field-group select {
  width: 100%;
  border: none;
  background: transparent;
  color: #334155;
  box-shadow: none;
}

.input-shell input {
  padding: 0 14px;
}

.field-group select {
  padding: 0 14px;
  font-weight: 600;
}

.method-pill {
  padding: 0 12px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 800;
}

.mini-action {
  width: 46px;
  height: 46px;
  border-left: 1px solid #e5edf5;
  background: rgba(15, 23, 42, 0.02);
  color: #64748b;
}

.label-row { justify-content: space-between; }
.text-link { background: transparent; color: #1659c1; font-size: 12px; font-weight: 700; }

.runner-meta {
  gap: 18px;
  flex-wrap: wrap;
  color: #64748b;
  font-size: 12px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  display: inline-block;
  margin-right: 6px;
}

.dot-green { background: #22c55e; }
.dot-blue { background: #60a5fa; }
.dot-slate { background: #64748b; }

.payload-head {
  justify-content: space-between;
  padding: 16px 18px;
  background: #1d273a;
  color: #e5edf9;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.payload-head strong,
.payload-meta {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.payload-body {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  min-height: 460px;
  padding: 18px 0;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  padding-right: 12px;
  color: #5a6780;
  font-size: 12px;
  font-family: Consolas, 'Courier New', monospace;
}

.payload-body pre {
  margin: 0;
  padding: 0 20px 0 0;
  color: #d9e5ff;
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 1.6;
  font-family: Consolas, 'Courier New', monospace;
}

.payload-footer {
  justify-content: space-between;
  padding: 14px 18px;
  color: #9db0cf;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12px;
}

.logs-card {
  margin-top: 22px;
  overflow: hidden;
  background: #10192b;
  border-color: #1e293b;
}

.logs-head {
  justify-content: space-between;
  padding: 12px 16px;
  background: #1d273a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.logs-tabs,
.logs-tools { gap: 16px; }
.logs-tools { gap: 6px; }

.tab { color: #64748b; }
.tab.active { color: #fff; }

.logs-tool {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
}

.logs-body {
  padding: 16px;
  color: #a7b6cd;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 12px;
}

.log-line { gap: 10px; margin-bottom: 6px; }
.log-time { color: #64748b; }
.log-level { font-weight: 800; }
.level-info { color: #60a5fa; }
.level-success { color: #4ade80; }
.level-warn { color: #f59e0b; }
.log-message { color: #d3deef; }
.log-tail { margin-top: 10px; color: #64748b; font-style: italic; }

@media (max-width: 1200px) {
  .model-grid { flex-direction: column; }
  .payload-card { min-width: 0; }
}

@media (max-width: 820px) {
  .page-head,
  .runner-head,
  .field-grid { flex-direction: column; align-items: stretch; }
  .page-actions { flex-direction: column; }
}

@media (max-width: 640px) {
  .brand-page { padding: 16px; }
  .page-title { font-size: 32px; }
  .payload-body { grid-template-columns: 30px minmax(0, 1fr); min-height: 340px; }
}
</style>