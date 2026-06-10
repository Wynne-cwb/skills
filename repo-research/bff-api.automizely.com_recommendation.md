# bff-api.automizely.com_recommendation

## Summary
- project_id: bff-api.automizely.com_recommendation
- repo_name: bff-api.automizely.com_recommendation
- upstream_url: https://github.com/AfterShip/bff-api.automizely.com_recommendation
- local_path: /Users/wb.chen/Documents/AfterShip/Automizely Marketing/bff-api.automizely.com_recommendation
- repo_type: TypeScript / Node.js / Koa / Apollo GraphQL BFF for onsite product recommendation admin and public/storefront APIs.
- confidence: high. Evidence includes `package.json`, Koa/Apollo entrypoints, GraphQL schemas/resolvers, datasource REST calls, env configs, git remotes/branches, and local consumer references in `recommendation-admin-ts`, `marketing.automizely.com`, and `sdks.automizely.com_conversions`.

## Responsibility
- Owns: Recommendation GraphQL BFF under `/recommendation/admin/graphql` and `/recommendation/public/graphql`; admin campaign list/detail/create/update/delete/init/status APIs; public recommendation product resolution; recommendation banner config/status; store/header validation; billing feature gating for onsite recommendations; conversions storage status and common settings proxying; product lookup proxying; DMS recommendation metric aggregation.
- Does not own: Data-recommendation backend algorithms/storage; Connectors product service; Marketing Conversions storage backend; Marketing Feature Management; DMS; frontend admin UI; storefront SDK rendering; email editor/product recommendation blocks; Module Federation remotes.
- Common change areas: `graphql/recommendation/**`, `graphql/public/recommendation/**`, `src/datasources/recommendation/**`, `src/datasources/public/Data/**`, `src/datasources/product/**`, `src/datasources/storageStatus/**`, `src/datasources/billing/**`, `src/datasources/dms/**`, `src/middlewares/**`, `config/*.js`, `src/utils/RESTDataSourceBasic.ts`.

## Branch Tracks
- production: `master` exists locally and in both `origin` and `upstream`; treat as the production/stable branch. Evidence: `git branch --all --format='%(refname:short)'` returned `master`, `origin/master`, and `upstream/master`.
- legacy_v9: not found. Evidence: targeted branch checks found no `master_v9` local/origin/upstream ref.
- active_major: protocol candidates not found. Evidence: targeted branch checks found no `feat/flow-v3-polaris-v13` or `feat/flow-v3`; only `origin/feat/billing-interaction` appeared as a feature branch.
- repo_specific_notes: checkout is fork-first shaped: `origin` is `git@github.com:Wynne-cwb/bff-api.automizely.com_recommendation.git`, `upstream` is `git@github.com:AfterShip/bff-api.automizely.com_recommendation.git`. Current local branch is `master` tracking `origin/master`; worktree has an untracked `.codegraph/` directory that was not modified.

## Module Federation
- enabled: false / no evidence in this repo.
- exposes: none.
- remotes: none.
- shared_packages: not applicable as MF config. Runtime/build packages include Apollo/Koa/GraphQL, `@aftership/config-center-sdk`, `@aftership/nodejs-common`, and `@aftership/react-email-module`.
- branch_alignment: not applicable. Related frontend `recommendation-admin-ts` does use Module Federation name `recommendation_admin`, but this BFF is a server API, not an MF remote.

