# bff-api.automizely.com_marketing_admin_v2

## Summary
- project_id: `bff-api.automizely.com_marketing_admin_v2`
- repo_name: `bff-api.automizely.com_marketing_admin_v2`
- upstream_url: `https://github.com/AfterShip/bff-api.automizely.com_marketing_admin_v2`
- local_path: `/Users/wb.chen/Documents/AfterShip/Notification/bff-api.automizely.com_marketing_admin_v2`
- repo_type: NestJS GraphQL BFF / Node HTTP service for Automizely marketing admin v2.
- confidence: High for repo type, branch tracks, runtime calls, and notification/email/flow role; medium for upstream client ownership because this repo does not contain frontend consumer code.

## Responsibility
- Owns:
  - GraphQL BFF endpoint `/marketing/admin/v2/graphql` for marketing/admin notification, email/SMS content, flow, history, and settings workflows.
  - GraphQL resolver/schema layer, RBAC resource mapping, request-context/header forwarding, and orchestration across downstream notification/message/flow/data services.
  - Admin-facing adaptation logic for platform notification flow v3: flow templates, flow entity graph data, declarations, scan, send test, resend email/SMS, stats, and debugging.
  - Admin-facing adaptation logic for notification message content: email/SMS system templates, content groups, content variants, render settings, assets, merge tags, and fallback settings.
- Does not own:
  - The notification-flow, notification-message, notification-infra, notification-migration, tracking-notification, flow-core, templating, email-renderer, SMS core, or data-DMS backend services themselves; this repo calls them through configured API hosts.
  - Frontend Module Federation remotes/hosts; no Module Federation config was found.
  - Persistent flow/message execution storage; the service delegates CRUD and stats to downstream APIs.
- Common change areas:
  - Add or change GraphQL queries/mutations in `src/modules/**/**.resolver.ts`.
  - Add or change orchestration logic in `src/modules/notificationFlow`, `src/modules/notificationMessage`, `src/modules/flow`, `src/modules/email`, `src/modules/analysis`, and `src/modules/settings`.
  - Add or change downstream service adapters in `src/datasources/**`.
  - Update API host config in `config/*.ts` and RBAC resources via `@RbacResource`.

## Branch Tracks
- production: `master` exists locally and in `origin/master` and `upstream/master`.
- legacy_v9: `master_v9` was not found in local or remote refs.
- active_major: `feat/flow-v3` exists locally and in `origin/feat/flow-v3` and `upstream/feat/flow-v3`; current checkout is `feat/flow-v3`. `feat/flow-v3-polaris-v13` was not found.
- repo_specific_notes:
  - Additional environment/release branches exist: `testing`, `staging`, and `release/incy` in local/origin/upstream refs.
  - Current HEAD evidence: `1a70584f (HEAD -> feat/flow-v3, upstream/feat/flow-v3) Merge pull request #2005 from Hydra0507/feat/flow-v3`.
  - Remote model is fork-first ready: `origin` points to `git@github.com:Wynne-cwb/...`, `upstream` points to `git@github.com:AfterShip/...`.

## Module Federation
- enabled: No evidence of Module Federation.
- exposes: None found.
- remotes: None found.
- shared_packages: Not applicable. `webpack` exists as a dev dependency, but searches found no `ModuleFederationPlugin`, `remoteEntry`, `exposes`, or `remotes`.
- branch_alignment: Use backend branch-track rules instead: `master` for production, `feat/flow-v3` for active major work in this checkout.

## Team Repo Dependencies
- Direct dependencies:
  - `@aftership/automizely-authz`: RBAC permission checks in `src/modules/auth-z/auth-z.module.ts` and `src/guard/rbac/rbac.guard.ts`.
  - `@aftership/config-center-sdk`: runtime config center integration in `src/lib/configCenter/configCenter.service.ts`.
  - `@aftership/am-filters` and `@aftership/am-dynamic-form`: shared filter/form schemas used by flow, CRM, dynamic form, conditions, duplicate flow, and field item modules.
  - `@aftership/aftership-apps-data` and `@aftership/aftership-error`: app metadata and shared error handling.
