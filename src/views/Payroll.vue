<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="panel">
    <SectionHeader eyebrow="M05/M06 WFOS" title="薪酬批次审批">
      <div class="toolbar">
        <button class="secondary-btn" @click="calculatePayroll"><Calculator :size="16" />触发月结</button>
        <button class="primary-btn" @click="approveAll"><CheckCircle2 :size="16" />批量审批</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead><tr><th>批次号</th><th>周期</th><th>金额</th><th>操作员</th><th>当前层级</th><th>等待</th><th>反欺诈评分</th><th>状态</th></tr></thead>
        <tbody>
          <tr v-for="batch in batches" :key="batch.no" class="clickable-row" @click="selected = batch">
            <td><strong>{{ batch.no }}</strong></td>
            <td>{{ batch.period }}</td>
            <td>{{ batch.amount }}</td>
            <td>{{ batch.operators }}</td>
            <td>{{ batch.stage }}</td>
            <td>{{ batch.wait }}</td>
            <td><span class="score">{{ batch.fraud }}</span></td>
            <td><StatusBadge :label="batch.status" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="Approval Workflow" title="审批链路" />
    <p class="inline-note">Demo 模式：月结按钮模拟生成批次；生产环境需调用 incentive-service 加载规则版本、拉取绩效聚合并执行可追溯计算。</p>
    <div class="approval-flow">
      <div><strong>主管</strong><span>团队明细初审</span></div>
      <div><strong>区域经理</strong><span>区域汇总复审</span></div>
      <div><strong>财务审批</strong><span>预算与支付准备</span></div>
      <div><strong>CEO/CFO</strong><span>ETB 500,000+ 大额终审</span></div>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="F011 Incentive Rules" title="激励规则编辑器">
      <div class="toolbar">
        <select v-model="ruleStatus">
          <option>全部规则</option>
          <option>已启用</option>
          <option>草稿</option>
        </select>
        <button class="secondary-btn" @click="cloneRule"><CopyPlus :size="16" />复制版本</button>
        <button class="primary-btn" @click="activateRule"><CheckCircle2 :size="16" />启用规则</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead><tr><th>规则ID</th><th>名称</th><th>版本</th><th>条件</th><th>公式</th><th>状态</th><th>影响</th></tr></thead>
        <tbody>
          <tr v-for="rule in filteredRules" :key="rule.id" :class="['clickable-row', { selected: selectedRule?.id === rule.id }]" @click="selectedRule = rule">
            <td><strong>{{ rule.id }}</strong></td>
            <td>{{ rule.name }}</td>
            <td>{{ rule.version }}</td>
            <td>{{ rule.condition }}</td>
            <td>{{ rule.formula }}</td>
            <td><StatusBadge :label="rule.status" /></td>
            <td>{{ rule.impact }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <AppModal :open="Boolean(selected)" eyebrow="Payroll Batch" :title="selected?.no || ''" @close="selected = null">
    <div v-if="selected" class="detail-grid">
      <div><span>周期</span><strong>{{ selected.period }}</strong></div>
      <div><span>总金额</span><strong>{{ selected.amount }}</strong></div>
      <div><span>操作员</span><strong>{{ selected.operators }}</strong></div>
      <div><span>当前层级</span><strong>{{ selected.stage }}</strong></div>
      <div><span>等待时长</span><strong>{{ selected.wait }}</strong></div>
      <div><span>反欺诈评分</span><strong>{{ selected.fraud }}</strong></div>
      <div><span>状态</span><strong>{{ selected.status }}</strong></div>
      <div><span>阈值判断</span><strong>{{ selected.amount.includes('728') ? '需CEO/CFO终审' : '常规审批' }}</strong></div>
    </div>
    <div class="form-row">
      <label>审批意见</label>
      <textarea v-model="comment" placeholder="填写审批意见或驳回原因"></textarea>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="rejectBatch(selected)">驳回</button>
      <button class="secondary-btn" @click="adjustBatch(selected)">要求调整</button>
      <button class="primary-btn" @click="approveBatch(selected)">通过</button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Calculator, CheckCircle2, CopyPlus } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { incentiveRules, payrollBatches } from '../data/mock'

const batches = ref(payrollBatches.map((item) => ({ ...item })))
const rules = ref(incentiveRules.map((item) => ({ ...item })))
const selected = ref(null)
const selectedRule = ref(rules.value[0])
const ruleStatus = ref('全部规则')
const comment = ref('')
const toast = reactive({ message: '', tone: 'success' })
const filteredRules = computed(() => rules.value.filter((rule) => ruleStatus.value === '全部规则' || rule.status === ruleStatus.value))

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function approveBatch(batch) {
  batch.status = batch.stage.includes('CEO') ? '审批通过' : '已推送下一级'
  batch.stage = batch.stage.includes('CEO') ? '进入支付队列' : '下一审批层级'
  notify(`${batch.no} 已审批通过`)
  comment.value = ''
}

function rejectBatch(batch) {
  batch.status = '已驳回'
  batch.stage = '退回草稿'
  notify(`${batch.no} 已驳回，原因已写入审计日志`, 'danger')
  comment.value = ''
}

function adjustBatch(batch) {
  batch.status = '要求调整'
  notify(`${batch.no} 已要求调整金额明细`, 'info')
}

function approveAll() {
  batches.value.forEach((batch) => {
    if (!['已驳回', '要求调整'].includes(batch.status)) {
      batch.status = '批量通过'
      batch.stage = '进入支付队列'
    }
  })
  notify('符合条件的薪酬批次已批量通过')
}

function calculatePayroll() {
  // Demo: production closing should call incentive-service for versioned rule calculation.
  const no = `BAT-20260617-000${140 + batches.value.length}`
  batches.value.unshift({
    no,
    period: '2026-06',
    amount: 'ETB 236,500',
    operators: 64,
    stage: '主管审批',
    wait: '0h',
    fraud: 93,
    status: '待审批'
  })
  notify(`${no} 已生成并进入审批流`)
}

function cloneRule() {
  if (!selectedRule.value) {
    notify('请先选择一条激励规则', 'danger')
    return
  }
  const item = {
    ...selectedRule.value,
    id: `${selectedRule.value.id}-DRAFT`,
    version: 'v2026.07-draft',
    status: '草稿'
  }
  rules.value.unshift(item)
  selectedRule.value = item
  notify(`${item.name} 已复制为新草稿`, 'info')
}

function activateRule() {
  if (!selectedRule.value) {
    notify('请先选择一条激励规则', 'danger')
    return
  }
  selectedRule.value.status = '已启用'
  notify(`${selectedRule.value.name} 已启用，后续月结将使用该规则版本`)
}
</script>
