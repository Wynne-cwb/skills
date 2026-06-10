# admin.automizelyapi.org_mkt-operations

## Summary
- project_id: `admin.automizelyapi.org_mkt-operations`（SonarQube projectKey / Config Center project name）；package name 是 `api.automizelyapi.org_mkt-operations`。
- repo_name: `admin.automizelyapi.org_mkt-operations`
- upstream_url: `https://github.com/AfterShip/admin.automizelyapi.org_mkt-operations`
- local_path: 双 checkout：`/Users/wb.chen/Documents/AfterShip/admin-portal/admin.automizelyapi.org_mkt-operations`（当前在 `feat/flow-v3`，偏 active-major/Notification Flow v3 研发）和 `/Users/wb.chen/Documents/AfterShip/legacy-admin-portal/admin.automizelyapi.org_mkt-operations`（当前在 `feat/data-retention`，偏 contact retention 专项/legacy admin portal）。
- repo_type: NestJS 8 + Apollo GraphQL admin BFF/API service；不是前端应用，也不是 Module Federation remote。
- confidence: high，本报告基于本地 checkout、git refs、manifest、config、NestJS module/resolver/datasource 源码、相邻前端本地引用；未做网络搜索。

## Responsibility
- Owns: Automizely / Notification admin 专属 BFF，GraphQL endpoint 为 `/mkt-operations/admin/graphql`；负责把 admin 前端请求转换为下游 REST API 调用，聚合/转换数据，并做 auth、RBAC/infra permission、错误日志与部分辅助 REST endpoint。
- Owns: Notification Flow 管理面能力（新版 `feat/flow-v3` checkout）：trigger/step/condition/context data declarations、flow templates、infra versions、business scenarios、host product configurations、message/template assets、feature control、flow debugger/trigger tooling、Flow AI Assistant。
- Owns: legacy/通用营销运营后台能力：email templates、popup templates、SMS templates/senders/phone applications、merge tags、flow settings、flow recent runs、risk control、tracking migration、notification migration/reconciliation、message log review、support tools、account/billing/business lookups。
- Does not own: 前端 UI/MF host/remote、Notification platform core services、email renderer service、SMS core、conversion tools、tracking/commerce/connectors、LLM Gateway、Dify/data AI service、实际消息投递或 runtime flow 执行。
- Common change areas: `src/modules/**` GraphQL resolver/service/DTO，`src/datasources/**` 下游 REST API adapter，`config/*.ts` API host 配置，`src/guard/**` auth/permission，`package.json` private package / NestJS build/test scripts。

## Branch Tracks
- production: `upstream/master` 存在，两个 checkout 的本地 upstream ref 都指向 `078251e8` / `Merge pull request #893 from Hydra0507/feat/TSEC-4794`（2026-04-14）。应以 `upstream/master` 作为 production base；两个 checkout 的 `origin/master` 都是 fork ref 且较旧（`fd860572`，2026-02-09）。
- legacy_v9: 未发现 `master_v9` 本地分支、`origin/master_v9` 或 `upstream/master_v9`。
- active_major: 未发现 `feat/flow-v3-polaris-v13`；发现 `upstream/feat/flow-v3` 和 `origin/feat/flow-v3`。`admin-portal` checkout 当前分支是本地 `feat/flow-v3`，本地 `59d4546` 相对 `upstream/feat/flow-v3` ahead 62 / behind 0；它的 upstream ref 更新到 2026-06-08。`legacy-admin-portal` checkout 没有本地 `feat/flow-v3`，仅有 remote refs，且 upstream ref 停在 2026-06-02，明显比 admin-portal checkout 更旧。
- repo_specific_notes: 两个 checkout remotes 都是 fork-first 形态：`origin` 指向 `git@github.com:Wynne-cwb/admin.automizelyapi.org_mkt-operations.git`，`upstream` 指向 `git@github.com:AfterShip/admin.automizelyapi.org_mkt-operations.git`。用途上，`admin-portal` checkout 更适合研究/开发 Flow v3、platform notification、AI assistant；`legacy-admin-portal` checkout 当前 `feat/data-retention` 包含 `contactRetention` 模块，但缺少新版 notification platform/AI assistant 模块。

