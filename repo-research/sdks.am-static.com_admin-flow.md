# sdks.am-static.com_admin-flow

## Summary
- project_id: sdks.am-static.com_admin-flow
- repo_name: sdks.am-static.com_admin-flow
- upstream_url: https://github.com/AfterShip/sdks.am-static.com_admin-flow
- local_path: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow
- repo_type: TypeScript/React frontend SDK package plus Module Federation remote for Admin Flow UI.
- confidence: high. Evidence includes git remotes/branches, `package.json`, Module Federation config, Vite SDK build config, exported entrypoints, GraphQL operations, and flow/email/SMS/webhook UI source.

## Responsibility
- Owns: Admin Flow frontend SDK package `@aftership/admin-flow`; MF remote `admin_flow`; Flow list, Flow template picker, Flow editor, subscriber-flow component, flow action rendering, and local GraphQL operation documents for flow/content/webhook interactions. Evidence: `package.json` name/main/module/types/scripts; `config/constants/mf.js` exposes `./businessPage`, `./commonComponents`, `./basicHooks`; `src/mfExports/businessPage.ts`; `src/features/FlowList/index.tsx`; `src/features/FlowEditor/index.tsx`; `src/features/FlowTemplate/index.tsx`; `src/components/Subscriber/SubscriberFlows/index.tsx`.
- Does not own: backend GraphQL service/schema, email content editor, SMS content editor/phone-number/compliance services, billing system, platform sender-email widgets, or host shell runtime. Evidence: `codegen.yml` reads schema from `http://localhost:9006/marketing/admin/v2/graphql`; `src/hooks/useRouterContentEditor.ts` routes to `/ens/email-variant/editor` and `/ens/sms-variant/editor`; imports from `adminEmail/email`, `adminSms/*`, `adminMarketingBilling/billingV2`, `aftershipBillingWidgets/*`, `aftershipPlatformWidgets/*`, and `@aftership/admin-host-runtime`.
- Common change areas: MF exports/config, flow feature pages, action components, GraphQL documents/generated types, email/SMS/webhook handoff logic, SDK alias/external config, CDN/static asset upload config. Evidence: `mf.config.js`; `config/webpack/webpack.module.federation.config.js`; `vite.config.ts`; `src/config/index.ts`; `src/graphql/**`; `config/scripts/upload-assets.js`.

## Branch Tracks
- production: `master` exists locally and on both `origin` and `upstream`. Evidence: `git branch -a --list "*master"` returned `master`, `remotes/origin/master`, `remotes/upstream/master`.
- legacy_v9: not found in this checkout. Evidence: `git branch -a --list "*master_v9*"` returned no matches.
- active_major: `feat/flow-v3` exists locally and on both `origin` and `upstream`; `feat/flow-v3-polaris-v13` was not found. Evidence: `git branch -a --list "*feat/flow-v3*"` returned `feat/flow-v3`, `remotes/origin/feat/flow-v3`, `remotes/upstream/feat/flow-v3`; `git branch -a --list "*feat/flow-v3-polaris-v13*"` returned no matches.
- repo_specific_notes: checkout is fork-first shaped: `origin` points to `git@github.com:Wynne-cwb/sdks.am-static.com_admin-flow.git`, `upstream` points to `git@github.com:AfterShip/sdks.am-static.com_admin-flow.git`. Other upstream branches include `staging`, `testing`, `publish`, `release/*`, `feat/mf-host`, and `feat/mf-v2`, but the protocol's active major branch resolves to `feat/flow-v3` for this repo.

