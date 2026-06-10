# emailcat

## Summary
- project_id: `emailcat`
- repo_name: `emailcat`
- upstream_url: `https://github.com/AfterShip/emailcat`
- local_path: none found under `/Users/wb.chen/Documents/AfterShip`; only installed package copies were found under downstream `node_modules`.
- repo_type: private TypeScript GitHub repo; downstream repos consume the npm package/import namespace `@aftership/emailcat`. Source-level repo type, package layout, and build system are not verified because no local checkout was available and this research used only GitHub metadata plus local downstream evidence.
- confidence: Partial. High for repo identity, default branch, accessible remote metadata, branch existence, and local downstream consumption. Low for internal ownership, source entrypoints, direct dependencies, runtime calls, and Module Federation status until the repo is cloned or otherwise source-accessible.

## Responsibility
- Owns:
  - Confirmed repo identity: private `AfterShip/emailcat`, primary language TypeScript, default branch `master`.
  - Confirmed downstream package API surface consumed as `@aftership/emailcat`: editor/provider components and hooks such as `EmailCatEditorProvider`, `EmailcatEditor`, `useEditorContext`, types such as `IEmailTemplate`/`IPage`/`IBlockData`, styles at `@aftership/emailcat/lib/style.css`, and core render helpers such as `JsonToMjml` and `getPageIdx`.
  - Inferred, not source-confirmed: likely source repository for the internal `@aftership/emailcat` package used by legacy/easy email editing and JSON-to-MJML rendering.
- Does not own:
  - `admin-email` business/editor integration, GraphQL calls, Module Federation remote, content group save/preview flows, or wrapper exports. Those are owned by `sdks.am-static.com_admin-email`.
  - `email-renderer` worker scheduling, Nest service APIs, advanced email prebuilt-section fetching, or final render service wrapper. Those are owned by `product.automizelyapi.com_email-renderer`.
  - MailCraft advanced email editor/render engine. Existing `sdk-ts-mailcraft-editor` research records MailCraft as separate and notes it does not directly depend on or maintain `@aftership/emailcat`.
  - Admin host/product-specific prebuilt blocks, billing gates, merge-tag fetching, image/font callbacks, and business-specific dynamic inputs supplied by downstream consumers.
- Common change areas:
  - Source paths unknown without checkout.
  - Based on downstream imports only, likely sensitive areas are package public exports, `lib/core` render helpers, CSS/style packaging, easy-email core types/blocks, editor provider APIs, and hooks used by admin-email/admin hosts.

## Branch Tracks
- production: `master` exists and is the GitHub default branch. `git ls-remote --heads` observed `refs/heads/master` at `5d9334b91ab81acf080687a1d6743795236e93ce`.
- legacy_v9: not found. Focused `git ls-remote --heads` for `master_v9` returned no ref.
- active_major: protocol candidates not found. Focused `git ls-remote --heads` for `feat/flow-v3-polaris-v13` and `feat/flow-v3` returned no refs.
- repo_specific_notes:
  - Additional focused refs observed: `next` at `df5ad4f5a2ded62be3b5b4922f55aca84cbc4dd6` and `testing` at `126f9a9afbdc1655afb7f74297502ba91db860f9`.
  - Full remote branch listing includes many feature, revert, fix, and Dependabot branches. Branch names mention package paths such as `packages/easy-email-core`, `packages/easy-email-editor`, and `packages/easy-email-extensions`, but source files were not read, so package layout remains unconfirmed.
  - No local checkout means no local remote naming/fork-first status could be inspected.

## Module Federation
- enabled: unknown from `emailcat` source. No local checkout was available to inspect webpack/Vite/Rspack/module-federation configs.
- exposes: unknown.
- remotes: unknown.
- shared_packages:
  - Downstream `sdks.am-static.com_admin-flow` treats `@aftership/emailcat` as a Module Federation shared singleton and, in one shared block, `import: false`.
  - Downstream `sdks.am-static.com_admin-email` consumes `@aftership/emailcat` as a package dependency and exposes/wraps email surfaces through its own Module Federation remote; this does not prove `emailcat` itself is an MF remote.
- branch_alignment:
  - No protocol active-major branches exist for `emailcat`; downstream branch alignment should be checked in the consumer repo doing the work, especially `admin-email`, `admin-flow`, and host admin repos.
  - Package-version alignment matters: local consumers currently reference `@aftership/emailcat` versions such as `3.7.35`, `^3.7.18`, and `^3.7.12`.

## Team Repo Dependencies
- Direct dependencies:
  - Unknown for `emailcat` itself because source manifests were not inspected.
  - Downstream direct consumers confirmed locally include `sdks.am-static.com_admin-email`, `admin.aftership.com`, and `sdks.am-static.com_admin-flow`.
