# sdks.am-static.com_aio-notification

## Summary
- project_id: `sdks.am-static.com_aio-notification`
- repo_name: `sdks.am-static.com_aio-notification`
- upstream_url: `https://github.com/AfterShip/sdks.am-static.com_aio-notification`
- local_path: `/Users/wb.chen/Documents/AfterShip/aio-notification`
- repo_type: React 17 frontend Module Federation remote, Platform Notification guide/docs site, and public facade over lower-level notification/email/SMS/flow remotes.
- confidence: High for repo identity, branch refs, Module Federation config, public facade exports, package dependencies, and documented responsibility. Medium for exact GitHub repo mapping behind several MF remote aliases because this repo proves remote aliases/CDN subdirs, while repo-name ownership must be cross-checked with the other repo reports.

## Responsibility
- Owns:
  - Platform Notification guide website and demo docs. README says the project provides a Guide website for Platform Notification component docs/demos and a unified export package for business integration (`README.md:3-16`).
  - The `aio_notification` Module Federation remote, exposing `.` and `./index` from `src/remoteEnter` (`mf.config.js:26-32`).
  - The `aftershipNotification` public facade used by docs and consumers, aggregating exports from billing, basic, CRM, analytics, SMS, email, and flow remotes (`src/remoteEnter.tsx:1-246`).
  - Integration documentation for host projects, including the recommended `aftershipNotification: aio_notification@.../aio-notification/remoteEntry.js` remote config (`src/pages/Integrate/index.md:37-110`).
  - A public contract check that requires key email content group exports and rejects selected internal email save helpers from the AIO facade (`scripts/check-public-contract.mjs:74-109`).
  - Local guide/demo routes for docs, email template editor, Notification Platform examples, Mosaic Flow, advance filters, and `/settings/ens` (`src/routes.tsx:27-143`).
- Does not own:
  - Notification Platform backend SDK/engine or admin portal. The intro page lists BE as `platform-notification-sdk-go`, FE as Module Federation, and Admin portal as separate Testing/Production URLs (`src/pages/Introduce/index.md:71-77`).
  - The underlying implementations of email editor/templates, SMS editor/settings, flow editor/list/templates, CRM segments, analytics/history, billing widgets, or common marketing basics; these are imported from MF remotes (`src/remoteEnter.tsx:1-124`).
  - Real Flow persistence in the Mosaic Flow demo; the example doc says it only shows the new Flow interaction and does not save real flows (`src/pages/NotificationPlatform/components/Home/index.md:1-9`).
  - Notification rendering/sending backend behavior. This repo mainly exposes FE integration surfaces; the only direct notification admin runtime call found is a demo fetch to `https://bff-api.automizely.io/notification/admin/graphql` for conditional config (`src/pages/NotificationPlatform/components/AdvanceFilters/index.tsx:25-42`).
- Common change areas:
  - `mf.config.js` for remote/expose/shared-package changes.
  - `src/remoteEnter.tsx` for public facade exports.
  - `src/remoteEnter.public-contract.ts` and `scripts/check-public-contract.mjs` for public API guardrails.
  - `src/docs/**`, `src/pages/Integrate/index.md`, `src/pages/Introduce/index.md`, and `README.md` for guide-site docs.
  - `webpack.config.js`, `vite.config.ts`, and `plugins/moduleFederationTypes.ts` for MF build/type generation.

