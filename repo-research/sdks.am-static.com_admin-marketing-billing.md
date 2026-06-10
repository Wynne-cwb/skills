# sdks.am-static.com_admin-marketing-billing

## Summary
- project_id: sdks.am-static.com_admin-marketing-billing
- repo_name: sdks.am-static.com_admin-marketing-billing
- upstream_url: https://github.com/AfterShip/sdks.am-static.com_admin-marketing-billing
- local_path: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-billing
- repo_type: TypeScript/React billing SDK package plus Module Federation remote for Automizely/AfterShip marketing billing gates.
- confidence: high. Evidence includes git remotes/branches, `package.json`, MF config, Vite SDK builds, exported entrypoints, GraphQL operations, billing feature-slug mappings, provider/hooks, and local consumer imports from related notification/marketing repos.

## Responsibility
- Owns: npm package `@aftership/admin-marketing-billing`; MF remote `admin_marketing_billing`; public MF surfaces `./billing` and `./billingV2`; shared billing provider, billing badges/tooltips/buttons, lock blocks/modals/banners, trial/upgrade helpers, feature-status hooks, billing feature slug constants, flow/filter-to-feature mappings, service/plan mapping helpers, and v1/v2 billing SDK entrypoints. Evidence: `package.json`; `config/constants/mf.js`; `src/mfExports/billing.ts`; `src_v2/mfExports/billing.ts`; `src/components/**`; `src_v2/components/**`; `src/hooks/**`; `src_v2/hooks/**`; `src/constants/**`; `src_v2/constants/**`.
- Does not own: flow editor/list implementation, email editor/template implementation, SMS editor/sender implementation, coupon editor implementation, CRM/data UI, host shell, pricing/subscription engine internals, billing widgets source, or marketing GraphQL backend/schema. Evidence: this repo exports only billing provider/components/hooks/constants; runtime imports `aftershipBillingWidgets`; `codegen.yml` reads schemas from `http://localhost:9003/marketing/admin/graphql` and `http://localhost:9006/marketing/admin/v2/graphql`; local consumer repos such as `sdks.am-static.com_admin-flow`, `sdks.am-static.com_admin-email`, `sdks.am-static.com_admin-sms`, and `sdks.am-static.com_admin-marketing-coupon` import this remote for billing gates around their own business UI.
- Common change areas: `src_v2` billing gates and feature names, `FeatureSlugs`, flow template/action feature mappings, `BillingMFProvider`, `useBillingInit`, `useBillingFeatureStatus`, upgrade/trial UI components, GraphQL feature queries/mutations, MF exposes/remotes, SDK externals/aliases, and billing plan/service mapping constants. Evidence: `src_v2/constants/featureSlugs.ts`; `src_v2/constants/flowFeatureSlug.ts`; `src_v2/hooks/useBillingFeatureStatus.ts`; `src_v2/components/BillingMFProvider/BillingMFProvider.tsx`; `src_v2/graphql/v2/**`; `mf.config.js`; `vite.config.v2.ts`.

## Branch Tracks
- production: `master` exists locally and on `origin` and `upstream`. The local checkout is on `master` tracking `origin/master`; `upstream/master` also exists. Evidence: `git branch -a --no-color`; `git status --short --branch`.
- legacy_v9: not found. Evidence: targeted branch check for `master_v9` returned no matches.
- active_major: not resolved by the protocol defaults. Neither `feat/flow-v3-polaris-v13` nor `feat/flow-v3` exists in this checkout/remotes. Evidence: targeted branch check for `feat/flow-v3*` and `feat/flow-v3-polaris-v13*` returned no matches.
- repo_specific_notes: fork-first remotes are configured: `origin` is `git@github.com:Wynne-cwb/sdks.am-static.com_admin-marketing-billing.git`, `upstream` is `git@github.com:AfterShip/sdks.am-static.com_admin-marketing-billing.git`. Repo-specific upstream branches include `feat/aio-notification`, `feat/aftership-billing`, `feat/allinone-pricing`, `feat/allinone-pricing-v2`, `feat/billingV2`, `feat/mf-phase-3`, and `feat/mf-v2`. `origin/master` is at `4cb74ea` while `upstream/master` is at `b9a488a` in the inspected checkout; this report did not modify or sync branches.

