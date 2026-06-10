# am-filters

## Summary
- project_id: `am-filters`
- repo_name: `am-filters`
- upstream_url: `https://github.com/AfterShip/am-filters`
- local_path: `/Users/wb.chen/Documents/AfterShip/am-filters`
- repo_type: npm package / Solid + Vite filter editor SDK, package name `@aftership/am-filters`
- confidence: high for local source facts; medium for cross-repo relationships because they were checked from local checkouts only, without network search or fetch.

## Responsibility
- Owns:
  - `@aftership/am-filters` package contract: `IExprs`, `IFilter`, `IFilterGroup`, `FilterItem`, `TransformEnum`, feature/billing metadata, and generated JSON schema exports.
  - Filter rendering entrypoints: `renderAmFilters` for embedders and `initFilterEditor` / `renderAmFilterEditor` for local/dev editor.
  - Rendering configured filter schema into AND/OR UI groups, recursive filter controls, validation state, and `IExprs[][]` callbacks.
  - Expression utilities for converting FE filter groups to BE-ish expressions: `ContactFilterInterpreter`, `FlowFilterInterpreter`, `TriggerFilterInterpreter`, `CreateCompoundExpression`, `ConvertCompoundExpression`.
  - Legacy migration helpers: `SegmentV1ToSegmentV2`, `FlowFilterV1ToFlowFilterV2`, `FlowTriggerFilterV1ToFlowTriggerFilterV2`, `EmailNewsletterFilterMigrationAMFilter`.
  - TypeScript-to-JSON schema generation for `configSchema.json`, `filterItemSchema.json`, and `descriptionSchema.json`.
- Does not own:
  - Dynamic schema persistence, feature entitlement filtering, field item data, product data, segment data, flow data, or notification flow save/read APIs. Those are served by marketing admin BFFs and consumer apps.
  - Module Federation host/remotes. This repo is consumed as an npm package, not as a federated app.
  - `@aftership/advance-filters`; local evidence shows it is a separate package with its own `renderAdvanceFilters` and no direct import relationship with `am-filters`.
  - `@aftership/am-dynamic-form`; it is a sibling dynamic schema renderer selected by consumers/BFF via `DynamicSchemaModeEnum`, not a direct dependency of this repo.
- Common change areas:
  - Add or change filter schema shape in `src/components/typing.ts` and regenerate public schemas.
  - Add control rendering in `src/components/Block/**` and `src/components/Filter/**`.
  - Change expression semantics in `src/utils/Interpreter.ts`, `src/utils/expression.ts`, or `src/utils/migration.ts`.
  - Update BFF data access/query assumptions in `src/graphql/**`, `src/generated/**`, and `src/utils/httpRequest.ts`.
  - Update local/debug editors in `src/views/AmFilterEditor` or `src/views/MultiFilterEditor`.

## Branch Tracks
- production: `master` exists locally and as `origin/master`; protocol production maps cleanly to `master`.
- legacy_v9: no `master_v9` local or remote branch was found.
- active_major: no `feat/flow-v3` or `feat/flow-v3-polaris-v13` local or remote branch was found.
- repo_specific_notes:
  - Current checkout branch is `feat/autocomplete`, not a protocol candidate branch.
  - Working tree is dirty: `src/utils/httpRequest.ts` is modified. This was observed only and not changed.
  - Remote anomaly: `origin` points to `git@github.com:AfterShip/am-filters.git`; user fork is named `local` (`git@github.com:Wynne-cwb/am-filters.git`); no `upstream` remote is configured. This is not fork-first standard and was not repaired.
  - Local package version is `2.0.18`, while local consumers reference mixed versions such as `1.9.10`, `2.0.20`, `^2.0.19`, and `^2.1.0`; future changes need version/consumer alignment rather than branch alignment.

## Module Federation
- enabled: false
- exposes: none found
- remotes: none found
- shared_packages: not applicable as MF; runtime package dependencies include `solid-js`, `lodash-es`, `dayjs`, `@floating-ui/dom`, `graphql`, etc.
- branch_alignment: not MF-based. Alignment happens by npm package version in consumer repos such as `sdks.am-static.com_admin-marketing-basic`, `sdks.am-static.com_admin-flow`, `sdks.am-static.com_admin-crm`, and `bff-api.automizely.com_marketing_admin_v2`.

