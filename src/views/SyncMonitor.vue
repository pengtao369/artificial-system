<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="panel">
    <SectionHeader eyebrow="M03/M04 Offline First" title="区域边缘同步队列">
      <div class="toolbar">
        <button class="secondary-btn" @click="simulateSync"><Zap :size="16" />模拟同步</button>
        <button class="primary-btn" @click="replayFailed"><RotateCw :size="16" />重放失败队列</button>
      </div>
    </SectionHeader>
    <div class="sync-grid">
      <article v-for="item in queues" :key="item.node" :class="['sync-card', { active: selected?.node === item.node }]" @click="selected = item">
        <div class="sync-card-head">
          <strong>{{ item.node }}</strong>
          <StatusBadge :label="item.mode" />
        </div>
        <p>{{ item.region }}</p>
        <div class="sync-stats">
          <span><b>{{ item.pending }}</b>待同步</span>
          <span><b>{{ item.failed }}</b>失败</span>
          <span><b>{{ item.latency }}</b>延迟</span>
          <span><b>{{ item.throughput }}</b>吞吐</span>
        </div>
      </article>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="Reliable Sync" title="离线同步处理链路" />
    <div class="flow">
      <span>本地加密DB</span>
      <i></i>
      <span>WAL同步队列</span>
      <i></i>
      <span>区域网关去重</span>
      <i></i>
      <span>Kafka削峰</span>
      <i></i>
      <span>国家核心ACK</span>
    </div>
  </section>

  <AppModal :open="Boolean(selected)" eyebrow="Edge Node" :title="selected?.node || ''" @close="selected = null">
    <div v-if="selected" class="detail-grid">
      <div><span>区域</span><strong>{{ selected.region }}</strong></div>
      <div><span>运行模式</span><strong>{{ selected.mode }}</strong></div>
      <div><span>待同步</span><strong>{{ selected.pending }}</strong></div>
      <div><span>失败队列</span><strong>{{ selected.failed }}</strong></div>
      <div><span>延迟</span><strong>{{ selected.latency }}</strong></div>
      <div><span>可用性</span><strong>{{ selected.uptime }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="setMode(selected, '离线自治')">切换自治</button>
      <button class="secondary-btn" @click="setMode(selected, '弱网')">标记弱网</button>
      <button class="primary-btn" @click="replayOne(selected)">重放该节点</button>
    </template>
  </AppModal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RotateCw, Zap } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { syncQueues } from '../data/mock'

const queues = ref(syncQueues.map((item) => ({ ...item })))
const selected = ref(null)
const toast = reactive({ message: '', tone: 'success' })

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function replayFailed() {
  queues.value.forEach((item) => {
    item.failed = Math.max(0, Math.floor(item.failed * 0.35))
    item.pending = Math.max(0, item.pending - 120)
  })
  notify('已重放所有区域失败队列')
}

function replayOne(item) {
  item.failed = Math.max(0, Math.floor(item.failed * 0.25))
  item.pending = Math.max(0, item.pending - 180)
  notify(`${item.node} 失败队列已重新入队`)
}

function setMode(item, mode) {
  item.mode = mode
  notify(`${item.node} 已切换为${mode}`, 'info')
}

function simulateSync() {
  queues.value.forEach((item) => {
    item.pending = Math.max(0, item.pending - Math.floor(Math.random() * 260 + 60))
  })
  notify('已模拟一次区域同步批处理')
}
</script>
