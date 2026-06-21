<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="panel">
    <SectionHeader eyebrow="M04 Enrollment Engine" title="登记质量与去重结果">
      <div class="toolbar">
        <select v-model="statusFilter">
          <option>全部状态</option>
          <option>需人工复核</option>
          <option>疑似重复</option>
          <option>已入主库</option>
        </select>
        <button class="secondary-btn" @click="exportReview"><Download :size="16" />导出复核清单</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead><tr><th>记录ID</th><th>操作员</th><th>区域</th><th>质量评分</th><th>去重</th><th>GPS精度</th><th>模态</th><th>同步</th><th>状态</th></tr></thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.id" class="clickable-row" @click="selected = record">
            <td><strong>{{ record.id }}</strong></td>
            <td>{{ record.operator }}</td>
            <td>{{ record.region }}</td>
            <td><span class="score">{{ record.score }}</span></td>
            <td><StatusBadge :label="record.duplicate" /></td>
            <td>{{ record.gps }}</td>
            <td>{{ record.bio }}</td>
            <td>{{ record.synced }}</td>
            <td><StatusBadge :label="record.status" /></td>
          </tr>
          <tr v-if="filteredRecords.length === 0">
            <td colspan="9" class="empty-cell">没有匹配的登记记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="two-col">
    <div class="panel">
      <SectionHeader eyebrow="Scoring" title="质量评分权重" />
      <ProgressBar label="字段完整性" :value="30" />
      <ProgressBar label="生物特征质量" :value="40" />
      <ProgressBar label="GPS精度" :value="15" tone="warn" />
      <ProgressBar label="操作员历史质量" :value="15" tone="warn" />
    </div>
    <div class="panel">
      <SectionHeader eyebrow="Fraud Events" title="异常处置队列" />
      <div class="event-list">
        <article v-for="event in fraudEvents" :key="event.title" class="event-row">
          <StatusBadge :label="event.level" />
          <div><strong>{{ event.title }}</strong><span>{{ event.action }}</span></div>
        </article>
      </div>
    </div>
  </section>

  <AppModal :open="Boolean(selected)" eyebrow="Enrollment Detail" :title="selected?.id || ''" @close="selected = null">
    <div v-if="selected" class="detail-grid">
      <div><span>操作员</span><strong>{{ selected.operator }}</strong></div>
      <div><span>区域</span><strong>{{ selected.region }}</strong></div>
      <div><span>质量评分</span><strong>{{ selected.score }}</strong></div>
      <div><span>去重结果</span><strong>{{ selected.duplicate }}</strong></div>
      <div><span>GPS 精度</span><strong>{{ selected.gps }}</strong></div>
      <div><span>采集模态</span><strong>{{ selected.bio }}</strong></div>
      <div><span>同步状态</span><strong>{{ selected.synced }}</strong></div>
      <div><span>当前状态</span><strong>{{ selected.status }}</strong></div>
      <div v-if="selected.status === '需人工复核'"><span>降级原因</span><strong>连续 3 次采集质量不达标</strong></div>
      <div v-if="selected.score < 60"><span>绩效规则</span><strong>不计入绩效，需主管复核</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="markDuplicate(selected)">标记重复</button>
      <button class="secondary-btn" @click="requestResync(selected)">重新同步</button>
      <button class="primary-btn" @click="approveRecord(selected)">复核通过</button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Download } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import ProgressBar from '../components/ProgressBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { enrollments as enrollmentSeed, fraudEvents } from '../data/mock'

const records = ref(enrollmentSeed.map((item) => ({ ...item })))
const selected = ref(null)
const statusFilter = ref('全部状态')
const toast = reactive({ message: '', tone: 'success' })

const filteredRecords = computed(() => records.value.filter((record) => statusFilter.value === '全部状态' || record.status === statusFilter.value))

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function approveRecord(record) {
  record.status = '已入主库'
  record.duplicate = 'CLEAR'
  notify(`${record.id} 已复核通过`)
}

function markDuplicate(record) {
  record.status = '疑似重复'
  record.duplicate = 'BIOMETRIC_MATCH'
  notify(`${record.id} 已标记为疑似重复`, 'info')
}

function requestResync(record) {
  record.synced = '重新排队'
  notify(`${record.id} 已加入重新同步队列`, 'info')
}

function exportReview() {
  notify(`已导出 ${filteredRecords.value.length} 条登记复核记录`)
}
</script>
