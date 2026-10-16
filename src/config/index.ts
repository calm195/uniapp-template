export const config = {
  title: import.meta.env.VITE_APP_TITLE || 'Uni Starter',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  // 默认开启本地演示，避免模板首次启动依赖外部服务。
  useMock: import.meta.env.VITE_USE_MOCK !== 'false',
}
