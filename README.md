[![Discord](https://img.shields.io/badge/Join%20Our%20Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/8BxYbV4pkj)
[![Latest Build](https://img.shields.io/github/actions/workflow/status/TheNetsky/Microsoft-Rewards-Script/auto-release.yml?branch=v4&style=for-the-badge&label=Latest%20Build)](https://github.com/TheNetsky/Microsoft-Rewards-Script/actions/workflows/auto-release.yml)
[![Docker](https://img.shields.io/badge/Docker-GHCR-blue?style=for-the-badge&logo=docker)](https://github.com/TheNetsky/Microsoft-Rewards-Script/pkgs/container/microsoft-rewards-script)

**简体中文** | [English](README.en.md)

# Microsoft Rewards 自动化脚本 (v4)

> 基于 TypeScript 与 Patchright 构建的高效、全自动化 Microsoft Rewards 积分领取脚本，包含中国本土化优化与多种推送通知支持。

> [!TIP]
> 此版本仅支持 **微软全新的 Bing Rewards 仪表盘**。如果你的账号仍在使用旧版仪表盘，请切换至 [v3 分支](https://github.com/TheNetsky/Microsoft-Rewards-Script/tree/v3)！

---

## 目录

- [✨ 项目亮点](#-项目亮点)
- [📦 快速上手](#-快速上手)
  - [基础部署 (Node.js)](#基础部署-nodejs)
  - [账号配置 (.env)](#账号配置-env)
  - [运行脚本](#运行脚本)
- [🐳 Docker 部署](#-docker-部署)
- [🌐 中国本土化特性](#-中国本土化特性)
- [🔔 推送通知 (Bark / PushPlus / Telegram / Discord / Ntfy)](#-推送通知)
- [🎛️ 控制 API 与 Web 仪表盘](#️-控制-api-与-web-仪表盘)
- [⚙️ 配置文件说明 (config.json)](#️-配置文件说明-configjson)
- [🔧 常见问题与会话管理](#-常见问题与会话管理)
  - [手动登录 (Manual Login)](#手动登录-manual-login)
  - [Session 会话管理](#session-会话管理)
- [⚠️ 免责声明](#️-免责声明)

---

## ✨ 项目亮点

- **全自动化任务覆盖**：每日任务 (Daily Set)、桌面端/移动端 Bing 搜索、阅读赚积分 (Read to Earn)、打卡活动 (Punchcards)、签到 (Daily Check-in)、搜索加成 (Search Bonus) 等。
- **中国本土化动态适配**：自动接入国内实时热搜榜（百度、今日头条、微博、抖音、知乎）及 jsDelivr 国内 CDN 镜像加速，国内无代理环境自动匹配 `zh-CN` 语言与 `Asia/Shanghai` 时区。
- **反检测浏览器伪装**：采用 `patchright` 配合真实浏览器指纹注入（`fingerprint-injector`），降低风控风险。
- **双端并行架构**：支持移动端与桌面端并发搜索执行，大幅缩短任务运行时间。
- **丰富的通知渠道**：支持 Bark (iOS)、PushPlus (微信公众号)、Telegram、Discord、Ntfy 等多种通知推送。
- **会话持久化与离线模式**：基于 SQLite 本地数据库持久化 Cookie 与指纹，支持免登录恢复与可视化/手动登录管理。

---

## 📦 快速上手

### 基础部署 (Node.js)

1. **克隆仓库**
```bash
git clone https://github.com/TheNetsky/Microsoft-Rewards-Script.git
cd Microsoft-Rewards-Script
```

2. **安装依赖与浏览器**
```bash
npm run pre-build
```

---

### 账号配置 (.env)

复制根目录下的 `env.example` 并重命名为 `.env`，填入你的账号信息：

```env
# 账号 1
ACCOUNT_1_EMAIL=your_email@example.com
# ACCOUNT_1_PASSWORD=your_password  # 可选。若使用无密码/Authenticator 验证，可注释或留空
ACCOUNT_1_GEO_LOCALE=CN
ACCOUNT_1_LANG_CODE=zh-CN
# ACCOUNT_1_TOTP_SECRET=  # 若开启了 2FA，填入 TOTP 密钥
```

> [!NOTE]
> `ACCOUNT_N_PASSWORD` 是可选的。设置后可使用密码登录；对于无密码或仅 Authenticator 认证的账号可不设置密码。
> 多账号只需按顺序添加 `ACCOUNT_2_*`、`ACCOUNT_3_*` 即可。修改 `.env` 或 `config.json` 后无需重新编译源码，直接运行即可。

---

### 运行脚本

```bash
# 编译 TypeScript
npm run build

# 启动脚本
npm run start
```

---

## 🐳 Docker 部署

1. 准备 [`compose.yaml`](compose.yaml) 和 `env.example`（重命名为 `.env` 并填入账号）。
2. 启动容器：
```bash
docker compose up -d
```
3. 查看运行日志：
```bash
docker logs -f microsoft-rewards-script
```

---

## 🌐 中国本土化特性

针对国内网络环境，本项目内置以下优化：

1. **国内热搜词库 (China Trends)**：
   - 支持从百度热搜、今日头条、微博热搜、抖音热点、知乎热榜实时获取最新热门搜索词，搜索内容更自然。
   - 可在 `config.json` 的 `searchSettings.queryEngines` 中启用 `"china"` 引擎。
   - 可配置 `chinaApi.appkey`（来自 gmya.net，可选，留空使用免费公用接口）。

2. **内置中文本地词库**：
   - `src/functions/search-queries.json` 已预置数百条精选中文日常搜索词，在网络无法访问外部热搜接口时作为可靠兜底。

3. **CDN 镜像加速**：
   - 国内 IP 或配置 `GEO_LOCALE=CN` 时，Chrome 版本列表检测自动切换至 `jsDelivr` 镜像源，避免因直连 Google 官方源导致超时或挂起。

4. **时区与语言对齐**：
   - 中国地区直连环境下，浏览器上下文自动注入 `zh-CN` 语言与 `Asia/Shanghai` 时区，保持指纹与网络一致。

---

## 🔔 推送通知

支持在 `config.json` 的 `webhook` 中配置多种推送渠道：

### Bark (iOS 推送)
```json
"bark": {
    "enabled": true,
    "serverUrl": "https://api.day.app",
    "key": "YOUR_BARK_KEY",
    "title": "Microsoft-Rewards",
    "group": "MicrosoftRewards",
    "sound": "minuet",
    "icon": ""
}
```

### PushPlus (微信公众号推送)
```json
"pushplus": {
    "enabled": true,
    "token": "YOUR_PUSHPLUS_TOKEN",
    "title": "Microsoft Rewards 任务通知",
    "template": "txt",
    "channel": ""
}
```

### Telegram / Discord / Ntfy
```json
"telegram": {
    "enabled": true,
    "botToken": "YOUR_BOT_TOKEN",
    "chatId": "YOUR_CHAT_ID"
},
"discord": {
    "enabled": false,
    "url": "YOUR_WEBHOOK_URL"
},
"ntfy": {
    "enabled": false,
    "url": "https://ntfy.sh",
    "topic": "YOUR_TOPIC"
}
```

---

## 🎛️ 控制 API 与 Web 仪表盘

本脚本包含可选的 Control API，可以通过 HTTP 协议进行远程控制与状态监控。

- 查看 API 详细文档：[Control API 文档](scripts/api/README.md)
- 启动 API 服务：`npm run api`
- 推荐配合可视化控制面板 [Rewards Dashboard](https://github.com/mgrimace/rewards-dashboard) 使用。

---

## ⚙️ 配置文件说明 (config.json)

复制 `config.example.json` 为 `config.json` 即可自定义参数。主要配置项如下：

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `headless` | boolean | `false` | 是否使用无头（后台静默）浏览器 |
| `clusters` | number | `1` | 并发账号集群数量 |
| `contintueOnBotWarning` | boolean | `false` | 遇到微软 Bot-Score 风控警告时是否强行继续（不推荐开启） |
| `searchSettings.queryEngines` | array | `["china", "google", ...]` | 搜索关键词来源（`china` 为国内热搜源） |
| `searchSettings.chinaApi.appkey` | string | `""` | 可选，gmya.net 热搜接口 appkey（留空走免费档） |
| `searchSettings.searchDelay.min` | string | `"30sec"` | 搜索间隔最小延迟（建议适当调大防风控） |
| `searchSettings.searchDelay.max` | string | `"1min"` | 搜索间隔最大延迟 |
| `workers.doDesktopSearch` | boolean | `true` | 是否执行桌面端搜索 |
| `workers.doMobileSearch` | boolean | `true` | 是否执行移动端搜索 |
| `workers.doDailyCheckIn` | boolean | `true` | 是否执行每日签到 |
| `workers.doReadToEarn` | boolean | `true` | 是否执行阅读新闻赚积分 |
| `experimental.blockMedia` | boolean | `false` | 登录后拦截图片和媒体请求以节省流量 |

---

## 🔧 常见问题与会话管理

### 手动登录 (Manual Login)

当账号需要交互式验证、处理验证码或进行首次登录时，可使用手动登录命令。它会打开带界面的 Patchright Chromium 浏览器，无需自动化登录流程处理。在你在浏览器中完成登录并在 `rewards.bing.com` 页面停留 5 秒后，脚本将自动保存 Session 并关闭浏览器。

```bash
# 创建或刷新移动端 Session（默认）
npm run manual-login -- --email user@example.com

# 仅创建或刷新桌面端 Session
npm run manual-login -- --email user@example.com --platform desktop

# 依次创建移动端和桌面端 Session
npm run manual-login -- --email user@example.com --platform both

# 忽略现有 Cookie，执行全新登录
npm run manual-login -- --email user@example.com --fresh
```

### Session 会话管理

如果遇到登录状态过期或异常，可通过清除 `sessions/` 目录中保存的会话重新登录：

```bash
# 查看当前保存的 Session 列表
npm run clear-sessions -- list

# 清除指定账号的 Session
npm run clear-sessions -- email user@example.com

# 清除所有 Session
npm run clear-sessions -- all
```

---

## ⚠️ 免责声明

本项目仅供学习和技术交流使用。使用自动化脚本可能违反 Microsoft Rewards 服务条款，存在账号异常或封禁风险。使用者须自行承担相关风险与责任。
