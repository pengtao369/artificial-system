import { computed, reactive } from 'vue'

const STORAGE_KEY = 'neop-auth-user'

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

export const authState = reactive({
  user: loadUser()
})

export const isAuthenticated = computed(() => Boolean(authState.user))

export function login({ username, role, remember }) {
  const user = {
    name: username || 'regional.manager',
    displayName: username === 'admin' ? 'System Admin' : 'Regional Manager',
    role: role || 'Regional Manager',
    loginAt: new Date().toLocaleString()
  }
  authState.user = user
  if (remember) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }
  return user
}

export function logout() {
  authState.user = null
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}
