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
      <span>auth-service</span><span>operator-service</span><span>kit-service</span><span>enrollment-service</span><span>sync-service</span><span>incentive-service</span><span>workflow-service</span><span>payment-service</span><span>fraud-service</span><span>audit-service</span><span>geospatial-service</span><span>notification-service</span>
    </div>
  </section>
</template>

<script setup>
import { CloudCog, Server, Smartphone } from 'lucide-vue-next'
import SectionHeader from '../components/SectionHeader.vue'
</script>
