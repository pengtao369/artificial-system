<template>
  <span :class="['status-badge', toneClass]">{{ t(label) }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { t } from '../i18n'

const props = defineProps({
  label: String
})

const toneClass = computed(() => {
  const value = props.label || ''
  if (['有效', '在岗', '已分配', '在线', '已入主库', 'CLEAR', 'PAID', '匹配', '正常', '可用', '已完成', '已启用', 'UP'].some((word) => value.includes(word))) return 'success'
  if (['即将到期', '弱网', '可接受', 'PAYING', 'T+1', '大额', '待', '进行中', '观察', 'DEGRADED', '中'].some((word) => value.includes(word))) return 'warning'
  if (['已过期', '停用', '离线', '告警', '需', 'FAILED', '差异', '高', '冻结', '严重', '限制', '降级'].some((word) => value.includes(word))) return 'danger'
  return 'neutral'
})
</script>