- Runtime calls:
  - Notification v3 services: `notification_flow_api`, `notification_message_api`, `notification_infra_api`, `notification_migration_api`.
  - Legacy/marketing flow services: `mkt_flow_api`, `flow_core_api`, `flow_triggers_api`, `flow_actions_api`.
  - Message/content services: `templating_api`, `email_render_api`, `platform_email_renderer_api`, `email_screenshot_api`, `email_report_api`, `message_platform_api`, `sms_core_api`, `smart_sending_api`.
  - Notification/history services: `tracking_notification_api`, `as_notification_api`, `notifications_api`, `returns_notification_api`, `as_org_notification_api`.
  - Supporting services: `risk_api`, `conditions_api`, `data_dms_api`, `featuremgmt_api`, `billing_api`, `connector_api`, `acrm_api`, `acrm_platform_api`, `business_api`, `account_business_api`, `content_platform_api`, `search_platform_api`, `as_shipment_api`, `as_order_api`, `as_webhook_api`, `icecube_api`, `subscription_api`, and recommendation/trackings/maps/couriers APIs.
- Build-time dependencies:
  - Jenkins shared library `jenkins-pipeline-library@automation`; CI flow is `nodejs`, app name is this repo, chart is `nodejs-http`, and `unitTest` is `yarn test`.
  - Docker base image `asia-east1-docker.pkg.dev/aftership-admin/ci-artifacts/nodejs-onbuild:nodejs-18.17.0-ts`; container runs `node dist/src/main.js`.
  - Nest CLI GraphQL plugin in `nest-cli.json` generates schema metadata from `.input.ts`, `.entity.ts`, `.dto.ts`, and related files.
- Shared packages:
  - NestJS/Apollo/GraphQL, Axios, New Relic Apollo plugin, `graphql-scalars`, `graphql-type-json`, `lodash`, `dayjs`, `xss`, and `isolated-vm`.
- Inferred but unconfirmed:
  - The configured service host names imply corresponding company services/repos such as notification flow/message/infra/migration, OC templating/flow actions/triggers/core, tracking notification, email renderer/report, SMS core, and smart sending. Exact repo names were not confirmed from this checkout alone.
  - Upstream frontend clients are likely marketing/admin notification UI or SDK repos, but this repo only exposes the BFF endpoint and does not contain consumer imports.

## Business Flows
- flow_id: `platform_notification_flow_v3`
- role: Active notification flow admin BFF. Exposes GraphQL operations for flow template list, flow entity with declarations, node data, scan, create/update/delete/rename/bookmark/status, duplicate, send test email/SMS, resend email/SMS, trigger flow debug, business scenario trigger-event map, and flow stats.
- upstream/downstream repos:
  - Upstream clients: inferred marketing admin UI consuming `/marketing/admin/v2/graphql`.
  - Downstream services: `notification_flow_api`, `notification_message_api`, `notification_infra_api`, `tracking_notification_api`, `data_dms_api`, `email_report_api`, feature control/feature management services.

- flow_id: `notification_message_content`
- role: Active notification message/content admin BFF. Exposes email/SMS system templates, content groups, content variants, render settings, assets, and notification flow merge tags.
- upstream/downstream repos:
  - Upstream clients: inferred marketing/admin notification editors.
  - Downstream services: `notification_message_api`, plus field-item/common settings/merge-tag fallback services inside this BFF and their downstream adapters.

- flow_id: `legacy_marketing_flow`
- role: Legacy/parallel marketing flow BFF. Keeps older `flowTemplates`, `flowList`, `saveFlow`, `deleteFlow`, `sendTestFlowEmail`, and related operations while the active branch is `feat/flow-v3`.
- upstream/downstream repos:
  - Downstream services: `mkt_flow_api`, `flow_core_api`, `flow_triggers_api`, `flow_actions_api`, `risk_api`, `templating_api`, `marketing_conversions_api`, and email/SMS send APIs.

- flow_id: `notification_history_and_tracking`
- role: Admin BFF for notification history list/detail, resend tracking notifications, tracking notification debug, and webhook detail enrichment.
- upstream/downstream repos:
  - Downstream services: `tracking_notification_api`, `as_webhook_api`, `flow_core_api`, and `notification_flow_api` depending on operation.

