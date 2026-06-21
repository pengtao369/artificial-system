<template>
  <section class="panel">
    <SectionHeader eyebrow="Deployment Architecture" title="Field → Edge → Core 三层架构" />
    <div class="architecture">
      <div class="arch-layer">
        <Smartphone :size="28" />
        <strong>Field Layer</strong>
        <span>1000+ Operator Android App</span>
        <small>Encrypted SQLite · BLE/USB Kit · Offline Auth</small>
      </div>
      <div class="arch-connector">4G / WiFi / Intermittent</div>
      <div class="arch-layer">
        <Server :size="28" />
        <strong>Regional Edge Layer</strong>
        <span>8-15 K3s Regional Sites</span>
        <small>Sync Gateway · Local Dashboard · Buffer Cache</small>
      </div>
      <div class="arch-connector">VPN / MPLS / Dedicated Line</div>
      <div class="arch-layer core">
        <CloudCog :size="28" />
        <strong>National Core Layer</strong>
        <span>Kubernetes Production Cluster</span>
        <small>APISIX · PostgreSQL · Kafka · Redis · MinIO · Vault</small>
      </div>
    </div>
  </section>

  <section class="panel">
    <SectionHeader eyebrow="Microservices" title="核心服务分组" />
    <div class="service-grid">
      <button v-for="service in serviceCatalog" :key="service.name" type="button" @click="selectedService = service">
        {{ service.name }}
      </button>
    </div>
  </section>

  <AppModal :open="Boolean(selectedService)" eyebrow="Service Detail" :title="selectedService?.name || ''" @close="selectedService = null">
    <div v-if="selectedService" class="detail-grid">
      <div><span>Owner</span><strong>{{ selectedService.owner }}</strong></div>
      <div><span>SLA</span><strong>{{ selectedService.sla }}</strong></div>
      <div><span>API</span><strong>{{ selectedService.api }}</strong></div>
      <div><span>职责</span><strong>{{ selectedService.note }}</strong></div>
    </div>
  </AppModal>
</template>

<script setup>
import { ref } from 'vue'
import { CloudCog, Server, Smartphone } from 'lucide-vue-next'
import AppModal from '../components/AppModal.vue'
import SectionHeader from '../components/SectionHeader.vue'
import { serviceCatalog } from '../data/mock'

const selectedService = ref(null)
</script>
