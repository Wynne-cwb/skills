# recommendation-admin-ts

## Summary
- project_id: recommendation-admin-ts
- repo_name: recommendation-admin-ts
- upstream_url: https://github.com/AfterShip/recommendation-admin-ts
- local_path: /Users/wb.chen/Documents/AfterShip/Automizely Marketing/recommendation-admin-ts
- repo_type: React/TypeScript admin UI SDK package; also has CRACO/webpack Module Federation remote config for recommendation admin pages.
- confidence: high for package/UI/BFF/host relationships; medium for branch intent because remote naming is non-standard and local branch config has anomalies.

## Responsibility
- Owns:
  - The npm package `@aftership/recommendation-admin-ts`, described in `package.json` as "recommendation web UI display in product admin site".
  - Exported admin surface: `RecommendationManage` and `RecommendationContext` from `src/index.ts`.
  - Onsite recommendation admin UI for `/recommendations`: campaign list, campaign editor, status enable/disable, create/delete, metrics display, Shopify view/open links, copy-code modal, onboarding/banner surfaces, and "Powered by AfterShip" setting UI.
  - Admin GraphQL caller layer for recommendation campaigns, products, banner config, common setting, and first-edit/first-publish status operations.
  - Admin preview shell that loads recommendation preview SDK assets and emits `renderRecommendationList` / `renderVariantPicker` events.
- Does not own:
  - Recommendation BFF GraphQL implementation, billing gating, storage status, banner config data, or downstream REST calls; these live in `bff-api.automizely.com_recommendation`.
  - Marketing host routing, navigation, feature gating, billing lock page, Crisp message wiring, auth context assembly, and store availability detection; these live in `marketing.automizely.com`.
  - Email editor "Product recommendations" blocks; those are defined and rendered inside `marketing.automizely.com` email editor/previewer code.
  - Storefront recommendation runtime/data service. This repo loads admin preview assets and declares `@aftership/recommendation-storefront-ts`, but BFF/data services own campaign persistence and product recommendation resolution.
- Common change areas:
  - `src/pages/RecommendationManage/**` for embedded page switching and wrapper auth.
  - `src/pages/RecommendationList/**` for list, metrics, enable/disable/delete, banners, and Shopify links.
  - `src/pages/RecommendationEdit/**` for form, settings/display/styles editor, save flow, preview, and host navigation hiding.
  - `src/graph/schemas/**`, `src/generated/graphql.ts`, `src/graph/index.ts`, and `src/utils/hooks/apolloClientWrapper.ts` for GraphQL contract/caller changes.
  - `src/components/RecommendationContext/index.tsx` for the host-to-SDK integration contract.
  - `craco.config.ts`, `carco.config.dev.ts`, `webpack.config.js`, `rollup.config.js`, and `codegen.yml` for MF/package/build/codegen behavior.

## Branch Tracks
- production:
  - `origin/master` exists at `2621c73` / tag `1.2.61` and appears to be the current upstream production line.
  - Local `master` and `local/master` are at `67f3867`, older than `origin/master`; do not assume local `master` is current without syncing.
- legacy_v9:
  - No `origin/master_v9` was present in local refs.
- active_major:
  - Generic notification tracks `origin/feat/flow-v3-polaris-v13` and `origin/feat/flow-v3` were not present.
  - Repo-specific active/migration branch observed: `origin/feat/migration_polaris_v13` at `39c7c1f`, merged into `origin/master` by PR #301.
  - Current local checkout branch is `feat/data-retention`, tracking `origin/feat/data-retention`.
- repo_specific_notes:
  - Remote abnormality: `origin` points to `git@github.com:AfterShip/recommendation-admin-ts.git`, while `local` points to `git@github.com:Wynne-cwb/recommendation-admin-ts.git`; there is no `upstream` remote. This is not fork-first naming.
  - `origin/HEAD` is not a symbolic ref.
  - Local git config contains `branch.feat/data-retention.vscode-merge-base upstrean/feat/migration_polaris_v13`; `upstrean` appears to be a typo, recorded only and not fixed.
  - `feat/data-retention-publish` tracks `origin/feat/migration_polaris_v13` and was reported `[ahead 1, behind 1]`; recorded only and not fixed.
  - `origin/publish` exists at `bf14c3d`; likely release/publish support, but its current process role is unconfirmed from code alone.

