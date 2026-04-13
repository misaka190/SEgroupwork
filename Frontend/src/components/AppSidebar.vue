<script setup lang="ts">
import { useRoute } from 'vue-router'

const props = defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{ 'update:collapsed': [value: boolean] }>()

const route = useRoute()

const navItems = [
  { icon: 'workspace', label: 'Dashboard', path: '/', badge: 0 },
  { icon: 'ai', label: 'Analysis', path: '/analysis', badge: 0 },
  { icon: 'patients', label: 'Patients', path: '/patients', badge: 3 },
  { icon: 'report', label: 'Reports', path: '/report', badge: 0 },
  { icon: 'api', label: 'Model API', path: '/model-interface', badge: 0 },
]

const bottomItems = [
  { icon: 'settings', label: 'Settings', path: '/settings' },
  { icon: 'help', label: 'Help Center', path: '/help' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: props.collapsed }">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="url(#brandGradient)"/>
          <path d="M8 8h12v12H8z" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
          <path d="M11 11h6M11 14h4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          <defs>
            <linearGradient id="brandGradient" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stop-color="#1E6BFF"/>
              <stop offset="1" stop-color="#103C7E"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <transition name="fade">
        <div v-if="!collapsed" class="logo-copy">
          <span class="logo-text">ClinicalNexus <span class="logo-accent">v2</span></span>
          <span class="logo-subtitle">ACTIVE INSTANCE</span>
        </div>
      </transition>
    </div>

    <div class="section-caption" v-if="!collapsed">Core Workspace</div>

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
          <svg v-if="item.icon === 'workspace'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <svg v-else-if="item.icon === 'api'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 5.5h8M10 3v2.5M7 9.5v5M13 9.5v5M4 9.5h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="item.icon === 'patients'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="item.icon === 'report'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
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

    <div class="section-caption" v-if="!collapsed">Administration</div>

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

    <div class="sidebar-footer" v-if="!collapsed">
      <button class="deploy-button" type="button">Deploy New Model</button>
      <div class="status-line">
        <span class="status-dot"></span>
        <span>System Status: Healthy</span>
      </div>
    </div>

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
  padding: 18px 18px 14px;
  height: var(--header-height);
  flex-shrink: 0;
}

.logo-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  white-space: nowrap;
}

.logo-subtitle {
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--text-muted);
  font-weight: 700;
}

.logo-accent {
  color: var(--color-primary);
}

.section-caption {
  padding: 10px 18px 8px;
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 800;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 11px 12px;
  border-radius: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-base);
  position: relative;
  min-height: 44px;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active,
.nav-item.router-link-exact-active {
  background: var(--bg-card);
  color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.nav-item.active::after,
.nav-item.router-link-exact-active::after {
  content: '';
  position: absolute;
  right: -12px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 999px;
  background: var(--color-primary);
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
  font-weight: 600;
  white-space: nowrap;
}

.nav-badge {
  margin-left: auto;
  font-size: 11px;
  min-width: 20px;
  text-align: center;
  background: var(--color-primary-bg);
  color: var(--color-primary);
  border-radius: 999px;
  padding: 2px 6px;
}

.sidebar-spacer {
  flex: 1;
}

.sidebar-bottom {
  padding-bottom: 8px;
}

.sidebar-footer {
  padding: 8px 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.deploy-button {
  min-height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  font-weight: 800;
  box-shadow: 0 16px 30px rgba(22, 89, 193, 0.22);
}

.status-line {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 8px 12px 12px;
  border-radius: 12px;
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

[data-theme="dark"] .nav-item.active,
[data-theme="dark"] .nav-item.router-link-exact-active {
  background: rgba(255, 255, 255, 0.04);
}
</style>
