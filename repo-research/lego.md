# lego

## Summary
- project_id: `lego`
- repo_name: `lego`
- upstream_url: `https://github.com/AfterShip/lego`
- local_path: `/Users/wb.chen/Documents/AfterShip/lego`
- repo_type: React/Vite npm SDK package for flow canvas rendering, node/edge theming, drag-to-insert context, and action/step DSL utilities; package name is `@aftership/lego`.
- confidence: High for local checkout facts and `admin-flow` consumption evidence. Medium for published-version alignment because this checkout reports `@aftership/lego@1.0.35`, while local `sdks.am-static.com_admin-flow` consumes published `@aftership/lego@1.1.1`.

## Responsibility
- Owns:
  - ReactFlow-based action canvas component `Lego`, which converts `IActionGroup[]` workflow DSL into ReactFlow nodes/edges, maps action identities to caller-provided node/edge components, tracks measured node sizes, and recalculates layout.
  - Step DSL canvas component `LegoStepEditor`, which converts `IStep[]` into internal action-shaped DSL, adds visual-only `Gather`, `End`, and `FOREACH_END` nodes, renders with ReactFlow, and lays out step/branch/foreach structures.
  - Base flow node and edge UI primitives such as `BasicNode`, `NormalNode`, `SplitNode`, `EndNode`, `GatherNode`, `NormalEdge`, `SplitEdge`, `GatherEdge`, and related menu/tip/badge display props.
  - Drag/drop insertion plumbing through `LegoProvider`, `LegoContext`, `LegoDragWrapper`, edge `Action`, and `AddBlock`.
  - DSL mutation helpers for action and step modes: traverse, insert, update, remove, find, format/generate result keys, and step/action conversion.
  - NPM package/library distribution through Vite library mode and Jenkins `npmPackageOnly` publishing.
- Does not own:
  - Notification backend services, BFF APIs, GraphQL schemas, flow-template storage, template rendering, send-email/send-sms business execution, billing/business eligibility, or notification runtime processing.
  - `admin-flow` app/module code. `admin-flow` consumes `@aftership/lego` and supplies product-specific nodes, edges, action identities, Formik state, generated GraphQL types, and insert/update/delete logic.
  - `@aftership/mosaic-flow` source. Local evidence shows `npm-aftership-notification-flow` is a separate package using `@xyflow/react`, its own Mosaic provider/editor/types/tools, and no direct import of `@aftership/lego`.
  - Module Federation host/remote wiring.
- Common change areas:
  - Canvas renderers: `src/packages/Editor/index.tsx`, `src/packages/StepEditor/index.tsx`.
  - Shared exports/context/plugins: `src/index.ts`, `src/packages/index.ts`, `src/packages/Provider/**`, `src/packages/Plugins/**`.
  - Action DSL utilities: `src/utils/action/transform.ts`, `src/utils/action/scheduler.ts`, `src/utils/action/position.ts`.
  - Step DSL utilities: `src/utils/step/transform.ts`, `src/utils/step/scheduler.ts`, `src/utils/step/position.ts`.
  - Theme primitives: `src/theme/index.ts`, `src/theme/nodes/**`, `src/theme/edges/**`.
  - Public contracts: `src/typing/index.ts`.

## Branch Tracks
- production: `master` exists locally and in local remote refs. Current checkout is `master` tracking `local/master`; `git status --short --branch` reports `## master...local/master`.
- legacy_v9: No local or remote-tracking refs named `master_v9` were present in the local checkout.
- active_major: No local or remote-tracking refs named `feat/flow-v3-polaris-v13` or `feat/flow-v3` were present in the local checkout.
- repo_specific_notes:
  - Local refs observed: `master` and `remotes/local/master` at `76e735f`, `remotes/origin/master` at `1144534`, and `remotes/local/feat/support-step` at `b6341c5`.
  - `origin/master` is an ancestor of `local/master`; local refs show `local/master` one commit ahead with `76e735f :bookmark: (ASE-2060) Update package version`. No fetch was performed, so remote-tracking refs may be stale.
  - `local/feat/support-step` is an older support-step branch (`package.json` version `0.0.8`) and current `master` already contains `LegoStepEditor`/step utilities.
  - Remote anomaly recorded, not fixed: `origin` points to `git@github.com:AfterShip/lego.git`; `local` points to `git@github.com:Wynne-cwb/lego.git`; there is no `upstream` remote. This is inverted from the protocol's fork-first convention where `origin` should be the user fork and `upstream` should be the company repo.