## Module Federation
- enabled: false。该 repo 是 NestJS BFF；没有 `ModuleFederationPlugin`、`@module-federation/*`、`remoteEntry`、`exposes`、`remotes` 配置。
- exposes: none。
- remotes: none。
- shared_packages: 无 MF shared；运行/构建层面使用 NestJS、Apollo GraphQL、Axios、Puppeteer、Webpack HMR，以及 internal packages `@aftership/am-filters`、`@aftership/automizely-authz`、`@aftership/config-center-sdk`。
- branch_alignment: 前端集成不是 MF remote，而是 GraphQL BFF 集成。本地 `fe-pltf-ens-admin` 文档称它是 Notification Admin Portal host，BFF 是 `admin.automizelyapi.org_mkt-operations`；`src/config/domain.ts` 对 development/testing/staging/production/release-incy 都配置了 `/mkt-operations/admin/graphql` endpoint。

## Team Repo Dependencies
- Direct dependencies: `@aftership/am-filters`（flow settings / filters schema 相关）、`@aftership/automizely-authz`（authz guard）、`@aftership/config-center-sdk`（Config Center），证据在 `package.json` dependencies。
- Runtime calls: `config/index.ts` 和各 datasource module 显示它调用 `notification_flow_api`、`notification_infra_api`、`notification_message_api`、`notification_migration_api`、`email_render_api` / `email_render_api_v2`、`email_screenshot_api`、`as_notification_api`、`as_legacy_notification_api`、`as_renderer_api`、`data_notification_api`、`flow_core_api`、`flow_api`、`sms_core_api`、`smart_sending_api`、`conversions_api`、`conditions_api`、`templating_api`、`oc_extensions_api`、`oc_analytics_api`、`risk_api`、`risk_oc_api`、`commerce_api`、`tracking_api`、`tracking_notification_api`、`connector_api`、`businesses_api`、`billing_api`、`feature_api` / `featuremgmt_api`、`infra_permission_api`、`acrm_api` / `acrm_pltf_api`、`account_api`、`data_dms_api`、`data_recommendation_api`、`dify_api`、`llm_gateway_api`、`maps_api`。
- Build-time dependencies: Docker base image is Node 18.17.0 TS image and runs `npm run build`; GitHub workflows require private npm token for install and run PR title check, duplicate decorator guard, SonarQube scan.
- Shared packages: `@aftership/am-filters` is the clearest queue-related shared package; `@aftership/automizely-authz` and `@aftership/config-center-sdk` are internal platform packages but their source repos are not identified from this checkout alone.
- Inferred but unconfirmed: Config hostnames strongly imply ownership by Notification Platform, Messaging, Omnichannel, Marketing, Tracking, Commerce, Data, Billing, ACRM, and LLM/Data AI teams. Exact GitHub repo mapping for each service hostname is not provable from this repo alone.

## Business Flows
- flow_id: `mkt-operations-admin-graphql`
- role: Admin Portal BFF; exposes `/mkt-operations/admin/graphql` and wraps downstream services for admin UI.
- upstream/downstream repos: consumed by `fe-pltf-ens-admin` local checkout via `src/config/domain.ts`; downstream service repos inferred from `config/*.ts` and datasource modules.

- flow_id: `notification-flow-admin`
- role: Flow v3 admin metadata CRUD/versioning for trigger/step/condition/context declarations and flow templates; protected by InfraPermission guard and forwarded to `notification_flow_api` / `notification_infra_api`.
- upstream/downstream repos: upstream UI `fe-pltf-ens-admin` pages under `src/pages/Flows/**`; downstream `pltf-nf-flow` / `pltf-nf-infra` service hosts by config name, exact repo not confirmed.

