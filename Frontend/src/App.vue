<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'

const sidebarCollapsed = ref(false)
</script>

<template>
  <div class="app-layout">
    <AppSidebar v-model:collapsed="sidebarCollapsed" />
    <AppHeader :sidebarCollapsed="sidebarCollapsed" />
    <main
      class="app-content"
      :style="{
        marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
      }"
    >
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  overflow: hidden;
}

.app-content {
  margin-top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow: hidden;
  transition: margin-left var(--transition-slow);
  background: var(--bg-body);
}
</style>
