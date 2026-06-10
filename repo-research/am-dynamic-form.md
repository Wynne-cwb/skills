# am-dynamic-form

## Summary
- project_id: am-dynamic-form
- repo_name: am-dynamic-form
- upstream_url: https://github.com/AfterShip/am-dynamic-form
- local_path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form
- repo_type: npm library / SolidJS dynamic form renderer, schema types, JSON schema artifact, and dev/debug editor.
- confidence: high for local source, git, package, and cross-repo local checkout evidence; medium for organization-wide dependency completeness because no network search was used.

## Responsibility
- Owns: `@aftership/am-dynamic-form`, a schema-driven form renderer (`renderAmDynamicForm`), form item type contract (`IDynamicFormConfig`, `IFormItem`), exported basic/block components, CSS, generated JSON schema, local/debug editor, field validation, conditional rendering, remote option loading, and worker-backed script execution for `when`/`format` dynamic behavior.
- Does not own: dynamic schema storage, notification/flow execution, email/SMS sending, marketing campaign orchestration, BFF auth/business logic, system asset templates, system dynamic config persistence, or the newer visual schema authoring UI in `@aftership/snap-form`.
- Common change areas: `src/components/typing.ts` for schema contract; `src/components/Block/**` and `src/components/Basic/**` for renderer behavior; `src/render.tsx` and `src/index.ts` for public API; `src/utils/httpRequest.ts` and `src/graphql/**` for Marketing Admin BFF integration; `scripts/jsonSchema/index.ts` and `public/jsonSchema.json` / `dist/jsonSchema.json` for schema validation artifact.

## Branch Tracks
- production: `master` exists locally and as `origin/master`; local log shows `origin/master` at tag `1.0.6` (`a39748d`). Jenkins config marks this as a frontend npm package-only publish (`npmPackageOnly: true`, prepublish `npm run clean && yarn build`).
- legacy_v9: not found. `git branch --all --list 'master_v9' 'remotes/*/master_v9'` returned no candidates.
- active_major: default notification candidates `feat/flow-v3-polaris-v13` and `feat/flow-v3` are not present. Current checkout is `testing` tracking `origin/testing`, with package version `1.0.6-alpha.23`; recent log on `testing` includes ASE-1078 alpha work.
- repo_specific_notes: remotes are not in fork-first shape. `origin` points to `git@github.com:AfterShip/am-dynamic-form.git`, `local` points to `git@github.com:Wynne-cwb/am-dynamic-form.git`, and there is no `upstream` remote. Recorded only; not repaired.

## Module Federation
- enabled: false in this repo. No `ModuleFederation`, `federation`, `exposes`, `remotes`, or `shared` config found outside `node_modules`, `dist`, and lockfile.
- exposes: none.
- remotes: none.
- shared_packages: not applicable as an MF host/remote. As an npm package it depends on `solid-js`, `lodash-es`, `dayjs`, `@floating-ui/dom`, `@vvo/tzdb`, `phone`, `uuid`, etc.; it declares GraphQL codegen packages and `graphql` as peers.
- branch_alignment: consumers should align by npm package version rather than MF branch. Downstream MF packages such as `@aftership/admin-marketing-basic` and `@aftership/admin-flow` consume or re-expose the renderer indirectly, so flow work usually follows those repos' branch tracks plus the chosen `@aftership/am-dynamic-form` package version.

