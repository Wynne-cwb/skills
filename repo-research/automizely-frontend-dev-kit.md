# automizely-frontend-dev-kit

## Summary
- project_id: `@aftership/automizely-frontend-dev-kit`
- repo_name: `automizely-frontend-dev-kit`
- upstream_url: `https://github.com/AfterShip/automizely-frontend-dev-kit`
- local_path: `/Users/wb.chen/Documents/AfterShip/automizely-frontend-dev-kit`
- repo_type: AfterShip/Automizely 前端内部 npm dev kit 与 CLI 包；提供 GraphQL fetch runtime、生成 hooks 的 React runtime、GraphQL hooks codegen、MF 类型声明下载器，以及内部 npm 发布辅助命令。
- confidence: 对包身份、runtime/codegen 职责、branch/remotes、直接下游依赖证据为 High；对下游 repo ownership 映射为 Medium，因为本 repo 只提供通用工具，BFF/MF/auth 的实际集成都在消费方 repo。

## Responsibility
- Owns:
  - Runtime GraphQL helper：`GraphqlFetch`、`graphqlFetchInstance`、`graphqlFetch`、`useQuery`、`useLazyRequest` 和请求/结果类型。
  - `GraphqlFetch` 内部的轻量请求去重队列：同一个 delay window 内相同 host/query/variables/headers 的请求共用一次 POST，并把结果广播给多个 callback。
  - 通用 GraphQL POST 执行：支持 string 或 `TypedDocumentNode`，使用 `graphql/language/printer` 转 query string，并通过 `onError` 规范化 GraphQL/network error。
  - `am-kit-hooks-codegen`：读取消费方 repo 的 `devkit.config.js`，检查 GraphQL Codegen 产出的 typed document exports，并把 `useXQuery`、`useXLazyQuery`、`useXMutation` 追加进生成的 GraphQL 文件。
  - `am-kit-types-codegen`：读取消费方 repo 的 `typesGenerator` 配置，从 URL 下载 `.d.ts` 内容，并包成 `declare module '<moduleName>'`。
  - `am-publish`：内部交互式 npm 发布 wrapper，负责 npm/AWS/git 检查、alpha 版本 bump、调用 `aftership-publish`、再回滚临时版本提交。
- Does not own:
  - 认证、授权、organization/connection 获取或 token refresh。下游 repo 从 `@aftership/automizely-product-auth` 或本地 helper 拿上下文，再把 headers 传给本包。
  - Marketing admin BFF GraphQL schema、resolver、endpoint routing 或业务 operation。本 repo 只向配置进来的 `host` 发送通用 POST。
  - Module Federation remote、exposes、remoteEntry URL 或 host shell 组合。本 repo 没有 MF config；下游 MF repo 会把它作为 shared/external dependency。
  - Notification/email/SMS/flow 业务 UI 或 GraphQL documents。generator 消费调用方生成文件，但 documents 和生成产物归调用方 repo 所有。
  - fork-first remote 修复；本报告只记录 remote 异常，不修复。
- Common change areas:
  - Runtime client 行为和类型：`src/hooks-generator/http/graphqlFetch.ts`、`src/hooks-generator/http/graphqlFetchMap.ts`、`src/hooks-generator/http/useRequest.ts`、`src/hooks-generator/typing.ts`、`src/index.ts`。
  - Hook generation 行为和模板：`src/hooks-generator/generator/index.ts`、`src/hooks-generator/templates/*.ejs`。
  - MF 类型声明生成：`src/types-generator/**`。
  - 发布工具：`src/am-publish/index.ts`、`scripts/version/index.js`、`Jenkinsfile`、`package.json`。

