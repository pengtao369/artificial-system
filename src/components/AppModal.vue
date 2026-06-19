<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <section class="modal-panel">
          <header class="modal-header">
            <div>
              <p v-if="eyebrow" class="eyebrow">{{ t(eyebrow) }}</p>
              <h2>{{ t(title) }}</h2>
            </div>
            <button class="icon-btn" title="关闭" @click="$emit('close')">
              <X :size="18" />
            </button>
          </header>
          <div class="modal-body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import { t } from '../i18n'

defineProps({
  open: Boolean,
  eyebrow: String,
  title: String
})

defineEmits(['close'])
</script>
