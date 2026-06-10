# sdk-nodejs-snap-form

## Summary
- project_id: sdk-nodejs-snap-form
- repo_name: sdk-nodejs-snap-form
- upstream_url: https://github.com/AfterShip/sdk-nodejs-snap-form
- local_path: /Users/wb.chen/Documents/AfterShip/snap-form
- repo_type: npm library / Vite React Snap Form visual authoring SDK for Dynamic Form and Advanced Filters schemas.
- confidence: high for local source, git, package, CI, and downstream local checkout evidence; medium for complete organization-wide consumer coverage because no network search was used.

## Responsibility
- Owns: `@aftership/snap-form`, a React/GrapesJS authoring UI for Dynamic Form and Advanced Filters schemas; public exports for `DynamicFormEditor`, `AdvanceFiltersEditor`, `renderSnapFormEditor`, schema types, preset icons, description transformation helpers, and re-exported runtime renderers from `@aftership/am-dynamic-form` / `@aftership/advance-filters`.
- Owns: visual schema editing concerns such as block palettes, GrapesJS component plugins, custom traits/settings panels, layers/properties/toolbars, JSON import/export/code editing, schema-to-GrapesJS conversion, preview mode, `description_setting` authoring, and custom data source option injection into editor controls.
- Does not own: the canonical runtime implementations of Dynamic Form or Advanced Filters rendering, notification flow execution, declaration persistence, admin GraphQL/BFF APIs, Module Federation hosting, email/SMS/template delivery, or downstream ENS admin popup/window orchestration.
- Common change areas: `src/index.tsx` for public API; `src/DynamicFormEditor.tsx` and `src/AdvanceFiltersEditor.tsx` for authoring/preview/save behavior; `src/components/Blocks/**` and `src/components/Components/**` for supported schema components; `src/components/Traits/**` and `src/config/*TraitsConfig/**` for editable properties; `src/utils/format*Schema.ts`, `src/utils/formatSchema.ts`, and `src/utils/transformDescription.ts` for schema conversion/description behavior; `src/components/Editor/**` and `src/styles/**` for editor UI.

## Branch Tracks
- production: `master` exists locally and as `origin/master` / `local/master`. `git show origin/master:package.json` shows package version `1.0.9`, dependencies `@aftership/advance-filters@^1.0.3-alpha.7` and `@aftership/am-dynamic-form@^1.0.2`.
- legacy_v9: not found. Targeted branch scan for `master_v9` returned no local or remote-tracking refs.
- active_major: protocol default branches `feat/flow-v3-polaris-v13` and `feat/flow-v3` are not present in local or remote-tracking refs. Current checkout is `testing...origin/testing` and `git show origin/testing:package.json` shows alpha package version `1.0.9-alpha.96`, with newer `@aftership/advance-filters@^1.0.4-alpha.175` and `@aftership/am-dynamic-form@^1.0.6-alpha.28`.
- repo_specific_notes: `testing` appears to be the current alpha integration/publish lane for Snap Form work, while `master` is the stable package lane. A historical `main` branch exists with private `0.0.0` package metadata and old `@aftership/am-dynamic-form@0.2.0-alpha.7`, so it should not be assumed as the active base. Remote layout is not fork-first: `origin` points to `git@github.com:AfterShip/sdk-nodejs-snap-form.git`, `local` points to `git@github.com:Wynne-cwb/sdk-nodejs-snap-form.git`, and no `upstream` remote exists; recorded only, not repaired.

## Module Federation
- enabled: false as a remote/host in this repo. No MF config files were found, and search for `ModuleFederation`, `federation`, `remoteEntry`, `exposes`, or `remotes` found no relevant config outside an unrelated CKEditor `sharedspace` string.
- exposes: none.
- remotes: none.
- shared_packages: not applicable as Module Federation shared config. As an npm package, public/peer boundaries are controlled by `package.json`: exports `dist/index.es.js`, `dist/index.umd.js`, `dist/index.d.ts`, and `dist/style.css`; Rollup externalizes `react`, `react-dom`, `antd`, and `monaco-editor`.
- branch_alignment: consumers align by npm package version, not MF branch URL. `fe-pltf-ens-admin` consumes `@aftership/snap-form@^1.0.9-alpha.220`, which is ahead of this checkout's `testing` version `1.0.9-alpha.96`; verify package/version target before changing downstream behavior.

