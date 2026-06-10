# fe-pltf-ens-admin

## Summary
- project_id: `fe-pltf-ens-admin`
- repo_name: `fe-pltf-ens-admin`
- upstream_url: `https://github.com/AfterShip/fe-pltf-ens-admin`
- local_path: `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin`
- repo_type: React 18 + TypeScript + Vite Notification Admin Portal / Automizely-side SPA; can run standalone under `/aio-notifications/` and exposes qiankun/single-spa-style lifecycle through `window["aio-notifications"]`. It is not a Module Federation remote.
- confidence: high for local source, routes, BFF integration, branch refs, package dependencies, and host/micro-app evidence. Medium for exact source-repo mapping of some npm packages because this checkout proves package consumption, while several package owner reports are still running or inferred.

## Responsibility
- Owns:
  - Notification Admin Portal UI for internal operators: route tree, ProLayout navigation, auth wrapper, product/host-product selection, environment switch, page-level state, and `host_product_code` scoped CRUD.
  - Flow v3 admin surfaces under `/flows/*`: business scenarios, trigger declarations, condition declarations, context data declarations, data source UI assets, step declarations, SMS components, flow templates, flow graph/template editor, global settings, feature rules, and release/versioning.
  - Message/template/content admin surfaces: legacy `/content/*` resources, system email templates, versioned platform email templates, versioned SMS templates, email sections, merge tags, template functions, and email/SMS related migration/debug tools.
  - Editor orchestration UI: opens MailCraft/MailGenie/SnapForm/flow-template editors, moves draft editor state through sessionStorage/localStorage/window messages, and persists final values through GraphQL mutations.
  - Admin tooling: Flow Debugger, Flow Trigger test tooling, migration comparison/task pages, advanced email migration, email section inspector, reconciliation views, and Sidekick/AI assistant UI.
- Does not own:
  - `admin.automizelyapi.org_mkt-operations` BFF implementation, GraphQL schema, downstream service adapters, authz guard logic, notification runtime execution, scheduler, or actual email/SMS delivery.
  - Source ownership of `@aftership/admin-email`, `@aftership/mailcraft`, `@aftership/mailgenie`, `@aftership/mosaic-flow`, `@aftership/snap-form`, `@aftership/upload-center`, or `@aftership/automizely-product-auth`; this repo consumes those packages.
  - The admin.aftership.com / `aio_notification` Module Federation network. This repo documents that network but its own source has no MF config/exposes/remotes.
  - The separate email editor deployed under `/aio-notification-doc/`; this repo opens it and exchanges `postMessage` payloads.
- Common change areas:
  - Host shell and routes: `src/index.tsx`, `src/App.tsx`, `src/Routes.tsx`, `src/config/navigation.tsx`, `src/components/Layout/**`, `src/appStore/**`.
  - BFF/API contracts: `src/config/domain.ts`, `src/appStore/index.tsx`, `codegen.yml`, `src/graphql/**/*.graphql`, `src/generated/graphql.ts`.
  - Flow resource pages: `src/pages/Flows/**`, `src/pages/NotificationFeatureControl/**`, `src/pages/NotificationFlowVersioning/**`.
  - Editor integrations: `src/pages/Content/MailCraft/**`, `src/pages/Content/MailGenie/**`, `src/pages/Flows/SnapForm/**`, `src/pages/Flows/TemplateEditor/**`, `src/config/emailEditor.ts`.
  - AI/assistant integration: `src/components/Sidekick/**`, `src/pages/Flows/SetupGuide/**`, `src/graphql/mutations/flowAiAssistant.graphql`, `src/graphql/mutations/ensAiChat.graphql`.