## Module Federation
- enabled: yes. Evidence: `package.json` has `mf`, `build`, and `serve` scripts using `config/webpack/webpack.module.federation.config.js`; that webpack config uses `@module-federation/enhanced/webpack` `ModuleFederationPlugin`; `mf.config.js` defines remote and host config.
- exposes: `./businessPage -> ./src/mfExports/businessPage.ts`, `./commonComponents -> ./src/mfExports/commonComponents.ts`, `./basicHooks -> ./src/mfExports/basicHooks.ts`. Business exports are `FlowList`, `FlowEditor`, `FlowTemplates`; common export is `SubscriberFlows`; hooks export `useGetSubscriberTriggers` and `useGetFlows`. Evidence: `config/constants/mf.js`; `src/mfExports/*.ts`.
- remotes: `aftershipBillingWidgets`, `adminMarketingBilling`, `adminMarketingBasic`, `adminSms`, `adminMarketingAnalytics`, `adminEmail`, `aftershipPlatformWidgets`. Evidence: `config/constants/mf.js`.
- shared_packages: singleton React ecosystem plus `formik`, Polaris, `@aftership/meerkat-sdk`, `@aftership/automizely-product-auth`, `@aftership/automizely-frontend-dev-kit`, `@aftership/growth-components`, `@aftership/emailcat`, `@aftership/datacat`, `@shopify/react-i18n`, `react-i18next`, `i18next`. Evidence: `mf.config.js`.
- branch_alignment: MF URLs are environment/CDN based, not branch encoded. `config/utils/path.js` maps `APP_ENV` to `sdks.am-static.io`, `staging-sdks.am-static.com`, `sdks.am-static.com`, or release domains; `DOMAIN_SUBDIRECTORY` is `admin-flow`, port is `8210`, remote filename is `remoteEntry.js`. For active major work, align this repo to `feat/flow-v3` because the higher-priority `feat/flow-v3-polaris-v13` branch is absent.

## Team Repo Dependencies
- Direct dependencies: package dependencies include `@aftership/admin-host-runtime`, `@aftership/am-filters`, `@aftership/datacat`, `@aftership/lego`, `@aftership/material-ui-react`, `@aftership/meerkat-sdk`; dev/peer dependencies include `@aftership/admin-email`, `@aftership/admin-marketing-basic`, `@aftership/admin-marketing-billing`, `@aftership/admin-marketing-data`, `@aftership/admin-sms`, `@aftership/billing-ui-react`, `@aftership/emailcat`, `@aftership/growth-components`, `@aftership/automizely-frontend-dev-kit`, `@aftership/automizely-product-auth`. Evidence: `package.json`.
- Runtime calls: GraphQL operations target marketing admin v2 via generated hooks; flow operations include `flowList`, `flow`, `flowTemplates`, `saveFlow`, `updateFlowStatus`, `duplicateFlow`, `deleteFlow`, `renameFlow`, `updateFlowBookmark`; message operations include content groups/variants/risk review; webhook operations include create/update/test/get HTTP request and OAuth settings. Evidence: `codegen.yml`; `src/graphql/**/*.graphql`; `src/generated/graphql.ts`.
- Build-time dependencies: webpack MF build uses `@module-federation/enhanced` and `@aftership/module-federation-typescript`; SDK build uses Vite, `vite-plugin-dts`, and `vite-plugin-svgr`; codegen uses GraphQL Code Generator and `am-kit-hooks-codegen`; asset upload uses `@aftership/deploy-frontend-assets`. Evidence: `package.json`; `config/webpack/webpack.module.federation.config.js`; `vite.config.ts`; `codegen.yml`; `config/scripts/upload-assets.js`.
- Shared packages: MF shared config and Vite externals share React, React Router, React Redux, Formik, Polaris, `adminMarketingBasic`, `adminMarketingBilling`, `adminMarketingData`, `adminEmail`, `adminSms`, billing widgets, platform widgets, datacat, and emailcat. Evidence: `mf.config.js`; `vite.config.ts`; `package.json` `externals` and `peerDependencies`.
- Inferred but unconfirmed: package names map to likely team repos such as `admin-email`, `admin-sms`, `admin-marketing-basic`, `admin-marketing-billing`, `admin-marketing-data`, `billing-ui-react`, and `platform-widgets`, but this report did not inspect those repos. Evidence here is limited to package names, MF remote names, Vite aliases, and import paths in this repo.

