# sdks.am-static.com_admin-marketing-coupon

## Summary
- project_id: `sdks.am-static.com_admin-marketing-coupon`
- repo_name: `sdks.am-static.com_admin-marketing-coupon`
- upstream_url: `https://github.com/AfterShip/sdks.am-static.com_admin-marketing-coupon`
- local_path: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-coupon`
- repo_type: React/TypeScript coupon admin SDK、Module Federation remote、npm package `@aftership/admin-marketing-coupon`。
- confidence: High for 本地 checkout、repo 责任、MF 配置、branch 存在性、coupon admin/BFF/billing/email 关系；Medium for notification/flow 关系，因为目标 repo 没有直接 import notification/flow，关系主要来自 coupon settings/coupon campaign id schema 与下游消费迹象。

## Responsibility
- Owns:
  - Automizely/marketing coupon campaign 的前端管理面：coupon 列表、创建、编辑、删除、标准 coupon、unique coupon、discount rules、active period、usage limits、product/collection 适用范围、Buy X Get Y、free shipping、fixed amount、percentage off。
  - Coupon SDK/MF public surface：`CouponList`、`CouponEditor`、`CouponCampaignSelect`、`CouponPanel`、`useGetCoupons`、`useValidCoupon`、coupon typings 与 common utils。
  - 可被 email/popup 等业务 UI 复用的 coupon selector、coupon 创建 panel、有效期/删除校验、unique coupon billing gate。
  - 面向 marketing admin GraphQL 的前端 client、generated hooks 和表单数据转换逻辑。
- Does not own:
  - Coupon backend resolver、REST persistence、statistics API 或 Shopify coupon 创建的服务端逻辑；旧 `bff-api.automizely.com_marketing_admin` 本地 checkout 中 `src/datasources/coupon/**` 暴露 `couponCampaign*`、`saveCoupon`、`deleteCoupon` 并转发到 `/internal/coupon-campaigns`。
  - Billing/plan/feature availability 的源数据与升级 UI；这些来自 `adminMarketingBilling/billingV2`、`aftershipBillingWidgets` 和 feature slug `Coupons_unique`。
  - Email editor、flow editor、popup editor、notification rendering/delivery；本 repo 只提供 coupon campaign UI/selector/hooks，其他 repo 存储或消费 `coupon_campaign_id`/`coupon_settings`。
  - Product/catalog/collection 数据源；coupon editor 通过 GraphQL `productList` 查询和 BFF connectors 获取商品/collection 信息。
- Common change areas:
  - Coupon 管理 UI：`src/features/CouponList/**`、`src/features/CouponEditor/**`。
  - 下游嵌入组件：`src/features/CouponCampaignSelect/**`、`src/features/CouponPanel/**`、`src/hooks/useGetCoupons.ts`、`src/hooks/useValidCoupon.ts`。
  - GraphQL contract：`src/graphql/queries/**`、`src/graphql/mutations/**`、`src/generated/graphql.ts`、`codegen.yml`。
  - MF/package/export 配置：`src/index.ts`、`src/mfExports/**`、`mf.config.js`、`config/constants/mf.js`、`config/constants/domain.js`、`vite.config.ts`。

## Branch Tracks
- production: `master` exists locally and `upstream/master` exists. `upstream/master` observed at `07d0ffd` on `2025-05-26`, "Merge pull request #166 from BoydTang/feat/hotfix-250523". `origin/master` exists but is older fork ref (`a2187bc`, `2024-10-23`).
- legacy_v9: Not found. No local/origin/upstream `master_v9` ref was present in local git refs.
- active_major: Protocol candidates not found. No local/origin/upstream `feat/flow-v3-polaris-v13` or `feat/flow-v3` ref was present.
- repo_specific_notes:
  - Current checkout branch is `feat/polaris-upgrade-9` at `139c0b1` on `2025-09-26`, "Fix tsc issue".
  - Repo-specific branches present include `feat/aio-notification`, `feat/polaris-upgrade-9`, `upstream/feat/as-mf-ts`, `upstream/feat/billingV2`, `upstream/feat/mf-v2`, `upstream/staging`, `upstream/testing`, and release refs.
  - Remotes look fork-first: `origin` points to `git@github.com:Wynne-cwb/sdks.am-static.com_admin-marketing-coupon.git`; `upstream` points to `git@github.com:AfterShip/sdks.am-static.com_admin-marketing-coupon.git`.

## Module Federation
- enabled: Yes. `package.json` scripts `mf`/`build` use `config/webpack/webpack.module.federation.config.js`; that config instantiates `@module-federation/enhanced/webpack` `ModuleFederationPlugin` and `@aftership/module-federation-typescript` remote type plugin.
- exposes:
  - `./effectComponents` -> `./src/mfExports/effectComponents.ts`
  - `./commonUtils` -> `./src/mfExports/commonUtils.ts`
  - `./commonTypings` -> `./src/mfExports/commonTypings.ts`
  - `./basicHooks` -> `./src/mfExports/basicHooks.ts`
- remotes:
  - `aftershipBillingWidgets` -> `aftership_billing_ui` under `aftership-billing-ui/remoteEntry.v1.js` on port `8200` in local/dev path logic.
  - `adminMarketingBilling` -> `admin_marketing_billing` under `admin-marketing-billing/remoteEntry.js`, port `8201`.
  - `adminMarketingBasic` -> `admin_marketing_basic` under `admin-marketing-basic/remoteEntry.js`, port `8202`.
- shared_packages:
  - MF shared singleton/host-provided packages include `react`, `react-dom`, `react-router`, `react-router-dom`, `@shopify/polaris`, `@shopify/polaris-icons`, `@aftership/meerkat-sdk`, `@aftership/automizely-product-auth`, `@aftership/automizely-frontend-dev-kit`, `formik`, `@aftership/growth-components`, `@aftership/datacat`, and `@shopify/react-i18n`.
  - Package peer/external contract additionally names `@aftership/admin-marketing-basic` and `@aftership/admin-marketing-billing`.
- branch_alignment:
  - MF identity is `admin_marketing_coupon`; CDN subdirectory is `admin-marketing-coupon`; MF dev port is `8203`; remote filename is `remoteEntry.js`.
  - No flow-v3 branch refs were found, so do not assume `notificationCoupon`/flow-v3 naming for this repo from local evidence. Current consumers such as `sdks.am-static.com_admin-email` use legacy `adminMarketingCoupon` remote naming.

## Team Repo Dependencies
- Direct dependencies:
  - `@aftership/admin-marketing-basic`: peer/external and Vite alias target for `adminMarketingBasic/*`; source imports `path`, `hasExpired`, `getToday`, `formatCurrencySymbol`, `BasicPage`, `LoadingPage`, `ListWithPagination`, `BasicDependenciesContext`, form fields, collection selector, `useGetCurrentStore`, `AsSheet`, and `ScrollToError`.
  - `@aftership/admin-marketing-billing`: peer/external and Vite alias target for `adminMarketingBilling/billingV2`; source imports `useBillingFeatureStatus`, `FeatureSlugs.Coupons_unique`, `BillingBadgeTooltip`, `BillingFeatureLockTip`, `BillingActionList`, `TipTemplate`, `BillingProviderV2`, product/service config, and plan service types.
  - `aftershipBillingWidgets` / `@aftership/automizely-billing-ui-react`: MF remote and package dependency used for `PlanServiceCode` and example billing provider wiring.
  - Platform/runtime packages: `@aftership/automizely-product-auth`, `@aftership/automizely-frontend-dev-kit`, `@aftership/datacat`, `@aftership/meerkat-sdk`, `@aftership/growth-components`, Shopify Polaris, React 17, React Router 5, Formik, GraphQL.
- Runtime calls:
  - `codegen.yml` points schema generation at `http://localhost:9003/marketing/admin/graphql`.
  - GraphQL documents call `couponCampaign`, `couponCampaignDetail`, `couponCampaignWithStatistic`, `saveCoupon`, `deleteCoupon`, `productList`, and `userProfile`.
  - Cross-repo BFF evidence: `/Users/wb.chen/Documents/AfterShip/Automizely Marketing/bff-api.automizely.com_marketing_admin/src/datasources/coupon/resolver.ts` exposes matching GraphQL operations; `service.ts` maps coupon campaign CRUD to `/internal/coupon-campaigns` and statistics to `internal/statistics/coupon-campaigns`.
- Build-time dependencies:
  - Webpack 5, `@module-federation/enhanced`, `@aftership/module-federation-typescript`, SWC loader, Vite, `vite-plugin-dts`, `vite-plugin-svgr`, GraphQL Code Generator, `am-kit-hooks-codegen`, Jest, TypeScript, `@aftership/deploy-frontend-assets`.
  - `Jenkinsfile` identifies app `sdks.am-static.com_admin-marketing-coupon`, repo `sdks.am-static.com_admin-marketing-coupon.git`, frontend flow, Node `16.16.0`, and `prePublishScript = "yarn build:sdk"`.
- Shared packages:
  - MF/shared and peer surface is designed to be supplied by host/consumer builds for React, Polaris, product auth, dev-kit, billing, basic, datacat, meerkat, and Formik.
  - `vite.config.ts` aliases MF import paths to package builds for SDK build, notably `adminMarketingBilling/billingV2` -> `@aftership/admin-marketing-billing/lib/index_v2.es.js` and `adminMarketingBasic/*` -> `@aftership/admin-marketing-basic`.
- Inferred but unconfirmed:
  - The marketing REST service behind `/internal/coupon-campaigns` likely owns final coupon persistence/Shopify integration, but that backend repo/service was not inspected here.
  - The owner repo for `aftership_billing_ui` / `@aftership/automizely-billing-ui-react` was not inspected; this report only confirms coupon repo consumes the remote/package.

## Business Flows
- flow_id: `coupon-admin-management`
- role: Provides the admin UI and SDK surface to list, create, edit, delete, and validate coupon campaigns. It manages form UX for standard/unique coupons, discount rules, products/collections, active periods, usage limits, and Buy X Get Y.
- upstream/downstream repos: Upstream runtime API is old `bff-api.automizely.com_marketing_admin` GraphQL/REST coupon datasource; UI dependencies are `sdks.am-static.com_admin-marketing-basic`, `sdks.am-static.com_admin-marketing-billing`, and `aftershipBillingWidgets`.

- flow_id: `email-coupon-block`
- role: Supplies coupon typings, `useGetCoupons`, `useValidCoupon`, and `CouponCampaignSelect` for email editor coupon-code blocks and send-test behavior. Unique coupon selection is guarded by billing availability and expiry/deleted checks.
- upstream/downstream repos: Downstream `sdks.am-static.com_admin-email` directly depends on `@aftership/admin-marketing-coupon`, configures `adminMarketingCoupon` remote, imports `CouponCampaignSelect`, `CouponTypes`, `useValidCoupon`, and `useGetCoupons` in coupon block/editor/send-test files.

- flow_id: `popup-coupon-settings`
- role: Supplies `CouponPanel` and selector-oriented behavior for popup coupon settings. Target repo source has TODO text "迁移到 popup 微前端" and UI copy saying coupons can be selected in popup settings.
- upstream/downstream repos: Downstream popup ownership is not confirmed from this checkout. BFF evidence contains popup entities with `coupon_campaign_id`/`coupon_settings`; `aio-notification` configures an `adminMarketingCoupon` MF remote but local search only confirmed remote config, not source imports.

- flow_id: `flow-notification-coupon-settings`
- role: No direct dependency from this repo to flow/notification was found. Relationship is through shared coupon campaign ids/settings that flow/message/email/SMS schemas can carry, while coupon repo owns the reusable coupon selector/admin surface.
- upstream/downstream repos: Local `sdks.am-static.com_admin-flow` search for `adminMarketingCoupon`/`@aftership/admin-marketing-coupon` found no direct import; generated GraphQL and fragments contain `coupon_settings`/`coupon_campaign_id`. `bff-api.automizely.com_marketing_admin_v2` also contains content variant, popup, email template, and SMS template coupon settings.

- flow_id: `coupon-billing-gating`
- role: Gates unique coupon creation/use through billing feature status. The repo disables unique coupon options, shows billing badges/lock tips, blocks invalid unique coupon use, and wires billing provider in the example host.
- upstream/downstream repos: Upstream billing surface is `sdks.am-static.com_admin-marketing-billing` via `adminMarketingBilling/billingV2` plus `aftershipBillingWidgets`; billing report and local source indicate `Coupons_unique` is the key feature slug.

## Important Entrypoints
- path: `package.json`
- why it matters: Defines package identity `@aftership/admin-marketing-coupon`, description "Provide coupon features", MF/build/sdk/codegen scripts, externals, peer dependencies, and team package dependencies.

- path: `src/index.ts`
- why it matters: SDK root export; re-exports MF buckets plus `CouponList`, `CouponEditor`, `CouponCampaignSelect`, `CouponPanel`, hooks, utils, and typings.

- path: `src/mfExports/effectComponents.ts`
- why it matters: Public MF component surface for `CouponList`, `CouponEditor`, `CouponCampaignSelect`, and `CouponPanel`.

- path: `src/mfExports/basicHooks.ts`
- why it matters: Public MF hook surface for `useGetCoupons` and `useValidCoupon`.

- path: `src/mfExports/commonTypings.ts`
- why it matters: Public MF typings surface for coupon types consumed by downstream email/popup code.

- path: `src/features/CouponList/index.tsx`
- why it matters: Coupon admin list page; fetches `couponCampaignWithStatistic`, paginates, links to create/edit, and renders empty state.

- path: `src/features/CouponList/CouponItem/index.tsx`
- why it matters: Coupon list item actions and delete mutation; shows standard/unique coupon badges, statistics, date description, and unique-coupon billing lock.

- path: `src/features/CouponEditor/index.tsx`
- why it matters: Main create/edit page; wires Formik, title/type, discount rules, active period, billing warning, demo disable, success toast, and navigation.

- path: `src/features/CouponEditor/hooks/useCouponEditor.ts`
- why it matters: Core data hook for detail fetch, save mutation, API error mapping, unique coupon feature availability, and form conversion.

- path: `src/features/CouponEditor/sections/TitleAndType/index.tsx`
- why it matters: Defines standard vs unique coupon choice, billing lock, title constraints, and user-facing email/popup relationship copy.

- path: `src/features/CouponEditor/sections/DiscountRules/index.tsx`
- why it matters: Main discount rule form for code/prefix, amount/percentage/free shipping/Buy X Get Y, usage limits, product/collection selection, and product list queries.

- path: `src/features/CouponEditor/sections/ActivePeriod/index.tsx`
- why it matters: Active-period UI, including unique coupon dynamic expiration after popup signup or email send.

- path: `src/features/CouponCampaignSelect/index.tsx`
- why it matters: Reusable downstream coupon selector; groups standard/unique coupons, handles expired/deleted selected coupons, applies billing locks, and emits selected coupon id/type.

- path: `src/features/CouponPanel/index.tsx`
- why it matters: Sheet-based coupon creation component intended for popup-style embedding; after save it writes `coupon_campaign_id` into caller form state.

- path: `src/hooks/useGetCoupons.ts`
- why it matters: Reusable hook for querying coupon list and producing select options; includes expiry helper used by validation.

- path: `src/hooks/useValidCoupon.ts`
- why it matters: Reusable validator for selected coupon id, deletion, expiry, schedule-time expiry, and unique-coupon billing availability.

- path: `src/graphql/queries/getCouponsCampaign.graphql`
- why it matters: Main GraphQL query contract for list, detail, and list-with-statistics.

- path: `src/graphql/mutations/mutationCouponsCampaign.graphql`
- why it matters: Main GraphQL mutation contract for save/delete coupon campaign.

- path: `src/graphql/queries/getProductList.graphql`
- why it matters: Product selection contract used by discount rules and Buy X Get Y flows.

- path: `codegen.yml`
- why it matters: Binds generated hooks/types to local marketing admin GraphQL schema URL `http://localhost:9003/marketing/admin/graphql`.

- path: `mf.config.js`
- why it matters: Defines MF host/remote config, exposes, remotes, and shared singleton/host-provided packages.

- path: `config/constants/mf.js`
- why it matters: Authoritative MF exports/remotes mapping for this checkout.

- path: `config/constants/domain.js`
- why it matters: Defines MF port `8203`, CDN subdirectory `admin-marketing-coupon`, and MF name `admin_marketing_coupon`.

- path: `config/webpack/webpack.module.federation.config.js`
- why it matters: Builds `remoteEntry.js`, configures public path/chunk names, and emits MF TypeScript metadata.

- path: `vite.config.ts`
- why it matters: Builds npm SDK from `src/index.ts` and aliases MF imports to package builds.

- path: `Jenkinsfile`
- why it matters: CI/deploy metadata for frontend build and SDK prepublish script.

## Evidence
- file_or_command: `sed -n '1,240p' /Users/wb.chen/Documents/Project/skills/NOTIFICATION_REPO_MAP_RESEARCH.md`
- finding: Confirmed required Per-Repo Research Output Schema, branch-track rules, evidence rules, and read-only research expectations.

- file_or_command: `package.json`
- finding: Package name is `@aftership/admin-marketing-coupon`, version `1.1.0`, description "Provide coupon features"; scripts include `mf`, `build`, `build:sdk`, `serve`, `codegen`, `mf-types-codegen`, `upload-assets`, `test`, and `tsc`.

- file_or_command: `git remote -v`
- finding: `origin` is user fork `git@github.com:Wynne-cwb/sdks.am-static.com_admin-marketing-coupon.git`; `upstream` is company repo `git@github.com:AfterShip/sdks.am-static.com_admin-marketing-coupon.git`.

- file_or_command: `git for-each-ref refs/heads refs/remotes --format='%(refname:short)'`
- finding: `master`, `origin/master`, and `upstream/master` exist; `master_v9`, `feat/flow-v3`, and `feat/flow-v3-polaris-v13` were not found; repo-specific refs include `feat/aio-notification`, `feat/polaris-upgrade-9`, `upstream/feat/as-mf-ts`, `upstream/feat/billingV2`, and `upstream/feat/mf-v2`.

- file_or_command: `git rev-parse --abbrev-ref HEAD` and `git log -1 --format='%h %ci %s'`
- finding: Current checkout is `feat/polaris-upgrade-9` at `139c0b1`, dated `2025-09-26`, "Fix tsc issue".

- file_or_command: `config/constants/domain.js`
- finding: MF dev port is `8203`, domain subdirectory is `admin-marketing-coupon`, and `MODULE_FEDERATION_NAME` is `admin_marketing_coupon`.

- file_or_command: `config/constants/mf.js`
- finding: MF exposes `./effectComponents`, `./commonUtils`, `./commonTypings`, `./basicHooks`; remotes are `aftershipBillingWidgets`, `adminMarketingBilling`, and `adminMarketingBasic`.

- file_or_command: `mf.config.js`
- finding: Remote config publishes `remoteEntry.js`, uses `MF_EXPORTS` and `MF_REMOTES`, and shares React/Router/Polaris/product-auth/meerkat/dev-kit/Formik/growth/datacat/react-i18n as singleton or host-provided packages.

- file_or_command: `config/webpack/webpack.module.federation.config.js`
- finding: Webpack MF build enters at `src/index`, outputs to `build`, sets `chunkLoadingGlobal` from package name, uses `ModuleFederationPlugin`, and runs `ASModuleFederationTypeScriptRemotePlugin`.

- file_or_command: `src/index.ts` and `src/mfExports/**`
- finding: SDK/MF public exports include `CouponList`, `CouponEditor`, `CouponCampaignSelect`, `CouponPanel`, `useGetCoupons`, `useValidCoupon`, common typings, and common utils.

- file_or_command: `src/graphql/queries/getCouponsCampaign.graphql`
- finding: Defines `GetCouponsCampaign`, `GetCouponsCampaignDetail`, and `GetCouponsCampaignWithStatistic`, including coupon settings, discount rules, affected products/customers, statistics, starts/ends.

- file_or_command: `src/graphql/mutations/mutationCouponsCampaign.graphql`
- finding: Defines `SaveCouponsCampaign` -> `saveCoupon(couponCampaign:)` and `DeleteCouponsCampaign` -> `deleteCoupon(id:)`.

- file_or_command: `src/graphql/queries/getProductList.graphql`
- finding: Defines `productList` query used for product/variant selection in discount rules.

- file_or_command: `codegen.yml`
- finding: Generated GraphQL types/hooks come from `http://localhost:9003/marketing/admin/graphql` and `src/graphql/**/*.graphql`.

- file_or_command: `src/features/CouponEditor/hooks/useCouponEditor.ts`
- finding: Fetches coupon detail, saves coupon, maps backend error codes `40950`, `40951`, `42235`, and gates default form/unique coupon availability with `useBillingFeatureStatus(FeatureSlugs.Coupons_unique)`.

- file_or_command: `src/features/CouponEditor/sections/TitleAndType/index.tsx`
- finding: UI says a coupon is automatically created at Shopify and can be selected in popup or email settings; unique coupon choice is disabled when `Coupons_unique` is unavailable.

- file_or_command: `src/features/CouponEditor/sections/DiscountRules/index.tsx`
- finding: Owns discount type UX, coupon code/prefix UX, product/collection selection, Buy X Get Y sections, and calls `useGetProductListLazyQuery`.

- file_or_command: `src/features/CouponCampaignSelect/index.tsx`
- finding: Reusable selector calls `useGetCouponsCampaignLazyQuery`, groups standard/unique coupons, disables expired/unavailable unique coupons, and uses `BillingActionList`/`BillingFeatureLockTip`.

- file_or_command: `src/features/CouponPanel/index.tsx`
- finding: Sheet-based create-coupon UI writes saved coupon id to caller form path as `{ type: 'coupon-campaign', coupon_campaign_id: id }`; file includes TODO to migrate to popup micro frontend.

- file_or_command: `src/hooks/useGetCoupons.ts` and `src/hooks/useValidCoupon.ts`
- finding: Shared hooks expose coupon list/options and validate selected coupon id, deletion, expiry, scheduled send time, and unique coupon billing availability.

- file_or_command: `vite.config.ts`
- finding: SDK build aliases `adminMarketingBilling/billingV2` to `@aftership/admin-marketing-billing/lib/index_v2.es.js` and `adminMarketingBasic/*` to `@aftership/admin-marketing-basic`; library build entry is `src/index.ts`.

- file_or_command: `Jenkinsfile`
- finding: CI config identifies frontend app/repo and uses `prePublishScript = "yarn build:sdk"` with Node `16.16.0`.

- file_or_command: local cross-repo `rg "adminMarketingCoupon|@aftership/admin-marketing-coupon|CouponCampaignSelect|useValidCoupon|useGetCoupons|CouponTypes" package.json src config mf.config.js` in `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email`
- finding: `sdks.am-static.com_admin-email` directly consumes this repo via package dependency, MF remote `adminMarketingCoupon`, `CouponCampaignSelect`, `CouponTypes`, `useGetCoupons`, and `useValidCoupon`.

- file_or_command: local cross-repo `rg "adminMarketingCoupon|@aftership/admin-marketing-coupon|CouponCampaignSelect|useValidCoupon|useGetCoupons|CouponPanel|CouponTypes" package.json src config mf.config.js` in `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow`
- finding: No direct import/package hit found; separate broad search showed flow generated GraphQL/fragments contain `coupon_settings` and `coupon_campaign_id`, so flow relation is schema/settings-level rather than a confirmed direct MF dependency.

- file_or_command: local cross-repo `rg "adminMarketingCoupon|admin_marketing_coupon|admin-marketing-coupon" package.json src mf.config.js` in `/Users/wb.chen/Documents/AfterShip/aio-notification`
- finding: `aio-notification` configures `adminMarketingCoupon` remote to `admin_marketing_coupon` under `admin-marketing-coupon`, but no source import was confirmed in the narrow search.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Automizely Marketing/bff-api.automizely.com_marketing_admin/src/datasources/coupon/resolver.ts`
- finding: Old marketing admin BFF exposes `couponCampaign`, `couponCampaignWithStatistic`, `couponCampaignDetail`, `saveCoupon`, and `deleteCoupon`, matching this repo's GraphQL operations.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Automizely Marketing/bff-api.automizely.com_marketing_admin/src/datasources/coupon/service.ts`
- finding: BFF coupon service maps coupon campaign list/detail/create/update/delete to `/internal/coupon-campaigns` and statistics to `internal/statistics/coupon-campaigns`.

- file_or_command: local cross-repo `rg "couponCampaign|coupon_campaign|saveCoupon|deleteCoupon|productList|coupon_settings" src package.json` in `/Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2`
- finding: v2 BFF search found content variant, popup, email template, and SMS template `coupon_settings`, but not the coupon campaign CRUD resolver names used by this repo; this supports the 9003 old-admin BFF linkage.

## Open Questions
- question: Which branch should be treated as active for future coupon work if a task targets notification/flow-v3 migration?
- why it matters: Protocol active-major refs are absent in this checkout, while repo-specific refs like `feat/aio-notification`, `feat/mf-v2`, `feat/billingV2`, and current `feat/polaris-upgrade-9` exist.

- question: Which repo/service owns the marketing REST API behind `/internal/coupon-campaigns`?
- why it matters: This report confirms frontend -> BFF -> REST path, but not final persistence/Shopify coupon backend ownership.

- question: Which repo currently owns the popup micro frontend intended by `CouponPanel` TODO?
- why it matters: `CouponPanel` looks built for popup embedding, and BFF schemas contain popup coupon settings, but a direct source consumer was not confirmed.

- question: Is `adminMarketingCoupon` expected to be renamed/re-exported as a notification-era `notificationCoupon` remote in future active tracks?
- why it matters: Email active reports mention notification-era remote naming in other repos, but this coupon repo local refs do not include flow-v3 branches showing that migration.

- question: Which upstream repo owns `aftership_billing_ui` / `@aftership/automizely-billing-ui-react`?
- why it matters: Coupon depends on that billing widget remote/package for plan service types and provider behavior, but the owner repo was not inspected in this per-repo research.
