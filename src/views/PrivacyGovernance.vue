<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="kpi-grid compact">
    <KpiCard v-for="item in consentStats" :key="item.label" v-bind="item" />
  </section>

  <section class="panel">
    <SectionHeader eyebrow="F028 Data Governance" title="数据分级与脱敏策略">
      <div class="toolbar">
        <select v-model="levelFilter">
          <option>全部等级</option>
          <option>L2 内部敏感</option>
          <option>L3 高敏</option>
          <option>L4 受限</option>
        </select>
        <button class="secondary-btn" @click="exportPolicy"><Download :size="16" />导出策略</button>
        <button class="primary-btn" @click="selectedRule = filteredRules[0]"><ShieldCheck :size="16" />策略复核</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>字段</th><th>分类</th><th>等级</th><th>脱敏规则</th><th>主管</th><th>财务</th><th>审计</th><th>留存</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rule in filteredRules" :key="rule.field" class="clickable-row" @click="selectedRule = rule">
            <td><strong>{{ rule.field }}</strong></td>
            <td>{{ rule.category }}</td>
            <td><StatusBadge :label="rule.level" /></td>
            <td>{{ rule.masking }}</td>
            <td>{{ rule.supervisor }}</td>
            <td>{{ rule.finance }}</td>
            <td>{{ rule.auditor }}</td>
            <td>{{ rule.retention }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="F034 Subject Rights" title="公民数据主体权利工单">
      <div class="toolbar">
        <input v-model="keyword" placeholder="搜索工单 / 公民编号 / 区域" />
        <button class="primary-btn" @click="createRequest"><FilePlus2 :size="16" />新建工单</button>
      </div>
    </SectionHeader>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>工单号</th><th>公民编号</th><th>请求类型</th><th>区域</th><th>渠道</th><th>SLA</th><th>阶段</th><th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in filteredRequests" :key="request.id" class="clickable-row" @click="selectedRequest = request">
            <td><strong>{{ request.id }}</strong></td>
            <td>{{ request.citizen }}</td>
            <td>{{ request.type }}</td>
            <td>{{ request.region }}</td>
            <td>{{ request.channel }}</td>
            <td>{{ request.sla }}</td>
            <td>{{ request.stage }}</td>
            <td><StatusBadge :label="request.status" /></td>
          </tr>
          <tr v-if="filteredRequests.length === 0">
            <td colspan="8" class="empty-cell">没有匹配的权利请求</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="Consent Audit" title="知情同意与隐私审批链路" />
    <div class="approval-flow">
      <div><strong>声明展示</strong><span>移动端记录版本号、语言、GPS 与时间戳</span></div>
      <div><strong>电子同意</strong><span>签名摘要写入审计日志，原文版本可追溯</span></div>
      <div><strong>撤回/更正</strong><span>生成 DSR 工单并进入主管核验</span></div>
      <div><strong>隐私官终审</strong><span>执行最小披露、留存或销毁策略</span></div>
    </div>
  </section>

  <AppModal :open="Boolean(selectedRule)" eyebrow="Masking Rule" :title="selectedRule?.field || ''" @close="selectedRule = null">
    <div v-if="selectedRule" class="detail-grid">
      <div><span>数据分类</span><strong>{{ selectedRule.category }}</strong></div>
      <div><span>敏感等级</span><strong>{{ selectedRule.level }}</strong></div>
      <div><span>脱敏策略</span><strong>{{ selectedRule.masking }}</strong></div>
      <div><span>留存周期</span><strong>{{ selectedRule.retention }}</strong></div>
      <div><span>主管可见性</span><strong>{{ selectedRule.supervisor }}</strong></div>
      <div><span>财务可见性</span><strong>{{ selectedRule.finance }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="notify('已生成脱敏回归测试任务', 'info')">生成测试</button>
      <button class="primary-btn" @click="approveRule">确认复核</button>
    </template>
  </AppModal>

  <AppModal :open="Boolean(selectedRequest)" eyebrow="Subject Request" :title="selectedRequest?.id || ''" @close="selectedRequest = null">
    <div v-if="selectedRequest" class="detail-grid">
      <div><span>公民编号</span><strong>{{ selectedRequest.citizen }}</strong></div>
      <div><span>请求类型</span><strong>{{ selectedRequest.type }}</strong></div>
      <div><span>提交渠道</span><strong>{{ selectedRequest.channel }}</strong></div>
      <div><span>责任人</span><strong>{{ selectedRequest.owner }}</strong></div>
      <div><span>当前阶段</span><strong>{{ selectedRequest.stage }}</strong></div>
      <div><span>SLA</span><strong>{{ selectedRequest.sla }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="rejectRequest(selectedRequest)">驳回</button>
      <button class="primary-btn" @click="approveRequest(selectedRequest)">通过并流转</button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Download, FilePlus2, ShieldCheck } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import KpiCard from '../components/KpiCard.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { consentStats, dataClassificationRules, subjectRequests } from '../data/mock'

const rules = ref(dataClassificationRules.map((item) => ({ ...item })))
const requests = ref(subjectRequests.map((item) => ({ ...item })))
const levelFilter = ref('全部等级')
const keyword = ref('')
const selectedRule = ref(null)
const selectedRequest = ref(null)
const toast = reactive({ message: '', tone: 'success' })

const filteredRules = computed(() => rules.value.filter((rule) => levelFilter.value === '全部等级' || rule.level === levelFilter.value))
const filteredRequests = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return requests.value.filter((item) => !q || [item.id, item.citizen, item.type, item.region, item.stage].some((field) => String(field).toLowerCase().includes(q)))
})

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function exportPolicy() {
  notify(`已导出 ${filteredRules.value.length} 条数据分级策略`, 'info')
}

function approveRule() {
  notify(`${selectedRule.value.field} 已完成策略复核`)
  selectedRule.value = null
}

function createRequest() {
  const item = {
    id: `DSR-20260619-${120 + requests.value.length}`,
    citizen: 'ETH-****-NEW',
    type: '查询个人数据',
    region: 'Addis Ababa',
    channel: '现场服务台',
    sla: '48h',
    stage: '主管核验',
    status: '待审批',
    owner: 'Regional Manager'
  }
  requests.value.unshift(item)
  selectedRequest.value = item
  notify('已创建公民权利请求工单')
}

function approveRequest(request) {
  request.stage = request.stage === '隐私官终审' ? '已归档' : '下一审批节点'
  request.status = request.stage === '已归档' ? '已完成' : '处理中'
  notify(`${request.id} 已通过并写入审计日志`)
}

function rejectRequest(request) {
  request.stage = '退回补充材料'
  request.status = '已驳回'
  notify(`${request.id} 已退回补充材料`, 'danger')
}
</script>
