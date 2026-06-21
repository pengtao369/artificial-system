<template>
  <div class="page-grid">
    <section class="kpi-grid">
      <KpiCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
    </section>

    <section class="panel wide">
      <SectionHeader eyebrow="National Core" title="全国登记与同步态势">
        <button class="primary-btn" @click="router.push('/tasks')"><MapPinned :size="16" />区域调度</button>
      </SectionHeader>
      <div class="dashboard-map">
        <div v-for="region in regions" :key="region.code" :class="['region-pin', region.risk]">
          <strong>{{ region.code }}</strong>
          <span>{{ region.synced }}%</span>
        </div>
        <div class="map-legend">
          <span><i class="legend-dot low"></i>稳定</span>
          <span><i class="legend-dot medium"></i>弱网</span>
          <span><i class="legend-dot high"></i>高风险</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <SectionHeader eyebrow="Edge Layer" title="区域同步完成率" />
      <div class="stack-list">
        <ProgressBar
          v-for="region in regions"
          :key="region.code"
          :label="region.name"
          :value="region.synced"
          :tone="region.synced > 93 ? 'good' : region.synced > 80 ? 'warn' : 'danger'"
        />
      </div>
    </section>

    <section class="panel">
      <SectionHeader eyebrow="Fraud Engine" title="实时异常告警" />
      <div class="event-list">
        <article v-for="event in fraudEvents" :key="event.title" class="event-row">
          <StatusBadge :label="event.level" />
          <div>
            <strong>{{ event.title }}</strong>
            <span>{{ event.owner }} · {{ event.region }} · {{ event.time }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { MapPinned } from 'lucide-vue-next'
import KpiCard from '../components/KpiCard.vue'
import ProgressBar from '../components/ProgressBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { fraudEvents, kpis, regions } from '../data/mock'

const router = useRouter()
</script>