## Branch Tracks
- production: `master` exists locally and as `upstream/master`. Evidence: `git for-each-ref --format='%(refname:short)' refs/heads refs/remotes` listed `master`, `origin/master`, and `upstream/master`; explicit `show-ref` check found `upstream/master`.
- legacy_v9: `master_v9` exists locally and as `upstream/master_v9`. Evidence: same branch scan listed `master_v9` and `upstream/master_v9`; explicit `show-ref` check found `upstream/master_v9`.
- active_major: `feat/flow-v3-polaris-v13` exists and should be preferred by the protocol; `feat/flow-v3` also exists. Evidence: branch scan listed local/origin/upstream `feat/flow-v3-polaris-v13` and local/origin/upstream `feat/flow-v3`; explicit `show-ref` checks found both upstream refs.
- repo_specific_notes:
  - Current checkout branch during research: `feat/affiliate-simple-editor`; `git status --short --branch` showed it tracking `origin/feat/affiliate-simple-editor`.
  - Remotes are fork-first shaped: `origin` is `git@github.com:Wynne-cwb/sdks.am-static.com_aio-notification.git`; `upstream` is `git@github.com:AfterShip/sdks.am-static.com_aio-notification.git`.
  - Additional upstream release/env refs include `upstream/staging`, `upstream/testing`, `upstream/release/core`, `upstream/release/tidy`, `upstream/release/banana`, `upstream/release/incy`, `upstream/release/plum`, and feature branches such as `upstream/feat/mf-host`, `upstream/feat/migration_polaris_v13`, and `upstream/feat/notification-platform`.

## Module Federation
- enabled: Yes.
  - `mf.config.js` declares remote name `aio_notification`, file `remoteEntry.js`, exposes, remotes, and shared singletons (`mf.config.js:26-113`).
  - Webpack build uses `@module-federation/enhanced/webpack` `ModuleFederationPlugin` plus `ASModuleFederationTypeScriptRemotePlugin` (`webpack.config.js:4-10`, `webpack.config.js:119-126`).
  - Vite docs build uses `@module-federation/vite` `federation(mfConfig())` and a local `moduleFederationTypes(mfConfig())` plugin (`vite.config.ts:4-12`, `vite.config.ts:37-43`).
- exposes:
  - `.` -> `./src/remoteEnter`
  - `./index` -> `./src/remoteEnter`
- remotes:
  - `aftershipBillingWidgets`: `aftership_billing_ui@.../aftership-billing-ui/remoteEntry.v1.js`
  - `adminMarketingBilling`: `admin_marketing_billing@.../admin-marketing-billing/remoteEntry.js`
  - `adminMarketingBasic`: `admin_marketing_basic@.../admin-marketing-basic/remoteEntry.js`
  - `adminMarketingCoupon`: `admin_marketing_coupon@.../admin-marketing-coupon/remoteEntry.js`
  - `adminMarketingAnalytics`: `admin_marketing_analytics@.../admin-marketing-analytics/remoteEntry.js`
  - `adminSms`: `admin_sms@.../admin-sms/remoteEntry.js`
  - `adminCrm`: `admin_crm@.../admin-crm/remoteEntry.js`
  - `adminEmail`: `admin_email@.../admin-email/remoteEntry.js`
  - `adminFlow`: `admin_flow@.../admin-flow/remoteEntry.js`
  - Evidence: `mf.config.js:33-64`.
- shared_packages:
  - Singleton/shared from `mf.config.js`: `react`, `react-dom`, `react-redux`, `react-router`, `react-router-dom`, `@aftership/automizely-product-auth`, `@shopify/polaris`, `@shopify/polaris-icons`, `@shopify/react-i18n`, `@aftership/automizely-billing-ui-react` (`import: false`), `formik`, `@aftership/growth-components`, `@aftership/meerkat-sdk`, `@aftership/datacat`, `@sentry/react` (`mf.config.js:65-113`).
  - Integration docs repeat the expected host-side shared dependencies and warn that host apps must import installed shared packages so tree shaking does not remove them (`src/pages/Integrate/index.md:7-35`, `src/pages/Integrate/index.md:62-110`).
- branch_alignment:
  - Uses protocol default tracks: production `master`, legacy `master_v9`, active major `feat/flow-v3-polaris-v13` preferred over `feat/flow-v3`; all candidate upstream refs exist.
  - Runtime CDN URL alignment is environment-based, not branch-name-based inside this repo. `mf.config.js` maps APP_ENV to `sdks.am-static.io`, `staging-sdks.am-static.com`, `sdks.am-static.com`, and several release subdomains (`mf.config.js:1-24`). Webpack publicPath uploads this remote under `/aio-notification/` (`webpack.config.js:24-35`, `webpack.config.js:43-48`).

