<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'

/* ──────────── Types ──────────── */
interface ReportDraft {
  findings: string
  impression: string
  recommendation: string
  savedAt: string
}

/* ──────────── State ──────────── */
const activeSection = ref<'findings' | 'impression' | 'recommendation'>('findings')
const showTemplateSidebar = ref(true)
const selectedTemplate = ref('')
const templateSearch = ref('')
const autoSaveStatus = ref<'saved' | 'saving' | 'unsaved'>('saved')

// Editor content (HTML strings for contenteditable)
const findings = ref('')
const impression = ref('')
const recommendation = ref('')

// Refs for contenteditable elements
const findingsEditor = ref<HTMLDivElement | null>(null)
const impressionEditor = ref<HTMLDivElement | null>(null)
const recommendationEditor = ref<HTMLDivElement | null>(null)

// UI state
const showPreview = ref(false)
const showSubmitConfirm = ref(false)
const showKeywordDialog = ref(false)
const showMeasurementDialog = ref(false)
const reportSubmitted = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('success')
const showToast = ref(false)

// Measurement dialog fields
const measurementValue = ref('')
const measurementUnit = ref('mm')

// Keyword presets
const keywordPresets = [
  '未见异常', '大小正常', '形态规则', '密度均匀', '信号均匀',
  '边界清楚', '边界模糊', '稍高密度', '稍低密度', '明显强化',
  '轻度强化', '环形强化', '占位效应', '中线移位', '脑室扩大',
]
const customKeyword = ref('')

// Auto-save timer
let saveTimer: ReturnType<typeof setTimeout> | null = null

/* ──────────── Patient Info ──────────── */
const patientInfo = {
  name: '王建国',
  id: 'P20260045',
  age: 58,
  gender: '男',
  modality: 'CT',
  bodyPart: '头部',
  studyDate: '2026-03-30',
  accession: 'ACC20260312001',
}

/* ──────────── Templates ──────────── */
const templates = [
  { id: 'ct-head-normal', label: 'CT头部 - 正常', category: 'CT',
    content: '颅内未见明显出血灶。<br>中线结构居中，脑沟、脑裂未见明显增宽。<br>各脑室大小、形态正常。<br>颅底诸骨未见明显骨折征象。<br>副鼻窦未见明显异常密度影。',
    impression: '头颅CT平扫未见明显异常。' },
  { id: 'ct-head-hemorrhage', label: 'CT头部 - 脑出血', category: 'CT',
    content: '右侧基底节区可见高密度影，约__×__mm，CT值约__HU，边界__。<br>周围可见低密度水肿带。<br>脑室系统__，中线结构__。',
    impression: '右侧基底节区脑出血。' },
  { id: 'ct-head-infarct', label: 'CT头部 - 脑梗塞', category: 'CT',
    content: '左侧/右侧__区可见片状低密度影，边界模糊。<br>脑沟变浅，灰白质界限模糊。<br>中线结构__。',
    impression: '脑梗塞（急性期/亚急性期），请结合临床。' },
  { id: 'ct-chest-normal', label: 'CT胸部 - 正常', category: 'CT',
    content: '双肺纹理清晰，未见明显异常密度影。<br>气管及各级支气管通畅。<br>纵隔未见明显肿大淋巴结。<br>心影大小形态正常。<br>胸膜无明显增厚。',
    impression: '胸部CT平扫未见明显异常。' },
  { id: 'mri-brain-normal', label: 'MRI脑部 - 正常', category: 'MRI',
    content: '各序列未见明显异常信号影。<br>脑沟脑裂未见明显增宽加深。<br>脑室系统大小形态正常。<br>中线结构居中。',
    impression: '颅脑MRI平扫未见明显异常。' },
  { id: 'mri-brain-tumor', label: 'MRI脑部 - 肿瘤', category: 'MRI',
    content: '__区可见__信号影，大小约__×__×__mm。<br>T1WI呈__信号，T2WI呈__信号，FLAIR呈__信号。<br>增强扫描呈__强化。<br>周围可见水肿信号。',
    impression: '颅内占位性病变，建议增强扫描及进一步检查。' },
  { id: 'xray-chest-normal', label: '胸部X线 - 正常', category: 'X-Ray',
    content: '双肺纹理清晰，分布正常。<br>双肺门无增大、增浓。<br>心影大小形态在正常范围。<br>膈面光滑，各肋膈角锐利。<br>纵隔无增宽。',
    impression: '胸部X线未见明显异常。' },
]