## Module Federation
- enabled: yes. Evidence: `package.json` has `mf`, `build`, and `serve` scripts using `config/webpack/webpack.module.federation.config.js`; that webpack config uses `@module-federation/enhanced/webpack` `ModuleFederationPlugin`; `mf.config.js` provides remote and host config.
- exposes: `./billing -> ./src/mfExports/billing.ts`; `./billingV2 -> ./src_v2/mfExports/billing.ts`. `./billing` exports v1 basic/business components, `BillingMFProvider`, hooks, typings, utils, and constants. `./billingV2` exports v2 equivalents plus v2-only constants/components such as `BillingSwitchPlanGroupBlock`.
- remotes: remote config consumes `aftershipBillingWidgets` as `aftership_billing_ui@.../aftership-billing-ui/remoteEntry.v1.js`; host config additionally wires `adminMarketingBasic` for the local/example host. Evidence: `config/constants/mf.js`; `mf.config.js`; `example/Routes.tsx`.
- shared_packages: singleton/shared MF packages include React, React DOM, React Router, Polaris, Polaris icons, `@shopify/react-i18n`, `@aftership/meerkat-sdk`, `@aftership/automizely-product-auth`, `@aftership/automizely-frontend-dev-kit`, `formik`, `@aftership/growth-components`, `@aftership/datacat`, and `@sentry/react`. Evidence: `mf.config.js`.
- branch_alignment: MF URLs are environment/CDN based, not branch encoded. `DOMAIN_SUBDIRECTORY` is `admin-marketing-billing`, `MODULE_FEDERATION_NAME` is `admin_marketing_billing`, MF port is `8201`, and `remoteEntry.js` is published under env domains such as `sdks.am-static.io`, `staging-sdks.am-static.com`, and `sdks.am-static.com`. Protocol active-major branches are absent, so billing work should not assume `feat/flow-v3*` for this repo without separate branch confirmation.

## Team Repo Dependencies
- Direct dependencies: package dependencies include `@aftership/datacat`, `@aftership/growth-components`, `@aftership/meerkat-sdk`, `@module-federation/enhanced`, Shopify Polaris packages, React/Redux/Router, GraphQL, and Zustand. Dev/peer/external dependencies include `@aftership/accounts-widgets`, `@aftership/automizely-billing-ui-react`, `@aftership/automizely-frontend-dev-kit`, `@aftership/automizely-product-auth`, `@aftership/billing-ui-react`, `@aftership/deploy-frontend-assets`, `@aftership/module-federation-typescript`, and `@sentry/react`. Evidence: `package.json`.
- Runtime calls: generated GraphQL operations call marketing admin GraphQL for feature availability, trial creation, user quota/profile, and v2 SMS billing-method mutation. Runtime hooks/components also call `aftershipBillingWidgets` APIs such as `useBillingState`, `useGetFeatureAvailableV2`, `useBillingModifySubscription`, `useRegisterSubscriptionUpdateCallback`, `useGetPlanTrial`, `usePlanTrialUnlockModal`, `PricingPage`, product slug constants, and plan/service types. Evidence: `codegen.yml`; `src/graphql/**`; `src_v2/graphql/**`; `src/hooks/useBillingInit.ts`; `src_v2/hooks/useBillingInit.ts`; `src_v2/hooks/useBillingFeatureStatus.ts`; `example/pages/BillingPricing/index.tsx`.
- Build-time dependencies: webpack MF build uses `@module-federation/enhanced` and `@aftership/module-federation-typescript`; SDK builds use Vite, `vite-plugin-dts`, and `vite-plugin-svgr`; GraphQL codegen uses GraphQL Code Generator plus `am-kit-hooks-codegen`; asset upload uses `@aftership/deploy-frontend-assets`. Evidence: `package.json`; `config/webpack/webpack.module.federation.config.js`; `vite.config.ts`; `vite.config.v2.ts`; `codegen.yml`; `config/scripts/upload-assets.js`.
- Shared packages: consumers access this repo via MF remote import paths such as `adminMarketingBilling/billingV2` and package alias `@aftership/admin-marketing-billing/lib/index_v2.es.js`; peer/external contracts keep React, Polaris, product auth, dev-kit, billing widgets, growth components, and datacat supplied by the host or consuming build. Evidence: this repo `vite.config*.ts`; local consumer `vite.config.ts` files in `sdks.am-static.com_admin-flow`, `sdks.am-static.com_admin-email`, `sdks.am-static.com_admin-sms`, `sdks.am-static.com_admin-marketing-basic`, `sdks.am-static.com_admin-crm`, `sdks.am-static.com_admin-marketing-data`, and `sdks.am-static.com_admin-marketing-coupon`.
- Inferred but unconfirmed: `aftershipBillingWidgets` maps at build time to `@aftership/billing-ui-react`, but this report did not inspect the upstream repo that owns that package/remote. The backend repo that owns `marketing/admin/graphql` and `marketing/admin/v2/graphql` is not confirmed from this checkout alone.