## Business Flows
- flow_id: notification-flow / `/ens/flows`
- role: Owns the frontend list and management UI for user-manual notification flows; fetches `flowList` with `DslManagementEnum.UserManual`, `InitFlowsKeyEnum.Flows`, and shipment-status categories; shows notification upgrade onboarding, billing gates, SMS phone-number banners, and routes to flow templates/editor. Evidence: `src/features/FlowList/index.tsx`; `src/constants/flow.ts`; `src/graphql/queries/Flow/getFlowList.graphql`.
- upstream/downstream repos: depends on marketing GraphQL backend, `adminMarketingBasic`, `adminMarketingBilling`, `aftershipBillingWidgets`, `adminSms`, and `@aftership/datacat`.

- flow_id: flow-template / `/ens/flow-templates`
- role: Owns template browsing and create-from-scratch UI; fetches template groups, transforms templates through `useMessageResourceStore`, and routes to `/ens/flow-editor?template_id=...`. Evidence: `src/features/FlowTemplate/index.tsx`; `src/components/Template/FlowTemplateMain/index.tsx`; `src/components/Template/FlowScratchTemplateModal/index.tsx`; `src/graphql/queries/Flow/getFlowTemplateGroup.graphql`.
- upstream/downstream repos: marketing GraphQL backend plus `adminMarketingBasic` for page shell/resource store and billing remote for template feature gating.

- flow_id: flow-editor / `/ens/flow-editor`
- role: Owns flow canvas/editor shell and action registry; loads existing or template flow by `flow_id`/`template_id`, renders actions through `@aftership/lego`, validates SMS/enable warnings, saves via `saveFlow`, and routes back to `/ens/flows`. Evidence: `src/features/FlowEditor/index.tsx`; `src/hooks/useGetFlowEditorData.ts`; `src/hooks/useSaveFlow.ts`; `src/config/index.ts`; `src/graphql/mutations/saveFlow.graphql`.
- upstream/downstream repos: marketing GraphQL backend, `@aftership/lego`, billing widgets, `adminMarketingBasic`, `adminMarketingBilling`, `adminSms`, `adminEmail`.

- flow_id: email-action-content
- role: Owns email action node integration inside flow; selects email templates, previews email content, tracks content group/variant/risk review, and hands editing to `/ens/email-variant/editor`. Evidence: `src/components/Action/Actions/SendEmailToCustomer.tsx`; `src/components/Action/Actions/SendEmailToMember.tsx`; `src/components/Editor/SendEmailModal/index.tsx`; `src/hooks/useRouterContentEditor.ts`.
- upstream/downstream repos: `adminEmail/email` owns email editor/templates/previewer/content-group helpers; marketing GraphQL backend owns flow/content data.

- flow_id: sms-action-content
- role: Owns SMS action node integration inside flow; resolves SMS action template, may create content from template, tracks content group/variant/risk review, checks SMS phone-number/compliance state, and hands editing to `/ens/sms-variant/editor`. Evidence: `src/components/Action/Actions/SendSMSToCustomer.tsx`; `src/components/Action/Actions/SendSMSToMember.tsx`; `src/hooks/useGetSMSActionTemplate.ts`; `src/hooks/useRouterContentEditor.ts`; `src/features/FlowEditor/index.tsx`.
- upstream/downstream repos: `adminSms` owns SMS editor/templates/phone-number/compliance components; marketing GraphQL backend owns content/flow data.

- flow_id: subscriber-flows
- role: Exposes `SubscriberFlows` for system-automated subscriber flows; filters flows by email or SMS action, checks RBAC, updates flow status, and uses subscriber category/template data. Evidence: `src/mfExports/commonComponents.ts`; `src/components/Subscriber/SubscriberFlows/index.tsx`; `src/hooks/useGetSubscriberTriggers.ts`.
- upstream/downstream repos: consumers import this repo's common component; runtime depends on marketing GraphQL backend, `adminMarketingBasic`, `adminSms`, and billing feature slugs.