const filteredTemplates = computed(() => {
  if (!templateSearch.value) return templates
  const q = templateSearch.value.toLowerCase()
  return templates.filter(t =>
    t.label.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  )
})

/* ──────────── Editor helpers ──────────── */
function getActiveEditor(): HTMLDivElement | null {
  if (activeSection.value === 'findings') return findingsEditor.value
  if (activeSection.value === 'impression') return impressionEditor.value
  if (activeSection.value === 'recommendation') return recommendationEditor.value
  return null
}

function syncContentFromEditor() {
  if (findingsEditor.value) findings.value = findingsEditor.value.innerHTML
  if (impressionEditor.value) impression.value = impressionEditor.value.innerHTML
  if (recommendationEditor.value) recommendation.value = recommendationEditor.value.innerHTML
}

function execFormatCommand(command: string, value: string | undefined = undefined) {
  const editor = getActiveEditor()
  if (!editor) return
  editor.focus()
  document.execCommand(command, false, value)
  markUnsaved()
}

function formatBold() { execFormatCommand('bold') }
function formatItalic() { execFormatCommand('italic') }
function formatUnderline() { execFormatCommand('underline') }
function formatUnorderedList() { execFormatCommand('insertUnorderedList') }
function formatOrderedList() { execFormatCommand('insertOrderedList') }

/* ──────────── Insert keyword ──────────── */
function insertKeyword(keyword: string) {
  const editor = getActiveEditor()
  if (!editor) return
  editor.focus()
  document.execCommand('insertHTML', false,
    `<span style="background:var(--color-primary-light);color:var(--color-primary);padding:1px 4px;border-radius:4px;font-weight:500;">${keyword}</span>&nbsp;`
  )
  showKeywordDialog.value = false
  customKeyword.value = ''
  markUnsaved()
}

function insertCustomKeyword() {
  if (customKeyword.value.trim()) {
    insertKeyword(customKeyword.value.trim())
  }
}

/* ──────────── Insert measurement ──────────── */
function insertMeasurement() {
  if (!measurementValue.value.trim()) return
  const text = `${measurementValue.value}${measurementUnit.value}`
  const editor = getActiveEditor()
  if (!editor) return
  editor.focus()
  document.execCommand('insertHTML', false,
    `<span style="background:var(--color-warning-light);color:#92400E;padding:1px 4px;border-radius:4px;font-weight:600;">${text}</span>&nbsp;`
  )
  showMeasurementDialog.value = false
  measurementValue.value = ''
  measurementUnit.value = 'mm'
  markUnsaved()
}

/* ──────────── Template Apply ──────────── */
function applyTemplate(tpl: typeof templates[0]) {
  selectedTemplate.value = tpl.id
  findings.value = tpl.content
  impression.value = tpl.impression
  // Sync into editors
  nextTick(() => {
    if (findingsEditor.value) findingsEditor.value.innerHTML = tpl.content
    if (impressionEditor.value) impressionEditor.value.innerHTML = tpl.impression
  })
  markUnsaved()
  displayToast('模板已应用', 'info')
}

/* ──────────── Auto-save / Save / Submit ──────────── */
function markUnsaved() {
  autoSaveStatus.value = 'unsaved'
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => autoSave(), 2000)
}

function autoSave() {
  syncContentFromEditor()
  autoSaveStatus.value = 'saving'
  const draft: ReportDraft = {
    findings: findings.value,
    impression: impression.value,
    recommendation: recommendation.value,
    savedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(`report-draft-${patientInfo.id}`, JSON.stringify(draft))
    setTimeout(() => { autoSaveStatus.value = 'saved' }, 500)
  } catch {
    autoSaveStatus.value = 'unsaved'
  }
}

