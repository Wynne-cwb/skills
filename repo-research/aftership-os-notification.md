# aftership-os-notification

## Summary
- project_id: aftership-os-notification
- repo_name: aftership-os-notification
- upstream_url: https://github.com/AfterShip/aftership-os-notification
- local_path: /Users/wb.chen/Documents/AfterShip/aftership-os-notification
- repo_type: React/TypeScript Module Federation remote shell with a local example host.
- confidence: high for MF shell responsibilities and branch evidence; medium for downstream repo-name mapping where source only exposes remote globals or comments.

## Responsibility
- Owns: OS notification Module Federation wrapper/shell named `aftership_os_notification`, CDN subdirectory `os-notification`, and the merged `./osNotification` expose. It exports provider/page adapters for notification flows, email editors/templates, and notification settings.
- Owns: Host-runtime adaptation for embedding legacy React Router v5 notification pages into an OS host via `hostRuntime.router`, `@aftership/mf-router-remote-rrv5`, `BasicDependenciesProvider`, and `NotificationConfigProvider`.
- Owns: Example/admin-like host under `/platform-notification` for local/manual verification, including auth/growth/billing wrappers and routes under `/notifications/...` and `/settings/ens`.
- Does not own: The core notification business page implementations. Most pages statically import `AftershipNotificationModule` from the `platform_notification` MF remote and render components such as `NotificationFlowListPage`, `NotificationFlowEditor`, `NotificationEmailTemplates`, `EmailContentGroupEditorForFlowPage`, `EmailContentGroupEditorWithInitialData`, `EmailContentGroupEditorForAdminPortal`, `CommonSettingsRouters`, and `SmsSetting`.
- Does not own: Backend send/delivery services. Direct GraphQL usage in this repo is limited to dev/test scaffolding (`GetUserInfo`) and generated types; send-test email/SMS behavior is delegated to remote slots/hooks from `AftershipNotificationModule`.
- Common change areas: `config/constants/mf.js`, `mf.config.js`, `config/webpack/webpack.module.federation.config.js`, `src/mfExports/osNotification.ts`, `src/mfRemote/providers/OsNotificationProvider/index.tsx`, `src/mfRemote/pages/*`, `src/utils/load*`, and `example/Routes.tsx`.

## Branch Tracks
- production: `master` exists locally and as `upstream/master` at `cbc95bb` (`2026-05-11`, "Merge pull request #28 from AfterShip/testing").
- legacy_v9: Not found in local or tracked remote refs inspected; no `master_v9` branch appears in `git branch -a --list`.
- active_major: `upstream/feat/flow-v3-polaris-v13` exists at `6250d28` (`2026-05-12`, "Merge pull request #31 from feidom-up/feat/flow-v3-polaris-v13"). No `feat/flow-v3` branch appears in local/tracked remote refs inspected.
- repo_specific_notes: Current checkout is `dev-notifications`, tracking `upstream/dev-notifications`; `git branch -vv` reports it as `ahead 1, behind 3`. `upstream/dev-notifications` exists at `4c64ecc` (`2026-06-08`), while local `dev-notifications`/`origin/dev-notifications` is `f7ea965` (`2026-06-08`, ASE-1078 build-script fix). This repo appears to have a repo-specific active integration branch `dev-notifications` in addition to the protocol's active-major branch.