## Team Repo Dependencies
- Direct dependencies:
  - Notification/MF-related packages in `package.json`: `@aftership/advance-filters`, `@aftership/automizely-billing-ui-react`, `@aftership/automizely-product-auth`, `@aftership/datacat`, `@aftership/growth-components`, `@aftership/meerkat-sdk`, `@aftership/mosaic-flow`, `@aftership/upload-center`, `@module-federation/enhanced`, `@module-federation/vite`, `@aftership/module-federation-typescript`, and `@module-federation/native-federation-typescript` (`package.json:29-42`, `package.json:68-71`).
  - React/UI/runtime dependencies include React 17, Polaris 6, Ant Design 5, Formik, React Router 5, Sentry React, Algolia/InstantSearch, lodash-es, and Markdown tooling (`package.json:43-66`).
- Runtime calls:
  - Module Federation runtime remotes listed in `mf.config.js:33-64`; public facade imports concrete APIs from those remote aliases in `src/remoteEnter.tsx:1-124`.
  - Guide app initializes auth, billing, marketing basic dependencies, upload, i18n, Polaris, AntD, and Algolia search in `src/App.tsx:57-114`.
  - Advance Filters demo calls `https://bff-api.automizely.io/notification/admin/graphql` with auth/organization headers and `conditionalConfig` GraphQL query (`src/pages/NotificationPlatform/components/AdvanceFilters/index.tsx:14-42`).
  - Upload integration uses `@aftership/upload-center` and `VITE_FILE_APP_ID` (`src/utils/upload.ts`).
- Build-time dependencies:
  - Webpack MF remote build: `yarn build:mf` -> `webpack --config ./webpack.config.js --mode=production`; docs build: `yarn build:doc` -> `vite build` (`package.json:7-17`).
  - `scripts/build_script.js` selects MF build for `APP_NAME=sdks.am-static.com_aio-notification` and docs build for `APP_NAME=sdks.am-static.com_aio-notification_doc` (`scripts/build_script.js:3-12`).
  - `plugins/moduleFederationTypes.ts` derives each remote's `@mf-types.zip` URL and unzips it into `node_modules/@types/<remoteName>` during Vite `buildStart` (`plugins/moduleFederationTypes.ts:5-25`).
  - `ASModuleFederationTypeScriptRemotePlugin` emits remote types to `build` for webpack MF builds (`webpack.config.js:123-126`).
- Shared packages:
  - Same as Module Federation `shared_packages`: React/Router/Redux, Polaris/i18n/icons, product auth, billing UI React, Formik, growth-components, meerkat-sdk, datacat, Sentry (`mf.config.js:65-113`).
- Inferred but unconfirmed:
  - MF alias/CDN subdir to repo mapping likely follows the repo queue naming for `sdks.am-static.com_admin-marketing-billing`, `sdks.am-static.com_admin-marketing-basic`, `sdks.am-static.com_admin-marketing-coupon`, `sdks.am-static.com_admin-crm`, `sdks.am-static.com_admin-email`, `sdks.am-static.com_admin-sms`, and `sdks.am-static.com_admin-flow`; evidence in this repo only proves alias/subdir names (`mf.config.js:33-64`) plus imports (`src/remoteEnter.tsx:1-124`), not the GitHub repo identities.
  - `adminMarketingAnalytics` uses CDN subdir `admin-marketing-analytics`; the repo queue has `sdks.am-static.com_admin-marketing-data`, so the exact repo mapping needs that repo's report before becoming a stable map fact.
  - `aftershipBillingWidgets` uses CDN subdir `aftership-billing-ui` and remote name `aftership_billing_ui`; whether this maps to a separate frontend repo or package ownership is not proven by this repo alone.