## Team Repo Dependencies
- Direct dependencies:
  - No direct dependencies on other AfterShip team repos in `am-filters/package.json`; the repo itself publishes `@aftership/am-filters`.
  - Build/dev codegen depends on GraphQL schemas at `http://localhost:9003/marketing/admin/graphql` and `http://localhost:9006/marketing/admin/v2/graphql`.
- Runtime calls:
  - Calls marketing admin BFF GraphQL through `fetchMarketingAdminBffApi`, using `/marketing/admin/graphql` for v1 and `/marketing/admin/v2/graphql` for v2.
  - Uses `window.getAuth()` headers for organization/app auth and app platform context.
  - v1 queries include `commonFilterConfig`, `filterDescription`, `productList`, and `stores.storeProperty`.
  - v2 queries include `dynamicSchemaMenu`, `multiFilterConfig`, `dynamicSchema`, `fieldItem`, `cascadeChildren`, and `productList`.
- Build-time dependencies:
  - `graphql-codegen` generates `src/generated/graphql.ts` and `src/generated/graphqlV2.ts` from local BFF GraphQL endpoints.
  - `typescript-json-schema` generates public schema files from `src/components/typing.ts` and `src/types/description.ts`.
- Shared packages:
  - Incoming consumers observed locally:
    - `sdks.am-static.com_admin-marketing-basic` depends on `@aftership/am-filters`, fetches `multiFilterConfig(V2)`, enriches feature metadata, then calls `renderAmFilters`.
    - `sdks.am-static.com_admin-flow` depends on `@aftership/am-filters` and uses `adminMarketingBasic/basicHooks` to choose `AmFilters` vs `AmDynamicForm` renderers in flow modals.
    - `sdks.am-static.com_admin-crm` depends on `@aftership/am-filters`, renders filter cards, and uses `ContactFilterInterpreter` for contacts list/search.
    - `bff-api.automizely.com_marketing_admin_v2` depends on `@aftership/am-filters` types and expression helpers in CRM multi-filter, conditions, field-item, flow, and notification-flow code.
    - legacy marketing operations UI imports `configSchema.json`, `descriptionSchema.json`, `renderAmFilters`, and `FlowFilterInterpreter` for business-settings AM filters tooling.
- Inferred but unconfirmed:
  - `@aftership/advance-filters` appears to be a newer/parallel Platform Notification filter SDK (`@aftership/advance-filters`) rather than a direct replacement wired into this repo. No import/package dependency between `am-filters` and `npm-aftership-advance-filters` was found in targeted local search.
  - `am-dynamic-form` and `am-filters` are coordinated by shared dynamic-schema modes and consuming apps/BFF, not by direct package dependency in `am-filters`.

## Business Flows
- flow_id: `crm_segments`
- role: Provides CRM/contact segment filter UI types and expression transforms. Includes `SegmentAttributes` (`in_segment`) config/description, `SegmentV1ToSegmentV2`, and `ContactFilterInterpreter`.
- upstream/downstream repos: BFF provides config/field items and segment data; `sdks.am-static.com_admin-crm` renders the UI and sends interpreted filters; `bff-api.automizely.com_marketing_admin_v2` imports migration/type helpers.

- flow_id: `notification_flow_filters`
- role: Provides filter group shape and conversion utilities for flow trigger filters, flow filters, conditional split settings, and saved condition expressions.
- upstream/downstream repos: `sdks.am-static.com_admin-flow` renders filters through `adminMarketingBasic/basicHooks`; `bff-api.automizely.com_marketing_admin_v2` uses `CreateCompoundExpression`/`ConvertCompoundExpression` when saving/loading condition settings.

- flow_id: `dynamic_schema_am_filters`
- role: Renders schemas whose mode is `DynamicSchemaModeEnum.AmFilters`; dev editor fetches menus/config with `TemplateKeyEnum.AmFilters` and `multiFilterConfig`.
- upstream/downstream repos: BFF dynamic schema services own config retrieval/filtering; `sdks.am-static.com_admin-marketing-basic` is the hook layer that fetches config and embeds `renderAmFilters`.

- flow_id: `dynamic_form_sibling`
- role: Does not render dynamic forms. It is selected alongside `am-dynamic-form` by consumers depending on schema mode.
- upstream/downstream repos: `sdks.am-static.com_admin-flow` calls `useRenderDynamicForm` when mode is `AmDynamicForm` and `useRenderMultiFilterV2` when mode is `AmFilters`; BFF imports both `@aftership/am-dynamic-form` and `@aftership/am-filters` types in field item/dynamic schema areas.

