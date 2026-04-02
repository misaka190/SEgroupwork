<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

interface DocSection {
  id: string
  icon: string
  title: string
  desc: string
  articles: { title: string; desc: string }[]
}

const sections: DocSection[] = [
  {
    id: 'getting-started',
    icon: 'rocket',
    title: '快速入门',
    desc: '了解系统基本操作流程',
    articles: [
      { title: '系统概览', desc: '了解 MedImageDX 的核心功能模块和工作流程' },
      { title: '首次登录', desc: '账号激活、密码设置和个人偏好配置' },
      { title: '工作台导览', desc: '诊断工作台各区域功能介绍' },
      { title: '快捷键一览', desc: '常用键盘快捷键提升操作效率' },
    ],
  },
  {
    id: 'image-viewer',
    icon: 'viewer',
    title: '影像查看器',
    desc: '影像浏览、调窗和测量工具',
    articles: [
      { title: '基本浏览操作', desc: '缩放、平移、翻页和窗宽窗位调节' },
      { title: '多窗格布局', desc: '1×1、2×2、1+2 布局切换和配置' },
      { title: '测量与标注', desc: '距离、角度、ROI 等测量工具使用方法' },
      { title: '对比模式', desc: '同步缩放/平移的多序列影像对比查看' },
      { title: 'DICOM 元数据', desc: '查看和导出影像技术参数' },
    ],
  },
  {
    id: 'diagnosis',
    icon: 'report',
    title: '诊断报告',
    desc: '报告撰写、模板和审核流程',
    articles: [
      { title: '撰写报告', desc: '使用富文本编辑器撰写影像所见和诊断意见' },
      { title: '报告模板', desc: '选择和自定义报告模板，提高书写效率' },
      { title: '插入关键词', desc: '使用关键词和测量值快速填充报告内容' },
      { title: '签名与提交', desc: '电子签名、审核流程和报告状态管理' },
      { title: '报告打印与导出', desc: 'PDF 导出和打印格式设置' },
    ],
  },
  {
    id: 'ai-assistant',
    icon: 'ai',
    title: 'AI 辅助诊断',
    desc: 'AI 分析功能和使用技巧',
    articles: [
      { title: 'AI 功能介绍', desc: '了解 AI 辅助诊断的能力范围和局限性' },
      { title: '自动分析报告', desc: '查看 AI 检测结果、置信度和热力图' },
      { title: '采纳与拒绝建议', desc: '如何评估和处理 AI 提供的诊断建议' },
      { title: '标注反馈', desc: '对 AI 结果进行标注，帮助模型持续优化' },
    ],
  },
  {
    id: 'patient-management',
    icon: 'patients',
    title: '患者管理',
    desc: '患者信息查询和检查记录',
    articles: [
      { title: '患者列表', desc: '搜索、筛选和排序患者信息' },
      { title: '检查历史', desc: '查看患者历史检查记录和时间线' },
      { title: '影像对比', desc: '对比不同时间点的影像变化' },
      { title: '数据导出', desc: '导出患者数据和统计报表' },
    ],
  },
  {
    id: 'faq',
    icon: 'faq',
    title: '常见问题',
    desc: '问题排查和解决方案',
    articles: [
      { title: '影像加载缓慢', desc: '网络、缓存和影像质量设置的优化建议' },
      { title: '无法连接 DICOM 服务器', desc: 'PACS 连接故障排查步骤' },
      { title: '报告保存失败', desc: '自动保存异常和手动恢复方法' },
      { title: '联系技术支持', desc: '获取人工技术支持的渠道和信息' },
    ],
  },
]

const expandedSection = ref('getting-started')

function toggleSection(id: string) {
  expandedSection.value = expandedSection.value === id ? '' : id
}

const filteredSections = ref(sections)

function handleSearch() {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) {
    filteredSections.value = sections
    return
  }
  filteredSections.value = sections
    .map(s => ({
      ...s,
      articles: s.articles.filter(
        a => a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
      ),
    }))
    .filter(s => s.articles.length > 0 || s.title.toLowerCase().includes(q))
}
</script>