## Module Federation
- enabled:
  - Yes for CRACO configs. `craco.config.ts` configures `ModuleFederationPlugin` with `name: 'recommendation_admin'` and `filename: 'remoteEntry.js'`.
  - `carco.config.dev.ts` also configures `recommendation_admin` for local dev with `publicPath: 'http://localhost:3000/'`.
  - `webpack.config.js` is separate package/UMD build config with entry `src/index.ts` and `libraryTarget: 'umd'`.
- exposes:
  - `craco.config.ts`: `./RecommendationList` -> `./src/pages/RecommendationList`; `./RecommendationEdit` -> `./src/pages/RecommendationEdit`.
  - `carco.config.dev.ts`: same plus `./Remotes` -> `./src/Remotes`, where `src/Remotes/Remotes.tsx` is a demo-only component.
- remotes:
  - None found in this repo's MF config.
- shared_packages:
  - `react`, `react-dom`, `react-router-dom`, `@aftership/aha`, `@aftership/aha-icons`, `@shopify/polaris`, `@aftership/automizely-product-auth`.
  - `craco.config.ts` also lists `react-route`, likely intended to be `react-router` or a stale key; recorded only.
- branch_alignment:
  - MF config exists, but cross-repo host evidence shows `marketing.automizely.com` currently consumes `@aftership/recommendation-admin-ts` as an npm package, not as a `recommendation_admin/remoteEntry.js` remote.

## Team Repo Dependencies
- Direct dependencies:
  - `@aftership/admin-host-runtime`: used by `src/pages/RecommendationEdit/RecommendationEdit.tsx` to hide/show host navigation while editing.
  - `@aftership/automizely-product-auth`: used for auth headers, organization/connection/user info, store URL, and login/logout behavior.
  - `@aftership/automizely-frontend-dev-kit`: generated GraphQL hook wrapper types and auth effect network helper.
  - `@aftership/datacat`: `RecommendationContext` defaults for `gaClick` and `capture`.
  - `@aftership/widget-previewer`: admin preview iframe/render bridge.
  - `@aftership/recommendation-storefront-ts`: declared dependency, but no source import found in `src/`; likely legacy or indirect packaging dependency.
  - `@aftership/automizely-billing-ui-react` and `@aftership/conversions-billing-ui-react`: declared dependency/peer dependency; only test/typing evidence found locally for billing UI, while live billing gating is passed by the marketing host.
- Runtime calls:
  - Apollo BatchHttpLink calls `${process.env.RECOMMENDATION_API_PREFIX}/graphql`.
  - `.env.development` points local development to `http://localhost:9006/recommendation/admin`.
  - `config/legency-env.js` maps production to `https://bff-api.automizely.com/recommendation/admin`, staging to `https://staging-bff-api.automizely.com/recommendation/admin`, and testing/release to `https://bff-api.automizely.io/recommendation/admin`.
  - Preview loads SDK/style/template assets from `sdks.automizely.*` and `assets.am-static.com`, then sends render events through `@aftership/widget-previewer`.
  - Store URLs and headers come from `@aftership/automizely-product-auth` connection/organization APIs.
- Build-time dependencies:
  - `codegen.yml` expects a local schema at `http://localhost:9006/recommendation/admin/graphql`, so GraphQL codegen depends on the recommendation BFF running locally or being proxied there.
  - `graphql.config.json` still points at `http://localhost:9003/marketing/admin/graphql`; this appears stale or unrelated to the active recommendation codegen path.
  - `Jenkinsfile` uses frontend pipeline with app name `recommendation-admin-ts`, Node 16.13.0 image, `yarn test`, and `yarn prepublishOnly`.
- Shared packages:
  - React 18, AHA/AHA icons/AHA locale, Shopify i18n/app bridge, Apollo Client, Formik, Redux Saga, Swiper, Sentry, Axios, GraphQL Codegen, CRACO, webpack, rollup.
- Inferred but unconfirmed:
  - Package-to-source repo mapping for `@aftership/recommendation-storefront-ts` was not confirmed from this checkout.
  - MF remote may be available for future or alternate hosts, but current `marketing.automizely.com` evidence uses npm package import.
  - `config/env.js` returns `https://bff-api.automizely.com/recommendation/public/graphql` for non-testing production under `API_HOST`, but active Apollo code uses `RECOMMENDATION_API_PREFIX`; verify before changing old webpack/env behavior.