## Business Flows
- flow_id: `platform_notification_fe_sdk`
- role: Unified frontend Module Federation access layer and docs site for business products integrating Notification Platform. It lets consumers import from one `aftershipNotification` facade instead of depending on many lower-level MF packages (`README.md:5-16`, `README.md:117-117`).
- upstream/downstream repos:
  - Upstream: lower-level MF remotes for billing/basic/coupon/analytics/SMS/CRM/email/flow (`mf.config.js:33-64`, `src/remoteEnter.tsx:1-124`).
  - Downstream: business host frontends that configure `aftershipNotification: aio_notification@.../aio-notification/remoteEntry.js` (`src/pages/Integrate/index.md:37-61`).

- flow_id: `unified_email_editor`
- role: Re-exports email editor framework, templates, send modal, content group editor/previewer, custom template editor, sender hooks, template hooks, multilanguage, resubscription components, and email content group contract types from `adminEmail` (`src/remoteEnter.tsx:91-119`, `src/remoteEnter.tsx:183-214`, `src/remoteEnter.tsx:232-245`).
- upstream/downstream repos:
  - Upstream: `adminEmail` MF remote, `adminMarketingBasic` for common/settings/dependencies, `adminMarketingAnalytics` for stats/history.
  - Downstream: host products using email content groups/templates; standalone guide route `/email-template-editor` uses `EmailContentGroupEditorWithInitialData` and posts save result back to opener (`src/pages/EmailTemplateEditor/index.tsx:1-84`).

- flow_id: `flow_platform`
- role: Re-exports Flow Editor/List/Templates, SubscriberFlows, and flow hooks from `adminFlow`; guide has Mosaic Flow interaction demo but not real save (`src/remoteEnter.tsx:121-124`, `src/remoteEnter.tsx:195-206`, `src/remoteEnter.tsx:230-231`, `src/pages/NotificationPlatform/components/Home/index.md:1-9`).
- upstream/downstream repos:
  - Upstream: `adminFlow` MF remote and `@aftership/mosaic-flow` package.
  - Downstream: Platform Notification adopters wiring Flow UI through `aftershipNotification`.

- flow_id: `email_sms_settings_and_sender`
- role: Provides/common-reexports settings routes, product dependencies, sender info hooks, SMS phone/registration/send/editor/settings components, and email/SMS settings demo route (`src/remoteEnter.tsx:23-56`, `src/remoteEnter.tsx:78-89`, `src/remoteEnter.tsx:190-203`, `src/routes.tsx:97-116`).
- upstream/downstream repos:
  - Upstream: `adminMarketingBasic`, `adminSms`, `adminEmail`.
  - Downstream: host products needing sender settings, image/custom-font/address settings, SMS sender setup, or SMS variants through the unified facade.

- flow_id: `notification_history_and_reporting`
- role: Re-exports content group report, email stats hooks/types, notification history hooks/types from `adminMarketingAnalytics` (`src/remoteEnter.tsx:59-76`, `src/remoteEnter.tsx:156-162`, `src/remoteEnter.tsx:200-200`, `src/remoteEnter.tsx:215-215`, `src/remoteEnter.tsx:237-237`).
- upstream/downstream repos:
  - Upstream: `adminMarketingAnalytics` remote.
  - Downstream: host products that need notification/email history and content group reporting.

- flow_id: `notification_conditions_advance_filters`
- role: Demonstrates conditional config retrieval from notification admin GraphQL and renders `@aftership/advance-filters` (`src/pages/NotificationPlatform/components/AdvanceFilters/index.tsx:1-83`).
- upstream/downstream repos:
  - Upstream: notification admin BFF GraphQL endpoint and `npm-aftership-advance-filters` package/repo candidate.
  - Downstream: Notification Platform UI examples and future host-side condition builders.

## Important Entrypoints
- path: `package.json`
- why it matters: Identifies project name/homepage, scripts for Vite docs vs Webpack MF builds, public-contract check, and the SDK/package dependency surface (`package.json:1-17`, `package.json:29-71`).

- path: `mf.config.js`
- why it matters: Authoritative Module Federation identity, exposes, remotes, environment CDN domains, and shared singleton packages (`mf.config.js:1-113`).