## Team Repo Dependencies
- Direct dependencies: `@aftership/advance-filters@^1.0.4-alpha.175` and `@aftership/am-dynamic-form@^1.0.6-alpha.28` from `package.json`; `yarn.lock` resolves both from npm tarballs. The local source imports types, CSS, component render helpers, `renderAdvanceFilters`, `renderAmDynamicForm`, and `useExecutionScript` from these packages.
- Runtime calls: this repo itself does not define GraphQL/HTTP calls. Runtime rendering/preview is delegated to `renderAmDynamicForm` and `renderAdvanceFilters`; data source options enter through `dataSourceOptions` props and are held in `src/utils/dataSourceManager.ts`.
- Build-time dependencies: Vite library build with `vite-plugin-dts`, `vite-plugin-monaco-editor`, `vite-plugin-svgr`, React, Ant Design, GrapesJS, Highlight.js, and Sass. Jenkins config uses frontend flow with `npmPackageOnly: true`, Node `18.17.1`, `unitTest: yarn test`, and `prepublishOnly: yarn build`.
- Shared packages: publishes `@aftership/snap-form` and re-exports `renderAdvanceFilters`, `renderAmDynamicForm`, `transformDescriptionByExpressions`, `transformDescriptionByForm`, `getAdvanceFiltersDataSourceCache`, `getProductWithStoreCache`, and `PRESET_ICONS`.
- Downstream consumers observed locally: `fe-pltf-ens-admin` directly depends on `@aftership/snap-form@^1.0.9-alpha.220`. A local scan of package manifests under `/Users/wb.chen/Documents/AfterShip` found no other direct `@aftership/snap-form` package consumer.
- Relationship to `am-dynamic-form`: Snap Form does not replace the renderer. It uses `IDynamicFormConfig`, `IFormItem`, `renderAmDynamicForm`, component render helpers, CSS, and `useExecutionScript` from `@aftership/am-dynamic-form` to author, convert, preview, and describe Dynamic Form schemas.
- Relationship to Advanced Filters: Snap Form uses `@aftership/advance-filters` for filter types, components, renderer, CSS, data source cache helpers, and condition expression shapes; `AdvanceFiltersEditor` wraps these into an authoring UI that saves `IAdvanceFilterData` / `uiSchema`.
- Relationship to notification flow: newer Flow declaration authoring in `fe-pltf-ens-admin` uses Snap Form for condition/trigger/step UI schema editing and preview. Older `sdks.am-static.com_admin-flow` evidence still goes through `adminMarketingBasic/basicHooks` and `@aftership/am-dynamic-form` for AmDynamicForm runtime rendering rather than directly depending on `@aftership/snap-form`.
- Relationship to `fe-pltf-ens-admin`: `fe-pltf-ens-admin` opens `/aio-notifications/detail/snapFormEditor?...`, passes schema via URL/localStorage, receives `snap-form-editor-save` / `snap-form-editor-cancel` through `postMessage`, embeds `DynamicFormEditor` / `AdvanceFiltersEditor`, and uses re-exported `renderAmDynamicForm` / `renderAdvanceFilters` in Flow template/declaration preview.
- Backend/schema reference dependency: `admin.automizelyapi.org_mkt-operations` does not import the package, but its Flow AI Assistant has a `snap-form-schema-reference.skill.ts` knowledge module and adapters that mirror Snap Form schema/`PRESET_ICONS` conventions; this is a documentation/contract dependency, not an npm runtime dependency.
- Inferred but unconfirmed: The authoritative persistence location for schemas authored by Snap Form is downstream Flow declaration/template APIs in `fe-pltf-ens-admin` / `admin.automizelyapi.org_mkt-operations`; this repo only emits JSON through callbacks and postMessage consumers.

## Business Flows
- flow_id: snap_form_dynamic_form_authoring
- role: provides the visual authoring UI for Dynamic Form schemas such as trigger frequency, polling, step form schema, and extra form schema. It converts between GrapesJS components and `IDynamicFormConfig` JSON, previews via `renderAmDynamicForm`, and emits `{ default, schema, description_setting }` on save.
- upstream/downstream repos: upstream package dependency `am-dynamic-form`; downstream `fe-pltf-ens-admin` Flow SnapForm route and UI schema drawers; backend persistence likely through `admin.automizelyapi.org_mkt-operations` notification-flow declaration APIs.

- flow_id: snap_form_advanced_filter_authoring
- role: provides visual authoring for Advanced Filters condition declarations. It combines category/label/help/icon/initialValues metadata with a filter `uiSchema`, previews via `renderAdvanceFilters`, and emits `IAdvanceFiltersExportData`.
- upstream/downstream repos: upstream package dependency `npm-aftership-advance-filters` / `@aftership/advance-filters`; downstream `fe-pltf-ens-admin` condition declaration edit drawer, template preview modal, declaration preview drawer, and Flow template editor.

