<script setup lang="ts">
import { ref } from 'vue'

type SliceItem = {
  id: string
  time: string
  tag: string
  active?: boolean
}

const slices = ref<SliceItem[]>([
  { id: 'slice-1', time: '00:02:14', tag: '胃底' },
  { id: 'slice-2', time: '00:04:32', tag: '胃体' },
  { id: 'slice-3', time: '00:08:15', tag: '胃窦（关键）', active: true },
])

const tags = ref([
  { label: '胃溃疡', tone: 'blue' },
  { label: '炎症', tone: 'blue' },
  { label: '严重', tone: 'red' },
  { label: '活检', tone: 'gray' },
  { label: '窄带成像', tone: 'gray' },
  { label: '放大观察', tone: 'gray' },
])
</script>

<template>
  <section class="brand-page workspace-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">临床工作台</p>
        <h1 class="page-title">实时诊断工作台</h1>
        <p class="page-desc">在统一临床界面中完成内镜复核、病灶引导与 AI 辅助报告生成。</p>
      </div>

      <div class="page-actions">
        <button type="button" class="secondary-button">队列状态</button>
        <button type="button" class="primary-button">打开报告</button>
      </div>
    </div>

    <div class="workspace-shell">
      <aside class="profile-column">
        <article class="panel-card profile-card">
          <div class="panel-title-row">
            <div>
              <span class="panel-kicker">患者档案</span>
              <h2>当前检查病例</h2>
            </div>
            <span class="status-chip status-chip-blue">进行中</span>
          </div>

          <div class="profile-grid">
            <div class="field field-wide">
              <span class="field-label">姓名</span>
              <strong class="field-value strong">张华 Zhang Hua</strong>
            </div>
            <div class="field">
              <span class="field-label">年龄</span>
              <strong class="field-value large">45</strong>
            </div>
            <div class="field">
              <span class="field-label">性别</span>
              <strong class="field-value large">男</strong>
            </div>
            <div class="field field-wide">
              <span class="field-label">患者编号</span>
              <strong class="field-value mono">#00921-GZ</strong>
            </div>
            <div class="field field-wide">
              <span class="field-label">科室</span>
              <strong class="field-value">消化内科</strong>
            </div>
          </div>

          <div class="divider"></div>

          <div class="panel-section">
            <div class="section-heading">
              <h3>已采集切片</h3>
              <span>关键帧</span>
            </div>

            <div class="slice-list">
              <article v-for="slice in slices" :key="slice.id" class="slice-card" :class="{ active: slice.active }">
                <div class="slice-mosaic">
                  <span class="tone tone-1"></span>
                  <span class="tone tone-2"></span>
                  <span class="tone tone-3"></span>
                  <span class="tone tone-4"></span>
                  <span class="tone tone-5"></span>
                  <span class="tone tone-6"></span>
                  <span class="tone tone-7"></span>
                  <span class="tone tone-8"></span>
                  <span class="tone tone-9"></span>
                  <span class="tone tone-10"></span>
                  <span class="tone tone-11"></span>
                  <span class="tone tone-12"></span>
                </div>
                <span class="slice-meta">{{ slice.time }} · {{ slice.tag }}</span>
              </article>
            </div>

            <button type="button" class="tertiary-button block-button">导出选中切片 (.DCM)</button>
          </div>
        </article>
      </aside>

      <div class="workspace-main">
        <article class="stream-card">
          <div class="stream-canvas">
            <div class="stream-topbar">
              <div class="stream-quality">
                <span class="stream-label">实时影像流</span>
                <strong>4K UHD HDR 60fps</strong>
              </div>
              <div class="stream-badges">
                <span class="stream-chip rec-chip"><span class="record-dot"></span>录制中 00:12:45</span>
                <span class="stream-chip assist-chip">AI 辅助已开启</span>
              </div>
            </div>

            <div class="detect-box">
              <span class="detect-label">检测到息肉：89.2%</span>
            </div>

            <div class="cross-widget">
              <span class="cross-line horizontal"></span>
              <span class="cross-line vertical"></span>
              <span class="cross-dot"></span>
            </div>

            <div class="stream-metrics">
              <div class="metric-chip">
                <span class="metric-label">对比度</span>
                <strong>84%</strong>
              </div>
              <div class="metric-chip">
                <span class="metric-label">窄带模式</span>
                <strong>已启用</strong>
              </div>
              <div class="metric-chip">
                <span class="metric-label">对焦</span>
                <strong>自动</strong>
              </div>
            </div>
          </div>
        </article>

        <div class="analysis-grid">
          <article class="panel-card analysis-card">
            <div class="panel-title-row compact-row">
              <div>
                <span class="panel-kicker">诊断分析</span>
                <h2>AI 推理摘要</h2>
              </div>
              <span class="status-chip status-chip-soft">AI 套件 v4.2</span>
            </div>

            <div class="reasoning-box">
              <span class="reasoning-label">模型推理</span>
              <p>
                根据当前内镜观察，在胃窦小弯侧发现一处直径约
                <strong>0.8cm</strong>
                的浅表性溃疡，边缘尚整齐，底部可见白苔，周围黏膜充血水肿（Type 0-IIc）。AI 建议进行 NBI 染色以进一步评估微血管形态。
              </p>
            </div>

            <div class="page-actions left-actions">
              <button type="button" class="primary-button">生成初步报告</button>
              <button type="button" class="secondary-button">保存诊断建议</button>
            </div>
          </article>

          <article class="panel-card tags-card">
            <div class="panel-title-row compact-row">
              <div>
                <span class="panel-kicker">临床标签</span>
                <h2>标注结果</h2>
              </div>
            </div>

            <div class="tag-cloud">
              <span v-for="tag in tags" :key="tag.label" class="tag-chip" :class="`tag-${tag.tone}`">{{ tag.label }}</span>
              <button type="button" class="tag-add">+</button>
            </div>

            <button type="button" class="health-cta">
              <span>
                <small>系统状态</small>
                <strong>诊断系统就绪</strong>
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brand-page {
  height: 100%;
  padding: 24px;
  overflow: auto;
  background:
    radial-gradient(circle at top left, rgba(22, 89, 193, 0.08), transparent 18%),
    linear-gradient(180deg, #f7f9fc 0%, #eef3fa 100%);
}

.page-head,
.page-actions,
.panel-title-row,
.section-heading,
.workspace-shell,
.analysis-grid,
.stream-topbar,
.stream-badges,
.stream-metrics,
.tag-cloud {
  display: flex;
  align-items: center;
}

.page-head {
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.eyebrow,
.panel-kicker,
.field-label,
.reasoning-label,
.section-heading span,
.metric-label,
.stream-label,
.health-cta small {
  color: #6b7280;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.page-title {
  margin: 6px 0;
  font-size: 40px;
  line-height: 1;
  font-weight: 800;
  color: #111827;
}

.page-desc {
  margin: 0;
  max-width: 720px;
  color: #64748b;
  font-size: 15px;
  line-height: 1.6;
}

.page-actions {
  gap: 12px;
}

.left-actions {
  justify-content: flex-start;
}

.primary-button,
.secondary-button,
.tertiary-button,
.tag-add,
.health-cta {
  border: none;
  cursor: pointer;
}

.primary-button,
.secondary-button,
.tertiary-button {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
}

.primary-button {
  background: linear-gradient(135deg, #1659c1, #0f4fa8);
  color: #fff;
  box-shadow: 0 16px 28px rgba(22, 89, 193, 0.18);
}

.secondary-button {
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.tertiary-button {
  background: #eef3f9;
  color: #334155;
}

.block-button {
  width: 100%;
}

.workspace-shell {
  align-items: stretch;
  gap: 20px;
}

.profile-column {
  width: 320px;
  flex-shrink: 0;
}

.workspace-main {
  min-width: 0;
  display: grid;
  gap: 20px;
  flex: 1;
}

.panel-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(230, 237, 245, 0.95);
  border-radius: 22px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
}

.profile-card,
.analysis-card,
.tags-card {
  padding: 20px;
}

.panel-title-row {
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.compact-row {
  align-items: flex-start;
}

.panel-title-row h2,
.section-heading h3 {
  margin: 4px 0 0;
  font-size: 18px;
  color: #111827;
  font-weight: 800;
}

.status-chip {
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.status-chip-blue {
  background: #d9f3ff;
  color: #135f7c;
}

.status-chip-soft {
  background: #e8efff;
  color: #1659c1;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-wide {
  grid-column: 1 / -1;
}

.field-value {
  font-size: 15px;
  color: #111827;
  font-weight: 600;
}

.field-value.strong {
  font-size: 17px;
  font-weight: 800;
}

.field-value.large {
  font-size: 20px;
  font-weight: 800;
}

.field-value.mono {
  font-family: Consolas, 'Courier New', monospace;
  color: #1659c1;
}

.divider {
  height: 1px;
  margin: 18px 0;
  background: linear-gradient(90deg, transparent, #dce5f1, transparent);
}

.panel-section {
  display: grid;
  gap: 14px;
}

.section-heading {
  justify-content: space-between;
}

.slice-list {
  display: grid;
  gap: 12px;
}

.slice-card {
  display: grid;
  gap: 8px;
}

.slice-mosaic {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  padding: 2px;
  border-radius: 12px;
  background: #0f172a;
  border: 2px solid transparent;
}

.slice-card.active .slice-mosaic {
  border-color: #6aa7ff;
  box-shadow: 0 0 0 3px rgba(106, 167, 255, 0.18);
}

.tone { aspect-ratio: 1; border-radius: 4px; }
.tone-1 { background: #1a110f; }
.tone-2 { background: #e78c61; }
.tone-3 { background: #cf6d42; }
.tone-4 { background: #eaa27f; }
.tone-5 { background: #fff3ea; }
.tone-6 { background: #211513; }
.tone-7 { background: #b54d2d; }
.tone-8 { background: #da7f59; }
.tone-9 { background: #231716; }
.tone-10 { background: #f1b091; }
.tone-11 { background: #db8058; }
.tone-12 { background: #c45d35; }

.slice-meta {
  color: #64748b;
  font-size: 12px;
  font-family: Consolas, 'Courier New', monospace;
}

.stream-card {
  min-width: 0;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 28px 58px rgba(2, 6, 23, 0.3);
}

.stream-canvas {
  position: relative;
  min-height: 460px;
  background:
    radial-gradient(circle at 36% 72%, rgba(236, 239, 242, 0.8), rgba(110, 122, 132, 0.26) 30%, rgba(7, 8, 11, 0.98) 74%),
    linear-gradient(135deg, #090d13, #1a1f29 46%, #05070b 100%);
}

.stream-canvas::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 24%, transparent 74%, rgba(0, 0, 0, 0.22));
}

.stream-topbar,
.stream-metrics,
.cross-widget,
.detect-box {
  position: absolute;
  z-index: 1;
}

.stream-topbar {
  top: 18px;
  left: 18px;
  right: 18px;
  justify-content: space-between;
}

.stream-quality {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(7, 10, 16, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

.stream-quality strong,
.metric-chip strong {
  display: block;
  color: #fff;
  font-size: 28px;
  line-height: 1;
  font-weight: 800;
}

.stream-badges {
  gap: 8px;
}

.stream-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.rec-chip { background: #c0262d; }
.assist-chip { background: #1659c1; }

.record-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #fff;
  animation: pulse-rec 1s infinite;
}

@keyframes pulse-rec {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.detect-box {
  top: 21%;
  left: 58%;
  width: 28%;
  height: 34%;
  border: 2px dashed #54c8f8;
  border-radius: 10px;
  background: rgba(84, 200, 248, 0.05);
}

.detect-label {
  position: absolute;
  top: -28px;
  left: 0;
  padding: 5px 10px;
  border-radius: 8px 8px 8px 0;
  background: #54c8f8;
  color: #08253e;
  font-size: 11px;
  font-weight: 800;
}

.cross-widget {
  left: 18px;
  bottom: 18px;
  width: 96px;
  height: 96px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
}

.cross-line { position: absolute; background: rgba(255, 255, 255, 0.35); }
.cross-line.horizontal { left: 10px; right: 10px; top: 50%; height: 1px; }
.cross-line.vertical { top: 10px; bottom: 10px; left: 50%; width: 1px; }

.cross-dot {
  position: absolute;
  left: calc(50% - 3px);
  top: calc(50% - 3px);
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #34d3ff;
  box-shadow: 0 0 12px rgba(52, 211, 255, 0.7);
}

.stream-metrics {
  right: 18px;
  bottom: 18px;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(7, 10, 16, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.metric-chip {
  min-width: 66px;
}

.metric-chip strong {
  font-size: 18px;
}

.analysis-grid {
  align-items: stretch;
  gap: 20px;
}

.analysis-card { flex: 1.3; }
.tags-card { width: 360px; flex-shrink: 0; }

.reasoning-box {
  padding: 16px;
  border-radius: 16px;
  background: #f8fbff;
  border: 1px solid #e7eef8;
  border-left: 4px solid #1659c1;
}

.reasoning-box p {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.75;
  color: #334155;
}

.reasoning-box strong { color: #1659c1; }

.tag-cloud {
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.tag-chip {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.tag-blue { background: #edf4ff; color: #1659c1; border: 1px solid #cfe0ff; }
.tag-red { background: #fff0f1; color: #be123c; border: 1px solid #fecdd3; }
.tag-gray { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }

.tag-add {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #fff;
  color: #94a3b8;
  border: 1px dashed #cbd5e1;
  font-size: 22px;
}

.health-cta {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1659c1, #103c7e);
  color: #fff;
}

.health-cta span {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.health-cta strong {
  font-size: 20px;
  line-height: 1;
}

@media (max-width: 1200px) {
  .workspace-shell,
  .analysis-grid {
    flex-direction: column;
  }

  .profile-column,
  .tags-card {
    width: auto;
  }
}

@media (max-width: 760px) {
  .brand-page { padding: 16px; }
  .page-head { flex-direction: column; align-items: stretch; }
  .page-title { font-size: 32px; }
  .page-actions { flex-direction: column; }
  .profile-grid { grid-template-columns: 1fr; }
  .field-wide { grid-column: auto; }
  .stream-topbar { flex-direction: column; align-items: flex-start; }
  .stream-metrics { left: 18px; right: 18px; justify-content: space-between; }
}
</style>