## Module Federation
- enabled: true.
- exposes: `./TestMFApp -> ./src/mfExports/testMFApp.ts`; `./osNotification -> ./src/mfExports/osNotification.ts`.
- exposes: `./osNotification` barrel exports `OsNotificationProvider`, `OsNotificationRuntimeProvider`, `FlowEditor`, `FlowList`, `CustomTemplates`, `EmailEditor`, `NotificationEmailTemplateEditor`, `EmailTemplateEditor`, `PlatformEmailTemplateEditor`, `NotificationSettings`, `ReactRouterV5Router`, and provider prop types.
- remotes: Remote build declares `AftershipNotificationModule: platform_notification@<platform-notification remoteEntry>`.
- remotes: Example host declares `aftershipAccountsWidgets: aftership_accounts_widgets@<accounts remoteEntry>`.
- remotes: Runtime dynamic loaders also load `aftership_billing_ui` (`./BillingProviderV2`), `notification_billing` (`./billingV2`), and this repo's own `aftership_os_notification` (`./osNotification`) for the example host.
- shared_packages: Remote build treats host-owned singletons as `react`, `react-dom`, `@aftership/aha`, `@aftership/aha-icons`, `@shopify/polaris`, `@shopify/polaris-icons`, `@shopify/react-i18n`, `i18next`, `react-i18next`, `@aftership/meerkat-sdk`, `@aftership/automizely-product-auth`, and `@aftership/datacat`.
- shared_packages: Remote-owned singleton-compatible fallbacks include `react-router-dom`, `react-router`, `react-redux`, `redux`, `formik`, `@aftership/automizely-frontend-dev-kit`, and `@aftership/automizely-tools-ui-react`.
- branch_alignment: MF config and tests on current checkout enforce a merged `./osNotification` barrel expose and no legacy `./osNotification/<page>` exposes. `upstream/feat/flow-v3-polaris-v13` and `dev-notifications` both matter for notification MF migration work; verify target branch with task context before editing.

## Team Repo Dependencies
- Direct dependencies: `@aftership/aha`, `@aftership/aha-icons`, `@aftership/automizely-frontend-dev-kit`, `@aftership/automizely-product-auth`, `@aftership/datacat`, `@aftership/growth-components`, `@aftership/meerkat-sdk`, `@aftership/mf-router-remote-rrv5`, `@module-federation/enhanced`, and related React/Redux/Router/Formik packages in `package.json`.
- Runtime calls: `AftershipNotificationModule` / `platform_notification` is the primary business remote; it supplies notification flow pages, email/SMS settings, send-test slots/hooks, content-group editors, and message-box utilities.
- Runtime calls: Local/example GraphQL initialization uses `@aftership/automizely-frontend-dev-kit` against `http://localhost:9003/marketing/admin/graphql` and `http://localhost:9003/sms/admin/graphql`; `codegen.yml` points to `http://localhost:9003/marketing/admin/graphql`.
- Runtime calls: Email template editor pages use `window.postMessage` protocol with host messages `email-template-editor-ready`, `email-template-editor-data-push`, `email-template-editor-save`, and `email-template-editor-close`; comments name `fe-pltf-ens-admin` as the iframe/fullscreen consumer.
- Runtime calls: Billing wrappers load `aftership-billing-ui/v2/remoteEntry.js` and `notification-billing/remoteEntry.js`.
- Runtime calls: Example app wraps routes with `AuthProvider` from `@aftership/automizely-product-auth`, `GrowthProvider` from `@aftership/growth-components`, `BillingProviderV2`, and `BillingMFProvider`.
- Build-time dependencies: Webpack 5, `@module-federation/enhanced/webpack`, `@aftership/module-federation-typescript`, `graphql-codegen`, SWC/Jest, and `config/scripts/upload-assets.js` for remote asset upload.
- Shared packages: See Module Federation shared package lists above; these are part of the host/remote compatibility contract.
- Inferred but unconfirmed: Source comments repeatedly call the `AftershipNotificationModule` remote "aio_notification" and say two editor pages were migrated from `aio-notification(feat/flow-v3)`, while the configured remote global/CDN path is `platform_notification` / `platform-notification`. Treat the exact repo mapping as likely but unconfirmed until the `aio-notification` or platform-notification repo report verifies it.
- Inferred but unconfirmed: `aftership_accounts_widgets`, `aftership_billing_ui`, `notification_billing`, and `fe-pltf-ens-admin` are downstream/upstream team-owned surfaces, but this repo only provides remote globals/CDN paths or comments, not canonical GitHub repo URLs.