## Team Repo Dependencies
- Direct dependencies: `@aftership/config-center-sdk` for config-center integration, `@aftership/nodejs-common` for mapped org id helper, and `@aftership/react-email-module` as a package dependency. No source import of `@aftership/react-email-module` was found in this repo.
- Runtime calls: `data-recommendation` onsite-widget APIs via `RECOMMENDATION_ADMIN_API_PREFIX` and `DATA_RECOMMENDATION_API_PREFIX`; Connectors product APIs via `CONNECTION_PLATFORM_API_PREFIX`; Business organization connections via `BUSINESS_API_PREFIX`; Marketing Feature Management via `MARKETING_FEATURE_API_PREFIX`; Marketing Conversions internal APIs via `MARKETING_API_PREFIX`; DMS recommendation event/revenue APIs via `DATA_DMS_API_PREFIX`.
- Build-time dependencies: GraphQL codegen (`src/generateTypes.ts`, `codegen.yml`), TypeScript build, Apollo/Koa runtime, Jenkins Node.js flow, Docker Node 14 image.
- Shared packages: `@aftership/nodejs-common`, `@aftership/config-center-sdk`, `@aftership/react-email-module`; frontend consumers use `@aftership/recommendation-admin-ts` and `@aftership/recommendation-storefront-ts`, but those are not dependencies of this BFF.
- Inferred but unconfirmed: exact owning repo for the `data-recommendation.as-in.*` service was not confirmed from this checkout. `sdks.am-static.com_admin-marketing-data` appears related only by analytics domain vocabulary; no direct import, GraphQL call, or package dependency from this BFF to that repo was found.

## Business Flows
- flow_id: onsite_recommendation_admin
- role: Admin GraphQL BFF for product recommendation list/edit/publish/delete/init/banner/status flows. It checks `feature:cv_tools:page_blocks:recommendation`, validates connected store headers, proxies campaign CRUD to data-recommendation, and persists first-edit/first-publish/init/banner status through Marketing Conversions storage APIs.
- upstream/downstream repos: upstream consumers include `recommendation-admin-ts` and `marketing.automizely.com`; downstream services include data-recommendation, Marketing Feature Management, Marketing Conversions, Business connections, and Connectors products.

- flow_id: onsite_recommendation_public_storefront
- role: Public/storefront GraphQL BFF. It resolves `conversions-connection-id` to org/app headers, checks recommendation availability, calls data-recommendation `/items`, resolves campaign detail when only a campaign id is returned, fetches product details from Connectors, filters unpublished/unavailable products, preserves recommendation order, and appends `algo_id`, `am_trace_id`, and `campaign_id` to product URLs.
- upstream/downstream repos: upstream storefront relationship is through `sdks.automizely.com_conversions` loading `@aftership/recommendation-storefront-ts`; downstream services are Marketing Conversions connection lookup, data-recommendation, Connectors products, and Marketing Feature Management.

- flow_id: recommendation_metrics
- role: Exposes `getDmsStatistic` to combine view/click data from `/api/mt/v1/marketing-on-site-reco-events` with revenue/conversion data from `/api/mt/v2/marketing-on-site-reco-revenue`.
- upstream/downstream repos: upstream admin frontend has generated types for `getDmsStatistic`, though no active local usage was found; downstream is DMS.

- flow_id: recommendation_admin_marketing_shell
- role: `marketing.automizely.com` embeds `@aftership/recommendation-admin-ts`, routes `/recommendations`, and directs Apollo operations with context `app === 'recommendation'` to `RECOMMENDATION_API_PREFIX/graphql`, whose env config maps to this BFF's `/recommendation/admin` endpoint.
- upstream/downstream repos: upstream host `marketing.automizely.com`; embedded package `recommendation-admin-ts`; downstream this BFF.

- flow_id: email_recommendation_blocks
- role: This BFF does not own email recommendation blocks. Email block evidence lives in `marketing.automizely.com` feature slugs and email editor block definitions (`feature:emails:content_blocks:recommendation_basic` and `feature:emails:content_blocks:recommendation_ai`). This repo only gates onsite page-block recommendations with `feature:cv_tools:page_blocks:recommendation`; its `@aftership/react-email-module` dependency is present but not imported in source.
- upstream/downstream repos: email block UI/rendering appears owned by marketing/email frontend surfaces and related backend(s), not this BFF. Confirm exact backend owner separately.

## Important Entrypoints
- path: `src/main.ts`
- why it matters: service bootstrap; runs codegen in development, imports New Relic in production/testing, creates the HTTP server, listens on configured port, and starts Grafana metrics.

- path: `src/app.ts`
- why it matters: creates Koa app and mounts admin/public GraphQL endpoints at `${basicPath}/admin/graphql` and `${basicPath}/public/graphql`.

- path: `src/apolloServer.ts`
- why it matters: builds admin and public Apollo servers, wires schema/resolvers/datasources, and uses store verification for admin versus organization-header resolution for public.

