<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="panel">
    <SectionHeader eyebrow="F031 App Release" title="App 版本管理与灰度发布">
      <div class="toolbar">
        <select v-model="releaseFilter">
          <option>全部状态</option>
          <option>进行中</option>
          <option>已完成</option>
          <option>可回滚</option>
          <option>待联网提示</option>
        </select>
        <button class="secondary-btn" @click="rollbackSelected"><RotateCcw :size="16" />版本回滚</button>
        <button class="primary-btn" @click="promoteSelected"><Rocket :size="16" />推进灰度</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>版本</th><th>区域</th><th>灰度比例</th><th>通道</th><th>状态</th><th>强制升级</th><th>Bug级别</th><th>在线覆盖</th><th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="release in filteredReleases" :key="`${release.version}-${release.region}`" :class="['clickable-row', { selected: selectedRelease === release }]" @click="selectedRelease = release">
            <td><strong>{{ release.version }}</strong></td>
            <td>{{ release.region }}</td>
            <td><ProgressBar label="" :value="release.rollout" :tone="release.rollout >= 100 ? 'good' : release.rollout >= 20 ? 'warn' : 'danger'" /></td>
            <td>{{ release.channel }}</td>
            <td><StatusBadge :label="release.status" /></td>
            <td>{{ release.force }}</td>
            <td><StatusBadge :label="release.bug" /></td>
            <td>{{ release.online }}</td>
            <td>{{ release.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="F030 Health" title="系统健康监控" />
    <div class="health-grid">
      <article v-for="service in healthRows" :key="service.service" class="health-card">
        <div class="sync-card-head">
          <strong>{{ service.service }}</strong>
          <StatusBadge :label="service.alert" />
        </div>
        <div class="detail-grid compact-detail">
          <div><span>Live</span><strong>{{ service.live }}</strong></div>
          <div><span>Ready</span><strong>{{ service.ready }}</strong></div>
          <div><span>P99</span><strong>{{ service.p99 }}</strong></div>
          <div><span>Error</span><strong>{{ service.errorRate }}</strong></div>
        </div>
        <ProgressBar label="资源饱和度" :value="service.saturation" :tone="service.saturation > 80 ? 'danger' : service.saturation > 60 ? 'warn' : 'good'" />
      </article>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="AlertManager" title="告警规则与通知路由">
      <button class="secondary-btn" @click="muteRule"><BellOff :size="16" />维护静默</button>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead><tr><th>规则ID</th><th>指标</th><th>阈值</th><th>级别</th><th>通知路由</th><th>状态</th></tr></thead>
        <tbody>
          <tr v-for="rule in alertRows" :key="rule.id" class="clickable-row" @click="selectedRule = rule">
            <td><strong>{{ rule.id }}</strong></td>
            <td>{{ rule.metric }}</td>
            <td>{{ rule.threshold }}</td>
            <td><StatusBadge :label="rule.severity" /></td>
            <td>{{ rule.route }}</td>
            <td><StatusBadge :label="rule.status" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <AppModal :open="Boolean(selectedRelease)" eyebrow="Release Control" :title="selectedRelease?.version || ''" @close="selectedRelease = null">
    <div v-if="selectedRelease" class="detail-grid">
      <div><span>区域</span><strong>{{ selectedRelease.region }}</strong></div>
      <div><span>灰度比例</span><strong>{{ selectedRelease.rollout }}%</strong></div>
      <div><span>发布通道</span><strong>{{ selectedRelease.channel }}</strong></div>
      <div><span>强制升级</span><strong>{{ selectedRelease.force }}</strong></div>
      <div><span>离线策略</span><strong>离线不强制，联网后提示</strong></div>
      <div><span>回滚策略</span><strong>保留上一稳定版</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="rollbackSelected">回滚</button>
      <button class="primary-btn" @click="promoteSelected">推进灰度</button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { BellOff, Rocket, RotateCcw } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import ProgressBar from '../components/ProgressBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { alertRules, appReleases, healthChecks } from '../data/mock'

const releases = ref(appReleases.map((item) => ({ ...item })))
const alertRows = ref(alertRules.map((item) => ({ ...item })))
const healthRows = ref(healthChecks.map((item) => ({ ...item })))
const releaseFilter = ref('全部状态')
const selectedRelease = ref(releases.value[0])
const selectedRule = ref(alertRows.value[0])
const toast = reactive({ message: '', tone: 'success' })

const filteredReleases = computed(() => releases.value.filter((item) => releaseFilter.value === '全部状态' || item.status === releaseFilter.value))

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function promoteSelected() {
  if (!selectedRelease.value) {
    notify('请先选择一个发布版本', 'danger')
    return
  }
  selectedRelease.value.rollout = selectedRelease.value.rollout >= 20 ? 100 : 20
  selectedRelease.value.status = selectedRelease.value.rollout === 100 ? '已完成' : '进行中'
  selectedRelease.value.channel = selectedRelease.value.rollout === 100 ? '稳定版' : '灰度'
  notify(`${selectedRelease.value.version} 已推进到 ${selectedRelease.value.rollout}%`)
}

function rollbackSelected() {
  if (!selectedRelease.value) {
    notify('请先选择一个发布版本', 'danger')
    return
  }
  selectedRelease.value.rollout = 0
  selectedRelease.value.status = '可回滚'
  selectedRelease.value.channel = '回滚保留'
  notify(`${selectedRelease.value.version} 已切换为回滚保留`, 'info')
}

function muteRule() {
  if (!selectedRule.value) {
    notify('请先选择告警规则', 'danger')
    return
  }
  selectedRule.value.status = selectedRule.value.status === '维护静默' ? '已启用' : '维护静默'
  notify(`${selectedRule.value.id} 已更新为 ${selectedRule.value.status}`, 'info')
}
</script>
