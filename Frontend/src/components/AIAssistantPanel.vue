<script setup lang="ts">
import { ref, computed } from 'vue'

const confidence = ref(87)
const showHeatmap = ref(false)
const activeTab = ref<'findings' | 'history'>('findings')

const aiFindings = [
  {
    id: 1,
    text: '右侧基底节区可见高密度影，约15×12mm，边界清晰',
    urgency: 'critical',
    confidence: 94,
    status: 'pending',
    region: '右侧基底节区',
  },
  {
    id: 2,
    text: '周围可见低密度水肿带，范围约3mm',
    urgency: 'high',
    confidence: 88,
    status: 'pending',
    region: '病灶周围',
  },
  {
    id: 3,
    text: '脑室系统轻度受压，中线结构轻微左移约2mm',
    urgency: 'moderate',
    confidence: 79,
    status: 'pending',
    region: '中线结构',
  },
  {
    id: 4,
    text: '其余脑实质密度正常，脑沟脑裂未见明显异常',
    urgency: 'low',
    confidence: 92,
    status: 'pending',
    region: '脑实质',
  },
]

const findingsData = ref(aiFindings)

const accept = (id: number) => {
  const f = findingsData.value.find(f => f.id === id)
  if (f) f.status = 'accepted'
}

const reject = (id: number) => {
  const f = findingsData.value.find(f => f.id === id)
  if (f) f.status = 'rejected'
}

const urgencyColor = (u: string) => {
  switch(u) {
    case 'critical': return 'badge-danger'
    case 'high': return 'badge-warning'
    case 'moderate': return 'badge-primary'
    default: return 'badge-success'
  }
}

const urgencyLabel = (u: string) => {
  switch(u) {
    case 'critical': return '危急'
    case 'high': return '高'
    case 'moderate': return '中'
    default: return '低'
  }
}

// Circular progress
const circumference = 2 * Math.PI * 36
const progressOffset = computed(() => circumference - (confidence.value / 100) * circumference)
</script>