- flow_id: `filter_schema_authoring`
- role: Supplies JSON schemas and preview renderer for AM filter config authoring/debugging.
- upstream/downstream repos: legacy marketing operations business-settings AM filters UI imports `configSchema.json`, `descriptionSchema.json`, `renderAmFilters`, and `FlowFilterInterpreter`.

## Important Entrypoints
- path: `package.json`
- why it matters: Defines published package `@aftership/am-filters`, export map, schema JSON exports, build/codegen/schema scripts, and runtime dependencies.
- path: `src/index.ts`
- why it matters: Public API surface for renderers, interpreters, migration helpers, expression helpers, and exported types.
- path: `src/render.tsx`
- why it matters: Main embedder API `renderAmFilters`, including options, callbacks, app env, and Solid unmount return.
- path: `src/components/typing.ts`
- why it matters: Canonical filter schema contract and source for generated `configSchema.json` / `filterItemSchema.json`.
- path: `src/components/index.tsx`
- why it matters: `AMFilter` owns `IExprs[][]` state, AND/OR group rendering, init group inference for legacy data, validation, and callback wiring.
- path: `src/components/Filter/FilterExprs/index.tsx`
- why it matters: Converts high-level `IFilter` config into selectable filter groups and manages per-filter expr/error context.
- path: `src/components/Filter/FilterBlock/index.tsx`
- why it matters: Dispatches schema `FilterItem.type` values to concrete controls such as select, multi_select, date, product, cascade, tree, inputTags, and autocomplete.
- path: `src/components/Block/SelectFilter/index.tsx`
- why it matters: Handles option selection, nested before/after children, feature lock errors, remote `fieldItem` search, and default expr injection.
- path: `src/components/Block/ProductListFilter/index.tsx`
- why it matters: Product picker logic; uses consumer-provided `onFetchProductList` when available, otherwise calls BFF product list.
- path: `src/components/Block/CascadeSelectFilter/index.tsx`
- why it matters: V2 cascade field rendering and lazy `cascadeChildren` loading.
- path: `src/utils/Interpreter.ts`
- why it matters: Core FE-to-BE expression transformations for contact, flow, and trigger filter contexts.
- path: `src/utils/expression.ts`
- why it matters: Converts between `IExprs[][]` and compound condition expressions used by notification flow/BFF conditions.
- path: `src/utils/migration.ts`
- why it matters: Legacy segment, flow filter, trigger filter, and newsletter filter migration helpers.
- path: `src/utils/httpRequest.ts`
- why it matters: Central BFF GraphQL client, app-env host mapping, auth header creation, and current dirty working-tree file.
- path: `src/views/AmFilterEditor/index.tsx`
- why it matters: Local/debug editor for v1 common filters, description lookup, and migration experiments.
- path: `src/views/MultiFilterEditor/index.tsx`
- why it matters: Local/debug editor for v2 dynamic schema menus/config using `TemplateKeyEnum.AmFilters`.
- path: `scripts/generateSchema/*.ts`
- why it matters: Generates schema artifacts that downstream admin tooling imports.