- Runtime calls:
  - Unknown for `emailcat` itself.
  - Downstream evidence suggests consumers pass business data, dynamic inputs, merge tags, prebuilt blocks, upload callbacks, image/font configuration, and preview data into `EmailCatEditorProvider`; those runtime integrations live in consumers, not proven inside `emailcat`.
- Build-time dependencies:
  - Unknown for `emailcat` itself.
- Shared packages:
  - `sdks.am-static.com_admin-email` depends on `@aftership/emailcat@3.7.35`, imports editor/provider APIs, imports `@aftership/emailcat/lib/style.css`, exports `JsonToMjml as EasyEmailRender` from `@aftership/emailcat/lib/core`, and uses `getPageIdx` in previewers.
  - `product.automizelyapi.com_email-renderer` depends on `@aftership/admin-email@1.11.49`; its lockfile shows that package pulls `@aftership/emailcat@3.7.35`, and its worker directly requires `@aftership/emailcat/lib/core` for `getPageIdx`.
  - `sdk-ts-mailcraft-editor` report records the boundary: MailCraft does not directly depend on `@aftership/emailcat`; `admin-email` wraps MailCraft as `AdvancedEmailRender` while also exporting `EasyEmailRender` from `@aftership/emailcat/lib/core`.
  - `sdks.am-static.com_admin-flow` has `@aftership/emailcat` in dev dependencies and Module Federation shared config.
  - `admin.aftership.com` directly depends on `@aftership/emailcat` and uses `EmailCatEditorProvider`, styles, merge tags, dynamic inputs, and prebuilt blocks in its email editor.
- Inferred but unconfirmed:
  - `AfterShip/emailcat` is probably the source repo for npm package `@aftership/emailcat`; this is inferred from repo/package naming plus downstream imports, not verified from `emailcat` source.
  - Internal dependencies, package exports, build pipeline, test commands, release process, and whether the repo is a monorepo are unconfirmed.

## Business Flows
- flow_id: `legacy_easy_email_editor`
  - role: Downstream consumers use `@aftership/emailcat` as the EasyEmail/EmailCat editor engine: provider/editor components render the editor UI while consumer repos supply product context, prebuilt blocks, merge tags, image/font integrations, dynamic input config, and submit handlers.
  - upstream/downstream repos: downstream UI consumers include `sdks.am-static.com_admin-email`, `admin.aftership.com`, and `sdks.am-static.com_admin-flow`; backend/API ownership is not proven inside `emailcat`.
- flow_id: `easy_email_render`
  - role: Downstream consumers use `@aftership/emailcat/lib/core` for legacy/easy email render helpers: `admin-email` re-exports `JsonToMjml as EasyEmailRender`, and `email-renderer` directly imports `getPageIdx` while rendering email content.
  - upstream/downstream repos: `sdks.am-static.com_admin-email` wraps renderer exports; `product.automizelyapi.com_email-renderer` consumes `admin-email` and directly reads `getPageIdx` from emailcat core.
- flow_id: `advanced_email_boundary`
  - role: Boundary evidence only. `emailcat` is the legacy/easy email side; MailCraft is the advanced email side. `admin-email` is the repo that exposes both `EasyEmailRender` and `AdvancedEmailRender`.
  - upstream/downstream repos: `sdk-ts-mailcraft-editor` has no direct `@aftership/emailcat` dependency; `admin-email` bridges both packages; `email-renderer` consumes the bridged renderer package.

## Important Entrypoints
- path: `@aftership/emailcat`
  - why it matters: Main package import used by downstream UI/editor integrations for `EmailCatEditorProvider`, `EmailcatEditor`, hooks, types, block helpers, and provider props.
- path: `@aftership/emailcat/lib/core`
  - why it matters: Core render/helper import used by `admin-email` and `email-renderer`; locally confirmed symbols include `JsonToMjml` and `getPageIdx`.
- path: `@aftership/emailcat/lib/style.css`
  - why it matters: Downstream editor integrations import packaged EmailCat styles directly.
- path: `@aftership/emailcat/packages/easy-email-core/lib`
  - why it matters: `admin-email` imports easy-email core block/types from this package subpath for migration utilities; source layout is not verified from the `emailcat` repo itself.
- path: source paths inside `AfterShip/emailcat`
  - why it matters: not available in this research. Need clone/source access before recording concrete files such as package manifests, MF configs, exports, renderer internals, tests, or release scripts.

## Evidence
- file_or_command: `gh repo view AfterShip/emailcat --json name,nameWithOwner,url,sshUrl,isPrivate,description,defaultBranchRef,primaryLanguage,createdAt,updatedAt,pushedAt,repositoryTopics`
  - finding: GitHub CLI can access `AfterShip/emailcat`; repo is private, primary language TypeScript, default branch `master`, URL `https://github.com/AfterShip/emailcat`, SSH URL `git@github.com:AfterShip/emailcat.git`, created `2021-07-13T07:25:40Z`, updated `2026-04-14T05:55:04Z`, pushed `2026-04-24T15:44:00Z`.
