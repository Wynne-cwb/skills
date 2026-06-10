# sdk-ts-mailcraft-editor

## Summary
- project_id: `sdk-ts-mailcraft-editor`
- repo_name: `sdk-ts-mailcraft-editor`
- upstream_url: `https://github.com/AfterShip/sdk-ts-mailcraft-editor`
- local_path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft`
- repo_type: TypeScript/React npm SDK；MailCraft visual email editor engine + advanced email renderer；不是 Module Federation remote。
- confidence: high。本地 checkout、manifest、Vite library config、核心源码、下游 `admin-email` / `email-renderer` / `fe-pltf-ens-admin` 引用均已验证；未做网络搜索。

## Responsibility
- Owns:
  - `@aftership/mailcraft` SDK 包，提供 `MailCraft` React 编辑器、GrapesJS/Tiptap 组件编辑体验、blocks/plugins/traits、上下文状态、类型、客户端 preview render、服务端 advanced email render。
  - Advanced email JSON contract：`IMailCraftValues` 保存完整邮件模板（`globalStyles/assets/pages/inputSettingMap`），`IAdvanceSection` 保存可复用 section 模板（`template/inputSetting/fieldMapping/advanceComponents/previewData`）。
  - MailCraft component engine：Page/Content/Frame/Text/Image/Button/Divider/SocialLinks/TextLinks/Code/RecommendationList/VideoList/FileList/ShipmentReviewForm/Spacer/Accordion/Footer/Unsubscribe 等组件定义、GrapesJS 插件、HTML render 映射。
  - Advanced email server render：接收模板和 `prebuilt` sections，刷新系统属性，应用 `autoApplySections`，合并 `overrideAttributes/inputSettingMap/globalStyles/fontFamilies/previewText`，再用 React static markup + EJS 生成最终 HTML。
  - Business section authoring mode：`development=true` 时用于编辑单个 advanced section，并输出 `IAdvanceSection`。
- Does not own:
  - 不拥有 `admin-email` 的业务页面、Formik 保存路径、GraphQL content section 查询、迁移流程或 Module Federation remote。
  - 不拥有 `email-renderer` 的 worker 调度、content section cache、最终邮件发送前 render service、Django/MJML 服务包装。
  - 不直接依赖或维护 `@aftership/emailcat`；emailcat 是 `admin-email` 的 legacy/easy email renderer 依赖。
  - 不拥有 BFF/API 的 content section 持久化、host product code 权限、AI assistant/server-side authoring policy。
- Common change areas:
  - `src/core/*`：编辑器初始化、provider/context、模板打包与 reset。
  - `src/grapesjs/blocks/*`、`src/grapesjs/plugins/*`、`src/components/Traits/*`：组件和属性面板。
  - `src/renderer/*`、`src/renderer/helper/*`：HTML render、server/client preview、advanced section override 和 input setting 处理。
  - `src/utils/transformAdvanceSection.ts`、`src/utils/formattedAdvanceSection.ts`：prebuilt/system attributes/advanced section 标记与清洗。
  - `src/traitsFieldExtensions/*`：内置业务 trait 扩展（shipment items、product recommendation 等）。

## Branch Tracks
- production: `master` 存在本地和 `origin/master`，`origin/HEAD -> origin/master`；本地 `master` 当前为 `5e04ef5`，tag `1.0.21`，提交信息为 `Merge pull request #370 from AfterShip/feat/migration_polaris_v13`。
- legacy_v9: 未发现 `master_v9` 本地分支或 remote-tracking 分支。
- active_major: 协议候选 `feat/flow-v3-polaris-v13` 未发现；`feat/flow-v3` 存在本地和 `origin/feat/flow-v3`，当前 checkout 也是 `feat/flow-v3`，HEAD 为 `7b84c94` / `Merge pull request #371 from feidom-up/feat/flow-v3`。
- repo_specific_notes:
  - 另有 `origin/feat/migration_polaris_v13`，且 master/flow-v3 近期都合入 Polaris v13 相关提交；它不是协议定义的 active_major 候选分支。
  - Remote 异常已记录但未修复：`origin` 指向 `git@github.com:AfterShip/sdk-ts-mailcraft-editor.git`，用户 fork 反而命名为 `local`（`git@github.com:Wynne-cwb/sdk-ts-mailcraft-editor.git`），没有 `upstream` remote；部分本地分支 track `origin/*`，部分 track `local/*`。这不符合 fork-first 约定。

## Module Federation
- enabled: no。未发现 `ModuleFederationPlugin`、`@module-federation/*`、`remoteEntry`、`exposes`、`remotes` 配置；Vite 以 library mode 构建 npm SDK。
- exposes: n/a。
- remotes: n/a。
- shared_packages: 非 MF shared；Vite/Rollup external + peer dependencies 包括 `react`、`react-dom`、`@aftership/aha`、`@aftership/aha-icons`、`monaco-editor`。
- branch_alignment: 下游以 npm 包版本消费（例如 `admin-email` 使用 `@aftership/mailcraft ^1.0.20`，`fe-pltf-ens-admin` 使用 `^1.0.21-alpha.18` 且锁定到 `1.0.21`/alpha 版本）；MailCraft 自身无需和 MF remote 分支对齐，但 advanced email 相关变更通常要和 `admin-email`、`email-renderer`、`fe-pltf-ens-admin` 的消费版本一起验证。

## Team Repo Dependencies
- Direct dependencies:
  - `@aftership/aha`、`@aftership/aha-icons`：编辑器 UI、trait panels、icons；同时作为 peer/external。
  - `@aftership/reviews-email`：ShipmentReviewForm preview/render 通过 `renderMjmlBrowser` 复用 reviews email renderer。
  - 无 `@aftership/admin-email`、`product.automizelyapi.com_email-renderer`、`@aftership/emailcat` direct dependency。
- Runtime calls:
  - 核心 SDK 渲染入口本身不 fetch `admin-email` 或 `email-renderer`；生产数据通过宿主传入 `prebuilt`、`mergeTags`、`uploadFile`、`getImageList`、`beforeRender`、`inputSettingsInjector` 等回调。
  - dev/demo/test helper 会调用 Platform Notification/OC Extensions content section endpoint，例如 `testing-nike-pltf-nf-message.as-in.io/api/v1/internal/email/sections/versioned`，并以 `am-api-key`、`Am-Host-Product-Code` 取回 prebuilt。
  - 渲染输出中会保留 Django/EJS 片段，例如 `shipment_review(...)`、product recommendation、auto apply footer sections，真正业务上下文由下游 renderer/backend 提供。
- Build-time dependencies:
  - Vite library build 输出 `lib/index.*`、`lib/server.*`、`lib/node-render-mock.*`，并生成 d.ts。
  - `@aftership/aha`、`@aftership/aha-icons`、`react`、`react-dom`、`monaco-editor` 被 externalize，消费者需要提供兼容版本。
- Shared packages:
  - `@aftership/mailcraft` 被 `sdks.am-static.com_admin-email` 直接消费：AdvancedEmailEditor import `MailCraft`、类型和样式，构造 `prebuilt`，把变更写入 `email_body_template.advanced_email`。
  - `@aftership/admin-email` 再包装 `@aftership/mailcraft/server` 为 `AdvancedEmailRender`，并同时导出 `EasyEmailRender` from `@aftership/emailcat/lib/core`，形成 advanced email 与 legacy/easy email 的边界。
  - `product.automizelyapi.com_email-renderer` 直接依赖 `@aftership/admin-email`；advanced_email 分支调用 `AdvancedEmailRender`，其他 editor key 仍走 MJML/emailcat 风格渲染。
  - `fe-pltf-ens-admin` 同时直接依赖 `@aftership/mailcraft` 和 `@aftership/admin-email`：Email Section 编辑页用 `MailCraft development` 编辑 section；迁移/预览工具经 `AdvancedEmailRender` 渲染整封 advanced email。
- Inferred but unconfirmed:
  - `emailcat` 源码 checkout 未在本地队列中发现，只从 `admin-email` / `email-renderer` lockfile、imports、`node_modules` 路径看到消费证据。
  - 本地 remote-tracking 分支可能不是最新远端状态；本次按要求未联网 fetch。
  - npm 发布流程、registry provenance、实际生产部署版本未验证。

## Business Flows
- flow_id: `advanced_email_template_authoring`
- role: MailCraft 是浏览器端 advanced email editor engine；`admin-email` merchant editor 页面把 content sections、merge tags、image/font callbacks、feature gates、beforeRender hooks 传入 `MailCraft development=false`，并把输出保存到 `email_body_template.advanced_email`。
- upstream/downstream repos: upstream data 来自 `admin-email` GraphQL/content sections 和相关 BFF；downstream 保存后由 `product.automizelyapi.com_email-renderer` 消费 advanced email JSON。

- flow_id: `advanced_email_section_authoring`
- role: MailCraft `development=true` 用于编辑单个 `IAdvanceSection`（section template、inputSetting、fieldMapping、advanceComponents），`fe-pltf-ens-admin` 的 MailCraft page 使用此模式并接入 Django validate。
- upstream/downstream repos: upstream/downstream 主要是 `fe-pltf-ens-admin`、`admin.automizelyapi.org_mkt-operations` / Platform Notification content section APIs。

- flow_id: `advanced_email_server_render`
- role: MailCraft server renderer 负责将 `IMailCraftValues` + prebuilt + runtime options 转成 HTML；`admin-email` 只是薄包装 `AdvancedEmailRender`，`email-renderer` worker 在 `editor_key === "advanced_email"` 时调用它并跳过 `mjml2html`。
- upstream/downstream repos: upstream `product.automizelyapi.com_email-renderer` 传入 email template、prebuilt、custom fonts、auto apply flags；downstream 是最终 HTML/Django context 包装。

- flow_id: `easy_email_to_advanced_email_migration`
- role: MailCraft 提供目标 JSON/component enum/types/render；迁移逻辑主要在 `admin-email`，ENS 迁移工具通过 `@aftership/admin-email` preview/render。
- upstream/downstream repos: `sdks.am-static.com_admin-email`、`fe-pltf-ens-admin`。

## Important Entrypoints
- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/package.json`
- why it matters: 包身份是 `@aftership/mailcraft`；exports 定义 `.`、`./server`、style；dependencies/peerDependencies 显示 AHA、reviews-email、React/Monaco 边界。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/vite.config.ts`
- why it matters: Vite library build 的真实入口：`src/index.ts`、`src/server.ts`、`src/node-render-mock.ts`；确认不是 MF remote。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/index.ts`
- why it matters: browser SDK public API：types、`MailCraft`、`useMailCraftContext`、client render、RichTextEditor、blocks/layers/styles/traits、utils、EmbeddedCSS。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/server.ts`
- why it matters: server export surface 只有 `serverRenderEmailTemplate`。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/core/Editor.tsx`
- why it matters: 初始化 GrapesJS editor、custom blocks/layers/traits/asset manager/spots、TipTap RTE、MailCraft plugins，并接入初始模板、prebuilt、autoApply、onChange。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/core/context.tsx`
- why it matters: 定义宿主传入能力和全局状态：`prebuilt`、`autoApplySections`、`mergeTags`、`uploadFile`、`getImageList`、`beforeRender`、`inputSettingsInjector`、billing hooks、subject/previewText 等。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/core/useFormatMailCraftValues.ts`
- why it matters: 决定保存输出：production/editor 模式打包 `IMailCraftValues`；development/section 模式打包 `IAdvanceSection`。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/grapesjs/blocks/index.ts`
- why it matters: 定义可拖拽 block 集合；development 模式额外开放 ProductList、VideoList、FileList、ShipmentReviewForm 等业务块。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/grapesjs/plugins/index.ts`
- why it matters: 注册 GrapesJS component types，并提供 AI translation 用的 translate map。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/constant/componentMaps.ts`
- why it matters: component type 到 React render component / block definition 的核心映射。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/renderer/serverRenderer.ts`
- why it matters: advanced email server render 主入口，处理 prebuilt system attribute refresh、auto apply sections、advanceSectionMap、override/inputSetting、EJS。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/renderer/clientRenderer.ts`
- why it matters: editor/preview 侧 render，支持 fieldMapping、previewData、EJS preview、clientRenderAdvancedSection/clientRenderEmailTemplate。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/renderer/render.ts`
- why it matters: 递归 component tree，计算 spacing/layout，应用 override/inputSetting/global styles，并调用 component renderer 输出 HTML。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/utils/transformAdvanceSection.ts`
- why it matters: prebuilt 系统属性刷新、advance section map 构建、overrideAttributes 合并都在这里。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/traitsFieldExtensions/index.ts`
- why it matters: MailCraft 内置业务 trait extension：shipment items、product recommendation 等 section 的输入面板扩展。

- path: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/tests/server_render_test.ts`
- why it matters: 源码级 server render harness；展示如何 fetch prebuilt、构造 autoApplySections、调用 `serverRenderEmailTemplate`。

## Evidence
- file_or_command: `sed -n '1,260p' /Users/wb.chen/Documents/Project/skills/NOTIFICATION_REPO_MAP_RESEARCH.md`
- finding: 已按协议先读研究协议；报告使用 Per-Repo Research Output Schema。

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/Notification/mailcraft remote -v`
- finding: `local` 是 `git@github.com:Wynne-cwb/sdk-ts-mailcraft-editor.git`，`origin` 是 `git@github.com:AfterShip/sdk-ts-mailcraft-editor.git`；remote 命名不符合 fork-first 约定，未修复。

- file_or_command: `git -C /Users/wb.chen/Documents/AfterShip/Notification/mailcraft branch -a --no-color`
- finding: `master`、`feat/flow-v3` 存在；`master_v9`、`feat/flow-v3-polaris-v13` 未发现；`origin/feat/migration_polaris_v13` 存在。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/package.json:2-29,46-80,126-132`
- finding: 包名/版本为 `@aftership/mailcraft` `1.0.21`；exports 包括 `./server`；直接依赖 AHA、AHA icons、reviews-email、GrapesJS、TipTap、mjml-browser、EJS；peer 包括 AHA、React、Monaco。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/vite.config.ts:38-71`
- finding: library mode 输出 `index`、`server`、`node-render-mock`，externalize React/AHA/Monaco；没有 MF exposes/remotes。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/index.ts:1-67`
- finding: public browser API 导出 types、`MailCraft`、context、client renderer、RichTextEditor、UI panels、utils、EmbeddedCSS。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/server.ts:1`
- finding: server API 只导出 `serverRenderEmailTemplate`。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/core/Editor.tsx:81-157`
- finding: 编辑器用 GrapesJS 初始化 custom block/layer/trait/asset/canvas spots，注册 `TipTapRTE` 和 `MailCraftPlugins`，加载 EditorCSS/EmbeddedCSS，按 `initialValues/prebuilt/development` 初始化。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/core/useFormatMailCraftValues.ts:16-58,63-83`
- finding: `development=false` 输出完整 email template；`development=true` 输出 advanced section template/inputSetting/fieldMapping/advanceComponents。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/renderer/serverRenderer.ts:63-190`
- finding: server renderer 读取 pages/assets/globalStyles，按 prebuilt 刷新系统属性，插入 auto apply sections，构建 advanceSectionMap，应用 override/inputSetting/global fields 后 EJS render。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/grapesjs/blocks/index.ts`
- finding: 基础块和 development-only 业务块分离；ProductList/VideoList/FileList/ShipmentReviewForm 只在 development blocks 中额外开放。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/grapesjs/plugins/ShipmentReviewForm/render.tsx:7,80-145`
- finding: ShipmentReviewForm 使用 `@aftership/reviews-email` 的 `renderMjmlBrowser` 做 preview；server render 输出 `shipment_review(...)` Django 片段。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/mailcraft/src/constant/mockPlatformPrebuilt.ts:40-68`
- finding: dev/demo helper 从 Platform Notification email sections endpoint 拉 prebuilt，header 包含 `am-api-key` 与 `Am-Host-Product-Code`。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/package.json:66-72`
- finding: `admin-email` 同时依赖 `@aftership/emailcat`、`@aftership/mailcraft`、`@aftership/reviews-email`。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/features/AdvancedEmailEditor/index.tsx:10-21,123-184,353-465`
- finding: `admin-email` 直接 import `MailCraft` 和类型/样式，构造 prebuilt，读取/写入 `email_body_template.advanced_email`，把 autoApply/prebuilt/upload/getImageList/mergeTags/fontFamilies/traits/beforeRender 传给 MailCraft。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/features/AdvancedEmailEditor/utils.ts:1-8`
- finding: `admin-email` 的 `AdvancedEmailRender` 是 `@aftership/mailcraft/server` 的薄包装。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/Notification/sdks.am-static.com_admin-email/src/server.ts:1-7`
- finding: `admin-email` 同时导出 DND/HTML/EasyEmail/AdvancedEmail render；EasyEmail 来自 `@aftership/emailcat/lib/core`，AdvancedEmail 来自 MailCraft。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/package.json:38-40`
- finding: `email-renderer` 依赖 `@aftership/admin-email`，不是直接依赖 MailCraft 源码包。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/src/modules/render/render.service.ts:86-142,168-172`
- finding: `email-renderer` 为 advanced_email 从 content sections 构造 prebuilt 并随 worker message 传入。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/product.automizelyapi.com_email-renderer/src/worker/jobs/emailRender.worker.js:256-304`
- finding: worker 在 `editor_key === "advanced_email"` 时调用 `AdvancedEmailRender`，并直接使用返回 HTML；其他 editor key 才走 `mjml2html`。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/package.json:85-91`
- finding: ENS host 直接依赖 `@aftership/admin-email` 和 `@aftership/mailcraft`。

- file_or_command: `/Users/wb.chen/Documents/AfterShip/admin-portal/fe-pltf-ens-admin/src/pages/Content/MailCraft/index.tsx:1-20,244-270`
- finding: ENS Email Section 编辑页以 `development` 模式嵌入 MailCraft，传入 section template、advanceComponents、mergeTags、upload/getImageList、Django validate、Sidekick。

- file_or_command: `rg -n "ModuleFederation|remoteEntry|exposes|remotes|@module-federation" /Users/wb.chen/Documents/AfterShip/Notification/mailcraft --glob '!node_modules/**' --glob '!lib/**'`
- finding: 未发现 MailCraft 自身的 Module Federation 配置；只在 lockfile 普通依赖名中出现无关 `shared` 字样。

## Open Questions
- question: 后续功能开发的基线应选 `master` 还是 `feat/flow-v3`？
- why it matters: 协议 active_major 候选落在 `feat/flow-v3`，但生产 `master` 已合入 Polaris v13 并发布 `1.0.21`；具体任务需要按目标发布轨道确认。

- question: 是否需要把 remote 命名修正为 fork-first (`origin`=user fork, `upstream`=AfterShip)？
- why it matters: 当前 `origin`/`local` 反向命名容易让 future PR branch 或 push 目标出错；本次按要求只记录，不修复。

- question: `emailcat` 源 repo 的正式本地 checkout/上游 URL 是什么？
- why it matters: 本次只能从下游 lockfile/imports 证明它是 legacy/easy email renderer 依赖；没有源码证据说明 emailcat 内部职责。

- question: `fe-pltf-ens-admin` 同时消费 `@aftership/admin-email` 和 `@aftership/mailcraft` 的版本是否需要同步策略？
- why it matters: ENS lockfile 同时出现 `@aftership/mailcraft` stable/alpha 版本；MailCraft SDK 改动可能需要跨 `admin-email` 和 ENS host 做兼容验证。
