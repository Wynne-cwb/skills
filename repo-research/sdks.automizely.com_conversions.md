# sdks.automizely.com_conversions

## Summary
- project_id: `sdks.automizely.com_conversions`；Jenkins `appName`、Sonar `projectKey` 与 `package.json` name 均使用该值。
- repo_name: `sdks.automizely.com_conversions`
- upstream_url: `https://github.com/AfterShip/sdks.automizely.com_conversions`；本地 `upstream` 为 `git@github.com:aftership/sdks.automizely.com_conversions.git`。
- local_path: `/Users/wb.chen/Documents/AfterShip/sdks.automizely.com_conversions`
- repo_type: 浏览器前台 SDK / static assets bundle / Shopify app extensions；面向 retailer store 的 Automizely Marketing aka Conversions widgets。
- confidence: high for repo responsibility, entrypoints, branch evidence, runtime APIs；medium for mapping API domains back to exact backend repos because this pass did not use network and backend repo ownership is inferred only where source evidence exists.

## Responsibility
- Owns:
  - Storefront SDK bundles published as `conversions.js`, `mat_popup_bars.js`, `mkt_embedded.js`, `mkt_back_in_stock_popup.js`, `shopping.js`, `install_app.js`, `letshare.js`.
  - Automizely Marketing/Conversions storefront widgets: inactive tab conversions, popup bars, standard/cart-recovery/two-step email/SMS popups, embedded signup forms, back-in-stock popup/button, social proof, sales boosts, sticky tabs, upsell/recommendation display, and shopping app download prompts.
  - Browser-side wiring to Marketing public BFF GraphQL, legacy conversions REST APIs, Shopify cart/product APIs, storefront data collection, Shopify Web Pixel extension, and Shopify theme/flow extensions.
  - Static asset deployment to `sdks.automizely.*` buckets and compatibility upload under both `conversions/v1` and `messages/v1`.
- Does not own:
  - Email or SMS delivery, notification flow execution, template rendering, backend subscription persistence, coupon allocation backend, Marketing admin configuration UI, or BFF/backend API implementations.
  - Module Federation host/remote surfaces; no MF config was found.
  - Exact ownership of `api.automizely.*`, `bff-api.automizely.*`, `webhooks.automizely.*`, `accounts.aftership.*`, S3 buckets, or Sentry service.
- Common change areas:
  - `src/automizelySDK/helpers/initialize.js` for feature enablement and orchestration.
  - `src/automizelySDK/react/**` for widget UI, popup/embedded/back-in-stock/sales-boost/social-proof behavior.
  - `webpack/env.js` and `scripts/deployment/uploadAssets.js` for environment URL and asset deployment.
  - `shopify-app-extensions/**` and `app-extensions/**` for Shopify theme/web-pixel/flow extension assets.

## Branch Tracks
- production: `master` exists on local and `upstream/master`; CI runs on `master`; Jenkins marks production environment support. Treat `master` as production/stable track.
- legacy_v9: none found. No `master_v9` branch in local/origin/upstream refs.
- active_major: protocol candidates not present. No `feat/flow-v3-polaris-v13` or `feat/flow-v3` branch in local/origin/upstream refs.
- repo_specific_notes:
  - Release/env branches found: `upstream/release/kiwi`, `upstream/release/pear`, `upstream/release/gray`, `upstream/staging`, `upstream/testing`; origin also has `release/banana`, `release/chat`, `staging`.
  - `.github/workflows/ci-test.yml` runs on `master`, `release/pear`, `release/kiwi`.
  - `.github/workflows/sonarqube.yaml` targets PRs into `staging`, `master`, `release/*`.
  - `.github/workflows/pr-check.yaml` allows PR targets `feat/*`, `hotfix/*`, `release/*`, `testing`, `staging`, `master`.
  - `webpack/env.js` has environment aliases `release-kiwi`, `release-pear`, `release-gray`, `testing`, `staging`, `production`, which should be checked before choosing a release branch.

## Module Federation
- enabled: false / no evidence found.
- exposes: none found.
- remotes: none found.
- shared_packages: not MF shared config. Runtime/build dependencies include `@aftership/material-ui-react`, `@aftership/storefront-kit`, `@aftership/recommendation-storefront-ts`, `@aftership/aftership-config`.
- branch_alignment: not applicable; use repo-specific branch tracks above.