## Module Federation
- enabled: No.
- exposes: None found in `lego`.
- remotes: None found in `lego`.
- shared_packages: No Module Federation `shared` config found. Library build externalizes `react`, `react-dom`, `uuid`, `tippy.js`, `@tippyjs/react`, and `clsx`; peer dependencies also include React, Tippy, clsx, and uuid.
- branch_alignment: `lego` is an npm SDK consumed by other frontends rather than a Module Federation remote. Version alignment should be handled through the published `@aftership/lego` package version. Local `admin-flow` consumes `@aftership/lego@1.1.1`, which is newer than this checkout's `package.json` version `1.0.35`.

## Team Repo Dependencies
- Direct dependencies:
  - No direct source dependency on other AfterShip/team repos was found in `lego/package.json`.
  - Direct runtime/library dependencies are third-party packages such as `reactflow`, `dagre`, `d3-flextree`, and `lodash-es`.
- Runtime calls:
  - No backend/API/runtime service calls were found in `src`.
  - Example node components use static icon URLs from `assets.am-static.com`, but those are demo assets, not repo-to-repo code dependencies.
- Build-time dependencies:
  - `Jenkinsfile` uses `@Library("jenkins-pipeline-library@automation")`, `flow = "frontend"`, `appName = "lego"`, `gitRepoName = "lego.git"`, `npmPackageOnly = true`, and `prePublishScript = "npm run clean && yarn build"`.
  - Build uses Vite library mode with `src/index.ts` as entry and emits `dist/index.es.js`, `dist/index.cjs.js`, and declarations.
- Shared packages:
  - Reverse dependency evidence: local `sdks.am-static.com_admin-flow` depends on `@aftership/lego@1.1.1`, imports `Lego`, `LegoProvider`, `LegoDragWrapper`, `Controls`, `IActionGroup`, `INodeProps`, `EndNode`, `ILegoConfig`, `ILegoTheme`, and DSL helpers from `@aftership/lego`.
  - `admin-flow` also imports `@aftership/lego/dist/style.css`.
- Inferred but unconfirmed:
  - `@aftership/mosaic-flow` appears to be a later/parallel flow-canvas SDK for notification flows, but local evidence shows no direct dependency edge between `lego` and `npm-aftership-notification-flow`.
  - The product migration relationship between `Lego`, `admin-flow`, and `mosaic-flow` needs owner confirmation; current evidence supports only "admin-flow consumes Lego" and "mosaic-flow is separate".

## Business Flows
- flow_id: `admin-flow-workflow-dsl`
- role: `lego` is the legacy/admin flow canvas SDK used by `@aftership/admin-flow` to render `Flow.workflow_dsl` as an action graph. `admin-flow` supplies product node components, edges, branch sort rules, action identities, Formik state, feature gating, and action args; `lego` supplies the canvas, drag insertion surface, layout, base node/edge UI, and DSL mutation helpers.
- upstream/downstream repos: Downstream consumer is `sdks.am-static.com_admin-flow`. Upstream data/API ownership is outside `lego`; in `admin-flow`, `Flow.workflow_dsl` comes from generated GraphQL/domain state and is passed into `Lego`.

- flow_id: `platform-step-dsl`
- role: `lego` has step-mode support through `LegoStepEditor` and `stepManager`. It converts generic steps such as `TRIGGER`, `FILTER`, `ACTION`, `IF_ELSE`, `SWITCH`, and `FOREACH` into internal action DSL for rendering, then converts back for mutation results.
- upstream/downstream repos: No confirmed external consumer found in the local checkout scan; local evidence is mainly `src/example-step/**` and exported package APIs.