## Business Flows
- flow_id: marketing-billing-sdk
- role: Provides shared billing gates and upgrade/trial UI for Automizely marketing features across email marketing, SMS marketing, free tools, coupons, CRM/contacts, analytics, and recommendations. It stores fetched feature metadata and exposes availability maps, lock UI, upgrade buttons, and service/plan mapping helpers.
- upstream/downstream repos: upstream runtime depends on marketing admin GraphQL and `aftershipBillingWidgets`; downstream consumers include `sdks.am-static.com_admin-marketing-basic`, `sdks.am-static.com_admin-crm`, `sdks.am-static.com_admin-marketing-data`, `sdks.am-static.com_admin-marketing-coupon`, `sdks.am-static.com_admin-email`, `sdks.am-static.com_admin-flow`, and `sdks.am-static.com_admin-sms`. Evidence: `src/constants/featureSlugs.ts`; `src_v2/constants/featureSlugs.ts`; cross-repo `rg "adminMarketingBilling|@aftership/admin-marketing-billing"` under local Notification checkouts.

- flow_id: flow-billing-gating
- role: Maps flow templates and action types to feature slugs, then exposes `useBillingFlowFeatureStatus`, `BillingBadgeTooltip`, `BillingLock*`, and `useBillingShowUpgrade` for flow list/editor/template/action UIs. It gates generic flow editor actions plus email/SMS flow actions such as abandoned cart, welcome, order follow-up, winback, birthday, price drop, back in stock, browse abandonment, order fulfillment, and popup interaction.
- upstream/downstream repos: downstream `sdks.am-static.com_admin-flow` imports `adminMarketingBilling/billingV2` in flow editor, flow list, subscriber flows, template cards, trigger/action nodes, duplicate modal, multilingual modal, and SMS pricing banner. Evidence: `src_v2/constants/flowFeatureSlug.ts`; `src_v2/hooks/useBillingFlowFeatureStatus.ts`; `sdks.am-static.com_admin-flow/src/**` import hits from local `rg`.

- flow_id: email-content-billing
- role: Supplies billing constants and UI gates for email editor blocks, templates, recommendations, shipment review, multilingual/AI translation, send-test, branding/removal, and email quota/plan status. The repo does not render or persist email content; it supplies locks, badges, banners, feature slug names, and upgrade flows used by email UI repos.
- upstream/downstream repos: downstream `sdks.am-static.com_admin-email` imports `adminMarketingBilling/billingV2` in email editor framework, advanced/DnD editor, email variant editor, templates, send-test modals, recommendation blocks, and business setting plugins. Evidence: `src_v2/constants/featureSlugs.ts`; `src_v2/constants/FeatureSlugToName.ts`; `sdks.am-static.com_admin-email/src/**` import hits from local `rg`.

- flow_id: sms-billing-gating
- role: Supplies SMS feature slugs and billing UI for SMS credits, SMS newsletters, phone numbers, sender settings, multilingual SMS, send-SMS flow actions, and SMS billing method behavior. In v2, `BillingMFProvider` registers a subscription-update callback and calls `setSMSBillingMethodToCredits` when AfterShip SMS plan upgrades meet the coded conditions.
- upstream/downstream repos: upstream calls `aftershipBillingWidgets` for SMS subscription state and `marketing/admin/v2/graphql` mutation `setSMSBillingMethodToCredits`; downstream includes `sdks.am-static.com_admin-sms` and `sdks.am-static.com_admin-flow` SMS action/list integrations. Evidence: `src_v2/components/BillingMFProvider/BillingMFProvider.tsx`; `src_v2/graphql/v2/mutations/billingMethod.graphql`; `src_v2/constants/featureSlugs.ts`; local consumer imports in `sdks.am-static.com_admin-sms` and `sdks.am-static.com_admin-flow`.