function saveDraft() {
  syncContentFromEditor()
  autoSaveStatus.value = 'saving'
  const draft: ReportDraft = {
    findings: findings.value,
    impression: impression.value,
    recommendation: recommendation.value,
    savedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(`report-draft-${patientInfo.id}`, JSON.stringify(draft))
    setTimeout(() => {
      autoSaveStatus.value = 'saved'
      displayToast('草稿已保存', 'success')
    }, 500)
  } catch {
    displayToast('保存失败，请重试', 'error')
  }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(`report-draft-${patientInfo.id}`)
    if (raw) {
      const draft: ReportDraft = JSON.parse(raw)
      findings.value = draft.findings
      impression.value = draft.impression
      recommendation.value = draft.recommendation
      nextTick(() => {
        if (findingsEditor.value) findingsEditor.value.innerHTML = draft.findings
        if (impressionEditor.value) impressionEditor.value.innerHTML = draft.impression
        if (recommendationEditor.value) recommendationEditor.value.innerHTML = draft.recommendation
      })
      autoSaveStatus.value = 'saved'
    } else {
      // Default content
      const defaultFindings = '颅内未见明显出血灶。<br>中线结构居中，脑沟、脑裂未见明显增宽。<br>各脑室大小、形态正常。<br>颅底诸骨未见明显骨折征象。<br>副鼻窦未见明显异常密度影。'
      findings.value = defaultFindings
      nextTick(() => {
        if (findingsEditor.value) findingsEditor.value.innerHTML = defaultFindings
      })
    }
  } catch {
    // ignore
  }
}

function submitReport() {
  syncContentFromEditor()
  if (!findings.value.trim()) {
    displayToast('请填写影像所见', 'error')
    return
  }
  if (!impression.value.trim()) {
    displayToast('请填写诊断意见', 'error')
    return
  }
  showSubmitConfirm.value = true
}

function confirmSubmit() {
  showSubmitConfirm.value = false
  reportSubmitted.value = true
  // Clear draft after submit
  localStorage.removeItem(`report-draft-${patientInfo.id}`)
  autoSaveStatus.value = 'saved'
  displayToast('报告已提交成功', 'success')
}

/* ──────────── Preview ──────────── */
function togglePreview() {
  syncContentFromEditor()
  showPreview.value = !showPreview.value
}

/* ──────────── Toast ──────────── */
function displayToast(msg: string, type: 'success' | 'error' | 'info') {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2500)
}

/* ──────────── Input handler for editors ──────────── */
function onEditorInput(section: 'findings' | 'impression' | 'recommendation') {
  const editor =
    section === 'findings' ? findingsEditor.value :
    section === 'impression' ? impressionEditor.value :
    recommendationEditor.value
  if (editor) {
    if (section === 'findings') findings.value = editor.innerHTML
    else if (section === 'impression') impression.value = editor.innerHTML
    else recommendation.value = editor.innerHTML
  }
  markUnsaved()
}

/* ──────────── Lifecycle ──────────── */
onMounted(() => {
  loadDraft()
})

onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
})
</script>

