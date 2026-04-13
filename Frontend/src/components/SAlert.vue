<script setup lang="ts">
/**
 * SAlert — 语义化警告横幅组件
 *
 * 使用场景：
 * - success: 报告提交成功、影像上传完成
 * - warning: 待审阅提醒、AI 置信度低
 * - danger:  危急值通知、删除操作警告、连接失败
 * - info:    DICOM 元数据提示、操作引导
 * - primary: 系统公告、功能更新提示
 */
import { ref } from 'vue'

type AlertType = 'success' | 'warning' | 'danger' | 'info' | 'primary'

const props = withDefaults(defineProps<{
  type?: AlertType
  title?: string
  closable?: boolean
}>(), {
  type: 'info',
  closable: false,
})

const emit = defineEmits<{ close: [] }>()
const visible = ref(true)

function handleClose() {
  visible.value = false
  emit('close')
}

const iconPaths: Record<AlertType, string> = {
  success: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  warning: 'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  danger:  'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  primary: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
}
</script>

<template>
  <transition name="alert-fade">
    <div v-if="visible" class="alert" :class="`alert-${type}`" role="alert">
      <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :aria-label="type">
        <path :d="iconPaths[type]" />
      </svg>
      <div class="alert-content">
        <div v-if="title" class="alert-title">{{ title }}</div>
        <div class="alert-description"><slot /></div>
      </div>
      <button v-if="closable" class="alert-close" @click="handleClose" aria-label="关闭">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
      </button>
    </div>
  </transition>
</template>

<style scoped>
.alert-fade-leave-active {
  transition: all 200ms ease;
}
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