- flow_id: all-in-one-notification-billing
- role: Provides feature slugs and product/service routing for AfterShip/All-in-one tracking notification billing gates, including tracking notification, pickup/tracking/order fulfillment/status triggers, notification history export, remove all-in-one branding, and WhatsApp sender settings. This is gating metadata/UI, not notification rendering or event delivery.
- upstream/downstream repos: downstream `aio-notification` imports `adminMarketingBilling/billingV2` and configures `adminMarketingBilling` as MF remote; `admin-flow` also uses tracking trigger slugs in flow template/action gating. Evidence: `src_v2/constants/featureSlugs.ts`; `src_v2/constants/productCodeToSlug.ts`; `src_v2/constants/serviceRouterMapping.ts`; `/Users/wb.chen/Documents/AfterShip/aio-notification/src/remoteEnter.tsx`; `/Users/wb.chen/Documents/AfterShip/aio-notification/mf.config.js`.

- flow_id: coupon-and-filter-billing
- role: Supplies gating for coupon features and advanced/segment filters through shared feature slugs and `useBillingFilterFeatureStatus`; coupon repos consume billing badges/locks around coupon editor/list/select behavior.
- upstream/downstream repos: downstream `sdks.am-static.com_admin-marketing-coupon` imports `adminMarketingBilling/billingV2` in coupon validation, editor, campaign select, title/type, list item, and example app. Evidence: `src_v2/constants/filterFeatureSlug.ts`; `src_v2/constants/featureSlugs.ts`; local consumer imports in `sdks.am-static.com_admin-marketing-coupon`.

## Important Entrypoints
- path: `src/index.ts`
- why it matters: v1 SDK entrypoint; re-exports `src/mfExports/billing`.

- path: `src_v2/index.ts`
- why it matters: v2 SDK entrypoint; re-exports `src_v2/mfExports/billing`.

- path: `src/mfExports/billing.ts`
- why it matters: v1 public surface for basic/business components, provider, hooks, types, utils, and constants.

- path: `src_v2/mfExports/billing.ts`
- why it matters: v2 public surface for billing provider, components, hooks, types, utils, constants, and v2-only billing blocks.

- path: `config/constants/mf.js`
- why it matters: Authoritative MF exposes/remotes list for `./billing`, `./billingV2`, and `aftershipBillingWidgets`.

- path: `mf.config.js`
- why it matters: Defines MF remote/host configuration and shared singleton package contract.

- path: `config/constants/domain.js`
- why it matters: Defines MF name `admin_marketing_billing`, port `8201`, CDN subdirectory `admin-marketing-billing`, and env domains.

- path: `config/webpack/webpack.module.federation.config.js`
- why it matters: Builds MF `remoteEntry.js` with two entries, `microApp` from `src/index` and `microAppV2` from `src_v2/index`.

- path: `vite.config.ts`
- why it matters: Builds v1 SDK library from `src/index.ts` and aliases `aftershipBillingWidgets` to `@aftership/billing-ui-react`.

- path: `vite.config.v2.ts`
- why it matters: Builds v2 SDK library from `src_v2/index.ts` into `lib/index_v2.*`.

- path: `codegen.yml`
- why it matters: Declares v1 and v2 GraphQL schema endpoints and document roots for generated billing hooks/types.

- path: `src/components/BillingMFProvider/BillingMFProvider.tsx`
- why it matters: v1 provider initializes billing store and renders unlock modal.

- path: `src_v2/components/BillingMFProvider/BillingMFProvider.tsx`
- why it matters: v2 provider initializes billing store, accepts `productCode`, renders unlock modal, and registers SMS subscription update callback.

- path: `src/hooks/useBillingInit.ts`
- why it matters: v1 initialization path for email/SMS subscriptions, feature fetching, cache fallback, and store updates.

- path: `src_v2/hooks/useBillingInit.ts`
- why it matters: v2 initialization path for email/SMS/tracking subscriptions, product-code-aware feature fetching, plan trial status, and store reset.

- path: `src_v2/hooks/useBillingFeatureStatus.ts`
- why it matters: Core v2 feature availability computation; combines locally fetched feature slugs with `aftershipBillingWidgets` feature availability data and app-platform support.