- flow_id: `mosaic-notification-flow`
- role: Not owned by `lego`. Local `npm-aftership-notification-flow` package is named `@aftership/mosaic-flow`, uses `@xyflow/react`, exports `MosaicEditor`/`MosaicProvider`/Mosaic utilities, and has independent `IAction`/`IMosaic*` types and insert/move helpers.
- upstream/downstream repos: `npm-aftership-notification-flow` is a sibling/parallel repo. No direct import of `@aftership/lego` was found in that repo's source or package manifest.

## Important Entrypoints
- path: `/Users/wb.chen/Documents/AfterShip/lego/package.json`
- why it matters: Identifies package as `@aftership/lego`, version `1.0.35`, entry files, scripts, peer dependencies, and core dependencies (`reactflow`, `dagre`, `d3-flextree`, `lodash-es`).

- path: `/Users/wb.chen/Documents/AfterShip/lego/vite.config.ts`
- why it matters: Shows Vite library build, `src/index.ts` entry, ES/CJS output, declaration generation, externals, and absence of Module Federation config.

- path: `/Users/wb.chen/Documents/AfterShip/lego/Jenkinsfile`
- why it matters: Shows frontend/NPM-only publishing pipeline and package-oriented release model.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/index.ts`
- why it matters: Public root export for packages, theme, typing, and action/step scheduler/transform helpers.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/packages/index.ts`
- why it matters: Public package exports: `Lego`, `LegoStepEditor`, `LegoProvider`, `LegoContext`, `LegoDragWrapper`, and plugins.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/packages/Editor/index.tsx`
- why it matters: Main action-mode canvas; builds node/edge types from theme, generates nodes/edges from action DSL, tracks node dimensions, and computes positions.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/packages/StepEditor/index.tsx`
- why it matters: Step-mode canvas; converts step DSL to action DSL, adds gather/end nodes, generates step nodes/edges, and calculates step positions.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/typing/index.ts`
- why it matters: Defines public contracts such as `IActionGroup`, `IStep`, `IStepAction`, `ILegoProps`, `ILegoStepProps`, `ILegoTheme`, `ILegoConfig`, `INodeProps`, and insertion context.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/packages/Provider/index.tsx`
- why it matters: Wraps `ReactFlowProvider` and supplies hover/dragging/draggingNode/onInsert context.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/packages/Provider/DragWrapper/index.tsx`
- why it matters: Makes action/step palette items draggable and stores the node being dragged in `LegoContext`.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/theme/edges/Action/index.tsx`
- why it matters: Renders edge action affordance; during drag it swaps marker UI for `AddBlock` drop target and builds `data-track-id` from source node action identity plus branch option.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/theme/edges/Action/components/AddBlock/index.tsx`
- why it matters: Calls `onInsert({ source, target, option, node: draggingNode })` when a dragged node is dropped on an edge.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/utils/action/transform.ts`
- why it matters: Generates action-mode ReactFlow nodes/edges and appends visual `End` nodes.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/utils/action/scheduler.ts`
- why it matters: Mutates action DSL for insert/update/remove/find/format operations, including split-node branch insertion.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/utils/action/position.ts`
- why it matters: Uses `d3-flextree` to transform action DSL into a tree and calculate node positions.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/utils/step/transform.ts`
- why it matters: Converts step DSL to/from action DSL; handles `IF_ELSE`, `SWITCH`, `FOREACH`, `FOREACH_END`, `Gather`, and `End`.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/utils/step/scheduler.ts`
- why it matters: `stepManager` exposes insert/update/remove/find helpers over `IStep[]` by converting through action DSL.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/utils/step/position.ts`
- why it matters: Uses `dagre` to lay out step-mode nodes and offsets foreach child layouts.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/theme/index.ts`
- why it matters: Exports reusable theme nodes and edges consumed by apps such as `admin-flow`.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/example/index.tsx`
- why it matters: Demonstrates action-mode integration: `LegoProvider`, `Lego`, custom node/edge mapping, branch sort, action list, and `insertNode`.

- path: `/Users/wb.chen/Documents/AfterShip/lego/src/example-step/index.tsx`
- why it matters: Demonstrates step-mode integration: `LegoStepEditor`, `stepManager.insertNode`, step actions, `Gather`, and `End`.

- path: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/components/Editor/FlowRenderer/index.tsx`
- why it matters: Real consumer evidence: passes `values.workflow_dsl` into `<Lego dsl={...} config={LegoConfig} theme={LegoTheme}>`.

