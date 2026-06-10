# sdks.am-static.com_admin-marketing-data

## Summary
- project_id: sdks.am-static.com_admin-marketing-data
- repo_name: sdks.am-static.com_admin-marketing-data
- upstream_url: https://github.com/AfterShip/sdks.am-static.com_admin-marketing-data
- local_path: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-data
- repo_type: TypeScript/React marketing analytics SDK package plus Module Federation remote for notification/marketing analytics UI.
- confidence: high. Evidence includes git remotes/branches, `package.json`, MF config, SDK build config, GraphQL codegen endpoints, exported entrypoints, analytics pages/hooks, local consumer imports, and CI/deploy config.

## Responsibility
- Owns: npm package `@aftership/admin-marketing-data`; MF remote `notification_analytics`; marketing analytics UI/components/hooks for email analytics, email report, SMS report, popup/form analytics, contact dashboard, home overview, flow content-group report, notification history hooks, analytics constants/types, and report-navigation helpers. Evidence: `package.json:2`; `config/constants/domain.js:16-17`; `config/constants/mf.js:3-18`; `src/features/analytics/index.ts:1-5`; `src/hooks/index.ts:1-6`; `src/mfExports/analytics.ts:1-5`.
- Does not own: marketing/admin GraphQL backend schemas/resolvers, notification delivery services, email/SMS/flow editors, CRM/contact backend, billing engine, account/billing widgets, or host shell. Evidence: `codegen.yml:3-18` reads schemas from local marketing admin endpoints; runtime imports `notificationBasic/*`, `notificationBilling/billingV2`, `notificationEmail/email`, `aftershipBillingWidgets/*`, and `aftershipAccountsWidgets`; MF remotes point to notification basic/billing/email and AfterShip account/billing widgets.
- Common change areas: MF exposes/remotes, SDK exports, analytics pages under `src/features/analytics/**`, overview widgets under `src/features/overview/**`, report hooks under `src/hooks/**`, GraphQL documents under `src/graphql/**`, generated types, Vite/Webpack externals, data-retention copy/date helpers, and report export/permission gating.

## Branch Tracks
- production: `master` exists on `upstream`. Evidence: `git branch -r --list 'upstream/master' 'upstream/master_v9' 'upstream/feat/flow-v3' 'upstream/feat/flow-v3-polaris-v13'` returned `upstream/master`.
- legacy_v9: not found in targeted branch check. Evidence: the same targeted command returned no `upstream/master_v9`.
- active_major: `feat/flow-v3-polaris-v13` and `feat/flow-v3` both exist on `upstream`; per protocol, prefer `feat/flow-v3-polaris-v13` for active-major work. Evidence: targeted branch command returned both `upstream/feat/flow-v3` and `upstream/feat/flow-v3-polaris-v13`.
- repo_specific_notes: checkout is fork-first shaped: `origin` is `git@github.com:Wynne-cwb/sdks.am-static.com_admin-marketing-data.git`, `upstream` is `git@github.com:AfterShip/sdks.am-static.com_admin-marketing-data.git`. Current local branch is `feat/data-retention` at `dd57fdd`, with a clean worktree before report writing. Other upstream branches include `feat/aio-notification`, `feat/data-retention`, `feat/mf-v2`, `feat/polaris-upgrade-9`, release branches, `testing`, and `staging`.

