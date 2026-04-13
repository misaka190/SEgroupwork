<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
const route = useRoute()

const topNavItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Analysis', path: '/analysis' },
  { label: 'Patients', path: '/patients' },
  { label: 'Model API', path: '/model-interface' },
]

const searchPlaceholder = computed(() => {
  if (route.path === '/model-interface') return 'Search API configurations...'
  if (route.path === '/patients') return 'Search patients, IDs, or conditions...'
  if (route.path === '/analysis') return 'Search scans, frames, or findings...'
  return 'Search dashboards, reports, or workflows...'
})

const isCurrent = (path: string) => route.path === path

defineProps<{
  sidebarCollapsed: boolean
}>()
</script>

<template>
  <header class="app-header" :style="{ left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }">
    <div class="header-left">
      <nav class="top-nav" aria-label="Top navigation">
        <router-link
          v-for="item in topNavItems"
          :key="item.path"
          :to="item.path"
          class="top-nav-link"
          :class="{ active: isCurrent(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </div>

    <div class="header-center">
      <div class="search-bar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="search-icon">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          aria-label="Global search"
        />
      </div>
    </div>

    <div class="header-right">
      <router-link to="/help" class="help-link">Help Center</router-link>

      <button class="btn btn-icon btn-ghost notification-btn" aria-label="Notifications" title="Notifications">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75zM10.3 15.75a1.5 1.5 0 01-2.6 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="notification-dot" style="top: 6px; right: 6px;"></span>
      </button>

      <button
        class="btn btn-icon btn-ghost"
        @click="toggle"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
      >
        <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.6 3.6l1.4 1.4M13 13l1.4 1.4M3.6 14.4l1.4-1.4M13 5l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M15.1 10.4A7 7 0 017.6 2.9 7 7 0 1015.1 10.4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <router-link to="/settings" class="btn btn-icon btn-ghost settings-link" aria-label="Settings" title="Settings">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/>
          <path d="M9 1.8v1.8M9 14.4v1.8M1.8 9h1.8M14.4 9h1.8M3.9 3.9l1.3 1.3M12.8 12.8l1.3 1.3M3.9 14.1l1.3-1.3M12.8 5.2l1.3-1.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </router-link>

      <div class="user-avatar" title="Dr. Sarah Chen">
        <div class="user-copy">
          <span class="user-name">Dr. Sarah Chen</span>
          <span class="user-role text-muted text-xs">Chief Pathologist</span>
        </div>
        <div class="avatar">SC</div>
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
  padding: 0 22px;
  gap: 18px;
  z-index: var(--z-header);
  transition: left var(--transition-slow), background-color var(--transition-base);
  backdrop-filter: blur(18px);
}

.header-left {
  flex-shrink: 0;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.top-nav-link {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 12px;
  transition: all var(--transition-base);
}

.top-nav-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.top-nav-link.active {
  color: var(--text-primary);
  background: rgba(22, 89, 193, 0.08);
}

.header-center {
  flex: 1;
  max-width: 420px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0 14px;
  height: 42px;
  gap: var(--space-2);
  transition: all var(--transition-fast);
}

.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(22, 89, 193, 0.08);
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

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.help-link {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.notification-btn {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 14px;
  border-left: 1px solid var(--border-color);
  cursor: pointer;
}

.user-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  letter-spacing: 0.04em;
  font-weight: 800;
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
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

@media (max-width: 1100px) {
  .top-nav {
    display: none;
  }
}

@media (max-width: 767px) {
  .header-center {
    display: none;
  }

  .help-link {
    display: none;
  }
}
</style>
