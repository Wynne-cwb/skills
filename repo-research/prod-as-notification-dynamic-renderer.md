# prod-as-notification-dynamic-renderer

## Summary
- project_id: `prod-as-notification-dynamic-renderer`
- repo_name: `prod-as-notification-dynamic-renderer`
- upstream_url: `https://github.com/AfterShip/prod-as-notification-dynamic-renderer`
- local_path: `/Users/wb.chen/Documents/AfterShip/prod-as-notification-dynamic-renderer`
- repo_type: NestJS Node HTTP service for email/notification dynamic image rendering, mainly shipment progress bar PNG generation, plus a PayPal app-link redirect helper.
- confidence: high for local responsibility, entrypoints, runtime HTTP calls, and Module Federation absence; medium for branch-track completeness because local checkout has only `origin` pointing to a fork and no configured `upstream` remote.

## Responsibility
- Owns:
  - `/shipment-progress-bar` image endpoint. It accepts base64 encoded `presentation_settings`, optional backend `t` tracking snapshot token, and returns `image/png` with cache behavior depending on preview mode.
  - Shipment progress bar PNG rendering with `worker_threads`, `canvas`, bundled fonts, tracking status progress mapping, date/status localization, EDD block, divider, and progress bar drawing.
  - Runtime snapshot lookup from tracking notification service before rendering non-preview images.
  - `/v1/cached-transactions` helper endpoint that calls PayPal integration cached-transactions API and redirects to `paypal_app_link`.
  - Minimal `/whoami` version endpoint.
- Does not own:
  - Full notification message delivery, SMTP/ESP send, flow execution, or template persistence.
  - Full email HTML rendering. That role is owned by `product.automizelyapi.com_email-renderer`, which exposes `/v1/email-render` and `/v1/platform-email-render` and consumes `@aftership/admin-email`.
  - Email editor/template UI. `sdks.am-static.com_admin-email` and `mailcraft` generate shipment progress bar image URLs and template helpers that eventually call this service.
  - Module Federation surfaces. No MF config, remotes, or exposes were found in this repo.
- Common change areas:
  - Shipment progress bar API contract and validation: `src/modules/shipmentProgressBar/*`, `src/utils/shipmentProgressBar.ts`.
  - Canvas rendering and i18n/status mappings: `src/worker/*`, `src/constants/shipmentProgressBar.js`, `src/assets/fonts/*`.
  - Downstream service URLs/API keys: `config/*.ts`, `src/datasources/*`.
  - Deployment/runtime image build: `Dockerfile`, `nest-cli.json`, deployment helm values for `product.automizelyapi.com-dynamic-renderer`.

## Branch Tracks
- production: `master`. Local fork `origin/master` exists at `092cdba`; upstream GitHub `HEAD`/`master` resolves to `d6c2db5` by `git ls-remote --symref https://github.com/AfterShip/prod-as-notification-dynamic-renderer.git HEAD`.
- legacy_v9: not found. `git ls-remote --heads https://github.com/AfterShip/prod-as-notification-dynamic-renderer.git master_v9` returned no ref.
- active_major: protocol candidates not found. `feat/flow-v3-polaris-v13` and `feat/flow-v3` returned no upstream refs. Local checkout has `feat/mailcraft` at `d75b2f8`, tracking fork branch `origin/feat/mailcraft`, but upstream `feat/mailcraft` did not exist in `ls-remote`.
- repo_specific_notes:
  - Remote anomaly: local `origin` is `git@github.com:Wynne-cwb/prod-as-notification-dynamic-renderer.git`; no `upstream` remote is configured. Do not treat the current branch as company base without adding/verifying upstream in a future write task.
  - Local fork is behind/different from upstream: fork `origin/master` is `092cdba` while upstream `master` is `d6c2db5`.
  - GitHub Actions mention `testing`, `staging`, `feat/*`, `hotfix/*`, and `release/*` as CI/PR target patterns, but local refs only include `master` and `feat/mailcraft`.
  - Upstream tags found through `ls-remote --tags` include `v1.0.0` through `v1.0.8`; local tag list was empty.

## Module Federation
- enabled: false.
- exposes: none found.
- remotes: none found.
- shared_packages: none for MF. `package.json` has no `@module-federation/*` or AfterShip frontend packages.
- branch_alignment: not applicable. This is a Node HTTP service, not a frontend MF remote.

## Team Repo Dependencies
- Direct dependencies:
  - No direct team npm packages in this repo's `package.json`; dependencies are NestJS, axios, canvas, dayjs, express, winston, etc.
  - Docker build uses AfterShip CI artifact base image `asia-east1-docker.pkg.dev/aftership-admin/ci-artifacts/nodejs-onbuild:nodejs-18.18.2`.
