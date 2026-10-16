<script setup lang="ts">
import { ref } from 'vue'
import { config } from '@/config'
import { useUserStore } from '@/stores/user'
import { isPhone, isPassword } from '@/utils/validate'
const userStore = useUserStore()
const phone = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
async function submit() {
  if (loading.value) return
  errorMessage.value = ''
  if (!isPhone(phone.value.trim())) {
    errorMessage.value = '请输入正确的手机号码'
    return
  }
  if (!isPassword(password.value)) {
    errorMessage.value = '密码长度应为 8～32 位'
    return
  }
  loading.value = true
  try {
    await userStore.login({ phone: phone.value.trim(), password: password.value })
    password.value = ''
    uni.reLaunch({ url: '/pages/index/index' })
  } catch (error) {
    // 请求层负责统一提示，页面保留错误文案便于重试。
    errorMessage.value = error instanceof Error ? error.message : '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <view class="page">
    <view class="card mt-6">
      <view class="text-blue-600 font-bold mb-4">WELCOME BACK</view>
      <view class="title">欢迎登录</view>
      <view class="subtitle mt-4">体验表单校验、Pinia 状态与会话持久化。</view>
      <view v-if="config.useMock" class="notice mt-4"
        >演示模式：输入格式正确的手机号及任意 8～32 位密码即可。请使用虚构信息。</view
      >
      <form @submit="submit">
        <input
          v-model="phone"
          class="field"
          type="number"
          maxlength="11"
          placeholder="手机号码"
          :disabled="loading"
        />
        <input
          v-model="password"
          class="field"
          password
          maxlength="32"
          placeholder="密码（8～32 位）"
          :disabled="loading"
        />
        <view v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</view>
        <button class="primary-button" form-type="submit" :loading="loading" :disabled="loading">
          {{ loading ? '登录中…' : '登录并开始体验' }}
        </button>
      </form>
      <view class="subtitle mt-4"
        >此页面展示账号密码登录示例；微信授权登录需另接入服务端 code 换取会话。</view
      >
    </view>
  </view>
</template>
<style scoped lang="scss">
.notice {
  padding: 24rpx;
  background: #eff6ff;
  border-radius: 16rpx;
  color: $color-primary;
  line-height: 1.7;
}
</style>