## Branch Tracks
- production: `origin/master` 存在，指向 AfterShip upstream 的 `7e8c6df`（`2025-08-13`，"Merge pull request #94 from Ben-yby/master"）。本地当前 `master` 在 `a72a819`（`2025-08-20`，"remove tsconfig in files"），比 `origin/master` ahead 7 commits。
- legacy_v9: 协议候选 `master_v9` 在本地/已跟踪 remote refs 中不存在。
- active_major: 协议候选 `feat/flow-v3-polaris-v13` 和 `feat/flow-v3` 在本地/已跟踪 remote refs 中不存在。本 repo 更像简单 npm package 分支模型，而不是 notification active-major 分支模型。
- repo_specific_notes:
  - 当前 checkout：`master...local/master [ahead 10]`。
  - 写报告前 working tree 已经 dirty：`src/hooks-generator/http/graphqlFetch.ts` 有一个本地修改，把 network error meta message 从空字符串改成 `err.toString()`。
  - 本地 tags 到 `1.5.8` 为止；多个下游本地 repo 引用 `1.6.0` 或 `1.6.0-alpha.*`，说明本地 refs 可能不是最新，或下游引用了本地 tag 未覆盖的 npm 版本。
  - Remote 异常：`origin` 指向 `git@github.com:AfterShip/automizely-frontend-dev-kit.git`；`local` 指向 `git@github.com:Wynne-cwb/automizely-frontend-dev-kit.git`；没有 `upstream` remote。这不符合研究协议的 fork-first 命名，但 `am-publish` 自身又期望 AfterShip remote 名为 `origin`、非 AfterShip remote 名为 `local`。

## Module Federation
- enabled: No。本 repo 内未发现 `ModuleFederationPlugin`、MF config、`remoteEntry`、`exposes` 或 `remotes` 定义。
- exposes: None.
- remotes: None.
- shared_packages:
  - 本 repo 自身不声明 MF shared packages。
  - 下游 MF repo 会把 `@aftership/automizely-frontend-dev-kit` 作为 shared singleton 或 Vite external，例如 `sdks.am-static.com_admin-marketing-basic`、`aftership-os-notification`、`sdks.am-static.com_admin-email`、`sdks.am-static.com_admin-flow`。
- branch_alignment:
  - 本 repo 没有 repo-local MF branch alignment。做 notification/MF 下游任务时，应先按消费方 repo 的 branch track 对齐；本包本地 refs 不包含 `master_v9` 或 `feat/flow-v3*`。

## Team Repo Dependencies
- Direct dependencies:
  - 本包没有直接依赖 notification/marketing team repo 的 runtime package。`package.json` 依赖主要是通用 tooling/runtime：React、GraphQL、`@graphql-typed-document-node/core`、`axios`、`ejs`、`download`、`koa`、`listr2`、`simple-git`、`semver`、AWS/npm 工具等。
  - AfterShip tooling 证据包括 devDependency `eslint-config-aftership`、`Jenkinsfile` 的 `jenkins-pipeline-library@automation`，以及 `am-publish` 调用的全局发布工具 `@aftership/aftership-publish`。
- Runtime calls:
  - `GraphqlFetch` 调用浏览器/全局 `fetch(this.host, {method: 'POST', headers, body})`；host、静态 headers、单次请求 headers、error handler 都由消费方应用传入。
  - 下游 notification/marketing SDK 注册 `/marketing/admin/graphql` 和 `/marketing/admin/v2/graphql` 等 BFF host，但本 repo 不 hardcode 这些 endpoint。
  - 下游 auth flow：例如 `sdks.am-static.com_admin-marketing-basic` 从 `@aftership/automizely-product-auth` 获取 organization/connection/user/token，再把 headers 注册到 `graphqlFetchInstance.register`。
- Build-time dependencies:
  - 消费方 repo 运行 `graphql-codegen --config codegen.yml && am-kit-hooks-codegen`：先由 GraphQL Codegen 生成 typed documents，再由本包追加 React hooks。
  - 消费方 repo 运行 `am-kit-types-codegen`：把 remote MF declarations 下载进本地 typing 目录。
  - `am-publish` 在发布本包时会执行 git、npm token、`.npmrc`、AWS profile、版本 bump、`aftership-publish`、版本回滚等步骤。
- Shared packages:
  - 本地 checkout 中找到的直接下游 package 证据包括：`aftership-os-notification`、`admin-portal/fe-pltf-ens-admin`、`sdks.am-static.com_admin-email`、`sdks.am-static.com_admin-flow`、`sdks.am-static.com_admin-marketing-basic`、`sdks.am-static.com_admin-marketing-billing`、`sdks.am-static.com_admin-marketing-coupon`、`sdks.am-static.com_admin-marketing-data`、`sdks.am-static.com_admin-crm`、`sdks.am-static.com_admin-sms`、`marketing.automizely.com`、`recommendation-admin-ts`、`subscription.as-list.com`、`fe-prod-aop-admin`、`fe-empl-ens-support-tools`、`sdks.am-static.com_affiliates-admin`、`boilerplate-marketing-module-federation`。
  - Notification admin SDK 的 peerDependencies 常见要求是 `@aftership/automizely-frontend-dev-kit >=1.3.10`；direct dependency 版本从 `1.5.0` 到 `1.6.0`/alpha track 不等。