- flow_id: `email_sms_settings`
- role: Admin BFF for sender info, common settings, SMS phone number/application, quiet hours, assets, custom fonts, product metadata, merge-tag fallback, subscription/resubscribe, and WhatsApp sender settings.
- upstream/downstream repos:
  - Downstream services: `templating_api`, `sms_core_api`, `risk_api`, `smart_sending_api`, `billing_api`, `notification_message_api`, `subscription_api`, and related account/business/connectors APIs.

## Important Entrypoints
- path: `package.json`
- why it matters: Defines this as private Node/Nest service `bff-api.automizely.com_marketing_admin_v2`; scripts use `nest build`, `nest start --watch`, `tsc --noEmit`; dependencies show GraphQL, Axios, New Relic, AfterShip auth/config/filter packages.

- path: `src/main.ts`
- why it matters: Bootstraps Nest app, starts worker, installs upload/body middleware and header middleware, and listens on `/marketing/admin/v2/graphql`.

- path: `src/app.module.ts`
- why it matters: Central module graph and GraphQL setup. Registers `GraphQLModule` at `/marketing/admin/v2/graphql`, New Relic Apollo plugin, RBAC guard, and all notification/flow/message/email/SMS/settings/analysis datasource modules.

- path: `config/index.ts`, `config/development.ts`, `config/testing.ts`, `config/staging.ts`, `config/production.ts`
- why it matters: Defines runtime `api.*.url` host map for all downstream services, including notification flow/message/infra/migration, legacy flow, templating, email renderer/report, SMS core, tracking notification, and data services.

- path: `src/datasources/httpDataSource/httpDataSource.module.ts`
- why it matters: Converts datasource `apiHost` keys into base URLs from config center/current env config and constructs `RestDataSource`.

- path: `src/datasources/httpDataSource/rest.datasource.ts`
- why it matters: Shared Axios client that forwards organization/account/app/product/trace headers and exposes `get/post/put/patch/delete` helpers used by downstream API adapters.

- path: `src/modules/notificationFlow/notificationFlow.resolver.ts`
- why it matters: Main GraphQL surface for active platform notification flow v3, including flow list/entity/declarations/node data/stats/mutation/test/resend/debug operations and RBAC resources.

- path: `src/modules/notificationFlow/notificationFlow.service.ts`
- why it matters: Orchestrates notification-flow API, flow-template API, notification-message API, data-center stats, tracking notification debug/resend, email report, feature access, product/org/common settings, and conditional datasource logic.

- path: `src/datasources/notificationFlow/notificationFlow.module.ts`, `src/datasources/notificationFlow/notificationFlow.service.ts`
- why it matters: Binds `notification_flow_api` and calls `/internal/trigger-declarations`, `/internal/step-declarations`, `/internal/condition-declarations`, `/internal/flows`, `/internal/flow-test-messages/test-email`, `/internal/flow-test-messages/test-sms`, resend, scan, duplicate, and status/name/bookmark endpoints.

- path: `src/modules/notificationMessage/notificationMessage.resolver.ts`, `src/modules/notificationMessage/notificationMessage.service.ts`
- why it matters: Main GraphQL surface and adaptation logic for email/SMS content groups, variants, system templates, render settings, assets, and merge tags.

- path: `src/datasources/notificationMessage/notificationMessage.module.ts`, `src/datasources/notificationMessage/notificationMessage.service.ts`
- why it matters: Binds `notification_message_api` and calls internal email/SMS/common-content endpoints for templates, content groups, variants, render settings, assets, product metadata, and merge-tag fallback settings.

- path: `src/modules/flow/flow/flow.resolver.ts`, `src/modules/flow/flow/flow.service.ts`
- why it matters: Legacy/parallel flow GraphQL surface and orchestration through flow-core, risk manager, marketing conversions, content platform, feature manager, dynamic schema, and content risk review.

- path: `src/modules/email/sendEmail/sendEmail.resolver.ts`, `src/modules/email/sendEmail/sendEmail.service.ts`
- why it matters: Email/test/resend GraphQL operations, including generating tracking events and delegating resend/test sends to flow-core or tracking-notification APIs.

