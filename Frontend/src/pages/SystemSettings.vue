<script setup lang="ts">
import { ref } from 'vue'

const currentTheme = ref(document.documentElement.getAttribute('data-theme') || 'light')
function setTheme(theme: string) {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
}

const language = ref('zh-CN')
const autoSaveInterval = ref(30)
const defaultModality = ref('CT')
const imageQuality = ref('high')
const fontSize = ref('medium')

const notifyCritical = ref(true)
const notifyNewCase = ref(true)
const notifyReport = ref(true)
const soundEnabled = ref(false)

const defaultLayout = ref('2x2')
const showOverlay = ref(true)
const scrollDirection = ref('natural')
const crosshair = ref(false)
const measureUnit = ref('mm')

const aiAutoAnalyze = ref(true)
const aiConfidenceThreshold = ref(75)
const aiHighlightFindings = ref(true)

const dicomServerHost = ref('192.168.1.100')
const dicomServerPort = ref('4242')
const dicomAeTitle = ref('CLINICALNEXUS')
const dicomAutoFetch = ref(true)

const saved = ref(false)
function handleSave() {
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2000)
}

const navItems = [
  { id: 'general', label: '常规' },
  { id: 'appearance', label: '外观' },
  { id: 'viewer', label: '查看器' },
  { id: 'notifications', label: '通知' },
  { id: 'ai', label: 'AI 策略' },
  { id: 'dicom', label: 'DICOM 网关' },
]

const layoutOptions = [
  { value: '1x1', label: '1×1 单视图' },
  { value: '2x2', label: '2×2 网格' },
  { value: '1+2', label: '1+2 混合布局' },
]
</script>