- flow_id: `notification-message-template-admin`
- role: Manages platform email/SMS templates, message assets, merge tags, email sections/components, Django render preview, screenshots, and versioned message resources.
- upstream/downstream repos: upstream `fe-pltf-ens-admin` and legacy Vue admin pages; downstream `notification_message_api`, `email_render_api_v2`, `email_screenshot_api`, `as_renderer_api`, `as_notification_api`.

- flow_id: `flow-ai-assistant`
- role: GraphQL mutation `flowAiAssistant` for `/flows/*` Sidekick-style assistant; calls LLM Gateway `/messages`, then uses allowlisted adapters over Notification Flow/Infra/Message/UI asset APIs.
- upstream/downstream repos: upstream `fe-pltf-ens-admin` Sidekick components; downstream `llm_gateway_api` plus notification platform APIs.

- flow_id: `flow-trigger-debug-tools`
- role: Admin/testing helpers to create stores/orders/fulfillments, inspect tracking, update mock courier checkpoints, check connector state, and search tracking notification history.
- upstream/downstream repos: upstream `fe-pltf-ens-admin` / platform-notification CLI probes; downstream `commerce_api`, `tracking_api`, `courier_mock_api`, `connector_api`, `tracking_notification_api`.

- flow_id: `contact-retention`
- role: `legacy-admin-portal` checkout only; GraphQL mutations trigger annual scan/delete and reminder email workflow through `conversions_api`.
- upstream/downstream repos: likely consumed by legacy/admin marketing data or CRM surfaces; downstream conversion tools service. Exact UI owner should be verified before changing schema.

## Important Entrypoints
- path: `package.json`
- why it matters: Defines Nest build/start/dev/test scripts, dependencies, private AfterShip packages, Jest root, and `check:decorators` guard in the newer checkout.

- path: `src/main.ts`
- why it matters: Nest bootstrap, JSON/urlencoded 5 MB limits, Config Center init, default listen port `9003`, HMR close hook.

- path: `src/app.module.ts`
- why it matters: Registers GraphQL at `/mkt-operations/admin/graphql`, imports all business modules, configures GraphQL logging and redaction for `flowAiAssistant` in the newer checkout.

- path: `src/app.controller.ts`
- why it matters: Non-GraphQL REST endpoints: `/whoami` and `/mkt-operations/admin/image-proxy`.

- path: `config/index.ts`, `config/development.ts`, `config/testing.ts`, `config/staging.ts`, `config/production.ts`
- why it matters: Central map of downstream API host keys; active-major checkout has Notification Flow/Infra/Message/Migration, LLM Gateway, tracking/commerce, and renderer hosts.

- path: `src/datasources/base-http.datasource.module.ts`, `src/datasources/rest.datasource.ts`
- why it matters: All downstream REST adapters share `apiHost` config resolution, `AM_API_KEY`, Axios retry, logging, and error behavior.

- path: `src/modules/notificationFlow/notificationFlow.resolver.ts`, `src/datasources/notificationFlow/*.service.ts`
- why it matters: Main Flow v3 GraphQL surface and REST adapters for versioned declarations/templates and validation endpoints.

- path: `src/modules/notificationInfra/notificationInfra.resolver.ts`, `src/datasources/notificationFlow/notificationInfra.service.ts`
- why it matters: Infra versioning, business scenarios, host product configurations, import/export/release/reset operations.

- path: `src/modules/flow-ai-assistant/flow-ai-assistant.resolver.ts`, `src/modules/flow-ai-assistant/provider/assistant-provider.service.ts`, `src/datasources/llm-gateway/llm-gateway.service.ts`
- why it matters: AI assistant GraphQL contract, tool-use loop, LLM Gateway `/messages` integration, route/query/action guardrails.

- path: `src/modules/emailRender/emailRender.service.ts`
- why it matters: Bridges legacy renderer, platform email renderer v2, notification message sections, screenshot capture, and notification trigger type detection.