## Branch Tracks
- production: `upstream/master` exists and should be the stable production base. Local `master` and `origin/master` exist at `ff19ee7` from 2026-02-04, while `upstream/master` is `5d7aa68` from 2026-04-14; `git rev-list --left-right --count upstream/master...master` returned `11 0`, so the local/fork master is behind upstream by 11 commits.
- legacy_v9: no `master_v9` found locally or in local remote refs. Explicit branch checks found only `master` and `feat/flow-v3` among protocol candidates.
- active_major: `upstream/feat/flow-v3` exists; `feat/flow-v3-polaris-v13` was not found. Current checkout is local `feat/flow-v3` at `4fb5d4f`, tracking fork `origin/feat/flow-v3`; `upstream/feat/flow-v3` is `0b656a0`. `git rev-list --left-right --count upstream/feat/flow-v3...feat/flow-v3` returned `4 1`, so local active branch is diverged: upstream has 4 unique commits and local/fork has 1 unique commit.
- repo_specific_notes:
  - Remotes are fork-first shaped: `origin` is `git@github.com:Wynne-cwb/fe-pltf-ens-admin.git`; `upstream` is `git@github.com:AfterShip/fe-pltf-ens-admin.git`.
  - Additional upstream environment/release refs exist: `upstream/testing`, `upstream/staging`, and `upstream/release/incy`.
  - Current working tree was clean during research (`git status --porcelain=v1` returned no output).

## Module Federation
- enabled: false for Module Federation. No `mf.config.*`, no `ModuleFederationPlugin`, no `@module-federation/*`, no `remoteEntry`, no MF `exposes`, and no MF `remotes` were found in tracked source/config.
- exposes: none as Module Federation.
- remotes: none as Module Federation.
- shared_packages:
  - NPM/runtime package integrations include `@aftership/admin-email`, `@aftership/mailcraft`, `@aftership/mailgenie`, `@aftership/mosaic-flow`, `@aftership/snap-form`, `@aftership/upload-center`, `@aftership/automizely-product-auth`, `@aftership/automizely-frontend-dev-kit`, `@aftership/aha`, `@aftership/aha-icons`, and `@aftership/aha-locale`.
  - Transitive/shared type usage includes `@aftership/advance-filters` via `@aftership/snap-form`; the repo imports an advance-filters type in declaration preview, but `package.json` does not list it as a direct dependency.
- branch_alignment:
  - This repo aligns with branch-track rules by source branch, not by MF remote naming. For Notification Flow v3 work, use `upstream/feat/flow-v3` as the active-major source unless the local diverged fork commit is intentionally required.
  - Host/micro-app integration is qiankun-style: `src/index.tsx` mounts standalone when `window.__POWERED_BY_QIANKUN__` is absent, and attaches `bootstrap/mount/unmount` to `window[homepage]`; `src/App.tsx` switches basename to `/app-aio-notifications/` when qiankun-powered, otherwise `aio-notifications/`.

## Team Repo Dependencies
- Direct dependencies:
  - `@aftership/admin-email@^1.12.0`: used for advanced/easy email preview and migration helpers. Existing repo report confirms source repo `sdks.am-static.com_admin-email` owns npm package `@aftership/admin-email`.
  - `@aftership/mailcraft@^1.0.21-alpha.18`: used by MailCraft editor, MailCraft Sidekick observer/executor, and advanced migration prebuilt types. The repo queue maps related source checkout to `sdk-ts-mailcraft-editor` / local `Notification/mailcraft`, but that report was still running during this read.
  - `@aftership/mailgenie@^0.0.4-alpha.139`: used by `/detail/mailgenie` for DND email section editing and preview. Exact GitHub repo owner was not confirmed from this checkout.
  - `@aftership/mosaic-flow@^0.0.3-alpha.235`: used by `/detail/template-editor` FlowEditor for graph canvas, node declarations, drawers, edges, and template graph conversion. Existing AIO report references this as `@aftership/mosaic-flow`; exact source repo mapping should be verified before package changes.
  - `@aftership/snap-form@^1.0.9-alpha.220`: used by SnapForm editor, declaration edit drawers, form schema preview renderers, and flow description utilities. Repo index maps related source checkout to `sdk-nodejs-snap-form` at `/Users/wb.chen/Documents/AfterShip/snap-form`, but that report was still running.
  - `@aftership/automizely-product-auth@1.23.5`: wraps app auth via `AuthProviderEmployee` and provides `getAuthorization`.
  - `@aftership/automizely-frontend-dev-kit@^1.5.8-alpha.10`: provides `graphqlFetchInstance` used to register and fetch the default BFF GraphQL client.
  - `@aftership/upload-center@^2.0.6`: used for asset uploads from MailCraft/MailGenie and Flow Trigger template sync.
