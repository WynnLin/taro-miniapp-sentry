# Taro 微信小程序 + Sentry

这个项目已经接入了 `sentry-miniapp`，支持微信小程序端异常上报，以及通过 `sentry-cli` 手动上传 sourcemap。

## 1. 启动

安装依赖：

```bash
yarn
```

启动微信小程序开发构建：

```bash
yarn dev:weapp
```

构建产物会输出到 `dist/`，然后使用微信开发者工具打开项目根目录即可。

## 2. 打包

生产构建：

```bash
yarn build:weapp:prod
```

这个命令会生成微信小程序生产包，并产出用于 Sentry 上传的 sourcemap。

如果要上传 sourcemap，构建完成后继续执行：

```bash
yarn sentry:upload-sourcemaps
```

上传成功后，脚本会自动删除 `dist/` 目录下的 `.map` 文件。

如果需要自定义 release，可以在构建和上传时显式指定：

```bash
SENTRY_RELEASE=project@1.0.1 yarn build:weapp:prod
SENTRY_RELEASE=project@1.0.1 yarn sentry:upload-sourcemaps
```

默认 release 规则为：

```text
${package.json.name}@${package.json.version}
```

## 3. 配置 `.sentryclirc`

在项目根目录创建 `.sentryclirc`：

```ini
[auth]
token=你的_sentry_token

[defaults]
org=你的_org_slug
project=你的_project_slug
url=https://sentry.mibaodata.com/
```

示例：

```ini
[auth]
token=sntrys_xxxxx

[defaults]
org=sentry
project=taro-test
url=https://sentry.mibaodata.com/
```

说明：

- `token` 需要有 release 和 artifact bundle 上传权限
- `org` 和 `project` 需要和你的 Sentry 项目一致
- `.sentryclirc` 已经加入 `.gitignore`，不会提交到仓库

## 4. 配置 `SENTRY_DNS`

当前项目在 [src/app.ts](/Users/linweili/Code/github/project/src/app.ts:6) 中通过 `process.env.SENTRY_DNS` 初始化 Sentry：

```ts
Sentry.init({
  dsn: process.env.SENTRY_DNS,
  release: SENTRY_RELEASE,
  environment: process.env.NODE_ENV ?? 'development',
  platform: 'wechat',
})
```

你可以把 `SENTRY_DNS` 配到环境文件中，比如 `.env.production`：

```bash
SENTRY_DNS="https://your-key@sentry.mibaodata.com/3"
```

如果开发环境也要上报，可以同时配置 `.env.development`：

```bash
SENTRY_DNS="https://your-key@sentry.mibaodata.com/3"
```

## 推荐发布流程

```bash
yarn build:weapp:prod
yarn sentry:upload-sourcemaps
```

如果你使用自定义 release：

```bash
SENTRY_RELEASE=project@1.0.1 yarn build:weapp:prod
SENTRY_RELEASE=project@1.0.1 yarn sentry:upload-sourcemaps
```