## Team Repo Dependencies
- Direct dependencies:
  - `bff-api.automizely.com_marketing_public`: runtime GraphQL endpoint is `MARKETING_BFF_PUBLIC_API/graphql`; `webpack/env.js` maps it to `bff-api.automizely.io|com/marketing/public`, and `codegen.yml` uses local schema `http://localhost:9002/marketing/public/graphql`.
  - `marketing.automizely.com`: README says this project provides mock data for widget API requests via `yarn mock-service`; Shopify embedded-form warnings link merchants to Marketing admin popup pages.
  - Shopify platform extensions: `shopify-app-extensions` defines theme extension, web pixel extension, and Send SMS Flow action.
- Runtime calls:
  - Marketing public BFF GraphQL: `getConversionsSettings`, `GetAvailablePhoneNumber`, `GetBackInStockSetting`, `IsSoldOut`, `GetConnectorIdByExternalId`, `GetRecommendedProducts`, `GetWebPixel`.
  - Conversions REST: `/store/settings`, `/store/popups/:id/subscribers`, `/public/signup-forms/:id/submissions`, `/public/biz-forms/notification-registration/:id/submissions`, `/store/events`, `/store/user_behaviors`, `/store/.../purchased_orders`, `/store/sales_boosts/affect_products`, `/store/products`.
  - Shopping REST: `/shopping/v1/public/stores/:appId`, `/shopping/v1/public/conversions-connections/:appId`, `/shopping/v1/public/app/download_url`.
  - Search and chats legacy settings APIs: `/search/v1/public/settings`, `/chats/v1/public/settings`; search is marked sunset/offline in initialization comments.
  - Shopify storefront APIs and browser globals: `/cart.js`, product `.js`, cart add/change/listeners, `window.ShopifyAnalytics`, Shopify Web Pixel `window.Shopify.analytics.publish`.
  - Shopify Flow Send SMS extension points to `webhooks.automizely.io/automizely/shopify/flow-actions/send-sms/*`.
- Build-time dependencies:
  - GraphQL codegen depends on Marketing public BFF schema.
  - Webpack builds static assets and iframes; deployment uploads to S3 buckets for `sdks.automizely.io`, `staging-sdks.automizely.com`, `sdks.automizely.com`, and release buckets.
  - Sentry source maps upload to `sentry.automizely.org` project `sdks-automizely-com-conversion`.
  - Shopify CLI deploy scripts manage app extensions for testing/production.
- Shared packages:
  - `@aftership/storefront-kit`: data collect, Web Pixel collect, pseudo-id APIs.
  - `@aftership/material-ui-react`: Mars UI components/theme in storefront widgets.
  - `@aftership/recommendation-storefront-ts`: recommendation SDK initialization.
  - `@aftership/aftership-config`: eslint/shared config.
- Inferred but unconfirmed:
  - `bff-api.automizely.com_recommendation` may back recommendation behavior, but this repo calls recommendation through Marketing public GraphQL and an npm package; no direct repo URL evidence found.
  - Backend repos for `api.automizely.com/conversions/v1`, `/shopping/v1`, `/search/v1`, `/chats/v1`, and `webhooks.automizely.io` need separate repo reports before recording as facts.
  - `app-extensions/**` and `shopify-app-extensions/**` appear to overlap for embedded form theme extension; current authoritative deploy path needs owner confirmation.

## Business Flows
- flow_id: `storefront_marketing_widgets`
  - role: Loads `conversions.js` on retailer stores, fetches conversions settings, and renders Marketing widgets: tabs, bars, popups, embedded forms, social proof, sales boosts, back-in-stock, and optional shopping app UI.
  - upstream/downstream repos: upstream config/admin likely `marketing.automizely.com` and Marketing public BFF; downstream browser/Shopify storefront, conversions REST APIs, data-collect pipeline.
- flow_id: `email_sms_signup_capture`
  - role: Collects email/phone/form fields in popups and embedded forms, validates client-side, obtains reCAPTCHA, posts signup submissions, displays coupon/success UI, and emits subscribe/get_coupon/click events.
  - upstream/downstream repos: downstream conversions REST `/public/signup-forms/...`, legacy popup subscriber API, storefront-kit data collect; not responsible for later campaign or notification sending.
- flow_id: `back_in_stock_notification_registration`
  - role: Shows subscription button/popup on sold-out Shopify product pages, fetches back-in-stock settings including `flow_id`, and posts `biz-forms/notification-registration` submissions with connector product/variant ids.
  - upstream/downstream repos: Marketing public BFF for settings/sold-out/connector lookups; downstream notification/flow execution is outside this repo and unconfirmed.
