<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  // 启动时恢复会话；后续由服务端校验令牌是否仍然有效。
  useUserStore().restore()
})
</script>

<style>
@import './styles/tailwind.css';
</style>
<style lang="scss">
@use './styles/index.scss';
</style>