- Runtime calls:
  - `notification_api`: `prod-as-tracking-notification` hosts `/v1/render/shipment-snapshot`; this service calls `/render/shipment-snapshot` with `tracking_snapshot` and `display_real_time` before non-preview PNG rendering.
  - `integration_paypal_api`: `prod-as-integration` hosts `/paypal/v1/cached-transactions`; this service calls `/cached-transactions` then redirects to the first `paypal_app_link`.
  - `businesses_api`: `pltf-businesses` datasource exists for `/internal/memberships`, but no current AppModule/module import or caller was found.
  - Public consumers call this service through image domains such as `https://dy-image.as-list.com`, `https://staging-dy-image.as-list.com`, and `https://dy-image.as-list.io`.
- Build-time dependencies:
  - GitHub Actions use Node 18, Yarn, NPM token, Jest, PR title check, and SonarQube project key `prod-as-notification-dynamic-renderer`.
  - `nest-cli.json` copies worker JS, canvas JS, shipment progress bar constants, and font assets into `dist/src`.
  - Local deployment helm values deploy the image under service/release name `product.automizelyapi.com-dynamic-renderer`; production values in the local checkout point to image repo `us-docker.pkg.dev/aftership-admin/services/prod-as-notification-dynamic-renderer` tag `v1.0.1`.
- Shared packages:
  - No shared AfterShip package is consumed directly here.
  - Relationship is inverse: `sdks.am-static.com_admin-email` defines `getShipmentProgressBarImageDomain()` and data-source/template helpers that generate this service's `/shipment-progress-bar` URLs; `product.automizelyapi.com_email-renderer` consumes `@aftership/admin-email` and therefore can emit HTML containing shipment progress bar template/image calls.
- Inferred but unconfirmed:
  - `generate_shipment_progress_bar(...)` appears in admin-email generated Django templates, but its implementation was not found in local checkouts. It likely appends/resolves the backend `t` tracking snapshot token expected by this controller, but that remains unconfirmed.
  - The exact owning repo for `prod-as-tracking-notification` was not verified in this report.

## Business Flows
- flow_id: `shipment_progress_bar_dynamic_image`
  - role: Receives dynamic image URL requests from email preview/rendered templates, optionally fetches real-time tracking snapshot, and returns a PNG progress bar.
  - upstream/downstream repos: Upstream URL builders include `sdks.am-static.com_admin-email` and `mailcraft`; email HTML rendering path passes through `product.automizelyapi.com_email-renderer` via `@aftership/admin-email`; downstream runtime call is `prod-as-tracking-notification` `/render/shipment-snapshot`.
- flow_id: `notification_email_template_dynamic_asset`
  - role: Provides the actual image backend for email templates containing `*||SHIPMENT_PROGRESS_BAR_IMAGE_URL||*` or Django `generate_shipment_progress_bar(...)` helpers. It is not the message/template authoring store; it renders one dynamic asset after a template has produced an image URL.
  - upstream/downstream repos: `sdks.am-static.com_admin-email` defines the block merge tag and `generate_shipment_progress_bar` template call; `product.automizelyapi.com_email-renderer` imports `getShipmentProgressBarDataSource()` from `@aftership/admin-email` when rendering Easy Email.
- flow_id: `track_with_paypal_redirect`
  - role: Accepts query parameters for PayPal cached transactions, calls integration service, and issues an HTTP redirect to the returned PayPal app link.
  - upstream/downstream repos: downstream runtime call is `prod-as-integration` PayPal API. No caller repo was confirmed from local source search.
- flow_id: `service_health_identity`
  - role: `/whoami` returns hardcoded service version `0.0.1`.
  - upstream/downstream repos: operational/health consumers unconfirmed.

## Important Entrypoints
- path: `src/main.ts`
  - why it matters: starts the worker before Nest app bootstrap, installs global HTTP exception filter, and listens on `PORT` or `9003`.
- path: `src/app.module.ts`
  - why it matters: wires global config/logger and imports only `ShipmentProgressBarModule` and `IntegrationPaypalModule`.
- path: `src/modules/shipmentProgressBar/shipmentProgressBar.controller.ts`
  - why it matters: public `/shipment-progress-bar` PNG endpoint; parses `presentation_settings`, reads query `t`, returns fallback image on invalid input/errors, and controls cache headers.
