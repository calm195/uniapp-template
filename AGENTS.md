# Codex 项目协作约定

本项目是 uni-app Vue3 TypeScript 微信小程序模板。请使用中文交流，关键逻辑写中文注释。

## 每次修改后的必做检查

- 每一轮文件修改完成后必须运行 `npm run check`，包含 ESLint、Prettier、TypeScript 与单元测试。
- 如果格式检查失败，运行 `npm run format`，修复后重新运行完整 `npm run check`。
- 修改页面、样式、依赖或构建配置后，还必须运行 `npm run build:mp-weixin`。
- 检查失败必须修复；环境受限无法运行时，明确报告执行命令、失败原因，不能声称通过。
- 不得关闭规则、忽略源码或删除测试来绕过检查。

## 开发约定

- 页面放在 `src/pages`，复用组件放在 `src/components`；新页面必须注册到 `src/pages.json`。
- API 放在 `src/api` 并使用 `src/utils/request.ts`；业务成功码为 0。
- Pinia 管理共享状态，不直接在页面重复实现令牌持久化。
- 使用 uni-app 组件与生命周期，避免浏览器专用 DOM API。
- SCSS 全局变量在 `src/uni.scss`；Tailwind 入口保持纯 CSS。
- 不写入密钥、真实密码或真实用户数据；新增环境变量同步 `.env.example` 和 README。
- `@dcloudio/*` 编译相关包必须保持同一版本，不单独升级 Vite/Vue 破坏官方依赖组合。
- 不自动 push、发布或创建远程仓库，除非用户明确要求。
