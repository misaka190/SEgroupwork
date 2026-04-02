<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{ 'update:collapsed': [value: boolean] }>()

const route = useRoute()

const navItems = [
  { icon: 'workspace', label: '诊断工作台', path: '/', badge: 0 },
  { icon: 'patients', label: '患者列表', path: '/patients', badge: 3 },
  { icon: 'report', label: '诊断报告', path: '/report', badge: 0 },
]

const bottomItems = [
  { icon: 'settings', label: '系统设置', path: '/settings' },
  { icon: 'help', label: '帮助文档', path: '/help' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: props.collapsed }">
    <!-- Logo Area -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="var(--color-primary)"/>
          <path d="M8 14h12M14 8v12" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </div>
      <transition name="fade">
        <span v-if="!collapsed" class="logo-text">MedImage<span class="logo-accent">DX</span></span>
      </transition>
    </div>

    <div class="divider" style="margin: var(--space-2) var(--space-4)"></div>

    <!-- Main Nav -->
    <nav class="sidebar-nav" role="navigation" aria-label="主导航">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :aria-label="item.label"
        :title="collapsed ? item.label : undefined"
      >
        <span class="nav-icon" :data-icon="item.icon">
          <!-- CT Icon -->
          <svg v-if="item.icon === 'workspace'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <!-- Patients Icon -->
          <svg v-else-if="item.icon === 'patients'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <!-- Report Icon -->
          <svg v-else-if="item.icon === 'report'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <!-- AI Icon -->
          <svg v-else-if="item.icon === 'ai'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 6v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="10" cy="10" r="1" fill="currentColor"/>
          </svg>
          <span v-if="item.badge" class="notification-dot"></span>
        </span>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </transition>
        <transition name="fade">
          <span v-if="!collapsed && item.badge" class="nav-badge badge badge-danger">{{ item.badge }}</span>
        </transition>
      </router-link>
    </nav>

    <div class="sidebar-spacer"></div>

    <!-- Bottom Nav -->
    <nav class="sidebar-nav sidebar-bottom" aria-label="设置导航">
      <router-link
        v-for="item in bottomItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :aria-label="item.label"
        :title="collapsed ? item.label : undefined"
      >
        <span class="nav-icon">
          <svg v-if="item.icon === 'settings'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 13v.01M10 7a2 2 0 011.7 3.04c-.4.56-1.7 1.2-1.7 1.96" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </transition>
      </router-link>
    </nav>

    <!-- Collapse Toggle -->
    <button
      class="sidebar-toggle"
      @click="emit('update:collapsed', !collapsed)"
      :aria-label="collapsed ? '展开侧边栏' : '折叠侧边栏'"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" :style="{ transform: collapsed ? 'rotate(180deg)' : '' }">
        <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: var(--z-sidebar);
  transition: width var(--transition-slow);
  overflow: hidden;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-4);
  height: var(--header-height);
  flex-shrink: 0;
}

.logo-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  white-space: nowrap;
}

.logo-accent {
  color: var(--color-primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2) var(--space-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-base);
  position: relative;
  min-height: 40px;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active,
.nav-item.router-link-exact-active {
  background: var(--color-primary);
  color: var(--text-on-primary);
}

.nav-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.nav-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.nav-badge {
  margin-left: auto;
  font-size: 11px;
  min-width: 20px;
  text-align: center;
}

.sidebar-spacer {
  flex: 1;
}

.sidebar-bottom {
  padding-bottom: var(--space-2);
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: var(--space-2);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  transition: all var(--transition-base);
}

.sidebar-toggle:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar-toggle svg {
  transition: transform var(--transition-slow);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

[data-theme="dark"] .sidebar {
  border-right-color: var(--border-color);
}
</style>
