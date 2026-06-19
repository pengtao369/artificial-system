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
    <div class="approval-flow">
      <div><strong>主管</strong><span>团队明细初审</span></div>
      <div><strong>区域经理</strong><span>区域汇总复审</span></div>
      <div><strong>财务审批</strong><span>预算与支付准备</span></div>
      <div><strong>CEO/CFO</strong><span>ETB 500,000+ 大额终审</span></div>
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
import { reactive, ref } from 'vue'
import { Calculator, CheckCircle2 } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { payrollBatches } from '../data/mock'

const batches = ref(payrollBatches.map((item) => ({ ...item })))
const selected = ref(null)
const comment = ref('')
const toast = reactive({ message: '', tone: 'success' })

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
</script>
