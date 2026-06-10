# sdks.am-static.com_admin-crm

## Summary
- project_id: sdks.am-static.com_admin-crm
- repo_name: sdks.am-static.com_admin-crm
- upstream_url: https://github.com/AfterShip/sdks.am-static.com_admin-crm
- local_path: /Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-crm
- repo_type: TypeScript/React frontend SDK package plus Module Federation remote for Notification CRM contacts, segments, audience selection, and subscriber/contact utilities.
- confidence: high. Evidence includes git remotes/branch refs, `package.json`, Module Federation config, Vite SDK build config, exported entrypoints, GraphQL operation documents, CRM contacts/segments components, and local type declarations for MF remotes.

## Responsibility
- Owns: npm package `@aftership/admin-crm`; current MF remote `notification_crm`; contacts list/detail UI; contacts import/export/delete task UI; contact status, tags, custom properties, analytics/timeline cards; segments list/editor/detail UI; audience selector component `SegmentSelector`; segment filter description/rendering integration; unsubscribed email/SMS recipient list modal; current data-retention backup notice UI on the checked-out `feat/data-retention` branch. Evidence: `package.json`; `config/constants/domain.js`; `config/constants/mf.js`; `src/mfExports/contacts.ts`; `src/mfExports/segments.ts`; `src/features/ContactsList/ContactsList.tsx`; `src/features/ContactsTable/index.tsx`; `src/features/ContactDetail/index.tsx`; `src/features/SegmentsList/index.tsx`; `src/features/SegmentEditor/index.tsx`; `src/features/SegmentDetail/SegmentDetail.tsx`; `src/components/SegmentSelector/index.tsx`; `src/components/UnsubscribedListModal/index.tsx`; `src/features/ContactRetention/ContactRetentionNotice.tsx`.
- Does not own: marketing GraphQL backend/schema/resolvers; actual email newsletter/template modal; notification basic shell/shared hooks/components; billing widgets and billing feature gates; account widgets; flow editor/automation engine; actual email/SMS sending or resubscribe backend logic. Evidence: `codegen.yml` points to local marketing admin GraphQL endpoints; source imports `notificationBasic/*`, `notificationBilling/billingV2`, `notificationEmail/email`, and `aftershipBillingWidgets/BillingProviderV2`.
- Common change areas: `src/features/Contacts*`, `src/features/Segment*`, `src/components/SegmentSelector`, `src/components/UnsubscribedListModal`, `src/components/Filter*`, `src/graphql/**`, `src/mfExports/**`, MF config, Vite externals, generated GraphQL types, and CDN/static asset config.

## Branch Tracks
- production: `master` exists locally and on `origin`/`upstream`; upstream `master` points to commit `570350c` dated 2026-05-27. Evidence: `git for-each-ref refs/heads refs/remotes`; targeted branch list returned `master`, `origin/master`, and `upstream/master`.
- legacy_v9: protocol candidate `master_v9` was not found. Repo has `upstream/feat/legacy-polaris-v9`, but that is not the protocol `legacy_v9` branch. Evidence: targeted branch query for `master_v9` returned no match; `git for-each-ref` listed `upstream/feat/legacy-polaris-v9`.
- active_major: `upstream/feat/flow-v3-polaris-v13` and `upstream/feat/flow-v3` both exist; resolve active major to `feat/flow-v3-polaris-v13` per protocol priority. Evidence: `git for-each-ref` listed both branches; `upstream/feat/flow-v3-polaris-v13` points to `9b7134c` dated 2026-05-19 and `upstream/feat/flow-v3` points to `4f53c9f` dated 2026-04-27.
- repo_specific_notes: checkout is currently on `feat/data-retention` tracking `upstream/feat/data-retention`; `origin` is the user's fork and `upstream` is AfterShip, so remotes are fork-first shaped. MF naming differs by branch generation: current/master and `feat/flow-v3-polaris-v13` use `notification_crm` plus `notification-crm`; older `feat/flow-v3` and `feat/legacy-polaris-v9` use `admin_crm` plus `admin-crm`.