<template>
  <section class="brand-page settings-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">系统管理</p>
        <h1 class="page-title">系统设置</h1>
        <p class="page-desc">统一管理平台默认项、AI 行为、通知策略、查看器偏好与 DICOM 连接配置。</p>
      </div>

      <div class="page-actions">
        <span v-if="saved" class="save-pill">已保存</span>
        <button type="button" class="secondary-button">恢复默认</button>
        <button type="button" class="primary-button" @click="handleSave">保存设置</button>
      </div>
    </div>

    <div class="settings-shell">
      <aside class="settings-nav card-shell">
        <span class="nav-kicker">配置分区</span>
        <a v-for="item in navItems" :key="item.id" :href="`#${item.id}`" class="settings-nav-item" :class="{ active: item.id === 'general' }">{{ item.label }}</a>
      </aside>

      <div class="settings-content">
        <section id="general" class="settings-card card-shell">
          <div class="section-head">
            <div>
              <span class="section-kicker">常规</span>
              <h2>工作区默认项</h2>
            </div>
          </div>

          <div class="setting-grid">
            <div class="setting-row">
              <div><strong>界面语言</strong><span>设置菜单与临床页面的默认显示语言。</span></div>
              <select v-model="language"><option value="zh-CN">简体中文</option><option value="en-US">English</option></select>
            </div>
            <div class="setting-row">
              <div><strong>自动保存间隔</strong><span>设置草稿内容自动落盘的频率。</span></div>
              <select v-model="autoSaveInterval"><option :value="15">15 秒</option><option :value="30">30 秒</option><option :value="60">60 秒</option><option :value="120">2 分钟</option></select>
            </div>
            <div class="setting-row">
              <div><strong>默认模态</strong><span>新检查单默认预选的影像模态。</span></div>
              <select v-model="defaultModality"><option value="CT">CT</option><option value="MRI">MRI</option><option value="X-Ray">X 光</option><option value="Ultrasound">超声</option><option value="PET">PET</option></select>
            </div>
            <div class="setting-row">
              <div><strong>字体密度</strong><span>调节表格和查看器中的文字显示密度。</span></div>
              <select v-model="fontSize"><option value="small">紧凑</option><option value="medium">标准</option><option value="large">舒适</option></select>
            </div>
          </div>
        </section>

        <section id="appearance" class="settings-card card-shell">
          <div class="section-head">
            <div>
              <span class="section-kicker">外观</span>
              <h2>主题与视觉风格</h2>
            </div>
          </div>

          <div class="theme-grid">
            <button class="theme-card" :class="{ active: currentTheme === 'light' }" @click="setTheme('light')" type="button">
              <div class="theme-preview theme-light-preview"><span></span><span></span><span></span></div>
              <strong>浅色控制台</strong>
              <small>更适合报告撰写与管理操作。</small>
            </button>
            <button class="theme-card" :class="{ active: currentTheme === 'dark' }" @click="setTheme('dark')" type="button">
              <div class="theme-preview theme-dark-preview"><span></span><span></span><span></span></div>
              <strong>深色控制台</strong>
              <small>更适合重影像复核场景。</small>
            </button>
          </div>
        </section>

        <section id="viewer" class="settings-card card-shell">
          <div class="section-head">
            <div>
              <span class="section-kicker">查看器</span>
              <h2>影像浏览体验</h2>
            </div>
          </div>

          <div class="setting-grid">
            <div class="setting-row">
              <div><strong>默认布局</strong><span>打开检查时的默认排版方式。</span></div>
              <select v-model="defaultLayout"><option v-for="opt in layoutOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>
            </div>
            <div class="setting-row">
              <div><strong>图像质量</strong><span>设置当前影像的渲染质量优先级。</span></div>
              <select v-model="imageQuality"><option value="low">低</option><option value="medium">中</option><option value="high">高</option></select>
            </div>
            <div class="setting-row toggle-row">
              <div><strong>显示叠加信息</strong><span>展示患者元数据与采集参数。</span></div>
              <label class="switch"><input type="checkbox" v-model="showOverlay"><span></span></label>
            </div>
            <div class="setting-row">
              <div><strong>滚轮方向</strong><span>设置滚轮切片翻页的方向。</span></div>
              <select v-model="scrollDirection"><option value="natural">自然</option><option value="reverse">反向</option></select>
            </div>
            <div class="setting-row toggle-row">
              <div><strong>十字参考线</strong><span>在多平面视图中显示交叉定位标记。</span></div>
              <label class="switch"><input type="checkbox" v-model="crosshair"><span></span></label>
            </div>
            <div class="setting-row">
              <div><strong>测量单位</strong><span>设置距离与病灶尺寸的默认单位。</span></div>
              <select v-model="measureUnit"><option value="mm">毫米 (mm)</option><option value="cm">厘米 (cm)</option></select>
            </div>
          </div>
        </section>

        <section id="notifications" class="settings-card card-shell">
          <div class="section-head">
            <div>
              <span class="section-kicker">通知</span>
              <h2>运行提醒</h2>
            </div>
          </div>

          <div class="setting-grid">
            <div class="setting-row toggle-row"><div><strong>危急值提醒</strong><span>检测到紧急结果时立即通知。</span></div><label class="switch"><input type="checkbox" v-model="notifyCritical"><span></span></label></div>
            <div class="setting-row toggle-row"><div><strong>新病例分配</strong><span>当新检查分派到你的团队时提醒。</span></div><label class="switch"><input type="checkbox" v-model="notifyNewCase"><span></span></label></div>
            <div class="setting-row toggle-row"><div><strong>报告复核更新</strong><span>在审批、退回或升级时发送通知。</span></div><label class="switch"><input type="checkbox" v-model="notifyReport"><span></span></label></div>
            <div class="setting-row toggle-row"><div><strong>声音提示</strong><span>收到运行提醒时播放提示音。</span></div><label class="switch"><input type="checkbox" v-model="soundEnabled"><span></span></label></div>
          </div>
        </section>

        <section id="ai" class="settings-card card-shell">
          <div class="section-head">
            <div>
              <span class="section-kicker">AI 策略</span>
              <h2>推理辅助规则</h2>
            </div>
          </div>

          <div class="setting-grid">
            <div class="setting-row toggle-row"><div><strong>打开即自动分析</strong><span>载入检查后自动运行推理。</span></div><label class="switch"><input type="checkbox" v-model="aiAutoAnalyze"><span></span></label></div>
            <div class="setting-row"><div><strong>置信度阈值</strong><span>将低置信度建议标记为二次复核对象。</span></div><div class="range-wrap"><input type="range" v-model.number="aiConfidenceThreshold" min="50" max="99"><strong>{{ aiConfidenceThreshold }}%</strong></div></div>
            <div class="setting-row toggle-row"><div><strong>高亮病灶</strong><span>在查看器中叠加显示检测到的病灶和可疑区域。</span></div><label class="switch"><input type="checkbox" v-model="aiHighlightFindings"><span></span></label></div>
          </div>
        </section>

        <section id="dicom" class="settings-card card-shell">
          <div class="section-head">
            <div>
              <span class="section-kicker">DICOM 网关</span>
              <h2>PACS 连接</h2>
            </div>
            <button type="button" class="secondary-button compact-button">测试连接</button>
          </div>

          <div class="setting-grid">
            <div class="setting-row"><div><strong>服务器地址</strong><span>DICOM 服务器 IP 地址或主机名。</span></div><input v-model="dicomServerHost" type="text"></div>
            <div class="setting-row"><div><strong>端口</strong><span>PACS 通信监听端口。</span></div><input v-model="dicomServerPort" type="text" class="small-input"></div>
            <div class="setting-row"><div><strong>AE 标题</strong><span>当前工作站使用的应用实体名称。</span></div><input v-model="dicomAeTitle" type="text"></div>
            <div class="setting-row toggle-row"><div><strong>自动拉取检查</strong><span>自动从 PACS 获取新到达的检查。</span></div><label class="switch"><input type="checkbox" v-model="dicomAutoFetch"><span></span></label></div>
          </div>
        </section>
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
.settings-shell,
.section-head,
.setting-row,
.range-wrap {
  display: flex;
  align-items: center;
}

