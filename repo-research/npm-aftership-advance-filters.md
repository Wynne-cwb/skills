# npm-aftership-advance-filters

## Summary
- project_id: npm-aftership-advance-filters
- repo_name: npm-aftership-advance-filters
- upstream_url: https://github.com/AfterShip/npm-aftership-advance-filters
- local_path: /Users/wb.chen/Documents/AfterShip/Notification/npm-aftership-advance-filters
- repo_type: npm package / SolidJS UI SDK for Platform Notification advanced condition filters
- confidence: high for package responsibility, entrypoints, runtime BFF calls, branch tracks, and direct package consumers found in local checkouts; medium for broader migration intent because it is inferred from adjacent repo usage and conversion docs.

## Responsibility
- Owns:
  - `@aftership/advance-filters`, described in `package.json` as "Platform notification filters sdk".
  - SolidJS advanced filter rendering from `IAdvanceFilterItem[]` config into editable compound condition expressions.
  - Filter UI component primitives and business components for `Section`, `Column`, `Select`, `Input`, `AutoComplete`, `DateTimePicker`, `MultipleSelect`, `Tree`, `InputTags`, `ProductSelect`, and `Text`.
  - `renderAdvanceFilters` / `renderComponent` imperative render APIs for React or other hosts to mount SolidJS UI into a DOM node.
  - Client-side fetching and sessionStorage caching for conditional data sources and products-with-store data used by filter controls.
  - Shape conversion guidance from legacy `default` / `operate` filter config to new `initialValues` / `uiSchema`.
- Does not own:
  - Business-specific filter declarations or persisted condition configs; callers pass `config`, `initialValues`, and `uiSchema`.
  - Notification BFF GraphQL resolvers such as `conditionalDataSource` and `productsWithStore`.
  - CRM segment CRUD, old multi-filter configs, or legacy `@aftership/am-filters` interpreters.
  - Dynamic form rendering; that remains in `@aftership/am-dynamic-form` and is colocated with advance filters only through `@aftership/snap-form`.
  - Module Federation host/remotes; this repo builds a Vite library, not an MF app.
- Common change areas:
  - Filter expression types and config schema: `src/types/Config.ts`, `src/types/Expression.ts`.
  - Main render API: `src/render.tsx`, `src/index.ts`.
  - Filter editor/runtime UI: `src/core/Entry/index.tsx`, `src/components/Business/AdvancedFilter/index.tsx`, `src/components/Business/FormItem/index.tsx`.
  - Conditional/format scripts: `src/components/Common/WithBasic/index.tsx`, `src/hooks/useExecutionScript.ts`, `src/worker/executionScript.worker.ts`.
  - Remote data controls: `src/components/Business/SelectFilter`, `MultipleSelectFilter`, `TreeFilter`, `ProductSelect`, `src/utils/http.ts`, `src/utils/storage.ts`.
  - Migration/config docs: `docs/filter-structure-conversion-rules.md`.

## Branch Tracks
- production:
  - `master` exists locally and as `origin/master`.
  - Current `master` local branch tracks `local/master`, not an `upstream/*` remote.
- legacy_v9:
  - Not found. No local or remote `master_v9` ref in the local checkout.
- active_major:
  - Not found for protocol candidates. No local or remote `feat/flow-v3-polaris-v13` or `feat/flow-v3` ref in the local checkout.
  - Repo-specific active branch appears to be `testing`: current branch is `testing`, and `origin/testing` exists.
- repo_specific_notes:
  - Branch model appears package-specific: `master` plus `testing`, with two Dependabot branches on the company remote.
  - Remote anomaly recorded, not fixed: `origin` points to company upstream `git@github.com:aftership/npm-aftership-advance-filters.git`; the user's fork is configured as remote `local` (`git@github.com:Wynne-cwb/npm-aftership-advance-filters.git`); there is no remote named `upstream`.
  - Current branch `testing` tracks `local/testing` and reports `ahead 74`, while `origin/testing` points at the current HEAD. This is inconsistent with the fork-first convention and should be handled later by a git doctor workflow, not during this read-only research.

## Module Federation
- enabled: false in this repo.
- exposes: none found.
- remotes: none found.
- shared_packages:
  - Not configured through Module Federation.
  - Vite library build externalizes peer-ish packages `clsx`, `lodash-es`, `dayjs`, and `uuid`; `solid-js` and `tippy.js` are package dependencies.