## Module Federation
- enabled: yes. Evidence: `package.json` has `mf`, `build`, and `serve` scripts using `config/webpack/webpack.module.federation.config.js`; that webpack config uses `@module-federation/enhanced/webpack` `ModuleFederationPlugin`; `mf.config.js` defines host and remote configs.
- exposes: `./segments -> ./src/mfExports/segments` exporting `SegmentsList`, `SegmentEditor`, `SegmentDetail`, `SegmentSelector`, `UnsubscribedListModal`; `./contacts -> ./src/mfExports/contacts` exporting `ContactsList`, `ContactDetail`; `./commonTypings -> ./src/mfExports/commonTypings`; `./commonUtils -> ./src/mfExports/commonUtils`. Evidence: `config/constants/mf.js`; `src/index.ts`; `src/mfExports/*.ts`.
- remotes: current/master config uses `notificationBasic`, `notificationBilling`, `notificationEmail`, `aftershipBillingWidgets`, and `aftershipAccountsWidgets`. `feat/flow-v3-polaris-v13` keeps notification remote names but pins notification remotes to `release-incy-sdks.am-static.io`; older `feat/flow-v3`/`feat/legacy-polaris-v9` use `adminMarketingBasic`, `adminMarketingBilling`, and `adminEmail`. Evidence: `config/constants/mf.js`; `git show upstream/feat/flow-v3-polaris-v13:config/constants/mf.js`; `git show upstream/feat/flow-v3:config/constants/mf.js`; `git show upstream/feat/legacy-polaris-v9:config/constants/mf.js`.
- shared_packages: singleton/shared MF contract includes React, React DOM, React Router, `@aftership/aha`, `@aftership/aha-icons`, `@aftership/automizely-product-auth`, `@aftership/automizely-frontend-dev-kit`, `@aftership/meerkat-sdk`, `formik`, `@aftership/growth-components`, `@aftership/datacat`, Shopify i18n/app-bridge packages, and Sentry in host config. Evidence: `mf.config.js`.
- branch_alignment: current/master remote name is `notification_crm`, CDN subdirectory is `notification-crm`, and MF port is `8205`. `config/utils/path.js` maps `APP_ENV` to `sdks.am-static.io`, `staging-sdks.am-static.com`, `sdks.am-static.com`, or release domains; branch names are not encoded in current/master URL generation. Active major should align to `feat/flow-v3-polaris-v13`, while remembering that branch currently hardcodes notification remotes to release-incy URLs.

## Team Repo Dependencies
- Direct dependencies: `package.json` runtime/dev/peer/external contract includes `@aftership/am-filters`, `@aftership/datacat`, `@aftership/meerkat-sdk`, `@aftership/automizely-product-auth`, `@aftership/automizely-frontend-dev-kit`, `@aftership/growth-components`, `@aftership/admin-email`, `@aftership/admin-marketing-basic`, and `@aftership/admin-marketing-billing`. Evidence: `package.json` dependencies, devDependencies, externals, and peerDependencies.
- Runtime calls: GraphQL v1 documents target `http://localhost:9003/marketing/admin/graphql` for contacts, segments, imports, exports, deletion tasks, storage/user/org, product, filter config, and contact retention; GraphQL v2 documents target `http://localhost:9006/marketing/admin/v2/graphql` for contact activities/templates, unsubscribed contact search, SMS resubscribe method, and email report export. Evidence: `codegen.yml`; `src/graphql/v1/**/*.graphql`; `src/graphql/v2/**/*.graphql`.
- Build-time dependencies: MF build uses webpack 5, `@module-federation/enhanced`, and `@aftership/module-federation-typescript`; SDK build uses Vite, `vite-plugin-dts`, and `vite-plugin-svgr`; type/hook generation uses GraphQL Code Generator and `am-kit-hooks-codegen`; asset deploy uses `@aftership/deploy-frontend-assets`; Jenkins identifies app `sdks.am-static.com_admin-crm` and pre-publish script `yarn build:sdk`. Evidence: `package.json`; `config/webpack/webpack.module.federation.config.js`; `vite.config.ts`; `codegen.yml`; `config/scripts/upload-assets.js`; `Jenkinsfile`.
- Shared packages: MF shared config and Vite externals share React ecosystem, Polaris/AHA, auth/dev-kit, growth-components, datacat, meerkat, `formik`, plus MF aliases for `notificationBilling`, `notificationBasic`, `notificationEmail`, billing widgets, and account widgets. Evidence: `mf.config.js`; `vite.config.ts`; `src/typings/mf/remotes.d.ts`.
- Inferred but unconfirmed: package and remote names map to team repos such as `sdks.am-static.com_admin-email`, `sdks.am-static.com_admin-marketing-basic`, `sdks.am-static.com_admin-marketing-billing`, `am-filters`, and `automizely-frontend-dev-kit`; backend ownership for `marketing/admin/graphql` and `marketing/admin/v2/graphql` is not proven from this checkout alone.