## Module Federation
- enabled: yes. Evidence: `package.json:14-18` has example/MF/build/serve scripts; `config/webpack/webpack.module.federation.config.js:3-13` imports `ModuleFederationPlugin` and MF TypeScript plugin; `mf.config.js:74-79` defines remote config with `remoteEntry.js`.
- exposes: `.` -> `./src/mfExports/analytics.ts`; `./types` -> `./src/mfExports/typings.ts`; `./businessComponents` -> `./src/mfExports/businessComponents.ts`; `./basicComponents` -> `./src/mfExports/basicComponents.ts`; `./basicHooks` -> `./src/mfExports/basicHooks.ts`; `./commonUtils` -> `./src/mfExports/commonUtils.ts`; `./globalConstants` -> `./src/mfExports/globalConstants.ts`. Evidence: `config/constants/mf.js:3-11`.
- remotes: `aftershipBillingWidgets`, `notificationBilling`, `notificationBasic`, `notificationEmail`, `aftershipAccountsWidgets`. Evidence: `config/constants/mf.js:13-19`; `config/utils/path.js` maps these to `aftership-billing-ui/v2`, `notification-billing`, `notification-basic`, `notification-email`, and `accounts/v1`.
- shared_packages: singleton/shared MF packages include React, React DOM, AHA/AHA icons, `@aftership/meerkat-sdk`, `@aftership/automizely-product-auth`, React Router, `@aftership/automizely-frontend-dev-kit`, Formik, `@aftership/growth-components`, `@aftership/datacat`, Shopify app-bridge packages, `@shopify/react-i18n`, and Sentry in host config. Evidence: `mf.config.js:12-72` and `mf.config.js:79-145`.
- branch_alignment: MF URLs are environment/CDN based, not branch encoded. `DOMAIN_SUBDIRECTORY` is `notification-analytics`, MF name is `notification_analytics`, MF port is `8208`, and webpack outputs `remoteEntry.js` to `build` with chunk global `notification-analytics_mf`. Evidence: `config/constants/domain.js:1-17`; `config/webpack/webpack.module.federation.config.js:17-46`; `config/scripts/upload-assets.js:38-85`.

## Team Repo Dependencies
- Direct dependencies: package depends on React/AHA/charting/GraphQL libraries; dev/peer/external contracts include `@aftership/admin-marketing-basic`, `@aftership/admin-marketing-billing`, `@aftership/automizely-frontend-dev-kit`, `@aftership/automizely-product-auth`, `@aftership/datacat`, `@aftership/growth-components`, `@aftership/meerkat-sdk`, and MF TypeScript tooling. Evidence: `package.json:46-80`, `package.json:156-189`.
- Runtime calls: generated GraphQL hooks call marketing admin v1 as `default` and v2 as `v2`; operations cover features/billing, current org, stores, CRM/contact stats, email/newsletters/email stats/export, flow list/content groups/content-group stats, popup stats, SMS newsletter/report stats, and notification history. Evidence: `codegen.yml:3-18`; `devkit.config.js:1-15`; `src/generated/graphql.ts:20970-21178`; `src/generated/graphqlV2.ts:10170-10267`.
- Build-time dependencies: webpack MF build uses `@module-federation/enhanced` and `@aftership/module-federation-typescript`; SDK build uses Vite, `vite-plugin-dts`, and `vite-plugin-svgr`; codegen uses GraphQL Code Generator and `am-kit-hooks-codegen`; asset upload uses `@aftership/deploy-frontend-assets`. Evidence: `package.json:14-33`; `vite.config.ts:13-35`; `config/webpack/webpack.module.federation.config.js:38-46`; `config/scripts/upload-assets.js:3-8`.
- Shared packages: Vite externalizes `@aftership/admin-marketing-billing`, `@aftership/admin-marketing-basic`, `notificationBilling/*`, `notificationBasic/*`, `notificationEmail/*`, `aftershipBillingWidgets/*`, and `aftershipAccountsWidgets/*`, keeping these supplied by host/MF consumers. Evidence: `vite.config.ts:36-58`.
- Inferred but unconfirmed: `notificationBasic` likely maps to repo `sdks.am-static.com_admin-marketing-basic`, `notificationBilling` to `sdks.am-static.com_admin-marketing-billing`, `notificationEmail` to `sdks.am-static.com_admin-email`, and `adminMarketingAnalytics`/`notificationAnalytics` are consumer aliases for this repo. This report did not inspect every owner repo in depth; evidence is package names, MF remote names, Vite externals, and local cross-repo import hits.

## Business Flows
- flow_id: marketing-analytics-sdk
- role: Provides reusable analytics SDK/MF surfaces for dashboards, reports, hooks, constants, utilities, and typings. Evidence: `src/mfExports/analytics.ts:1-5`; `src/index.ts:1-6`; `src/features/analytics/index.ts:1-5`; `src/hooks/index.ts:1-6`.
- upstream/downstream repos: consumed locally by `sdks.am-static.com_admin-flow`, `sdks.am-static.com_admin-sms`, `aio-notification`, `marketing.automizely.com`, `marketing-popup-export-time-filter`, and host/type tooling. Evidence: local `rg "admin-marketing-data|adminMarketingAnalytics|notificationAnalytics|notification_analytics"` under `/Users/wb.chen/Documents/AfterShip`.