- path: `src/modules/shipmentProgressBar/shipmentProgressBar.service.ts`
  - why it matters: orchestrates preview-vs-live snapshot lookup, fallback snapshot, worker message correlation via `work_id`, and Buffer resolution.
- path: `src/utils/shipmentProgressBar.ts`
  - why it matters: validates base64, validates compact settings fields, expands short keys like `s_r_t_s`, `e_d_d_t`, `b_s_c`, `p_s`, and enforces color/text constraints.
- path: `src/worker/shipmentProgressBar.worker.js`
  - why it matters: core PNG renderer using `canvas`, font registration, shipment status localization, EDD display decision, progress mapping, and `toBuffer("image/png")`.
- path: `src/worker/canvas.js`
  - why it matters: low-level drawing helpers for rounded rectangle, EDD block, divider, wrapped text, progress bar, dashed/solid circle states, and locale formatting.
- path: `src/datasources/shipmentSnapshot/*`
  - why it matters: typed HTTP datasource for notification tracking snapshot API.
- path: `src/modules/integrationPaypal/*` and `src/datasources/integrationPaypal/*`
  - why it matters: PayPal cached transaction redirect endpoint and downstream API call.
- path: `config/{testing,staging,production}.ts`
  - why it matters: environment-specific internal service base URLs for businesses, tracking notification, and PayPal integration APIs.
- path: `Dockerfile`, `nest-cli.json`
  - why it matters: production starts `dist/src/main.js`; build must copy worker JS/canvas/constants/assets needed at runtime.

## Evidence
- file_or_command: `package.json:2-46`
  - finding: package name is `email-dynamic-images`; dependencies are NestJS/axios/canvas/dayjs/express/winston/etc. with no direct AfterShip npm package.
- file_or_command: `src/main.ts:7-13`
  - finding: service starts worker, creates Nest app, installs exception filter, and listens on configured `PORT` or `9003`.
- file_or_command: `src/app.module.ts:17-28`
  - finding: runtime modules are Config/Logger, `ShipmentProgressBarModule`, and `IntegrationPaypalModule`.
- file_or_command: `src/modules/shipmentProgressBar/shipmentProgressBar.controller.ts:35-58`
  - finding: `/shipment-progress-bar` reads `presentation_settings` and `t`, validates settings, calls `genShipmentProgressBar`, and returns PNG.
- file_or_command: `src/modules/shipmentProgressBar/shipmentProgressBar.service.ts:29-65`
  - finding: preview mode skips snapshot lookup; live mode calls `ShipmentSnapshotAPI.getShipmentSnapshot`; failures use fallback snapshot; worker request includes `work_id`, presentation settings, and snapshot.
- file_or_command: `src/datasources/shipmentSnapshot/shipmentSnapshot.service.ts:12-19`
  - finding: downstream snapshot endpoint path is `/render/shipment-snapshot`.
- file_or_command: `config/production.ts:5-13`, `config/staging.ts:5-13`, `config/testing.ts:5-13`
  - finding: internal service hosts are `pltf-businesses`, `prod-as-tracking-notification`, and `prod-as-integration/paypal` per environment.
- file_or_command: `src/worker/shipmentProgressBar.worker.js:41-148`
  - finding: worker renders 305x120 logical canvas at 2x scale, localizes status, optionally displays EDD, draws progress, and returns PNG buffer.
- file_or_command: `src/modules/integrationPaypal/integrationPaypal.controller.ts:11-38`
  - finding: `/v1/cached-transactions` calls service with query params and redirects to first `paypal_app_link`.
- file_or_command: `src/datasources/integrationPaypal/integrationPaypal.service.ts:12-19`
  - finding: downstream PayPal integration endpoint path is `/cached-transactions`.
- file_or_command: `rg -n "ModuleFederation|module federation|webpack|exposes|remotes" . -g '!node_modules/**' -g '!dist/**'`
  - finding: no source/config evidence of Module Federation; webpack only appears as transitive Nest CLI lockfile dependency.
- file_or_command: `git remote -v`; `git config --local --get-regexp '^remote\\.|^branch\\.'`
  - finding: local `origin` points to `git@github.com:Wynne-cwb/prod-as-notification-dynamic-renderer.git`; no configured `upstream` remote; `master` and `feat/mailcraft` track fork refs.
- file_or_command: `git ls-remote --heads https://github.com/AfterShip/prod-as-notification-dynamic-renderer.git master master_v9 feat/flow-v3-polaris-v13 feat/flow-v3 feat/mailcraft`
  - finding: only upstream `master` returned; no `master_v9`, `feat/flow-v3-polaris-v13`, `feat/flow-v3`, or `feat/mailcraft`.