<template>
  <div class="ai-panel">
    <div class="ai-header">
      <div class="ai-title-row">
        <div class="ai-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="var(--color-accent)" stroke-width="1.5"/>
            <circle cx="10" cy="10" r="3" fill="var(--color-accent)" opacity="0.3"/>
            <circle cx="10" cy="10" r="1.5" fill="var(--color-accent)"/>
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="var(--color-accent)" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <h3 class="panel-title">AI 辅助诊断</h3>
          <span class="text-xs text-muted">MedAI v3.2 · 深度学习模型</span>
        </div>
      </div>
    </div>

    <!-- Confidence Score -->
    <div class="confidence-section">
      <div class="confidence-circle">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="36" fill="none" stroke="var(--border-color)" stroke-width="6"/>
          <circle
            cx="44" cy="44" r="36"
            fill="none"
            stroke="var(--color-accent)"
            stroke-width="6"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            transform="rotate(-90 44 44)"
            style="transition: stroke-dashoffset 0.6s ease;"
          />
        </svg>
        <div class="confidence-text">
          <span class="confidence-value">{{ confidence }}</span>
          <span class="confidence-unit">%</span>
        </div>
      </div>
      <div class="confidence-info">
        <span class="font-medium">整体置信度</span>
        <span class="text-sm text-muted">基于 120 张切片分析</span>
        <span class="text-xs text-muted">处理时间: 2.3s</span>
      </div>
    </div>

    <!-- Heatmap Toggle -->
    <div class="heatmap-toggle">
      <label class="toggle-row">
        <span class="text-sm font-medium">热力图叠加</span>
        <button
          class="toggle-switch"
          :class="{ active: showHeatmap }"
          @click="showHeatmap = !showHeatmap"
          role="switch"
          :aria-checked="showHeatmap"
          aria-label="切换热力图"
        >
          <span class="toggle-knob"></span>
        </button>
      </label>
      <span class="text-xs text-muted">在影像上显示 AI 关注区域的概率热力图</span>
    </div>

    <div class="divider" style="margin: var(--space-3) var(--space-4);"></div>

    <!-- Tabs -->
    <div class="section-tabs" style="padding: 0 var(--space-4);">
      <button
        class="section-tab"
        :class="{ active: activeTab === 'findings' }"
        @click="activeTab = 'findings'"
      >AI 发现 ({{ findingsData.length }})</button>
      <button
        class="section-tab"
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'"
      >分析历史</button>
    </div>

    <!-- Findings List -->
    <div v-if="activeTab === 'findings'" class="findings-list">
      <div
        v-for="finding in findingsData"
        :key="finding.id"
        class="finding-card"
        :class="{ accepted: finding.status === 'accepted', rejected: finding.status === 'rejected' }"
      >
        <div class="finding-header">
          <span class="badge" :class="urgencyColor(finding.urgency)">
            {{ urgencyLabel(finding.urgency) }}
          </span>
          <span class="finding-confidence text-xs">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="margin-right: 2px;">
              <circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1"/>
            </svg>
            {{ finding.confidence }}%
          </span>
        </div>
        <p class="finding-text">{{ finding.text }}</p>
        <span class="finding-region text-xs text-muted">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="margin-right: 2px;">
            <circle cx="5" cy="5" r="3" stroke="currentColor" stroke-width="1"/>
            <circle cx="5" cy="5" r="1" fill="currentColor"/>
          </svg>
          {{ finding.region }}
        </span>

        <div v-if="finding.status === 'pending'" class="finding-actions">
          <button class="btn btn-sm btn-accent" @click="accept(finding.id)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            采纳
          </button>
          <button class="btn btn-sm btn-ghost" @click="reject(finding.id)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            忽略
          </button>
        </div>
        <div v-else class="finding-status">
          <span v-if="finding.status === 'accepted'" class="badge badge-accent">已采纳</span>
          <span v-else class="badge" style="background: var(--bg-hover); color: var(--text-muted);">已忽略</span>
        </div>
      </div>
    </div>

    <!-- History Tab -->
    <div v-if="activeTab === 'history'" class="analysis-history">
      <div class="history-entry">
        <span class="text-xs text-muted">2026-03-30 14:32</span>
        <span class="text-sm">CT 头部分析 - 检测到异常 (4项)</span>
        <span class="badge badge-danger text-xs">危急</span>
      </div>
      <div class="history-entry">
        <span class="text-xs text-muted">2026-02-14 10:15</span>
        <span class="text-sm">MRI 脑部分析 - 未见明显异常</span>
        <span class="badge badge-success text-xs">正常</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.ai-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.ai-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.ai-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-light);
  border-radius: var(--radius-lg);
}

.panel-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 2px;
}

/* Confidence Circle */
.confidence-section {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.confidence-circle {
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;
}

.confidence-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confidence-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
}

.confidence-unit {
  font-size: var(--font-size-sm);
  color: var(--color-accent);
  margin-top: 4px;
}

.confidence-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Heatmap Toggle */
.heatmap-toggle {
  padding: 0 var(--space-4);
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 4px;
}

.toggle-switch {
  width: 40px;
  height: 22px;
  background: var(--border-color);
  border-radius: var(--radius-full);
  position: relative;
  transition: background var(--transition-fast);
  padding: 0;
}

.toggle-switch.active {
  background: var(--color-accent);
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: transform var(--transition-fast);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-switch.active .toggle-knob {
  transform: translateX(18px);
}

/* Section Tabs (reuse from DiagnosticPanel) */
.section-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.section-tab {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all var(--transition-fast);
}

.section-tab:hover {
  color: var(--text-primary);
}

.section-tab.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

/* Findings */
.findings-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.finding-card {
  padding: var(--space-3);
  background: var(--bg-input);
  border-radius: var(--radius-lg);
  border-left: 3px solid transparent;
  transition: all var(--transition-fast);
}

.finding-card:hover {
  background: var(--bg-hover);
}

.finding-card.accepted {
  border-left-color: var(--color-accent);
  opacity: 0.85;
}

.finding-card.rejected {
  border-left-color: var(--text-muted);
  opacity: 0.5;
}

.finding-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.finding-confidence {
  display: flex;
  align-items: center;
  color: var(--text-muted);
}

.finding-text {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin-bottom: var(--space-2);
}

.finding-region {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-2);
}

.finding-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.finding-status {
  margin-top: var(--space-2);
}

/* Analysis History */
.analysis-history {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.history-entry {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-3);
  background: var(--bg-input);
  border-radius: var(--radius-lg);
}

.history-entry .badge {
  align-self: flex-start;
}
</style>