## Evidence
- file_or_command: `package.json:1-50`
- finding: Package is `@aftership/am-filters` version `2.0.18`; publishes `dist`, types, CJS/ES builds, style.css, and three schema JSON exports; build runs `generateSchema`, Vite library build, and server-utils build.
- file_or_command: `package.json:89-99`
- finding: Runtime dependencies are generic frontend/libs (`solid-js`, `lodash-es`, `dayjs`, etc.); no direct AfterShip team repo package dependency is present.
- file_or_command: `src/index.ts:1-43`
- finding: Public exports include renderers, interpreters, migration helpers, expression helpers, and schema/types.
- file_or_command: `src/render.tsx:19-33`, `src/render.tsx:43-80`
- finding: `renderAmFilters` accepts `config`, `initVal`, validation/change callbacks, product-list hook, feature upgrade hook, and renders `AMFilter` under an error boundary.
- file_or_command: `src/components/typing.ts:52-218`, `src/components/typing.ts:300-358`
- finding: Defines transform rules, operators, `IExprs`, `IAmFilterConfig`, `IFilter`, `IFilterGroup`, and supported block types/data sources.
- file_or_command: `src/components/index.tsx:35-115`, `src/components/index.tsx:253-424`
- finding: `AMFilter` manages groups, validates empty/error expressions, matches legacy init values back to config labels, and renders AND/OR UI with add/delete behavior.
- file_or_command: `src/components/Filter/FilterExprs/index.tsx:24-123`
- finding: Builds filter group options from config, fetches store currency when not supplied, and exposes expr/error setters through context.
- file_or_command: `src/components/Filter/FilterBlock/index.tsx:21-57`
- finding: Schema item `type` dispatches to concrete control components, confirming rendering ownership.
- file_or_command: `src/components/Block/SelectFilter/index.tsx:148-217`, `src/components/Block/SelectFilter/index.tsx:245-330`
- finding: Select filter supports nested child blocks, feature lock errors, local/remote search, and v2 `fieldItem` lookup.
- file_or_command: `src/components/Block/ProductListFilter/index.tsx:55-93`
- finding: Product picker can delegate fetching to consumer `onFetchProductList`; otherwise calls BFF `GetProductListDocument`.
- file_or_command: `src/components/Block/CascadeSelectFilter/index.tsx:16-24`, `src/components/Block/CascadeSelectFilter/index.tsx:90-140`
- finding: Cascade select lazily calls v2 `cascadeChildren` and stores transformed selected tree data into expression fields.
- file_or_command: `src/utils/httpRequest.ts:5-45`, `src/utils/httpRequest.ts:48-107`
- finding: Runtime GraphQL calls use `window.getAuth`/development headers, map app env to BFF hosts, and call v1/v2 marketing admin GraphQL paths.
- file_or_command: `src/graphql/v1/*.graphql`, `src/graphql/v2/*.graphql`
- finding: Query surface covers common filter config/description/product/store property plus dynamic schema menus, dynamic schema, multi-filter config, field items, cascade children, and product list.
- file_or_command: `codegen.yml:1-27`
- finding: Codegen pulls v1 schema from localhost `9003` and v2 schema from localhost `9006`, tying build-time types to marketing admin BFF schemas.
- file_or_command: `scripts/generateSchema/configSchema.ts:18-29`, `filterItemSchema.ts:18-29`, `descriptSchema.ts:21-32`
- finding: JSON schemas are generated from TypeScript interfaces and written to `public/*.json`.
- file_or_command: `src/utils/Interpreter.ts:251-459`
- finding: Transform pipeline applies configured transforms, formats AND/OR groups, and produces contact/flow/trigger expression shapes.
- file_or_command: `src/utils/expression.ts:4-44`
- finding: `CreateCompoundExpression` and `ConvertCompoundExpression` bridge `IExprs[][]` and compound condition expressions.
- file_or_command: `src/utils/migration.ts:64-115`, `src/utils/migration.ts:369-555`, `src/utils/migration.ts:932-954`
- finding: Migration helpers cover segment V1, flow filter V1, trigger filter V1, and newsletter filter migration into AM filter groups.
- file_or_command: `src/contants/config/SegmentAttributes.ts:1-54`, `src/contants/description/SegmentAttributesDescription.ts:1-16`
- finding: Segment filter config owns `in_segment` UI/default shape and description fetch rule using `FieldName.Segment`.
- file_or_command: `src/contants/config/CampaignBehavior.ts:251-288`
- finding: Campaign behavior includes `Have not entered the flow`, with `args.flow_id` sourced from `FieldName.Flow`.
- file_or_command: `src/contants/config/CustomerAttributes.ts:243-270`
- finding: Customer attributes include SMS tracking notification subscription gated by `feature:flows:flow_filters:sms_notification_subscription`.
- file_or_command: `src/views/MultiFilterEditor/index.tsx:35-65`, `src/views/MultiFilterEditor/index.tsx:98-121`
- finding: Dev editor fetches `TemplateKeyEnum.AmFilters`, `DynamicSchemaModeEnum.AmFilters`, then calls `renderAmFilters`.
- file_or_command: `src/views/AmFilterEditor/index.tsx:47-66`, `src/views/AmFilterEditor/index.tsx:68-83`, `src/views/AmFilterEditor/index.tsx:125-150`
- finding: Dev editor fetches v1 common filter config/description and exposes migration debugging.
- file_or_command: `vite.config.ts:27-49`, `vite.server.config.ts:21-26`
- finding: Vite builds a library entry from `src/index.ts`; a second config builds utility CJS output from `src/utils/index.ts`.
- file_or_command: `Jenkinsfile:4-23`
- finding: Jenkins config labels it as frontend flow app `am-filters`, repo `am-filters.git`, with `prePublishScript` `npm run clean && yarn build`.
- file_or_command: `git status --short --branch`, `git remote -v`, branch candidate listing
- finding: Current branch `feat/autocomplete`; dirty `src/utils/httpRequest.ts`; `origin` is company upstream, fork is `local`, no `upstream` remote; only candidate branch found is `master`.
- file_or_command: `Notification/npm-aftership-advance-filters/package.json:1-67`, `src/index.ts:1-31`, `src/render.tsx:18-63`
- finding: `@aftership/advance-filters` is a separate Platform Notification filters SDK with its own `renderAdvanceFilters`; no direct dependency on `@aftership/am-filters` found in targeted search.
- file_or_command: `Notification/sdks.am-static.com_admin-marketing-basic/package.json:48-54`, `src/hooks/dynamicSchema/useRenderMultiFilterV2.ts:16-26`, `:61-75`, `:192-215`
- finding: `admin-marketing-basic` depends on `@aftership/am-filters`, fetches dynamic multi-filter config in AmFilters mode, and wraps `renderAmFilters`.
- file_or_command: `Notification/sdks.am-static.com_admin-flow/package.json:54-57`, `src/components/Editor/ActionCommonModal/index.tsx:39-82`
- finding: `admin-flow` consumes both dynamic form and AM filters through basic hooks, selecting by `DynamicSchemaModeEnum.AmDynamicForm` vs `AmFilters`.
- file_or_command: `Notification/sdks.am-static.com_admin-crm/package.json:44-48`, `src/components/FilterCard/index.tsx:1-43`, `src/features/ContactsTable/index.tsx:26`, `:142-148`
- finding: `admin-crm` depends on `@aftership/am-filters`, renders filter cards, and uses `ContactFilterInterpreter` before contact list calls.
- file_or_command: `Notification/bff-api.automizely.com_marketing_admin_v2/package.json:28-33`, `src/modules/crm/multiFilterV2/multiFilter.service.ts:1-26`, `src/modules/common/fieldItem/fieldItem.service.ts:1-20`
- finding: BFF depends on both `@aftership/am-dynamic-form` and `@aftership/am-filters`; dynamic schema and field item services use AM filter types.
- file_or_command: `Notification/bff-api.automizely.com_marketing_admin_v2/src/modules/common/conditions/conditions.service.ts:12-39`, `src/modules/flow/flow/flow.utils.ts:1-19`, `:433-464`
- finding: BFF uses `CreateCompoundExpression` to save conditions and `ConvertCompoundExpression` to hydrate trigger/flow filter condition settings.
- file_or_command: `Notification/bff-api.automizely.com_marketing_admin_v2/src/modules/notificationFlow/notificationFlow.service.ts:696-706`
- finding: Notification flow description logic has an explicit AM filters description branch for split steps.
- file_or_command: `legacy-admin-portal/admin.automizely.org_marketing-operations/src/views/businessSettings/amFilters/index.vue:55-58`, `components/preview/index.vue:47-60`, `components/schema/index.vue:17-31`
- finding: Legacy business-settings tooling imports AM filter schema JSON, style, `renderAmFilters`, and `FlowFilterInterpreter`.

## Open Questions
- question: Should future work be based on `master`, `origin/master`, or the current `feat/autocomplete` branch?
- why it matters: Protocol candidates only confirm `master`, while the checkout is on a dirty feature branch and local package version does not match several consumers.
- question: Is the current remote layout intentional (`origin` as upstream, fork named `local`)?
- why it matters: It violates fork-first contribution expectations and should be fixed before any code change/PR workflow, but this research did not modify remotes.
- question: Is `@aftership/advance-filters` intended to replace `@aftership/am-filters` for some Platform Notification flows?
- why it matters: Local evidence shows parallel SDKs, not direct dependency. Migration/ownership boundaries need product/team confirmation.
- question: Is the package export map intentional, especially `exports["."].import` pointing to `index.cjs.js` and `require` pointing to `common-utils.cjs.js`?
- why it matters: It looks unusual from package metadata alone and may affect consumers, but no build/runtime validation was run in this read-only pass.
- question: Which repo owns the canonical dynamic schema config for AM filters?
- why it matters: `am-filters` owns schema types/rendering, while BFF/dynamic schema services appear to own storage, feature filtering, and field-data hydration.