## Business Flows
- flow_id: onsite_recommendation_admin
- role:
  - Embedded admin UI for Marketing/Conversion Tools > Recommendations. It lets merchants manage onsite product recommendation campaigns by page/scene, edit presentation settings, enable/disable campaigns, inspect metrics, and get Shopify placement guidance.
- upstream/downstream repos:
  - Upstream/host: `marketing.automizely.com` imports `RecommendationManage` from `@aftership/recommendation-admin-ts`, wraps it in `RecommendationContext.Provider`, and routes `/recommendations` to it.
  - Downstream BFF: `bff-api.automizely.com_recommendation` provides matching GraphQL operations and bridges to `data-recommendation` onsite-widget APIs.

- flow_id: recommendation_campaign_crud_and_status
- role:
  - UI calls `getRecommendationsList`, `getRecommendation`, `updateRecommendation`, `deleteRecommendation`, and `setRecommendationStatus`. BFF performs plan gating, campaign CRUD, first edit/publish storage status, and default campaign initialization.
- upstream/downstream repos:
  - `recommendation-admin-ts` -> `bff-api.automizely.com_recommendation` -> `data-recommendation.as-in.* /recommendation/onsite-widget/:version`.

- flow_id: recommendation_admin_preview
- role:
  - Editor preview loads admin recommendation SDK/style/template assets, fetches products, and emits `renderRecommendationList` or `renderVariantPicker` messages into the previewer.
- upstream/downstream repos:
  - `recommendation-admin-ts` -> `@aftership/widget-previewer` -> `sdks.automizely.* /recommendations/v1/am-recommendations-admin.umd.js` and `assets.am-static.com` template HTML.

- flow_id: shopify_manual_placement
- role:
  - `CopyCodeModal` generates `<div campaignId="..."></div>`, copies it, opens Shopify theme editor, and marks first publish through `setRecommendationStatus`.
- upstream/downstream repos:
  - `recommendation-admin-ts` -> Shopify admin URL from product-auth connection; status persisted through recommendation BFF.

- flow_id: marketing_recommendation_banner
- role:
  - Renders recommendation page banner blocks from `getBannerConfigList` and reports banner view/click events.
- upstream/downstream repos:
  - `recommendation-admin-ts` -> `bff-api.automizely.com_recommendation` config-center/static banner config; host supplies Datacat capture.

- flow_id: email_product_recommendation_blocks
- role:
  - Not owned by this repo. The marketing host email editor owns `EmailBlockType.product` / `EmailBlockType.newProduct`, block adder entries, previewer components, and Go-template functions such as `QueryRecommendedProducts`.
- upstream/downstream repos:
  - Adjacent host code: `marketing.automizely.com/src/_components/email/**`; no import from `recommendation-admin-ts` found for email blocks.

## Important Entrypoints
- path: `package.json`
- why it matters: Defines package name/version/main, npm/webpack/codegen scripts, dependencies, peer dependencies, and external packages.

- path: `src/index.ts`
- why it matters: Public package entry exports `RecommendationManage` and `RecommendationContext`.

- path: `src/pages/RecommendationManage/index.tsx`
- why it matters: Wrapper consumes host-provided `authInfo`, waits for authentication via `useAuthEffect`, and wraps page with `AppWrapper` and `ErrorHandleProvider`.

- path: `src/pages/RecommendationManage/RecommendationManage.tsx`
- why it matters: Embedded page switcher for `/recommendations`; uses query params `sceneId` / `campaignId` to enter edit mode and otherwise renders list mode.

- path: `src/pages/RecommendationList/RecommendationList.tsx`
- why it matters: Fetches recommendation list, shows page-scene groups, banners, onboarding/copy-code triggers, and create/edit navigation.

- path: `src/pages/RecommendationList/components/RecommendationListItem/index.tsx`
- why it matters: Handles metrics display, status toggles, one-enabled-campaign modal, delete flow, store links, pagination, and data retention tooltips.

- path: `src/pages/RecommendationEdit/RecommendationEdit.tsx`
- why it matters: Main campaign editor; loads detail/list, saves `UpdateRecommendations`, hides host navigation with `updateNavigation`, and provides editor/preview context.

- path: `src/pages/RecommendationEdit/components/EditorSidePanel/**`
- why it matters: Settings/Display/Styles tabs own campaign title/status/type/location/branding, layout, product info, content/action button, fonts, colors, and padding controls.

