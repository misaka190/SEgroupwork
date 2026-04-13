<script setup lang="ts">
/**
 * SConfirmDialog — 语义化确认弹窗组件
 *
 * 使用场景：
 * - danger:  删除报告、移除患者记录、清空标注
 * - warning: 覆盖未保存的草稿、重置设置
 * - info:    确认导出、确认分享
 * - success: 确认提交报告
 * - primary: 通用确认操作
 */
import { computed } from 'vue'

type DialogType = 'success' | 'warning' | 'danger' | 'info' | 'primary'

const props = withDefaults(defineProps<{
  visible: boolean
  type?: DialogType
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>(), {
  type: 'danger',
  title: '确认操作',
  message: '此操作不可撤销，是否继续？',
  confirmText: '确认',
  cancelText: '取消',
})

const emit = defineEmits<{ confirm: []; cancel: []; 'update:visible': [value: boolean] }>()

const confirmBtnClass = computed(() => {
  if (props.type === 'danger') return 'btn btn-danger'
  if (props.type === 'warning') return 'btn btn-warning'
  if (props.type === 'success') return 'btn btn-success'
  if (props.type === 'info') return 'btn btn-info'
  return 'btn btn-primary'
})

function handleConfirm() {
  emit('confirm')
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}

function handleOverlay(e: MouseEvent) {
  if (e.target === e.currentTarget) handleCancel()
}

const iconPaths: Record<DialogType, string> = {
  danger:  'M12 9v2m0 4h.01M5.07 19H18.93a2 2 0 001.72-2.99L13.72 4a2 2 0 00-3.44 0L3.35 16.01A2 2 0 005.07 19z',
  warning: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  primary: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="modal-overlay" @mousedown="handleOverlay" role="dialog" aria-modal="true" :aria-label="title">
        <div class="modal-panel" @keydown.esc="handleCancel">
          <div class="modal-header">
            <div class="modal-icon" :class="`modal-icon-${type}`">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path :d="iconPaths[type]" />
              </svg>
            </div>
            <h3 class="modal-title">{{ title }}</h3>
          </div>
          <div class="modal-body">
            <slot>{{ message }}</slot>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="handleCancel">{{ cancelText }}</button>
            <button :class="confirmBtnClass" @click="handleConfirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: all 250ms ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>