- path: `webpack.config.js`
- why it matters: Production MF build config: publicPath, CDN subdirectory, remote type plugin, silent auth callback asset, webpack dev-server port 8200 (`webpack.config.js:24-35`, `webpack.config.js:108-134`).

- path: `vite.config.ts`
- why it matters: Guide/docs build config: Vite dev port 9200, `aftershipNotification` alias to local facade, federation plugin, docs formatter, MF type downloader, copied generated docs and auth callback (`vite.config.ts:14-80`).

- path: `src/remoteEnter.tsx`
- why it matters: Public facade exported by the MF remote; all business-facing components/hooks/types pass through this file (`src/remoteEnter.tsx:1-246`).

- path: `src/remoteEnter.public-contract.ts`
- why it matters: Type-level fixture importing from `aftershipNotification` and asserting selected email content group public API/forbidden exports (`src/remoteEnter.public-contract.ts:1-46`).

- path: `scripts/check-public-contract.mjs`
- why it matters: Enforces explicit named facade exports, required email content group exports, forbidden internal exports, and preservation of `adminEmail/email` import (`scripts/check-public-contract.mjs:23-139`).

- path: `src/App.tsx`
- why it matters: Runtime provider stack for guide/demo app: AIO product code context, Algolia search, AntD, Shopify Polaris/i18n, product auth, billing provider, and marketing basic dependencies (`src/App.tsx:57-114`).

- path: `src/routes.tsx`
- why it matters: Guide site routing and examples, including `/settings/ens`, `/email-template-editor`, `/mosaic-flow`, `/advance-filters`, and mapped `NotificationsRoutes` from the facade (`src/routes.tsx:27-143`).

- path: `src/pages/Introduce/index.md`
- why it matters: Business context for Notification Platform, including Email Editor phase, Flow Platform phase, business scenario/content group/render concepts, and separate BE/FE/Admin portal resources (`src/pages/Introduce/index.md:1-128`).

- path: `src/pages/Integrate/index.md`
- why it matters: Host integration guide for MF remote setup, required shared packages, Webpack/Vite MF plugins, and MF type plugin strategy (`src/pages/Integrate/index.md:1-195`).

- path: `src/pages/EmailTemplateEditor/index.tsx`
- why it matters: Standalone email template editor window/page using facade exports, `businessScenarioType`, `ContentGroupFormik`, and postMessage contract with opener (`src/pages/EmailTemplateEditor/index.tsx:1-84`).

- path: `src/pages/NotificationPlatform/components/AdvanceFilters/index.tsx`
- why it matters: Concrete notification admin GraphQL runtime call and `@aftership/advance-filters` rendering path (`src/pages/NotificationPlatform/components/AdvanceFilters/index.tsx:1-83`).

- path: `src/pages/NotificationPlatform/components/MosaicFlow/index.tsx`
- why it matters: Uses `@aftership/mosaic-flow` demo component and CSS for Flow interaction demo (`src/pages/NotificationPlatform/components/MosaicFlow/index.tsx:1-7`).

- path: `plugins/moduleFederationTypes.ts`
- why it matters: Custom Vite plugin downloads each remote's `@mf-types.zip` into `node_modules/@types`, which affects local/CI type availability (`plugins/moduleFederationTypes.ts:5-25`).

## Evidence
- file_or_command: `README.md:3-16`
- finding: Project responsibility is explicitly twofold: Platform Notification guide website and unified export package for consumers.

- file_or_command: `README.md:56-64`
- finding: Feature list includes Module Federation support, MF types generation, component rendering, global doc search, generated docs menu, `aftershipNotification` package mapping, and demo generation.

- file_or_command: `mf.config.js:26-64`
- finding: Defines the `aio_notification` remote, `remoteEntry.js`, exposed `src/remoteEnter`, and nine remote aliases.

- file_or_command: `mf.config.js:65-113`
- finding: Defines shared singleton packages expected across host and remotes.

- file_or_command: `webpack.config.js:119-126`
- finding: Webpack MF build uses `ModuleFederationPlugin` and `ASModuleFederationTypeScriptRemotePlugin`.