<template>
  <div class="report-editor-page">
    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification" :class="toastType">
        <svg v-if="toastType === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else-if="toastType === 'error'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5v4M8 11v0.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Template Sidebar -->
    <aside class="template-sidebar" :class="{ hidden: !showTemplateSidebar }">
      <div class="ts-header">
        <h3 style="font-weight:600;">报告模板</h3>
        <button
          class="btn btn-icon btn-sm btn-ghost"
          @click="showTemplateSidebar = false"
          aria-label="关闭模板面板"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="ts-search">
        <input
          v-model="templateSearch"
          type="text"
          placeholder="搜索模板..."
          class="ts-search-input"
          aria-label="搜索模板"
        />
      </div>
      <div class="ts-list">
        <div v-for="cat in ['CT', 'MRI', 'X-Ray']" :key="cat" class="ts-category">
          <h4 class="ts-category-title">{{ cat }}</h4>
          <button
            v-for="tpl in filteredTemplates.filter(t => t.category === cat)"
            :key="tpl.id"
            class="ts-item"
            :class="{ active: selectedTemplate === tpl.id }"
            @click="applyTemplate(tpl)"
          >
            <span>{{ tpl.label }}</span>
            <svg v-if="selectedTemplate === tpl.id" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <p v-if="filteredTemplates.length === 0" class="ts-empty">未找到匹配模板</p>
      </div>
    </aside>

    <!-- Toggle sidebar button -->
    <button
      v-if="!showTemplateSidebar"
      class="toggle-template btn btn-sm btn-secondary"
      @click="showTemplateSidebar = true"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      模板
    </button>

    <!-- Main Editor -->
    <div class="editor-main">
      <!-- Patient Summary Bar -->
      <div class="patient-bar">
        <div class="pb-info">
          <span style="font-weight:600;">{{ patientInfo.name }}</span>
          <span class="text-muted">{{ patientInfo.id }}</span>
          <span class="text-muted">{{ patientInfo.age }}岁/{{ patientInfo.gender }}</span>
          <span class="badge badge-primary">{{ patientInfo.modality }}</span>
          <span>{{ patientInfo.bodyPart }}</span>
          <span class="text-muted">{{ patientInfo.studyDate }}</span>
        </div>
        <div class="pb-actions">
          <div class="auto-save" :class="autoSaveStatus">
            <span class="save-dot" :class="autoSaveStatus"></span>
            <span style="font-size:var(--font-size-xs);">
              {{ autoSaveStatus === 'saved' ? '已保存' : autoSaveStatus === 'saving' ? '保存中...' : '未保存' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Section Nav -->
      <div class="section-nav">
        <button
          v-for="sec in ([
            { id: 'findings' as const, label: '影像所见' },
            { id: 'impression' as const, label: '诊断意见' },
            { id: 'recommendation' as const, label: '建议' },
          ])"
          :key="sec.id"
          class="section-tab"
          :class="{ active: activeSection === sec.id }"
          @click="activeSection = sec.id"
        >{{ sec.label }}</button>
      </div>

      <!-- Editor Area -->
      <div v-if="!showPreview" class="editor-area">
        <!-- Toolbar -->
        <div class="editor-toolbar-full">
          <div class="toolbar-left">
            <button class="btn btn-sm btn-ghost" title="加粗 (Ctrl+B)" @click="formatBold"><strong>B</strong></button>
            <button class="btn btn-sm btn-ghost" title="斜体 (Ctrl+I)" @click="formatItalic"><em>I</em></button>
            <button class="btn btn-sm btn-ghost" title="下划线 (Ctrl+U)" @click="formatUnderline"><u>U</u></button>
            <div class="toolbar-sep"></div>
            <button class="btn btn-sm btn-ghost" title="无序列表" @click="formatUnorderedList">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3h7M5 7h7M5 11h7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="2" cy="3" r="1" fill="currentColor"/>
                <circle cx="2" cy="7" r="1" fill="currentColor"/>
                <circle cx="2" cy="11" r="1" fill="currentColor"/>
              </svg>
            </button>
            <button class="btn btn-sm btn-ghost" title="有序列表" @click="formatOrderedList">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3h7M5 7h7M5 11h7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <text x="2" y="4" font-size="5" fill="currentColor" text-anchor="middle">1</text>
                <text x="2" y="8" font-size="5" fill="currentColor" text-anchor="middle">2</text>
                <text x="2" y="12" font-size="5" fill="currentColor" text-anchor="middle">3</text>
              </svg>
            </button>
            <div class="toolbar-sep"></div>
            <button class="btn btn-sm btn-ghost" @click="showKeywordDialog = true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              插入关键词
            </button>
            <button class="btn btn-sm btn-ghost" @click="showMeasurementDialog = true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="4" width="10" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/>
                <path d="M5 7h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              插入测量值
            </button>
          </div>
          <div class="toolbar-right">
            <button class="btn btn-sm btn-ghost" :class="{ 'btn-active': showPreview }" @click="togglePreview">预览</button>
          </div>
        </div>

        <!-- Rich Text Editors (contenteditable) -->
        <div class="editor-content">
          <div
            v-show="activeSection === 'findings'"
            ref="findingsEditor"
            class="report-editor-ce"
            contenteditable="true"
            data-placeholder="请输入影像所见..."
            @input="onEditorInput('findings')"
            role="textbox"
            aria-label="影像所见编辑器"
            aria-multiline="true"
          ></div>
          <div
            v-show="activeSection === 'impression'"
            ref="impressionEditor"
            class="report-editor-ce"
            contenteditable="true"
            data-placeholder="请输入诊断意见..."
            @input="onEditorInput('impression')"
            role="textbox"
            aria-label="诊断意见编辑器"
            aria-multiline="true"
          ></div>
          <div
            v-show="activeSection === 'recommendation'"
            ref="recommendationEditor"
            class="report-editor-ce"
            contenteditable="true"
            data-placeholder="请输入建议（如随访时间、进一步检查等）..."
            @input="onEditorInput('recommendation')"
            role="textbox"
            aria-label="建议编辑器"
            aria-multiline="true"
          ></div>
        </div>
      </div>

      <!-- Preview Mode -->
      <div v-else class="editor-area">
        <div class="editor-toolbar-full">
          <div class="toolbar-left">
            <span style="font-size:var(--font-size-sm);color:var(--text-muted);">报告预览模式</span>
          </div>
          <div class="toolbar-right">
            <button class="btn btn-sm btn-primary" @click="togglePreview">返回编辑</button>
          </div>
        </div>
        <div class="preview-content">
          <div class="preview-report">
            <div class="preview-header-block">
              <h2 class="preview-title">医学影像诊断报告</h2>
              <div class="preview-meta">
                <div class="preview-meta-row">
                  <span>患者姓名：{{ patientInfo.name }}</span>
                  <span>性别/年龄：{{ patientInfo.gender }}/{{ patientInfo.age }}岁</span>
                  <span>患者ID：{{ patientInfo.id }}</span>
                </div>
                <div class="preview-meta-row">
                  <span>检查方式：{{ patientInfo.modality }}</span>
                  <span>检查部位：{{ patientInfo.bodyPart }}</span>
                  <span>检查日期：{{ patientInfo.studyDate }}</span>
                </div>
                <div class="preview-meta-row">
                  <span>检查号：{{ patientInfo.accession }}</span>
                </div>
              </div>
            </div>

            <div class="preview-section">
              <h3 class="preview-section-title">【影像所见】</h3>
              <div class="preview-body" v-html="findings || '<em style=&quot;color:var(--text-muted)&quot;>（未填写）</em>'"></div>
            </div>

            <div class="preview-section">
              <h3 class="preview-section-title">【诊断意见】</h3>
              <div class="preview-body" v-html="impression || '<em style=&quot;color:var(--text-muted)&quot;>（未填写）</em>'"></div>
            </div>

            <div class="preview-section">
              <h3 class="preview-section-title">【建议】</h3>
              <div class="preview-body" v-html="recommendation || '<em style=&quot;color:var(--text-muted)&quot;>（未填写）</em>'"></div>
            </div>

            <div class="preview-footer">
              <div class="preview-sig">
                <span>诊断医师：张医生</span>
                <span>报告日期：2026-03-30</span>
              </div>
              <div class="preview-sig">
                <span>审核医师：（待签名）</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer with signatures and actions -->
      <div class="editor-footer">
        <div class="signature-section">
          <div class="sig-item">
            <span class="sig-label">诊断医师</span>
            <div class="sig-box">
              <div class="avatar-sm">张</div>
              <span class="sig-name">张医生</span>
              <span class="sig-time">2026-03-30 14:45</span>
            </div>
          </div>
          <div class="sig-item">
            <span class="sig-label">审核医师</span>
            <div class="sig-box sig-pending">
              <span class="sig-pending-text">等待签名...</span>
            </div>
          </div>
        </div>
        <div class="footer-actions">
          <button class="btn btn-secondary" @click="saveDraft" :disabled="reportSubmitted">保存草稿</button>
          <button class="btn btn-ghost" @click="togglePreview">{{ showPreview ? '返回编辑' : '预览报告' }}</button>
          <button class="btn btn-primary btn-lg" @click="submitReport" :disabled="reportSubmitted">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7.5L5 10l6.5-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ reportSubmitted ? '已提交' : '提交报告' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========== Dialogs ========== -->

    <!-- Insert Keyword Dialog -->
    <Transition name="modal">
      <div v-if="showKeywordDialog" class="modal-overlay" @click.self="showKeywordDialog = false">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3>插入关键词</h3>
            <button class="btn btn-icon btn-sm btn-ghost" @click="showKeywordDialog = false" aria-label="关闭">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-hint">点击下方常用关键词快速插入，或自定义输入：</p>
            <div class="keyword-grid">
              <button
                v-for="kw in keywordPresets"
                :key="kw"
                class="keyword-chip"
                @click="insertKeyword(kw)"
              >{{ kw }}</button>
            </div>
            <div class="keyword-custom">
              <input
                v-model="customKeyword"
                type="text"
                placeholder="自定义关键词..."
                class="keyword-input"
                @keyup.enter="insertCustomKeyword"
              />
              <button class="btn btn-sm btn-primary" @click="insertCustomKeyword" :disabled="!customKeyword.trim()">插入</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Insert Measurement Dialog -->
    <Transition name="modal">
      <div v-if="showMeasurementDialog" class="modal-overlay" @click.self="showMeasurementDialog = false">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3>插入测量值</h3>
            <button class="btn btn-icon btn-sm btn-ghost" @click="showMeasurementDialog = false" aria-label="关闭">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="measurement-form">
              <div class="measurement-row">
                <label class="measurement-label">数值</label>
                <input
                  v-model="measurementValue"
                  type="text"
                  placeholder="如：25×18"
                  class="measurement-input"
                  @keyup.enter="insertMeasurement"
                />
              </div>
              <div class="measurement-row">
                <label class="measurement-label">单位</label>
                <select v-model="measurementUnit" class="measurement-select">
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="HU">HU</option>
                  <option value="ml">ml</option>
                  <option value="°">°（角度）</option>
                </select>
              </div>
              <div class="measurement-preview" v-if="measurementValue">
                预览：<span class="measurement-tag">{{ measurementValue }}{{ measurementUnit }}</span>
              </div>
              <button class="btn btn-primary" style="width:100%;margin-top:var(--space-3);" @click="insertMeasurement" :disabled="!measurementValue.trim()">插入</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Submit Confirmation Dialog -->
    <Transition name="modal">
      <div v-if="showSubmitConfirm" class="modal-overlay" @click.self="showSubmitConfirm = false">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3>确认提交报告</h3>
          </div>
          <div class="modal-body">
            <p>确认提交此诊断报告？提交后将无法继续编辑。</p>
            <div class="submit-summary">
              <div class="summary-row">
                <span class="summary-label">患者：</span>
                <span>{{ patientInfo.name }} ({{ patientInfo.id }})</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">检查：</span>
                <span>{{ patientInfo.modality }} - {{ patientInfo.bodyPart }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">影像所见：</span>
                <span>{{ findings ? '已填写' : '未填写' }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">诊断意见：</span>
                <span>{{ impression ? '已填写' : '未填写' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showSubmitConfirm = false">取消</button>
            <button class="btn btn-primary" @click="confirmSubmit">确认提交</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.report-editor-page {
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* ===== Toast ===== */
.toast-notification {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-lg);
  pointer-events: none;
}
.toast-notification.success { background: var(--color-success); color: #fff; }
.toast-notification.error { background: var(--color-danger); color: #fff; }
.toast-notification.info { background: var(--color-primary); color: #fff; }

.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(-12px); }
.toast-leave-to { opacity: 0; transform: translateY(-12px); }

/* ===== Template Sidebar ===== */
.template-sidebar {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width var(--transition-slow), opacity var(--transition-slow);
}

.template-sidebar.hidden {
  width: 0;
  opacity: 0;
  overflow: hidden;
}

.ts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.ts-search {
  padding: var(--space-3);
  flex-shrink: 0;
}

.ts-search-input {
  width: 100%;
}

.ts-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2) var(--space-3);
}

.ts-category {
  margin-bottom: var(--space-3);
}

.ts-category-title {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  padding: var(--space-1) var(--space-2);
  margin-bottom: var(--space-1);
}

.ts-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  text-align: left;
  transition: all var(--transition-fast);
}

.ts-item:hover {
  background: var(--bg-hover);
}

.ts-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.ts-empty {
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  padding: var(--space-4);
}

.toggle-template {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

/* ===== Main Editor ===== */
.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.patient-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-6);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  flex-shrink: 0;
}

.pb-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  flex-wrap: wrap;
}

.pb-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
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
  display: inline-block;
}