- path: `src_v2/hooks/useBillingFlowFeatureStatus.ts`
- why it matters: Public hook that converts flow template/action identity into billing feature slugs.

- path: `src_v2/constants/featureSlugs.ts`
- why it matters: Central billing feature slug catalog for email, SMS, flows, tracking notification, all-in-one, data export, WhatsApp, and other gated features.

- path: `src_v2/constants/flowFeatureSlug.ts`
- why it matters: Maps flow templates/action types to feature slugs consumed by Admin Flow.

- path: `src_v2/constants/billingConfig.ts`
- why it matters: Marketing email/SMS plan group and service-code mapping used by upgrade/lock UI.

- path: `example/Routes.tsx`
- why it matters: Local example host wires `BasicDependenciesProvider`, `BillingMFProvider`, pricing page, and component examples.

## Evidence
- file_or_command: `git remote -v`
- finding: `origin` points to `git@github.com:Wynne-cwb/sdks.am-static.com_admin-marketing-billing.git`; `upstream` points to `git@github.com:AfterShip/sdks.am-static.com_admin-marketing-billing.git`.

- file_or_command: `git branch -a --no-color`
- finding: `master` exists locally and remotely; `master_v9`, `feat/flow-v3`, and `feat/flow-v3-polaris-v13` were not found; repo-specific branches include `feat/aio-notification`, `feat/billingV2`, `feat/allinone-pricing*`, `feat/aftership-billing`, `feat/mf-phase-3`, and `feat/mf-v2`.

- file_or_command: `git status --short --branch`
- finding: checkout is `master...origin/master`, with no source edits made by this research.

- file_or_command: `package.json`
- finding: package is `@aftership/admin-marketing-billing` version `1.3.9`; scripts support MF dev/build, SDK build, GraphQL codegen, tests, typecheck, and asset upload; package outputs `lib/index.cjs.js`, `lib/index.es.js`, and types.

- file_or_command: `config/constants/mf.js`
- finding: MF exposes `./billing` and `./billingV2`; remote dependency is `aftershipBillingWidgets` pointing to `aftership_billing_ui` under `aftership-billing-ui/remoteEntry.v1.js`.

- file_or_command: `mf.config.js`
- finding: MF remote emits `remoteEntry.js`, consumes `MF_REMOTES`, and shares React/Router/Polaris/dev-kit/product-auth/growth/datacat/Sentry as singleton or host-provided packages; host config also wires `adminMarketingBasic`.

- file_or_command: `config/constants/domain.js`
- finding: MF port is `8201`, subdirectory is `admin-marketing-billing`, and MF name is `admin_marketing_billing`.

- file_or_command: `config/utils/path.js`
- finding: MF public/remote paths are derived from `APP_ENV`, port, domain, subdirectory, and remoteEntry filename, not from branch names.

- file_or_command: `config/webpack/webpack.module.federation.config.js`
- finding: webpack builds `microApp` from `src/index` and `microAppV2` from `src_v2/index`, outputs to `build`, and applies `ModuleFederationPlugin` plus `ASModuleFederationTypeScriptRemotePlugin`.

- file_or_command: `vite.config.ts` and `vite.config.v2.ts`
- finding: SDK builds publish v1 and v2 libraries to `lib`; both alias `aftershipBillingWidgets` to `@aftership/billing-ui-react` and externalize core host/shared packages.

- file_or_command: `codegen.yml`
- finding: v1 documents use schema `http://localhost:9003/marketing/admin/graphql`; v2 documents additionally use `http://localhost:9006/marketing/admin/v2/graphql`.

- file_or_command: `src/graphql/**` and `src_v2/graphql/**`
- finding: operations cover `features`, `createTrialFeatures`, `userProfile` email/SMS quotas, v2 `features(input:)`, and `setSMSBillingMethodToCredits`.

- file_or_command: `src/mfExports/billing.ts` and `src_v2/mfExports/billing.ts`
- finding: public exports are billing components, provider, hooks, typings, utils, and constants; v2 comments indicate selected exports are intended to centralize aftership billing widget use.

- file_or_command: `src/components/BusinessComponent/index.ts` and `src_v2/components/BusinessComponent/index.ts`
- finding: exports lock/action/badge/banner/modal/trial components; v2 adds `BillingSwitchPlanGroupBlock`.