- flow_id: webhook-action
- role: Owns HTTP request action UI inside flow; create/update/test/get request settings and OAuth settings, then writes `http_request_action_id` back into action args. Evidence: `src/components/Action/Actions/Webhook.tsx`; `src/components/Editor/WebhookModal/index.tsx`; `src/graphql/mutations/webhook/*.graphql`; `src/graphql/queries/Webhook/getHttpRequest.graphql`.
- upstream/downstream repos: marketing GraphQL backend owns webhook request persistence/testing; this repo owns the node/modal UI.

## Important Entrypoints
- path: `src/index.ts`
- why it matters: SDK package entrypoint re-exports MF business pages, common components, hooks, constants, and typings.

- path: `src/mfExports/businessPage.ts`
- why it matters: Public business-page surface: `FlowList`, `FlowEditor`, `FlowTemplates`.

- path: `src/mfExports/commonComponents.ts`
- why it matters: Public reusable component surface: `SubscriberFlows`.

- path: `src/mfExports/basicHooks.ts`
- why it matters: Public hooks: `useGetSubscriberTriggers`, `useGetFlows`.

- path: `config/constants/mf.js`
- why it matters: Source of MF exposes/remotes.

- path: `mf.config.js`
- why it matters: Host/remote MF shared dependency contract.

- path: `config/webpack/webpack.module.federation.config.js`
- why it matters: Builds the MF remote entry into `build/` with `remoteEntry.js`.

- path: `vite.config.ts`
- why it matters: Builds the distributable SDK package in `lib/` and maps MF aliases to npm packages/external remotes.

- path: `src/features/FlowList/index.tsx`
- why it matters: Main `/ens/flows` page and notification/SMS/billing onboarding surface.

- path: `src/features/FlowEditor/index.tsx`
- why it matters: Main flow editor and save/cancel/validation orchestration.

- path: `src/config/index.ts`
- why it matters: Maps generated action identities to Lego node components for trigger, split, delay, email, SMS, status unchanged, and webhook actions.

- path: `src/hooks/useRouterContentEditor.ts`
- why it matters: Handoff bridge from flow action nodes to email/SMS content editors through session storage and route navigation.

- path: `src/graphql/**`
- why it matters: Local GraphQL operation set for flow, content group/variant, email/SMS templates, billing, OAuth, webhook, members, product, migration, and dynamic schema.

## Evidence
- file_or_command: `git remote -v`
- finding: `origin` is `git@github.com:Wynne-cwb/sdks.am-static.com_admin-flow.git`; `upstream` is `git@github.com:AfterShip/sdks.am-static.com_admin-flow.git`.

- file_or_command: `git branch -a --list`
- finding: `master` and `feat/flow-v3` exist locally and remotely; no `master_v9` or `feat/flow-v3-polaris-v13` branch was found in targeted branch checks.

- file_or_command: `package.json`
- finding: package is `@aftership/admin-flow`, outputs `lib/index.cjs.js`, `lib/index.es.js`, and `lib/index.d.ts`; scripts include MF build/serve and SDK build; externals/peer dependencies name admin-email/admin-sms/admin-marketing packages.

- file_or_command: `config/constants/mf.js`
- finding: MF exposes `businessPage`, `commonComponents`, `basicHooks`; remotes include billing widgets, marketing billing/basic/analytics, SMS, Email, and platform widgets.

- file_or_command: `mf.config.js`
- finding: remote config emits `remoteEntry.js`; shared singleton packages include React, Router, Redux, Formik, Polaris, emailcat, datacat, and AfterShip SDK/runtime packages.

- file_or_command: `config/constants/domain.js`
- finding: MF port is `8210`, domain subdirectory is `admin-flow`, federation name is `admin_flow`, and production/testing/staging/release CDN domains are defined.