- path: `src/pages/RecommendationEdit/components/Preview/**`, `src/constants/previewSDK.ts`, `src/utils/preview.ts`
- why it matters: Preview loads SDK assets and emits recommendation/variant-picker render messages.

- path: `src/graph/index.ts`
- why it matters: Apollo client setup, auth headers, persisted queries, logout handling, and BFF GraphQL URI construction.

- path: `src/graph/schemas/**`
- why it matters: Source GraphQL operations for campaign CRUD/list/detail/products/banner/common-setting/status.

- path: `src/components/RecommendationContext/index.tsx`
- why it matters: Host integration contract: environment, banners, onboarding, brand-setting capability, demo/store availability, Crisp, Datacat, and auth headers.

- path: `craco.config.ts`, `carco.config.dev.ts`
- why it matters: Module Federation remote config for `recommendation_admin/remoteEntry.js`.

- path: `webpack.config.js`, `rollup.config.js`
- why it matters: Package/UMD and alternate bundle build entrypoints.

- path: `codegen.yml`
- why it matters: GraphQL codegen schema and document source for generated hooks/types.

- path: cross repo `marketing.automizely.com/src/views/recommendation/RecommendationList/index.tsx`
- why it matters: Host integration evidence: imports SDK package, provides context, billing feature gating, Crisp, Datacat, auth, and title badge.

- path: cross repo `bff-api.automizely.com_recommendation/src/datasources/recommendation/**`
- why it matters: BFF implementation evidence for the GraphQL operations this SDK calls.

## Evidence
- file_or_command: `package.json`
- finding: Package is `@aftership/recommendation-admin-ts` version `1.2.61`, main `dist/index.js`, description says it is the recommendation web UI display package for product admin site; build uses webpack, codegen uses GraphQL Codegen.

- file_or_command: `src/index.ts`
- finding: Public exports are `RecommendationManage` and `RecommendationContext`.

- file_or_command: `src/pages/RecommendationManage/index.tsx`
- finding: Wrapper reads `RecommendationContext.authInfo`, calls `useAuthEffect`, and only renders when authenticated.

- file_or_command: `src/pages/RecommendationManage/RecommendationManage.tsx`
- finding: Embedded manager only renders when pathname includes `/recommendations`; switches between list and edit using `sceneId` and `campaignId`.

- file_or_command: `src/pages/RecommendationEdit/RecommendationEdit.tsx`
- finding: Uses `useGetRecommendationDetailLazyQuery`, `useGetRecommendationsListLazyQuery`, and `useUpdateRecommendationMutation`; hides host nav via `@aftership/admin-host-runtime`.

- file_or_command: `src/graph/index.ts`
- finding: Apollo client sends auth/organization/app headers from product-auth and calls `${process.env.RECOMMENDATION_API_PREFIX}/graphql`.

- file_or_command: `.env.development`, `config/legency-env.js`, `codegen.yml`
- finding: Local/dev GraphQL target is `localhost:9006/recommendation/admin`; production mapping is `https://bff-api.automizely.com/recommendation/admin`; codegen schema is `http://localhost:9006/recommendation/admin/graphql`.

- file_or_command: `src/graph/schemas/queries/*.graphql`, `src/graph/schemas/mutations/*.graphql`
- finding: Operations include recommendation list/detail/default/products, banner config, automation branding/common setting, create/update/delete/set status.

- file_or_command: `src/pages/Modal/CopyCodeModal/CopyCodeModal.tsx`
- finding: Copy-code modal generates `<div campaignId="${campaignId}"></div>`, opens Shopify theme editor, and calls `setRecommendationStatus` with `FIRST_PUBLISH_RECOMMENDATION`.

- file_or_command: `src/pages/RecommendationEdit/components/Preview/ModalItem/usePreview.ts`, `src/constants/previewSDK.ts`
- finding: Preview loads `am-recommendations-admin.umd.js`, `style.css`, and template HTML from sdks/assets domains and ignores existing conversions/recommendations storefront scripts.

- file_or_command: `src/utils/preview.ts`, `src/pages/RecommendationEdit/components/Preview/ModalItem/RecommendationProductView.tsx`
- finding: Preview messages are `renderRecommendationList` and `renderVariantPicker`; product data is fetched through `useGetProductsLazyQuery`.

- file_or_command: `craco.config.ts`, `carco.config.dev.ts`
- finding: Module Federation remote name is `recommendation_admin`, filename `remoteEntry.js`, exposes recommendation list/edit pages; dev config also exposes a demo `./Remotes`.