## Business Flows
- flow_id: crm-contacts-management
- role: Owns frontend CRM contact list/detail workflows: query contacts, filter/search/sort columns, import CSV, export contacts via async task, batch delete, delete single contact, edit custom tags, show email/SMS status, and display Shopify/order/predictive analytics cards. Evidence: `src/features/ContactsList/ContactsList.tsx`; `src/features/ContactsTable/index.tsx`; `src/features/ContactDetail/index.tsx`; `src/graphql/v1/queries/contacts/*.graphql`; `src/graphql/v1/mutations/contacts/*.graphql`.
- upstream/downstream repos: upstream marketing admin GraphQL backend; runtime UI dependencies on `notificationBasic`, `notificationBilling`, product auth, and billing widgets.

- flow_id: segments-audience-management
- role: Owns segment/audience management UI: list/create/edit/detail/delete/export segments, save current contact filters as a segment, render AM filters, fetch segment contact counts, and expose `SegmentSelector` with optional `messageChannel` for email/SMS audience selection. Evidence: `src/features/SegmentsList/**`; `src/features/SegmentEditor/index.tsx`; `src/features/SegmentDetail/SegmentDetail.tsx`; `src/components/SegmentSelector/index.tsx`; `src/components/FilterCard/index.tsx`; `src/components/FilterDescription/index.tsx`; `src/graphql/v1/queries/segments/*.graphql`; `src/graphql/v1/mutations/segments/*.graphql`.
- upstream/downstream repos: upstream marketing admin GraphQL backend and `@aftership/am-filters`; downstream consumers include notification email/SMS/flow surfaces that need segment audience selection, but this checkout only proves the exported selector and email consumer.

- flow_id: email-campaign-from-segment
- role: Provides "Send email" actions from segment list/detail by lazy-loading `NewsletterTemplatesModal` from `notificationEmail/email` and passing `submitInfo={{segmentId: id}}`; this repo supplies the selected segment/audience, while the email remote owns newsletter/template creation. Evidence: `src/features/SegmentsList/SegmentsItem/index.tsx`; `src/features/SegmentDetail/SegmentDetail.tsx`; `src/typings/mf/remotes.d.ts`.
- upstream/downstream repos: downstream `sdks.am-static.com_admin-email`/`notificationEmail`; upstream segment GraphQL.

- flow_id: unsubscribed-recipients
- role: Owns reusable unsubscribed recipients modal for email/SMS tabs, time/search filters, v2 `searchContacts` query, CSV export through `emailReport`, email resubscribe callback handoff, and SMS resubscribe method display. Evidence: `src/components/UnsubscribedListModal/index.tsx`; `src/components/UnsubscribedListModal/components/SmsResubscribeModal/SmsResubscribeModal.tsx`; `src/graphql/v2/queries/searchContacts.graphql`; `src/graphql/v2/queries/smsResubscribeMethod.graphql`; `src/graphql/v2/mutation/emailReport.graphql`.
- upstream/downstream repos: upstream marketing admin v2 GraphQL; downstream caller owns `handleSendResubscribeEmail` for email resubscribe behavior.

