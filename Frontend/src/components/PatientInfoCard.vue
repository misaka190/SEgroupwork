<script setup lang="ts">
import { ref } from 'vue'

const showMetadata = ref(false)
const showHistory = ref(false)

const patient = {
  name: '王建国',
  id: 'P20260045',
  age: 58,
  gender: '男',
  dob: '1968-03-15',
  accession: 'ACC20260312001',
  studyDate: '2026-03-30',
  modality: 'CT',
  bodyPart: '头部',
  referringPhysician: '李主任',
  department: '神经内科',
  indication: '头痛3天，排除脑出血',
  allergies: '青霉素过敏',
  priority: 'urgent',
}

const examHistory = [
  { date: '2026-03-30', type: 'CT', desc: '头部CT平扫', status: 'current' },
  { date: '2026-02-14', type: 'MRI', desc: '头部MRI增强', status: 'completed' },
  { date: '2025-11-20', type: 'CT', desc: '头部CT平扫', status: 'completed' },
  { date: '2025-08-05', type: 'X-Ray', desc: '胸部正侧位', status: 'completed' },
]
</script>

<template>
  <div class="patient-info-card card">
    <div class="card-header">
      <div class="patient-header-left">
        <h3 class="patient-name">{{ patient.name }}</h3>
        <span class="badge" :class="patient.priority === 'urgent' ? 'badge-danger' : 'badge-primary'">
          {{ patient.priority === 'urgent' ? '紧急' : '常规' }}
        </span>
      </div>
      <div class="patient-actions">
        <button class="btn btn-sm btn-ghost" title="查看报告" aria-label="查看报告">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M5 5h4M5 7h4M5 9h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="btn btn-sm btn-ghost" title="分享" aria-label="分享">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="10" cy="3" r="1.5" stroke="currentColor" stroke-width="1.2"/>
            <circle cx="4" cy="7" r="1.5" stroke="currentColor" stroke-width="1.2"/>
            <circle cx="10" cy="11" r="1.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M5.4 6.2l3.2-2.4M5.4 7.8l3.2 2.4" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </button>
        <button class="btn btn-sm btn-ghost" title="导出" aria-label="导出">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">患者ID</span>
          <span class="info-value">{{ patient.id }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">年龄/性别</span>
          <span class="info-value">{{ patient.age }}岁 / {{ patient.gender }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">检查号</span>
          <span class="info-value font-mono">{{ patient.accession }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">检查日期</span>
          <span class="info-value">{{ patient.studyDate }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">检查类型</span>
          <span class="info-value">
            <span class="badge badge-primary">{{ patient.modality }}</span>
            {{ patient.bodyPart }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">申请医生</span>
          <span class="info-value">{{ patient.referringPhysician }} · {{ patient.department }}</span>
        </div>
      </div>

      <div class="info-full">
        <span class="info-label">临床指征</span>
        <span class="info-value">{{ patient.indication }}</span>
      </div>

      <!-- Allergies Alert -->
      <div v-if="patient.allergies" class="alert-strip">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1l6 11H1L7 1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
          <path d="M7 5v3M7 9.5v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <span>过敏: {{ patient.allergies }}</span>
      </div>

      <!-- Exam History Toggle -->
      <button class="history-toggle" @click="showHistory = !showHistory">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" :style="{ transform: showHistory ? 'rotate(90deg)' : '' }">
          <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>检查历史 ({{ examHistory.length }})</span>
      </button>

      <div v-if="showHistory" class="exam-history">
        <div
          v-for="exam in examHistory"
          :key="exam.date"
          class="history-item"
          :class="{ current: exam.status === 'current' }"
        >
          <div class="history-indicator">
            <div class="dot" :class="exam.status"></div>
            <div class="line" v-if="exam !== examHistory[examHistory.length - 1]"></div>
          </div>
          <div class="history-content">
            <div class="history-header">
              <span class="badge" :class="{
                'badge-primary': exam.type === 'CT',
                'badge-accent': exam.type === 'MRI',
                'badge-warning': exam.type === 'X-Ray'
              }">{{ exam.type }}</span>
              <span class="text-xs text-muted">{{ exam.date }}</span>
            </div>
            <span class="text-sm">{{ exam.desc }}</span>
          </div>
        </div>
      </div>

      <!-- DICOM Metadata Toggle -->
      <button class="history-toggle" @click="showMetadata = !showMetadata">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" :style="{ transform: showMetadata ? 'rotate(90deg)' : '' }">
          <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>DICOM 元数据</span>
      </button>

      <div v-if="showMetadata" class="metadata-table">
        <div class="meta-row"><span class="meta-key">(0008,0060)</span><span class="meta-val">Modality: CT</span></div>
        <div class="meta-row"><span class="meta-key">(0008,0070)</span><span class="meta-val">Manufacturer: GE Medical</span></div>
        <div class="meta-row"><span class="meta-key">(0018,0050)</span><span class="meta-val">Slice Thickness: 1.25mm</span></div>
        <div class="meta-row"><span class="meta-key">(0018,0060)</span><span class="meta-val">KVP: 120</span></div>
        <div class="meta-row"><span class="meta-key">(0028,0010)</span><span class="meta-val">Rows: 512</span></div>
        <div class="meta-row"><span class="meta-key">(0028,0011)</span><span class="meta-val">Columns: 512</span></div>
        <div class="meta-row"><span class="meta-key">(0028,0030)</span><span class="meta-val">Pixel Spacing: 0.488\0.488</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.patient-info-card {
  overflow: hidden;
}

.patient-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.patient-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.patient-actions {
  display: flex;
  gap: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3) var(--space-4);
  margin-bottom: var(--space-3);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-full {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: var(--space-3);
}

.info-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
}

.info-value {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.font-mono {
  font-family: 'SF Mono', 'Cascadia Code', Consolas, monospace;
  font-size: var(--font-size-xs);
}

.alert-strip {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-danger-light);
  color: var(--color-danger);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-3);
}

.history-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  width: 100%;
  transition: color var(--transition-fast);
}

.history-toggle:hover {
  color: var(--text-primary);
}

.history-toggle svg {
  transition: transform var(--transition-fast);
}

.exam-history {
  padding: var(--space-2) 0 var(--space-2) var(--space-1);
}

.history-item {
  display: flex;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
}

.history-item.current {
  font-weight: var(--font-weight-medium);
}

.history-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  flex-shrink: 0;
}

.dot.current {
  background: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.dot.completed {
  background: var(--color-success);
}

.line {
  width: 2px;
  flex: 1;
  background: var(--border-color);
  margin-top: 4px;
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.metadata-table {
  padding: var(--space-2);
  background: var(--bg-input);
  border-radius: var(--radius-md);
  margin-top: var(--space-2);
}

.meta-row {
  display: flex;
  gap: var(--space-3);
  padding: 3px 0;
  font-size: 11px;
  font-family: 'SF Mono', 'Cascadia Code', Consolas, monospace;
}

.meta-key {
  color: var(--text-muted);
  flex-shrink: 0;
}

.meta-val {
  color: var(--text-secondary);
}
</style>
