# sdks.am-static.com_admin-email

## Summary
- project_id: `sdks.am-static.com_admin-email`
- repo_name: `sdks.am-static.com_admin-email`
- upstream_url: `https://github.com/AfterShip/sdks.am-static.com_admin-email`
- local_path: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email`
- repo_type: React/TypeScript email editor SDK, Module Federation remote, and npm package `@aftership/admin-email`.
- confidence: High for repo responsibility, MF config, branch existence, SDK/package dependencies, and local checkout facts. Medium for cross-repo ownership naming because active branches use `notification*` MF remote names while the local queue still contains `admin-marketing-*` repo names.

## Responsibility
- Owns:
  - Email editor UI/SDK surfaces for templates, Content Groups, variants, previews, send-test modals, custom templates, migration tooling, and prebuilt email blocks.
  - Module Federation remote for email capabilities. Current checkout/legacy v9 exposes `./adminPortal`, `./email`, and `./types`; `origin/feat/flow-v3-polaris-v13` additionally exposes `./platformNotification` and `./notificationConfigStore`.
  - Server-side package exports for email rendering helpers and data-source/block helpers through `@aftership/admin-email` package entrypoints `.` and `./migration`.
  - Public MF email facade exports such as `EmailTemplates`, `SelectEmailTemplateModal`, `EmailContentGroupEditor`, `EmailContentGroupPreviewer`, `useCreateEmailContentGroup`, `useSenderInfo`, `SendTestEmail`, custom template editor, validation helpers, and block manager utilities.
  - Email Content Group save preparation/cleaning rules reused by both editor UI and public hook, including default variant index, checksum/id cleanup, EasyEmail font filtering, hard/soft filter checks, system-template check, and `saveContentGroupWithVariants`.
- Does not own:
  - Backend GraphQL schemas or persistence for templates/content groups/senders/risk review/test-email delivery. Evidence: `codegen.yml` points at `/marketing/admin/graphql` and `/marketing/admin/v2/graphql`; GraphQL documents call backend operations.
  - Sender settings implementation. Evidence: `src/hooks/useSenderInfo.ts` delegates to `useHandleEmailSenderInfoSettings` from `adminMarketingBasic/basicHooks` in the current checkout, and to `notificationBasic/basicHooks` on `origin/feat/flow-v3-polaris-v13`.
  - Billing, coupon, CRM, accounts, and basic/common UI capabilities. Evidence: MF remotes and source imports delegate these to other remotes/packages.
  - Unified `aftershipNotification` facade ownership. Evidence: `docs/affiliate-simple-email-editor.md` imports from `aftershipNotification`, while the repo itself exposes lower-level admin-email MF/package APIs.
- Common change areas:
  - MF exports/config: `mf.config.js`, `config/constants/mf.js`, `config/constants/domain.js`, `src/mfExports/**`.
  - Email Content Group load/save/preview: `src/hooks/useCreateEmailContentGroup.ts`, `src/hooks/contentGroupSave.ts`, `src/features/EmailContentGroupEditor/**`, `src/features/EmailContentGroupPreviewer/**`.
  - Template management/editing: `src/features/EmailTemplates/**`, `src/features/CustomTemplateEditor/**`, `src/components/SelectEmailTemplateModal/**`, `src/components/SaveAsTemplateModal/**`.
  - Renderers and editor engines: `src/server.ts`, `src/features/DndEmailEditor/**`, `src/features/EasyEmailEditor/**`, `src/features/AdvancedEmailEditor/**`, `src/features/HtmlEmailEditor/**`.
  - GraphQL contracts: `src/graphql/v1/**`, `src/graphql/v2/**`, `src/generated/graphql*.ts`, `codegen.yml`.

## Branch Tracks
- production: `origin/master` exists. Latest local ref observed: `88e8efb5` on `2026-06-03`, "Merge pull request #2958 from notverysalty/fix/ASE-3586". On this branch the MF identity is `notification_email` and CDN subdirectory is `notification-email`.
- legacy_v9: `origin/master_v9` exists. Latest local ref observed: `0140ef46` on `2026-05-07`, "Merge pull request #2861 from notverysalty/fix/ASE-3543". This branch uses legacy MF identity `admin_email` and CDN subdirectory `admin-email`.
- active_major: `origin/feat/flow-v3-polaris-v13` exists and should be preferred over `origin/feat/flow-v3` by the protocol. Local refs observed: `origin/feat/flow-v3-polaris-v13` at `da7baf2d` on `2026-06-09`; `origin/feat/flow-v3` at `db26aa03` on `2026-05-15`.
- repo_specific_notes:
  - Local checkout is currently on `feat/affiliate-simple-editor`, tracking `local/feat/affiliate-simple-editor`, with untracked `.codegraph/`, `docs/superpowers/`, and `prds/`.
  - Remotes are not named fork-first per protocol: `origin` points to `git@github.com:AfterShip/sdks.am-static.com_admin-email.git`; `local` points to `git@github.com:Wynne-cwb/sdks.am-static.com_admin-email.git`.
  - MF naming differs by branch family: `master` and active major use `notification_email`/`notification-email`; `master_v9` and the current checkout use `admin_email`/`admin-email`.

## Module Federation
- enabled: Yes. `package.json` scripts `mf`, `build`, and `serve` use `config/webpack/webpack.module.federation.config.js`; that config instantiates `@module-federation/enhanced/webpack` `ModuleFederationPlugin`.
- exposes:
  - Current checkout and `origin/master_v9`: `./adminPortal`, `./email`, `./types`.
  - `origin/master`: `./adminPortal`, `./email`, `./types`.
  - `origin/feat/flow-v3-polaris-v13`: `./adminPortal`, `./platformNotification`, `./email`, `./types`, `./notificationConfigStore`.
- remotes:
  - Current checkout/legacy v9: `adminMarketingBasic`, `adminMarketingBilling`, `adminMarketingCoupon`, `adminCrm`, `aftershipBillingWidgets`.
  - `origin/master`: `notificationBasic`, `notificationBilling`, `notificationCoupon`, `notificationCrm`, `aftershipBillingWidgets`, `aftershipAccountsWidgets`.
  - `origin/feat/flow-v3-polaris-v13`: same active `notification*`/billing/accounts shape, but remote URLs are pinned in `config/constants/mf.js` to `release-incy-sdks.am-static.io` for notification remotes in the sampled ref.
- shared_packages:
  - Current checkout/legacy v9: `react`, `react-dom`, `react-router`, `react-router-dom`, `@shopify/polaris`, `@shopify/polaris-icons`, `@aftership/meerkat-sdk`, `@aftership/sdk-journey-onboarding`, `@aftership/automizely-product-auth`, `@aftership/automizely-frontend-dev-kit`, `formik`, `@aftership/datacat`, `@aftership/growth-components`.
  - Active/master line replaces Polaris shared UI with `@aftership/aha`, `@aftership/aha-icons`, and includes `@shopify/app-bridge-utils`; `package.json` on `origin/feat/flow-v3-polaris-v13` uses React 18.3.1 while the current checkout uses React 17.0.2.
- branch_alignment:
  - For new flow-v3/polaris-v13 work, align to `origin/feat/flow-v3-polaris-v13` and `notification_email` unless task evidence says legacy v9.
  - For old/admin-email branch work, expect `admin_email`, `admin-email`, React 17, Polaris, and `adminMarketing*` remotes.

## Team Repo Dependencies
- Direct dependencies:
  - Current checkout package/peer/externals include `@aftership/admin-marketing-basic`, `@aftership/admin-marketing-billing`, `@aftership/admin-marketing-coupon`, `@aftership/admin-crm`, `@aftership/datacat`, `@aftership/emailcat`, `@aftership/mailcraft`, `@aftership/meerkat-sdk`, `@aftership/reviews-email`, `@aftership/sdk-journey-onboarding`.
  - Active branch package keeps email engine dependencies and moves UI/runtime to React 18, `@aftership/aha`, `@aftership/aha-icons`, `@aftership/automizely-product-auth@^3`, `@aftership/automizely-frontend-dev-kit@^1.6`.
- Runtime calls:
  - GraphQL v1 schema: `http://localhost:9003/marketing/admin/graphql`; documents include email content CRUD, asset templates, sender info, test email, newsletter, risk management, storage status, fonts, and HTML rendering.
  - GraphQL v2 schema: `http://localhost:9006/marketing/admin/v2/graphql`; documents include Content Group, Content Variant, Custom/System Content Template, send test/resend email, sender domain verification policy, render settings, risk review, products, shipments, Apple Wallet, Track with PayPal, personalization, flow list/actions, AI text/translation, and resubscribe email.
  - Sender list/default sender comes from basic/notification basic hooks, not from this repo's own backend client.
- Build-time dependencies:
  - Webpack 5, `@module-federation/enhanced`, `@aftership/module-federation-typescript`, `webpack-dev-server`, `vite`, `vite-plugin-dts`, `graphql-codegen`, `@aftership/deploy-frontend-assets`.
  - `Jenkinsfile` uses `flow = "frontend"`, `appName = "sdks.am-static.com_admin-email"`, Node 16.16.0 essential image, and `prePublishScript = "yarn build:sdk"`.
- Shared packages:
  - Email/rendering engines: `@aftership/emailcat`, `@aftership/mailcraft`, `mjml-browser`, `@aftership/reviews-email`.
  - Platform/UI/analytics: `@aftership/datacat`, `@aftership/meerkat-sdk`, `@aftership/growth-components`, `@aftership/sdk-journey-onboarding`, Polaris or AHA depending on branch.
  - MF peer/shared packages from legacy repos: admin marketing basic/billing/coupon/crm; active branch remotes rename these to notification basic/billing/coupon/crm.
- Inferred but unconfirmed:
  - Active remote names `notificationBasic`, `notificationBilling`, `notificationCoupon`, and `notificationCrm` likely map to notification-era successors of `sdks.am-static.com_admin-marketing-basic`, `sdks.am-static.com_admin-marketing-billing`, `sdks.am-static.com_admin-marketing-coupon`, and `sdks.am-static.com_admin-crm`; this was inferred from MF remote names and local checkout queue, but local repos named `notification-basic` etc. were not present in `/Users/wb.chen/Documents/AfterShip/Notification`.
  - `aftershipAccountsWidgets` maps to an accounts widget repo/package, but this checkout only shows the remote URL path `/accounts/v1/remoteEntry.js`, not a local repo.

## Business Flows
- flow_id: `email-template-management`
  - role: Provides UI and SDK surfaces to list, create, duplicate, rename, delete, select, translate, edit, and preview saved/system email templates.
  - upstream/downstream repos: Downstream GraphQL v2 custom/system template APIs; current branch depends on admin marketing basic/billing/coupon/crm remotes; active branch depends on notification basic/billing/coupon/crm remotes.
- flow_id: `email-content-group-editor`
  - role: Loads system templates, custom templates, or saved Content Groups; edits default/current variants; validates/saves via `saveContentGroupWithVariants`; renders preview; supports send-test and save-as-template.
  - upstream/downstream repos: Downstream marketing admin v2 GraphQL Content Group/Variant APIs, basic/notification-basic filter and sender hooks, billing/coupon/product/CRM remotes for feature gates and selector data.
- flow_id: `notification-platform-email`
  - role: On active major branch, exposes platform notification email surfaces such as flow/admin/resubscribe/custom content-group editors, notification send-test modal, flow step templates modal, notification email templates/editor, config store, and auto-apply section helpers through `./platformNotification` and `./notificationConfigStore`.
  - upstream/downstream repos: Active MF remotes `notificationBasic`, `notificationBilling`, `notificationCoupon`, `notificationCrm`; downstream marketing admin v2 GraphQL operations.
- flow_id: `affiliate-simple-email-editor`
  - role: Current checkout contains tracked docs for an external/Affiliate invite email integration using `aftershipNotification` to load a Content Group, edit subject/preheader/body/sender/reply-to, preview caller-owned draft, and save through SDK boundary.
  - upstream/downstream repos: `aio-notification` is mentioned as the unified `aftershipNotification` facade in the docs/PRD evidence; admin-email owns lower-level MF exports and docs, while aio must re-export for callers. This handoff was not verified in the aio repo during this per-repo read.

## Important Entrypoints
- path: `package.json`
  - why it matters: Defines package identity `@aftership/admin-email`, npm exports `.` and `./migration`, MF/build/sdk scripts, dependencies, peer dependencies, and externals.
- path: `mf.config.js`
  - why it matters: Defines host/remote MF names, filename, exposed modules, remotes, and shared singleton packages.
- path: `config/constants/mf.js`
  - why it matters: Source of MF exposes/remotes and branch-specific remote naming (`adminMarketing*` vs `notification*`).
- path: `config/constants/domain.js`
  - why it matters: Source of MF name, port `8209`, and CDN subdirectory (`admin-email` or `notification-email` depending on branch).
- path: `config/webpack/webpack.module.federation.config.js`
  - why it matters: Production/dev MF build config, output path/publicPath/chunk naming, `ModuleFederationPlugin`, and type generation plugin.
- path: `config/scripts/upload-assets.js`
  - why it matters: Uploads `build` assets to S3 domains/subdirectories and gives `remoteEntry.js` no-cache behavior.
- path: `vite.server.config.ts`
  - why it matters: Builds package entry `src/server.ts` into `lib/server.cjs.js` and `lib/server.esm.js`.
- path: `vite.migration.config.ts`
  - why it matters: Builds migration package entry `src/migration.ts` into `lib/migration.*`.
- path: `src/mfExports/email.ts`
  - why it matters: Main MF email public facade for templates, content group editor/preview, sender hooks, send-test, validation, cache, block manager, and editor components.
- path: `src/mfExports/adminPortal.ts`
  - why it matters: Admin portal email template editor and advanced production migration exports.
- path: `src/mfExports/platformNotification.ts` (`origin/feat/flow-v3-polaris-v13`)
  - why it matters: Active branch platform notification facade for flow/admin/resubscribe/custom email editors, notification send-test, config store, and templates.
- path: `src/server.ts`
  - why it matters: SDK/server package export for renderers (`DndEmailRender`, `HtmlEmailRender`, `EasyEmailRender`, `AdvancedEmailRender`) and prebuilt block data-source helpers.
- path: `src/hooks/useCreateEmailContentGroup.ts`
  - why it matters: Public hook for loading from system/custom/content-group sources, creating/saving Content Groups, hard/soft filter checks, system-template check, and save result codes.
- path: `src/hooks/contentGroupSave.ts`
  - why it matters: Shared implementation for cleaning and preparing Content Group save input; prevents bypassing checksum/id/default-index cleanup.
- path: `src/hooks/useSenderInfo.ts`
  - why it matters: Public sender list hook; delegates sender data to basic/notification-basic remote hooks.
- path: `src/features/EmailContentGroupEditor/index.tsx`
  - why it matters: Full Content Group editor UI and save flow, including settings plugins, sender domain policy, send-test, save-as-template, risk banners, and editor framework wiring.
- path: `src/features/EmailContentGroupPreviewer/index.tsx`
  - why it matters: Preview component that supports direct `contentGroup` preview or locator-based fetching.
- path: `src/features/EmailContentGroupPreviewer/previewContentGroup.ts`
  - why it matters: Shared preview renderer for DND, EasyEmail, HtmlEmail, and SafeHtmlEmail variants.
- path: `src/graphql/v1/**`, `src/graphql/v2/**`, `codegen.yml`
  - why it matters: Backend API contract surface used by the SDK; clarifies this repo is a frontend/MF client over marketing admin GraphQL APIs.
- path: `docs/affiliate-simple-email-editor.md`
  - why it matters: Current checkout integration guide for Affiliate/simple email editor through `aftershipNotification`; tracked in git on current branch.

## Evidence
- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email remote -v`
  - finding: `origin` is `git@github.com:AfterShip/sdks.am-static.com_admin-email.git`; `local` is `git@github.com:Wynne-cwb/sdks.am-static.com_admin-email.git`.
- file_or_command: `git branch -a --no-color`
  - finding: Candidate branches `origin/master`, `origin/master_v9`, `origin/feat/flow-v3`, and `origin/feat/flow-v3-polaris-v13` all exist.
- file_or_command: `git for-each-ref ... refs/remotes/origin/master refs/remotes/origin/master_v9 refs/remotes/origin/feat/flow-v3 refs/remotes/origin/feat/flow-v3-polaris-v13`
  - finding: Local refs show production, legacy_v9, and active_major branch heads with dates; `feat/flow-v3-polaris-v13` is newest among active candidates.
- file_or_command: `git status --short --branch`
  - finding: Current checkout is `feat/affiliate-simple-editor...local/feat/affiliate-simple-editor`; untracked `.codegraph/`, `docs/superpowers/`, and `prds/`.
- file_or_command: `package.json`
  - finding: Package name is `@aftership/admin-email`; exports `.` to `lib/server.*` and `./migration` to `lib/migration.*`; scripts include `mf`, `build`, `build:sdk`, `serve`, `codegen`, `upload-assets`.
- file_or_command: `mf.config.js`
  - finding: Current checkout defines host `admin_marketing_email`, remote name from `MODULE_FEDERATION_NAME`, `remoteEntry.js`, `MF_EXPORTS`, `MF_REMOTES`, and shared singletons.
- file_or_command: `git show origin/feat/flow-v3-polaris-v13:mf.config.js`
  - finding: Active branch host name is `notification_email`; shared packages include React 18-era AHA packages instead of Polaris.
- file_or_command: `config/constants/mf.js`
  - finding: Current checkout exposes `./adminPortal`, `./email`, `./types`; remotes are `adminMarketingBasic`, `adminMarketingBilling`, `adminMarketingCoupon`, `adminCrm`, `aftershipBillingWidgets`.
- file_or_command: `git show origin/feat/flow-v3-polaris-v13:config/constants/mf.js`
  - finding: Active branch exposes `./platformNotification` and `./notificationConfigStore` in addition to `./adminPortal`, `./email`, `./types`; remotes are `notificationBasic`, `notificationBilling`, `notificationCoupon`, `notificationCrm`, billing, accounts.
- file_or_command: `config/constants/domain.js` and `git show origin/feat/flow-v3-polaris-v13:config/constants/domain.js`
  - finding: Current/legacy branch uses `DOMAIN_SUBDIRECTORY = 'admin-email'` and `MODULE_FEDERATION_NAME = 'admin_email'`; active branch uses `notification-email` and `notification_email`.
- file_or_command: `config/webpack/webpack.module.federation.config.js`
  - finding: Uses `@module-federation/enhanced/webpack` `ModuleFederationPlugin`, publicPath from domain/subdirectory helpers, output to `build`, and `ASModuleFederationTypeScriptRemotePlugin`.
- file_or_command: `src/mfExports/email.ts`
  - finding: Exports template UI, Content Group hooks/types/previewer/editor, send-test, sender info, DND/EasyEmail helpers, validation, and resubscribe/custom template features.
- file_or_command: `git show origin/feat/flow-v3-polaris-v13:src/mfExports/platformNotification.ts`
  - finding: Active branch platform facade exports member/sender/subject settings, email previewers, notification send-test modal, config store, auto-apply section, platform Content Group editors, flow templates modal, notification templates/editor, and email sender field hook.
- file_or_command: `src/server.ts`
  - finding: Package/server export provides renderers and prebuilt data-source helpers for product recommendation, personalization, fulfillment, shipment items, pickup/shipping/order digest, Apple Wallet, Track with PayPal, shipment review, shipment progress bar, and block collectors.
- file_or_command: `src/hooks/useCreateEmailContentGroup.ts`
  - finding: Hook loads system template, custom template, or content group; creates/saves Content Groups; performs hard/soft filter checks through basic hooks; saves through `useSaveContentGroupWithVariantsMutation`.
- file_or_command: `src/hooks/contentGroupSave.ts`
  - finding: Shared save helpers clean EasyEmail fonts, remove runtime fields/checksum, set default variant index, reset ids in create mode, and build filter/system-template inputs.
- file_or_command: `src/features/EmailContentGroupPreviewer/previewContentGroup.ts`
  - finding: Direct preview rendering selects default variant, supports DND/EasyEmail/HtmlEmail/SafeHtmlEmail, and renders MJML/HTML with `mjml-browser`.
- file_or_command: `src/hooks/useSenderInfo.ts` and `git show origin/feat/flow-v3-polaris-v13:src/hooks/useSenderInfo.ts`
  - finding: Current checkout imports `useHandleEmailSenderInfoSettings` from `adminMarketingBasic/basicHooks`; active branch imports the same hook from `notificationBasic/basicHooks`.
- file_or_command: `codegen.yml` and `.graphqlrc.js`
  - finding: GraphQL v1 schema is `http://localhost:9003/marketing/admin/graphql`; v2 schema is `http://localhost:9006/marketing/admin/v2/graphql`.
- file_or_command: `find src/graphql -type f | xargs rg -n '^(query|mutation) '`
  - finding: Operations cover email content, templates, Content Group/Variant, custom/system templates, send test/resend email, sender domain verification policy, render settings, risk review, products, shipments, personalization, flow list/actions, AI text, and resubscribe email.
- file_or_command: `Jenkinsfile`
  - finding: Jenkins app is `sdks.am-static.com_admin-email`, frontend flow, Node 16.16.0 essential image, and `prePublishScript = "yarn build:sdk"`.
- file_or_command: `config/scripts/upload-assets.js`
  - finding: Static assets upload to environment-specific `sdks.am-static.*` buckets under `DOMAIN_SUBDIRECTORY`; `remoteEntry.js` is configured with cache age `0`.
- file_or_command: `docs/affiliate-simple-email-editor.md`
  - finding: Documents `aftershipNotification` imports for `EmailContentGroupPreviewer`, `useCreateEmailContentGroup`, `useSenderInfo`, Content Group load/edit/preview/save paths, and Affiliate v1 DND block contract.

## Open Questions
- question: Are `notificationBasic`, `notificationBilling`, `notificationCoupon`, and `notificationCrm` separate repos, renamed outputs of the admin-marketing repos, or branch-specific MF aliases only?
  - why it matters: Active branch dependency mapping should point agents to the correct local checkout/repo before making cross-repo changes.
- question: Should current feature work continue on `feat/affiliate-simple-editor`/legacy `admin_email`, or be rebased/ported to `feat/flow-v3-polaris-v13`/`notification_email`?
  - why it matters: MF name, shared UI stack, React major, exposed modules, and remote dependencies differ materially by branch track.
- question: Has `aio-notification` actually re-exported the Affiliate/simple editor APIs from `admin-email` as `aftershipNotification`?
  - why it matters: The docs require aio unified facade availability, but this per-repo read did not verify the downstream aio checkout.
- question: Are tracked `docs/affiliate-simple-email-editor.md` and `docs/affiliate-simple-email-editor.example.tsx` intended to be stable SDK docs or temporary feature-branch integration docs?
  - why it matters: Repo map should distinguish long-lived public API documentation from branch-local implementation support.