- flow_id: email-analytics-dashboard
- role: Renders "Email analytics" with filters for all/newsletter/flow/legacy automation, fetches v2 `emailPerformanceStatsData` and `emailRvnStatsData`, and displays overview/performance/orders revenue charts. Evidence: `src/features/analytics/email/EmailDashboard/index.tsx:14-22`, `src/features/analytics/email/EmailDashboard/index.tsx:96-166`, `src/features/analytics/email/EmailDashboard/index.tsx:210-230`; filter data comes from `flowList` and `newsletters` in `src/features/analytics/email/EmailDashboard/hooks/useGetFilterChoiceList.ts:20-128`.
- upstream/downstream repos: upstream marketing admin v1/v2 GraphQL; runtime billing gates from `notificationBilling/billingV2`; shell/page utilities from `notificationBasic/effectComponents` and `notificationBasic/commonUtils`; downstream email/marketing hosts can import `EmailDashboard`.

- flow_id: email-report-export
- role: Renders email report pages from router state, fetches per-contact event details/overview, checks export-task status, and creates email report export jobs. Evidence: `src/features/analytics/email/EmailReport/index.tsx:1-81`; `src/hooks/useGetEmailReportData.ts:1-308`; `src/hooks/useExportReport.ts:57-82` and `src/hooks/useExportReport.ts:119-147`.
- upstream/downstream repos: upstream marketing admin v1 GraphQL (`contactEmailStatsData`, `bizIdEmailStatsDataOverview`, `contentEmailStatsDataOverview`, `experimentEmailStatsDataOverview`, `createEmailReportExportJob`); `notificationEmail/email` is used for `EmailType` typing in `src/typings/features/analytics/ReportPage.ts:1-80`.

- flow_id: sms-report
- role: Renders SMS report pages from router state, fetches SMS campaign overview and contact report data, and shares the generic report table/export shell. Evidence: `src/features/analytics/sms/SMSReport/index.tsx:1-89`; `src/hooks/useGetSMSReportData.ts:1-162`; SMS GraphQL documents include newsletter detail and report mutations in `src/graphql/v1/queries/sms/getSMSNewsletterDetail.graphql:1-91` and `src/graphql/v1/mutation/sms/reportOfContactList.graphql`.
- upstream/downstream repos: upstream marketing admin v1 GraphQL; downstream `sdks.am-static.com_admin-sms` imports `SMSOverview`, `usePushReport`, and `SMSReportSheet` from this repo.

- flow_id: flow-content-group-report
- role: Provides flow action/content-group report pages. It accepts `flow_id` and content-group params from router state, fetches `flowContentGroups`, maps action content groups by `message_channel`, loads variants, fetches stats/details/unsubscribe details, and exports flow reports. Evidence: `src/features/analytics/message/ContentGroupReport/index.tsx:1-157`; `src/hooks/useGetContentGroupReportState.ts:16-99`; `src/hooks/useGetContentGroupReportData.ts:1-318`; `src/hooks/useExportReport.ts:84-87` and `src/hooks/useExportReport.ts:151-178`.
- upstream/downstream repos: upstream marketing admin v2 GraphQL; downstream `sdks.am-static.com_admin-flow` imports `usePushContentGroupReport` and `ContentGroupReportPageLocationState`, while `aio-notification` imports `ContentGroupReport` and basic hooks.

- flow_id: notification-history
- role: Exposes `useNotificationHistory` hook and typed notification history list/detail data for notification events, email/SMS/messenger/webhook events, tracking IDs, trigger event type, fulfillment status, bounce/cancel/test fields, and message business type. Evidence: `src/hooks/useNotificationHistory.ts:1-24`; `src/graphql/v2/queries/notificationHistory.graphql:1-85`.
- upstream/downstream repos: upstream marketing admin v2 GraphQL; downstream notification/admin hosts can consume the hook/type surface via `basicHooks`/SDK exports.

