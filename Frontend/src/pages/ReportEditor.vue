<script setup lang="ts">
import { computed, ref } from 'vue'

type ReportSection = 'findings' | 'diagnosis' | 'suggestions'

interface TemplateItem {
  id: string
  label: string
  category: 'CT' | 'MRI' | 'X-Ray'
}

interface InsightMetric {
  label: string
  value: string
}

const reportSections: Array<{ key: ReportSection; label: string; helper: string }> = [
  { key: 'findings', label: '影像所见', helper: '影像所见' },
  { key: 'diagnosis', label: '诊断意见', helper: '诊断意见' },
  { key: 'suggestions', label: '处理建议', helper: '建议' },
]

const templateSearch = ref('')
const activeSection = ref<ReportSection>('findings')
const activeTemplateId = ref('ct-head-hemorrhage')

const patient = {
  name: '王建国',
  recordId: 'P20260045',
  age: 58,
  gender: '男',
  exam: '放射科',
  studyDate: '2026-10-24',
  modality: 'CT',
}

const templates: TemplateItem[] = [
  { id: 'ct-head-normal', label: 'CT头部 - 正常', category: 'CT' },
  { id: 'ct-head-hemorrhage', label: 'CT头部 - 脑出血', category: 'CT' },
  { id: 'ct-head-nodule', label: 'CT胸部 - 肺结节', category: 'CT' },
  { id: 'mri-brain-normal', label: 'MRI脑部 - 正常', category: 'MRI' },
  { id: 'mri-lumbar-disc', label: 'MRI腰椎 - 间盘突出', category: 'MRI' },
  { id: 'xray-lung-normal', label: 'X-Ray胸片 - 正常', category: 'X-Ray' },
]

const reportContent = ref({
  findings: [
    '左侧基底节区可见一类圆形高密度影，边界清晰，大小约 2.4cm × 1.8cm。',
    '周围可见薄层低密度水肿带，中线结构略向右侧偏移。',
    '脑室系统未见明显扩张，脑沟、脑裂未见明显增宽。',
  ].join('\n\n'),
  diagnosis: [
    '[AI 模型洞察] 检测到颅内出血的概率为 98.2%。',
    '预估体积为 12.4ml。建议结合急诊临床表现与既往影像进一步评估。',
  ].join('\n\n'),
  suggestions: [
    '建议立即行神经外科会诊。',
    '6 小时内复查 CT，动态观察血肿体积变化。',
    '同步评估凝血功能及血压控制策略。',
  ].join('\n\n'),
})

const metrics: InsightMetric[] = [
  { label: '模型精度', value: '99.4%' },
  { label: '置信评分', value: '高' },
  { label: '处理耗时', value: '1.2秒' },
  { label: '增强期相', value: '动脉期' },
]

const filteredTemplates = computed(() => {
  const query = templateSearch.value.trim().toLowerCase()
  if (!query) return templates

  return templates.filter((item) => {
    return item.label.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
  })
})

const groupedTemplates = computed(() => {
  return ['CT', 'MRI', 'X-Ray'].map((category) => ({
    category,
    items: filteredTemplates.value.filter((item) => item.category === category),
  }))
})

function selectTemplate(templateId: string) {
  activeTemplateId.value = templateId
}

function setActiveSection(section: ReportSection) {
  activeSection.value = section
}
</script>