- path: `src/modules/analysis/notificationHistory/notificationHistory.resolver.ts`, `src/modules/analysis/notificationHistory/notificationHistory.service.ts`
- why it matters: Notification history list/detail GraphQL operations and webhook detail enrichment via tracking-notification and AS webhooks APIs.

- path: `src/guard/rbac/rbac.guard.ts`, `src/guard/rbac/rbac.decorator.ts`, `src/modules/auth-z/auth-z.module.ts`
- why it matters: Product-aware RBAC guard uses `@aftership/automizely-authz`; resolver decorators define resources such as `/notifications/flow`, `/notifications/email_templates`, `/notifications/history`, and `/settings/email_and_sms`.

- path: `Jenkinsfile`, `Dockerfile`, `nest-cli.json`
- why it matters: CI/deploy/build evidence for Node service packaging, Docker runtime, and Nest GraphQL codegen setup.

- path: `docs/platformNotification-flowEntityData-api.md`, `docs/platformNotification-flowListItemData-api.md`
- why it matters: Local docs for platform notification data-source APIs and flow/entity stats data shapes used by flow list/entity display.

## Evidence
- file_or_command: `git remote -v`
- finding: `origin` is the user's fork `git@github.com:Wynne-cwb/bff-api.automizely.com_marketing_admin_v2.git`; `upstream` is `git@github.com:AfterShip/bff-api.automizely.com_marketing_admin_v2.git`.

- file_or_command: `git for-each-ref --format='%(refname:short)' refs/heads refs/remotes | rg '(^|/)master$|master_v9|feat/flow-v3-polaris-v13|feat/flow-v3$|release/incy|testing|staging'`
- finding: Found `master`, `feat/flow-v3`, `release/incy`, `testing`, and `staging` locally and/or in remotes; no `master_v9` or `feat/flow-v3-polaris-v13`.

- file_or_command: `git rev-parse --abbrev-ref HEAD`; `git log -1 --oneline --decorate`
- finding: Current checkout is `feat/flow-v3`; HEAD is `1a70584f (HEAD -> feat/flow-v3, upstream/feat/flow-v3) Merge pull request #2005 from Hydra0507/feat/flow-v3`.

- file_or_command: `package.json`
- finding: Service name matches repo; private NestJS app with GraphQL/Apollo/Axios/New Relic and AfterShip shared packages; no frontend app scripts.

- file_or_command: `src/main.ts`
- finding: Bootstraps Nest and logs `http://localhost:${port || 9007}/marketing/admin/v2/graphql`; Docker exposes port `9003`.

- file_or_command: `src/app.module.ts`
- finding: Registers GraphQL path `/marketing/admin/v2/graphql`, imports notification flow/message/history modules plus legacy flow, email, SMS, content, settings, analysis, risk, billing, connectors, tracking, and subscription modules; applies global `RbacGuard`.

- file_or_command: `config/index.ts`, `config/production.ts`
- finding: Defines all downstream API hosts; production maps notification services to `pltf-nf-flow.as-in.com`, `pltf-nf-message.as-in.com`, `pltf-nf-infra.as-in.com`, and `pltf-nf-migration.as-in.com`, plus legacy flow, templating, tracking notification, email/SMS, data, and support services.

- file_or_command: `rg -n "apiHost: '" src/datasources -g '*.ts'`
- finding: Datasource modules bind API host keys such as `notification_flow_api`, `notification_message_api`, `notification_infra_api`, `tracking_notification_api`, `flow_core_api`, `flow_triggers_api`, `flow_actions_api`, `templating_api`, `sms_core_api`, `email_report_api`, and many support APIs.

- file_or_command: `src/datasources/httpDataSource/httpDataSource.module.ts`
- finding: `HttpDataSourceModule.registerAsync({ apiHost, version })` resolves `apiHost` through config center/current env config and constructs `RestDataSource` with the resolved base URL.

- file_or_command: `src/datasources/httpDataSource/rest.datasource.ts`
- finding: Shared Axios datasource forwards `am-trace-id`, app/product/account/organization/env headers, `flow-version`, recaptcha headers, and `Am-Api-Key`.