## Business Flows
- flow_id: os_notification_mf_shell
- role: Provides the `aftership_os_notification` MF remote and `./osNotification` barrel for OS/host apps to embed notification functionality.
- upstream/downstream repos: Upstream business UI remote is `platform_notification` (`AftershipNotificationModule`). Downstream host is OS/admin embedding surface, with exact repo mapping not fully confirmed in this report.

- flow_id: notification_flow_management
- role: Wraps `NotificationFlowListPage` and `NotificationFlowEditor`; provider injects flow callbacks (`onTransformFlowTemplates`, `onTransformFlow`, `onBeforeCreateEmailTemplate`, `onBeforeCreateSmsTemplate`) through `notificationFlowConfig.flow`.
- upstream/downstream repos: Depends on `platform_notification` remote for actual flow business components; can be consumed by OS hosts through `./osNotification`.

- flow_id: notification_email_content
- role: Wraps flow email editor (`EmailContentGroupEditorForFlowPage`), custom template list (`NotificationEmailTemplates`), and notification email template editor (`NotificationEmailTemplateEditor`). It also supports seed-template create flow via `readPlatformNotificationSeed` / `removePlatformNotificationSeed`.
- upstream/downstream repos: Depends on `platform_notification`; downstream route examples are `/notifications/email-editor`, `/notifications/custom-templates`, and `/notifications/custom-template-detail`.

- flow_id: system_email_template_editor
- role: Provides iframe/popup editor page for Content/SystemEmailTemplates using `EmailContentGroupEditorWithInitialData`, `useCreateEmailContentGroup`, and a postMessage save/close protocol.
- upstream/downstream repos: Comments identify `fe-pltf-ens-admin` as consumer; business editor implementation comes from `platform_notification`.

- flow_id: platform_email_template_editor
- role: Provides iframe/popup editor page for Flows/PlatformEmailTemplate using `EmailContentGroupEditorForAdminPortal`, URL params `businessScenarioType` and `triggerEventType`, and postMessage save/close protocol.
- upstream/downstream repos: Comments identify `fe-pltf-ens-admin` as consumer; business editor implementation comes from `platform_notification`.

- flow_id: notification_email_sms_settings
- role: Wraps `CommonSettingsRouters` and `SmsSetting`; default title is "Email & SMS Settings" and example route is `/settings/ens`.
- upstream/downstream repos: Depends on `platform_notification`; consumed through OS/example routes.

## Important Entrypoints
- path: `package.json`
- why it matters: Defines repo name, scripts (`dev`, `mf`, `build`, `codegen`, `upload-assets`), core AfterShip dependencies, and `APP_NAME=admin.automizely.org_platform-notification` example-build switch.

- path: `config/constants/domain.js`
- why it matters: Defines example port `9220`, MF port `8220`, CDN domains, `DOMAIN_SUBDIRECTORY = os-notification`, and `MODULE_FEDERATION_NAME = aftership_os_notification`.

- path: `config/constants/mf.js`
- why it matters: Canonical MF exposes/remotes map. It shows `./osNotification` barrel expose, `aftershipAccountsWidgets` host remote, and `AftershipNotificationModule` remote backed by `platform_notification`.

- path: `mf.config.js`
- why it matters: Defines remote/host Module Federation configs and shared singleton ownership. Comments explicitly state the shell depends on `AftershipNotificationModule` for business page components.

- path: `config/webpack/webpack.module.federation.config.js`
- why it matters: Production/dev MF build entry (`src/index`), dev port `8220`, public path under `os-notification`, `ModuleFederationPlugin(getMFConfig().remote)`, and TypeScript remote type generation.

- path: `config/webpack/webpack.example.config.js`
- why it matters: Example host build, dev port `9220`, `/platform-notification` history fallback, host MF config, product-auth silent callback, and `TESTING_INCY` env.

- path: `src/index.ts`
- why it matters: Package entry re-exporting `AppProvider`, `TestMFApp`, and all `./osNotification` exports.

- path: `src/mfExports/osNotification.ts`
- why it matters: Canonical consumer-facing barrel for providers, flow pages, email/template pages, settings page, and React Router v5 router export.