- Inferred but unconfirmed:
  - 下游 generated hooks 使用的 BFF URL 很可能对应 `bff-api.automizely.com_marketing_admin` 和 `bff-api.automizely.com_marketing_admin_v2`，但本包只看到传入的 `host`；精确 BFF repo ownership 需要从 BFF repo 报告确认。
  - `sdks.am-static.com_admin-email` 通过 `am-kit-types-codegen` 下载的 MF type modules（`adminMarketingBasic/*`、`adminMarketingBilling/billingV2`、`adminMarketingCoupon/*`、`adminCrm/*`）很可能映射到对应 notification/admin SDK repo；本报告只确认 dev kit 机制，不确认这些 remote 的最终 ownership。

## Business Flows
- flow_id: `frontend_graphql_hook_runtime`
  - role: 为 notification 与 marketing admin SDK 生成的 React hooks 提供通用 fetch/runtime 层。
  - upstream/downstream repos: 下游 SDK 配置 BFF host 与 auth headers；上游 BFF repo 拥有 GraphQL schema/resolvers。
- flow_id: `frontend_graphql_hook_codegen`
  - role: 根据调用方 `devkit.config.js`，把 GraphQL Codegen typed document 输出转成 `useQuery`/`useLazyRequest` wrappers。
  - upstream/downstream repos: 被 admin-basic/admin-email/admin-flow/admin-sms/admin-crm/admin-marketing-data/admin-marketing-billing 等 notification/marketing SDK 和 marketing admin 应用使用。
- flow_id: `mf_remote_type_codegen`
  - role: 从 remote SDK/CDN URL 下载 `.d.ts` 文件，并包装成 MF import 可用的 module declarations。
  - upstream/downstream repos: `sdks.am-static.com_admin-email` 用它为 admin-marketing-basic、admin-marketing-billing、admin-marketing-coupon、admin-crm remote imports 生成类型。
- flow_id: `internal_npm_publish`
  - role: 提供 `am-publish`，用于本包发布前检查和 alpha publish flow。
  - upstream/downstream repos: 面向本 dev kit 的 npm package 发布；发布流程内含 AfterShip git remote 命名约定。

## Important Entrypoints
- path: `package.json`
  - why it matters: 定义 npm package `@aftership/automizely-frontend-dev-kit`、版本 `1.5.8`、入口 `lib/index.js`、CLI bins `am-publish`/`am-kit-hooks-codegen`/`am-kit-types-codegen`、build/publish scripts、依赖面。
- path: `src/index.ts`
  - why it matters: runtime package 主出口；只 re-export GraphQL fetch runtime、fetch map singleton、React request hooks 和 typings。
- path: `src/hooks-generator/http/graphqlFetch.ts`
  - why it matters: 核心通用 GraphQL POST client；包含 request de-dup queue、`TypedDocumentNode` print、headers merge、debug logging、GraphQL/network error handling。
- path: `src/hooks-generator/http/graphqlFetchMap.ts`
  - why it matters: 提供 `graphqlFetchInstance` registry，包含 default instance 和 `init/register/get`，下游用它注册 `default`、`v1`、`v2` 等 BFF client。
- path: `src/hooks-generator/http/useRequest.ts`
  - why it matters: 定义 `useQuery`、`useLazyRequest`、`graphqlFetch(key)`；生成的 GraphQL hooks 和直接 utility 调用都会依赖它。
- path: `src/hooks-generator/typing.ts`
  - why it matters: runtime public types，包括 init options、request options、errors、query/lazy results、可接受 GraphQL document 形式。
- path: `src/hooks-generator/generator/index.ts`
  - why it matters: 读取调用方 `devkit.config.js`，加载 typed document exports，识别 `query`/`mutation`，render EJS templates，并写回配置的 generated GraphQL 文件。
- path: `src/hooks-generator/templates/*.ejs`
  - why it matters: 定义生成 hook 的 API 形状：`useXQuery`、`useXLazyQuery`、`useXMutation`，以及配置的 fetcher key。
