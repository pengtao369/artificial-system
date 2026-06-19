<template>
  <div class="section-header">
    <div>
      <p v-if="eyebrow" class="eyebrow">{{ t(eyebrow) }}</p>
      <h2>{{ t(title) }}</h2>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { t } from '../i18n'

defineProps({
  eyebrow: String,
  title: String
})
</script>
