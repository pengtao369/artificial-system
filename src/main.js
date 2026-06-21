import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles.css'
import { t } from './i18n'
import { isAuthenticated } from './auth'

const routes = [
  { path: '/login', component: () => import('./views/Login.vue'), meta: { title: '登录', public: true } },
  { path: '/', component: () => import('./views/Dashboard.vue'), meta: { title: '全国运营总览', requiresAuth: true } },
  { path: '/workforce', component: () => import('./views/Workforce.vue'), meta: { title: '外勤操作员管理', requiresAuth: true } },
  { path: '/devices', component: () => import('./views/Devices.vue'), meta: { title: '生物识别设备管理', requiresAuth: true } },
  { path: '/sync', component: () => import('./views/SyncMonitor.vue'), meta: { title: '离线同步监控', requiresAuth: true } },
  { path: '/enrollment', component: () => import('./views/Enrollment.vue'), meta: { title: '登记质量与异常', requiresAuth: true } },
  { path: '/tasks', component: () => import('./views/TaskMarket.vue'), meta: { title: '任务分发与抢单', requiresAuth: true } },
  { path: '/payroll', component: () => import('./views/Payroll.vue'), meta: { title: '薪酬审批工作台', requiresAuth: true } },
  { path: '/payments', component: () => import('./views/Payments.vue'), meta: { title: '支付对账中心', requiresAuth: true } },
  { path: '/privacy', component: () => import('./views/PrivacyGovernance.vue'), meta: { title: '数据治理与隐私', requiresAuth: true } },
  { path: '/ops', component: () => import('./views/OpsRelease.vue'), meta: { title: '运维发布中心', requiresAuth: true } },
  { path: '/security', component: () => import('./views/Security.vue'), meta: { title: '安全审计中心', requiresAuth: true } },
  { path: '/architecture', component: () => import('./views/Architecture.vue'), meta: { title: '系统架构视图', requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.path === '/login' && isAuthenticated.value) {
    return '/'
  }
  return true
})

const app = createApp(App)
app.config.globalProperties.$t = t
app.config.errorHandler = (error) => {
  console.error('[NEOP]', error)
}
app.use(router).mount('#app')
