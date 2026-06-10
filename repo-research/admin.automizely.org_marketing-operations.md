# admin.automizely.org_marketing-operations

## Summary
- project_id: `admin.automizely.org_marketing-operations`
- repo_name: `admin.automizely.org_marketing-operations`
- upstream_url: `https://github.com/AfterShip/admin.automizely.org_marketing-operations`
- local_path: `/Users/wb.chen/Documents/AfterShip/legacy-admin-portal/admin.automizely.org_marketing-operations`
- repo_type: legacy Automizely Marketing Operations admin frontend; Vue 3 + Vite + qiankun micro-frontend; static admin app under `/marketing-operations`.
- confidence: high. 入口、路由、BFF endpoint、部署脚本、分支和依赖都能从本地 checkout 与 git refs 直接确认。

## Responsibility
- Owns:
  - Marketing Operations 内部运营后台 UI，页面标题为 `Automizely marketing operations`，package name/homepage 为 `marketing-operations` / `/marketing-operations`。
  - qiankun 子应用入口：独立访问时用 `marketing-operations/` base，被 qiankun 挂载时用 `/app-marketing-operations`。
  - Template management：email / popup / SMS / flow templates、contact activity。
  - System approval：phone number review/release、SMS sender、beta test、render settings、email quota/preview、risk control、organization blacklist、soft bounced management。
  - Business settings：merge tag、dynamic enum、field extensions、AM dynamic form/filter schemas、action/trigger/flow templates、email template pools/categories。
  - Migration / efficiency tools：tracking migration plan/schedule、APZ strategy migration、data audit、flow recent run、email/SMS retention workflow trigger、message log email review、dead-letter record republish。
  - Version-management UI and request header propagation via `am-version-management`.
- Does not own:
  - BFF/API implementation. Runtime GraphQL calls go to `/mkt-operations/admin/graphql`, implemented by `admin.automizelyapi.org_mkt-operations`.
  - Notification/email/SMS execution engines, renderers, Conversions retention workflows, or dead-letter pub/sub processing. This repo only provides operator screens that call BFF operations.
  - SSO service implementation; it consumes `@aftership/sso-basic`.
  - AM Dynamic Form / AM Filters library implementation; it consumes `@aftership/am-dynamic-form` and `@aftership/am-filters`.
  - Webpack Module Federation host/remotes. This repo uses qiankun, not MF.
- Common change areas:
  - Add or adjust admin routes/navigation: `src/routes.ts`, `src/views/layout/components/Menu/navigation.ts`.
  - Add GraphQL operations and regenerate typed documents: `src/graphql/schemas/**`, `src/generated/graphql.ts`, `codegen.yml`.
  - Feature UI under `src/views/templateManagement/**`, `src/views/businessSettings/**`, `src/views/systemApproval/**`, `src/views/migrationTools/**`, `src/views/efficiencyTools/**`.
  - Runtime domain/env/deploy changes: `.env.*`, `vite.config.ts`, `scripts/upload-assets.js`, `Jenkinsfile`.

## Branch Tracks
- production: `master` exists on `upstream/master`; local `origin/HEAD` points to `origin/master`. Latest local upstream evidence: `upstream/master` at `f3d33ac` on 2026-04-14, PR `feat/TSEC-4802`.
- legacy_v9: not present. No local or remote `master_v9` ref found.
- active_major: not present. No `feat/flow-v3-polaris-v13` or `feat/flow-v3` ref found.
- repo_specific_notes:
  - Environment branches exist on upstream: `testing`, `staging`, `release/incy`.
  - Current local branch during research: `feat/data-retention`, tracking `origin/feat/data-retention`; upstream also has `feat/data-retention`.
  - GitHub PR check accepts `feat/*`, `hotfix/*`, `release/*`, `testing`, `staging`, and `master`; SonarQube runs on PRs to `staging` and `master`.
  - Tags show a `v2.3.x` release series, latest listed locally `v2.3.20`.

## Module Federation
- enabled: false for Webpack Module Federation. No `ModuleFederationPlugin`, `remoteEntry`, `exposes`, `remotes`, or MF config found in source/config search.
- exposes: none.
- remotes: none.
- shared_packages: no MF shared config. Runtime/shared frontend packages include Vue, Element Plus, `@aftership/am-dynamic-form`, `@aftership/am-filters`, `@aftership/sso-basic`, and `vite-plugin-qiankun`.
- branch_alignment:
  - Integration model is qiankun: `vite.config.ts` registers `qiankun(name, { useDevMode: true })`; `src/main.ts` uses `renderWithQiankun` and `qiankunWindow.__POWERED_BY_QIANKUN__`.
  - The host-side registration for this qiankun app is not in this repo; host repo/path remains unconfirmed from current evidence.

