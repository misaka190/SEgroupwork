<script setup lang="ts">
import { ref } from 'vue'
import AIAssistantPanel from '@/components/AIAssistantPanel.vue'

const activeDemo = ref<'overview' | 'detail'>('overview')
</script>

<template>
  <div class="ai-page">
    <div class="ai-page-header">
      <div>
        <h2 class="text-xl font-semibold">AI 辅助诊断中心</h2>
        <p class="text-sm text-muted">基于深度学习的智能影像分析系统</p>
      </div>
      <div class="ai-page-actions">
        <button class="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          新建分析
        </button>
        <button class="btn btn-secondary">分析历史</button>
      </div>
    </div>

    <div class="ai-page-body">
      <!-- Left: stats & info -->
      <div class="ai-stats-section">
        <!-- Model Info Card -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-sm font-semibold">模型信息</h3>
            <span class="badge badge-accent">在线</span>
          </div>
          <div class="card-body">
            <div class="model-info-grid">
              <div class="mi-item">
                <span class="text-xs text-muted">模型名称</span>
                <span class="text-sm font-medium">MedAI-CT v3.2</span>
              </div>
              <div class="mi-item">
                <span class="text-xs text-muted">训练数据</span>
                <span class="text-sm font-medium">1.2M 影像</span>
              </div>
              <div class="mi-item">
                <span class="text-xs text-muted">准确率</span>
                <span class="text-sm font-medium">96.8%</span>
              </div>
              <div class="mi-item">
                <span class="text-xs text-muted">平均响应</span>
                <span class="text-sm font-medium">2.1s</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Analyses -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-sm font-semibold">最近分析</h3>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="recent-list">
              <div class="recent-item active-item">
                <div class="ri-left">
                  <div class="ri-indicator urgent"></div>
                  <div class="ri-info">
                    <span class="text-sm font-medium">王建国 - CT 头部</span>
                    <span class="text-xs text-muted">2026-03-30 14:32 · 发现 4 项异常</span>
                  </div>
                </div>
                <span class="badge badge-danger">危急</span>
              </div>
              <div class="recent-item">
                <div class="ri-left">
                  <div class="ri-indicator normal"></div>
                  <div class="ri-info">
                    <span class="text-sm font-medium">刘芳 - MRI 脑部</span>
                    <span class="text-xs text-muted">2026-03-30 13:15 · 未见明显异常</span>
                  </div>
                </div>
                <span class="badge badge-success">正常</span>
              </div>
              <div class="recent-item">
                <div class="ri-left">
                  <div class="ri-indicator warning"></div>
                  <div class="ri-info">
                    <span class="text-sm font-medium">陈明 - CT 胸部</span>
                    <span class="text-xs text-muted">2026-03-30 11:48 · 发现 2 项异常</span>
                  </div>
                </div>
                <span class="badge badge-warning">注意</span>
              </div>
              <div class="recent-item">
                <div class="ri-left">
                  <div class="ri-indicator normal"></div>
                  <div class="ri-info">
                    <span class="text-sm font-medium">李红 - X-Ray 胸部</span>
                    <span class="text-xs text-muted">2026-03-29 16:22 · 未见明显异常</span>
                  </div>
                </div>
                <span class="badge badge-success">正常</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-sm font-semibold">今日分析统计</h3>
          </div>
          <div class="card-body">
            <div class="perf-grid">
              <div class="perf-item">
                <div class="perf-bar-track">
                  <div class="perf-bar" style="width: 85%; background: var(--color-primary);"></div>
                </div>
                <div class="perf-label">
                  <span class="text-xs">已分析</span>
                  <span class="text-xs font-semibold">34/40</span>
                </div>
              </div>
              <div class="perf-item">
                <div class="perf-bar-track">
                  <div class="perf-bar" style="width: 92%; background: var(--color-accent);"></div>
                </div>
                <div class="perf-label">
                  <span class="text-xs">医生采纳率</span>
                  <span class="text-xs font-semibold">92%</span>
                </div>
              </div>
              <div class="perf-item">
                <div class="perf-bar-track">
                  <div class="perf-bar" style="width: 15%; background: var(--color-danger);"></div>
                </div>
                <div class="perf-label">
                  <span class="text-xs">检出异常率</span>
                  <span class="text-xs font-semibold">15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Active AI Panel -->
      <div class="ai-active-panel card">
        <AIAssistantPanel />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-page {
  padding: var(--space-6);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.ai-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.ai-page-actions {
  display: flex;
  gap: var(--space-2);
}

.ai-page-body {
  display: flex;
  gap: var(--space-6);
  flex: 1;
  min-height: 0;
}

.ai-stats-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow-y: auto;
}

.ai-active-panel {
  width: 380px;
  flex-shrink: 0;
  overflow: hidden;
}

/* Model Info Grid */
.model-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.mi-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Recent List */
.recent-list {
  display: flex;
  flex-direction: column;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-6);
  border-bottom: 1px solid var(--border-color);
  transition: background var(--transition-fast);
  cursor: pointer;
}

.recent-item:hover {
  background: var(--bg-hover);
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item.active-item {
  background: var(--color-primary-light);
}

.ri-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.ri-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ri-indicator.urgent { background: var(--color-danger); }
.ri-indicator.warning { background: var(--color-warning); }
.ri-indicator.normal { background: var(--color-success); }

.ri-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Performance Metrics */
.perf-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.perf-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.perf-bar-track {
  width: 100%;
  height: 6px;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.perf-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.perf-label {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 1279px) {
  .ai-page-body {
    flex-direction: column;
  }
  .ai-active-panel {
    width: 100%;
    max-height: 500px;
  }
}
</style>