<template>
  <div class="report-page">
    <aside class="template-panel card-shell">
      <div class="panel-head">
        <div>
          <p class="eyebrow">报告模板</p>
          <h2>结构化草稿</h2>
        </div>
        <button class="icon-button" type="button" aria-label="筛选模板">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M7 12h10M10 17h4" />
          </svg>
        </button>
      </div>

      <label class="search-box">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.5 18a7.5 7.5 0 1 1 5.303-2.197L20 20" />
        </svg>
        <input v-model="templateSearch" type="text" placeholder="搜索模板..." />
      </label>

      <div class="template-groups">
        <section v-for="group in groupedTemplates" :key="group.category" class="template-group">
          <div class="group-title">{{ group.category }} 模态</div>
          <button
            v-for="item in group.items"
            :key="item.id"
            type="button"
            class="template-item"
            :class="{ active: activeTemplateId === item.id }"
            @click="selectTemplate(item.id)"
          >
            <span>{{ item.label }}</span>
            <svg v-if="activeTemplateId === item.id" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <p v-if="!group.items.length" class="group-empty">当前无可用模板</p>
        </section>
      </div>
    </aside>

    <main class="report-stage">
      <section class="patient-strip card-shell">
        <div class="patient-avatar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.314 0-6 1.79-6 4v1h12v-1c0-2.21-2.686-4-6-4Z" />
          </svg>
        </div>

        <div class="patient-summary">
          <div class="patient-primary">
            <h1>{{ patient.name }}</h1>
            <span class="record-chip">{{ patient.recordId }}</span>
          </div>

          <div class="patient-meta-grid">
            <div>
              <span class="meta-label">岁 / 性别</span>
              <strong>{{ patient.age }} / {{ patient.gender }}</strong>
            </div>
            <div>
              <span class="meta-label">检查日期</span>
              <strong>{{ patient.studyDate }}</strong>
            </div>
            <div>
              <span class="meta-label">科室</span>
              <strong>{{ patient.exam }}</strong>
            </div>
          </div>
        </div>

        <div class="patient-actions">
          <button class="icon-button" type="button" aria-label="刷新">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.343-5.657M20 4v6h-6" />
            </svg>
          </button>
          <button class="icon-button" type="button" aria-label="分享报告">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 12v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-7M12 16V4M8 8l4-4 4 4" />
            </svg>
          </button>
        </div>
      </section>

      <section class="editor-shell card-shell">
        <nav class="report-tabs">
          <button
            v-for="section in reportSections"
            :key="section.key"
            type="button"
            class="tab-button"
            :class="{ active: activeSection === section.key }"
            @click="setActiveSection(section.key)"
          >
            <span>{{ section.label }}</span>
            <small>{{ section.helper }}</small>
          </button>
        </nav>

        <div class="toolbar-row">
          <div class="toolbar-group">
            <button class="tool-button" type="button">B</button>
            <button class="tool-button" type="button"><em>I</em></button>
            <button class="tool-button" type="button">≣</button>
            <button class="tool-button" type="button">☰</button>
          </div>
          <div class="toolbar-group right-tools">
            <button class="ghost-pill" type="button">插入关键词</button>
            <button class="ghost-pill" type="button">插入测量值</button>
          </div>
        </div>

        <div class="editor-body">
          <textarea
            v-if="activeSection === 'findings'"
            v-model="reportContent.findings"
            class="report-input"
          />
          <textarea
            v-else-if="activeSection === 'diagnosis'"
            v-model="reportContent.diagnosis"
            class="report-input"
          />
          <textarea
            v-else
            v-model="reportContent.suggestions"
            class="report-input"
          />

          <div class="volume-chip">VOL: 12.4ML</div>
        </div>
      </section>

      <footer class="editor-footer card-shell">
        <div class="footer-block">
          <span class="meta-label">诊断医生</span>
          <strong>张医生</strong>
        </div>
        <div class="footer-block muted">
          <span class="meta-label">复核医生</span>
          <strong>等待签名...</strong>
        </div>
        <div class="footer-actions">
          <button class="secondary-button" type="button">保存草稿</button>
          <button class="secondary-button" type="button">预览</button>
          <button class="primary-button" type="button">提交报告</button>
        </div>
      </footer>
    </main>

    <aside class="insights-panel">
      <section class="insight-card card-shell">
        <p class="eyebrow">AI 分析洞察</p>

        <div class="image-placeholder" aria-hidden="true">
          <svg viewBox="0 0 280 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="emptyFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#162b55" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="280" height="220" rx="18" fill="url(#emptyFrame)" />
            <rect x="32" y="28" width="216" height="164" rx="14" fill="none" stroke="rgba(148, 163, 184, 0.35)" stroke-dasharray="8 8" />
            <circle cx="140" cy="110" r="34" fill="none" stroke="rgba(226, 232, 240, 0.7)" stroke-width="1.5" />
            <path d="M140 58v26M140 136v26M88 110h26M166 110h26" stroke="rgba(226, 232, 240, 0.7)" stroke-width="1.5" stroke-linecap="round" />
            <path d="M95 76l90 68M185 76l-90 68" stroke="rgba(59, 130, 246, 0.25)" stroke-width="1" />
            <rect x="106" y="96" width="68" height="28" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" />
            <text x="140" y="114" text-anchor="middle" fill="rgba(226,232,240,0.82)" font-size="11" font-family="Segoe UI, Arial, sans-serif">暂无图像预览</text>
          </svg>
        </div>

        <p class="insight-alert">
          <span class="alert-dot"></span>
          占位画布已准备，可关联检查帧预览
        </p>

        <div class="metric-card">
          <div class="metric-top">
            <span>模型精度</span>
            <strong>99.4%</strong>
          </div>
          <div class="metric-bar">
            <span></span>
          </div>
        </div>

        <div class="metric-list">
          <div v-for="metric in metrics.slice(1)" :key="metric.label" class="metric-row">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
          </div>
        </div>
      </section>

      <button class="compare-card card-shell" type="button">
        <span class="compare-plus">+</span>
        <span>与既往检查对比</span>
      </button>
    </aside>
  </div>