- flow_id: crm-contact-analytics
- role: Renders contacts dashboard, segment filter, top locations, predicted age/gender, spend range, order count, summary banner, and top-location detail page with billing/feature gates. Evidence: `src/features/analytics/contact/Dashboard/index.tsx:1-155`; `src/features/analytics/contact/DashboardDetail/index.tsx:1-76`; CRM GraphQL docs include `contactList`, `segmentList`, `contactStatistics`, and `contactLocation` in `src/graphql/v1/queries/crm/*.graphql`.
- upstream/downstream repos: upstream marketing admin v1 GraphQL and billing feature availability; downstream CRM/marketing hosts import `ContactDashboard`/`ContactDashboardDetail` through business components.

- flow_id: popup-form-analytics
- role: Provides popup/form analytics dashboard and overview data, including popup list, conversion chart, subscribers, top campaigns, add-to-cart table, and store popup overview. Evidence: `src/features/analytics/index.ts:3`; popup GraphQL docs under `src/graphql/v1/queries/popup/**`, including `src/graphql/v1/queries/popup/getPopups.graphql` and `src/graphql/v1/queries/popup/statsData/getStorePopupStatsDataOverview.graphql`; home overview consumes popup totals in `src/features/overview/HomeOverview/index.tsx:83-109`.
- upstream/downstream repos: upstream marketing admin v1 GraphQL; downstream marketing host(s) such as `marketing.automizely.com` and `marketing-popup-export-time-filter` configure `notification_analytics` remotes locally.

- flow_id: marketing-home-overview
- role: Provides aggregate home overview cards for total contacts, revenue, form views, and email sent, with route handoff callbacks and gtag events. Evidence: `src/features/overview/HomeOverview/index.tsx:9-18`, `src/features/overview/HomeOverview/index.tsx:39-109`, `src/features/overview/HomeOverview/index.tsx:111-187`.
- upstream/downstream repos: upstream marketing admin v1 GraphQL for contact, revenue, email, and popup stats; downstream host passes route configs for contacts/email/popup pages.

## Important Entrypoints
- path: `src/index.ts`
- why it matters: SDK package entrypoint for non-MF consumers; re-exports basic components, business components, hooks, constants, utils, and typings.

- path: `src/mfExports/analytics.ts`
- why it matters: Default MF expose `.`; aggregates components, constants, features, hooks, and utils.

- path: `src/mfExports/businessComponents.ts`
- why it matters: Public business-component surface for analytics pages such as email, SMS, popup, contacts, and content-group report.

- path: `src/mfExports/basicHooks.ts`
- why it matters: Public hook surface, including report navigation helpers, email data hooks, store helpers, and notification history.

- path: `src/features/analytics/index.ts`
- why it matters: Authoritative exported analytics pages: `EmailDashboard`, `EmailReport`, `SMSReport`, `PopupDashboard`, `ContactDashboard`, `ContactDashboardDetail`, and `ContentGroupReport`.

- path: `src/features/overview/index.ts`
- why it matters: Exports home/email/popup/SMS overview widgets used by host pages.

- path: `src/hooks/usePushReport.ts`
- why it matters: Shared router-state handoff for email/SMS report pages.

- path: `src/hooks/usePushContentGroupReport.ts`
- why it matters: Shared router-state handoff for flow content-group reports.

- path: `src/hooks/useNotificationHistory.ts`
- why it matters: Public hook wrapper for v2 notification history list/detail queries.

- path: `src/graphql/**`
- why it matters: Local operation set that defines this repo's runtime API contract against marketing admin GraphQL v1/v2.

- path: `config/constants/mf.js`
- why it matters: Source of MF exposes/remotes.

- path: `mf.config.js`
- why it matters: Remote/host MF shared dependency contract.

- path: `config/constants/domain.js`
- why it matters: Defines MF name, dev/example ports, CDN domains, and CDN subdirectory.

- path: `config/webpack/webpack.module.federation.config.js`
- why it matters: Builds/publishes the MF remote entry to `build/remoteEntry.js`.

- path: `vite.config.ts`
- why it matters: Builds the SDK library to `lib` and externalizes host/MF dependencies.

- path: `codegen.yml` and `devkit.config.js`
- why it matters: Defines GraphQL schema endpoints and generated-hook document keys (`default`, `v2`).

