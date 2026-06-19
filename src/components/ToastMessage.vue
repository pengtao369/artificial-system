<template>
  <Transition name="toast">
    <div v-if="message" :class="['toast-message', tone]">
      <component :is="icon" :size="18" />
      <span>{{ t(message) }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-vue-next'
import { t } from '../i18n'

const props = defineProps({
  message: String,
  tone: {
    type: String,
    default: 'success'
  }
})

const icon = computed(() => {
  if (props.tone === 'danger') return AlertTriangle
  if (props.tone === 'info') return Info
  return CheckCircle2
})
</script>
