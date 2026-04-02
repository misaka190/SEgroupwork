<script setup lang="ts">
import { ref } from 'vue'
import ImageViewer from '@/components/ImageViewer.vue'
import PatientInfoCard from '@/components/PatientInfoCard.vue'
import DiagnosticPanel from '@/components/DiagnosticPanel.vue'
import AIAssistantPanel from '@/components/AIAssistantPanel.vue'

const rightPanel = ref<'diagnostic' | 'ai'>('diagnostic')
const showRightPanel = ref(true)
</script>

<template>
  <div class="workspace">
    <!-- Left: Patient Info + Image Viewer -->
    <div class="workspace-main">
      <!-- Patient Info Bar (top) -->
      <div class="workspace-patient-bar">
        <PatientInfoCard />
      </div>

      <!-- Image Viewer -->
      <div class="workspace-viewer">
        <ImageViewer />
      </div>
    </div>

    <!-- Right: Diagnostic or AI Panel -->
    <div class="workspace-right" :class="{ hidden: !showRightPanel }">
      <div class="right-panel-tabs">
        <button
          class="rp-tab"
          :class="{ active: rightPanel === 'diagnostic' }"
          @click="rightPanel = 'diagnostic'"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M5 5h4M5 7h4M5 9h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          报告
        </button>
        <button
          class="rp-tab"
          :class="{ active: rightPanel === 'ai' }"
          @click="rightPanel = 'ai'"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.2"/>
            <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
            <path d="M7 2v1M7 11v1M2 7h1M11 7h1" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
          </svg>
          AI 辅助
          <span class="notification-dot" style="position: static; margin-left: 4px;"></span>
        </button>
        <div style="flex:1;"></div>
        <button
          class="btn btn-icon btn-sm btn-ghost"
          @click="showRightPanel = false"
          aria-label="关闭面板"
          title="关闭面板"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="right-panel-content">
        <DiagnosticPanel v-if="rightPanel === 'diagnostic'" />
        <AIAssistantPanel v-else />
      </div>
    </div>

    <!-- Toggle right panel button (when hidden) -->
    <button
      v-if="!showRightPanel"
      class="toggle-right-panel btn btn-secondary"
      @click="showRightPanel = true"
      aria-label="打开侧面板"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 4l-4 4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.workspace {
  display: flex;
  height: 100%;
  gap: 0;
}

.workspace-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.workspace-patient-bar {
  flex-shrink: 0;
  max-height: 45%;
  overflow-y: auto;
  border-bottom: 1px solid var(--border-color);
}

.workspace-viewer {
  flex: 1;
  min-height: 0;
}

.workspace-right {
  width: var(--right-panel-width);
  flex-shrink: 0;
  border-left: 1px solid var(--border-color);
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width var(--transition-slow), opacity var(--transition-slow);
}

.workspace-right.hidden {
  width: 0;
  opacity: 0;
  overflow: hidden;
}

.right-panel-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid var(--border-color);
  padding: 0 var(--space-2);
  flex-shrink: 0;
}

.rp-tab {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all var(--transition-fast);
}

.rp-tab:hover {
  color: var(--text-primary);
}

.rp-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.right-panel-content {
  flex: 1;
  overflow: hidden;
}

.toggle-right-panel {
  position: fixed;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 32px;
  height: 64px;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  box-shadow: var(--shadow-md);
}

@media (max-width: 1279px) {
  .workspace-right {
    width: 280px;
  }
}

@media (max-width: 767px) {
  .workspace {
    flex-direction: column;
  }
  .workspace-right {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--border-color);
    max-height: 50%;
  }
}
</style>
