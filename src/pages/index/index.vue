<script setup lang="ts">
import FeatureCard from '@/components/FeatureCard.vue'
import { config } from '@/config'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const features = [
  { title: '现代开发基础', description: 'Vue 3 组合式 API、TypeScript 与 Vite，让开发更清晰。' },
  {
    title: '业务能力就绪',
    description: 'Pinia 会话管理、请求拦截与错误处理、带过期时间的本地缓存。',
  },
  {
    title: '统一设计与规范',
    description: 'SCSS 主题变量、Tailwind CSS、ESLint 与 Prettier，开箱即用。',
  },
  { title: '与 Codex 协作', description: '项目规则要求每次修改后执行规范检查、类型检查和测试。' },
]
function openLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}
</script>
<template>
  <view class="page">
    <view class="card hero">
      <view class="text-blue-600 font-bold mb-4">UNI-APP / WEIXIN</view>
      <view class="title">{{ config.title }}</view>
      <view class="subtitle mt-4">从一个好用的起点，开始你的小程序。</view>
      <view class="flex flex-wrap gap-2 mt-4">
        <text v-for="tag in ['Vue 3', 'TypeScript', 'Pinia', 'Tailwind']" :key="tag" class="tag">{{
          tag
        }}</text>
      </view>
    </view>
    <view class="card">
      <view class="font-bold mb-2">{{
        userStore.isLoggedIn ? `你好，${userStore.user?.nickname}` : '欢迎体验模板'
      }}</view>
      <view class="subtitle mb-4">{{
        config.useMock ? '当前为本地演示模式，无需连接后端。' : '当前已启用真实接口模式。'
      }}</view>
      <button v-if="!userStore.isLoggedIn" class="primary-button" @click="openLogin">
        体验登录流程
      </button>
      <button v-else @click="userStore.logout">退出登录</button>
    </view>
    <view class="font-bold mb-4">为下一次开发做好准备</view>
    <FeatureCard
      v-for="(feature, index) in features"
      :key="feature.title"
      :number="`0${index + 1}`"
      :title="feature.title"
      :description="feature.description"
    />
    <view class="subtitle text-center pb-6">修改 src/pages，开始构建你的想法。</view>
  </view>
</template>
<style scoped lang="scss">
.hero {
  border-top: 8rpx solid $color-primary;
}
.tag {
  padding: 8rpx 18rpx;
  background: #eff6ff;
  color: $color-primary;
  border-radius: 12rpx;
  font-size: 24rpx;
}
</style>