## Team Repo Dependencies
- Direct dependencies:
  - `am-dynamic-form`: package dependency `@aftership/am-dynamic-form@^1.0.6`; used in dynamic-form preview/editor and flow-template schema editor.
  - `am-filters`: package dependency `@aftership/am-filters@^2.0.17-alpha.1`; used in filter preview/schema/segment editors and tracking migration flow compare.
  - `@aftership/sso-basic`: package dependency for employee SSO token acquisition.
- Runtime calls:
  - `admin.automizelyapi.org_mkt-operations`: confirmed BFF for `VITE_API_HOST` `/mkt-operations/admin/graphql`. The sibling BFF checkout declares `GraphQL 端点: /mkt-operations/admin/graphql` and configures that path in `src/app.module.ts`.
  - Approvals API: `VITE_APPROVALS_API_HOST` points to `/approvals/v1`; risk-control approval flow reads `/approvals/{approval_id}` and posts generated-node signs. Owning repo not identified from this repo.
  - Admin portal: `VITE_ADMIN_PORTAL_URL` opens `/approvals/details?approvalId=...`; owning host/config repo not identified from this repo.
  - Marketing cloud-storage proxy: risk-control preview reads `https://api.automizely.{org|me}/marketing/v1/admin/cloud-storage-proxy/read-blob-v2.action`; owning repo not identified from this repo.
  - Asset UI: field/flow/template editors open `https://assets.automizely.org/ui/#/marketing/...`; owning repo not identified from this repo.
- Build-time dependencies:
  - GraphQL codegen reads schema from `http://localhost:9005/mkt-operations/admin/graphql`.
  - Jenkins frontend pipeline uses Node `14.18.1` and app/repo name `admin.automizely.org_marketing-operations`.
  - Static upload script maps `testing`, `release-incy`, `staging`, `production` to admin S3 buckets and deploys under package `homepage` `/marketing-operations`.
- Shared packages:
  - Team-owned or team-adjacent: `@aftership/am-dynamic-form`, `@aftership/am-filters`, `@aftership/sso-basic`.
  - General frontend/runtime: Vue 3, Element Plus, Pinia, Vue Router, Vite, qiankun plugin, Monaco, CodeMirror, Vue Flow.
- Inferred but unconfirmed:
  - `product.automizelyapi.com_conversions`: contact-retention UI labels the workflows as "for Conversions" and links to a GitHub runbook under `product.automizelyapi.com_conversions`; runtime execution still goes through BFF GraphQL mutations, so repo ownership of those workflows should be confirmed in that repo's report.
  - Notification/email-rendering services behind operations such as `emailTemplateRender`, `GetNotificationBySearch`, `messageLogList`, and `deadLetterRecords` are abstracted behind the BFF; this frontend does not directly identify their owning repos.
  - Queue repos such as `sdks.am-static.com_admin-flow`, `sdks.am-static.com_admin-email`, and `sdks.am-static.com_aio-notification` are conceptually related to flow/email/notification admin surfaces, but there is no direct package import or remote call to those repos in this checkout.

## Business Flows
- flow_id: `legacy-marketing-operations-admin`
- role: qiankun-mounted internal admin frontend for Marketing Operations. Provides navigation, SSO, version selection, and GraphQL client wrapper.
- upstream/downstream repos: downstream confirmed `admin.automizelyapi.org_mkt-operations` BFF; qiankun host repo unconfirmed.

- flow_id: `template-management`
- role: creates/updates/sorts/deletes email, SMS, popup, flow templates and contact activities through BFF GraphQL documents.
- upstream/downstream repos: downstream `admin.automizelyapi.org_mkt-operations`; notification/template storage services are behind BFF and unconfirmed here.

- flow_id: `business-settings-flow-config`
- role: manages merge tags, email template pools/categories, action templates, trigger templates, flow template configs, dynamic form schemas, AM filter schemas/segments, and versioned publish workflow.
- upstream/downstream repos: downstream `admin.automizelyapi.org_mkt-operations`; direct shared packages `am-dynamic-form` and `am-filters`.

- flow_id: `system-approval-email-sms-risk`
- role: operator review/approval UI for risk control, SMS phone applications/senders/releases, render settings, email quota, notification restriction rules, organization blacklist, and soft-bounced cleanup.
- upstream/downstream repos: downstream `admin.automizelyapi.org_mkt-operations`; runtime calls also hit Approvals API and marketing cloud-storage proxy.