- flow_id: contact-activity-timeline
- role: Displays a contact timeline using v2 contact activities/templates; activity typings include email/SMS events with `marketing_flow_id`, `mktgmsg_campaign_id`, and `mktgmsg_biz_type`. This repo displays marketing/email/flow artifacts in CRM but does not own flow/campaign execution. Evidence: `src/features/ContactDetail/components/ActivityTimeline/ActivityTimeline.tsx`; `src/utils/getContactActivities.ts`; `src/typings/contactActivities.ts`; `src/graphql/v2/queries/getContactActivities.graphql`; `src/graphql/v2/queries/getContactActivityTemplates.graphql`.
- upstream/downstream repos: upstream marketing admin v2 GraphQL and event-producing notification/email/flow systems.

- flow_id: contact-data-retention
- role: Current checked-out branch adds contact data-retention notice/popup and backup export prompt, polling retention status and starting backup export before scheduled contact deletion. Evidence: `src/features/ContactRetention/ContactRetentionNotice.tsx`; `src/graphql/v1/queries/contactRetention/getContactRetentionStatus.graphql`; `src/graphql/v1/mutations/contactRetention/contactRetention.graphql`; git log includes data-retention commits on `feat/data-retention`.
- upstream/downstream repos: upstream marketing admin GraphQL retention endpoints; no downstream UI consumer was confirmed from MF exports in this checkout.

## Important Entrypoints
- path: `src/index.ts`
- why it matters: SDK package entrypoint re-exports contacts, segments, typings, and utilities.

- path: `src/mfExports/segments.ts`
- why it matters: Public segment/audience surface: `SegmentsList`, `SegmentEditor`, `SegmentDetail`, `SegmentSelector`, and `UnsubscribedListModal`.

- path: `src/mfExports/contacts.ts`
- why it matters: Public contacts surface: `ContactsList` and `ContactDetail`.

- path: `src/mfExports/commonUtils.ts`
- why it matters: Public utility surface for contact list/contact formatting, contact activities, and segment helpers.

- path: `src/mfExports/commonTypings.ts`
- why it matters: Public typing surface for filters, contacts, contact activities, and CSV.

- path: `config/constants/mf.js`
- why it matters: Source of MF exposes and remote aliases.

- path: `mf.config.js`
- why it matters: Host/remote MF shared dependency contract and remote entry setup.

- path: `config/constants/domain.js`
- why it matters: Defines MF name `notification_crm`, port `8205`, CDN domains, and subdirectory `notification-crm`.

- path: `config/utils/path.js`
- why it matters: Builds public path and remote URLs for notification basic/billing/email, billing UI, and accounts widgets.

- path: `config/webpack/webpack.module.federation.config.js`
- why it matters: Builds the MF remote entry into `build/remoteEntry.js`.

- path: `vite.config.ts`
- why it matters: Builds distributable SDK output in `lib/` and externalizes MF/package dependencies.

- path: `codegen.yml`
- why it matters: Defines v1 and v2 marketing admin GraphQL schema endpoints and generated hook outputs.

- path: `src/features/ContactsList/ContactsList.tsx`
- why it matters: Main contacts page orchestration for import/export and contacts table.

- path: `src/features/ContactsTable/index.tsx`
- why it matters: Core contacts query, filter/search/sort/pagination, selection, and batch delete logic.

- path: `src/features/ContactDetail/index.tsx`
- why it matters: Main contact detail page and composition point for timeline, status, segments, contact card, analytics, and deletion.

- path: `src/features/SegmentsList/index.tsx`
- why it matters: Main segments page with billing gates and segment list core.

- path: `src/features/SegmentEditor/index.tsx`
- why it matters: Create/edit segment form and filter persistence.