- Runtime calls:
  - Main runtime API is `admin.automizelyapi.org_mkt-operations` GraphQL: `src/config/domain.ts` maps development/testing/staging/production/release-incy to `/mkt-operations/admin/graphql`; `src/appStore/index.tsx` registers `graphqlFetchInstance` with Authorization and `host-product-code`.
  - Codegen schema source is local BFF `http://localhost:9005/mkt-operations/admin/graphql` in `codegen.yml`.
  - Email editor runtime opens `/aio-notification-doc/email-template-editor` and `/aio-notification-doc/platform-email-template-editor`, then exchanges `email-template-editor-ready`, `email-template-editor-data-push`, and `email-template-editor-save` messages; comments identify the editor as `aftership-os-notification`.
  - SnapForm editor runtime opens `/aio-notifications/detail/snapFormEditor?...` and returns `snap-form-editor-save` / `snap-form-editor-cancel` to `window.opener`.
  - Flow AI Assistant runtime calls `flowAiAssistant` GraphQL mutation; Setup Guide AI calls `ensAiChat`.
- Build-time dependencies:
  - Vite 5 build under base `/${homepage}/`, with `homepage` set to `aio-notifications`.
  - `yarn dev` runs `yarn codegen && APP_ENV=development vite`; `yarn build` runs `vite build --mode $APP_ENV`.
  - `vite.config.ts` copies `@aftership/automizely-product-auth` silent callback HTML and Monaco worker bundles into `dist`.
  - `devkit.config.js` points am-kit hooks generation to `src/generated/graphql.ts`.
- Shared packages:
  - UI/runtime: React 18, React Router 6, Ant Design 5, ProComponents, AHA, i18next, Monaco.
  - Notification authoring/rendering packages: admin-email, mailcraft, mailgenie, mosaic-flow, snap-form, upload-center.
  - BFF client/auth: automizely-frontend-dev-kit and automizely-product-auth.
- Inferred but unconfirmed:
  - `@aftership/mailgenie` source repo, `@aftership/mosaic-flow` source repo, and the exact current package owner for `@aftership/snap-form` need cross-report confirmation before editing their source.
  - `@aftership/advance-filters` is pulled transitively in `yarn.lock` and referenced by a type import; whether it should be a direct dependency is not answered by this research.
  - Parent qiankun shell ownership is not identified from this checkout alone.

## Business Flows
- flow_id: `notification-admin-portal-host`
  - role: Automizely-side Notification Admin Portal SPA and qiankun-compatible micro-app. Owns route shell, product scope, auth wrapper, navigation, environment switch, and all admin pages under `/aio-notifications/`.
  - upstream/downstream repos: upstream parent shell not confirmed; downstream BFF is `admin.automizelyapi.org_mkt-operations`; editor/package dependencies include aftership-os-notification, admin-email, mailcraft, mailgenie, mosaic-flow, and snap-form.

- flow_id: `mkt-operations-admin-graphql-client`
  - role: Registers one default GraphQL client against `/mkt-operations/admin/graphql`; all generated hooks and manual fetches use this BFF with Authorization and `host-product-code` scope.
  - upstream/downstream repos: downstream `admin.automizelyapi.org_mkt-operations`; BFF report confirms it owns `/mkt-operations/admin/graphql` and Flow/Message/AI/Debugger resolver surfaces consumed here.

