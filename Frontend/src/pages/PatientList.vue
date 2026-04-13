<script setup lang="ts">
import { computed, ref } from 'vue'

type PatientStatus = 'completed' | 'review' | 'priority'

type PatientRecord = {
  id: string
  name: string
  gender: string
  age: number
  lastScan: string
  totalScans: number
  status: PatientStatus
  tone: string
}

const searchQuery = ref('')
const statusFilter = ref('all')
const scanDateFilter = ref('all')

const patients = ref<PatientRecord[]>([
  { id: '#PX-8821', name: '李雯', gender: '女', age: 42, lastScan: '2023年10月24日', totalScans: 12, status: 'completed', tone: 'tone-a' },
  { id: '#PX-9042', name: '周明', gender: '男', age: 58, lastScan: '2023年10月26日', totalScans: 3, status: 'review', tone: 'tone-b' },
  { id: '#PX-7119', name: '陈雪', gender: '女', age: 31, lastScan: '2023年10月27日', totalScans: 1, status: 'priority', tone: 'tone-c' },
  { id: '#PX-6632', name: '王建国', gender: '男', age: 74, lastScan: '2023年10月28日', totalScans: 24, status: 'completed', tone: 'tone-d' },
  { id: '#PX-6604', name: '赵婷', gender: '女', age: 47, lastScan: '2023年10月29日', totalScans: 8, status: 'review', tone: 'tone-e' },
  { id: '#PX-6521', name: '刘强', gender: '男', age: 53, lastScan: '2023年10月30日', totalScans: 17, status: 'completed', tone: 'tone-f' },
])

const filteredPatients = computed(() => {
  return patients.value.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = statusFilter.value === 'all' || patient.status === statusFilter.value
    const matchesDate =
      scanDateFilter.value === 'all' ||
      (scanDateFilter.value === 'recent' && ['2023年10月28日', '2023年10月29日', '2023年10月30日'].includes(patient.lastScan)) ||
      (scanDateFilter.value === 'week' && patient.lastScan.startsWith('2023年10月'))

    return matchesSearch && matchesStatus && matchesDate
  })
})