- path: `Jenkinsfile`
- why it matters: CI/deploy identity for this frontend SDK repo and pre-publish build path.

## Evidence
- file_or_command: `git remote -v`
- finding: `origin` points to `git@github.com:Wynne-cwb/sdks.am-static.com_admin-marketing-data.git`; `upstream` points to `git@github.com:AfterShip/sdks.am-static.com_admin-marketing-data.git`.

- file_or_command: `git branch -r --list 'upstream/master' 'upstream/master_v9' 'upstream/feat/flow-v3' 'upstream/feat/flow-v3-polaris-v13'`
- finding: `upstream/master`, `upstream/feat/flow-v3`, and `upstream/feat/flow-v3-polaris-v13` exist; `upstream/master_v9` was absent.

- file_or_command: `git rev-parse --abbrev-ref HEAD`; `git log -1 --oneline --decorate`; `git status --short`
- finding: checkout was on `feat/data-retention`; latest local HEAD was `dd57fdd` on `feat/data-retention`; `git status --short` had no output before the report write.

- file_or_command: `README.md:1-6`
- finding: repo describes itself as "Automizely Marketing Analytics" and says it provides components with logic for processing data from the data team.

- file_or_command: `package.json:2-33`
- finding: package is `@aftership/admin-marketing-data` version `1.2.0`, with SDK outputs under `lib`, MF/webpack scripts, Vite SDK build, GraphQL codegen, tests, typecheck, and prepublish build.

- file_or_command: `package.json:156-189`
- finding: externals/peer dependencies identify admin marketing basic/billing, datacat, product auth, dev-kit, growth components, meerkat, React, Router, Redux, and Formik as host/consumer-supplied contracts.

- file_or_command: `config/constants/domain.js:1-17`
- finding: example port is `9208`, MF port is `8208`, CDN subdirectory is `notification-analytics`, and MF name is `notification_analytics`.

- file_or_command: `config/constants/mf.js:3-19`
- finding: MF exposes default/types/business/basic hooks/components/constants/utils and consumes billing/basic/email/account widget remotes.

- file_or_command: `mf.config.js:74-149`
- finding: remote config emits `remoteEntry.js`, uses `MF_EXPORTS`/`MF_REMOTES`, and shares host-provided singleton packages.

- file_or_command: `config/webpack/webpack.module.federation.config.js:17-46`
- finding: MF dev server uses port `8208`, entry is `src/index`, output goes to `build`, public path uses `notification-analytics`, and `ModuleFederationPlugin` uses remote config.

- file_or_command: `vite.config.ts:23-58`
- finding: SDK build outputs `lib/index.es.js` and `lib/index.cjs.js`; externalizes core AfterShip packages and MF aliases including `notificationBilling`, `notificationBasic`, `notificationEmail`, billing widgets, and account widgets.

- file_or_command: `codegen.yml:3-18`; `devkit.config.js:1-15`
- finding: v1 generated hooks use schema `http://localhost:9003/marketing/admin/graphql` and key `default`; v2 generated hooks use schema `http://localhost:9006/marketing/admin/v2/graphql` and key `v2`.

- file_or_command: `src/generated/graphql.ts:20970-21178`; `src/generated/graphqlV2.ts:10170-10267`
- finding: generated hooks call `useQuery`/`useLazyRequest` with `default` or `v2`, confirming runtime GraphQL channel split.

- file_or_command: `src/features/analytics/index.ts:1-5`
- finding: exported business pages are email dashboard/report, SMS report, popup dashboard, contact dashboard/detail, and content-group report.

- file_or_command: `src/features/analytics/email/EmailDashboard/index.tsx:96-166`
- finding: email dashboard fetches v2 performance/revenue stats and builds input filters from selected biz IDs/types/subtypes.

- file_or_command: `src/features/analytics/email/EmailDashboard/hooks/useGetFilterChoiceList.ts:45-128`
- finding: email analytics filter is gated by billing feature slugs, fetches `flowList` when Flow is available, otherwise falls back to legacy automation choices; newsletter choices come from `newsletters`.

- file_or_command: `src/graphql/v1/queries/flow/getFlowList.graphql:1-28`
- finding: flow list query returns flow IDs, names, status, scenario, trigger type, and template migration metadata.