.save-dot.saved { background: var(--color-success); }
.save-dot.saving { background: var(--color-warning); animation: pulse 1s ease infinite; }
.save-dot.unsaved { background: var(--color-danger); }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.section-nav {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  padding: 0 var(--space-6);
  background: var(--bg-card);
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

.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar-full {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-6);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  gap: var(--space-2);
}

.toolbar-sep {
  width: 1px;
  height: 20px;
  background: var(--border-color);
  margin: 0 var(--space-2);
}

.btn-active {
  background: var(--color-primary-light) !important;
  color: var(--color-primary) !important;
}

.editor-content {
  flex: 1;
  overflow: hidden;
}

/* ===== Rich Text Editor (contenteditable) ===== */
.report-editor-ce {
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  padding: var(--space-6);
  font-size: var(--font-size-base);
  line-height: 1.8;
  background: var(--bg-body);
  color: var(--text-primary);
  outline: none;
  overflow-y: auto;
  min-height: 200px;
}

.report-editor-ce:empty::before {
  content: attr(data-placeholder);
  color: var(--text-muted);
  pointer-events: none;
}

.report-editor-ce:focus {
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* ===== Preview ===== */
.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
  background: var(--bg-body);
}

.preview-report {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
}

.preview-header-block {
  text-align: center;
  border-bottom: 2px solid var(--text-primary);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-6);
}

