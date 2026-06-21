<template>
  <ToastMessage :message="toast.message" :tone="toast.tone" />
  <section class="panel">
    <SectionHeader eyebrow="M02 Kit Lifecycle" title="生物识别套件台账">
      <div class="toolbar">
        <select v-model="statusFilter">
          <option>全部状态</option>
          <option>可用</option>
          <option>已分配</option>
          <option>告警</option>
          <option>已丢失</option>
        </select>
        <button class="secondary-btn" @click="mapMode = !mapMode"><Map :size="16" />{{ mapMode ? '列表视图' : '地图视图' }}</button>
        <button class="primary-btn" :disabled="!selected" @click="requestLockSelected"><LockKeyhole :size="16" />远程锁定</button>
      </div>
    </SectionHeader>
    <div v-if="mapMode" class="device-map">
      <button
        v-for="device in filteredDevices"
        :key="device.id"
        :class="['device-pin', { active: selected?.id === device.id }]"
        @click="selected = device"
      >
        <strong>{{ device.id.replace('KIT-', '') }}</strong>
        <span>{{ device.region }}</span>
      </button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>设备ID</th><th>类型</th><th>型号</th><th>持有人</th><th>区域</th><th>电量</th><th>存储</th><th>最后在线</th><th>状态</th><th>证书</th></tr></thead>
        <tbody>
          <tr v-for="device in filteredDevices" :key="device.id" class="clickable-row" @click="selected = device">
            <td><strong>{{ device.id }}</strong></td>
            <td>{{ device.type }}</td>
            <td>{{ device.model }}</td>
            <td>{{ device.holder }}</td>
            <td>{{ device.region }}</td>
            <td><ProgressBar label="" :value="device.battery" :tone="device.battery > 30 ? 'good' : 'danger'" /></td>
            <td>{{ device.storage }}%</td>
            <td>{{ device.lastOnline }}</td>
            <td><StatusBadge :label="device.status" /></td>
            <td><StatusBadge :label="device.cert" /></td>
          </tr>
          <tr v-if="filteredDevices.length === 0">
            <td colspan="10" class="empty-cell">没有匹配的设备</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="Remote Commands" title="设备生命周期时间线" />
    <div class="timeline">
      <div><strong>采购入库</strong><span>序列号、证书指纹、固件版本建档</span></div>
      <div><strong>领用分配</strong><span>绑定操作员、初始 GPS、mTLS 证书启用</span></div>
      <div><strong>健康监控</strong><span>电池、存储、漂移、离线天数持续检测</span></div>
      <div><strong>维修 / 报废</strong><span>归还检测、远程擦除、审计留存</span></div>
    </div>
  </section>

  <AppModal :open="Boolean(selected)" eyebrow="Kit Detail" :title="selected?.id || ''" @close="selected = null">
    <div v-if="selected" class="detail-grid">
      <div><span>型号</span><strong>{{ selected.model }}</strong></div>
      <div><span>类型</span><strong>{{ selected.type }}</strong></div>
      <div><span>持有人</span><strong>{{ selected.holder }}</strong></div>
      <div><span>区域</span><strong>{{ selected.region }}</strong></div>
      <div><span>GPS</span><strong>{{ selected.gps }}</strong></div>
      <div><span>最后在线</span><strong>{{ selected.lastOnline }}</strong></div>
      <div><span>电量</span><strong>{{ selected.battery }}%</strong></div>
      <div><span>证书</span><strong>{{ selected.cert }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="unbindSelected">解绑</button>
      <button class="secondary-btn" @click="wipeSelected">擦除数据</button>
      <button class="primary-btn" @click="requestLockSelected">远程锁定</button>
    </template>
  </AppModal>

  <AppModal :open="Boolean(pendingLockDevice)" eyebrow="Remote Command" title="确认远程锁定与擦除" @close="pendingLockDevice = null">
    <p v-if="pendingLockDevice" class="confirm-copy">
      将向 {{ pendingLockDevice.id }} 签发远程锁定指令，吊销设备证书，并把擦除命令加入下一次联网执行队列。
    </p>
    <div v-if="pendingLockDevice" class="detail-grid">
      <div><span>设备</span><strong>{{ pendingLockDevice.id }}</strong></div>
      <div><span>持有人</span><strong>{{ pendingLockDevice.holder }}</strong></div>
      <div><span>最后在线</span><strong>{{ pendingLockDevice.lastOnline }}</strong></div>
      <div><span>证书状态</span><strong>{{ pendingLockDevice.cert }}</strong></div>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="pendingLockDevice = null">取消</button>
      <button class="primary-btn" @click="confirmLockSelected">签发指令</button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { LockKeyhole, Map } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import ProgressBar from '../components/ProgressBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastMessage from '../components/ToastMessage.vue'
import { devices as deviceSeed } from '../data/mock'

const rows = ref(deviceSeed.map((item) => ({ ...item })))
const selected = ref(null)
const pendingLockDevice = ref(null)
const statusFilter = ref('全部状态')
const mapMode = ref(false)
const toast = reactive({ message: '', tone: 'success' })

const filteredDevices = computed(() => rows.value.filter((device) => statusFilter.value === '全部状态' || device.status === statusFilter.value))

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function requestLockSelected() {
  if (!selected.value) {
    notify('请先选择一台设备', 'danger')
    return
  }
  pendingLockDevice.value = selected.value
}

function confirmLockSelected() {
  if (!pendingLockDevice.value) return
  pendingLockDevice.value.status = '已丢失'
  pendingLockDevice.value.cert = '已吊销'
  pendingLockDevice.value.storage = 0
  notify(`${pendingLockDevice.value.id} 已签发锁定、证书吊销与远程擦除指令`)
  pendingLockDevice.value = null
}

function wipeSelected() {
  if (!selected.value) {
    notify('请先选择一台设备', 'danger')
    return
  }
  selected.value.storage = 0
  notify(`${selected.value.id} 已加入远程擦除队列`, 'info')
}

function unbindSelected() {
  if (!selected.value) {
    notify('请先选择一台设备', 'danger')
    return
  }
  selected.value.holder = '仓库'
  selected.value.status = '可用'
  notify(`${selected.value.id} 已解绑并回收入库`)
}
</script>