- branch_alignment:
  - No MF branch alignment evidence in this repo.
  - Consumers are MF or app repos in some cases (`aio-notification`, `fe-pltf-ens-admin`), but `npm-aftership-advance-filters` itself is consumed as an npm package.

## Team Repo Dependencies
- Direct dependencies:
  - No direct dependency on another AfterShip team repo inside this package's `package.json`; only the package name itself is under `@aftership`.
  - Runtime package dependencies are external/open packages such as `solid-js`, `tippy.js`, `clsx`, `dayjs`, `lodash-es`, and `uuid`.
- Runtime calls:
  - Calls marketing admin v2 GraphQL endpoint selected by hostname: local `http://localhost:9006/marketing/admin/v2/graphql`, testing `https://release-incy-bff-api.automizely.io/marketing/admin/v2/graphql`, staging `https://staging-bff-api.automizely.com/marketing/admin/v2/graphql`, production `https://bff-api.automizely.com/marketing/admin/v2/graphql`.
  - Uses `window.getAuth()` in non-development hosts and sends `am-app-key`, `am-app-name`, `am-app-platform`, `am-organization-id`, `authorization`, `am-product-code`, and `am-env` headers.
  - Queries `conditionalDataSource(input)` for generic remote select/tree/autocomplete options.
  - Queries `productsWithStore(input)` for `ProductSelect`.
- Build-time dependencies:
  - Vite 6, Solid plugin, DTS plugin, Sass embedded, Babel/Solid undestructure plugin.
  - No GraphQL codegen or generated schema step in this repo.
- Shared packages:
  - Consumed directly by `aio-notification` (`@aftership/advance-filters` dependency and direct `renderAdvanceFilters` import).
  - Consumed by `snap-form` (`@aftership/advance-filters` dependency); `snap-form` re-exports `renderAdvanceFilters`, `getAdvanceFiltersDataSourceCache`, and `getProductWithStoreCache`.
  - Consumed transitively by `fe-pltf-ens-admin` through `@aftership/snap-form`; lockfile resolves `@aftership/snap-form` to `@aftership/advance-filters` and `@aftership/am-dynamic-form`.
- Inferred but unconfirmed:
  - `advance-filters` appears to be the newer advanced-condition UI direction for flow condition declarations, while older Notification/CRM surfaces still use `@aftership/am-filters` and `@aftership/am-dynamic-form`. Evidence is strong for coexistence and migration pressure, but this repo does not contain a formal product decision doc.
  - The package has likely been wrapped by `@aftership/snap-form` so flow UI can use one editor shell for both dynamic forms and advanced filters.

## Business Flows
- flow_id: notification_advanced_condition_filters
- role:
  - Frontend SDK that renders condition declaration UI, lets users add groups/rules, applies `and`/`or` operators, validates field controls, and emits `ConditionCompoundExpression` back to the host.
  - Runtime option loader for condition field values through marketing admin v2 BFF `conditionalDataSource` and `productsWithStore`.
- upstream/downstream repos:
  - Upstream data provider: `bff-api.automizely.com_marketing_admin_v2` exposes `conditionalDataSource` and `productsWithStore`.
  - Direct UI consumer: `aio-notification` imports `@aftership/advance-filters`, fetches `conditionalConfig`, maps returned config by category, and calls `renderAdvanceFilters`.
  - Editor/wrapper consumer: `snap-form` depends on `@aftership/advance-filters`, provides `AdvanceFiltersEditor`, and re-exports `renderAdvanceFilters` and cache readers.
  - Flow declaration UI consumer: `fe-pltf-ens-admin` imports `renderAdvanceFilters` and cache readers from `@aftership/snap-form` for flow template / declaration preview screens.

- flow_id: snap_form_advance_filters_editor
- role:
  - `advance-filters` supplies the rendered preview/runtime components while `snap-form` owns the React/GrapesJS editor shell, traits, code editor, and mode switching between `dynamic-form` and `advance-filters`.
- upstream/downstream repos:
  - `snap-form` depends on both `@aftership/advance-filters` and `@aftership/am-dynamic-form`, then re-exports both rendering APIs.
  - `fe-pltf-ens-admin` consumes `@aftership/snap-form` for both advanced filters and dynamic forms in flow template/declaration pages.

