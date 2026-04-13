<script setup lang="ts">
/**
 * SToast — 语义化轻提示组件
 *
 * 使用场景：
 * - success: 保存成功、上传完成
 * - warning: 网络不稳定、会话即将过期
 * - danger:  保存失败、权限不足
 * - info:    后台任务完成、新消息提醒
 */
import { ref, watch, onUnmounted } from 'vue'

type ToastType = 'success' | 'warning' | 'danger' | 'info'

const props = withDefaults(defineProps<{
  visible: boolean
  type?: ToastType
  message?: string
  duration?: number
}>(), {
  type: 'info',
  message: '',
  duration: 3000,
})

const emit = defineEmits<{ 'update:visible': [value: boolean] }>()
const show = ref(props.visible)
let timer: ReturnType<typeof setTimeout> | null = null

function startTimer() {
  if (timer) clearTimeout(timer)
  if (props.duration > 0) {
    timer = setTimeout(() => {
      show.value = false
      emit('update:visible', false)
    }, props.duration)
  }
}

watch(() => props.visible, (val) => {
  show.value = val
  if (val) startTimer()
})

onUnmounted(() => { if (timer) clearTimeout(timer) })

const icons: Record<ToastType, string> = {
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  danger:  'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>

<template>
  <teleport to="body">
    <transition name="toast">
      <div v-if="show" class="toast" :class="`toast-${type}`" role="status" aria-live="polite">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path :d="icons[type]" />
        </svg>
        <span style="flex:1"><slot>{{ message }}</slot></span>
        <button class="toast-close" @click="show = false; emit('update:visible', false)" aria-label="关闭">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
        </button>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 80px;
  right: var(--space-6, 24px);
  z-index: var(--z-tooltip, 110);
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: 2px;
  display: flex;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-active { animation: toast-in 300ms ease forwards; }
.toast-leave-active { animation: toast-in 200ms ease reverse forwards; }
</style>
