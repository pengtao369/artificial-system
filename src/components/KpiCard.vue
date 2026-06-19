<template>
  <article class="kpi-card">
    <div class="kpi-top">
      <span>{{ t(label) }}</span>
      <span :class="['delta', tone]">{{ delta }}</span>
    </div>
    <strong>{{ value }}</strong>
  </article>
</template>

<script setup>
import { t } from '../i18n'

defineProps({
  label: String,
  value: String,
  delta: String,
  tone: String
})
</script>