- flow_id: crm_segments_and_legacy_filters
- role:
  - `advance-filters` does not own CRM segment management or legacy multi-filter interpretation.
  - Relationship is adjacent: BFF/CRM repos still use `@aftership/am-filters` for segment and multi-filter config/interpreter flows, while `advance-filters` is the newer condition UI package.
  - BFF field item services can source segment items from `SegmentService`; `conditionalDataSource` can source external tags through ACRM field values and generic UI assets.
- upstream/downstream repos:
  - `sdks.am-static.com_admin-crm` owns segment UI exports and still depends on `@aftership/am-filters`.
  - `bff-api.automizely.com_marketing_admin_v2` owns CRM segment resolvers/services and uses `@aftership/am-filters` for legacy conversion such as `SegmentV1ToSegmentV2`.
  - `sdks.am-static.com_admin-flow`, `sdks.am-static.com_admin-crm`, `sdks.am-static.com_admin-marketing-basic`, and `sdks.am-static.com_admin-sms` still depend on `@aftership/am-filters`; `admin-marketing-basic` also depends on `@aftership/am-dynamic-form`.

## Important Entrypoints
- path: `package.json`
- why it matters: Defines published package `@aftership/advance-filters`, npm entry files, CSS export, scripts, dependencies, and package description.

- path: `src/index.ts`
- why it matters: Public source barrel exporting types, contexts, business/basic filter components, render APIs, and cache utilities.

- path: `src/render.tsx`
- why it matters: Imperative `renderAdvanceFilters` entrypoint used by React/host apps; converts a flat `IAdvanceFilterItem[]` list into grouped config and returns a SolidJS dispose function.

- path: `src/core/Entry/index.tsx`
- why it matters: Main `AdvanceFilters` runtime; owns expression state, add/delete groups and rules, condition/group `and`/`or` operators, change propagation, and validation callbacks.

- path: `src/components/Business/AdvancedFilter/index.tsx`
- why it matters: Per-condition editor; maps current expression to filter config by `declaration_handle`, renders filter selector, and updates expression fields.

- path: `src/components/Business/FormItem/index.tsx`
- why it matters: Dispatches `uiSchema` item `type` to concrete controls.

- path: `src/components/Common/WithBasic/index.tsx`
- why it matters: Shared wrapper for conditional rendering (`when`), dynamic prop formatting (`format`), validation/error field cleanup, and field reset on unmount.

- path: `src/hooks/useExecutionScript.ts` and `src/worker/executionScript.worker.ts`
- why it matters: Runs `when` and `format` scripts in a worker with `form`, `props`, and `dayjs` context.

- path: `src/utils/http.ts`
- why it matters: Runtime GraphQL boundary for `conditionalDataSource` and `productsWithStore`, including auth header derivation and environment URL selection.

- path: `src/utils/storage.ts`
- why it matters: Session cache layer and exported readers used by host apps to turn stored option values into labels/descriptions.

- path: `src/components/Business/ProductSelect/index.tsx`
- why it matters: Product-specific filter control; calls `fetchProductsWithStore` and caches product options under `product_with_store_cache`.

- path: `docs/filter-structure-conversion-rules.md`
- why it matters: Documents legacy-to-new config mapping from `default`/`operate` to `initialValues`/`uiSchema`, operator renames, control type mapping, and country/product special cases.

- path: `src/bootstrap.tsx`, `index.html`, `src/core/Editor/index.tsx`
- why it matters: Local demo/editor entry using `#advance-filters-root`; useful for package development, not the published runtime API.

## Evidence
- file_or_command: `package.json:1-67`
- finding: Package name is `@aftership/advance-filters`, version `1.0.5`, description is "Platform notification filters sdk", files publish only `dist`, scripts are Vite library commands, dependencies do not include other AfterShip packages.

- file_or_command: `vite.config.ts:26-73`
- finding: Vite Solid library build with entry `src/index.ts`, formats `es` and `cjs`, CSS asset normalized to `style.css`; no Module Federation config.

- file_or_command: `rg -n "module-federation|ModuleFederation|federation|exposes|remotes|shared" package.json vite.config.ts src`
- finding: No Module Federation config or keywords found in this repo.

- file_or_command: `src/index.ts:1-31`
- finding: Public source exports include types, context, business/basic components, render API, and cache readers.

- file_or_command: `src/render.tsx:18-63`
- finding: `RenderAdvanceFiltersProps` accepts `el`, `config`, `initVal`, callbacks, and optional `billingSlots`; `renderAdvanceFilters` renders `AdvanceFilters` in a Solid `ErrorBoundary` and returns dispose.

