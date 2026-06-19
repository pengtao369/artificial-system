<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="two-col">
    <div class="panel">
      <SectionHeader eyebrow="M08 Security" title="安全能力状态" />
      <div class="security-grid">
        <div><ShieldCheck :size="22" /><strong>Keycloak OIDC</strong><span>MFA + 离线 JWT</span></div>
        <div><KeyRound :size="22" /><strong>Vault KMS</strong><span>证书轮换 30天预警</span></div>
        <div><Lock :size="22" /><strong>TLS 1.3 / mTLS</strong><span>APISIX + Istio</span></div>
        <div><FileCheck2 :size="22" /><strong>Append-only Audit</strong><span>Kafka + ES + Hash Chain</span></div>
      </div>
    </div>
    <div class="panel">
      <SectionHeader eyebrow="RBAC" title="角色访问矩阵" />
      <div class="task-row"><span>主管 / 区域经理</span><strong>绩效与审批</strong></div>
      <div class="task-row"><span>财务审批员</span><strong>支付与规则</strong></div>
      <div class="task-row"><span>系统管理员</span><strong>用户与设备</strong></div>
      <div class="task-row"><span>审计员</span><strong>只读审计</strong></div>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="Immutable Logs" title="不可篡改审计日志">
      <div class="toolbar">
        <input v-model="keyword" placeholder="搜索用户 / 动作 / 资源" />
        <button class="secondary-btn" @click="exportAudit">导出审计</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead><tr><th>日志ID</th><th>用户</th><th>动作</th><th>资源</th><th>IP</th><th>链式哈希</th><th>时间</th></tr></thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id" class="clickable-row" @click="selected = log">
            <td><strong>{{ log.id }}</strong></td>
            <td>{{ log.user }}</td>
            <td><StatusBadge :label="log.action" /></td>
            <td>{{ log.resource }}</td>
            <td>{{ log.ip }}</td>
            <td>{{ log.hash }}</td>
            <td>{{ log.time }}</td>
          </tr>
          <tr v-if="filteredLogs.length === 0">
            <td colspan="7" class="empty-cell">没有匹配的审计日志</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <AppModal :open="Boolean(selected)" eyebrow="Audit Log" :title="selected?.id || ''" @close="selected = null">
    <div v-if="selected" class="detail-grid">
      <div><span>用户</span><strong>{{ selected.user }}</strong></div>
      <div><span>动作</span><strong>{{ selected.action }}</strong></div>
      <div><span>资源</span><strong>{{ selected.resource }}</strong></div>
      <div><span>IP</span><strong>{{ selected.ip }}</strong></div>
      <div><span>链式哈希</span><strong>{{ selected.hash }}</strong></div>
      <div><span>时间</span><strong>{{ selected.time }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="copyHash(selected)">复制哈希</button>
      <button class="primary-btn" @click="verifyLog(selected)">校验完整性</button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { FileCheck2, KeyRound, Lock, ShieldCheck } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { auditLogs } from '../data/mock'

const keyword = ref('')
const selected = ref(null)
const toast = reactive({ message: '', tone: 'success' })

const filteredLogs = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return auditLogs.filter((log) => !q || [log.user, log.action, log.resource, log.ip, log.hash].some((field) => String(field).toLowerCase().includes(q)))
})

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function exportAudit() {
  notify(`已生成 ${filteredLogs.value.length} 条审计日志导出任务`, 'info')
}

function copyHash(log) {
  navigator.clipboard?.writeText(log.hash)
  notify('链式哈希已复制')
}

function verifyLog(log) {
  notify(`${log.id} 哈希链校验通过`)
}
</script>