- flow_id: `tracking-all-in-one-migration`
- role: operations UI to create/check/execute/rollback tracking migration plans, compare flow/email rendering, search notification data, and manage migration schedules/dry runs/batch rollback.
- upstream/downstream repos: downstream `admin.automizelyapi.org_mkt-operations`; renderer/search/migration service ownership remains hidden behind BFF from this repo.

- flow_id: `efficiency-tools-notification-ops`
- role: operations UI for flow recent run inspection, message log email review, dead-letter record list/re-publish, and email/SMS retention scan/delete/reminder workflow triggers.
- upstream/downstream repos: downstream `admin.automizelyapi.org_mkt-operations`; contact-retention flow references Conversions runbook in `product.automizelyapi.com_conversions` but does not call that repo directly from frontend.

## Important Entrypoints
- path: `package.json`
- why it matters: defines package name `marketing-operations`, homepage `/marketing-operations`, Vite/codegen/build scripts, and direct team package dependencies.

- path: `vite.config.ts`
- why it matters: sets base path from package name, local dev port `3008`, SSO silent-callback proxy, alias `@`, and qiankun plugin registration.

- path: `src/main.ts`
- why it matters: creates Vue app/router, computes qiankun vs standalone base path, registers `renderWithQiankun`, and supports standalone render when not powered by qiankun.

- path: `src/routes.ts`
- why it matters: central route map for template management, system approval, business settings, migration tools, efficiency tools, and feature management.

- path: `src/views/layout/components/Menu/navigation.ts`
- why it matters: RBAC-aware menu composition; confirms major admin sections and resources checked through BFF `CheckRbac`.

- path: `src/utils/httpRequest.ts`
- why it matters: central GraphQL client wrapper; sends SSO authorization, `am-version-management`, operation name/query, and rate-limit headers to `VITE_API_HOST`.

- path: `src/sso.ts`
- why it matters: configures employee SSO with client id `admin_marketing-operations` and silent callback URL under this app.

- path: `.env.*`
- why it matters: maps local/testing/staging/production/release-incy BFF, SSO, approvals, and admin portal domains.

- path: `codegen.yml`
- why it matters: generated GraphQL types/documents are based on local BFF schema `http://localhost:9005/mkt-operations/admin/graphql`.

- path: `src/graphql/schemas/**`
- why it matters: concise operation inventory for owned UI surfaces: templates, business settings, migration, risk control, SMS, retention, dead letter, message logs, versioning.

- path: `src/components/VersionManage/index.vue`
- why it matters: loads versions, selects published version, and drives `am-version-management` header for read/write operations.

- path: `src/views/efficiencyTools/contactRetention/index.vue`
- why it matters: high-impact Conversions ops UI; triggers annual scan/delete/reminder workflows and links to the Conversions runbook.

- path: `src/views/efficiencyTools/deadLetterRecords/**`
- why it matters: lists dead-letter records and publishes selected records back to a topic via GraphQL.

- path: `src/views/migrationTools/**`
- why it matters: owns operator screens for tracking/all-in-one migration plans, execution, rollback, schedules, and previews.

- path: `src/views/systemApproval/riskControl/index.vue`
- why it matters: risk review console, approval integration, cloud-storage proxy preview, and final/first review mutation logic.

- path: `scripts/upload-assets.js`
- why it matters: deploys `dist` to environment-specific admin buckets using package `homepage` as deploy path.

- path: `Jenkinsfile`
- why it matters: confirms frontend pipeline, deployment group `aftership`, app name, repo name, Node image/tag, staging/production availability.

## Evidence
- file_or_command: `git remote -v`
- finding: `origin` points to `git@github.com:Wynne-cwb/admin.automizely.org_marketing-operations.git`; `upstream` points to `git@github.com:AfterShip/admin.automizely.org_marketing-operations.git`.

- file_or_command: `git branch -a --list`
- finding: local/upstream refs include `master`, `testing`, `staging`, `release/incy`, and feature branches such as `feat/data-retention`; no `master_v9` or `feat/flow-v3*`.

- file_or_command: `package.json`
- finding: package `name` is `marketing-operations`, `homepage` is `/marketing-operations`, direct dependencies include `@aftership/am-dynamic-form`, `@aftership/am-filters`, `@aftership/sso-basic`, `vite-plugin-qiankun`.

- file_or_command: `vite.config.ts`
- finding: Vite base is `/${name}/`, dev server port is `3008`, and plugin list includes `qiankun(name, { useDevMode: true })`.

- file_or_command: `src/main.ts`
- finding: imports `renderWithQiankun` and `qiankunWindow`; base path switches between `/app-${name}` under qiankun and `${name}/` standalone.

- file_or_command: `rg -n "ModuleFederation|remoteEntry|exposes|remotes|qiankun" . --glob '!node_modules/**' --glob '!dist/**'`
- finding: source/config hits are qiankun-only; no Module Federation config or expose/remote definitions found.