- path: `src/schema.ts`
- why it matters: merges admin schema from `graphql/**` plus `query.graphql`/`mutation.graphql`; merges public schema from `publicQuery.graphql`, `public/*/*.graphql`, and shared recommendation/common schemas.

- path: `src/resolvers.ts` and `src/publicResolver.ts`
- why it matters: dynamically discovers and merges datasource resolver files for admin and public GraphQL surfaces.

- path: `src/datasources/index.ts`
- why it matters: authoritative datasource registry: product, recommendation, organization, storageStatus, public data, billing, DMS, user, and publicUser.

- path: `src/datasources/recommendation/service.ts`
- why it matters: admin campaign REST proxy to data-recommendation: `/campaigns`, `/campaign`, `/campaigns/init`, plus default detail and banner config.

- path: `src/datasources/recommendation/controller.ts`
- why it matters: BFF orchestration for billing gates, init status, first edit/publish status, grouped page scenes, and banner-dismiss state.

- path: `src/datasources/public/Data/service.ts`
- why it matters: public recommendation product flow: data-recommendation `/items`, fallback campaign lookup, product detail lookup, filtering, ordering, and URL attribution.

- path: `src/utils/RESTDataSourceBasic.ts`
- why it matters: common downstream REST base URL resolution, trace/api key forwarding, app/org header propagation, keep-alive fetch, and request/response error logging.

- path: `src/middlewares/handleVerifyStore.ts` and `src/middlewares/handleOrganzationHeader.ts`
- why it matters: admin store validation and public `conversions-connection-id` to org/app header hydration.

- path: `config/development.js`, `config/testing.js`, `config/production.js`
- why it matters: maps BFF datasources to concrete internal service hosts for recommendation, conversions, feature management, connectors, businesses, DMS, and billing config.

## Evidence
- file_or_command: `package.json`
- finding: package name is `bff-api.automizely.com_recommendation`; description says "Graphql server for recommendation"; scripts run codegen/build/start; dependencies include Apollo/Koa/GraphQL and AfterShip packages.

- file_or_command: `src/app.ts`
- finding: mounts admin GraphQL at `/recommendation/admin/graphql` and public GraphQL at `/recommendation/public/graphql` when `basicPath` is `/recommendation`.

- file_or_command: `src/apolloServer.ts`
- finding: admin server uses `handleVerifyStore`; public server uses `handleOrganzationHeader`; both share datasources and Apollo plugins.

- file_or_command: `graphql/query.graphql` and `graphql/mutation.graphql`
- finding: admin API exposes user profile, storage status, product lookup, recommendation list/detail/default/products/banner/DMS queries, and recommendation create/delete/update/init/status/banner/common-setting mutations.

- file_or_command: `graphql/publicQuery.graphql` and `graphql/public/recommendation/*.graphql`
- finding: public API exposes `getRecommendationProducts`, `getStoreSettings`, `isSoldOut`, connector id lookup, and public user profile/common settings.

- file_or_command: `src/datasources/recommendation/service.ts`
- finding: `RECOMMENDATION_ADMIN_API_PREFIX` calls `/campaigns`, `/campaign`, `/campaigns/init`; missing campaign id returns local default detail; v1 campaign data may be transformed to v2.

- file_or_command: `src/datasources/recommendation/controller.ts`
- finding: create/delete/update/idempotent update/status all check `billing.getRecommendationFeatureCode()`; list flow initializes default campaigns and reads/writes `INIT_RECOMMENDATIONS`, `FIRST_EDIT_RECOMMENDATION`, and `FIRST_PUBLISH_RECOMMENDATION`.

- file_or_command: `src/datasources/public/Data/service.ts`
- finding: public recommendation calls data-recommendation `/items`, requires original org id, gates by billing availability, can resolve campaign detail by id, fetches Connectors products, filters unavailable variants, and appends recommendation attribution params.

- file_or_command: `src/datasources/product/service.ts`
- finding: product data comes from Connectors `v2` `/products` and `/products-search`.

- file_or_command: `src/datasources/billing/service.ts`
- finding: billing gate is implemented by Marketing Feature Management `feature-management/internal/feature-control/list.action`; onsite feature slug is `feature:cv_tools:page_blocks:recommendation`.