.preview-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-4);
}

.preview-meta {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.preview-meta-row {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  margin-bottom: var(--space-1);
}

.preview-section {
  margin-bottom: var(--space-6);
}

.preview-section-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
}

.preview-body {
  font-size: var(--font-size-sm);
  line-height: 1.8;
  padding-left: var(--space-4);
}

.preview-footer {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-4);
  margin-top: var(--space-8);
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.preview-sig {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

/* ===== Footer ===== */
.editor-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
}

.signature-section {
  display: flex;
  gap: var(--space-8);
}

.sig-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sig-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.sig-box {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sig-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.sig-time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.sig-pending {
  padding: var(--space-2) var(--space-4);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
}

.sig-pending-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.avatar-sm {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
}

.footer-actions {
  display: flex;
  gap: var(--space-2);
}

.footer-actions .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  backdrop-filter: blur(2px);
}

.modal-dialog {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 400px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.modal-body {
  padding: var(--space-4) var(--space-6);
}

.modal-body p {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-color);
}

.modal-hint {
  margin-bottom: var(--space-3);
}

.modal-enter-active { transition: all 0.2s ease; }
.modal-leave-active { transition: all 0.15s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from .modal-dialog { transform: scale(0.95); }
.modal-leave-to { opacity: 0; }
.modal-leave-to .modal-dialog { transform: scale(0.95); }

/* ===== Keyword Dialog ===== */
.keyword-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.keyword-chip {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.keyword-chip:hover {
  background: var(--color-primary);
  color: #fff;
}

.keyword-custom {
  display: flex;
  gap: var(--space-2);
}

.keyword-input {
  flex: 1;
}

/* ===== Measurement Dialog ===== */
.measurement-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.measurement-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.measurement-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  min-width: 48px;
}

.measurement-input {
  flex: 1;
}

.measurement-select {
  flex: 1;
}

.measurement-preview {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  background: var(--bg-hover);
}

.measurement-tag {
  display: inline-block;
  background: var(--color-warning-light);
  color: #92400E;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
}

/* ===== Submit Summary ===== */
.submit-summary {
  margin-top: var(--space-3);
  padding: var(--space-3);
  background: var(--bg-hover);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.summary-row {
  display: flex;
  padding: var(--space-1) 0;
}

.summary-label {
  font-weight: var(--font-weight-medium);
  min-width: 80px;
  color: var(--text-muted);
}

/* ===== Responsive ===== */
@media (max-width: 1279px) {
  .template-sidebar {
    width: 200px;
  }
}

@media (max-width: 767px) {
  .report-editor-page {
    flex-direction: column;
  }
  .template-sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  .editor-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .footer-actions {
    justify-content: stretch;
  }
  .footer-actions .btn {
    flex: 1;
  }
  .modal-dialog {
    min-width: auto;
    margin: var(--space-4);
    max-width: calc(100vw - 32px);
  }
}
</style>
