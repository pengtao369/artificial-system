import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Workforce from './views/Workforce.vue'
import Devices from './views/Devices.vue'
import SyncMonitor from './views/SyncMonitor.vue'
import Enrollment from './views/Enrollment.vue'
import Payroll from './views/Payroll.vue'
import Payments from './views/Payments.vue'
import Security from './views/Security.vue'
import Architecture from './views/Architecture.vue'
import Login from './views/Login.vue'
import './styles.css'
import { t } from './i18n'
import { isAuthenticated } from './auth'

const routes = [
  { path: '/login', component: Login, meta: { title: '登录', public: true } },
  { path: '/', component: Dashboard, meta: { title: '全国运营总览', requiresAuth: true } },
  { path: '/workforce', component: Workforce, meta: { title: '外勤操作员管理', requiresAuth: true } },
  { path: '/devices', component: Devices, meta: { title: '生物识别设备管理', requiresAuth: true } },
  { path: '/sync', component: SyncMonitor, meta: { title: '离线同步监控', requiresAuth: true } },
  { path: '/enrollment', component: Enrollment, meta: { title: '登记质量与异常', requiresAuth: true } },
  { path: '/payroll', component: Payroll, meta: { title: '薪酬审批工作台', requiresAuth: true } },
  { path: '/payments', component: Payments, meta: { title: '支付对账中心', requiresAuth: true } },
  { path: '/security', component: Security, meta: { title: '安全审计中心', requiresAuth: true } },
  { path: '/architecture', component: Architecture, meta: { title: '系统架构视图', requiresAuth: true } }
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
app.use(router).mount('#app')