- file_or_command: `config/utils/path.js`
- finding: remote URLs are derived from `APP_ENV` and CDN domain/subdirectory rather than branch names.

- file_or_command: `config/webpack/webpack.module.federation.config.js`
- finding: `ModuleFederationPlugin` uses remote config and TypeScript remote plugin; output path is `build`, chunk global is `admin-flow_mf`.

- file_or_command: `vite.config.ts`
- finding: SDK build aliases MF imports to npm packages and externals, including admin-email/admin-sms/admin-marketing/admin-crm/platform-widgets; library output goes to `lib`.

- file_or_command: `codegen.yml`
- finding: generated GraphQL types/hooks come from `http://localhost:9006/marketing/admin/v2/graphql` and documents under `src/graphql/**/*.graphql`.

- file_or_command: `src/mfExports/*.ts`
- finding: public exported surfaces are Flow pages, SubscriberFlows component, basic flow/subscriber hooks, constants, and GraphQL typings.

- file_or_command: `src/features/FlowList/index.tsx`
- finding: user-manual flow list uses `flowList`, `flowTemplates`, billing feature checks, SMS phone-number hooks, notification upgrade onboarding storage, and routes to `/ens/flow-templates`.

- file_or_command: `src/features/FlowEditor/index.tsx`
- finding: editor uses Formik, Lego, generated GraphQL flow data, SMS verification, notification onboarding events, and `useSaveFlow`.

- file_or_command: `src/config/index.ts`
- finding: action identity map includes trigger, conditional split, trigger split, random split, time delay, status unchanged, send email to customer/member, send SMS to customer/member, and HTTP request.

- file_or_command: `src/hooks/useRouterContentEditor.ts`
- finding: email and SMS action edits are routed to `/ens/email-variant/editor` and `/ens/sms-variant/editor`, with flow/action params cached in session storage.

- file_or_command: `src/components/Editor/SendEmailModal/index.tsx`
- finding: email template selection and preview depend on `adminEmail/email` APIs/components.

- file_or_command: `src/components/Action/Actions/SendSMSToCustomer.tsx`
- finding: SMS action node gets SMS templates, may create content by template, and routes SMS content edits through the shared content-editor handoff.

- file_or_command: `src/components/Subscriber/SubscriberFlows/index.tsx`
- finding: subscriber flows use `DslManagementEnum.SystemAutomated`, `InitFlowsKeyEnum.SubscriberFlows`, and `FlowCategoryEnum.Subscriber`, filtering by email/SMS actions.

- file_or_command: `src/components/Editor/WebhookModal/index.tsx`
- finding: webhook modal creates/updates/tests HTTP request settings and OAuth settings through generated GraphQL mutations/queries.

- file_or_command: `Jenkinsfile`
- finding: CI/deploy identifies app as `sdks.am-static.com_admin-flow`, flow `frontend`, repo `sdks.am-static.com_admin-flow.git`, Node 16.16.0, and pre-publish script `yarn build:sdk`.

- file_or_command: `config/scripts/upload-assets.js`
- finding: uploads built assets to CDN bucket subdirectory `/admin-flow` and sets no-cache for `remoteEntry.js`.

## Open Questions
- question: Which backend repo owns `marketing/admin/v2/graphql` flow/content/webhook schema and resolvers?
- why it matters: This repo owns frontend operations and generated types, but backend ownership is only inferable from the endpoint, not confirmed by local evidence in this checkout.

- question: Which consuming host app imports `admin_flow` remote in production?
- why it matters: This repo exposes MF pages/components, but the host repo is not present in this checkout's evidence except via `@aftership/admin-host-runtime` and MF remote naming.

- question: Are `feat/mf-host` and `feat/mf-v2` historical or still active for MF migration?
- why it matters: Branches exist upstream, but protocol branch rules point active major work to `feat/flow-v3`; branch purpose was not verified from source-only master checkout.
