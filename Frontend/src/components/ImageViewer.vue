<script setup lang="ts">
import { ref } from 'vue'

const viewerLayout = ref<'1x1' | '2x2' | '1+2'>('2x2')
const activeTool = ref('pan')
const activeImage = ref(0)

const tools = [
  { id: 'pan', label: '平移', shortcut: 'P', icon: 'pan' },
  { id: 'zoom', label: '缩放', shortcut: 'Z', icon: 'zoom' },
  { id: 'window', label: '窗宽/窗位', shortcut: 'W', icon: 'window' },
  { id: 'measure', label: '测量', shortcut: 'M', icon: 'measure' },
  { id: 'annotate', label: '标注', shortcut: 'A', icon: 'annotate' },
  { id: 'roi', label: 'ROI', shortcut: 'R', icon: 'roi' },
  { id: 'compare', label: '对比', shortcut: 'C', icon: 'compare' },
]

const layouts = [
  { id: '1x1', label: '1×1' },
  { id: '2x2', label: '2×2' },
  { id: '1+2', label: '1+2' },
]

const mockImages = [
  { id: 1, type: 'CT', label: 'CT 头部 - 轴位', series: 'SE 3', slice: '45/120', ww: 80, wl: 40 },
  { id: 2, type: 'CT', label: 'CT 头部 - 矢状位', series: 'SE 3', slice: '60/120', ww: 80, wl: 40 },
  { id: 3, type: 'MRI', label: 'MRI T2 FLAIR', series: 'SE 5', slice: '22/80', ww: 350, wl: 175 },
  { id: 4, type: 'CT', label: 'CT 头部 - 冠状位', series: 'SE 3', slice: '30/120', ww: 80, wl: 40 },
]

const visibleImages = () => {
  if (viewerLayout.value === '1x1') return mockImages.slice(0, 1)
  if (viewerLayout.value === '2x2') return mockImages.slice(0, 4)
  return mockImages.slice(0, 3)
}
</script>

<template>
  <div class="image-viewer-container">
    <!-- Floating Toolbar -->
    <div class="viewer-toolbar" role="toolbar" aria-label="影像工具栏">
      <div class="toolbar-group">
        <button
          v-for="tool in tools"
          :key="tool.id"
          class="toolbar-btn"
          :class="{ active: activeTool === tool.id }"
          @click="activeTool = tool.id"
          :aria-label="tool.label"
          :title="`${tool.label} (${tool.shortcut})`"
        >
          <!-- Pan -->
          <svg v-if="tool.icon === 'pan'" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v14M2 9h14M5 5l4-3 4 3M5 13l4 3 4-3M5 5L2 9l3 4M13 5l3 4-3 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Zoom -->
          <svg v-else-if="tool.icon === 'zoom'" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M12 12l4 4M6 8h4M8 6v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <!-- Window/Level -->
          <svg v-else-if="tool.icon === 'window'" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/>
            <path d="M3 9h12" stroke="currentColor" stroke-width="1.3"/>
            <path d="M9 3v12" stroke="currentColor" stroke-width="1.3"/>
          </svg>
          <!-- Measure -->
          <svg v-else-if="tool.icon === 'measure'" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 15L15 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <path d="M3 15v-4M3 15h4M15 3v4M15 3h-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Annotate -->
          <svg v-else-if="tool.icon === 'annotate'" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13 2l3 3-10 10H3v-3L13 2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
          </svg>
          <!-- ROI -->
          <svg v-else-if="tool.icon === 'roi'" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <ellipse cx="9" cy="9" rx="6" ry="4" stroke="currentColor" stroke-width="1.3" stroke-dasharray="3 2"/>
          </svg>
          <!-- Compare -->
          <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="3" width="6" height="12" rx="1" stroke="currentColor" stroke-width="1.3"/>
            <rect x="10" y="3" width="6" height="12" rx="1" stroke="currentColor" stroke-width="1.3"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          v-for="layout in layouts"
          :key="layout.id"
          class="toolbar-btn layout-btn"
          :class="{ active: viewerLayout === layout.id }"
          @click="viewerLayout = layout.id as '1x1' | '2x2' | '1+2'"
          :aria-label="`布局: ${layout.label}`"
        >
          <span class="layout-label">{{ layout.label }}</span>
        </button>
      </div>
    </div>

    <!-- Viewer Grid -->
    <div
      class="viewer-grid"
      :class="`layout-${viewerLayout}`"
    >
      <div
        v-for="(img, idx) in visibleImages()"
        :key="img.id"
        class="viewer-panel"
        :class="{ active: activeImage === idx, 'span-tall': viewerLayout === '1+2' && idx === 0 }"
        @click="activeImage = idx"
        role="img"
        :aria-label="`影像: ${img.label}`"
      >
        <!-- DICOM Overlay - Top Left -->
        <div class="dicom-overlay top-left">
          <span class="dicom-tag">{{ img.type }}</span>
          <span>{{ img.label }}</span>
        </div>

        <!-- DICOM Overlay - Top Right -->
        <div class="dicom-overlay top-right">
          <span>{{ img.series }}</span>
          <span>Slice: {{ img.slice }}</span>
        </div>

        <!-- DICOM Overlay - Bottom Left -->
        <div class="dicom-overlay bottom-left">
          <span>WW: {{ img.ww }} / WL: {{ img.wl }}</span>
        </div>

        <!-- DICOM Overlay - Bottom Right -->
        <div class="dicom-overlay bottom-right">
          <span>1.0× | R</span>
        </div>

        <!-- Simulated image with gradient placeholder -->
        <div class="viewer-image-placeholder">
          <div class="scan-lines"></div>
          <div class="brain-shape" v-if="img.type === 'CT'">
            <svg viewBox="0 0 200 200" fill="none" style="width: 60%; height: 60%; opacity: 0.3;">
              <ellipse cx="100" cy="105" rx="65" ry="72" stroke="#888" stroke-width="1"/>
              <ellipse cx="100" cy="100" rx="55" ry="60" stroke="#666" stroke-width="0.5"/>
              <path d="M100 40 Q120 60 100 100 Q80 60 100 40" stroke="#555" stroke-width="0.5" fill="none"/>
            </svg>
          </div>
          <div class="brain-shape" v-else>
            <svg viewBox="0 0 200 200" fill="none" style="width: 60%; height: 60%; opacity: 0.4;">
              <ellipse cx="100" cy="105" rx="65" ry="72" fill="#333" stroke="#555" stroke-width="1"/>
              <ellipse cx="100" cy="100" rx="55" ry="60" fill="#222" stroke="#444" stroke-width="0.5"/>
            </svg>
          </div>
        </div>

        <!-- Measurement overlay demo -->
        <div v-if="idx === 0 && activeTool === 'measure'" class="measurement-overlay">
          <svg class="measurement-svg" viewBox="0 0 400 400">
            <line x1="120" y1="150" x2="280" y2="220" stroke="#3B82F6" stroke-width="2"/>
            <circle cx="120" cy="150" r="3" fill="#3B82F6"/>
            <circle cx="280" cy="220" r="3" fill="#3B82F6"/>
            <text x="200" y="175" fill="#3B82F6" font-size="14" text-anchor="middle">42.3 mm</text>
          </svg>
        </div>

        <!-- ROI overlay demo -->
        <div v-if="idx === 0 && activeTool === 'roi'" class="roi-overlay">
          <svg class="measurement-svg" viewBox="0 0 400 400">
            <ellipse cx="200" cy="200" rx="60" ry="40" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="5 3"/>
            <text x="200" y="250" fill="#F59E0B" font-size="12" text-anchor="middle">ROI: 23.4 cm²</text>
            <text x="200" y="266" fill="#F59E0B" font-size="11" text-anchor="middle">Mean: 45.2 HU | SD: 12.1</text>
          </svg>
        </div>

        <!-- Active panel border -->
        <div v-if="activeImage === idx" class="active-indicator"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* === Toolbar === */
