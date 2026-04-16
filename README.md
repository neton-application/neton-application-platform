# Neton 开发者平台

面向普通会员用户的开发者门户，提供 API 账户管理、消费记录查询、请求日志查看、钱包充值等功能。

基于 [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin) 构建。

## 功能模块

- **控制台** — 账户概览、余额、今日调用量、近期消费与日志快览
- **账户中心** — AppId / AppSecret 凭证管理、已开通接口列表、API 文档查阅
- **消费记录** — 扣费明细分页查询，支持按 API 编码过滤
- **请求日志** — 调用日志分页查询，支持按状态（成功 / 失败）和 API 过滤，可查看请求参数与响应体详情
- **钱包** — 余额查看、充值（套餐或自定义金额）、交易流水查询

## 技术栈

- Vue 3 + TypeScript
- Vite
- Ant Design Vue
- Pinia（Session Storage 持久化）
- Turbo Monorepo

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 5666）
pnpm dev
```

后端服务默认运行在 `http://127.0.0.1:8080`，前端通过 `/app-api` 代理转发请求。

## 环境配置

| 变量 | 说明 |
|------|------|
| `VITE_BASE_URL` | 后端服务地址（开发环境默认 `http://127.0.0.1:8080`） |
| `VITE_GLOB_API_URL` | API 路由前缀，固定为 `/app-api` |
| `VITE_APP_API_ENCRYPT_REQUEST_KEY` | 请求加密密钥（生产环境必须替换） |
| `VITE_APP_API_ENCRYPT_RESPONSE_KEY` | 响应加密密钥（生产环境必须替换） |

## 构建部署

```bash
# 生产构建
pnpm build

# 构建产物位于 apps/web-antd/dist/
```

Nginx 部署配置参考 `scripts/deploy/nginx.conf`。

## 路由说明

所有接口请求走 `/app-api` 路由组，由后端统一处理会员用户相关业务（`/auth/*`、`/app/member/*`、`/app/pay/*`、`/member/account/*`）。
