<template>
  <div class="image-analysis-container">
    <header class="page-header">
      <div class="breadcrumb-title">
        <span class="tag">智能切片</span>
        <span class="sub-title">内窥镜影像智能切片</span>
        <h1>活跃内窥镜分析</h1>
      </div>
      <div class="header-actions">
        <!-- 上传视频端口 -->
        <label class="upload-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          上传视频
          <input type="file" accept="video/*" class="hidden-input" @change="handleVideoUpload" />
        </label>
        <button class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          导出报告
        </button>
        <button class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          完成诊断
        </button>
      </div>
    </header>

    <div class="analysis-layout">
      <!-- Left Column: Video & Frames -->
      <div class="layout-left">
        <!-- Main Video Area -->
        <div class="video-card">
          <div class="video-wrapper">
            <!-- Simulated Video Element -->
            <video 
              v-if="videoSrc" 
              :src="videoSrc" 
              class="main-video"
              controls 
              autoplay 
              loop
            ></video>
            <div v-else class="video-placeholder">
              <div class="placeholder-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <p>请上传或选择内窥镜视频文件以开始分析</p>
                <label class="btn btn-primary upload-btn-large">
                  选择视频文件
                  <input type="file" accept="video/*" class="hidden-input" @change="handleVideoUpload" />
                </label>
              </div>
            </div>

            <!-- AI Bounding Boxes overlay simulation -->
            <div class="ai-overlay" v-if="videoSrc || isSimulating">
              <div class="bounding-box box-red" style="left: 30%; top: 20%; width: 25%; height: 50%;">
                <span class="box-label bg-red">异常 T-01 [94%]</span>
              </div>
              <div class="bounding-box box-blue" style="left: 55%; top: 22%; width: 20%; height: 48%;">
                <span class="box-label bg-blue">追踪 T-02 [88%]</span>
              </div>
            </div>
            
            <!-- Custom Controller overlay simulation -->
            <div class="video-controls" v-if="videoSrc || isSimulating">
              <div class="control-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20L9 12l10-8v16z"/><line x1="5" y1="19" x2="5" y2="5"/></svg></div>
              <div class="control-btn play-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg></div>
              <div class="control-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4l10 8-10 8V4z"/><line x1="19" y1="5" x2="19" y2="19"/></svg></div>
              <span class="time-display">04:22 / 07:15</span>
              <div class="progress-bar-container">
                <div class="progress-track">
                  <div class="progress-fill" style="width: 60%;"></div>
                  <div class="progress-thumb" style="left: 60%;"></div>
                </div>
              </div>
              <div class="control-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
              <div class="control-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg></div>
            </div>
          </div>
        </div>

        <!-- Frame Slicing Section -->
        <div class="frames-card">
          <div class="card-header">
            <h3>智能帧切片</h3>
            <div class="nav-arrows">
              <button class="arrow-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
              <button class="arrow-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
            </div>
          </div>
          <div class="frames-carousel">
            <div class="frame-item" v-for="i in 4" :key="i" :class="{ active: i === 2 }">
              <div class="frame-img-box">
                <div class="mock-image" :class="'mock-bg-' + i"></div>
              </div>
              <div class="frame-info">
                <span class="frame-name">FRM 0422{{i}}</span>
                <span class="frame-status" v-if="i === 2">(活跃)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Stats & List -->
      <div class="layout-right">
        <!-- Real-time Tracking Box -->
        <div class="stats-card tracking-card">
          <div class="card-icon-area">
            <div class="icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span class="status-badge"><span class="dot blink"></span> 实时追踪</span>
          </div>
          <div class="stats-number">
            <h2>02</h2>
            <span>追踪到的<br/>肿瘤</span>
          </div>
          <p class="stats-desc">
            AI 已识别并正在当前视频片段中追踪 <strong>2 个不同的异常点</strong>。
          </p>
        </div>

        <!-- Detected Anomalies List -->
        <div class="stats-card anomalies-card">
          <div class="card-header-simple">
            <h3>检测到的异常</h3>
            <span class="sub-text">实时分析序列</span>
          </div>
          <div class="anomalies-list">
            <div class="anomaly-item" v-for="n in 3" :key="n">
              <div class="item-header">
                <span class="dot-red"></span>
                <span class="anomaly-name">异常 T-0{{n}}</span>
                <span class="anomaly-time">00:02:1{{n + 3}}</span>
              </div>
              <div class="item-details">
                <span class="score-label">AI 置信度评分</span>
                <span class="score-val">{{ 94.2 - n * 1.5 }}%</span>
                <button class="view-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const videoSrc = ref<string>('')
const isSimulating = ref(true) // Set true to show the overlay and controls by default simulating the screenshot

function handleVideoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    videoSrc.value = URL.createObjectURL(file)
    isSimulating.value = false // if a real video is uploaded, we might toggle simulation off (or bind coordinates to a real model in real life)
  }
}
</script>

