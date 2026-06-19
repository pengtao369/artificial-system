<template>
  <main class="login-page">
    <section class="login-hero">
      <div class="login-brand">
        <span class="brand-mark">N</span>
        <div>
          <strong>NEOP</strong>
          <span>National Enrollment Operations Platform</span>
        </div>
      </div>
      <select class="language-select login-language" v-model="selectedLocale" @change="changeLanguage">
        <option v-for="item in languageOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
      <h1>{{ t('国家级登记运营与劳动力财务编排平台') }}</h1>
      <p>{{ t('安全登录后进入全国运营、离线同步、薪酬审批、支付对账与审计工作台。') }}</p>
      <div class="login-highlights">
        <span>RBAC</span>
        <span>MFA Ready</span>
        <span>Audit Trail</span>
      </div>
    </section>

    <section class="login-card">
      <p class="eyebrow">Secure Access</p>
      <h2>{{ t('登录控制台') }}</h2>
      <form @submit.prevent="submit">
        <label>
          <span>{{ t('账号') }}</span>
          <input v-model.trim="form.username" autocomplete="username" placeholder="admin / regional.manager" />
        </label>
        <label>
          <span>{{ t('密码') }}</span>
          <input v-model="form.password" autocomplete="current-password" type="password" :placeholder="t('任意密码可登录演示')" />
        </label>
        <label>
          <span>{{ t('角色') }}</span>
          <select v-model="form.role">
            <option>Regional Manager</option>
            <option>System Admin</option>
            <option>Finance Approver</option>
            <option>Auditor</option>
          </select>
        </label>
        <label class="check-row">
          <input v-model="form.remember" type="checkbox" />
          <span>{{ t('记住登录状态') }}</span>
        </label>
        <p v-if="error" class="login-error">{{ error }}</p>
        <button class="primary-btn login-submit" type="submit">{{ t('登录') }}</button>
      </form>
      <p class="login-tip">{{ t('演示账号：admin / 任意密码') }}</p>
    </section>
  </main>
</template>

<script setup>
import { nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../auth'
import { applyRuntimeTranslations, languageOptions, locale, setLocale, t } from '../i18n'

const router = useRouter()
const route = useRoute()
const error = ref('')
const selectedLocale = ref(locale.value)
const form = reactive({
  username: 'admin',
  password: 'admin123',
  role: 'Regional Manager',
  remember: true
})

function submit() {
  if (!form.username || !form.password) {
    error.value = t('请输入账号和密码')
    return
  }
  login(form)
  router.replace(route.query.redirect || '/')
}

function changeLanguage() {
  setLocale(selectedLocale.value)
  nextTick(() => applyRuntimeTranslations(document.body))
}
</script>