## Team Repo Dependencies
- Direct dependencies: no outbound team repo package dependency was found in this repo's `package.json`; direct dependencies are third-party libraries plus the package's own generated GraphQL types.
- Runtime calls: browser-side GraphQL POSTs to Marketing Admin BFF paths `/marketing/admin/graphql` and `/marketing/admin/v2/graphql`, resolved by env to localhost, release, staging, or production `bff-api.automizely.*`. `SelectFilter` and `MultiSelectFilter` call `fieldItem`; the debug editor calls `dynamicFormConfig`.
- Build-time dependencies: `codegen.yml` expects local Marketing Admin GraphQL schemas at `http://localhost:9003/marketing/admin/graphql` and `http://localhost:9006/marketing/admin/v2/graphql` to generate `src/generated/graphql.ts` and `src/generated/graphqlV2.ts`. `scripts/jsonSchema/index.ts` generates JSON schema from `src/components/typing.ts`.
- Shared packages: this repo publishes `@aftership/am-dynamic-form`, including `dist/style.css` and `dist/jsonSchema.json`.
- Downstream consumers observed locally: `legacy-admin-portal/admin.automizely.org_marketing-operations` depends on `@aftership/am-dynamic-form@^1.0.6`; `snap-form` depends on `^1.0.6-alpha.28`; `sdks.am-static.com_admin-marketing-basic` depends on `^1.0.7`; `bff-api.automizely.com_marketing_admin_v2` depends on `^1.0.2`.
- Downstream notification/flow dependency path: `sdks.am-static.com_admin-marketing-basic` exports `useRenderDynamicForm` hooks that fetch `dynamicSchema(... schema_mode: AmDynamicForm ...)` and call `renderAmDynamicForm`; `sdks.am-static.com_admin-flow` imports those hooks from `adminMarketingBasic/basicHooks` for trigger/action modals. This makes notification/flow UI indirectly dependent on this package.
- Downstream form authoring path: `snap-form` uses this package's types, components, renderer, and CSS to build/preview Dynamic Form schemas, then `fe-pltf-ens-admin` uses `@aftership/snap-form` for Flow SnapForm/DynamicForm editor and declaration preview.
- Backend config dependencies: `bff-api.automizely.com_marketing_admin_v2` imports `IFormItem` for GraphQL entities/inputs and resolves `dynamicFormConfig` / `dynamicSchema` for `am_dynamic_form`; `admin.automizelyapi.org_mkt-operations` exposes `amDynamicFormMenus`, `amDynamicFormSchema`, and `amDynamicFormDescription` over `TemplateKeyEnum.am_dynamic_form`.
- Inferred but unconfirmed: email/SMS admin packages include example constants with `action_schema_mode: 'AmDynamicForm'`; direct runtime use appears to flow through `admin-flow` and `admin-marketing-basic`, but this was not exhaustively proven across every package.

## Business Flows
- flow_id: marketing_dynamic_form_schema_config
- role: defines and renders the `IDynamicFormConfig` schema shape used by Marketing Admin dynamic form configuration. Legacy marketing operations provides schema/description/menu CRUD UI and preview with this renderer.
- upstream/downstream repos: upstream config/BFF repos include `admin.automizelyapi.org_mkt-operations` and `bff-api.automizely.com_marketing_admin_v2`; downstream UI includes `legacy-admin-portal/admin.automizely.org_marketing-operations`, `snap-form`, and `fe-pltf-ens-admin`.

- flow_id: notification_flow_trigger_action_settings
- role: renders dynamic form UI for notification/flow trigger settings, trigger filters UI, flow filter UI, frequency UI, and AmDynamicForm action settings such as tracking time delay / status unchanged.
- upstream/downstream repos: `bff-api.automizely.com_marketing_admin_v2` provides `dynamicSchema` and descriptions; `sdks.am-static.com_admin-marketing-basic` wraps renderer hooks; `sdks.am-static.com_admin-flow` consumes those hooks in trigger/action modals; `sdks.am-static.com_admin-email` and `sdks.am-static.com_admin-sms` examples reference AmDynamicForm action schema modes.

- flow_id: snap_form_dynamic_form_authoring
- role: powers preview/rendering and type conversion inside the newer `@aftership/snap-form` visual editor; exported schemas are later used by flow declaration/editing screens.
- upstream/downstream repos: `snap-form` directly depends on this package; `fe-pltf-ens-admin` consumes `snap-form` and also imports `@aftership/am-dynamic-form/dist/style.css` in flow-related rendering.