- path: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/features/FlowEditor/index.tsx`
- why it matters: Real consumer evidence: wraps flow editor layout in `<LegoProvider onInsert={...}>` and imports Lego stylesheet.

- path: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/config/index.ts`
- why it matters: Real consumer evidence: defines product-specific `LegoConfig` and `LegoTheme` mapping generated `ActionIdentityEnum` values to admin-flow action components and Lego theme nodes/edges.

- path: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/hooks/useFlowEditorUtils.ts`
- why it matters: Real consumer evidence: uses Lego helpers `insertNode`, `updateNode`, `removeNode`, `findNodeByResultKey`, `findNodeByActionIdentity`, and `generateResultKey` to mutate `workflow_dsl`.

- path: `/Users/wb.chen/Documents/AfterShip/Notification/npm-aftership-notification-flow/package.json`
- why it matters: Mosaic comparison evidence: package is `@aftership/mosaic-flow`, depends on `@xyflow/react`, and does not list `@aftership/lego`.

## Evidence
- file_or_command: `sed -n '1,240p' /Users/wb.chen/Documents/Project/skills/NOTIFICATION_REPO_MAP_RESEARCH.md`
- finding: Confirmed Per-Repo Research Output Schema, branch-track defaults, evidence rules, and fork-first remote expectations.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/lego status --short --branch`
- finding: Checkout is clean and on `master` tracking `local/master`.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/lego remote -v`
- finding: `origin` is `git@github.com:AfterShip/lego.git`; `local` is `git@github.com:Wynne-cwb/lego.git`; no `upstream` remote exists.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/lego config --get-regexp '^(remote|branch)\.'`
- finding: `branch.master.remote local`; `remote.origin.url git@github.com:AfterShip/lego.git`; `remote.local.url git@github.com:Wynne-cwb/lego.git`.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/lego for-each-ref --format='%(refname:short) %(objectname:short)' refs/heads refs/remotes`
- finding: Local refs include `master 76e735f`, `local/master 76e735f`, `origin/master 1144534`, and `local/feat/support-step b6341c5`.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/lego branch --list master_v9 feat/flow-v3-polaris-v13 feat/flow-v3 && git ... branch -r --list '*/master_v9' '*/feat/flow-v3-polaris-v13' '*/feat/flow-v3'`
- finding: No `legacy_v9` or active major branch candidates were present in local refs.

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/lego log --left-right --cherry-pick --oneline origin/master...local/master`
- finding: Local refs show `local/master` ahead of `origin/master` by `76e735f :bookmark: (ASE-2060) Update package version`; no network refresh was performed.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/package.json`
- finding: Package is `@aftership/lego`, version `1.0.35`, with library entrypoints and dependencies on `reactflow`, `dagre`, `d3-flextree`, and `lodash-es`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/vite.config.ts`
- finding: Vite library build exposes `src/index.ts` as ES/CJS bundle and externalizes React/Tippy/uuid/clsx; no Module Federation config.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/Jenkinsfile`
- finding: CI config is NPM-package publishing only (`npmPackageOnly = true`), with `prePublishScript = "npm run clean && yarn build"`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/src/packages/Editor/index.tsx`
- finding: `Lego` renders ReactFlow from action DSL, generates nodes/edges, maps theme components, recalculates positions after node dimension changes, and hides ReactFlow attribution.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/src/packages/StepEditor/index.tsx`
- finding: `LegoStepEditor` converts step DSL to action DSL, adds gather/end nodes, generates step nodes/edges, and recalculates positions after dimension changes.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/src/typing/index.ts`
- finding: Public contracts include `IActionGroup` with `definition.action_identity`, `inputs`, and `branches`; step contracts include `IStep`, `IStepAction`, and `ILegoStepProps`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/src/utils/action/scheduler.ts`
- finding: Action-mode helper owns traversal, insert, update, remove, find, and result-key formatting; insert handles normal nodes and split nodes.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/src/utils/step/transform.ts`
- finding: Step-mode conversion handles `IF_ELSE`, `SWITCH`, `FOREACH`, `FOREACH_END`, `Gather`, and `End`, and strips visual-only nodes when converting action DSL back to step DSL.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/src/packages/Provider/DragWrapper/index.tsx` and `/Users/wb.chen/Documents/AfterShip/lego/src/theme/edges/Action/components/AddBlock/index.tsx`
- finding: Drag wrapper records dragged action/step node; edge drop target emits `onInsert` with source, target, branch option, and dragged node.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/src/example/index.tsx`
- finding: Demo action-mode flow uses `LegoProvider`, `Lego`, `Controls`, `insertNode`, custom action identities, custom nodes/edges, and branch sort config.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/lego/src/example-step/index.tsx`
- finding: Demo step-mode flow uses `LegoStepEditor`, `stepManager.insertNode`, `TRIGGER/FILTER/ACTION/JSONATA/IF_ELSE`, `Gather`, `End`, and custom gather edge.