- file_or_command: `.env.development`, `.env.testing`, `.env.staging`, `.env.production`, `.env.release-incy`
- finding: `VITE_API_HOST` consistently targets `/mkt-operations/admin/graphql`; production host is `https://bff-api.automizely.org/mkt-operations/admin/graphql`.

- file_or_command: sibling checkout `admin.automizelyapi.org_mkt-operations` (`CLAUDE.MD`, `src/app.module.ts`)
- finding: declares `GraphQL 端点: /mkt-operations/admin/graphql` and configures GraphQL path `/mkt-operations/admin/graphql`, confirming BFF ownership.

- file_or_command: `src/utils/httpRequest.ts`
- finding: `fetchOperationBffApi` POSTs GraphQL to `import.meta.env.VITE_API_HOST` with SSO authorization, version header, and operation-based rate-limit headers.

- file_or_command: `src/routes.ts`
- finding: route map includes template management, system approval, business settings, migration tools, efficiency tools, and feature management pages.

- file_or_command: `src/views/layout/components/Menu/navigation.ts`
- finding: menu is RBAC-gated through `CheckRbacDocument` for business settings, migration tools, and email template resources; labels match route responsibilities.

- file_or_command: `src/graphql/schemas/**`
- finding: GraphQL operation inventory includes template CRUD/sort, flow/action/trigger settings, SMS phone applications/senders/releases, notification restriction rules, risk control, tracking migration, contact retention, dead-letter records, message log review, and version management.

- file_or_command: `src/views/efficiencyTools/contactRetention/index.vue`
- finding: page says it triggers annual scan/delete/reminder email workflows for Conversions; invokes `TriggerContactRetentionAnnualScan/Delete/ReminderEmailDocument`; links to `product.automizelyapi.com_conversions` runbook.

- file_or_command: `src/views/efficiencyTools/deadLetterRecords/index.vue`, `components/PublishModal.vue`
- finding: lists dead-letter records and calls `PublishDeadLetterToTopicDocument` with `dead_letter_record_id`, `topic_id`, and `ignore_status`.

- file_or_command: `src/views/efficiencyTools/messageLogReviewList/index.vue`
- finding: query defaults to `message_channel: 'email'` and `host_product_code: 'aftership'`, renders email content in an iframe for review.

- file_or_command: `src/views/migrationTools/trackingMigrationList/index.vue`, `trackingMigrationInsert/index.vue`, `migrationSchedule/index.vue`
- finding: UI creates tracking migration plans, executes/rolls back plans, lists schedules, runs dry-run, batch rollback, and schedule rollback.

- file_or_command: `src/views/systemApproval/riskControl/index.vue`
- finding: risk-control UI calls BFF `GetRiskControls`, first/final review mutations, Approvals API, marketing cloud-storage proxy, and image proxy derived from `VITE_API_HOST`.

- file_or_command: `scripts/upload-assets.js`
- finding: static deploy targets admin buckets (`admin.automizely.me`, `staging-admin.automizely.org`, `admin.automizely.org`) and uses package `homepage` as S3 key prefix.

- file_or_command: `Jenkinsfile`
- finding: Jenkins app name/repo name are `admin.automizely.org_marketing-operations`, flow is `frontend`, Node image tag is `nodejs-14.18.1`, staging and production are enabled.

- file_or_command: `.github/workflows/pr-check.yaml`, `.github/workflows/sonarqube.yaml`
- finding: PR title check covers `feat/*`, `hotfix/*`, `release/*`, `testing`, `staging`, `master`; SonarQube scans PRs to `staging` and `master`.

## Open Questions
- question: Which legacy admin host repo registers the qiankun child app `marketing-operations` / `/app-marketing-operations`?
- why it matters: branch alignment and host integration changes require the host repo/config; this checkout only proves the child-app side.

- question: Which repo owns the Approvals API behind `VITE_APPROVALS_API_HOST`?
- why it matters: risk-control review behavior may require coordinated backend or workflow changes outside this frontend and BFF.

- question: Which repos own services behind BFF operations `emailTemplateRender`, `GetNotificationBySearch`, `messageLogList`, `deadLetterRecords`, and contact-retention workflow triggers?
- why it matters: this frontend calls only the BFF; downstream service ownership must be confirmed from BFF/backend reports before assigning cross-repo work.

- question: Is `product.automizelyapi.com_conversions` the canonical repo for the contact-retention workflows referenced by the runbook link, or is the current queue repo name different?
- why it matters: the UI points operators to that repo/runbook, but current runtime evidence still passes through `admin.automizelyapi.org_mkt-operations`.
