<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterModality = ref('all')
const filterStatus = ref('all')
const filterPriority = ref('all')
const sortBy = ref('date')
const viewMode = ref<'table' | 'card'>('table')

const patients = ref([
  { id: 'P20260045', name: '王建国', age: 58, gender: '男', modality: 'CT', bodyPart: '头部', date: '2026-03-30', status: 'pending', priority: 'urgent', description: '头痛3天，排除脑出血', doctor: '李主任' },
  { id: 'P20260044', name: '刘芳', age: 45, gender: '女', modality: 'MRI', bodyPart: '脑部', date: '2026-03-30', status: 'pending', priority: 'normal', description: '头晕伴视物模糊', doctor: '张教授' },
  { id: 'P20260043', name: '陈明', age: 72, gender: '男', modality: 'CT', bodyPart: '胸部', date: '2026-03-30', status: 'in-progress', priority: 'urgent', description: '咳嗽咯血2周', doctor: '王医生' },
  { id: 'P20260042', name: '李红', age: 35, gender: '女', modality: 'X-Ray', bodyPart: '胸部', date: '2026-03-29', status: 'completed', priority: 'normal', description: '入职体检', doctor: '赵医生' },
  { id: 'P20260041', name: '张伟', age: 62, gender: '男', modality: 'MRI', bodyPart: '腰椎', date: '2026-03-29', status: 'completed', priority: 'normal', description: '腰痛半年加重', doctor: '刘主任' },
  { id: 'P20260040', name: '赵丽', age: 50, gender: '女', modality: 'CT', bodyPart: '腹部', date: '2026-03-29', status: 'pending', priority: 'high', description: '腹痛呕吐1天', doctor: '李主任' },
  { id: 'P20260039', name: '孙洋', age: 28, gender: '男', modality: 'X-Ray', bodyPart: '四肢', date: '2026-03-28', status: 'completed', priority: 'normal', description: '外伤后左踝疼痛', doctor: '陈医生' },
  { id: 'P20260038', name: '周婷', age: 67, gender: '女', modality: 'CT', bodyPart: '头部', date: '2026-03-28', status: 'completed', priority: 'urgent', description: '突发左侧肢体无力', doctor: '张教授' },
  { id: 'P20260037', name: '吴强', age: 55, gender: '男', modality: 'MRI', bodyPart: '膝关节', date: '2026-03-28', status: 'in-progress', priority: 'normal', description: '右膝关节肿痛3月', doctor: '赵医生' },
  { id: 'P20260036', name: '郑美', age: 40, gender: '女', modality: 'CT', bodyPart: '胸部', date: '2026-03-27', status: 'completed', priority: 'normal', description: '体检发现肺部结节', doctor: '李主任' },
])

const filteredPatients = computed(() => {
  let result = patients.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }
  if (filterModality.value !== 'all') {
    result = result.filter(p => p.modality === filterModality.value)
  }
  if (filterStatus.value !== 'all') {
    result = result.filter(p => p.status === filterStatus.value)
  }
  if (filterPriority.value !== 'all') {
    result = result.filter(p => p.priority === filterPriority.value)
  }
  return result
})

const statusLabel = (s: string) => {
  switch(s) {
    case 'pending': return '待阅'
    case 'in-progress': return '阅片中'
    case 'completed': return '已完成'
    default: return s
  }
}

const statusBadge = (s: string) => {
  switch(s) {
    case 'pending': return 'badge-warning'
    case 'in-progress': return 'badge-primary'
    case 'completed': return 'badge-success'
    default: return ''
  }
}

const priorityLabel = (p: string) => {
  switch(p) {
    case 'urgent': return '紧急'
    case 'high': return '高'
    case 'normal': return '常规'
    default: return p
  }
}

const priorityBadge = (p: string) => {
  switch(p) {
    case 'urgent': return 'badge-danger'
    case 'high': return 'badge-warning'
    default: return 'badge-primary'
  }
}

const stats = computed(() => ({
  total: patients.value.length,
  pending: patients.value.filter(p => p.status === 'pending').length,
  inProgress: patients.value.filter(p => p.status === 'in-progress').length,
  completed: patients.value.filter(p => p.status === 'completed').length,
  urgent: patients.value.filter(p => p.priority === 'urgent').length,
}))
</script>

