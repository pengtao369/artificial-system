<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="panel">
    <SectionHeader eyebrow="M09/M10 Dispatch" title="任务分发与抢单监控">
      <div class="toolbar">
        <select v-model="statusFilter">
          <option>全部状态</option>
          <option>待抢单</option>
          <option>执行中</option>
          <option>待结算</option>
        </select>
        <button class="secondary-btn" @click="simulatePush"><Send :size="16" />推送到 App</button>
        <button class="primary-btn" @click="createTask"><PlusCircle :size="16" />发布任务</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>任务号</th><th>区域</th><th>难度</th><th>紧急度</th><th>目标</th><th>分配/抢单</th><th>完成率</th><th>单价</th><th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id" class="clickable-row" @click="selectedTask = task">
            <td><strong>{{ task.id }}</strong></td>
            <td>{{ task.region }}</td>
            <td>{{ task.areaLevel }}</td>
            <td><StatusBadge :label="task.urgency" /></td>
            <td>{{ task.target }}</td>
            <td>{{ task.assigned }} / {{ task.claimed }}</td>
            <td><ProgressBar label="" :value="task.progress" :tone="task.progress > 80 ? 'good' : task.progress > 50 ? 'warn' : 'danger'" /></td>
            <td>{{ task.price }}</td>
            <td><StatusBadge :label="task.status" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="two-col">
    <div class="panel">
      <SectionHeader eyebrow="Pricing Engine" title="差异化定价规则" />
      <div class="rule-list">
        <article v-for="rule in pricingRules" :key="rule.level" class="rule-card">
          <strong>{{ rule.level }}</strong>
          <span>{{ rule.coefficient }} · {{ rule.base }}</span>
          <span>{{ rule.urgent }} · {{ rule.settlement }}</span>
        </article>
      </div>
    </div>
    <div class="panel">
      <SectionHeader eyebrow="Coverage" title="区域覆盖与团队排名" />
      <div class="leaderboard">
        <div v-for="task in rankedTasks" :key="task.id" class="task-row">
          <span>{{ task.region }}</span>
          <strong>{{ task.coverage }} / 质量 {{ task.quality }}</strong>
        </div>
      </div>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="Anti-abuse" title="抢单资格与信誉分" />
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>操作员</th><th>姓名</th><th>常规完成率</th><th>今日抢单</th><th>信誉分</th><th>资格</th><th>风控提示</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in reputationRows" :key="row.operator">
            <td><strong>{{ row.operator }}</strong></td>
            <td>{{ row.name }}</td>
            <td>{{ row.regularRate }}</td>
            <td>{{ row.bidCount }}</td>
            <td><span class="score">{{ row.reputation }}</span></td>
            <td><StatusBadge :label="row.eligibility" /></td>
            <td>{{ row.warning }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <AppModal :open="Boolean(selectedTask)" eyebrow="Task Detail" :title="selectedTask?.id || ''" @close="selectedTask = null">
    <div v-if="selectedTask" class="detail-grid">
      <div><span>区域</span><strong>{{ selectedTask.region }}</strong></div>
      <div><span>目标登记数</span><strong>{{ selectedTask.target }}</strong></div>
      <div><span>难度等级</span><strong>{{ selectedTask.areaLevel }}</strong></div>
      <div><span>紧急度</span><strong>{{ selectedTask.urgency }}</strong></div>
      <div><span>任务单价</span><strong>{{ selectedTask.price }}</strong></div>
      <div><span>覆盖率</span><strong>{{ selectedTask.coverage }}</strong></div>
      <div><span>质量结算</span><strong>{{ settlementText(selectedTask.quality) }}</strong></div>
      <div><span>当前状态</span><strong>{{ selectedTask.status }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="flagTask(selectedTask)">标记风控复核</button>
      <button class="primary-btn" @click="claimTask(selectedTask)">模拟抢单</button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { PlusCircle, Send } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import ProgressBar from '../components/ProgressBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { fieldTasks, pricingRules, reputationRows } from '../data/mock'

const tasks = ref(fieldTasks.map((item) => ({ ...item })))
const selectedTask = ref(null)
const statusFilter = ref('全部状态')
const toast = reactive({ message: '', tone: 'success' })

const filteredTasks = computed(() => tasks.value.filter((task) => statusFilter.value === '全部状态' || task.status === statusFilter.value))
const rankedTasks = computed(() => [...tasks.value].sort((a, b) => b.quality - a.quality).slice(0, 4))

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function settlementText(quality) {
  if (quality >= 80) return '全额结算'
  if (quality >= 60) return '八折结算'
  return '五折结算并主管复核'
}

function createTask() {
  const item = {
    id: `TASK-AA-0621-${10 + tasks.value.length}`,
    region: 'Addis Ababa',
    areaLevel: 'L1 城市近郊',
    urgency: '常规',
    target: 90,
    assigned: 3,
    claimed: 0,
    progress: 0,
    price: 'ETB 900',
    status: '待抢单',
    quality: 0,
    coverage: '0%'
  }
  tasks.value.unshift(item)
  selectedTask.value = item
  notify('任务已发布，等待 App 端抢单')
}

function claimTask(task) {
  task.claimed += 1
  task.status = '执行中'
  notify(`${task.id} 已完成资质检查并锁定抢单名额`)
}

function flagTask(task) {
  task.status = '风控复核'
  notify(`${task.id} 已提交反串谋与 GPS 可达性复核`, 'info')
}

function simulatePush() {
  notify(`已向 ${filteredTasks.value.length} 个任务的候选操作员推送 App 今日任务卡`, 'info')
}
</script>
