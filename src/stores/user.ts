import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/auth'
import type { LoginInput, UserInfo } from '@/types/api'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const user = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => Boolean(token.value))
  function logout() {
    token.value = ''
    user.value = null
    storage.remove('token')
    storage.remove('user')
  }
  function restore() {
    token.value = storage.get<string>('token') || ''
    user.value = storage.get<UserInfo>('user')
    if (!token.value || !user.value) logout()
  }
  async function login(input: LoginInput) {
    const session = await loginApi(input)
    storage.set('token', session.token)
    storage.set('user', session.user)
    token.value = session.token
    user.value = session.user
  }
  // 统一处理服务端 401，同步内存状态与本地会话。
  uni.$on('auth:expired', logout)
  return { token, user, isLoggedIn, restore, login, logout }
})
