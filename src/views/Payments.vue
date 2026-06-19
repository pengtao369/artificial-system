<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="panel">
    <SectionHeader eyebrow="M07 Payment Orchestration" title="支付执行与对账">
      <div class="toolbar">
        <button class="secondary-btn" @click="generateFile"><FileText :size="16" />生成 ISO 20022</button>
        <button class="primary-btn" @click="executeSelected"><Send :size="16" />执行支付</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead><tr><th>批次号</th><th>银行</th><th>金额</th><th>支付状态</th><th>银行参考号</th><th>对账</th><th>重试</th></tr></thead>
        <tbody>
          <tr v-for="payment in rows" :key="payment.no" :class="['clickable-row', { selected: selected?.no === payment.no }]" @click="selected = payment">
            <td><strong>{{ payment.no }}</strong></td>
            <td>{{ payment.bank }}</td>
            <td>{{ payment.amount }}</td>
            <td><StatusBadge :label="payment.status" /></td>
            <td>{{ payment.ref }}</td>
            <td><StatusBadge :label="payment.reconcile" /></td>
            <td>{{ payment.retry }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="two-col">
    <div class="panel">
      <SectionHeader eyebrow="Bank Adapter" title="支付通道健康" />
      <ProgressBar label="Commercial Bank of Ethiopia" :value="99" />
      <ProgressBar label="Awash Bank" :value="93" tone="warn" />
      <ProgressBar label="Dashen Bank" :value="78" tone="danger" />
    </div>
    <div class="panel">
      <SectionHeader eyebrow="Control" title="强制控制策略" />
      <div class="task-row"><span>Idempotency-Key</span><strong>已启用</strong></div>
      <div class="task-row"><span>支付前反欺诈评分</span><strong>硬阻断</strong></div>
      <div class="task-row"><span>失败自动重试</span><strong>5m / 30m / 2h</strong></div>
    </div>
  </section>

  <AppModal :open="Boolean(selected)" eyebrow="Payment Batch" :title="selected?.no || ''" @close="selected = null">
    <div v-if="selected" class="detail-grid">
      <div><span>银行</span><strong>{{ selected.bank }}</strong></div>
      <div><span>金额</span><strong>{{ selected.amount }}</strong></div>
      <div><span>支付状态</span><strong>{{ selected.status }}</strong></div>
      <div><span>银行参考号</span><strong>{{ selected.ref }}</strong></div>
      <div><span>对账状态</span><strong>{{ selected.reconcile }}</strong></div>
      <div><span>重试次数</span><strong>{{ selected.retry }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="markReconciled(selected)">标记对账匹配</button>
      <button class="secondary-btn" @click="retryPayment(selected)">重试</button>
      <button class="primary-btn" @click="executePayment(selected)">执行支付</button>
    </template>
  </AppModal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { FileText, Send } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import ProgressBar from '../components/ProgressBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { payments } from '../data/mock'

const rows = ref(payments.map((item) => ({ ...item })))
const selected = ref(rows.value[0])
const toast = reactive({ message: '', tone: 'success' })

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function generateFile() {
  notify('ISO 20022 pain.001 文件已生成，等待支付执行', 'info')
}

function executeSelected() {
  if (!selected.value) {
    notify('请先选择支付批次', 'danger')
    return
  }
  executePayment(selected.value)
}

function executePayment(payment) {
  payment.status = 'PAYING'
  payment.ref = `${payment.bank.split(' ')[0].toUpperCase()}-PAY-${Math.floor(Math.random() * 900000 + 100000)}`
  payment.reconcile = 'T+1待对账'
  notify(`${payment.no} 已提交银行通道`)
}

function retryPayment(payment) {
  payment.retry += 1
  payment.status = 'PAYING'
  notify(`${payment.no} 已发起第 ${payment.retry} 次重试`, 'info')
}

function markReconciled(payment) {
  payment.status = 'PAID'
  payment.reconcile = '匹配'
  notify(`${payment.no} 对账已匹配`)
}
</script>