- file_or_command: `src/modules/notificationFlow/notificationFlow.resolver.ts`
- finding: Active notification flow GraphQL operations include `flowTemplateList`, `flowEntityWithDeclaration`, `getFlowEntityNodeData`, `scanFlow`, `flows`, `flowMutation`, `notificationSendTestSMS`, `notificationSendTestEmail`, `notificationResendEmail`, `notificationResendSms`, `triggerFlowDebug`, and RBAC resources under `/notifications/flow`.

- file_or_command: `src/modules/notificationFlow/notificationFlow.service.ts`
- finding: Constructor injects `NotificationFlowAPI`, `FlowTemplateServiceAPI`, `NotificationMessageAPI`, data-center, tracking notification, email report, feature control, product/org/common settings, and conditional datasource services; methods compose declarations and stats.

- file_or_command: `src/datasources/notificationFlow/notificationFlow.service.ts`
- finding: Calls notification flow internal endpoints for declarations, flows, send test email/SMS, resend email/SMS, scan, duplicate, generated names, and status/name/bookmark mutations.

- file_or_command: `src/modules/notificationMessage/notificationMessage.resolver.ts`
- finding: Exposes email/SMS system template and content group/variant operations, render settings, assets, and notification flow merge tags; RBAC resources include `/notifications/email_templates`, `/notifications/flow`, and `/settings/email_and_sms`.

- file_or_command: `src/datasources/notificationMessage/notificationMessage.service.ts`
- finding: Calls notification message internal endpoints for email/SMS templates, content groups/variants, common-content render settings/assets/product metadata, and merge-tag fallback settings.

- file_or_command: `src/modules/email/sendEmail/sendEmail.service.ts`
- finding: Resend/test email logic delegates to `SendEmailAPIService` and `TrackingNotificationService`; tracking notifications can resend email or SMS and generate event data before test sends.

- file_or_command: `src/modules/analysis/notificationHistory/notificationHistory.service.ts`
- finding: Notification history reads from tracking notification API and enriches webhook notifications from AS webhooks; enforces organization data permission.

- file_or_command: `rg -n "ModuleFederation|module federation|remoteEntry|exposes|remotes|webpack|federation|ModuleFederationPlugin|mf-host" . -g '!node_modules' -g '!dist' -g '!yarn.lock'`
- finding: Only `package.json` `webpack` dev dependency matched; no Module Federation runtime/config evidence.

- file_or_command: `Jenkinsfile`
- finding: Deployment metadata identifies app name, repo name, NodeJS CI flow, `nodejs-http` chart, `domainType = automizely.com`, and `unitTest = yarn test`.

- file_or_command: `Dockerfile`
- finding: Builds with Node onbuild image, sets `PORT 9003`, runs `npm run build`, and starts `node dist/src/main.js`.

- file_or_command: `docs/platformNotification-flowEntityData-api.md`, `docs/platformNotification-flowListItemData-api.md`
- finding: Docs describe platform notification flow/entity/list datasource APIs for stats such as flow steps, condition steps, content-group email/SMS/webhook stats, unsubscribe, and biz-id stats.

## Open Questions
- question: What are the exact GitHub repo names for each runtime service host (`pltf-nf-flow`, `pltf-nf-message`, `pltf-nf-infra`, `pltf-nf-migration`, `prod-oc-templating`, `prod-oc-flow-core`, etc.)?
- why it matters: This checkout proves service dependencies by API host and datasource usage, but not the owning repo names for all downstream services.

- question: Which frontend repo is the authoritative upstream client for `/marketing/admin/v2/graphql` on the active `feat/flow-v3` track?
- why it matters: The repo name and GraphQL surface imply marketing/admin notification UI clients, but consumer imports/routes are outside this checkout.

- question: Is `feat/flow-v3` still the only active major branch for this repo, or should a future `feat/flow-v3-polaris-v13` branch be created/aligned later?
- why it matters: Protocol prefers `feat/flow-v3-polaris-v13` when present, but this repo currently only has `feat/flow-v3`.

- question: Should `release/incy`, `testing`, and `staging` be recorded as environment tracks in the final skill, or only as supporting branches?
- why it matters: They exist and match config files, but the protocol's primary tracks are production/legacy_v9/active_major.