<style scoped>
.image-analysis-container {
  padding: 1.5rem 2rem;
  background-color: #f4f7f9;
  min-height: 100%;
  color: #1a1f24;
  font-family: system-ui, -apple-system, sans-serif;
  overflow-y: auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.breadcrumb-title .tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 12px;
}
.breadcrumb-title .sub-title {
  color: #556270;
  font-weight: 600;
  font-size: 0.95rem;
}
.breadcrumb-title h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 10px 0 0 0;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn svg {
  opacity: 0.9;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}
.btn-secondary:hover { background: #d1d5db; }

.btn-primary {
  background: #0052cc;
  color: white;
}
.btn-primary:hover { background: #0043a8; }

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  background: white;
  color: #0052cc;
  border: 1px solid #0052cc;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.upload-btn:hover {
  background: #f0f7ff;
}

.hidden-input {
  display: none;
}

/* Layout */
.analysis-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

/* Let components stretch naturally */
.layout-left, .layout-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Video Card */
.video-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.video-wrapper {
  position: relative;
  background: #000;
  aspect-ratio: 16/9;
  width: 100%;
}

.main-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
}
.placeholder-content {
  text-align: center;
}
.placeholder-content svg {
  margin-bottom: 12px;
  opacity: 0.5;
}
.placeholder-content p {
  margin-bottom: 20px;
}
.upload-btn-large {
  padding: 12px 24px;
  font-size: 1rem;
}

.ai-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none; /* Let clicks pass to video */
}

.bounding-box {
  position: absolute;
  border: 2px solid;
  border-radius: 4px;
  background: rgba(0,0,0,0.1);
}
.box-red { border-color: #ef4444; border-right: none; }
.box-blue { border-color: #3b82f6; border-left: none; }

.box-label {
  position: absolute;
  top: 0; left: 0;
  transform: translateY(-100%);
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px 4px 0 0;
}
.bg-red { background: #ef4444; }
.bg-blue { background: #3b82f6; left: auto; right: 0; border-radius: 4px 4px 0 0; }

.video-controls {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: #8e9599; /* Grey background matching image */
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  color: #2c3e50;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
.control-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-btn {
  background: #0052cc;
  color: white;
  border-radius: 50%;
  width: 40px; height: 40px;
}

.time-display {
  font-family: monospace;
  font-weight: 600;
  font-size: 0.9rem;
}

.progress-bar-container {
  flex: 1;
  padding: 0 10px;
}
.progress-track {
  height: 6px;
  background: rgba(255,255,255,0.4);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}
.progress-fill {
  position: absolute;
  left: 0; top: 0; height: 100%;
  background: #0052cc;
  border-radius: 3px;
}
.progress-thumb {
  position: absolute;
  top: 50%; transform: translate(-50%, -50%);
  width: 14px; height: 14px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}


/* Frames Card */
.frames-card {
  background: white;
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}
.nav-arrows {
  display: flex;
  gap: 8px;
}
.arrow-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
}
.arrow-btn:hover { color: #111827; }

.frames-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}
.frame-item {
  flex: 0 0 160px;
}
.frame-img-box {
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s;
  height: 100px;
  background: #e5e7eb;
}
.frame-item.active .frame-img-box {
  border-color: #0052cc;
  box-shadow: 0 0 0 4px rgba(0, 82, 204, 0.1);
}

.mock-image {
  width: 100%; height: 100%;
  background-size: cover;
  background-position: center;
}
.mock-bg-1 { background-image: linear-gradient(135deg, #789 0%, #456 100%); }
.mock-bg-2 { background-image: linear-gradient(135deg, #bca 0%, #897 100%); }
.mock-bg-3 { background-image: linear-gradient(135deg, #a86 0%, #754 100%); }
.mock-bg-4 { background-image: linear-gradient(135deg, #eee 0%, #ccc 100%); }

.frame-info {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8rem;
  font-family: monospace;
}
.frame-name {
  color: #374151;
  font-weight: 600;
}
.frame-status {
  color: #0052cc;
}


/* Right Sidebar Cards */
.stats-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 2px solid transparent;
}
.tracking-card {
  border-color: #0052cc;
}

.card-icon-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.icon-circle {
  background: #eef2ff;
  width: 48px; height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
}
.dot {
  width: 8px; height: 8px;
  background: #10b981;
  border-radius: 50%;
}
.blink {
  animation: blink 1.5s infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.stats-number {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.stats-number h2 {
  font-size: 4rem;
  font-weight: 800;
  margin: 0;
  line-height: 1;
  color: #111827;
}
.stats-number span {
  font-weight: 700;
  color: #374151;
  line-height: 1.2;
}
.stats-desc {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}


.card-header-simple h3 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}
.sub-text {
  color: #6b7280;
  font-size: 0.85rem;
}

.anomalies-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.anomaly-item {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 16px;
}
.anomaly-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.dot-red {
  width: 8px; height: 8px;
  background: #ef4444;
  border-radius: 50%;
}
.anomaly-name {
  font-weight: 700;
  color: #111827;
}
.anomaly-time {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.75rem;
  margin-left: auto;
}
.item-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}
.score-label {
  color: #6b7280;
}
.score-val {
  color: #0052cc;
  font-weight: 700;
}
.view-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
}
.view-btn:hover {
  color: #374151;
}

</style>