- file_or_command: `src/render.tsx:65-115`
- finding: `renderComponent` renders individual Solid components for editor previews with context providers; exported with `renderAdvanceFilters`.

- file_or_command: `src/types/Config.ts:18-54`
- finding: Config schema is `IAdvanceFilter` groups with `IAdvanceFilterItem` children containing `label`, optional icon/help/feature/billing metadata, `initialValues`, and `uiSchema`; UI schema supports the listed basic/business controls.

- file_or_command: `src/types/Expression.ts:8-79`
- finding: Output condition shape is `ConditionCompoundExpression` with nested conditions and simple/product/address/complex comparison expression variants.

- file_or_command: `src/core/Entry/index.tsx:43-83`, `src/core/Entry/index.tsx:118-173`, `src/core/Entry/index.tsx:322-355`
- finding: Runtime initializes expression state, builds filter options from config, handles add/delete/update for groups and conditions, emits cleaned expression through `onChange`, and calls `onValidate`.

- file_or_command: `src/components/Business/AdvancedFilter/index.tsx:49-80`, `src/components/Business/AdvancedFilter/index.tsx:120-145`, `src/components/Business/AdvancedFilter/index.tsx:198-228`
- finding: Per-rule UI derives `initialValues`/`uiSchema` from the selected `declaration_handle`, updates expression fields, and renders a searchable filter selector plus dynamic form items.

- file_or_command: `src/components/Business/FormItem/index.tsx:33-89`
- finding: `uiSchema` type dispatch maps `Section`, `Column`, `Input`, `AutoComplete`, `Select`, `MultipleSelect`, `Tree`, `DateTimePicker`, `InputTags`, `ProductSelect`, and `Text` to concrete components.

- file_or_command: `src/components/Common/WithBasic/index.tsx:29-66`
- finding: The wrapper executes `when` and `format` scripts against current form state, clears field values/errors on unmount, and controls conditional display.

- file_or_command: `src/utils/http.ts:50-127`
- finding: Environment detection maps hostnames to development/testing/staging/production GraphQL endpoints and derives `am-product-code` from auth.

- file_or_command: `src/utils/http.ts:129-188`
- finding: Runtime calls `conditionalDataSource` and `productsWithStore` GraphQL queries through the marketing admin v2 BFF.

- file_or_command: `src/utils/storage.ts:1-4`, `src/utils/storage.ts:81-125`, `src/utils/storage.ts:188-195`
- finding: Data-source cache uses `sessionStorage` key `aftership_advance_filters_datasource_cache`, merges items by value, and exports `getAdvanceFiltersDataSourceCache` / `getProductWithStoreCache`.

- file_or_command: `docs/filter-structure-conversion-rules.md:7-51`, `docs/filter-structure-conversion-rules.md:53-98`, `docs/filter-structure-conversion-rules.md:119-130`
- finding: Conversion doc defines old `default`/`operate` to new `initialValues`/`uiSchema`, PascalCase controls, `when` instead of `afterChildren`, new operator names, and `featureSlugs` to `featureSlug`.

- file_or_command: `git status --short --branch`
- finding: Current branch is `testing`, tracking `local/testing`, ahead by 74; no worktree file changes were reported.

- file_or_command: `git remote -v`
- finding: `local` remote is the user's fork `git@github.com:Wynne-cwb/npm-aftership-advance-filters.git`; `origin` is company repo `git@github.com:aftership/npm-aftership-advance-filters.git`; no `upstream` remote exists.