<template>
  <div class="help-page">
    <!-- Header -->
    <div class="help-hero">
      <h1 class="help-title">帮助文档</h1>
      <p class="help-desc">查找使用指南、操作说明和常见问题解答</p>
      <div class="help-search">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M14 14l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          class="search-input"
          placeholder="搜索帮助文章..."
        >
      </div>
    </div>

    <!-- Quick Links -->
    <div class="quick-links">
      <a
        v-for="section in sections"
        :key="section.id"
        :href="'#' + section.id"
        class="quick-link-card"
        @click.prevent="expandedSection = section.id"
      >
        <div class="ql-icon">
          <svg v-if="section.icon === 'rocket'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2c-3 4-4 8-4 12l-3 3h14l-3-3c0-4-1-8-4-12z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <circle cx="12" cy="11" r="2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <svg v-else-if="section.icon === 'viewer'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M3 12h18M12 3v18" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <svg v-else-if="section.icon === 'report'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="section.icon === 'ai'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="section.icon === 'patients'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 16v.01M12 8a2.5 2.5 0 012 4c-.5.6-2 1.3-2 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="ql-text">
          <span class="ql-title">{{ section.title }}</span>
          <span class="ql-desc">{{ section.desc }}</span>
        </div>
        <span class="ql-count">{{ section.articles.length }} 篇</span>
      </a>
    </div>

    <!-- Articles list -->
    <div class="help-sections">
      <div
        v-for="section in filteredSections"
        :key="section.id"
        :id="section.id"
        class="help-section"
      >
        <button
          class="section-header"
          @click="toggleSection(section.id)"
          :aria-expanded="expandedSection === section.id"
        >
          <h2 class="section-title">{{ section.title }}</h2>
          <span class="section-count">{{ section.articles.length }} 篇文章</span>
          <svg
            class="section-chevron"
            :class="{ expanded: expandedSection === section.id }"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <transition name="collapse">
          <div v-if="expandedSection === section.id" class="section-articles">
            <a
              v-for="(article, idx) in section.articles"
              :key="idx"
              href="#"
              class="article-card"
              @click.prevent
            >
              <div class="article-info">
                <span class="article-title">{{ article.title }}</span>
                <span class="article-desc">{{ article.desc }}</span>
              </div>
              <svg class="article-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </transition>
      </div>
    </div>

    <!-- Contact -->
    <div class="contact-card">
      <div class="contact-info">
        <h3 class="contact-title">没有找到答案？</h3>
        <p class="contact-desc">联系我们的技术支持团队获取帮助</p>
      </div>
      <div class="contact-actions">
        <button class="btn-outline">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4l6 4 6-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.2"/></svg>
          发送邮件
        </button>
        <button class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 14l1.5-4.5L12 3l1 1-6.5 8.5L2 14z" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>
          在线客服
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-page {
  padding: var(--space-8);
  max-width: 960px;
  margin: 0 auto;
}

/* Hero */
.help-hero {
  text-align: center;
  margin-bottom: var(--space-8);
}

.help-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.help-desc {
  font-size: 15px;
  color: var(--text-secondary);
  margin: var(--space-2) 0 var(--space-6);
}

.help-search {
  display: flex;
  align-items: center;
  max-width: 480px;
  margin: 0 auto;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: var(--space-3) var(--space-4);
  gap: var(--space-3);
  transition: border-color 200ms ease;
}

.help-search:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

/* Quick Links */
.quick-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.quick-link-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
}

.quick-link-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.ql-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--bg-active);
  color: var(--color-primary);
  flex-shrink: 0;
}

.ql-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.ql-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.ql-desc {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ql-count {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Sections */
.help-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.help-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 200ms ease;
}

.section-header:hover {
  background: var(--bg-hover);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
  text-align: left;
}

.section-count {
  font-size: 12px;
  color: var(--text-muted);
}

.section-chevron {
  color: var(--text-muted);
  transition: transform 200ms ease;
}

.section-chevron.expanded {
  transform: rotate(180deg);
}

.section-articles {
  border-top: 1px solid var(--border-color);
}

.article-card {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  text-decoration: none;
  transition: background 200ms ease;
  border-bottom: 1px solid var(--border-color);
}

.article-card:last-child {
  border-bottom: none;
}

.article-card:hover {
  background: var(--bg-hover);
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.article-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.article-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.article-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 200ms ease;
}

.article-card:hover .article-arrow {
  transform: translateX(2px);
  color: var(--color-primary);
}

/* Contact */
.contact-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  margin-top: var(--space-8);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.contact-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.contact-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: var(--space-1) 0 0;
}

.contact-actions {
  display: flex;
  gap: var(--space-3);
}

.btn-primary,
.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* Collapse animation */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 250ms ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Responsive */
@media (max-width: 768px) {
  .quick-links {
    grid-template-columns: 1fr;
  }
  .contact-card {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }
}
</style>