- path: `src/features/SegmentDetail/SegmentDetail.tsx`
- why it matters: Segment definition/contact detail page and handoff to email newsletter modal.

- path: `src/components/SegmentSelector/index.tsx`
- why it matters: Reusable audience selector for segment-based messaging workflows.

- path: `src/components/UnsubscribedListModal/index.tsx`
- why it matters: Reusable email/SMS unsubscribed recipients list, export, and resubscribe handoff.

- path: `src/features/ContactRetention/ContactRetentionNotice.tsx`
- why it matters: Current data-retention backup notice/popup logic on the checked-out branch.

- path: `src/graphql/**`
- why it matters: Local operation set for CRM contacts, segments, contact activities, unsubscribed recipient search, SMS resubscribe, email report export, and contact retention.

- path: `example/Routes.tsx`
- why it matters: Example app routes demonstrate intended pages: `/segments`, `/segments/new`, `/segments/:id`, `/contacts`, `/contacts/:id`, and segment components/modals.

## Evidence
- file_or_command: `git remote -v`
- finding: `origin` is `git@github.com:Wynne-cwb/sdks.am-static.com_admin-crm.git`; `upstream` is `git@github.com:AfterShip/sdks.am-static.com_admin-crm.git`.

- file_or_command: `git status -sb`
- finding: checkout is on `feat/data-retention...upstream/feat/data-retention`.

- file_or_command: `git for-each-ref --format='%(refname:short) %(objectname:short) %(committerdate:short)'`
- finding: `upstream/master`, `upstream/feat/flow-v3`, `upstream/feat/flow-v3-polaris-v13`, `upstream/feat/legacy-polaris-v9`, `upstream/feat/data-retention`, release, testing, and origin refs exist; no `master_v9` ref was found.

- file_or_command: `package.json`
- finding: package is `@aftership/admin-crm`, output files are under `lib/`, MF scripts use webpack, SDK build uses Vite, and external/peer contracts include admin-email/admin-marketing packages.

- file_or_command: `config/constants/domain.js`
- finding: current MF name is `notification_crm`, port is `8205`, CDN subdirectory is `notification-crm`, and production/testing/staging/release CDN domains are defined.

- file_or_command: `config/constants/mf.js`
- finding: current MF exposes `segments`, `contacts`, `commonTypings`, and `commonUtils`; remotes are notification basic/billing/email plus billing/accounts widgets.

- file_or_command: `git show upstream/feat/flow-v3-polaris-v13:config/constants/mf.js`
- finding: active-major branch exposes the same CRM surfaces but pins notification basic/billing/email remotes to release-incy CDN URLs.

- file_or_command: `git show upstream/feat/flow-v3:config/constants/domain.js`
- finding: older active branch uses `DOMAIN_SUBDIRECTORY = 'admin-crm'` and `MODULE_FEDERATION_NAME = 'admin_crm'`.

- file_or_command: `mf.config.js`
- finding: MF remote emits `remoteEntry.js`; shared singleton packages include React, Router, AHA, AHA icons, auth/dev-kit, formik, growth-components, datacat, Shopify i18n/app-bridge, and Sentry host sharing.

- file_or_command: `config/webpack/webpack.module.federation.config.js`
- finding: webpack dev server uses port `8205`, entry `src/index`, output path `build`, chunk global `notification-crm_mf`, and `ModuleFederationPlugin` with remote config.

- file_or_command: `vite.config.ts`
- finding: SDK library entry is `src/index.ts`, output is `lib/index.es.js` and `lib/index.cjs.js`, and MF aliases are externalized.

- file_or_command: `codegen.yml`
- finding: v1 generated GraphQL hooks read schema from `http://localhost:9003/marketing/admin/graphql`; v2 reads from `http://localhost:9006/marketing/admin/v2/graphql`.

- file_or_command: `src/mfExports/*.ts`
- finding: public exports are contacts pages, segments pages/components, typings, and common utilities.

