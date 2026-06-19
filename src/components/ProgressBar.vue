<template>
  <div class="progress-wrap">
    <div class="progress-meta">
      <span>{{ t(label) }}</span>
      <strong>{{ value }}%</strong>
    </div>
    <div class="progress-track">
      <span :class="tone" :style="{ width: `${Math.min(value, 100)}%` }"></span>
    </div>
  </div>
</template>

<script setup>
import { t } from '../i18n'

defineProps({
  label: String,
  value: Number,
  tone: {
    type: String,
    default: 'good'
  }
})
</script>