- path: `src/types-generator/generator/generator.ts`
  - why it matters: 下载 remote declaration 内容，并写成本地 `declare module` 文件，支撑 MF imports 的 TypeScript 类型。
- path: `src/types-generator/utils/config.ts`
  - why it matters: 定义 `typesGenerator` 的 `devkit.config.js` contract，并校验重复 output path。
- path: `src/am-publish/index.ts`
  - why it matters: 内部发布命令；执行 npm/AWS/git/remote/version/publish/revert workflow，并编码了本 repo 特有的 `origin`/`local` remote 命名预期。
- path: `Jenkinsfile`
  - why it matters: CI 标识 app `automizely-frontend-dev-kit`、frontend flow、Node 16.13.0 essential image、`npmPackageOnly = true`、`prePublishScript = "yarn prepublishOnly"`。

## Evidence
- file_or_command: `sed -n '1,260p' /Users/wb.chen/Documents/Project/skills/NOTIFICATION_REPO_MAP_RESEARCH.md`
  - finding: 确认 Per-Repo Research Output Schema、branch track candidates、fork-first convention、evidence rules 和只读调研约束。
- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/automizely-frontend-dev-kit remote -v`
  - finding: `origin` 是 AfterShip upstream，`local` 是用户 fork，没有 `upstream` remote。
- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/automizely-frontend-dev-kit branch -a --list`
  - finding: 观察到 `master`、`local/master`、`origin/master`、dependabot branches、`feat/am-publish`、`publish` 等 refs；未观察到 `master_v9` 或 `feat/flow-v3*`。
- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/automizely-frontend-dev-kit status --short --branch`
  - finding: 当前分支是 `master...local/master [ahead 10]`；working tree 有修改的 `src/hooks-generator/http/graphqlFetch.ts`。
- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/automizely-frontend-dev-kit diff -- src/hooks-generator/http/graphqlFetch.ts`
  - finding: 一个本地未提交修改把 network error meta message 从空字符串改为 `err.toString()`。
- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/automizely-frontend-dev-kit show -s --format=... HEAD origin/master local/master`
  - finding: 本地 `master` 是 `a72a819`（`2025-08-20`）；`origin/master` 是 `7e8c6df`（`2025-08-13`）；`local/master` 是 `840d892`（`2025-08-13`）。
- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/automizely-frontend-dev-kit tag --list`
  - finding: 本地 tags 从 `1.0.0` 到 `1.5.8`；没有本地 `1.6.0` tag。
- file_or_command: `package.json`
  - finding: package name、CLI bins、build/publish scripts、dependencies、repository URL、npm package-only Jenkins 配置共同表明这是 tooling/runtime npm package。
- file_or_command: `README.md`
  - finding: README 只有 repo 名称，因此职责证据主要来自 source 和 manifests。
- file_or_command: `src/index.ts`
  - finding: root export surface 仅包含 GraphQL fetch runtime、fetch map、React request hooks 和 typings。
- file_or_command: `src/hooks-generator/http/graphqlFetch.ts`
  - finding: 实现通用 GraphQL POST client，包含静态/单次 header merge、queue-based request de-dup、debug logs、GraphQL error forwarding 和 network error normalization。
- file_or_command: `src/hooks-generator/http/graphqlFetchMap.ts`
  - finding: 暴露 named `GraphqlFetch` registry，含 default instance 和 `init/register/get`。
- file_or_command: `src/hooks-generator/http/useRequest.ts`
  - finding: 暴露 React hooks 和直接 `graphqlFetch(key)` helper；hooks 从 `graphqlFetchInstance` 读取 fetcher，并有 cancellation guard。
- file_or_command: `src/hooks-generator/generator/index.ts`
  - finding: `am-kit-hooks-codegen` 读取 `devkit.config.js`、发现 `*Document` exports、按 GraphQL `query`/`mutation` 分类、render EJS templates，并写入配置的 generated GraphQL 文件。
- file_or_command: `src/types-generator/generator/generator.ts`
  - finding: `am-kit-types-codegen` 从配置 URL 下载 remote declaration content，并包成 `declare module '<moduleName>'`。