- flow_id: `notification-flow-v3-resource-management`
  - role: CRUD/config UI for business scenarios, trigger declarations, condition declarations, context data, data source UI assets, step declarations, SMS components, template functions, merge tags, flow templates, feature rules, global settings, and releases.
  - upstream/downstream repos: downstream mkt-operations BFF and its notification flow/infra/message service adapters; local UI entrypoints are `src/pages/Flows/**`, `src/pages/NotificationFeatureControl/**`, and `src/pages/NotificationFlowVersioning/**`.

- flow_id: `flow-template-graph-editor`
  - role: Uses `@aftership/mosaic-flow` to edit flow template graphs. It fetches declarations by trigger event type, converts BFF flow entities to node graphs, and saves graph/trigger/exit condition back through `createFlowTemplate` / `updateFlowTemplate`.
  - upstream/downstream repos: package dependency `@aftership/mosaic-flow`; BFF flow template GraphQL mutations; page entry `/detail/template-editor`.

- flow_id: `snap-form-authoring`
  - role: Opens a dedicated SnapForm editor for advanced filter and dynamic-form schema authoring. Parent pages pass schema through URL/localStorage and receive exported data through `postMessage`.
  - upstream/downstream repos: package dependency `@aftership/snap-form`; related source checkout likely `sdk-nodejs-snap-form`; downstream persistence through mkt-operations BFF declaration mutations.

- flow_id: `message-template-assets`
  - role: Manages platform email/SMS templates, email sections, merge tags, SMS components, and template functions. Uses MailCraft/MailGenie/admin-email/aftership-os-notification editor paths for email content and GraphQL operations for persistence/preview/screenshot.
  - upstream/downstream repos: downstream mkt-operations BFF notification message/email render APIs; package/editor dependencies `@aftership/admin-email`, `@aftership/mailcraft`, `@aftership/mailgenie`, and aftership-os-notification `/aio-notification-doc`.

- flow_id: `flow-debugger-and-trigger-tools`
  - role: Internal tools to search polling executions, trigger requests, flow executions, step/sub-step executions, email/SMS debug requests, rerun flow executions, and create/update mock commerce/tracking events for testing.
  - upstream/downstream repos: downstream mkt-operations BFF `flowDebugger` and `flowTrigger` GraphQL operations; BFF report maps those to commerce/tracking/connector/courier mock and notification runtime services.

- flow_id: `flow-sidekick-ai-assistant`
  - role: AI assistant UI over `/flows/*` and MailCraft. Sends current route, host product, page context, optional attachments, message history, and MailCraft snapshots to `flowAiAssistant`; Setup Guide has a separate `ensAiChat` flow for proposing bound resource operations.
  - upstream/downstream repos: downstream mkt-operations BFF `flowAiAssistant` / `ensAiChat`; MailCraft snapshot type comments point to BFF contract files under `admin.automizelyapi.org_mkt-operations/src/modules/flow-ai-assistant/contracts`.

## Important Entrypoints
- path: `package.json`
  - why it matters: Package identity, deployed `homepage` (`aio-notifications`), scripts, direct AfterShip package dependencies, Vite/codegen/test commands, and React/AntD stack.
- path: `vite.config.ts`
  - why it matters: Vite base path, `process.env.APP_ENV` define, local dev port `8080`, auth callback copy, and Monaco worker copy behavior.
- path: `src/index.tsx`
  - why it matters: Auth provider, standalone render path, qiankun detection, and lifecycle export on `window[homepage]`.
- path: `src/App.tsx`
  - why it matters: Router basename logic for standalone vs qiankun, global app store, AntD theme, locale provider, and ProTable provider.
- path: `src/Routes.tsx`
  - why it matters: Canonical route map for `/content/*`, `/flows/*`, `/tools/*`, and `/detail/*` editor pages.
- path: `src/config/navigation.tsx`
  - why it matters: Sidebar IA that groups Content, Flows, Assets, Templates, Feature Rules, Releases, and Tools.
- path: `src/components/Layout/index.tsx`
  - why it matters: ProLayout host shell, environment switch, ProductSelect, VersioningBadge, HeaderActions, PageContextProvider, and Sidekick panel injection for `/flows`.