const statusLabelMap: Record<PatientStatus, string> = {
  completed: '已完成',
  review: '待复核',
  priority: '高优先级',
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <section class="brand-page records-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">临床目录</p>
        <h1 class="page-title">患者档案</h1>
        <p class="page-desc">集中管理当前临床病例与历史诊断数据的完整档案库。</p>
      </div>

      <div class="page-actions">
        <button type="button" class="secondary-button">导出 CSV</button>
        <button type="button" class="primary-button">新增患者</button>
      </div>
    </div>

    <article class="toolbar-card card-shell">
      <div class="toolbar-left">
        <label class="search-box" aria-label="搜索患者">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.75" stroke="currentColor" stroke-width="1.4"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="按姓名、编号或病情筛选..." />
        </label>

        <label class="select-box">
          <select v-model="statusFilter" aria-label="筛选状态">
            <option value="all">状态</option>
            <option value="completed">已完成</option>
            <option value="review">待复核</option>
            <option value="priority">高优先级</option>
          </select>
        </label>

        <label class="select-box">
          <select v-model="scanDateFilter" aria-label="筛选检查日期">
            <option value="all">检查日期</option>
            <option value="recent">最近</option>
            <option value="week">本周</option>
          </select>
        </label>
      </div>

      <div class="toolbar-meta">当前显示 {{ filteredPatients.length }} / 1,280 位患者</div>
    </article>

    <article class="table-card card-shell">
      <div class="table-row header-row">
        <span>患者编号</span>
        <span>患者信息</span>
        <span>最近检查日期</span>
        <span>检查总数</span>
        <span>诊断状态</span>
        <span>操作</span>
      </div>

      <div v-for="patient in filteredPatients" :key="patient.id" class="table-row body-row">
        <div class="cell patient-id-cell">
          <span class="patient-code">{{ patient.id }}</span>
        </div>

        <div class="cell identity-cell">
          <div class="avatar" :class="patient.tone">{{ initials(patient.name) }}</div>
          <div class="identity-copy">
            <strong>{{ patient.name }}</strong>
            <span>{{ patient.gender }} · {{ patient.age }} 岁</span>
          </div>
        </div>

        <div class="cell muted-cell">{{ patient.lastScan }}</div>

        <div class="cell scans-cell">
          <strong>{{ patient.totalScans }}</strong>
          <span class="scan-bars"><i></i><i></i><i></i></span>
        </div>

        <div class="cell">
          <span class="status-pill" :class="`status-${patient.status}`">{{ statusLabelMap[patient.status] }}</span>
        </div>

        <div class="cell actions-cell">
          <button type="button" class="icon-button" aria-label="更多操作">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="3.5" r="1.2" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
              <circle cx="8" cy="12.5" r="1.2" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="filteredPatients.length === 0" class="empty-state">
        <strong>当前筛选条件下没有匹配记录。</strong>
        <span>请尝试清空状态或搜索条件。</span>
      </div>

      <div class="table-footer">
        <div class="rows-meta">每页行数：<strong>10</strong></div>
        <div class="pagination-meta">
          <span>1-10 / 1,280</span>
          <div class="pager-buttons">
            <button type="button" class="pager-button" aria-label="上一页">‹</button>
            <button type="button" class="pager-button" aria-label="下一页">›</button>
          </div>
        </div>
      </div>
    </article>

    <div class="insight-row">
      <article class="insight-card card-shell insight-large">
        <div class="insight-icon">✦</div>
        <div>
          <h3>AI 数据增强已开启</h3>
          <p>患者档案正在持续与最新 MRI 和 CT 数据交叉比对，以识别潜在异常模式。</p>
        </div>
      </article>

      <article class="insight-card card-shell insight-side">
        <div class="storage-head">
          <span>存储完整性</span>
          <strong>98.2%</strong>
        </div>
        <div class="storage-bar"><span></span></div>
        <p>全部医疗数据均采用 AES-256 加密，并符合最新临床数据治理规范。</p>
      </article>
    </div>
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
.toolbar-card,
.toolbar-left,
.table-footer,
.pagination-meta,
.pager-buttons,
.identity-cell,
.scans-cell,
.insight-row,
.storage-head {
  display: flex;
  align-items: center;
}

.page-head {
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.eyebrow,
.storage-head span {
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

.page-actions { gap: 12px; }

.primary-button,
.secondary-button,
.icon-button,
.pager-button {
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

.card-shell {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(230, 237, 245, 0.95);
  border-radius: 22px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
}

.toolbar-card {
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
  margin-bottom: 18px;
}

.toolbar-left {
  gap: 12px;
  flex-wrap: wrap;
}

.search-box,
.select-box {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  border-radius: 14px;
  background: #f8fbff;
  border: 1px solid #e5edf5;
  padding: 0 14px;
  color: #64748b;
}

.search-box { min-width: 320px; }

.search-box input,
.select-box select {
  border: none;
  padding: 0;
  background: transparent;
  box-shadow: none;
  color: #334155;
}

.select-box select {
  min-width: 120px;
  font-weight: 700;
}

.toolbar-meta { color: #64748b; font-size: 13px; }

.table-card { overflow: hidden; }

.table-row {
  display: grid;
  grid-template-columns: 0.8fr 1.8fr 1fr 0.8fr 1.2fr 0.5fr;
  gap: 18px;
  align-items: center;
  padding: 18px 22px;
}

.header-row {
  color: #6b7280;
  font-size: 11px;
  letter-spacing: 0.14em;
  font-weight: 800;
}

.body-row { border-top: 1px solid #eef2f7; }

.patient-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  min-height: 44px;
  padding: 0 8px;
  border-radius: 10px;
  background: #edf4ff;
  color: #1659c1;
  font-size: 12px;
  font-weight: 700;
}

.identity-cell { gap: 12px; }

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
}

.tone-a { background: linear-gradient(135deg, #353535, #96745b); }
.tone-b { background: linear-gradient(135deg, #12293c, #315e6f); }
.tone-c { background: linear-gradient(135deg, #ff4d6d, #8338ec); }
.tone-d { background: linear-gradient(135deg, #3b3b3b, #8b6f47); }
.tone-e { background: linear-gradient(135deg, #0f766e, #0ea5e9); }
.tone-f { background: linear-gradient(135deg, #4f46e5, #1d4ed8); }

.identity-copy { display: grid; gap: 2px; }
.identity-copy strong { color: #111827; font-size: 16px; }
.identity-copy span,
.muted-cell { color: #64748b; font-size: 13px; }

.scans-cell { gap: 10px; color: #111827; }

.scan-bars { display: inline-flex; gap: 2px; }
.scan-bars i { width: 3px; height: 12px; border-radius: 999px; background: #1659c1; }

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.status-completed { background: #dff3fc; color: #4c748b; }
.status-review { background: #ffe6d8; color: #9b4a27; }
.status-priority { background: #ffdada; color: #b62323; }

.actions-cell { display: flex; justify-content: flex-end; }

.icon-button,
.pager-button {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: transparent;
  color: #475569;
}

.empty-state {
  padding: 42px 22px;
  display: grid;
  gap: 6px;
  justify-items: center;
  color: #64748b;
}

.table-footer {
  justify-content: space-between;
  padding: 18px 22px;
  border-top: 1px solid #eef2f7;
  color: #64748b;
  font-size: 13px;
}

.rows-meta,
.pagination-meta { gap: 8px; }

.insight-row { gap: 20px; margin-top: 22px; }

.insight-card { padding: 18px 20px; }
.insight-large { flex: 1; display: flex; align-items: center; gap: 16px; }
.insight-side { width: 280px; }

.insight-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2475d8, #1654b7);
  color: #fff;
  flex-shrink: 0;
}

.insight-large h3,
.insight-side strong {
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 20px;
}

.insight-large p,
.insight-side p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 13px;
}

.storage-head { justify-content: space-between; margin-bottom: 10px; }
.storage-head strong { color: #1659c1; font-size: 14px; }

.storage-bar {
  height: 6px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
  margin-bottom: 12px;
}

.storage-bar span {
  display: block;
  width: 98.2%;
  height: 100%;
  background: linear-gradient(90deg, #1659c1, #3b82f6);
}

@media (max-width: 1200px) {
  .insight-row { flex-direction: column; }
  .insight-side { width: auto; }
}

@media (max-width: 960px) {
  .page-head,
  .toolbar-card { flex-direction: column; align-items: stretch; }
  .page-actions { flex-direction: column; }
  .search-box { min-width: 100%; }
  .table-card { overflow: auto; }
  .table-row { min-width: 900px; }
}

@media (max-width: 640px) {
  .brand-page { padding: 16px; }
  .page-title { font-size: 32px; }
}
</style>