</template>

<style scoped>
.report-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 300px;
  gap: 0;
  min-height: calc(100vh - var(--header-height));
  background: linear-gradient(180deg, #f7f9fc 0%, #f3f7fb 100%);
}

.card-shell {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.05);
}

.template-panel,
.report-stage,
.insights-panel {
  min-height: calc(100vh - var(--header-height));
}

.template-panel {
  padding: 18px 18px 22px;
  border-radius: 0;
  border-left: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-head,
.patient-strip,
.toolbar-row,
.metric-top,
.metric-row,
.footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-head h2,
.patient-primary h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.eyebrow {
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.16em;
  font-weight: 700;
  color: #94a3b8;
}

.icon-button,
.tool-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe5f0;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.icon-button {
  width: 36px;
  height: 36px;
  border-radius: 12px;
}

.icon-button svg,
.search-box svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon-button:hover,
.tool-button:hover,
.template-item:hover,
.tab-button:hover,
.ghost-pill:hover,
.secondary-button:hover,
.compare-card:hover {
  border-color: #c7d8ef;
  background: #f8fbff;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f7f9fc;
  border: 1px solid #e6edf5;
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;
  color: #1e293b;
}

.template-groups {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.group-title {
  margin-bottom: 10px;
  font-size: 11px;
  letter-spacing: 0.14em;
  font-weight: 700;
  color: #8da2c2;
}

.template-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 12px;
  border: 1px solid transparent;
  border-radius: 0 12px 12px 0;
  background: transparent;
  color: #334155;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}

.template-item + .template-item {
  margin-top: 4px;
}

.template-item.active {
  background: #ffffff;
  color: #1d4ed8;
  border-color: #d7e5ff;
  box-shadow: inset 3px 0 0 #1d4ed8;
}

.template-item svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.group-empty {
  margin: 8px 0 0;
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
}

.report-stage {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-width: 0;
}

.patient-strip,
.editor-shell,
.editor-footer,
.insight-card,
.compare-card {
  border-radius: 0;
}

.patient-strip,
.editor-shell,
.editor-footer {
  border-left: 0;
  border-top: 0;
}

.patient-strip {
  gap: 18px;
  padding: 22px 24px;
}

.patient-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #eef4ff 0%, #e2ebff 100%);
  color: #1d4ed8;
  flex-shrink: 0;
}

.patient-avatar svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.patient-summary {
  min-width: 0;
  flex: 1;
}

.patient-primary {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.record-chip {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef2f7;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.patient-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.meta-label {
  display: block;
  margin-bottom: 5px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.patient-meta-grid strong,
.footer-block strong,
.metric-row strong,
.metric-top strong {
  color: #0f172a;
  font-size: 14px;
}

.patient-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-shell {
  display: grid;
  grid-template-rows: auto auto 1fr;
  min-height: 0;
}

.report-tabs {
  display: flex;
  gap: 28px;
  padding: 18px 24px 0;
  border-bottom: 1px solid #edf2f7;
}

.tab-button {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 0 14px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
}

.tab-button span {
  font-size: 15px;
  font-weight: 700;
}

.tab-button small {
  font-size: 12px;
}

.tab-button.active {
  color: #1d4ed8;
  border-bottom-color: #1d4ed8;
}

.toolbar-row {
  padding: 16px 24px;
  border-bottom: 1px solid #edf2f7;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tool-button {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-weight: 700;
}

.right-tools {
  gap: 12px;
}

.ghost-pill,
.secondary-button,
.primary-button {
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ghost-pill,
.secondary-button {
  border: 1px solid #dbe5f0;
  background: #fff;
  color: #1e3a8a;
}

.primary-button {
  border: 1px solid #1659c1;
  background: linear-gradient(135deg, #1d4ed8 0%, #1659c1 100%);
  color: #fff;
  box-shadow: 0 16px 30px rgba(22, 89, 193, 0.22);
}

.primary-button:hover {
  background: linear-gradient(135deg, #1b46c2 0%, #124ba7 100%);
}

.editor-body {
  position: relative;
  padding: 20px 24px 26px;
  min-height: 0;
}

.report-input {
  width: 100%;
  min-height: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.9;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.volume-chip {
  position: absolute;
  right: 24px;
  bottom: 18px;
  padding: 7px 12px;
  border-radius: 10px;
  background: #f8fbff;
  border: 1px solid #cfe0ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
}

.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 24px;
}

.footer-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-block.muted strong {
  color: #94a3b8;
  font-weight: 500;
}

.insights-panel {
  display: grid;
  grid-template-rows: 1fr auto;
  border-left: 1px solid rgba(226, 232, 240, 0.9);
}

.insight-card {
  padding: 20px;
  border-top: 0;
  border-right: 0;
  border-bottom: 0;
}

.image-placeholder {
  margin-top: 12px;
  border-radius: 18px;
  overflow: hidden;
  background: #0f172a;
}

.image-placeholder svg {
  display: block;
  width: 100%;
  height: auto;
}

.insight-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 18px;
  color: #334155;
  font-size: 13px;
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f87171;
}

.metric-card {
  padding: 14px 14px 16px;
  border-radius: 16px;
  background: #f8fbff;
  border: 1px solid #e6edf7;
}

.metric-top span,
.metric-row span,
.compare-card span:last-child {
  color: #64748b;
  font-size: 13px;
}

.metric-bar {
  margin-top: 10px;
  height: 6px;
  border-radius: 999px;
  background: #dbeafe;
  overflow: hidden;
}

.metric-bar span {
  display: block;
  width: 99.4%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
}

.metric-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.compare-card {
  margin: 0 20px 20px;
  padding: 22px 18px;
  border: 1px dashed #cbd5e1;
  background: rgba(255, 255, 255, 0.72);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.compare-plus {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eef4ff;
  color: #3b82f6;
  font-size: 18px;
  font-weight: 700;
}

@media (max-width: 1320px) {
  .report-page {
    grid-template-columns: 240px minmax(0, 1fr) 280px;
  }

  .patient-meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1080px) {
  .report-page {
    grid-template-columns: 1fr;
  }

  .template-panel,
  .insights-panel,
  .patient-strip,
  .editor-shell,
  .editor-footer,
  .insight-card,
  .compare-card {
    border-left: 1px solid rgba(226, 232, 240, 0.9);
    border-right: 1px solid rgba(226, 232, 240, 0.9);
  }

  .insights-panel {
    border-left: 0;
  }
}

@media (max-width: 768px) {
  .patient-strip,
  .editor-footer,
  .toolbar-row {
    flex-direction: column;
    align-items: stretch;
  }

  .patient-meta-grid {
    grid-template-columns: 1fr;
  }

  .report-tabs {
    gap: 18px;
    overflow-x: auto;
  }

  .footer-actions {
    width: 100%;
    justify-content: stretch;
  }

  .secondary-button,
  .primary-button {
    flex: 1;
  }
}
</style>