- path: `src/appStore/index.tsx`, `src/appStore/appStoreState.ts`
  - why it matters: Registers default GraphQL client, injects auth and `host-product-code`, fetches host products, and stores product scope/language.
- path: `src/config/domain.ts`
  - why it matters: Source of BFF endpoint mapping for development/testing/staging/production/release-incy and permission API base domains.
- path: `codegen.yml`, `src/graphql/**/*.graphql`
  - why it matters: GraphQL schema/documents for all BFF operations; codegen points to local `/mkt-operations/admin/graphql`.
- path: `src/pages/Flows/SetupGuide/**`
  - why it matters: 7-stage setup guide, by-module/by-trigger resource browsing, bound-resource query/mutation orchestration, and `ensAiChat` AI workflow.
- path: `src/pages/Flows/FlowTemplates/index.tsx`, `src/pages/Flows/TemplateEditor/**`
  - why it matters: Flow template list/config drawer and Mosaic Flow graph editor save/convert logic.
- path: `src/pages/Flows/SnapForm/**`, `src/hooks/useSnapFormEditor.ts`
  - why it matters: Dedicated SnapForm editor entry and opener communication for advanced filter/dynamic form schemas.
- path: `src/pages/Content/MailCraft/**`, `src/pages/Content/MailGenie/**`, `src/utils/sessionStore.ts`
  - why it matters: Email section editor flows; sessionStore transfers email section draft/context into editor pages and back to parent drawer before final GraphQL save.
- path: `src/config/emailEditor.ts`, `src/pages/Content/SystemEmailTemplates/components/EditDrawer/index.tsx`, `src/pages/Flows/PlatformEmailTemplate/components/EditDrawer/index.tsx`
  - why it matters: External `/aio-notification-doc` email editor URL construction and secure `postMessage` save handshake.
- path: `src/components/Sidekick/**`
  - why it matters: Flow/MailCraft assistant panel, action schemas, table/query registries, form/page context, mailcraft observer/executor, and AI transport.
- path: `src/pages/Tools/FlowDebugger/**`, `src/graphql/queries/flowDebugger.graphql`, `src/graphql/mutations/flowTrigger.graphql`, `src/graphql/queries/flowTrigger.graphql`
  - why it matters: Operational debug/test tooling for flow runtime, trigger requests, message content, and mock trigger events.

## Evidence
- file_or_command: `NOTIFICATION_REPO_MAP_RESEARCH.md`
  - finding: Confirmed required Per-Repo Research Output Schema, branch-track rules, evidence rules, and read-only research protocol.

- file_or_command: `repo-research/INDEX.md`
  - finding: Queue marks `fe-pltf-ens-admin` as running with local checkout `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin`; user explicitly requested this report path in the current turn. Index also maps related running package-owner reports such as `sdk-nodejs-snap-form` and `sdk-ts-mailcraft-editor`.

- file_or_command: `git remote -v`
  - finding: Fork-first remotes are present: `origin` is `git@github.com:Wynne-cwb/fe-pltf-ens-admin.git`; `upstream` is `git@github.com:AfterShip/fe-pltf-ens-admin.git`.

- file_or_command: branch/ref checks for `master`, `master_v9`, `feat/flow-v3-polaris-v13`, `feat/flow-v3`
  - finding: `master` and `feat/flow-v3` exist locally/upstream; `master_v9` and `feat/flow-v3-polaris-v13` were not found. Current branch is `feat/flow-v3`.

- file_or_command: `git rev-list --left-right --count upstream/feat/flow-v3...feat/flow-v3`
  - finding: Active branch is diverged (`4 1`): upstream has four unique commits, local/fork has one unique commit.

- file_or_command: `git status --porcelain=v1`
  - finding: Source checkout was clean during research.

- file_or_command: `package.json`
  - finding: Repo name is `fe-pltf-ens-admin`, homepage is `aio-notifications`, scripts include Vite dev/build/test/codegen, and direct deps include admin-email, mailcraft, mailgenie, mosaic-flow, snap-form, upload-center, automizely product auth, AHA, React 18, AntD 5.