- flow_id: notification_flow_declaration_preview
- role: supplies runtime renderer exports used by `fe-pltf-ens-admin` to preview saved declaration schemas in Flow UI. Step preview calls `renderAmDynamicForm` for `ui.form_schema.schema`; condition preview calls `renderAdvanceFilters` and formats resulting condition trees/descriptions.
- upstream/downstream repos: upstream renderers are `am-dynamic-form` and `advance-filters`; downstream is `fe-pltf-ens-admin`; older `sdks.am-static.com_admin-flow` path is indirect through `adminMarketingBasic` and `am-dynamic-form`.

## Important Entrypoints
- path: /Users/wb.chen/Documents/AfterShip/snap-form/package.json
- why it matters: package identity `@aftership/snap-form`, current alpha version, exports, scripts, peer dependencies, and direct team package dependencies.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/Jenkinsfile
- why it matters: confirms frontend pipeline, package-only publish mode, app/repo names, Node runtime, and test/publish behavior.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/vite.config.ts
- why it matters: confirms Vite library build from `src/index.tsx`, generated d.ts output, externalized packages, dev port `5174`, and no Module Federation config.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/index.tsx
- why it matters: public API surface and DOM renderer selector for `dynamic-form` vs `advance-filters`; also re-exports downstream runtime renderers and helpers.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/DynamicFormEditor.tsx
- why it matters: core Dynamic Form authoring UI; initializes GrapesJS, registers blocks/components/traits, previews with `renderAmDynamicForm`, opens JSON code editor, converts GrapesJS data to `IDynamicFormExportData`, and saves schema/default/description.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/AdvanceFiltersEditor.tsx
- why it matters: core Advanced Filters authoring UI; initializes GrapesJS with filter blocks/components/style sectors, validates metadata, previews with `renderAdvanceFilters`, converts to `IAdvanceFiltersExportData`, and persists filter metadata plus `uiSchema`.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/components/Blocks/index.ts
- why it matters: authoritative list of draggable Dynamic Form and Advanced Filters block types exposed in the editor.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/components/Components/index.ts
- why it matters: maps supported component types into GrapesJS DOM component plugins for both editor modes.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/components/Editor/Panel/index.tsx
- why it matters: left-side blocks/layers/settings UI, including Advanced Filters metadata fields and Dynamic Form initial values / description settings.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/components/Editor/Toolbar/index.tsx
- why it matters: import/export, preview, code editor entry, border toggle, save/cancel controls, and JSON file contract.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/components/Traits/index.tsx and /Users/wb.chen/Documents/AfterShip/snap-form/src/config/*TraitsConfig/**
- why it matters: custom GrapesJS trait/property editing surface for each mode.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/utils/formatSchema.ts
- why it matters: converts GrapesJS components back into schema components and strips editor-only data such as IDs/label component.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/utils/formatDynamicFormSchema.ts
- why it matters: converts `IDynamicFormConfig.schema` into GrapesJS component data for editing/import.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/utils/formatAdvanceFiltersSchema.ts
- why it matters: converts Advanced Filters `uiSchema` into GrapesJS component data for editing/import.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/utils/transformDescription.ts and /Users/wb.chen/Documents/AfterShip/snap-form/src/hooks/useDescription.ts
- why it matters: editor-side description preview and exported helpers for Dynamic Form / Advanced Filters condition descriptions.

- path: /Users/wb.chen/Documents/AfterShip/snap-form/src/utils/dataSourceManager.ts
- why it matters: global editor data source option registry, merging defaults with downstream-provided condition data sources.

- path: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/SnapForm/**
- why it matters: primary downstream editor integration; wraps Snap Form editors, populates schemas, and uses postMessage save/cancel protocol.

- path: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/hooks/useSnapFormEditor.ts
- why it matters: downstream popup orchestration, URL/localStorage payload passing, and `snap-form-editor-*` message handling.

- path: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/_shared/DeclarationPreviewDrawer/renderers/StepRender.tsx and /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/_shared/DeclarationPreviewDrawer/renderers/ConditionRender.tsx
- why it matters: downstream runtime preview use of Snap Form re-exported renderers.

## Evidence
- file_or_command: `sed -n '1,260p' /Users/wb.chen/Documents/Project/skills/NOTIFICATION_REPO_MAP_RESEARCH.md`
- finding: protocol and Per-Repo Research Output Schema were read first; branch-track defaults and evidence rules came from this file.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/snap-form status --short --branch`
- finding: checkout is clean on `testing...origin/testing`.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/snap-form remote -v`
- finding: `origin` points to `git@github.com:AfterShip/sdk-nodejs-snap-form.git`, `local` points to `git@github.com:Wynne-cwb/sdk-nodejs-snap-form.git`, and no `upstream` remote exists; this is a fork-first remote anomaly.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/snap-form branch --all --list`
- finding: local refs include `main`, `master`, `testing`, `feat/am-filters`, and `feat/optimize`; remote-tracking refs include `origin/master`, `origin/testing`, `origin/feat/am-filters`, dependabot branches, `local/master`, and `local/testing`.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/snap-form branch --all --list '*master*' '*master_v9*' '*feat/flow-v3*' '*feat/flow-v3-polaris-v13*' '*testing*' '*main*'`
- finding: found `main`, `master`, `testing`, `remotes/local/master`, `remotes/local/testing`, `remotes/origin/master`, and `remotes/origin/testing`; did not find `master_v9` or either flow-v3 candidate.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/snap-form show origin/master:package.json`
- finding: production package metadata is `@aftership/snap-form@1.0.9` with older `@aftership/advance-filters` and `@aftership/am-dynamic-form` dependency ranges.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/snap-form show origin/testing:package.json`
- finding: current alpha metadata is `@aftership/snap-form@1.0.9-alpha.96`, depending on `@aftership/advance-filters@^1.0.4-alpha.175` and `@aftership/am-dynamic-form@^1.0.6-alpha.28`.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/snap-form log --oneline --decorate --max-count=30 --all`
- finding: recent `testing` history is mostly ASE-1078 package upgrades and editor UI changes, including upgrades for `advance-filters` and `am-dynamic-form`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/package.json
- finding: package name, exports, direct deps, peer deps, and build/test scripts identify this as an npm library package, not a deployed SPA/service.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/Jenkinsfile
- finding: pipeline uses `flow = "frontend"`, `appName = "sdk-nodejs-snap-form"`, `npmPackageOnly = true`, and Node `18.17.1`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/vite.config.ts
- finding: library build entry is `src/index.tsx`; Rollup externalizes `react`, `react-dom`, `antd`, and `monaco-editor`; no MF config exists.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/src/index.tsx
- finding: exports editors, types, `renderSnapFormEditor`, re-exported `renderAdvanceFilters` / `renderAmDynamicForm`, description helpers, data source caches, and `PRESET_ICONS`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/src/DynamicFormEditor.tsx
- finding: initializes GrapesJS for Dynamic Form mode; uses `DYNAMIC_FORM_BLOCKS`, `DynamicFormComponentPlugins`, CKEditor plugin, traits manager, `dynamicFormToGrapes`, `grapesToSchemaComponents`, and `renderAmDynamicForm` for preview/save.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/src/AdvanceFiltersEditor.tsx
- finding: initializes GrapesJS for Advanced Filters mode; validates icon/label/category/initialValues; converts schema via `advanceFiltersToGrapes`; previews and saves through `renderAdvanceFilters`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/src/components/Blocks/index.ts and /Users/wb.chen/Documents/AfterShip/snap-form/src/components/Components/index.ts
- finding: block/component registrations enumerate supported Dynamic Form elements and Advanced Filters elements.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/src/utils/formatSchema.ts, `formatDynamicFormSchema.ts`, and `formatAdvanceFiltersSchema.ts`
- finding: conversion logic is local to Snap Form and bridges external schema JSON with GrapesJS editor data.

- file_or_command: /Users/wb.chen/Documents/AfterShip/snap-form/src/utils/transformDescription.ts
- finding: description preview/export helpers depend on `useExecutionScript` from `@aftership/am-dynamic-form` and condition expression types from `@aftership/advance-filters`.

- file_or_command: `rg -n "ModuleFederation|module federation|federation|remoteEntry|exposes|remotes|shared" /Users/wb.chen/Documents/AfterShip/snap-form -g '!node_modules/**' -g '!dist/**' -g '!yarn.lock'`
- finding: no relevant Module Federation config found; only unrelated CKEditor `sharedspace` text matched.

- file_or_command: `rg -n "@aftership/snap-form" /Users/wb.chen/Documents/AfterShip -g 'package.json' -g '!**/node_modules/**' -g '!**/dist/**' -g '!**/.git/**'`
- finding: direct local package consumers are the package itself and `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/package.json`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/package.json
- finding: downstream host depends on `@aftership/snap-form@^1.0.9-alpha.220`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/SnapForm/components/DynamicFormEditor.tsx
- finding: downstream wraps `DynamicFormEditor` from `@aftership/snap-form`, normalizes `default`, passes `dataSourceOptions`, and posts `snap-form-editor-save` / `snap-form-editor-cancel`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/SnapForm/components/AdvanceFilterEditor.tsx
- finding: downstream wraps `AdvanceFiltersEditor`, loads condition declaration data, derives templates/icons/initialValues, and posts Snap Form save/cancel messages.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/SnapForm/index.tsx and /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/hooks/useSnapFormEditor.ts
- finding: downstream route reads URL params/localStorage, fetches data source UI assets, selects editor mode, opens `/aio-notifications/detail/snapFormEditor`, and handles postMessage callbacks.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/components/Form/ProFormSnapFormButton/index.tsx
- finding: downstream reusable form button opens Snap Form editors for `advanced_filter` or `dynamic_form` mode.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/TriggerDeclaration/components/EditDrawer/index.tsx and `/src/components/UISchemaDrawer/index.tsx`
- finding: Flow trigger/step UI schema editors use `SnapFormMode.DYNAMIC_FORM` for frequency, polling, form schema, and extra form schema authoring.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/ConditionDeclaration/components/EditDrawer/index.tsx
- finding: Flow condition declaration editing uses `SnapFormMode.ADVANCED_FILTER`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Flows/_shared/DeclarationPreviewDrawer/renderers/StepRender.tsx and `/ConditionRender.tsx`
- finding: declaration preview renders saved Dynamic Form / Advanced Filters schemas through `renderAmDynamicForm` and `renderAdvanceFilters` imported from `@aftership/snap-form`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-marketing-basic/src/hooks/dynamicSchema/useRenderDynamicForm.ts
- finding: older notification flow runtime path fetches `dynamicSchema` with `schema_mode: AmDynamicForm` and calls `renderAmDynamicForm` from `@aftership/am-dynamic-form`, not Snap Form.

- file_or_command: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/components/Editor/ActionCommonModal/index.tsx and `/TriggerModal/index.tsx`
- finding: older admin-flow UI consumes `useRenderDynamicForm` from `adminMarketingBasic/basicHooks`, so the runtime relation to Snap Form is indirect via shared schema concepts and `am-dynamic-form`.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/admin.automizelyapi.org_mkt-operations/src/modules/flow-ai-assistant/skills/snap-form-schema-reference.skill.ts
- finding: backend Flow AI Assistant stores Snap Form dynamic_form / advanced_filter schema reference content, including `description_setting` guidance, as a contract reference.

- file_or_command: /Users/wb.chen/Documents/AfterShip/admin-portal/admin.automizelyapi.org_mkt-operations/src/modules/flow-ai-assistant/adapters/condition-declaration-write.adapter.ts
- finding: backend adapter mirrors `PRESET_ICONS from @aftership/snap-form` static CDN icon mapping for condition declaration writes.

## Open Questions
- question: Is `testing` the intended active development/publish lane for Snap Form changes, or should future edits start from `master` and publish alpha tags separately?
- why it matters: protocol `active_major` branches are absent, while downstream `fe-pltf-ens-admin` consumes an alpha version newer than this checkout's `testing` package version.

- question: Why does `fe-pltf-ens-admin` consume `@aftership/snap-form@^1.0.9-alpha.220` while this local checkout is `1.0.9-alpha.96` on `origin/testing`?
- why it matters: local source may lag the package currently used by the main downstream host; before changing behavior, confirm the correct source branch/ref/tag.

- question: Should remote layout be repaired to fork-first (`origin` user fork, `upstream` AfterShip) before any future edit?
- why it matters: current remotes are reversed relative to the repo research protocol and contribution workflow.

- question: Should `@aftership/snap-form` directly declare every renderer/style package it re-exports or requires consumers to import?
- why it matters: downstream files import `@aftership/am-dynamic-form/dist/style.css` in some places while depending directly on `@aftership/snap-form`; strict package managers may expose dependency boundary issues.

- question: Is `admin.automizelyapi.org_mkt-operations`'s Snap Form schema reference meant to be generated from this repo, manually mirrored, or maintained independently?
- why it matters: it currently encodes schema rules and icon mappings that can drift from Snap Form source.

- question: Should the old `sdks.am-static.com_admin-flow` runtime path migrate to Snap Form exports, or remain on `adminMarketingBasic` / `@aftership/am-dynamic-form`?
- why it matters: current evidence shows two parallel flows: old runtime rendering through `am-dynamic-form`, and newer declaration authoring/preview through `fe-pltf-ens-admin` plus `@aftership/snap-form`.