.viewer-toolbar {
  position: absolute;
  top: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toolbar);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: var(--bg-toolbar);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-toolbar);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-group {
  display: flex;
  gap: 2px;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: rgba(255, 255, 255, 0.7);
  transition: all var(--transition-fast);
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.toolbar-btn.active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 var(--space-1);
}

.layout-btn {
  width: auto;
  padding: 0 var(--space-2);
}

.layout-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* === Viewer Grid === */
.viewer-grid {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 2px;
  background: #111;
}

.layout-1x1 {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.layout-2x2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.layout-1\+2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

/* === Viewer Panel === */
.viewer-panel {
  position: relative;
  background: #000;
  cursor: crosshair;
  overflow: hidden;
  user-select: none;
}

.viewer-panel.span-tall {
  grid-row: 1 / 3;
}

/* DICOM Overlays */
.dicom-overlay {
  position: absolute;
  z-index: 5;
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  font-family: 'SF Mono', 'Cascadia Code', Consolas, monospace;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.dicom-overlay.top-left { top: var(--space-3); left: var(--space-3); }
.dicom-overlay.top-right { top: var(--space-3); right: var(--space-3); text-align: right; align-items: flex-end; }
.dicom-overlay.bottom-left { bottom: var(--space-3); left: var(--space-3); }
.dicom-overlay.bottom-right { bottom: var(--space-3); right: var(--space-3); text-align: right; align-items: flex-end; }

.dicom-tag {
  background: rgba(59, 130, 246, 0.6);
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: 600;
  margin-bottom: 2px;
  display: inline-block;
  width: fit-content;
}

/* Image Placeholder */
.viewer-image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #000 70%);
}

.scan-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.01) 2px,
    rgba(255, 255, 255, 0.01) 4px
  );
  pointer-events: none;
}

.brain-shape {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Measurement overlay */
.measurement-overlay, .roi-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.measurement-svg {
  width: 100%;
  height: 100%;
}

/* Active panel indicator */
.active-indicator {
  position: absolute;
  inset: 0;
  border: 2px solid var(--color-primary);
  pointer-events: none;
  z-index: 15;
}
</style>