- flow_id: `shopify_embedded_form_extension`
  - role: Provides Shopify theme app extension block that creates the target `<div>` for embedded forms and design-mode warnings linking to Marketing admin.
  - upstream/downstream repos: Shopify app/theme platform; Marketing admin pages.
- flow_id: `shopify_marketing_web_pixel`
  - role: Shopify web pixel extension initializes storefront-kit web-pixel collect with appName `automizely` and product short code `mt`.
  - upstream/downstream repos: Shopify Web Pixels, `@aftership/storefront-kit`, data collect backend.
- flow_id: `shopify_flow_send_sms_action`
  - role: Defines Shopify Flow action metadata for “Send SMS”; runtime and validation URLs point to `webhooks.automizely.io`.
  - upstream/downstream repos: Shopify Flow and webhook backend; this repo owns extension config, not SMS execution.
- flow_id: `shopping_app_download_prompt`
  - role: Loads `shopping.js`, queries Shopping public settings/download URL, and inserts topbar/thank-you-page UI for AfterShip app download.
  - upstream/downstream repos: Shopping REST API; Shopify thank-you page.

## Important Entrypoints
- path: `README.md`
  - why it matters: Declares repo purpose, local dev, testing API usage, and `marketing.automizely.com` mock-service dependency.
- path: `package.json`
  - why it matters: Project identity, scripts, npm dependencies, Shopify extension push scripts, GraphQL codegen, lint/test commands.
- path: `webpack/base.js`
  - why it matters: Defines browser bundle entries for conversions, popup bars iframe, embedded iframe, back-in-stock popup, shopping, install_app, and letshare.
- path: `webpack/env.js`
  - why it matters: Central environment map for SDK domains, conversions/shopping/search/chats APIs, Marketing BFF public API, iframe HTML paths, app ids, GA ids, reCAPTCHA keys.
- path: `src/automizelySDK/index.js`
  - why it matters: Main `conversions.js` entry; guards duplicate initialization and calls `initialize()` after page load.
- path: `src/automizelySDK/helpers/initialize.js`
  - why it matters: Orchestrates settings fetch, pixel/data collect, tabs, bars, popups, embedded forms, back-in-stock, social proof, sales boosts, recommendation SDK, and shopping compatibility.
- path: `src/automizelySDK/utils/httpRequest.ts`
  - why it matters: Typed GraphQL POST helper to Marketing public BFF with conversions connection id and rate-limit headers.
- path: `src/automizelySDK/helpers/callApi.js`
  - why it matters: REST clients for conversions, search, chats, and Shopify product/cart data.
- path: `src/automizelySDK/react/helpers/postSignUpForm.ts`
  - why it matters: New signup/back-in-stock submission path, reCAPTCHA handling, two-step commit flow.
- path: `src/automizelySDK/react/helpers/postSubscribeForm.ts`
  - why it matters: Legacy popup subscriber API path.
- path: `src/automizelySDK/react/layers/iframe/hostInitialize.ts`
  - why it matters: Host page iframe bridge for popup/bars, cart triggers, top-window context, customer id, SMS link launch.
- path: `src/automizelySDK/react/embedded/layers/iframe/hostInitialize.ts`
  - why it matters: Embedded form iframe bridge, design mode, intersection-based impression event, page/customer/top-location messaging.
- path: `src/automizelySDK/react/hooks/useSubscriptionButtonDisplay.ts`
  - why it matters: Back-in-stock sold-out and settings lookup; records `flow_id` from backend settings.
- path: `src/shoppingSDK/index.ts` and `src/shoppingSDK/shoppingAppLoader.ts`
  - why it matters: Independent shopping SDK entry and settings/load flow.
- path: `shopify-app-extensions/extensions/marketing-web-pixel/src/index.ts`
  - why it matters: Shopify Web Pixel extension data-collect entry.
- path: `shopify-app-extensions/extensions/send-sms-action-0b40cefe/shopify.extension.toml`
  - why it matters: Shopify Flow Send SMS action definition and webhook URLs.
- path: `app-extensions/**/blocks/embeded_form.liquid` and `shopify-app-extensions/extensions/embedded-form-app-ext/blocks/embeded_form.liquid`
  - why it matters: Shopify embedded-form theme block containers and admin warnings.