.page-head {
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.eyebrow,
.nav-kicker,
.section-kicker {
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
  max-width: 760px;
  color: #64748b;
  font-size: 15px;
  line-height: 1.6;
}

.page-actions { gap: 12px; }

.primary-button,
.secondary-button,
.compact-button,
.theme-card,
.settings-nav-item {
  border: none;
  cursor: pointer;
}

.primary-button,
.secondary-button {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
}

.compact-button { min-height: 40px; }

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

.save-pill {
  padding: 8px 12px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-size: 12px;
  font-weight: 800;
}

.settings-shell {
  align-items: flex-start;
  gap: 20px;
}

.card-shell {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(230, 237, 245, 0.95);
  border-radius: 22px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
}

.settings-nav {
  width: 240px;
  padding: 18px;
  position: sticky;
  top: 16px;
}

.nav-kicker { display: block; margin-bottom: 12px; }

.settings-nav-item {
  display: block;
  padding: 12px 14px;
  border-radius: 14px;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.settings-nav-item:hover,
.settings-nav-item.active {
  background: #eef3f9;
  color: #1659c1;
}

.settings-content {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 20px;
}

.settings-card { padding: 20px; }

.section-head {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.section-head h2 {
  margin: 4px 0 0;
  font-size: 18px;
  color: #111827;
  font-weight: 800;
}

.setting-grid { display: grid; gap: 2px; }

.setting-row {
  justify-content: space-between;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid #edf2f7;
}

.setting-row:first-child { border-top: none; }

.setting-row > div:first-child {
  display: grid;
  gap: 4px;
}

.setting-row strong {
  font-size: 14px;
  color: #111827;
}

.setting-row span {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

select,
input[type='text'] {
  min-width: 220px;
  min-height: 46px;
  border: 1px solid #e5edf5;
  border-radius: 14px;
  background: #f8fbff;
  color: #334155;
  padding: 0 14px;
  box-shadow: none;
}

.small-input { max-width: 120px; }

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.theme-card {
  text-align: left;
  padding: 16px;
  border-radius: 18px;
  background: #f8fbff;
  border: 1px solid #e5edf5;
}

.theme-card.active {
  border-color: #1659c1;
  box-shadow: 0 0 0 3px rgba(22, 89, 193, 0.08);
}

.theme-card strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
  color: #111827;
}

.theme-card small {
  color: #64748b;
  font-size: 12px;
}

.theme-preview {
  height: 92px;
  border-radius: 14px;
  padding: 10px;
  margin-bottom: 14px;
  display: grid;
  grid-template-columns: 28% 1fr 1fr;
  gap: 8px;
}

.theme-preview span { border-radius: 10px; }
.theme-light-preview { background: #fff; border: 1px solid #e5edf5; }
.theme-light-preview span:nth-child(1) { background: #eef3f9; }
.theme-light-preview span:nth-child(2) { background: #f8fbff; }
.theme-light-preview span:nth-child(3) { background: #1659c1; opacity: 0.14; }
.theme-dark-preview { background: #0f172a; }
.theme-dark-preview span:nth-child(1) { background: #1e293b; }
.theme-dark-preview span:nth-child(2) { background: #162033; }
.theme-dark-preview span:nth-child(3) { background: #1659c1; opacity: 0.5; }

.switch {
  position: relative;
  display: inline-flex;
}

.switch input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch span {
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: #dbe4f0;
  position: relative;
  transition: background 0.2s ease;
}

.switch span::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
  transition: transform 0.2s ease;
}

.switch input:checked + span {
  background: #1659c1;
}

.switch input:checked + span::after {
  transform: translateX(20px);
}

.range-wrap {
  gap: 12px;
}

.range-wrap input[type='range'] {
  min-width: 180px;
}

@media (max-width: 1080px) {
  .settings-shell { flex-direction: column; }
  .settings-nav { width: 100%; position: static; }
}

@media (max-width: 760px) {
  .brand-page { padding: 16px; }
  .page-head,
  .section-head,
  .setting-row { flex-direction: column; align-items: stretch; }
  .page-title { font-size: 32px; }
  .page-actions { flex-direction: column; }
  .theme-grid { grid-template-columns: 1fr; }
  select,
  input[type='text'] { min-width: 0; width: 100%; }
}
</style>