- file_or_command: `git ls-remote --heads https://github.com/AfterShip/emailcat.git master master_v9 feat/flow-v3 feat/flow-v3-polaris-v13 next testing`
  - finding: `master`, `next`, and `testing` exist; `master_v9`, `feat/flow-v3`, and `feat/flow-v3-polaris-v13` were not returned.
- file_or_command: `find /Users/wb.chen/Documents/AfterShip -maxdepth 4 -type d \( -iname 'emailcat' -o -iname '*emailcat*' \)`
  - finding: no source checkout found; matches were installed packages under `product.automizelyapi.com_oc-migration/node_modules/@aftership/emailcat`, `admin.aftership.com/node_modules/@aftership/emailcat`, and `product.automizelyapi.com_email-renderer/node_modules/@aftership/emailcat`.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/package.json:66-72`
  - finding: `admin-email` directly depends on `@aftership/emailcat@3.7.35`, `@aftership/mailcraft`, `@aftership/reviews-email`, and related UI/runtime packages.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/index.ts:5-11` and `src/server.ts:1-7`
  - finding: `admin-email` exports DND/HTML/Easy/Advanced render helpers; EasyEmail render is `JsonToMjml` from `@aftership/emailcat/lib/core`, while Advanced render is from the local AdvancedEmail/MailCraft path.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/features/EasyEmailEditor/Provider.tsx:1-12,423-452`
  - finding: `admin-email` imports `EmailCatEditorProvider`, props/types, `PRODUCT`, and styles from `@aftership/emailcat`, then passes product, data, dynamic input, upload/image library, merge tags, font list, prebuilt render, business panel, preview hooks, and submit handler into the provider.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/features/EasyEmailEditor/Editor.tsx:1-4`
  - finding: `admin-email` imports `EmailcatEditor` and `useEditorContext` from `@aftership/emailcat`.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/package.json:38-40`
  - finding: `email-renderer` directly depends on `@aftership/admin-email@^1.11.49`.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/yarn.lock:5-18,95-100`
  - finding: `@aftership/admin-email@1.11.49` pulls `@aftership/emailcat@3.7.35`, `@aftership/mailcraft`, and `@aftership/reviews-email`; lockfile records the `@aftership/emailcat@3.7.35` tarball.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/src/worker/jobs/emailRender.worker.js:30-68`
  - finding: render worker directly requires `getPageIdx` from `@aftership/emailcat/lib/core` and imports multiple render/data-source helpers from `@aftership/admin-email`.
- file_or_command: `/Users/wb.chen/Documents/Project/skills/repo-research/sdk-ts-mailcraft-editor.md:18-22,57-64,173-183`
  - finding: existing MailCraft report states MailCraft does not directly depend on or maintain `@aftership/emailcat`; `admin-email` wraps `@aftership/mailcraft/server` as `AdvancedEmailRender` and separately exports `EasyEmailRender` from `@aftership/emailcat/lib/core`.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-flow/package.json:94-102` and `mf.config.js:12-26,120-123`
  - finding: `admin-flow` has `@aftership/emailcat` as a dependency/dev dependency and shares it as a Module Federation singleton.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/admin.aftership.com/package.json:68-76` and `src/email_editor/main/components/Emailcat/Emailcat.tsx:1-10,96-120`
  - finding: `admin.aftership.com` directly depends on `@aftership/emailcat`, imports its provider/types/styles, and uses `EmailCatEditorProvider` with business-specific dynamic inputs, merge tags, upload callback, prebuilt blocks, and submit handler.

## Open Questions
- question: Can `AfterShip/emailcat` be cloned or otherwise provided as a local checkout?
  - why it matters: source access is required to verify actual ownership, package manifests, exports, build/test/release commands, internal dependencies, Module Federation status, and important source entrypoints.
- question: Is `AfterShip/emailcat` definitively the source repository for npm package `@aftership/emailcat`, and what is the current release/tag mapping for versions `3.7.12`, `3.7.18`, `3.7.33`, and `3.7.35`?
  - why it matters: downstream reports prove package consumption, but repo-to-package provenance and version alignment need source/package metadata.
- question: Does `emailcat` have a maintained branch model beyond `master`, `next`, and `testing`?
  - why it matters: protocol active-major branches do not exist here; future fixes need a repo-specific base-branch rule.
- question: What are `emailcat`'s direct dependencies and compatibility constraints with React, Formik/final-form, MJML, easy-email packages, and Module Federation consumers?
  - why it matters: local consumers share or bundle the package differently; compatibility changes could affect `admin-email`, `admin-flow`, `admin.aftership.com`, and `email-renderer`.
- question: Which downstream repos should be treated as canonical consumers for regression verification?
  - why it matters: confirmed local consumers include `admin-email`, `email-renderer`, `admin-flow`, and `admin.aftership.com`; MailCraft is a boundary peer through `admin-email`, not a direct consumer.
