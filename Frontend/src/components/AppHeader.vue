<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()

defineProps<{
  sidebarCollapsed: boolean
}>()
</script>

<template>
  <header class="app-header" :style="{ left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }">
    <div class="header-left">
      <div class="breadcrumb">
        <span class="breadcrumb-item text-muted">影像诊断系统</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="breadcrumb-sep">
          <path d="M4.5 2.5l3 3.5-3 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <span class="breadcrumb-item">
          <router-link to="/">诊断工作台</router-link>
        </span>
      </div>
    </div>

    <div class="header-center">
      <div class="search-bar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="search-icon">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="搜索患者、检查号、报告..."
          class="search-input"
          aria-label="全局搜索"
        />
        <kbd class="search-shortcut">⌘K</kbd>
      </div>
    </div>

    <div class="header-right">
      <!-- Theme Toggle -->
      <button
        class="btn btn-icon btn-ghost"
        @click="toggle"
        :aria-label="theme === 'dark' ? '切换到明亮模式' : '切换到暗黑模式'"
        :title="theme === 'dark' ? '明亮模式' : '暗黑模式'"
      >
        <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.6 3.6l1.4 1.4M13 13l1.4 1.4M3.6 14.4l1.4-1.4M13 5l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M15.1 10.4A7 7 0 017.6 2.9 7 7 0 1015.1 10.4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Notifications -->
      <button class="btn btn-icon btn-ghost notification-btn" aria-label="通知" title="通知">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75zM10.3 15.75a1.5 1.5 0 01-2.6 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="notification-dot" style="top: 6px; right: 6px;"></span>
      </button>

      <!-- User Avatar -->
      <div class="user-avatar" title="Dr. 张医生">
        <div class="avatar">张</div>
        <span class="user-name">张医生</span>
        <span class="user-role text-muted text-xs">放射科</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  right: 0;
  height: var(--header-height);
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  gap: var(--space-6);
  z-index: var(--z-header);
  transition: left var(--transition-slow), background-color var(--transition-base);
}

.header-left {
  flex-shrink: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
}

.breadcrumb-item a {
  font-weight: var(--font-weight-medium);
}

.breadcrumb-sep {
  color: var(--text-muted);
}

.header-center {
  flex: 1;
  max-width: 480px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0 var(--space-3);
  height: 40px;
  gap: var(--space-2);
  transition: all var(--transition-fast);
}

.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  flex-shrink: 0;
  color: var(--text-muted);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.search-input:focus {
  outline: none;
  box-shadow: none;
}

.search-shortcut {
  flex-shrink: 0;
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  font-size: 11px;
  color: var(--text-muted);
  font-family: inherit;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.notification-btn {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-left: var(--space-3);
  border-left: 1px solid var(--border-color);
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.user-role {
  white-space: nowrap;
}

@media (max-width: 1279px) {
  .user-name, .user-role {
    display: none;
  }
}

@media (max-width: 767px) {
  .header-center {
    display: none;
  }
}
</style>