- file_or_command: `rg -n "@aftership/lego" /Users/wb.chen/Documents/AfterShip --glob 'package.json' --glob 'yarn.lock' ...`
- finding: Local package/lockfile scan found `@aftership/lego` as this repo's package and as a dependency in `Notification/sdks.am-static.com_admin-flow`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/package.json`
- finding: `@aftership/admin-flow` depends on `@aftership/lego: "1.1.1"` and has Module Federation/admin frontend dependencies; this is consumer evidence, not a dependency inside `lego`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/components/Editor/FlowRenderer/index.tsx`
- finding: `admin-flow` renders `<Lego>` with `values.workflow_dsl`, `LegoConfig`, and `LegoTheme`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/features/FlowEditor/index.tsx`
- finding: `admin-flow` wraps its editor in `<LegoProvider onInsert={...}>` and imports `@aftership/lego/dist/style.css`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/config/index.ts`
- finding: `admin-flow` owns product node/edge mapping from `ActionIdentityEnum` to components such as `Trigger`, split nodes, email/SMS/webhook actions, and Lego base `EndNode`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/src/hooks/useFlowEditorUtils.ts`
- finding: `admin-flow` owns product-specific insertion/update/delete behavior over Formik `workflow_dsl`, using Lego's DSL helper functions.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/npm-aftership-notification-flow/package.json`
- finding: Mosaic repo package is `@aftership/mosaic-flow`, depends on `@xyflow/react`, and does not depend on `@aftership/lego`.

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/npm-aftership-notification-flow/src/packages/Editor/index.tsx`
- finding: Mosaic editor uses `@xyflow/react`, `MosaicProvider`, `conversionAction`, a position worker, ghost nodes/edges, and Mosaic-specific types; it is independent from Lego's ReactFlow v11 implementation.

## Open Questions
- question: Which branch/tag/source corresponds to published `@aftership/lego@1.1.1` consumed by `admin-flow`?
- why it matters: Current local checkout reports `1.0.35` and no local tag/ref for `1.1.1`; consumer evidence may refer to a newer published package than this checkout's visible source state.

- question: Is `@aftership/mosaic-flow` intended to replace `@aftership/lego`, coexist with it, or serve a separate notification-flow product surface?
- why it matters: Code evidence shows a separate package and no direct dependency, but product/roadmap relationship is not encoded in local source.

- question: Is `local/feat/support-step` still meaningful for any maintenance track?
- why it matters: The branch name suggests step support, but current `master` already includes step editor code and the branch appears older (`0.0.8`).

- question: Should the remote naming be repaired later?
- why it matters: The checkout violates the protocol's fork-first naming convention (`origin` is upstream and `local` is fork), but this research task is read-only and explicitly should not fix remote configuration.