- file_or_command: `src/am-publish/index.ts`
  - finding: publish CLI 检查 `NPM_TOKEN`、`.npmrc`、AWS profile、`prepublishOnly`、git remotes/status，升级 `@aftership/aftership-publish`，bump alpha version，publish，并回滚版本提交。
- file_or_command: `rg -n '"@aftership/automizely-frontend-dev-kit"\\s*:' /Users/wb.chen/Documents/AfterShip --glob 'package.json'`
  - finding: 本地下游 package 依赖包括 admin-basic、admin-email、admin-flow、admin-sms、admin-crm、admin-marketing-data、admin-marketing-billing、aftership-os-notification、fe-pltf-ens-admin、marketing.automizely.com、recommendation-admin-ts 等 notification/admin/marketing repo。
- file_or_command: `rg -n 'am-kit-hooks-codegen|am-kit-types-codegen' /Users/wb.chen/Documents/AfterShip --glob 'package.json'`
  - finding: 多个下游 repo 运行 `graphql-codegen --config codegen.yml && am-kit-hooks-codegen`；MF SDK repo 还暴露 `mf-types-codegen`。
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-basic/devkit.config.js`
  - finding: 为 `src/generated/graphql.ts` 配置 key `default`，为 `src/generated/graphqlV2.ts` 配置 key `v2`，用于 hook generation。
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/devkit.config.js`
  - finding: 配置 `v1`/`v2` hook generation；`typesGenerator` 下载 adminMarketingBilling、adminMarketingBasic、adminMarketingCoupon、adminCrm 模块声明。
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-basic/src/features/BasicDepProvider/effects/useAuthEffect.ts`
  - finding: 下游代码获取 organization/connection/user/token，构建 BFF headers，并注册 `/marketing/admin/graphql` 和 `/marketing/admin/v2/graphql` clients。
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-basic/mf.config.js`
  - finding: 下游 MF config 在 host 和 remote config 中把 `@aftership/automizely-frontend-dev-kit` 作为 singleton shared package。
- file_or_command: `/Users/wb.chen/Documents/AfterShip/aftership-os-notification/mf.config.js`
  - finding: 下游 OS notification remote 把本包作为 remote-owned singleton-compatible shared dependency。
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/vite.config.ts`, `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/vite.config.ts`, `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-basic/vite.config.ts`
  - finding: SDK library build 把 `@aftership/automizely-frontend-dev-kit` 与 React/product-auth/MF peer packages 一起 externalize。
- file_or_command: `rg -n 'getHeaders|GraphqlFetchInitOptions' /Users/wb.chen/Documents/AfterShip/automizely-frontend-dev-kit/src`
  - finding: 本地 source typings 只有 `host`、`debug`、`headers`、`onError`；没有 `getHeaders` 字段，但至少一个下游 repo 传入了 `getHeaders`。

## Open Questions
- question: 下游引用的 `1.6.0` 和 `1.6.0-alpha.*` 的 canonical source/tag 在哪里？
  - why it matters: 本地 checkout/tag list 到 `1.5.8` 为止，但 notification/admin consumers 引用了更新版本；后续修复应先确认正确的已发布 source branch/tag。
- question: `GraphqlFetchInitOptions` 是否应该支持动态 `getHeaders`？
  - why it matters: `sdks.am-static.com_admin-marketing-basic` 会传 `getHeaders`，但本地 repo runtime/types 没有该 option；这可能是版本漂移、本地 checkout 过旧，或缺失实现。
- question: 后续代码修改应采用研究协议的 fork-first remote 命名，还是本包 `am-publish` 期望的 AfterShip remote = `origin`？
  - why it matters: 本只读报告只记录命名冲突；编辑/发布 workflow 如果不先确认约定，可能会互相冲突。
- question: `am-kit-hooks-codegen` 生成/追加的文件是否在每个 consumer repo 中都应该提交？
  - why it matters: generator 会直接写入 `src/generated/graphql*.ts`；repo map 和后续 agent 需要知道这些 hook diff 是正常 source change 还是 build artifact。
- question: 每个下游配置的 GraphQL host（`/marketing/admin/graphql` 与 `/marketing/admin/v2/graphql`）分别由哪个 BFF repo authoritative 拥有？
  - why it matters: 本 dev kit 只是 transport/runtime；schema/client 修改前必须从 BFF repo 报告确认 backend ownership。
