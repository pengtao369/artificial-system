<template>
  <RouterView v-if="route.meta.public" />
  <div v-else class="app-shell">
    <aside class="sidebar">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">N</span>
        <span>
          <strong>NEOP</strong>
          <small>National Enrollment Ops</small>
        </span>
      </RouterLink>

      <nav class="nav">
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path">
          <component :is="item.icon" :size="18" />
          <span>{{ t(item.label) }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-status">
        <p>{{ t('系统模式') }}</p>
        <strong>{{ t('国家核心层在线') }}</strong>
        <span>{{ t('Edge 自治降级已启用 2 个区域') }}</span>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div>
          <p class="eyebrow">{{ t('国家级登记运营与劳动力财务编排平台') }}</p>
          <h1>{{ t(route.meta.title) }}</h1>
        </div>
        <div class="topbar-actions">
          <select class="language-select" v-model="selectedLocale" @change="switchLanguage">
            <option v-for="item in languageOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
          <button class="icon-btn" :title="t('告警中心')" @click="showAlerts = !showAlerts">
            <Bell :size="18" />
            <span class="dot"></span>
          </button>
          <button class="icon-btn" :title="t('刷新')" @click="refreshPage">
            <RefreshCcw :size="18" :class="{ spinning: refreshing }" />
          </button>
          <button class="user-chip user-menu-trigger" @click="showUserMenu = !showUserMenu">
            <ShieldCheck :size="16" />
            <span>{{ authState.user?.displayName || 'Regional Manager' }}</span>
          </button>
          <div v-if="showUserMenu" class="user-popover">
            <strong>{{ authState.user?.displayName }}</strong>
            <span>{{ authState.user?.role }}</span>
            <small>Login: {{ authState.user?.loginAt }}</small>
            <button @click="handleLogout">退出登录</button>
          </div>
          <div v-if="showAlerts" class="alert-popover">
            <strong>{{ t('实时告警') }}</strong>
            <button @click="go('/sync')">{{ t('Somali 区域 2,240 条待同步') }}</button>
            <button @click="go('/devices')">{{ t('KIT-FP-0904 电量低且证书待轮换') }}</button>
            <button @click="go('/payroll')">{{ t('BAT-20260601-000126 反欺诈评分偏低') }}</button>
          </div>
        </div>
      </header>
      <RouterView />
      <ToastMessage :message="toast.message" :tone="toast.tone" />
    </main>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  Bell,
  ClipboardCheck,
  CreditCard,
  DatabaseZap,
  Fingerprint,
  LayoutDashboard,
  Network,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Users
} from 'lucide-vue-next'
import ToastMessage from './components/ToastMessage.vue'
import { applyRuntimeTranslations, languageOptions, locale, observeRuntimeTranslations, setLocale, t } from './i18n'
import { authState, logout } from './auth'

const route = useRoute()
const router = useRouter()
const showAlerts = ref(false)
const showUserMenu = ref(false)
const refreshing = ref(false)
const selectedLocale = ref(locale.value)
const toast = reactive({ message: '', tone: 'success' })
let translationObserver

const navItems = [
  { path: '/', label: '全国总览', icon: LayoutDashboard },
  { path: '/workforce', label: '操作员管理', icon: Users },
  { path: '/devices', label: '设备管理', icon: Smartphone },
  { path: '/sync', label: '离线同步', icon: DatabaseZap },
  { path: '/enrollment', label: '登记质量', icon: Fingerprint },
  { path: '/payroll', label: '薪酬审批', icon: ClipboardCheck },
  { path: '/payments', label: '支付对账', icon: CreditCard },
  { path: '/security', label: '安全审计', icon: ShieldCheck },
  { path: '/architecture', label: '系统架构', icon: Network }
]

function notify(message, tone = 'success') {
  toast.message = message
  toast.tone = tone
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => {
    toast.message = ''
  }, 2200)
}

function refreshPage() {
  refreshing.value = true
  notify(t('页面数据已刷新'))
  window.setTimeout(() => {
    refreshing.value = false
  }, 650)
}

function go(path) {
  showAlerts.value = false
  router.push(path)
}

function handleLogout() {
  showUserMenu.value = false
  logout()
  notify('已退出登录', 'info')
  router.replace('/login')
}

function switchLanguage() {
  setLocale(selectedLocale.value)
  const messageMap = {
    zh: '已切换为中文',
    en: 'Language switched to English',
    am: 'ቋንቋ ወደ አማርኛ ተቀይሯል'
  }
  notify(messageMap[locale.value] || 'Language updated')
  nextTick(() => applyRuntimeTranslations(document.body))
}

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    applyRuntimeTranslations(document.body)
  }
)

watch(locale, async () => {
  selectedLocale.value = locale.value
  await nextTick()
  applyRuntimeTranslations(document.body)
})

onMounted(() => {
  applyRuntimeTranslations(document.body)
  translationObserver = observeRuntimeTranslations(document.body)
})

onUnmounted(() => {
  translationObserver?.disconnect()
})
</script>