- file_or_command: `src/graphql/v1/queries/email/getNewsletters.graphql:1-130`
- finding: newsletter query returns email IDs, subjects/template names, mktgmsg content IDs, business settings, follow-up emails, stats, and metrics.

- file_or_command: `src/features/analytics/message/ContentGroupReport/index.tsx:122-157`; `src/hooks/useGetContentGroupReportState.ts:16-99`
- finding: content-group report consumes router state with `flow_id`, fetches flow content groups, filters by message channel, and builds report sheets with variant IDs and metric limits.

- file_or_command: `src/graphql/v2/queries/getFlowContentGroups.graphql:1-8`; `src/graphql/v2/queries/getContentGroupStatsData.graphql:1-12`
- finding: v2 flow report APIs expose flow content groups and email/SMS action stats.

- file_or_command: `src/hooks/useNotificationHistory.ts:1-24`; `src/graphql/v2/queries/notificationHistory.graphql:1-85`
- finding: repo exposes notification history list/detail hooks and types for notification events across email/SMS/messenger/webhook/tracking fields.

- file_or_command: `src/features/analytics/contact/Dashboard/index.tsx:52-71`
- finding: contact dashboard is feature-gated via billing feature slugs and `features` query; it renders contact analytics charts and summary when available.

- file_or_command: `src/graphql/v1/queries/crm/getSegmentList.graphql:1-29`
- finding: CRM relation is via segment/contact GraphQL data including filters, contacts count, and average spend.

- file_or_command: `src/features/overview/HomeOverview/index.tsx:51-109`
- finding: home overview fetches total contacts, store revenue, store email stats, and store popup stats.

- file_or_command: `src/features/analytics/common/ReportPage/index.tsx:47-63` and `src/features/analytics/common/ReportPage/index.tsx:154-245`
- finding: generic report page gates export by billing feature and RBAC (`aftership/notifications/flow/report`), renders tabs/table, and handles export modal success/errors.

- file_or_command: `src/hooks/useExportReport.ts:57-87` and `src/hooks/useExportReport.ts:119-178`
- finding: email exports call v1 `createEmailReportExportJob`; content-group/SMS path calls v2 `exportFlowReport`.

- file_or_command: local `rg "admin-marketing-data|adminMarketingAnalytics|notificationAnalytics|notification_analytics"` under `/Users/wb.chen/Documents/AfterShip`
- finding: local consumers include `sdks.am-static.com_admin-flow`, `sdks.am-static.com_admin-sms`, `sdks.am-static.com_admin-email` build externals, `aio-notification`, `marketing.automizely.com`, `marketing-popup-export-time-filter`, `admin.aftership.com` dummy types/dashboard naming, and `fe-pltf-ens-admin` documentation.

- file_or_command: `Jenkinsfile:1-23`
- finding: CI identifies frontend app/repo as `sdks.am-static.com_admin-marketing-data`, uses Node 16.16.0 essential image, has staging/production environments, and pre-publishes with `yarn build:sdk`.

- file_or_command: `config/scripts/upload-assets.js:38-85`
- finding: assets upload to environment buckets under `/${DOMAIN_SUBDIRECTORY}` and set no-cache for `remoteEntry.js` and federation helper files.

## Open Questions
- question: Which backend repo owns `http://localhost:9003/marketing/admin/graphql` and `http://localhost:9006/marketing/admin/v2/graphql` schemas/resolvers for analytics, CRM, flow content groups, exports, and notification history?
- why it matters: This repo owns frontend documents/hooks and UI logic, but backend ownership is not confirmed from this checkout alone.

- question: Which host repo is the canonical production consumer for `notification_analytics` versus alias names `adminMarketingAnalytics` and `notificationAnalytics`?
- why it matters: Local evidence shows multiple consumers/aliases, but the authoritative host routing and rollout ownership need confirmation before changing MF contract names or exposed paths.

- question: Is `feat/data-retention` still an active repo-specific work track, or only a temporary branch?
- why it matters: Checkout is currently on `feat/data-retention`, but protocol active-major branch resolves to `feat/flow-v3-polaris-v13`; task base branch should be selected deliberately for future edits.