- path: `src/modules/flowTrigger/flowTrigger.service.ts`
- why it matters: Debug/test tools bridge commerce, tracking, courier mock, connectors, and tracking notification APIs.

- path: `legacy-admin-portal/.../src/modules/contactRetention/contactRetention.resolver.ts`
- why it matters: Legacy checkout-specific data retention workflow mutations; absent from `admin-portal` `feat/flow-v3` checkout.

- path: `Dockerfile`, `.github/workflows/*.yaml`
- why it matters: Runtime container is Node 18.17.0, exposes `9003`; workflows enforce PR title, duplicate GraphQL decorator guard, and SonarQube on `staging`/`master`.

## Evidence
- file_or_command: `sed -n '1,260p' NOTIFICATION_REPO_MAP_RESEARCH.md`
- finding: Confirmed Per-Repo Research Output Schema, branch track rules, fork-first rules, and read-only research protocol.

- file_or_command: `repo-research/INDEX.md`
- finding: Repo status was `pending`; exact report file was not listed under active subagents. Index notes duplicate local checkouts and fork-first-looking remotes.

- file_or_command: `git remote -v` in both checkouts
- finding: Both use `origin git@github.com:Wynne-cwb/admin.automizelyapi.org_mkt-operations.git` and `upstream git@github.com:AfterShip/admin.automizelyapi.org_mkt-operations.git`.

- file_or_command: branch/ref checks for `master`, `master_v9`, `feat/flow-v3-polaris-v13`, `feat/flow-v3`
- finding: `master` and `feat/flow-v3` exist in remote refs; `master_v9` and `feat/flow-v3-polaris-v13` do not exist locally or in local remote refs.

- file_or_command: `git rev-list --left-right --count feat/flow-v3...upstream/feat/flow-v3` in `admin-portal` checkout
- finding: Local `feat/flow-v3` is ahead 62 / behind 0 relative to local `upstream/feat/flow-v3`; checkout is active-major oriented but contains local-only commits.

- file_or_command: `git for-each-ref` in both checkouts
- finding: `admin-portal` current branch `feat/flow-v3` at `59d4546`（2026-06-08）；`legacy-admin-portal` current branch `feat/data-retention` at `204c6b99`（2026-06-08）。Both have stale `origin/master` vs `upstream/master`.

- file_or_command: `package.json`
- finding: NestJS service scripts (`build`, `start`, `dev`, `hot:dev`), private AfterShip deps, Apollo/GraphQL, Axios, Puppeteer, Jest; no frontend/MF dependencies.

- file_or_command: `webpack-hmr.config.js` plus repo-wide MF keyword search
- finding: Webpack is only for Nest HMR (`webpack/hot/poll`, `RunScriptWebpackPlugin`); no Module Federation config/exposes/remotes.

- file_or_command: `src/main.ts`
- finding: Service bootstraps Nest AppModule, loads Config Center, listens on `PORT` or `9003`.

- file_or_command: `src/app.module.ts`
- finding: GraphQL path is `/mkt-operations/admin/graphql`; active-major checkout imports Notification Flow/Infra/Message/Migration, FlowDebugger, FlowTrigger, EnsAiChat, FlowAiAssistant, DjangoRender modules.

- file_or_command: `comm -3` of top-level `src/modules` between checkouts
- finding: `admin-portal` unique modules include `django-render`, `ens-ai-chat`, `flow-ai-assistant`, `flowDebugger`, `flowTrigger`, `notificationDataSource`, `notificationFeatureControl`, `notificationFlow`, `notificationInfra`, `notificationMessage`, `notificationMigration`, `notificationReconciliation`; `legacy-admin-portal` unique module is `contactRetention`.