- file_or_command: `src/features/SegmentsList/SegmentsItem/index.tsx`
- finding: segment rows can export/delete segments and open `NewsletterTemplatesModal` from `notificationEmail/email` with `submitInfo={{segmentId: id}}`.

- file_or_command: `src/features/SegmentDetail/SegmentDetail.tsx`
- finding: segment detail embeds `ContactsTable`, exports segment contacts, deletes segments, edits segment definitions, and opens the email newsletter modal with the current segment id.

- file_or_command: `src/features/SegmentEditor/index.tsx`
- finding: create/edit segment uses `useGetSegmentDetailLazyQuery`, `useUpdateSegmentMutation`, `FilterCard`, and persists `presentation_settings.amFilters`.

- file_or_command: `src/components/SegmentSelector/index.tsx`
- finding: reusable selector calls `allSegmentContactCount` with search, ids, paging, and optional `message_channel`.

- file_or_command: `src/features/ContactsList/ContactsList.tsx`
- finding: contacts page opens import modal, exports contacts with current filters/search, and renders `ContactsTable`.

- file_or_command: `src/features/ContactsTable/index.tsx`
- finding: contacts table fetches either `contactList` or `segmentSearchContact`, supports AM filters/search/sort/pagination, and starts batch delete tasks.

- file_or_command: `src/features/ContactDetail/index.tsx`
- finding: contact detail fetches `contactDetail`, shows email/SMS status and segment membership, and composes order/analytics/timeline/contact cards.

- file_or_command: `src/components/UnsubscribedListModal/index.tsx`
- finding: modal switches email/SMS unsubscribed lists, queries v2 `searchContacts`, exports via `emailReport`, uses callback for email resubscribe, and opens SMS resubscribe instructions.

- file_or_command: `src/typings/contactActivities.ts`
- finding: email and SMS activity details include `marketing_flow_id`, `mktgmsg_campaign_id`, and `mktgmsg_biz_type`, confirming CRM displays artifacts from marketing flow/campaign systems.

- file_or_command: `src/typings/mf/remotes.d.ts`
- finding: declared remote modules include `notificationBasic/effectComponents`, `notificationBasic/basicComponents`, `notificationBasic/commonUtils`, `notificationBilling/billingV2`, and `notificationEmail/email`.

- file_or_command: `Jenkinsfile`
- finding: CI/deploy identifies app `sdks.am-static.com_admin-crm`, flow `frontend`, repo `sdks.am-static.com_admin-crm.git`, Node 16.16.0, unit test `yarn test`, and pre-publish script `yarn build:sdk`.

- file_or_command: `config/scripts/upload-assets.js`
- finding: uploads built assets from `build` to CDN bucket subdirectory `/${DOMAIN_SUBDIRECTORY}` and sets no-cache for `remoteEntry.js`.

## Open Questions
- question: Which backend repo owns the `marketing/admin/graphql` and `marketing/admin/v2/graphql` CRM/segment/contact schemas?
- why it matters: This repo owns frontend operations and generated types, but backend resolver ownership is not proven by this checkout.

- question: Which host app imports `notification_crm` in production, and which exact routes mount its contacts/segments surfaces?
- why it matters: Example routes show intended paths, but the production host consumer is not confirmed from this repo alone.

- question: Should active-major `feat/flow-v3-polaris-v13` keep notification remotes hardcoded to release-incy URLs?
- why it matters: Current/master derive remotes from `APP_ENV`, while active-major pins basic/billing/email remotes; branch alignment could affect local testing and release behavior.

- question: Are legacy npm peer names `@aftership/admin-email`, `@aftership/admin-marketing-basic`, and `@aftership/admin-marketing-billing` still required after MF remotes were renamed to `notification*`?
- why it matters: Package externals/peer dependencies still expose legacy names, while current MF remotes use notification aliases.

- question: Is `ContactRetentionNotice` meant to become a public MF export or only an internal/host-mounted feature on `feat/data-retention`?
- why it matters: Source exists on the current branch, but `src/index.ts` and `src/mfExports/**` do not currently export it.