<template>
  <div class="patient-list-page">
    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-card card">
        <div class="stat-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label text-xs text-muted">总检查数</span>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background: var(--color-warning-light); color: var(--color-warning);">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 6v4l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.pending }}</span>
          <span class="stat-label text-xs text-muted">待阅</span>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.inProgress }}</span>
          <span class="stat-label text-xs text-muted">阅片中</span>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background: var(--color-danger-light); color: var(--color-danger);">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3l7 12H3L10 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M10 8v3M10 13v.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.urgent }}</span>
          <span class="stat-label text-xs text-muted">紧急</span>
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="filter-bar card">
      <div class="filter-row">
        <div class="search-field">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="search-field-icon">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索患者姓名、ID、描述..."
            class="filter-input"
            aria-label="搜索患者"
          />
        </div>
        <select v-model="filterModality" class="filter-select" aria-label="检查类型">
          <option value="all">全部类型</option>
          <option value="CT">CT</option>
          <option value="MRI">MRI</option>
          <option value="X-Ray">X-Ray</option>
        </select>
        <select v-model="filterStatus" class="filter-select" aria-label="状态">
          <option value="all">全部状态</option>
          <option value="pending">待阅</option>
          <option value="in-progress">阅片中</option>
          <option value="completed">已完成</option>
        </select>
        <select v-model="filterPriority" class="filter-select" aria-label="优先级">
          <option value="all">全部优先级</option>
          <option value="urgent">紧急</option>
          <option value="high">高</option>
          <option value="normal">常规</option>
        </select>
        <div class="view-toggle">
          <button
            class="btn btn-icon btn-sm"
            :class="viewMode === 'table' ? 'btn-primary' : 'btn-ghost'"
            @click="viewMode = 'table'"
            aria-label="表格视图"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3h10M2 7h10M2 11h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </button>
          <button
            class="btn btn-icon btn-sm"
            :class="viewMode === 'card' ? 'btn-primary' : 'btn-ghost'"
            @click="viewMode = 'card'"
            aria-label="卡片视图"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>
              <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>
              <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>
              <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="filter-tags" v-if="searchQuery || filterModality !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'">
        <span class="filter-tag" v-if="searchQuery">
          搜索: {{ searchQuery }}
          <button @click="searchQuery = ''" class="tag-remove" aria-label="清除搜索">&times;</button>
        </span>
        <span class="filter-tag" v-if="filterModality !== 'all'">
          {{ filterModality }}
          <button @click="filterModality = 'all'" class="tag-remove" aria-label="清除类型筛选">&times;</button>
        </span>
        <span class="filter-tag" v-if="filterStatus !== 'all'">
          {{ statusLabel(filterStatus) }}
          <button @click="filterStatus = 'all'" class="tag-remove" aria-label="清除状态筛选">&times;</button>
        </span>
        <span class="filter-tag" v-if="filterPriority !== 'all'">
          {{ priorityLabel(filterPriority) }}
          <button @click="filterPriority = 'all'" class="tag-remove" aria-label="清除优先级筛选">&times;</button>
        </span>
        <button class="btn btn-sm btn-ghost" @click="searchQuery = ''; filterModality = 'all'; filterStatus = 'all'; filterPriority = 'all'">
          清除全部
        </button>
      </div>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="patient-table-wrapper card">
      <table class="patient-table" role="table" aria-label="患者列表">
        <thead>
          <tr>
            <th>优先级</th>
            <th>患者</th>
            <th>检查类型</th>
            <th>部位</th>
            <th>日期</th>
            <th>描述</th>
            <th>申请医生</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filteredPatients"
            :key="p.id"
            class="patient-row"
            :class="{ urgent: p.priority === 'urgent' }"
          >
            <td>
              <span class="badge" :class="priorityBadge(p.priority)">{{ priorityLabel(p.priority) }}</span>
            </td>
            <td>
              <div class="patient-cell">
                <span class="font-medium">{{ p.name }}</span>
                <span class="text-xs text-muted">{{ p.id }} · {{ p.age }}岁/{{ p.gender }}</span>
              </div>
            </td>
            <td>
              <span class="badge" :class="{
                'badge-primary': p.modality === 'CT',
                'badge-accent': p.modality === 'MRI',
                'badge-warning': p.modality === 'X-Ray'
              }">{{ p.modality }}</span>
            </td>
            <td>{{ p.bodyPart }}</td>
            <td class="text-sm text-muted">{{ p.date }}</td>
            <td class="desc-cell text-sm">{{ p.description }}</td>
            <td class="text-sm">{{ p.doctor }}</td>
            <td>
              <span class="badge" :class="statusBadge(p.status)">{{ statusLabel(p.status) }}</span>
            </td>
            <td>
              <div class="action-btns">
                <router-link to="/" class="btn btn-sm btn-primary">阅片</router-link>
                <button class="btn btn-sm btn-ghost">详情</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredPatients.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="var(--text-muted)" stroke-width="1.5"/>
          <circle cx="24" cy="20" r="6" stroke="var(--text-muted)" stroke-width="1.5"/>
          <path d="M12 40c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p class="text-muted">未找到匹配的患者记录</p>
      </div>
    </div>

    <!-- Card View -->
    <div v-if="viewMode === 'card'" class="patient-cards">
      <div
        v-for="p in filteredPatients"
        :key="p.id"
        class="patient-card card"
        :class="{ urgent: p.priority === 'urgent' }"
      >
        <div class="pc-header">
          <div class="pc-patient">
            <div class="pc-avatar">{{ p.name[0] }}</div>
            <div>
              <span class="font-medium">{{ p.name }}</span>
              <span class="text-xs text-muted">{{ p.id }} · {{ p.age }}岁/{{ p.gender }}</span>
            </div>
          </div>
          <span class="badge" :class="priorityBadge(p.priority)">{{ priorityLabel(p.priority) }}</span>
        </div>
        <div class="pc-body">
          <div class="pc-meta">
            <span class="badge" :class="{
              'badge-primary': p.modality === 'CT',
              'badge-accent': p.modality === 'MRI',
              'badge-warning': p.modality === 'X-Ray'
            }">{{ p.modality }}</span>
            <span class="text-sm">{{ p.bodyPart }}</span>
            <span class="text-xs text-muted">{{ p.date }}</span>
          </div>
          <p class="text-sm pc-desc">{{ p.description }}</p>
          <div class="pc-footer">
            <span class="badge" :class="statusBadge(p.status)">{{ statusLabel(p.status) }}</span>
            <router-link to="/" class="btn btn-sm btn-primary">阅片</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <span class="text-sm text-muted">显示 {{ filteredPatients.length }} 条结果</span>
      <div class="pagination-btns">
        <button class="btn btn-sm btn-ghost" disabled>上一页</button>
        <button class="btn btn-sm btn-primary">1</button>
        <button class="btn btn-sm btn-ghost">2</button>
        <button class="btn btn-sm btn-ghost">下一页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.patient-list-page {
  padding: var(--space-6);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.stat-label {
  margin-top: 2px;
}

/* Filter Bar */
.filter-bar {
  padding: var(--space-4) var(--space-6);
}

.filter-row {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  flex-wrap: wrap;
}

.search-field {
  flex: 1;
  min-width: 200px;
  position: relative;
}

.search-field-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.filter-input {
  width: 100%;
  padding-left: 36px;
}

.filter-select {
  min-width: 120px;
}

.view-toggle {
  display: flex;
  gap: 2px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 2px;
}

.filter-tags {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
  flex-wrap: wrap;
  align-items: center;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2) 2px var(--space-3);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.tag-remove {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: inherit;
  font-size: 14px;
  line-height: 1;
}

.tag-remove:hover {
  background: rgba(59, 130, 246, 0.2);
}

/* Table */
.patient-table-wrapper {
  overflow-x: auto;
}

.patient-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.patient-table th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.patient-table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.patient-row {
  transition: background var(--transition-fast);
}

.patient-row:hover {
  background: var(--bg-hover);
}

.patient-row.urgent {
  background: var(--color-danger-light);
}

.patient-row.urgent:hover {
  background: var(--color-danger-light);
  filter: brightness(0.97);
}

.patient-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.desc-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-btns {
  display: flex;
  gap: var(--space-1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-12);
}

/* Card View */
.patient-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4);
}

.patient-card {
  padding: var(--space-4);
}

.patient-card.urgent {
  border-left: 3px solid var(--color-danger);
}

.pc-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.pc-patient {
  display: flex;
  gap: var(--space-3);
}

.pc-patient > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pc-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}

.pc-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.pc-desc {
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}

.pc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.pagination-btns {
  display: flex;
  gap: var(--space-1);
}

@media (max-width: 1279px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  .search-field {
    min-width: 0;
  }
}
</style>