- file_or_command: `comm -3` of top-level `src/datasources` between checkouts
- finding: `admin-portal` unique datasources include `commerce`, `courierMock`, `emailRenderV2`, `llm-gateway`, `notificationFeatureControl`, `notificationFlow`, `notificationMigration`, `notificationReconciliation`, `tracking`, `trackingNotification`, `uiAssets`.

- file_or_command: `config/index.ts` and environment configs
- finding: Active-major checkout defines downstream host keys for notification platform, renderer, SMS, flow core, conversion, risk, commerce/tracking, ACRM, account/billing/business, Dify, LLM Gateway, maps, data recommendation, etc.

- file_or_command: `src/datasources/base-http.datasource.module.ts`, `src/datasources/rest.datasource.ts`
- finding: Datasources resolve base URL from config `apiHost`, inject `AM_API_KEY`, and use shared Axios wrapper with retry/logging.

- file_or_command: `src/modules/notificationFlow/notificationFlow.resolver.ts`, `src/datasources/notificationFlow/notificationFlow.service.ts`
- finding: Exposes GraphQL queries/mutations for trigger/step/condition/context declarations and flow templates; forwards to `/internal/*/versioned` notification flow endpoints.

- file_or_command: `src/modules/flow-ai-assistant/flow-ai-assistant.resolver.ts`, `src/datasources/llm-gateway/llm-gateway.service.ts`
- finding: Exposes `flowAiAssistant` mutation and calls LLM Gateway Anthropic-style `/messages` endpoint via `llm_gateway_api`.

- file_or_command: `src/modules/emailRender/emailRender.service.ts`
- finding: Bridges `email_render_api`, `email_render_api_v2`, `as_renderer_api`, `as_notification_api`, `email_screenshot_api`, and `notificationMessageAPI` for preview/render/screenshot flows.

- file_or_command: `legacy-admin-portal/.../src/modules/contactRetention/contactRetention.resolver.ts` and service
- finding: Legacy checkout exposes `triggerContactRetentionAnnualScan`, `triggerContactRetentionAnnualDelete`, `triggerContactRetentionReminderEmail`; service delegates to `ConversionAPI`.

- file_or_command: `fe-pltf-ens-admin/src/config/domain.ts`
- finding: Local admin frontend points development/testing/staging/production/release-incy to `/mkt-operations/admin/graphql` BFF endpoints.

- file_or_command: `fe-pltf-ens-admin/Claude.md`
- finding: Local frontend doc identifies `admin.automizelyapi.org_mkt-operations` as the corresponding BFF and says GraphQL codegen depends on `/mkt-operations/admin/graphql`.

- file_or_command: `Dockerfile`, `.github/workflows/pr-check.yaml`, `.github/workflows/decorator-guard.yaml`, `.github/workflows/sonarqube.yaml`
- finding: Container exposes port `9003`; CI checks PR title, duplicate GraphQL decorators, and SonarQube for `staging`/`master`.

## Open Questions
- question: Why does the frontend config/codegen use local `localhost:9005`, while BFF README/dev.env/Dockerfile default to `9003`?
- why it matters: Local development or codegen setup may require a proxy or a custom `PORT`; report evidence confirms both values but not the operational convention.

- question: Which exact GitHub repos own each internal service hostname (`pltf-nf-flow`, `pltf-nf-infra`, `pltf-nf-message`, `prod-mt-email-renderer`, `prod-mt-convtools`, etc.)?
- why it matters: The BFF clearly depends on these services at runtime, but repo-name mapping cannot be proven from this checkout alone.

- question: Should future work use the `admin-portal` `feat/flow-v3` checkout despite its 62 local-only commits, or refresh from `upstream/feat/flow-v3` first?
- why it matters: The active-major code evidence lives there, but branch state may include local research/experimental commits.

- question: Is `legacy-admin-portal` `feat/data-retention` intended as a long-lived maintenance track or a temporary feature branch?
- why it matters: It is the only checkout containing `contactRetention`; changing that schema requires knowing whether consumers should move to active-major or remain on legacy.