- path: `src/mfRemote/providers/OsNotificationProvider/index.tsx`
- why it matters: Main integration adapter. Wraps `BasicDependenciesProvider` and `NotificationConfigProvider`, injects send-test slots/hooks and flow/email/sms transform callbacks, and bridges host runtime router into React Router v5.

- path: `src/mfRemote/pages/*/index.tsx`
- why it matters: Thin page adapters around `AftershipNotificationModule` business components; includes flow list/editor, custom templates, flow email editor, notification template editor, system/platform email template editors, and settings.

- path: `src/utils/loadRemoteModule.ts`
- why it matters: Generic runtime loader for external MF remoteEntry scripts, share scope initialization, and exposed module caching.

- path: `src/utils/loadOsNotificationMF.ts`
- why it matters: Example host dynamic loader for this repo's `aftership_os_notification` remote and typed list of exported modules.

- path: `src/utils/loadBillingProviders.ts`
- why it matters: Runtime loaders for `aftership_billing_ui` and `notification_billing` remotes used by the example route wrapper.

- path: `src/utils/loadAftershipNotification.ts`
- why it matters: Typed dynamic loader and contract documentation for `platform_notification` / `AftershipNotificationModule`; no callers found in current source, but it records the expected remote surface.

- path: `example/App.tsx` and `example/Routes.tsx`
- why it matters: Local host composition and route map. Routes show how exposed pages map to `/notifications/flow-editor`, `/notifications/flow-list`, `/notifications/custom-templates`, `/notifications/email-editor`, `/notifications/custom-template-detail`, `/notifications/email-template-editor`, `/notifications/platform-email-template-editor`, and `/settings/ens`.

- path: `codegen.yml`, `src/graphql/queries/getUserInfo.graphql`, `src/generated/graphql.ts`
- why it matters: GraphQL schema/doc generation evidence. Generated types contain notification/email/SMS/flow schema surface, while checked-in documents only include `GetUserInfo`.

## Evidence
- file_or_command: `git remote -v`
- finding: `origin` points to `git@github.com:Wynne-cwb/aftership-os-notification.git`; `upstream` points to `git@github.com:AfterShip/aftership-os-notification.git`, matching fork-first remotes.

- file_or_command: `git branch -a --list`
- finding: Local/tracked refs include `master`, `upstream/master`, `upstream/dev-notifications`, `upstream/feat/flow-v3-polaris-v13`, and `upstream/testing`; no `master_v9` or `feat/flow-v3` ref appears.

- file_or_command: `git branch -vv`
- finding: Current branch is `dev-notifications`, tracking `upstream/dev-notifications`, `ahead 1, behind 3`.

- file_or_command: `git status --porcelain=v1`
- finding: Only untracked `.codegraph/` is present; no source file modifications were observed during research.

- file_or_command: `package.json`
- finding: Repo name is `aftership-os-notification`; scripts distinguish example host (`dev`, `build:example`) from MF remote (`mf`, `build`); dependencies include AfterShip UI/auth/devkit/MF/router packages.

- file_or_command: `config/constants/domain.js`
- finding: `MODULE_FEDERATION_PORT = 8220`, `DOMAIN_SUBDIRECTORY = os-notification`, `MODULE_FEDERATION_NAME = aftership_os_notification`, example domain subdirectory `platform-notification`.

- file_or_command: `config/constants/mf.js`
- finding: `MF_EXPORTS` contains `./TestMFApp` and `./osNotification`; remote build maps `AftershipNotificationModule` to `platform_notification@${pathUtils.getAioNotificationFederationUrl()}`.

- file_or_command: `mf.config.js`
- finding: Remote config names `aftership_os_notification`, writes `remoteEntry.js`, exposes `MF_EXPORTS`, uses `MF_REMOTE_REMOTES`, and documents that the shell depends on `AftershipNotificationModule` for business page components.

- file_or_command: `config/utils/path.js`
- finding: `getAioNotificationFederationUrl()` resolves staging/prod to `.../platform-notification/remoteEntry.js` and development/testing/release to `https://release-incy-sdks.am-static.io/platform-notification/remoteEntry.js`.

