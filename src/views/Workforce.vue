<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="panel">
    <SectionHeader eyebrow="M01 Workforce" title="操作员列表">
      <div class="toolbar">
        <input v-model="keyword" placeholder="搜索姓名 / 工号 / 区域" />
        <select v-model="region">
          <option>全部区域</option>
          <option v-for="item in regions" :key="item">{{ item }}</option>
        </select>
        <button class="secondary-btn" @click="exportList"><Download :size="16" />导出</button>
        <button class="primary-btn" @click="addOperator"><UserPlus :size="16" />新增操作员</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>工号</th><th>姓名</th><th>区域</th><th>主管</th><th>资质</th><th>状态</th><th>本月登记</th><th>质量评分</th><th>设备</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="op in filteredOperators" :key="op.code" class="clickable-row" @click="selected = op">
            <td>{{ op.code }}</td>
            <td><strong>{{ op.name }}</strong></td>
            <td>{{ op.region }}</td>
            <td>{{ op.supervisor }}</td>
            <td><StatusBadge :label="op.cert" /></td>
            <td><StatusBadge :label="op.status" /></td>
            <td>{{ op.monthly }}</td>
            <td><span class="score">{{ op.quality }}</span></td>
            <td>{{ op.device }}</td>
          </tr>
          <tr v-if="filteredOperators.length === 0">
            <td colspan="9" class="empty-cell">没有匹配的操作员</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="two-col">
    <div class="panel">
      <SectionHeader eyebrow="Certification" title="资质到期队列" />
      <div class="task-row"><span>30天内到期</span><strong>{{ expiringCount }} 人</strong></div>
      <div class="task-row"><span>已过期待停用</span><strong>{{ expiredCount }} 人</strong></div>
      <div class="task-row"><span>待主管确认入职</span><strong>{{ pendingCount }} 人</strong></div>
    </div>
    <div class="panel">
      <SectionHeader eyebrow="Performance" title="绩效趋势摘要" />
      <div class="mini-chart">
        <span style="height:42%"></span><span style="height:63%"></span><span style="height:58%"></span><span style="height:72%"></span><span style="height:86%"></span><span style="height:78%"></span><span style="height:91%"></span>
      </div>
    </div>
  </section>

  <AppModal :open="Boolean(selected)" eyebrow="Operator Detail" :title="selected?.name || ''" @close="selected = null">
    <div v-if="selected" class="detail-grid">
      <div><span>工号</span><strong>{{ selected.code }}</strong></div>
      <div><span>所属区域</span><strong>{{ selected.region }}</strong></div>
      <div><span>主管</span><strong>{{ selected.supervisor }}</strong></div>
      <div><span>绑定设备</span><strong>{{ selected.device }}</strong></div>
      <div><span>本月登记</span><strong>{{ selected.monthly }}</strong></div>
      <div><span>质量评分</span><strong>{{ selected.quality }}</strong></div>
      <div><span>考勤率</span><strong>{{ selected.attendance }}</strong></div>
      <div><span>资质状态</span><strong>{{ selected.cert }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="notify(`已向 ${selected.name} 的主管发送资质提醒`)">发送资质提醒</button>
      <button class="primary-btn" @click="toggleStatus(selected)">
        {{ selected.status === '停用' ? '恢复在岗' : '停用操作员' }}
      </button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Download, UserPlus } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { operators as operatorSeed } from '../data/mock'

const rows = ref(operatorSeed.map((item) => ({ ...item })))
const keyword = ref('')
const region = ref('全部区域')
const selected = ref(null)
const toast = reactive({ message: '', tone: 'success' })

const regions = computed(() => [...new Set(rows.value.map((item) => item.region))])
const filteredOperators = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return rows.value.filter((item) => {
    const matchesKeyword = !q || [item.code, item.name, item.region, item.supervisor, item.device].some((field) => String(field).toLowerCase().includes(q))
    const matchesRegion = region.value === '全部区域' || item.region === region.value
    return matchesKeyword && matchesRegion
  })
})
const expiringCount = computed(() => rows.value.filter((item) => item.cert === '即将到期').length)
const expiredCount = computed(() => rows.value.filter((item) => item.cert === '已过期').length)
const pendingCount = computed(() => rows.value.filter((item) => item.status === '待入职').length)

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function addOperator() {
  const next = rows.value.length + 1
  const item = {
    code: `OP-12${String(next).padStart(3, '0')}`,
    name: 'New Operator',
    region: 'Addis Ababa',
    supervisor: 'Mekdes Haile',
    cert: '有效',
    status: '待入职',
    monthly: 0,
    quality: 0,
    attendance: '0%',
    device: '未绑定'
  }
  rows.value.unshift(item)
  selected.value = item
  notify('已创建待入职操作员，可在详情中继续维护')
}

function toggleStatus(op) {
  op.status = op.status === '停用' ? '在岗' : '停用'
  notify(`${op.name} 已${op.status === '停用' ? '停用' : '恢复在岗'}`)
}

function exportList() {
  notify(`已生成 ${filteredOperators.value.length} 条操作员导出任务`, 'info')
}
</script>
