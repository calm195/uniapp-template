# Uni Starter

uni-app + Vue 3 + TypeScript 微信小程序模板，包含 Vite、Pinia、请求拦截器、缓存工具、SCSS 与 Tailwind CSS 4、ESLint、Prettier 和 Codex 协作约定。

## 快速开始

需要 Node.js 22.13+、npm 与微信开发者工具。

```sh
npm install
cp .env.example .env.local
npm run dev:mp-weixin
```

在微信开发者工具中导入 `dist/dev/mp-weixin`。请先在 `src/manifest.json` 的 `mp-weixin.appid` 填入自己的微信小程序 AppID；DCloud AppID 是另一个字段，按需在 `appid` 中填写。游客体验能否使用取决于开发者工具支持情况。

```sh
npm run dev:h5             # 浏览器预览
npm run check              # 规范、格式、类型、测试
npm run format             # 自动格式化
npm run lint:fix            # 自动修复可修复的规则
npm run build              # 检查并构建微信小程序
npm run build:mp-weixin     # 单独构建，输出 dist/build/mp-weixin
npm run build:h5            # H5 生产构建
```

首次安装成功后应提交生成的 `package-lock.json`，后续和 CI 使用 `npm ci` 固定依赖。请同步升级同版本 `@dcloudio/*` 编译包，Vite/Vue 的升级遵循官方兼容组合。

## 目录

```text
src/
  api/                 # 业务接口和本地登录演示
  components/          # 复用组件
  config/              # 环境配置
  pages/index/         # 模板介绍、登录状态
  pages/login/         # 登录表单、校验与错误反馈
  static/              # 本地静态资源
  stores/              # Pinia 会话状态
  styles/              # 全局 SCSS 与 Tailwind 入口
  types/               # 环境与 API 类型
  utils/               # 请求、缓存和格式校验
  App.vue              # 应用生命周期与全局样式
  main.ts              # 应用入口和 Pinia 注册
  manifest.json        # 应用与微信配置
  pages.json           # 页面路由
  uni.scss             # 自动注入的 SCSS 变量
tests/                # 工具函数单元测试
AGENTS.md              # Codex 项目规则
.github/workflows/     # 持续集成检查与构建
```

## 登录与请求

默认 `VITE_USE_MOCK=true`，无需后端即可体验登录。输入格式正确的虚构手机号和任意 8～32 位密码。演示令牌没有真实鉴权能力；密码不会存储。刷新后从本地缓存恢复用户状态，退出登录清除会话。

接入后端时，将 `.env.local` 中 `VITE_USE_MOCK=false` 并设置 `VITE_API_BASE_URL`。接口为 `POST /auth/login`，请求体 `{ phone, password }`。约定返回：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "server-issued-token",
    "user": { "id": "1", "nickname": "用户", "phone": "13800138000" }
  }
}
```

`request<T>` 统一添加基础地址、15 秒超时、Bearer 令牌；支持请求/响应拦截器注册。`code=0` 为成功，其他业务码、HTTP 错误、网络错误统一抛出 `RequestError`；默认弹出提示，`silent: true` 可关闭提示。401 会清除缓存并通知 Pinia 退出登录，页面可根据登录状态展示重新登录入口。相对接口路径避免把令牌发送给其他域名。根据实际服务端契约调整业务码和登录 API。

真实请求需在微信公众平台配置 HTTPS request 合法域名。环境变量会编译到客户端，不要放密钥。本示例是账号密码登录；微信登录需要 `uni.login` 取得 code，再由服务端向微信换取会话，不能在客户端保存 AppSecret。

`storage.set(key, value, ttl?)` 的有效期单位为毫秒；`storage.get<T>` 在缺失、损坏、过期时返回 `null`。所有键使用模板命名空间。`validate` 提供手机、邮箱和密码长度校验。

## 样式

`src/uni.scss` 管理主题变量，仅输出变量；`src/styles/index.scss` 定义全局样式。Tailwind 4 的纯 CSS 入口由 `weapp-tailwindcss` 转换为小程序支持的样式，Vite 中配置 `rem2rpx`。使用完整静态类名，避免 `text-${color}-600` 这类运行时拼接导致扫描遗漏。页面布局已使用 Tailwind 工具类与 SCSS。

## Codex 与质量规则

在 Codex CLI 或 IDE 扩展中打开本仓库即可读取根目录 `AGENTS.md`。每轮修改后必须运行 `npm run check`；页面、样式、依赖和构建修改还要求运行微信构建。CI 对 push 和 pull request 执行同样检查。`AGENTS.md` 是协作指令，CI 提供提交后的实际执行保障；保存时格式化由 `.vscode/settings.json` 配置。

项目约定参考 [OpenAI 官方 AGENTS.md 文档](https://developers.openai.com/codex/guides/agents-md)。构建参考 [DCloud CLI 文档](https://uniapp.dcloud.net.cn/quickstart-cli.html) 与 [weapp-tailwindcss 配置](https://tw.weapp.dev/docs/quick-start/frameworks/uni-app-vite)。

## Git

```sh
git remote -v
# origin: git@github.com:calm195/uniapp-template.git
```

仓库使用 main 分支，origin 已指向上述地址。提交和推送：

```sh
git add .
git commit -m "feat: 初始化 uni-app Vue3 TypeScript 模板"
git push -u origin main
```

推送需要本机 SSH 公钥已添加到 GitHub，远程仓库已创建。