- file_or_command: `webpack.config.js`
- finding: Package build entry is `src/index.ts` and output is UMD under `dist`.

- file_or_command: `GIT_OPTIONAL_LOCKS=0 git remote -v`
- finding: `origin` is company repo and `local` is user fork; no `upstream` remote exists, so current checkout is not fork-first named.

- file_or_command: `GIT_OPTIONAL_LOCKS=0 git branch --all --verbose --no-abbrev`
- finding: Current branch `feat/data-retention`; local/remote refs include `origin/master`, `origin/feat/migration_polaris_v13`, `origin/publish`, `origin/feat/data-retention`; generic `master_v9` / `feat/flow-v3*` tracks absent from local refs.

- file_or_command: `GIT_OPTIONAL_LOCKS=0 git config --get-regexp '^(remote|branch)\.'`
- finding: Branch config includes typo-like `upstrean/feat/migration_polaris_v13` merge-base and non-standard tracking relationships; recorded only, not fixed.

- file_or_command: cross repo `marketing.automizely.com/package.json`
- finding: Marketing host depends on `@aftership/recommendation-admin-ts` version `1.2.60-alpha.1`.

- file_or_command: cross repo `marketing.automizely.com/src/views/recommendation/RecommendationList/index.tsx`
- finding: Host imports `RecommendationContext` and `RecommendationManage as RecommendationListSDK`, provides env, onboarding, top banner, brand setting config, demo/store state, Crisp, Datacat, authInfo, and billing title badge.

- file_or_command: cross repo `marketing.automizely.com/src/Routes.tsx`, `src/components/Navigation/NavigationMain/NavigationMain.tsx`
- finding: Host routes `/recommendations` to its wrapper and navigation points Conversion Tools/Recommendations there.

- file_or_command: cross repo `bff-api.automizely.com_recommendation/graphql/query.graphql`, `graphql/mutation.graphql`
- finding: BFF schema exposes matching queries/mutations used by this SDK.

- file_or_command: cross repo `bff-api.automizely.com_recommendation/src/datasources/recommendation/service.ts`
- finding: BFF uses `RECOMMENDATION_ADMIN_API_PREFIX` and REST paths `/campaigns`, `/campaign`, `/campaigns/init`.

- file_or_command: cross repo `bff-api.automizely.com_recommendation/src/datasources/recommendation/controller.ts`
- finding: BFF groups campaigns by the same scene ids, initializes campaigns, handles first publish/edit storage status, plan gating, and banner filtering.

- file_or_command: cross repo `bff-api.automizely.com_recommendation/config/*.js`
- finding: BFF maps `RECOMMENDATION_ADMIN_API_PREFIX` and `DATA_RECOMMENDATION_API_PREFIX` to `data-recommendation.as-in.* /recommendation/onsite-widget/:version`.

- file_or_command: cross repo `marketing.automizely.com/src/_components/email/common/ContentPanel/blockMap.ts`, `BlocksAdderContainer`, `Previewer/components/Block/components/*RecommendedProducts*`
- finding: Email Product recommendations blocks are implemented in marketing host email editor/previewer and generate Go-template calls such as `QueryRecommendedProducts`; no ownership evidence in `recommendation-admin-ts`.

## Open Questions
- question: Should `config/env.js` production `API_HOST` still point to `/recommendation/public/graphql`?
- why it matters: Main Apollo code uses `RECOMMENDATION_API_PREFIX`, but stale or alternate env config could confuse future webpack/UMD consumers.

- question: Is Module Federation remote still actively consumed by any host, or is npm package import now the only supported integration?
- why it matters: MF exposes list/edit pages, but the observed marketing host uses `@aftership/recommendation-admin-ts` as a package.

- question: Is `@aftership/recommendation-storefront-ts` still required?
- why it matters: It is declared in `package.json`, but no direct `src/` import was found; removing or updating it should be verified against published bundle expectations.

- question: What is the intended role of `origin/publish` and local `feat/data-retention-publish`?
- why it matters: Publish branch config is non-obvious and may affect npm release workflow.

- question: Which repo owns the deployed `sdks.automizely.* /recommendations/v1/am-recommendations-admin.umd.js` asset?
- why it matters: The admin preview depends on this runtime, but ownership is not proven inside this checkout.