- path: `scripts/deployment/uploadAssets.js`
  - why it matters: Static asset upload targets, cache policy, compatibility path under `messages`, Sentry sourcemap upload.

## Evidence
- file_or_command: `git status --short`
  - finding: no output during research; checkout appeared clean before report creation.
- file_or_command: `git remote -v`
  - finding: `origin` points to `Wynne-cwb/sdks.automizely.com_conversions.git`; `upstream` points to AfterShip checkout, matching fork-first shape.
- file_or_command: `git branch -a --list`; `git for-each-ref refs/remotes/upstream refs/remotes/origin`
  - finding: `master`, `staging`, `testing`, `release/kiwi`, `release/pear`, `release/gray` found; no `master_v9`, `feat/flow-v3`, or `feat/flow-v3-polaris-v13`.
- file_or_command: `package.json`
  - finding: name is `sdks.automizely.com_conversions`; description says SDKs embedded on retailer stores for Automizely conversions product; scripts include webpack build, GraphQL codegen, Shopify extension push.
- file_or_command: `README.md`
  - finding: repo contains widgets used on retailer stores with Automizely Marketing/Conversions; dev server port 8081; `marketing.automizely.com` mock-service provides widget API mock data.
- file_or_command: `webpack/base.js`
  - finding: bundle entries include `conversions`, `mat_popup_bars`, `mkt_embedded`, `mkt_back_in_stock_popup`, `shopping`, `install_app`, `letshare`; HTML plugins generate popup-bars, embedded, back-in-stock popup, and app-download HTML.
- file_or_command: `webpack/env.js`
  - finding: maps SDK domains, conversions/shopping/search/chats API URLs, Marketing public BFF URL, iframe HTML URLs, app IDs, reCAPTCHA keys, GA ids.
- file_or_command: `src/automizelySDK/helpers/initialize.js`
  - finding: fetches `GetConversionsSettings`, initializes recommendation SDK, tabs/bars/popups/embedded/back-in-stock/social-proof/sales-boosts/shopping compatibility, and data collect/pixel setup.
- file_or_command: `src/automizelySDK/graphql/schemas/queries/*.graphql`
  - finding: GraphQL operations cover conversions settings, SMS available phone number, back-in-stock setting, sold-out check, connector id, recommended products, and web pixel status.
- file_or_command: `src/automizelySDK/react/helpers/postSignUpForm.ts`
  - finding: posts signup and back-in-stock notification registration submissions to `/public/signup-forms/...` and `/public/biz-forms/notification-registration/...` with reCAPTCHA.
- file_or_command: `src/automizelySDK/react/hooks/useSubscriptionButtonDisplay.ts`
  - finding: back-in-stock button reads `flow_id`, checks sold-out status, and resolves connector product id through Marketing public BFF.
- file_or_command: `shopify-app-extensions/extensions/send-sms-action-0b40cefe/shopify.extension.toml`
  - finding: Shopify Flow action “Send SMS” delegates execute/validate/marketing activity URLs to `webhooks.automizely.io`.
- file_or_command: `scripts/deployment/uploadAssets.js`
  - finding: uploads built assets to release/testing/staging/production SDK buckets under `conversions/v1`; also uploads to `messages/v1` for old proxy compatibility.
- file_or_command: `.github/workflows/ci-test.yml`, `.github/workflows/sonarqube.yaml`, `.github/workflows/pr-check.yaml`
  - finding: CI/PR branch evidence supports `master`, `release/*`, `staging`, `testing`, `feat/*`, `hotfix/*`; no flow-v3 track evidence.

## Open Questions
- question: Which exact backend repos own `api.automizely.com/conversions/v1`, `/shopping/v1`, `/search/v1`, `/chats/v1`, and `webhooks.automizely.io`?
  - why it matters: Needed before encoding runtime domain dependencies as repo-to-repo facts.
- question: Is `shopify-app-extensions/**` the current replacement for `app-extensions/**`, or are both still deployed?
  - why it matters: Both define embedded form theme assets; release workflow and ownership may differ.
- question: Are `release/kiwi`, `release/pear`, and `release/gray` still active release tracks, or historical environment branches?
  - why it matters: Branch selection for fixes may need current team convention beyond local branch existence.
- question: For back-in-stock `flow_id`, which Notification/Flow repo executes the downstream notification?
  - why it matters: This repo only captures registration and UI; mapping downstream notification ownership requires another repo report.
