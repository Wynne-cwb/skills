# product.automizelyapi.com_email-renderer

## Summary
- project_id: `product.automizelyapi.com_email-renderer`
- repo_name: `product.automizelyapi.com_email-renderer`
- upstream_url: `https://github.com/AfterShip/product.automizelyapi.com_email-renderer`
- local_path: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer`
- repo_type: NestJS Node HTTP API service for email rendering, email block feature inspection, and tracking email template migration.
- confidence: high for repo identity, branch tracks, render/migration entrypoints, dependencies, and runtime service calls; medium for upstream callers because this checkout exposes HTTP endpoints but does not contain caller repos.

## Responsibility
- Owns:
  - Server-side email HTML rendering API. `src/modules/render/render.controller.ts:14-25` maps both `/v1/email-render` and `/v1/platform-email-render` to `RenderService.emailRender`, and `src/modules/render/render.service.ts:135-175` posts render jobs to worker threads.
  - Editor-format render support for `dnd_email`, `safe_html_email`, `html_email`, `easy_email`, and `advanced_email`. `src/worker/jobs/emailRender.worker.js:91-321` switches by `input.email_template.editor_key`, calls `@aftership/admin-email` renderers/MJML, and returns `data.html`.
  - Email text extraction and block/feature inspection APIs. `src/modules/render/render.controller.ts:28-50` exposes `/v1/email-text-content`, `/v1/email-features-control`, and `/v1/email-blocks`; `src/modules/render/render.service.ts:178-233` extracts text from HTML and `src/modules/render/render.service.ts:302-388` collects DND/Easy Email blocks.
  - Tracking email migration from legacy/code/design/easy_template inputs into current editor body templates. `src/modules/migration/migration.controller.ts:14-59` exposes migration endpoints, and `src/modules/migration/migration.service.ts:865-925` builds migrated editor payloads.
  - Optional creation of a custom email template asset from a tracking template. `src/modules/migration/migration.service.ts:928-993` migrates one template, renders preview HTML, calls email screenshot, then creates a templating asset.
- Does not own:
  - Email sending/delivery. No send/SMTP/ESP dispatch API is exposed; the render worker returns HTML only (`src/worker/jobs/emailRender.worker.js:319-321`).
  - Template authoring UI or Module Federation frontend surfaces. The repo has NestJS scripts/dependencies (`package.json:8-23`, `package.json:38-67`) and no webpack/rspack/vite/federation config files were found by `find . -maxdepth 2 -type f \( -name '*webpack*' -o -name '*rspack*' -o -name '*vite*' -o -name '*federation*' -o -name 'module-federation*' \) -print`.
  - Source ownership of `@aftership/admin-email`, `@aftership/emailcat`, Mailcraft, recommender, connector, templating, screenshot, translator, risk, marketing conversions, or OC Extensions services; this repo consumes them by package or HTTP datasource.
- Common change areas:
  - Render entrypoints and worker orchestration: `src/modules/render/render.controller.ts`, `src/modules/render/render.service.ts`, `src/worker/index.ts`, `src/worker/jobs/emailRender.worker.js`.
  - Email block feature gates: `src/modules/render/render.service.ts`, `src/modules/render/render.type.ts`, `src/utils/easyEmailUtils/featuresControl.ts`.
  - Tracking template migration: `src/modules/migration/*`, `src/utils/migration/*`.
  - Internal service configuration and datasource endpoints: `config/*.ts`, `src/datasources/**/*`.
  - Renderer package version bumps: `package.json:38-67`, especially `@aftership/admin-email`.

## Branch Tracks
- production: `master` exists locally and as `origin/master` and `upstream/master`. Evidence: `git branch --all --list '*master*' '*master_v9*' '*feat/flow-v3*' '*feat/flow-v3-polaris-v13*'` returned `master`, `remotes/origin/master`, and `remotes/upstream/master`; `git for-each-ref --format='%(refname:short)' refs/remotes/upstream | rg '^(upstream/(master|master_v9|feat/flow-v3|feat/flow-v3-polaris-v13))$'` returned `upstream/master`.
- legacy_v9: not found. Evidence: the same branch checks returned no `master_v9`.
- active_major: `feat/flow-v3` exists locally and as `origin/feat/flow-v3` and `upstream/feat/flow-v3`; `feat/flow-v3-polaris-v13` was not found. Evidence: `git branch --all --list ...` returned `feat/flow-v3`, `remotes/origin/feat/flow-v3`, and `remotes/upstream/feat/flow-v3`; `git for-each-ref --format='%(refname:short)' refs/remotes/upstream | rg '^(upstream/(master|master_v9|feat/flow-v3|feat/flow-v3-polaris-v13))$'` returned only `upstream/master` and `upstream/feat/flow-v3` among the protocol candidates.
- repo_specific_notes:
  - Additional local/remote branches include `testing`, `staging`, `feat/mailcraft`, `feat/rc`, and render-related feature/hotfix branches such as `hotfix/render-oom`. Evidence: `git branch --all --list`.
  - PR title check runs for `feat/*`, `hotfix/*`, `release/*`, `testing`, `staging`, and `master` (`.github/workflows/pr-check.yaml:3-20`).
  - SonarQube PR checks run for `staging`, `master`, and `feat/*` (`.github/workflows/sonarqube.yaml:3-37`).

## Module Federation
- enabled: false.
- exposes: none found.
- remotes: none found.
- shared_packages: none configured by this repo. `yarn.lock` contains `@module-federation/enhanced` only as a transitive dependency of `@aftership/admin-email` (`yarn.lock:5-18`), not as a repo-level MF config.
- branch_alignment: not applicable; this is a Node HTTP service, not an MF frontend. Evidence: NestJS app bootstrap in `src/main.ts:12-32`, `nodejs-http` deployment in `Jenkinsfile:7-18`, and no federation config files from the local file search.

## Team Repo Dependencies
- Direct dependencies:
  - `@aftership/admin-email` is the central renderer/block utility package (`package.json:38-40`); the worker imports DND/HTML/Easy/Advanced renderers and many data-source helpers from it (`src/worker/jobs/emailRender.worker.js:31-68`), while feature inspection imports `dndEmailBlocksCollector` and `easyEmailBlocksCollector` (`src/modules/render/render.service.ts:302-358`).
  - `mjml`, `jsdom`, `he`, `axios`, NestJS packages, cache/logging packages are direct runtime dependencies (`package.json:38-67`).
- Runtime calls:
  - Shared HTTP datasource injects base URL from `config.api.*` and sends `Am-Api-Key` plus `User-Agent: product.automizelyapi.com_email-renderer` (`src/datasources/httpDataSource/httpDataSource.module.ts:20-45`, `src/datasources/httpDataSource/rest.datasource.ts:23-29`).
  - Production service hosts include risk management, marketing conversions, connectors, recommender, templating, translator, email screenshot, OC Extensions, and data recommendation (`config/production.ts:3-31`).
  - Connector service: `/connections/:id`, `/collections/:id`, `/products` for connection, collection, and product details (`src/datasources/connector/connector.api.service.ts:15-79`).
  - Templating service: `/templating/internal/assets` for custom fonts and custom email templates (`src/datasources/templating/templating.api.service.ts:15-73`).
  - Risk/system dynamic config: `/riskmgmt/internal/dynamic-configs/get-json.action` for system template category config (`src/datasources/riskManager/systemDynamicConfig/systemDynamicConfig.api.service.ts:5-21`).
  - Marketing conversions: `/internal/system-asset-templates/:id` for system asset templates (`src/datasources/marketingConversions/systemAssetTemplates/systemAssetTemplate.api.service.ts:4-13`).
  - Recommender service: `/recommendations/:id` for legacy recommendation details during migration (`src/datasources/recommender/recommendation.api.service.ts:8-30`).
  - Data recommendation service: `/merchandising-rules`, `/merchandising-rules/precreate-default-rules`, `/merchandising-rules/notification-migrate` (`src/datasources/recommendation/recommendation.api.service.ts:6-60`).
  - Translator service: `/translate` used for fulfillment-notification block text migration (`src/datasources/translator/translator.api.service.ts:6-23`, `src/modules/migration/migration.service.ts:586-587`).
  - Email screenshot service: `/email-screenshot` to produce a URL before templating asset creation (`src/datasources/emailScreenshot/emailScreenshot.api.service.ts:6-21`, `src/modules/migration/migration.service.ts:978-986`).
  - OC Extensions service: `/extensions/internal/versions/released` and `/extensions/internal/versions/{working|released}/content-sections` for advanced email prebuilt sections (`src/datasources/ocExtensions/ocExtensions.api.service.ts:21-43`, `src/modules/render/render.service.ts:86-132`).
- Build-time dependencies:
  - Nest build/start/test scripts (`package.json:8-23`).
  - Jenkins shared pipeline with `flow = "nodejs"`, `chartName = "nodejs-http"`, `domainType = "automizelyapi.com"`, and `unitTest = "yarn test"` (`Jenkinsfile:1-27`).
  - GitHub Actions run PR title check and TypeScript/SonarQube checks (`.github/workflows/pr-check.yaml:1-20`, `.github/workflows/sonarqube.yaml:1-40`).
- Shared packages:
  - `@aftership/admin-email` direct; `@aftership/emailcat`, `@aftership/mailcraft`, `@aftership/reviews-email`, and other AfterShip UI/render packages appear as transitive dependencies of `@aftership/admin-email` (`yarn.lock:5-18`).
  - Worker directly requires `@aftership/emailcat/lib/core` for `getPageIdx` (`src/worker/jobs/emailRender.worker.js:30`).
- Inferred but unconfirmed:
  - Candidate source repos for `@aftership/admin-email`, `@aftership/emailcat`, and `@aftership/mailcraft` likely correspond to nearby notification/email SDK repos, but this checkout only proves npm package consumption, not source repo mapping.
  - Upstream HTTP callers are not identified in this repo; likely BFF/admin/notification services call the HTTP endpoints, but no caller evidence exists inside this checkout.

## Business Flows
- flow_id: `email_render`
  - role: API accepts an `EmailContentVariantSettings` payload and returns rendered HTML. `/v1/email-render` and `/v1/platform-email-render` call `RenderService.emailRender` (`src/modules/render/render.controller.ts:14-25`); the service posts a worker job with `work_id` and optional `advanced_email` prebuilt sections (`src/modules/render/render.service.ts:135-175`); the worker renders editor-specific HTML (`src/worker/jobs/emailRender.worker.js:91-321`).
  - upstream/downstream repos: upstream caller repo not confirmed in this checkout; downstream package dependency is `@aftership/admin-email` plus transitive `@aftership/emailcat`. For `advanced_email`, downstream runtime service is OC Extensions for prebuilt content sections.
- flow_id: `email_text_content`
  - role: Extracts subject/header/body/footer text from submitted HTML for downstream indexing/preview/analysis use. Evidence: `/v1/email-text-content` in `src/modules/render/render.controller.ts:28-32` and parsing logic in `src/modules/render/render.service.ts:178-233`.
  - upstream/downstream repos: upstream caller not confirmed; no outbound service call.
- flow_id: `email_feature_control`
  - role: Parses DND/Easy email blocks and maps them to feature slugs for recommendation basic/AI, shipment review, pickup order, and shipping custom status controls. Evidence: controller in `src/modules/render/render.controller.ts:35-50`, DND/Easy block collectors in `src/modules/render/render.service.ts:302-358`, and feature slug constants in `src/modules/render/render.type.ts:81-85`.
  - upstream/downstream repos: downstream data recommendation service can be called to decide whether a custom strategy contains AI (`src/modules/render/render.service.ts:247-267`, `src/datasources/recommendation/recommendation.api.service.ts:10-24`).
- flow_id: `tracking_email_template_migration`
  - role: Migrates tracking email templates by template type: `design` -> DND email, `easy_template` -> Easy Email, `legacy` -> HTML email, `code` -> safe HTML; defaults come from system templates. Evidence: endpoint in `src/modules/migration/migration.controller.ts:18-58`, system template cache in `src/modules/migration/migration.service.ts:64-128`, and migration assembly in `src/modules/migration/migration.service.ts:865-925`.
  - upstream/downstream repos: upstream tracking template owner/caller not confirmed; downstream services include risk dynamic config, marketing conversions system asset templates, connectors, recommender, translator, templating for fonts, and shared migration utilities.
- flow_id: `creating_email_template_by_tracking`
  - role: Converts one tracking template into a templating custom asset. If `is_create` is true, it renders preview HTML, calls email screenshot to get a URL, then creates the asset via templating. Evidence: `src/modules/migration/migration.controller.ts:54-58`, `src/modules/migration/migration.service.ts:928-993`.
  - upstream/downstream repos: downstream email screenshot service and templating service; no email sending.
- flow_id: `advanced_email_prebuilt_sections`
  - role: For `advanced_email`, fetches OC Extensions content sections, formats `advanced_email` prebuilt blocks, and caches by released version outside dev/staging. Evidence: `src/modules/render/render.service.ts:86-132` and `src/datasources/ocExtensions/ocExtensions.api.service.ts:21-43`.
  - upstream/downstream repos: downstream OC Extensions service.

## Important Entrypoints
- path: `src/main.ts`
  - why it matters: service bootstrap starts worker threads before creating the Nest app, installs global filters/interceptors/trace middleware, raises JSON/body limits to 50 MB, listens on `PORT` or `9003`, and sets keepalive timeout (`src/main.ts:12-32`).
- path: `src/app.module.ts`
  - why it matters: imports `RenderModule`, `MigrationModule`, global cache/config/schedule/logger/context modules (`src/app.module.ts:24-51`).
- path: `src/modules/render/render.controller.ts`
  - why it matters: public render/text/features/blocks HTTP API surface (`src/modules/render/render.controller.ts:14-50`).
- path: `src/modules/render/render.service.ts`
  - why it matters: worker dispatch, advanced email prebuilt cache, text extraction, block feature mapping, and data recommendation call bridge (`src/modules/render/render.service.ts:86-175`, `src/modules/render/render.service.ts:236-388`).
- path: `src/worker/index.ts`
  - why it matters: creates 2 workers in staging/production and 1 worker elsewhere; worker file is `jobs/emailRender.worker.js` (`src/worker/index.ts:4-21`).
- path: `src/worker/jobs/emailRender.worker.js`
  - why it matters: core rendering implementation for DND/HTML/Easy/Advanced/Safe HTML; uses `@aftership/admin-email`, `@aftership/emailcat`, `mjml`, `jsdom`, and `he` (`src/worker/jobs/emailRender.worker.js:1-68`, `src/worker/jobs/emailRender.worker.js:91-321`).
- path: `src/modules/migration/migration.controller.ts`
  - why it matters: exposes tracking email migration and creating-template-by-tracking endpoints (`src/modules/migration/migration.controller.ts:14-59`).
- path: `src/modules/migration/migration.service.ts`
  - why it matters: orchestrates system template lookup, per-template migration, recommendation/connector enrichment, preview rendering, screenshot, and templating asset creation (`src/modules/migration/migration.service.ts:50-128`, `src/modules/migration/migration.service.ts:865-993`).
- path: `src/datasources/**/*`
  - why it matters: all internal service calls flow through `RestDataSource` and config-backed datasource modules (`src/datasources/httpDataSource/httpDataSource.module.ts:20-45`, `src/datasources/httpDataSource/rest.datasource.ts:23-29`).
- path: `config/*.ts`
  - why it matters: environment-specific internal service host mapping; `release-*` envs load testing config (`config/index.ts:11-14`) and production hosts are enumerated in `config/production.ts:3-31`.
- path: `Jenkinsfile`
  - why it matters: deployment metadata identifies this as `nodejs-http` service under `automizelyapi.com` with staging and production environments (`Jenkinsfile:7-23`).

## Evidence
- file_or_command: `package.json:2-23`, `package.json:38-67`
  - finding: package name matches repo; scripts are Nest build/start/test; direct runtime deps include `@aftership/admin-email`, NestJS, `axios`, `jsdom`, `mjml`, `he`, New Relic, cache/logging.
- file_or_command: `git remote -v`
  - finding: `origin` points to `git@github.com:Wynne-cwb/product.automizelyapi.com_email-renderer.git`; `upstream` points to `git@github.com:AfterShip/product.automizelyapi.com_email-renderer.git`; remotes are fork-first for future edits.
- file_or_command: `git branch --all --list '*master*' '*master_v9*' '*feat/flow-v3*' '*feat/flow-v3-polaris-v13*'`
  - finding: found `master`, `origin/master`, `upstream/master`, `feat/flow-v3`, `origin/feat/flow-v3`, `upstream/feat/flow-v3`; did not find `master_v9` or `feat/flow-v3-polaris-v13`.
- file_or_command: `git log -1 --oneline --decorate`
  - finding: current checkout was on `master` at `97d620a (HEAD -> master, origin/master, origin/HEAD) :arrow_up: (ABU-38960) Upgrade @aftership/admin-email to 1.11.49`.
- file_or_command: `src/modules/render/render.controller.ts:14-50`
  - finding: render/text/features/block HTTP API endpoints.
- file_or_command: `src/modules/render/render.service.ts:135-175`
  - finding: render requests are dispatched to worker threads using generated `work_id`; slow render warning logs include request body and step cost.
- file_or_command: `src/worker/jobs/emailRender.worker.js:91-321`
  - finding: core renderer switches on editor key, supports DND/Safe HTML/HTML/Easy/Advanced render paths, converts MJML where needed, wraps non-preview output with Django template context, decodes Django template tags, and returns HTML.
- file_or_command: `src/modules/render/render.service.ts:302-388`
  - finding: feature-control and email-block APIs parse DND/Easy blocks using `@aftership/admin-email` collectors and map blocks to feature slugs.
- file_or_command: `src/modules/migration/migration.service.ts:865-993`
  - finding: tracking migration returns editor payloads; creating-template flow calls render, screenshot, and templating asset creation.
- file_or_command: `config/production.ts:3-31`
  - finding: production runtime service URLs include risk, marketing conversions, connector, recommender, templating, translator, email screenshot, OC Extensions, and data recommendation.
- file_or_command: `Jenkinsfile:7-23`
  - finding: deployed as `nodejs-http`, app name and repo name match, domain type is `automizelyapi.com`, staging and production enabled.
- file_or_command: `find . -maxdepth 2 -type f \( -name '*webpack*' -o -name '*rspack*' -o -name '*vite*' -o -name '*federation*' -o -name 'module-federation*' \) -print`
  - finding: no Module Federation build/config files found.
- file_or_command: `yarn.lock:5-18`
  - finding: `@aftership/admin-email@1.11.49` pulls transitive AfterShip renderer/editor packages including `@aftership/emailcat`, `@aftership/mailcraft`, `@aftership/reviews-email`, and `@module-federation/enhanced`.

## Open Questions
- question: Which BFF/admin/notification services call `/v1/email-render`, `/v1/platform-email-render`, migration endpoints, and feature-control endpoints?
  - why it matters: this repo exposes the downstream service API, but caller repos are not referenced in the checkout; repo-map relationships should be confirmed from caller code before being recorded as facts.
- question: What are the exact source repos for `@aftership/admin-email`, `@aftership/emailcat`, and `@aftership/mailcraft` in the current team map?
  - why it matters: package evidence proves dependency, but source-repo ownership and branch alignment need confirmation from package metadata or adjacent repo research.
- question: Is `feat/flow-v3` the correct active branch for notification work in this repo, or only a historical branch?
  - why it matters: branch exists, but no local policy file explains release/current-development semantics beyond the shared research protocol and workflow branch patterns.
- question: Should staging config typo `staing-pltf-translator.as-in.com` be treated as known/intentional?
  - why it matters: `config/staging.ts` contains this host spelling; no validation was performed because this task is read-only.