- file_or_command: `git ls-remote --symref https://github.com/AfterShip/prod-as-notification-dynamic-renderer.git HEAD`
  - finding: upstream HEAD points to `refs/heads/master` at `d6c2db5`, while local fork `origin/master` is `092cdba`.
- file_or_command: `git ls-remote --tags https://github.com/AfterShip/prod-as-notification-dynamic-renderer.git`
  - finding: upstream tags include `v1.0.0` through `v1.0.8`; local checkout had no local tags.
- file_or_command: `.github/workflows/ci-test.yml:6-14`, `.github/workflows/pr-check.yaml:3-12`, `.github/workflows/sonarqube.yaml:3-8`
  - finding: CI/test targets `master`/`testing`; PR title check accepts `feat/*`, `hotfix/*`, `release/*`, `testing`, `staging`, `master`; SonarQube PR scan targets `staging`/`master`.
- file_or_command: `Dockerfile:2-13`, `nest-cli.json:5-15`
  - finding: Docker uses AfterShip Node 18.18.2 onbuild image plus canvas system dependencies; Nest build copies worker/canvas/constants/assets needed by `dist/src/main.js`.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/constants/shipmentProgressBar.ts:18-31`
  - finding: `admin-email` maps environments to dynamic image domains, including production `https://dy-image.as-list.com` and testing `https://dy-image.as-list.io`.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/features/EasyEmailEditor/PreBuildBlock/blocksData/shipmentProgressBar/getShipmentProgressBarDataSource.ts:18-64`
  - finding: Easy Email shipment progress bar block defines merge tag `*||SHIPMENT_PROGRESS_BAR_IMAGE_URL||*`, Django helper `generate_shipment_progress_bar(...)`, compact base64 settings, and `/shipment-progress-bar` URL generation.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/features/DndEmailEditor/Editor/Previewer/components/Block/components/ShipmentProgressBar/index.tsx:90-120`
  - finding: DND email preview/template code builds `/shipment-progress-bar?version=v2&presentation_settings=...`; non-preview wraps it with `generate_shipment_progress_bar(...)` and uses returned `{{ url|safe }}`.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/features/AdvancedEmailEditor/useBeforeRender.ts:120-135`
  - finding: Advanced Email before-render hook rewrites shipment progress bar image `src` to the dynamic renderer URL.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/App.tsx:185-197`
  - finding: Mailcraft preview hook also sets `shipment_progress_bar_image` `img.src` to `https://dy-image.as-list.io/shipment-progress-bar?presentation_settings=...`.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/src/modules/render/render.controller.ts:14-25`
  - finding: email-renderer owns POST `/v1/email-render` and `/v1/platform-email-render`, confirming this dynamic-renderer repo is not the full HTML renderer.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/package.json:38-40`; `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/src/worker/jobs/emailRender.worker.js:30-68,219-250`
  - finding: email-renderer consumes `@aftership/admin-email`, imports `getShipmentProgressBarDataSource`, and includes it in Easy Email render data sources.
- file_or_command: `/Users/wb.chen/Documents/AfterShip/deployment-helmcharts/services/values/nodejs-http/product.automizelyapi.com-dynamic-renderer/production-values.yaml:108-123`
  - finding: local helm values deploy production service env `APP_ENV: production` with image repo `prod-as-notification-dynamic-renderer` and service/release name `product.automizelyapi.com-dynamic-renderer`.

## Open Questions
- question: Which backend repo implements the Django/template helper `generate_shipment_progress_bar(...)` and how exactly does it provide query `t` / tracking snapshot data?
  - why it matters: this service's live rendering depends on `t`, while local source search only found helper invocations in `admin-email`/fixtures, not the implementation.
- question: Which repo is the canonical owner of `prod-as-tracking-notification` `/render/shipment-snapshot`?
  - why it matters: this is the main live-data dependency for dynamic shipment progress bar rendering.
- question: Is `/v1/cached-transactions` still a supported production endpoint and which templates/clients generate links to it?
  - why it matters: the endpoint exists and calls PayPal integration, but no caller repo was confirmed in local source search.
- question: For future edits, should base branch be upstream `master` (`d6c2db5`) or a repo-specific feature branch?
  - why it matters: protocol active-major branches do not exist upstream for this repo, local checkout is on fork-only `feat/mailcraft`, and local `origin/master` differs from upstream `master`.
- question: Should the unused `BusinessesAPI` datasource be treated as planned dependency, dead code, or evidence of an older flow?
  - why it matters: config and datasource exist for `pltf-businesses`, but no current runtime module imports it.