- file_or_command: `vite.config.ts`
  - finding: Vite base is `/${homepage}/`; local server is `localhost:8080`; build copies product-auth silent callback and Monaco worker files under `dist/aio-notifications`.

- file_or_command: repo-wide search for `@module-federation`, `ModuleFederation`, `remoteEntry`, `exposes`, `remotes`
  - finding: No Module Federation config in source/config. Only qiankun/single-spa lifecycle hits appear in `src/index.tsx` and `src/App.tsx`.

- file_or_command: `src/index.tsx`
  - finding: App wraps `App` in `AuthProviderEmployee`, uses `AUTH_CLIENT_ID = admin-portal`, renders standalone when not qiankun-powered, and exposes `bootstrap/mount/unmount` on `window[homepage]`.

- file_or_command: `src/App.tsx`
  - finding: BrowserRouter basename is `/app-aio-notifications/` under qiankun and `aio-notifications/` standalone.

- file_or_command: `src/config/domain.ts`
  - finding: Main BFF endpoints are `/mkt-operations/admin/graphql`: development localhost `9005`, testing `bff-api.automizely.me`, staging `staging-bff-api.automizely.org`, production `bff-api.automizely.org`, release-incy `release-incy-bff-api.automizely.me`.

- file_or_command: `src/appStore/index.tsx`
  - finding: Registers `graphqlFetchInstance` default host from `getOperationGraphQLDomain()`, with `Content-Type`, `Authorization`, and `host-product-code` headers; fetches host products after registration.

- file_or_command: `codegen.yml`
  - finding: Generated GraphQL types/hooks are built from `http://localhost:9005/mkt-operations/admin/graphql` and documents `src/graphql/**/*.graphql`.

- file_or_command: `src/Routes.tsx` and `src/config/navigation.tsx`
  - finding: Routes and navigation expose Content, Flows, Tools, detail editors, Feature Rules, Flow Templates, Email/SMS templates, Email Sections, Merge Tags, Template Functions, Reconciliation, Flow Debugger, and Flow Trigger.

- file_or_command: `docs/README.md`
  - finding: Project docs identify ENS Admin Portal as internal notification flow management UI, managing 14 resources across seven stages; `/flows/*` is documented as the core route family.

- file_or_command: `src/pages/Flows/SetupGuide/constants.ts`
  - finding: Setup Guide stage config groups resources into Business Scenario, Trigger/Condition, Context/Data Sources, Step/SMS Components, Flow Templates, Content/Template Assets, and Feature Control.

- file_or_command: `src/graphql/queries/flowTemplate.graphql` and `src/graphql/mutations/flowTemplate.graphql`
  - finding: Flow template operations fetch declarations by trigger event type, list/get flow templates, and create/update/reset flow templates with `hostProductCode`.

- file_or_command: `src/pages/Flows/TemplateEditor/index.tsx`, `src/pages/Flows/TemplateEditor/FlowEditor/index.tsx`, `src/pages/Flows/TemplateEditor/FlowEditor/utils.ts`
  - finding: Flow Template editor uses `@aftership/mosaic-flow`, transforms BFF flow templates to/from node graph entities, and saves via create/update FlowTemplate mutations.

- file_or_command: `src/hooks/useSnapFormEditor.ts`, `src/pages/Flows/SnapForm/index.tsx`, `src/pages/Flows/SnapForm/components/*Editor.tsx`
  - finding: Parent pages open SnapForm editor under `/aio-notifications/detail/snapFormEditor`, pass schema through localStorage/URL params, and receive save/cancel through `window.opener.postMessage`.

- file_or_command: `src/pages/Content/MailCraft/index.tsx`, `src/components/Sidekick/mailcraft/**`, `src/utils/sessionStore.ts`
  - finding: MailCraft editor consumes session-stored email section draft, loads merge tags from BFF, validates Django through BFF, uploads assets, writes draft back to sessionStorage, and mounts MailcraftSidekick.