- file_or_command: `vite.config.ts:37-43`
- finding: Vite docs build also loads federation config and the custom MF type downloader.

- file_or_command: `src/remoteEnter.tsx:1-124`
- finding: The public facade imports business APIs from `adminMarketingBilling`, `adminMarketingBasic`, `adminCrm`, `adminMarketingAnalytics`, `adminSms`, `adminEmail`, and `adminFlow`.

- file_or_command: `src/remoteEnter.tsx:164-246`
- finding: Exports `NotificationsRoutes`, providers, utilities, components, hooks, constants, and types for consumer import from `aftershipNotification`.

- file_or_command: `scripts/check-public-contract.mjs:74-109`
- finding: Public contract requires `useCreateEmailContentGroup`, `EmailContentGroupPreviewer`, content group result/types, and rejects internal email save helper exports.

- file_or_command: `src/pages/Introduce/index.md:1-10`
- finding: Notification Platform is documented as a one-stop notification platform with phase one unified Email Editor and phase two Flow Platform.

- file_or_command: `src/pages/Introduce/index.md:31-50`
- finding: Business concepts include Email Editor, Email Template, Content Variant, Content Group, Content Render, Business Scenario, and Merge Tags.

- file_or_command: `src/pages/Introduce/index.md:71-77`
- finding: BE SDK and Admin portal are separate resources; this repo is the FE Module Federation resource.

- file_or_command: `src/pages/Integrate/index.md:37-61`
- finding: Consumer hosts configure `aftershipNotification` to load `aio_notification@.../aio-notification/remoteEntry.js`.

- file_or_command: `src/pages/EmailTemplateEditor/index.tsx:1-84`
- finding: Standalone email template editor page uses facade exports and communicates readiness/save data via `window.opener.postMessage`.

- file_or_command: `src/pages/NotificationPlatform/components/AdvanceFilters/index.tsx:25-42`
- finding: Demo fetches `conditionalConfig` from notification admin GraphQL endpoint on `bff-api.automizely.io`.

- file_or_command: `git remote -v`
- finding: `origin` points to user's fork `Wynne-cwb/sdks.am-static.com_aio-notification.git`; `upstream` points to `AfterShip/sdks.am-static.com_aio-notification.git`.

- file_or_command: `git for-each-ref --format='%(refname:short)' refs/heads refs/remotes`
- finding: Candidate branch tracks exist: `master`, `master_v9`, `feat/flow-v3-polaris-v13`, and `feat/flow-v3`, including upstream refs for each.

- file_or_command: `git status --short --branch`
- finding: Current branch during research was `feat/affiliate-simple-editor` tracking `origin/feat/affiliate-simple-editor`.

## Open Questions
- question: Which exact repo owns the `adminMarketingAnalytics` remote?
- why it matters: `mf.config.js` proves remote alias `adminMarketingAnalytics` and CDN subdir `admin-marketing-analytics`, but the queue includes `sdks.am-static.com_admin-marketing-data`; map merge should wait for that repo's report to avoid a wrong repo edge.

- question: Which exact repo owns `aftershipBillingWidgets` / `aftership-billing-ui`?
- why it matters: This repo consumes `aftership_billing_ui@.../aftership-billing-ui/remoteEntry.v1.js`, but local queue evidence does not prove the source repo name.

- question: Which host product repos currently consume `aio_notification` in production?
- why it matters: This repo documents the host integration shape, but downstream consumers must be discovered in host repos before drawing complete flow edges.

- question: Do all lower-level notification remotes use the same active major branch (`feat/flow-v3-polaris-v13`)?
- why it matters: This repo has the active branch refs, but cross-repo branch alignment should be verified in `admin-email`, `admin-flow`, `admin-sms`, `admin-marketing-basic`, and related repo reports.

- question: Is `src/pages/NotificationPlatform/components/AdvanceFilters/index.tsx` a demo-only path or still a supported integration reference?
- why it matters: It calls the production-looking `bff-api.automizely.io/notification/admin/graphql` endpoint directly; downstream map should distinguish demo/example runtime calls from supported SDK APIs.
