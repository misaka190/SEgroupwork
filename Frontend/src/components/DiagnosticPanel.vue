<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref('findings')
const autoSaveStatus = ref<'saved' | 'saving' | 'unsaved'>('saved')
const selectedTemplate = ref('')
const showTemplateSearch = ref(false)

const templates = [
  { id: 'ct-head-normal', label: 'CT头部 - 正常', category: 'CT' },
  { id: 'ct-head-hemorrhage', label: 'CT头部 - 脑出血', category: 'CT' },
  { id: 'ct-head-infarct', label: 'CT头部 - 脑梗塞', category: 'CT' },
  { id: 'mri-brain-normal', label: 'MRI脑部 - 正常', category: 'MRI' },
  { id: 'mri-brain-tumor', label: 'MRI脑部 - 肿瘤', category: 'MRI' },
  { id: 'xray-chest-normal', label: '胸部X线 - 正常', category: 'X-Ray' },
]

const templateSearch = ref('')
const filteredTemplates = () => {
  if (!templateSearch.value) return templates
  return templates.filter(t => t.label.includes(templateSearch.value) || t.category.includes(templateSearch.value))
}

const findings = ref('颅内未见明显出血灶。\n中线结构居中，脑沟、脑裂未见明显增宽。\n各脑室大小、形态正常。\n')
const impression = ref('')

const simulateSave = () => {
  autoSaveStatus.value = 'saving'
  setTimeout(() => { autoSaveStatus.value = 'saved' }, 800)
}
</script>

<template>
  <div class="diagnostic-panel">
    <div class="panel-header">
      <h3 class="panel-title">诊断报告</h3>
      <div class="auto-save" :class="autoSaveStatus">
        <span v-if="autoSaveStatus === 'saved'" class="save-dot saved"></span>
        <span v-else-if="autoSaveStatus === 'saving'" class="save-dot saving"></span>
        <span v-else class="save-dot unsaved"></span>
        <span class="text-xs">
          {{ autoSaveStatus === 'saved' ? '已保存' : autoSaveStatus === 'saving' ? '保存中...' : '未保存' }}
        </span>
      </div>
    </div>

    <!-- Template Selector -->
    <div class="template-selector">
      <label class="field-label">报告模板</label>
      <div class="template-dropdown" @click="showTemplateSearch = !showTemplateSearch">
        <span :class="{ 'text-muted': !selectedTemplate }">
          {{ selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.label : '选择模板...' }}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 5l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>
      <div v-if="showTemplateSearch" class="template-search-panel card">
        <input
          v-model="templateSearch"
          type="text"
          placeholder="搜索模板..."
          class="template-search-input"
          autofocus
        />
        <div class="template-list">
          <button
            v-for="tpl in filteredTemplates()"
            :key="tpl.id"
            class="template-item"
            :class="{ active: selectedTemplate === tpl.id }"
            @click="selectedTemplate = tpl.id; showTemplateSearch = false"
          >
            <span class="badge" :class="{
              'badge-primary': tpl.category === 'CT',
              'badge-accent': tpl.category === 'MRI',
              'badge-warning': tpl.category === 'X-Ray'
            }">{{ tpl.category }}</span>
            <span>{{ tpl.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section Tabs -->
    <div class="section-tabs">
      <button
        class="section-tab"
        :class="{ active: activeSection === 'findings' }"
        @click="activeSection = 'findings'"
      >影像所见</button>
      <button
        class="section-tab"
        :class="{ active: activeSection === 'impression' }"
        @click="activeSection = 'impression'"
      >诊断意见</button>
      <button
        class="section-tab"
        :class="{ active: activeSection === 'recommendation' }"
        @click="activeSection = 'recommendation'"
      >建议</button>
    </div>

    <!-- Findings Editor -->
    <div v-if="activeSection === 'findings'" class="editor-section">
      <div class="editor-toolbar">
        <button class="btn btn-icon btn-sm btn-ghost" title="加粗" aria-label="加粗">
          <strong style="font-size: 13px;">B</strong>
        </button>
        <button class="btn btn-icon btn-sm btn-ghost" title="斜体" aria-label="斜体">
          <em style="font-size: 13px;">I</em>
        </button>
        <button class="btn btn-icon btn-sm btn-ghost" title="列表" aria-label="列表">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3h7M5 7h7M5 11h7M2 3h.01M2 7h.01M2 11h.01" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </button>
        <div style="flex: 1;"></div>
        <button class="btn btn-sm btn-ghost" title="插入关键词">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          关键词
        </button>
      </div>
      <textarea
        v-model="findings"
        class="editor-textarea"
        placeholder="输入影像所见..."
        @input="autoSaveStatus = 'unsaved'; simulateSave()"
        aria-label="影像所见"
      ></textarea>
    </div>

    <!-- Impression Editor -->
    <div v-if="activeSection === 'impression'" class="editor-section">
      <textarea
        v-model="impression"
        class="editor-textarea"
        placeholder="输入诊断意见..."
        @input="autoSaveStatus = 'unsaved'; simulateSave()"
        aria-label="诊断意见"
      ></textarea>
    </div>

    <!-- Recommendation -->
    <div v-if="activeSection === 'recommendation'" class="editor-section">
      <textarea
        class="editor-textarea"
        placeholder="输入建议..."
        aria-label="建议"
      ></textarea>
    </div>

    <!-- Signature Area -->
    <div class="signature-area">
      <div class="divider"></div>
      <div class="signature-row">
        <div class="signature-info">
          <span class="info-label">诊断医师</span>
          <span class="signature-name">张医生</span>
        </div>
        <div class="signature-info">
          <span class="info-label">审核医师</span>
          <span class="signature-name text-muted">待签名</span>
        </div>
      </div>
      <div class="panel-actions">
        <button class="btn btn-secondary">保存草稿</button>
        <button class="btn btn-primary">提交报告</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diagnostic-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-4);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.panel-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.auto-save {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.save-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.save-dot.saved { background: var(--color-success); }
.save-dot.saving { background: var(--color-warning); animation: pulse 1s ease infinite; }
.save-dot.unsaved { background: var(--color-danger); }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Template Selector */
.template-selector {
  padding: var(--space-3) var(--space-4);
  position: relative;
}

.field-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-1);
  display: block;
}

.template-dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.template-dropdown:hover {
  border-color: var(--color-primary);
}

.template-search-panel {
  position: absolute;
  left: var(--space-4);
  right: var(--space-4);
  top: 100%;
  z-index: 20;
  box-shadow: var(--shadow-lg);
  max-height: 240px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.template-search-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--border-color);
  border-radius: 0;
  padding: var(--space-3);
}

.template-list {
  overflow-y: auto;
  padding: var(--space-1);
}

.template-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  text-align: left;
  transition: background var(--transition-fast);
}

.template-item:hover {
  background: var(--bg-hover);
}

.template-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* Section Tabs */
.section-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  padding: 0 var(--space-4);
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
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* Editor */
.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.editor-textarea {
  flex: 1;
  resize: none;
  border: none;
  border-radius: 0;
  padding: var(--space-4);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  min-height: 160px;
}

.editor-textarea:focus {
  box-shadow: none;
}

/* Signature */
.signature-area {
  padding: 0 var(--space-4) var(--space-4);
  flex-shrink: 0;
}

.signature-row {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-4);
}

.signature-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.signature-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.panel-actions {
  display: flex;
  gap: var(--space-2);
}

.panel-actions .btn {
  flex: 1;
}
</style>