- file_or_command: `src/components/Sidekick/mailcraft/types.ts`, `src/components/Sidekick/mailcraft/mailcraftComponentAttributesWhitelist.ts`
  - finding: Comments identify cross-repo contract source of truth in `admin.automizelyapi.org_mkt-operations/src/modules/flow-ai-assistant/...`, proving FE/BFF manual contract synchronization for MailCraft snapshot/component attributes.

- file_or_command: `src/config/emailEditor.ts`
  - finding: Email template editor integration points to `/aio-notification-doc`, with two routes: `/email-template-editor` for Content/SystemEmailTemplates and `/platform-email-template-editor` for Flows/PlatformEmailTemplate.

- file_or_command: `src/pages/Content/SystemEmailTemplates/components/EditDrawer/index.tsx` and `src/pages/Flows/PlatformEmailTemplate/components/EditDrawer/index.tsx`
  - finding: Both open external editor windows, accept messages only from `getEmailEditorOrigin()`, push initial data on `email-template-editor-ready`, then receive saved email template payloads and request screenshots.

- file_or_command: `src/graphql/queries/flowDebugger.graphql`
  - finding: Flow Debugger operations cover polling trigger executions, trigger requests, flow executions, step/sub-step executions, debug email request, debug SMS request/group, and rerun flow execution.

- file_or_command: `src/components/Sidekick/hooks/useSidekickChat.ts`, `src/components/Sidekick/services/aiService.ts`, `src/graphql/mutations/flowAiAssistant.graphql`
  - finding: Sidekick sends message/history/current route/page context/host product and optional MailCraft snapshot or attachments to `flowAiAssistant` GraphQL mutation.

- file_or_command: `src/pages/Flows/SetupGuide/hooks/useAIChat.ts`, `src/graphql/mutations/ensAiChat.graphql`
  - finding: Setup Guide AI sends assembled trigger context and chat history to `ensAiChat`, receiving proposed resource operations.

- file_or_command: `repo-research/admin.automizelyapi.org_mkt-operations.md`
  - finding: Completed BFF report confirms `admin.automizelyapi.org_mkt-operations` owns `/mkt-operations/admin/graphql`, Notification Flow admin resources, message/template assets, Flow Debugger/Trigger tooling, and Flow AI Assistant.

- file_or_command: `repo-research/sdks.am-static.com_admin-email.md`
  - finding: Completed package-owner report confirms source repo `sdks.am-static.com_admin-email` owns npm package `@aftership/admin-email`, email editor SDK/MF surfaces, and render/migration helpers consumed here.

## Open Questions
- question: What is the canonical parent shell for qiankun mounting this app?
  - why it matters: Source proves qiankun lifecycle and `/app-aio-notifications/` basename, but does not identify the host repo that mounts it in production.

- question: Should future active-major work base from `upstream/feat/flow-v3` or preserve the local/fork-only `4fb5d4f` commit?
  - why it matters: Local active branch is diverged from upstream (`4 1`), so blindly branching from current local state may include or miss recent upstream fixes.

- question: Which repos are canonical owners for `@aftership/mailgenie`, `@aftership/mosaic-flow`, `@aftership/snap-form`, and `@aftership/mailcraft` package changes?
  - why it matters: This repo consumes those packages deeply, but exact source repo mapping should be confirmed from their per-repo reports before cross-repo edits.

- question: Is `getEmailEditorOrigin()` intentionally hardcoded to `https://admin.automizely.me` outside local development?
  - why it matters: `src/config/emailEditor.ts` comments describe same-origin deployment and production/staging distinction, while current code returns `.me` for all non-development modes. This may be intentional after the latest local email-editor fix, but the operational rule should be clarified before changing editor integration.

- question: Should `@aftership/advance-filters` be a direct dependency?
  - why it matters: Source imports an advance-filters type directly, but `package.json` only gets it transitively through `@aftership/snap-form`; package manager or dependency updates could break type resolution.