- file_or_command: `src/datasources/storageStatus/service.ts`, `src/datasources/user/service.ts`, `src/middlewares/handleVerifyStore.ts`, `src/middlewares/handleOrganzationHeader.ts`
- finding: Marketing Conversions internal API is used for store connection validation, conversions connection lookup, store/organization storage status, user profile, and common settings.

- file_or_command: `src/datasources/dms/service.ts` and `graphql/dms/*.graphql`
- finding: DMS metrics come from `marketing-on-site-reco-events` and `marketing-on-site-reco-revenue`, mapped into `views`, `clicks`, `conversion_rate`, `revenue`, and `currency`.

- file_or_command: `config/production.js`
- finding: production downstream prefixes include `pltf-billing`, `pltf-connectors`, `pltf-businesses`, `data-recommendation`, `prod-mt-featuremgmt`, `prod-mt-convtools`, and `data-dms`.

- file_or_command: `find . -maxdepth 4 -type f -name '*webpack*' -o -name '*module-federation*' ...`
- finding: no Module Federation/Webpack/Vite config was found in this repo.

- file_or_command: `rg "admin-marketing-data|notificationAnalytics|marketingData|EmailBlock|content_blocks:recommendation|recommendation_basic|recommendation_ai|@aftership/react-email-module" package.json src graphql`
- finding: only `package.json` contains `@aftership/react-email-module`; no direct admin-marketing-data or email recommendation block implementation was found in this BFF.

- file_or_command: `recommendation-admin-ts/src/hooks/useAuthEffect.ts`
- finding: standalone recommendation admin UI registers GraphQL host mappings to `https://bff-api.automizely.com/recommendation/admin/graphql`, staging, and testing equivalents.

- file_or_command: `recommendation-admin-ts/src/graph/schemas/**`
- finding: frontend GraphQL documents call this BFF operations such as `getRecommendationsList`, `getBannerConfigList`, `createRecommendation`, `updateRecommendation`, and `setRecommendationStatus`.

- file_or_command: `marketing.automizely.com/src/graph/index.ts` and `marketing.automizely.com/config/env.js`
- finding: marketing host splits Apollo traffic when `operation.getContext().app === 'recommendation'` to `RECOMMENDATION_API_PREFIX/graphql`; env config maps that prefix to `/recommendation/admin`.

- file_or_command: `marketing.automizely.com/package.json` and `marketing.automizely.com/src/views/recommendation/RecommendationList/index.tsx`
- finding: marketing host depends on and embeds `@aftership/recommendation-admin-ts` for `/recommendations`.

- file_or_command: `sdks.automizely.com_conversions/package.json` and `src/automizelySDK/helpers/initialize.js`
- finding: storefront conversions SDK depends on `@aftership/recommendation-storefront-ts` and lazily initializes recommendation SDK on store pages, which is the likely upstream public/storefront consumer path.

- file_or_command: `git remote -v`
- finding: fork-first remotes are configured: `origin` points to `Wynne-cwb`, `upstream` points to `AfterShip`.

- file_or_command: `git branch --all --format='%(refname:short)'`
- finding: branch refs include `master`, `origin/master`, `upstream/master`, and `origin/feat/billing-interaction`; no protocol active-major or legacy branch refs were present locally.

## Open Questions
- question: Which repo owns the `data-recommendation.as-in.*` onsite-widget backend?
- why it matters: this BFF heavily proxies `campaigns`, `campaign`, `init`, and `items` APIs, but the backend owner is only visible as service host config, not repo evidence.

- question: Is `@aftership/react-email-module` a stale dependency or a hidden/generated dependency?
- why it matters: source search found no import; avoid recording email-block ownership as this BFF responsibility unless historical or generated usage is confirmed.

- question: Should `getDmsStatistic` still be considered active?
- why it matters: this BFF exposes and implements it, but local frontend search only found generated types, not active query usage.

- question: Should active development ever use `origin/feat/billing-interaction`?
- why it matters: protocol active-major branches are absent; the only non-master feature ref found locally is billing-specific and may not be a general task base.