- file_or_command: `src/hooks/index.ts` and `src_v2/hooks/index.ts`
- finding: exports feature-status, filter-status, flow-status, feature fetch/init/store, upgrade/trial, user info, service-code, and old paid-plan helpers.

- file_or_command: `src_v2/components/BillingMFProvider/BillingMFProvider.tsx`
- finding: v2 provider accepts `productCode`, initializes billing state, renders `BillingLockModal`, and registers a subscription update callback that may call `setSmsBillingMethodToCredits`.

- file_or_command: `src_v2/hooks/useBillingInit.ts`
- finding: fetches v2 features with `host_product_code`, observes email/SMS/tracking subscriptions and plan-trial state, caches features in localStorage, and stores billing state in Zustand.

- file_or_command: `src_v2/hooks/useBillingFeatureStatus.ts`
- finding: computes feature availability from feature slugs, product slug, app platform support, local store data, and `aftershipBillingWidgets` `useGetFeatureAvailableV2` results.

- file_or_command: `src_v2/constants/featureSlugs.ts`
- finding: includes feature slugs for email, SMS, flows, tracking notification, all-in-one notification billing, notification history export, sender settings, multilingual content, cross-org duplication, data export, and WhatsApp sender settings.

- file_or_command: `src_v2/constants/flowFeatureSlug.ts`
- finding: maps flow action/template names to billing feature slugs for flow editor/actions/triggers and email/SMS flow actions.

- file_or_command: `src_v2/constants/serviceRouterMapping.ts` and `src_v2/constants/productCodeToSlug.ts`
- finding: maps service codes to `email`, `sms`, `tracking`, and product codes `automizely`/`aftership` to billing product slugs.

- file_or_command: `example/Routes.tsx`
- finding: local example host uses `adminMarketingBasic/effectComponents`, wraps routes in v2 `BillingMFProvider`, and demonstrates pricing/components routes.

- file_or_command: `Jenkinsfile`
- finding: CI identifies app `sdks.am-static.com_admin-marketing-billing`, repo `sdks.am-static.com_admin-marketing-billing.git`, flow `frontend`, Node 16.16.0, and `prePublishScript` `yarn build:sdk`.

- file_or_command: `config/scripts/upload-assets.js`
- finding: uploads `build` assets to CDN bucket subdirectory `/admin-marketing-billing` and sets no-cache for `remoteEntry*.js` and federation helper files.

- file_or_command: local `rg "adminMarketingBilling|@aftership/admin-marketing-billing"` under `/Users/wb.chen/Documents/AfterShip/Notification`
- finding: consumers include `sdks.am-static.com_admin-flow`, `sdks.am-static.com_admin-email`, `sdks.am-static.com_admin-sms`, `sdks.am-static.com_admin-crm`, `sdks.am-static.com_admin-marketing-basic`, `sdks.am-static.com_admin-marketing-data`, and `sdks.am-static.com_admin-marketing-coupon`; many alias `adminMarketingBilling/billingV2` to `@aftership/admin-marketing-billing/lib/index_v2.es.js`.

- file_or_command: local `rg "adminMarketingBilling|admin_marketing_billing"` under `/Users/wb.chen/Documents/AfterShip`
- finding: `aio-notification` imports `adminMarketingBilling/billingV2` and configures an `adminMarketingBilling` MF remote; `admin.aftership.com` has test/dummy type references; `fe-pltf-ens-admin/Claude.md` documents `admin_marketing_billing` as a leaf marketing billing remote.

## Open Questions
- question: Which backend repo owns `marketing/admin/graphql` and `marketing/admin/v2/graphql` feature/billing schema and resolvers?
- why it matters: This repo owns frontend SDK operations and generated hooks, but backend ownership is only visible as schema URLs and operation documents.

- question: Which repo owns/publishes the `aftership_billing_ui` remote and `@aftership/billing-ui-react` package used as `aftershipBillingWidgets`?
- why it matters: This repo heavily wraps and delegates subscription/pricing/plan UI behavior to that remote/package, but the owner repo was not inspected in this report.

- question: Which repo-specific branch should be treated as active for billing v2/all-in-one work?
- why it matters: Protocol active-major branches are absent; upstream has repo-specific candidates like `feat/billingV2`, `feat/aio-notification`, and `feat/allinone-pricing-v2`, but their current status was not confirmed from source-only research.