- file_or_command: `src/mfExports/osNotification.ts`
- finding: Barrel exports all public OS notification providers/pages and `Router as ReactRouterV5Router`.

- file_or_command: `src/mfRemote/providers/OsNotificationProvider/index.tsx`
- finding: Imports `BasicDependenciesProvider`, `SendTestEmailSlot`, `SendTestSmsSlot`, `NotificationConfigProvider`, `useTestEmailPreSent`, and `useTestSmsPreSent` from `AftershipNotificationModule`; injects these into `notificationFlowConfig`/config and handles host runtime router.

- file_or_command: `src/mfRemote/pages/FlowList/index.tsx`, `FlowEditor/index.tsx`, `CustomTemplates/index.tsx`, `EmailEditor/index.tsx`, `NotificationSettings/index.tsx`
- finding: These pages are thin wrappers over `AftershipNotificationModule` exports such as `NotificationFlowListPage`, `NotificationFlowEditor`, `NotificationEmailTemplates`, `EmailContentGroupEditorForFlowPage`, `CommonSettingsRouters`, and `SmsSetting`.

- file_or_command: `src/mfRemote/pages/EmailTemplateEditor/index.tsx`
- finding: Comments label "A line" Content/SystemEmailTemplates editor migrated from `aio-notification(feat/flow-v3)` and consumed by `fe-pltf-ens-admin` via iframe or popup; implementation uses postMessage and `EmailContentGroupEditorWithInitialData`.

- file_or_command: `src/mfRemote/pages/PlatformEmailTemplateEditor/index.tsx`
- finding: Comments label "B line" Flows/PlatformEmailTemplate editor migrated from `aio-notification(feat/flow-v3)` and consumed by `fe-pltf-ens-admin`; implementation uses postMessage and `EmailContentGroupEditorForAdminPortal`.

- file_or_command: `example/Routes.tsx`
- finding: Example route map loads `./osNotification` modules lazily and wraps them with `notification_billing` `BillingMFProvider`.

- file_or_command: `src/utils/loadBillingProviders.ts`
- finding: Runtime loaders target `https://sdks.am-static.io/aftership-billing-ui/v2/remoteEntry.js` global `aftership_billing_ui` expose `./BillingProviderV2`, and `https://release-incy-sdks.am-static.io/notification-billing/remoteEntry.js` global `notification_billing` expose `./billingV2`.

- file_or_command: `src/utils/loadRemoteModule.ts`
- finding: Generic loader appends remoteEntry scripts, initializes webpack share scope, calls `container.get(expose)`, and caches loaded remote modules.

- file_or_command: `codegen.yml` and `src/graphql/queries/getUserInfo.graphql`
- finding: Codegen schema points to local marketing admin GraphQL; only checked-in query document is `GetUserInfo`, which fetches user profile/email/SMS quota fields.

## Open Questions
- question: What is the canonical upstream repo name for the `platform_notification` / `AftershipNotificationModule` remote?
- why it matters: This repo's source comments point to `aio-notification(feat/flow-v3)` while MF config uses `platform_notification` and `/platform-notification/remoteEntry.js`; the repo map should not collapse these without confirming the provider repo.

- question: Which OS/admin host repo consumes `aftership_os_notification` in production?
- why it matters: The example host demonstrates consumption, and comments mention `fe-pltf-ens-admin` for iframe editors, but the production host repo relationship needs confirmation from the host repo.

- question: Which repo owns `notification_billing`, `aftership_billing_ui`, and `aftership_accounts_widgets`?
- why it matters: They are concrete runtime remotes, but this checkout only records remote globals/CDN paths, not repository URLs.

- question: Should future changes target `dev-notifications`, `feat/flow-v3-polaris-v13`, or `master`?
- why it matters: Protocol branch rules find `feat/flow-v3-polaris-v13` as active major, but current checkout and recent commits use `dev-notifications`; task-specific base branch should be verified before editing.