- file_or_command: `git branch -vv --all` and `git for-each-ref --format='%(refname:short)' refs/heads refs/remotes`
- finding: Branch refs include local `master`, `testing`, remote `origin/master`, `origin/testing`, `local/master`, `local/testing`, and Dependabot branches; no `master_v9`, `feat/flow-v3-polaris-v13`, or `feat/flow-v3` refs.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/aio-notification/package.json:29-42`
- finding: `aio-notification` directly depends on `@aftership/advance-filters` and Module Federation packages.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/aio-notification/src/pages/NotificationPlatform/components/AdvanceFilters/index.tsx:1-83`
- finding: `aio-notification` imports `IAdvanceFilter` and `renderAdvanceFilters` from `@aftership/advance-filters`, imports its CSS, fetches `conditionalConfig` from notification admin GraphQL, groups config by category, and renders the SDK into `#advance-filters`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/snap-form/package.json:35-43`
- finding: `snap-form` depends on both `@aftership/advance-filters` and `@aftership/am-dynamic-form`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/snap-form/src/index.tsx:6-35`
- finding: `snap-form` supports `mode?: "dynamic-form" | "advance-filters"`, exports `AdvanceFiltersEditor`, re-exports `renderAdvanceFilters`, `renderAmDynamicForm`, and advance-filter cache readers.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/package.json:84-94`
- finding: `fe-pltf-ens-admin` depends on `@aftership/snap-form`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/yarn.lock:496-502`
- finding: Resolved `@aftership/snap-form@^1.0.9-alpha.220` depends on `@aftership/advance-filters` `1.0.4-alpha.195` and `@aftership/am-dynamic-form` `1.0.7-alpha.4`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/TemplateEditor/FlowEditor/components/AdvancedFilterForm.tsx:1-110`
- finding: Flow template editor imports `renderAdvanceFilters` from `@aftership/snap-form`, passes advanced filter config/initVal, and captures expression changes.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/utils/flowDescription/formatDescription.ts:1-124`
- finding: Flow description formatter imports cache readers from `@aftership/snap-form` and uses cached data-source/product labels to render descriptions.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2/package.json:28-33`
- finding: Marketing admin v2 BFF depends on `@aftership/am-dynamic-form` and `@aftership/am-filters`, not `@aftership/advance-filters`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2/src/modules/common/notificationConditional/notificationConditional.resolver.ts:1-19`
- finding: BFF exposes GraphQL query `conditionalDataSource`, matching the SDK's runtime query.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2/src/modules/common/product/product.resolver.ts:1-28`
- finding: BFF exposes GraphQL query `productsWithStore`, matching the SDK's `ProductSelect` runtime query.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2/src/modules/common/notificationConditional/notificationConditional.service.ts:17-38`, `:119-180`
- finding: BFF conditional datasource service supports built-ins such as `countries`, `collection`, `product_tags`, `products`, and `external_tags`; default path reads notification extension UI assets/endpoints.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2/src/modules/common/fieldItem/fieldItem.service.ts:1-20`, `:107-117`, `:480-481`
- finding: BFF field item service depends on CRM `SegmentService` and can return segment field items, evidencing the CRM/segments side of the older filter/data-source ecosystem.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2/src/datasources/acrm/segment/segment.api.service.ts:1-64`
- finding: CRM segment data source uses `@aftership/am-filters` `SegmentV1ToSegmentV2` to convert legacy segment presentation settings.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/package.json:54-62`, `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-crm/package.json:44-53`, `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-basic/package.json:48-56`
- finding: Existing flow/CRM/marketing-basic repos still depend on `@aftership/am-filters`; marketing-basic also depends on `@aftership/am-dynamic-form`.

- file_or_command: `rg -n "@aftership/am-filters|@aftership/am-dynamic-form|@aftership/advance-filters|renderAdvanceFilters|renderAmDynamicForm" ...`
- finding: Local cross-repo search shows `advance-filters` direct use in `aio-notification` and `snap-form`, `snap-form` use in `fe-pltf-ens-admin`, and legacy `am-filters`/`am-dynamic-form` usage in older Notification/admin/CRM surfaces.

## Open Questions
- question: Should future changes base on `master` or `testing` for this package?
- why it matters: Protocol default would use `master` for production, but current branch activity and consumer alpha versions suggest `testing` may be the active package publishing lane.

- question: Should remotes be normalized to fork-first names (`origin` = user fork, `upstream` = AfterShip repo)?
- why it matters: Current remote layout is inverted/nonstandard for the protocol; this was recorded but intentionally not fixed during read-only research.

- question: Is `@aftership/snap-form` now the preferred public wrapper for flow advanced filter editing?
- why it matters: `fe-pltf-ens-admin` consumes advanced filters via `snap-form`, while `aio-notification` imports `@aftership/advance-filters` directly. Future agents need to know whether to change the SDK, the wrapper/editor, or both.

- question: What is the formal migration boundary from `@aftership/am-filters` to `@aftership/advance-filters`?
- why it matters: The conversion doc and local usage indicate old-to-new migration, but BFF/CRM/older apps still depend on `am-filters` for segment/multi-filter logic and conversions.

- question: Should package exports be audited?
- why it matters: `package.json` maps `"import"` to `./dist/index.cjs.js` and `"require"` to `./dist/common-utils.cjs.js`, while the Vite config outputs `index.es.js` and `index.cjs.js`; this may be intentional or stale, but was not changed.