## Important Entrypoints
- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/package.json
- why it matters: npm package identity, version (`1.0.6-alpha.23` on current branch), exports (`dist/style.css`, `dist/jsonSchema.json`), scripts, third-party deps, and build mode.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/index.ts
- why it matters: public API exports `renderAmDynamicForm`, `initDynamicFormEditor`, `AmDynamicFormInterpreter`, `renderComponent`, execution hook, types, and selected components.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/render.tsx
- why it matters: bridges external DOM element callers to Solid rendering; defines renderer props (`config`, `initVal`, `onChange`, `onValidate`, `validateOnMount`) and exposes `renderComponent` helper used by authoring tooling.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/components/typing.ts
- why it matters: canonical Dynamic Form schema contract, including `Section`, `Column`, `Input`, `Select`, `MultiSelect`, `TimeZonePicker`, `CustomHTML`, conditional `when`, and dynamic `format`.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/components/index.tsx
- why it matters: `AmDynamicForm` component creates form/error state, applies defaults, renders `FormItem`, and emits `onChange` / validation state.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/components/Block/FormItem/index.tsx
- why it matters: schema dispatcher from `IFormItem.type` to concrete block/basic components.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/components/Hoc/WithBasic/index.tsx
- why it matters: applies shared conditional rendering and `format` script execution around every schema item.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/hooks/useGetRenderConditions.ts
- why it matters: evaluates `when` as either condition arrays or script strings, using current form state.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/hooks/useExecutionScript.ts
- why it matters: public hook for worker-backed script execution with timeout; also exported for downstream description/schema tooling.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/worker/executionScript.worker.ts
- why it matters: executes dynamic script snippets with `props`, `form`, and `dayjs`; important for schema safety and runtime behavior.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/utils/httpRequest.ts
- why it matters: constructs auth headers from `window.getAuth`, maps app env to BFF host, and POSTs GraphQL to marketing admin v1/v2 endpoints.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/graphql/v1/*.graphql and /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/graphql/v2/*.graphql
- why it matters: operations for `commonFilterConfig`, `filterDescription`, `productList`, `storeProperty`, `dynamicFormConfig`, `dynamicSchema`, `dynamicSchemaMenu`, `fieldItem`, and `multiFilterConfig`.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/config/index.ts
- why it matters: built-in demo/debug config mapping for BackInStock, Birthday, OrderFollowUp, Winback, PriceDrop, ShipmentsDigest, and Demo.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/views/AmDynamicFormEditor/index.tsx
- why it matters: local development/debug UI; fetches `dynamicFormConfig`, renders form, and displays FE/BE/description schema panels.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/scripts/jsonSchema/index.ts
- why it matters: generates `public/jsonSchema.json` from `IDynamicFormConfig`, consumed by schema editors.

- path: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/vite.config.ts and /Users/wb.chen/Documents/AfterShip/am-dynamic-form/vite.server.config.ts
- why it matters: builds browser library from `src/index.ts` and server/common utils from `src/utils/interpreter.ts`; configures dev proxy to local marketing admin GraphQL.

## Evidence
- file_or_command: `sed -n '1,240p' /Users/wb.chen/Documents/Project/skills/NOTIFICATION_REPO_MAP_RESEARCH.md`
- finding: research protocol and Per-Repo Research Output Schema read first as requested.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/am-dynamic-form remote -v`
- finding: `local` remote points to `git@github.com:Wynne-cwb/am-dynamic-form.git`; `origin` points to `git@github.com:AfterShip/am-dynamic-form.git`; no `upstream` remote present.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/am-dynamic-form status --short --branch`
- finding: checkout is clean on `testing...origin/testing`.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/am-dynamic-form branch --all --sort=refname`
- finding: local branches include `master`, `testing`, `feat/components-export`, `feat/low-code`, `feat/sandbox`; remotes include `origin/master`, `origin/testing`, feature branches; no `master_v9` or flow-v3 candidate branches.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/Jenkinsfile
- finding: deployment config uses frontend flow, `appName: am-dynamic-form`, `gitRepoName: am-dynamic-form.git`, `npmPackageOnly: true`, Node 18.17.1 essential image, and prepublish build.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/package.json
- finding: package name `@aftership/am-dynamic-form`; exports main library, CSS, and JSON schema; scripts build with Vite and generate JSON schema; no team repo package dependency found.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/codegen.yml
- finding: GraphQL codegen depends on local Marketing Admin v1/v2 schema endpoints at ports 9003 and 9006.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/.env.development, `.env.testing`, `.env.staging`, `.env.production`
- finding: API host points to `/api/marketing/admin/graphql`, `release-incy-bff-api.automizely.io`, `staging-bff-api.automizely.com`, and `bff-api.automizely.com`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/utils/httpRequest.ts
- finding: `fetchMarketingAdminBffApi` posts GraphQL to `/marketing/admin/graphql` or `/marketing/admin/v2/graphql`; auth headers come from `window.getAuth`, with development fallback headers.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/components/typing.ts
- finding: schema supports form items, nested sections/columns, `when` conditional rules, `format` script field, validation metadata, remote-search flags, and multiple input/select component types.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/hooks/useGetRenderConditions.ts and /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/worker/executionScript.worker.ts
- finding: conditional rendering can be static rule arrays or script strings; script execution happens in a worker via `new Function` with `props`, `form`, and `dayjs`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/components/Block/SelectFilter/index.tsx and /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/components/Block/MultiSelectFilter/index.tsx
- finding: remote search calls `GetFieldItemDocument` through Marketing Admin BFF v2 when `remoteSearch` and `dataSource` are configured.

- file_or_command: /Users/wb.chen/Documents/AfterShip/am-dynamic-form/src/config/index.ts and `src/config/*.ts`
- finding: built-in debug configs reference marketing/flow trigger cases including BackInStock, Birthday email timing, OrderFollowUp, Winback, PriceDrop trigger frequency, and ShipmentsDigest tracking statuses/frequency.

- file_or_command: `rg -n "ModuleFederation|module federation|federation|exposes|remotes|shared" /Users/wb.chen/Documents/AfterShip/am-dynamic-form -g '!node_modules/**' -g '!dist/**' -g '!yarn.lock'`
- finding: no Module Federation config found in this repo.

- file_or_command: `rg -n "@aftership/am-dynamic-form" /Users/wb.chen/Documents/AfterShip -g 'package.json' -g '!**/node_modules/**' -g '!**/dist/**'`
- finding: direct package consumers found locally: `legacy-admin-portal/admin.automizely.org_marketing-operations`, `snap-form`, `sdks.am-static.com_admin-marketing-basic`, and `bff-api.automizely.com_marketing_admin_v2`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-basic/src/hooks/dynamicSchema/useRenderDynamicForm.ts
- finding: fetches `dynamicSchema` with `DynamicSchemaModeEnum.AmDynamicForm`, caches `schema_template`, then calls `renderAmDynamicForm`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/components/Editor/ActionCommonModal/index.tsx and /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/components/Editor/TriggerModal/index.tsx
- finding: notification/flow editor consumes `useRenderDynamicForm` from `adminMarketingBasic/basicHooks` for AmDynamicForm action and trigger settings UI.

- file_or_command: /Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2/src/modules/crm/dynamicForm/dynamicForm.service.ts
- finding: `dynamicFormConfig` fetches AmDynamicForm schema by `template_slug`, fills defaults/schema, then traverses datasource fields before returning config to the frontend.

- file_or_command: /Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2/src/modules/common/dynamicSchema/dynamicSchema.service.ts
- finding: `DynamicSchemaService` maps non-AmFilters schema mode to `TemplateKeyEnum.am_dynamic_form`, fetches schema templates from system dynamic config / asset templates, supports dynamic descriptions, and handles `AmDynamicForm` description formatting.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/admin.automizelyapi.org_mkt-operations/src/modules/flow-settings/flowSettings.resolver.ts
- finding: exposes `amDynamicFormMenus`, `setAmDynamicFormMenus`, `amDynamicFormSchema`, `setAmDynamicFormSchema`, `amDynamicFormDescription`, and `setAmDynamicFormDescription` using `TemplateKeyEnum.am_dynamic_form`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/legacy-admin-portal/admin.automizely.org_marketing-operations/src/views/businessSettings/amDynamicForm/index.vue
- finding: legacy marketing operations has a Dynamic Form settings UI that imports `IDynamicFormConfig`, package CSS, and `dist/jsonSchema.json`, then reads/writes schema and description via GraphQL.

- file_or_command: /Users/wb.chen/Documents/AfterShip/legacy-admin-portal/admin.automizely.org_marketing-operations/src/views/businessSettings/amDynamicForm/components/preview/index.vue
- finding: preview panel calls `renderAmDynamicForm` with current schema, emits expression values and validation state.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/src/DynamicFormEditor.tsx and /Users/wb.chen/Documents/AfterShip/snap-form/src/index.tsx
- finding: `snap-form` imports `IDynamicFormConfig`, `IFormItem`, `renderAmDynamicForm`, CSS, and re-exports `renderAmDynamicForm`; it uses the renderer for preview and schema export.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/SnapForm/components/DynamicFormEditor.tsx and /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/_shared/DeclarationPreviewDrawer/renderers/StepRender.tsx
- finding: ENS admin uses `@aftership/snap-form` DynamicForm editor and preview renderer; StepRender calls `renderAmDynamicForm` for `ui.form_schema.schema`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/example/constants/index.ts and /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-sms/example/constants/index.ts
- finding: email/SMS example constants reference `action_schema_mode: 'AmDynamicForm'` for flow actions such as time delay and status unchanged, supporting indirect notification/email/SMS dependency context.

## Open Questions
- question: Should `testing` be treated as the active release/development branch for this package, or only as an alpha publish lane?
- why it matters: protocol default `active_major` branches are absent, while current work and package version are on `testing`; future fixes need a verified base branch before editing.

- question: Is `AmDynamicFormInterpreter` still intended to translate FE form state to BE schema?
- why it matters: `src/utils/interpreter.ts` currently returns `{}`, while the debug editor still labels FE/BE schema outputs; changing migration behavior may require product/BFF confirmation.

- question: Are `@aftership/am-dynamic-form` GraphQL codegen peer dependencies intentionally listed as peer dependencies?
- why it matters: consumers may inherit unnecessary peer install constraints if these are only build-time dependencies.

- question: Does `fe-pltf-ens-admin` intentionally import `@aftership/am-dynamic-form/dist/style.css` directly while depending on it transitively through `@aftership/snap-form`?
- why it matters: direct CSS import through a transitive package can break if package managers enforce strict dependency boundaries.

- question: Which repo owns canonical AmDynamicForm schema templates now: legacy `admin.automizelyapi.org_mkt-operations`, `bff-api.automizely.com_marketing_admin_v2` backing services, `fe-pltf-ens-admin` SnapForm UI, or a shared system dynamic config process?
- why it matters: `am-dynamic-form` owns the renderer/type contract, but not schema persistence; future template changes need the correct source of truth.
