<script setup lang="ts">
import { ref, computed, watch } from 'vue'

/* ── Types ── */
export interface Exam {
  id: string
  date: Date
  modality: 'CT' | 'MRI' | 'X-Ray' | 'Ultrasound' | 'PET'
  part: string
  status: 'completed' | 'pending' | 'cancelled'
  radiologist: string
  description?: string
  hasCritical?: boolean
}

interface Props {
  exams: Exam[]
  activeExamId: string
  showStatus?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStatus: true,
  collapsible: true,
  defaultExpanded: true,
})

const emit = defineEmits<{
  (e: 'select', examId: string): void
  (e: 'compare', examIds: [string, string]): void
}>()

/* ── State ── */
const expanded = ref(props.defaultExpanded)
const compareMode = ref(false)
const compareSelection = ref<string[]>([])

watch(() => props.defaultExpanded, (v) => { expanded.value = v })

/* ── Computed ── */
const sortedExams = computed(() =>
  [...props.exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
)

const groupedByYear = computed(() => {
  const groups: Record<string, Exam[]> = {}
  for (const exam of sortedExams.value) {
    const year = new Date(exam.date).getFullYear().toString()
    ;(groups[year] ??= []).push(exam)
  }
  return groups
})

/* ── Helpers ── */
const modalityIcons: Record<Exam['modality'], string> = {
  CT: '🔬',
  MRI: '🧲',
  'X-Ray': '☢️',
  Ultrasound: '🔊',
  PET: '⚛️',
}

const modalityColors: Record<Exam['modality'], string> = {
  CT: '#3B82F6',
  MRI: '#8B5CF6',
  'X-Ray': '#F59E0B',
  Ultrasound: '#14B8A6',
  PET: '#EC4899',
}

const statusLabels: Record<Exam['status'], string> = {
  completed: '已完成',
  pending: '待审阅',
  cancelled: '已取消',
}

function formatDate(d: Date): string {
  const date = new Date(d)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${m}-${day} ${h}:${min}`
}

function formatFull(d: Date): string {
  const date = new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/* ── Interactions ── */
function selectExam(id: string) {
  if (compareMode.value) {
    toggleCompare(id)
    return
  }
  emit('select', id)
}

function toggleCompare(id: string) {
  const idx = compareSelection.value.indexOf(id)
  if (idx >= 0) {
    compareSelection.value.splice(idx, 1)
  } else if (compareSelection.value.length < 2) {
    compareSelection.value.push(id)
  }
  if (compareSelection.value.length === 2) {
    emit('compare', compareSelection.value as [string, string])
  }
}

function exitCompare() {
  compareMode.value = false
  compareSelection.value = []
}

function toggleExpand() {
  if (props.collapsible) expanded.value = !expanded.value
}
</script>

<template>
  <div class="exam-timeline" role="navigation" aria-label="检查历史时间线">
    <!-- Header -->
    <div class="timeline-header" @click="toggleExpand">
      <div class="header-left">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span class="header-title">检查历史</span>
        <span class="exam-count">{{ exams.length }}</span>
      </div>
      <div class="header-actions">
        <button
          v-if="expanded"
          class="action-btn"
          :class="{ active: compareMode }"
          :aria-label="compareMode ? '退出对比模式' : '进入对比模式'"
          :title="compareMode ? '退出对比' : '对比检查'"
          @click.stop="compareMode ? exitCompare() : (compareMode = true)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="3" width="7" height="18" rx="1" />
            <rect x="14" y="3" width="7" height="18" rx="1" />
          </svg>
        </button>
        <svg
          v-if="collapsible"
          class="chevron"
          :class="{ collapsed: !expanded }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>

    <!-- Compare hint -->
    <Transition name="fade">
      <div v-if="compareMode && expanded" class="compare-hint">
        <span>选择 2 项进行对比</span>
        <span v-if="compareSelection.length > 0" class="compare-count">{{ compareSelection.length }} / 2</span>
        <button class="cancel-link" @click="exitCompare">取消</button>
      </div>
    </Transition>

    <!-- Timeline body -->
    <Transition name="slide">
      <div v-if="expanded" class="timeline-body">
        <div v-for="(yearExams, year) in groupedByYear" :key="year" class="year-group">
          <div class="year-label">{{ year }}</div>

          <div class="timeline-track">
            <div
              v-for="(exam, idx) in yearExams"
              :key="exam.id"
              class="timeline-item"
              :class="{
                active: exam.id === activeExamId,
                selected: compareSelection.includes(exam.id),
                critical: exam.hasCritical,
                cancelled: exam.status === 'cancelled',
              }"
              role="button"
              tabindex="0"
              :aria-label="`${formatFull(exam.date)} ${exam.modality} ${exam.part}`"
              :aria-current="exam.id === activeExamId ? 'true' : undefined"
              @click="selectExam(exam.id)"
              @keydown.enter="selectExam(exam.id)"
              @keydown.space.prevent="selectExam(exam.id)"
            >
              <!-- Connector line -->
              <div v-if="idx < yearExams.length - 1" class="connector" aria-hidden="true" />

              <!-- Node dot -->
              <div
                class="node"
                :style="{ borderColor: modalityColors[exam.modality] }"
                aria-hidden="true"
              >
                <div
                  v-if="exam.id === activeExamId"
                  class="node-inner"
                  :style="{ backgroundColor: modalityColors[exam.modality] }"
                />
                <!-- Critical pulse -->
                <span v-if="exam.hasCritical" class="critical-dot" title="存在关键发现" />
              </div>

              <!-- Content -->
              <div class="item-content">
                <div class="item-row-top">
                  <span class="modality-badge" :style="{ color: modalityColors[exam.modality], backgroundColor: modalityColors[exam.modality] + '18' }">
                    <span class="modality-icon" aria-hidden="true">{{ modalityIcons[exam.modality] }}</span>
                    {{ exam.modality }}
                  </span>
                  <span class="exam-date">{{ formatDate(exam.date) }}</span>
                </div>

                <div class="item-part">{{ exam.part }}</div>

                <div v-if="exam.description" class="item-desc">{{ exam.description }}</div>

                <div class="item-row-bottom">
                  <span class="radiologist">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {{ exam.radiologist }}
                  </span>
                  <span
                    v-if="showStatus"
                    class="status-badge"
                    :class="exam.status"
                  >
                    {{ statusLabels[exam.status] }}
                  </span>
                </div>
              </div>

              <!-- Compare checkbox -->
              <div v-if="compareMode" class="compare-check" aria-hidden="true">
                <div class="checkbox" :class="{ checked: compareSelection.includes(exam.id) }">
                  <svg v-if="compareSelection.includes(exam.id)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="exams.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon" aria-hidden="true">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          <span>暂无检查记录</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ── Container ── */
.exam-timeline {
  width: 100%;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

/* ── Header ── */
.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-4);
  cursor: pointer;
  user-select: none;
  transition: background var(--transition-base);
}
.timeline-header:hover {
  background: var(--bg-hover);
}
.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.header-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}
.header-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}
.exam-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-full);
}
[data-theme="dark"] .exam-count {
  background: rgba(59, 130, 246, 0.2);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}
.action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.action-btn.active {
  background: var(--color-primary);
  color: #fff;
}
.action-btn svg {
  width: 16px;
  height: 16px;
}
.chevron {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  transition: transform var(--transition-base);
}
.chevron.collapsed {
  transform: rotate(-90deg);
}

/* ── Compare Hint ── */
.compare-hint {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}
[data-theme="dark"] .compare-hint {
  background: rgba(59, 130, 246, 0.15);
}
.compare-count {
  font-weight: var(--font-weight-bold);
}
.cancel-link {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--font-size-xs);
  text-decoration: underline;
  padding: 0;
}

/* ── Body ── */
.timeline-body {
  padding: 0 var(--space-4) var(--space-4);
}

/* ── Year Group ── */
.year-group {
  margin-top: var(--space-3);
}
.year-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
  padding-left: 28px;
}

/* ── Track ── */
.timeline-track {
  display: flex;
  flex-direction: column;
}

/* ── Item ── */
.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-base), box-shadow var(--transition-base);
}
.timeline-item:hover {
  background: var(--bg-hover);
}
.timeline-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}
.timeline-item.active {
  background: var(--bg-active);
  box-shadow: inset 3px 0 0 var(--color-primary);
}
.timeline-item.selected {
  background: rgba(59, 130, 246, 0.08);
  box-shadow: inset 3px 0 0 var(--color-primary);
}
.timeline-item.cancelled {
  opacity: 0.55;
}

/* ── Node ── */
.node {
  position: relative;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-top: 3px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--transition-base);
}
.node-inner {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.critical-dot {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 8px;
  height: 8px;
  background: var(--color-danger);
  border-radius: 50%;
  border: 2px solid var(--bg-card);
  animation: pulse-critical 2s ease-in-out infinite;
}
@keyframes pulse-critical {
  0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.5); }
  50% { box-shadow: 0 0 0 4px rgba(244, 63, 94, 0); }
}

/* ── Connector ── */
.connector {
  position: absolute;
  left: calc(var(--space-3) + 6px);
  top: 22px;
  bottom: -8px;
  width: 2px;
  background: var(--border-color);
}

/* ── Content ── */
.item-content {
  flex: 1;
  min-width: 0;
}
.item-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.modality-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}
.modality-icon {
  font-size: 11px;
}
.exam-date {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  white-space: nowrap;
}
.item-part {
  font-weight: var(--font-weight-medium);
  margin-top: 2px;
  font-size: var(--font-size-sm);
}
.item-desc {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-row-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}
.radiologist {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.inline-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* ── Status Badge ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.6;
}
.status-badge.completed {
  background: var(--color-success-light);
  color: var(--color-success);
}
.status-badge.pending {
  background: var(--color-warning-light);
  color: var(--color-warning);
}
.status-badge.cancelled {
  background: var(--color-danger-light);
  color: var(--color-danger);
}
[data-theme="dark"] .status-badge.completed {
  background: rgba(16, 185, 129, 0.15);
}
[data-theme="dark"] .status-badge.pending {
  background: rgba(245, 158, 11, 0.15);
}
[data-theme="dark"] .status-badge.cancelled {
  background: rgba(244, 63, 94, 0.15);
}

/* ── Compare Checkbox ── */
.compare-check {
  display: flex;
  align-items: center;
  padding-top: 2px;
}
.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}
.checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.checkbox svg {
  width: 12px;
  height: 12px;
  color: #fff;
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-8) 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}
.empty-icon {
  width: 32px;
  height: 32px;
  opacity: 0.5;
}

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active {
  transition: opacity var(--transition-base);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-enter-active, .slide-leave-active {
  transition: all var(--transition-slow);
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to, .slide-leave-from {
  max-height: 2000px;
}
</style>