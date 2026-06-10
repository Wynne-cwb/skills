# pltf-nf-cli

## Summary
- project_id: `pltf-nf-cli`
- repo_name: `pltf-nf-cli`
- upstream_url: `https://github.com/AfterShip/pltf-nf-cli`
- local_path: `/Users/wb.chen/Documents/AfterShip/admin-portal/platform-notification-cli`
- repo_type: TypeScript/Node.js CLI npm package; command name `pn`; ships Platform Notification testing-env operations plus AI skill bundles.
- confidence: High for local checkout facts; Medium for upstream/latest state because research intentionally used local checkout and local git refs only, with no network search/fetch.

## Responsibility
- Owns:
  - Deterministic terminal CLI for AfterShip Platform Notification testing env config reads/writes: flow-template, merge-tag, email-template, sms-template, email-section, trigger/step/condition/template-function declarations, data-source-ui-asset, versioned-sms-component, content-variant, approved-query, mailcraft-component-detail.
  - Testing-env GraphQL client, auth bridge to `employee-auth`, JWT cache, error/exit-code contract, trace writing, zod schema-drift detection.
  - `pn flow-debug` read-only BFF debug query passthrough used by the `flow-debug` Codex/Claude skill.
  - Packaged skill bundle install/list/uninstall for `platform-notification`, `platform-notification-sync-types`, and `flow-debug`.
- Does not own:
  - Production notification writes; CLI has no user-facing env selector and hardcodes testing release-incy endpoint.
  - Notification BFF/service implementation; source comments and migration guide map to `admin.automizelyapi.org_mkt-operations`.
  - Admin portal FE / sidekick runtime behavior; `mailcraft-component-detail` explicitly omits FE-only editor state.
  - In this local checkout at `package.json` 0.5.1, `flow-trigger` source is not present, even though current globally installed `pn` 0.6.2 exposes `pn flow-trigger`.
- Common change areas:
  - `src/commands/<noun>/` command handlers and commander registration.
  - `src/types/<entity>.ts` zod schemas and GraphQL operation strings after BE schema drift.
  - `src/commands/flow-debug/` and `src/types/flow-debug.ts` when BFF debug query shape changes.
  - `skills/*` docs bundled by the CLI, plus installer/source/target resolver tests.
  - `tests/contract/*`, fixtures under `tests/fixtures/release-incy/`, and command-specific unit tests.

## Branch Tracks
- production: `master` exists locally and as `origin/master`; current checked-out branch is `master`.
- legacy_v9: No local or remote-tracking `master_v9` ref found.
- active_major: No local or remote-tracking `feat/flow-v3-polaris-v13` or `feat/flow-v3` ref found.
- repo_specific_notes:
  - Remote anomaly: `origin` points to company upstream `git@github.com:AfterShip/pltf-nf-cli.git`, while `local` points to user fork `git@github.com:Wynne-cwb/pltf-nf-cli.git`; the protocol's fork-first convention would normally use `origin` for the fork and `upstream` for AfterShip.
  - No `upstream` remote exists.
  - Current `master` tracks `local/master` and is ahead by 5 commits. Local `origin/master` also has one divergent merge commit not in HEAD. Not repaired.
  - Global installed runtime is `pn` 0.6.2, while this checkout package is 0.5.1; local source and runtime command surface differ.

## Module Federation
- enabled: No evidence of Module Federation. This is a Node CLI package, not a frontend MF module.
- exposes: None.
- remotes: None.
- shared_packages: None from Module Federation. Runtime dependencies are npm packages such as `commander`, `graphql-request`, `zod`, `debug`, and `semver`.
- branch_alignment: Not applicable; branch-track rules reduce to local git refs above.

## Team Repo Dependencies
- Direct dependencies:
  - No direct npm dependency on another AfterShip team repo is declared in `package.json`.
  - Publishes/installs as restricted npm package `@aftership/pltf-nf-cli`.
- Runtime calls:
  - Calls release-incy BFF GraphQL endpoint `https://release-incy-bff-api.automizely.me/mkt-operations/admin/graphql`.
  - Authenticates by spawning `employee-auth token --env testing`; `pn auth login` passes through to `employee-auth login --env testing`.
  - `pn upgrade` contacts npm registry for `@aftership/pltf-nf-cli` and then runs `pn skills install --claude --codex`.
- Build-time dependencies:
  - Node >= 20, Vite SSR build, TypeScript, Vitest.
  - No Module Federation, webpack, or frontend build-time integration found.
- Shared packages:
  - Ships AI skill directories under repo `skills/`: `platform-notification`, `platform-notification-sync-types`, `flow-debug`.
  - `pn skills install` copies all `skills/*/SKILL.md`-bearing bundles into Claude/Codex target directories and writes `.pn-installed` markers.
- Inferred but unconfirmed:
  - Strong coupling to `admin.automizelyapi.org_mkt-operations` BFF/service schemas is documented, but this repo does not contain those service sources.
  - Flow Debug implementation mirrors `fe-pltf-ens-admin` FlowDebugger FE queries and page behavior, but this repo only stores copied operation strings/comments, not the FE source.
  - `flow-trigger` is related in the runtime skill ecosystem, but local checkout 0.5.1 has no `src/commands/flow-trigger`; current global `pn` 0.6.2 does expose it.

## Business Flows
- flow_id: `platform-notification-config`
- role: Testing-env CLI for reading, creating, updating, reverting/resetting notification configuration resources. It replaces repetitive admin portal UI work for deterministic shell/agent workflows.
- upstream/downstream repos: Downstream to `admin.automizelyapi.org_mkt-operations` FE-facing GraphQL BFF; conceptually parallel to `fe-pltf-ens-admin` admin portal/sidekick UI.

- flow_id: `flow-debug`
- role: Read-only execution diagnosis via BFF debug queries: trigger requests, polling trigger executions, flow executions, step executions, sub-step executions, rendered email request, rendered SMS request. The CLI is the transport layer; the `flow-debug` skill supplies decision tree/reporting behavior.
- upstream/downstream repos: Downstream to mkt-operations BFF debug resolvers; mirrored against `fe-pltf-ens-admin` FlowDebugger GraphQL/page callsites; consumed by Codex/Claude `flow-debug` skill.

- flow_id: `schema-drift-recovery`
- role: When zod parsing detects BE response drift, CLI exits 6 and points agents to `platform-notification-sync-types`, `MIGRATION_GUIDE.md`, TypeScript compile, Vitest, and smoke validation.
- upstream/downstream repos: Upstream schema changes come from mkt-operations notification modules; downstream agent workflow patches `src/types/<entity>.ts` and matching operation strings.

- flow_id: `flow-trigger-relationship`
- role: Flow trigger test data creation is a related QA workflow, but not owned by this local source checkout. Runtime skill `flow-trigger` says data creation triggers commerce events and recommends `pn flow-debug` for verification/diagnosis.
- upstream/downstream repos: Current global `pn` 0.6.2 exposes `flow-trigger`; local checkout 0.5.1 does not, so source ownership needs a newer checkout/ref to confirm.

## Important Entrypoints
- path: `package.json`
- why it matters: Package identity, CLI bin mapping `pn -> ./dist/bin/pn.js`, version 0.5.1, scripts, npm dependencies, postinstall guidance.

- path: `bin/pn.ts`
- why it matters: Top-level executable wrapper; initializes trace, calls `runCli`, formats errors and JSON error envelope before exiting.

- path: `src/cli.ts`
- why it matters: Commander root; registers all local source command groups including entity commands, `skills`, `auth`, `flow-debug`, and `upgrade`.

- path: `src/env/resolver.ts` and `config/environments.ts`
- why it matters: Hardcoded testing endpoint single source of truth; no prod/local env selection in current CLI surface.

- path: `src/graphql/client.ts`
- why it matters: GraphQL request construction, `host-product-code` header, Bearer JWT, 401 retry, error mapping to auth/network/BE/upstream/schema classes.

- path: `src/graphql/execute-query.ts` and `src/graphql/execute-mutation.ts`
- why it matters: zod parse gate, exit 6 schema drift behavior, dry-run write short-circuit.

- path: `src/types/*.ts`
- why it matters: Local schema/operation mirror of BFF/BE entity and input classes; primary patch target for schema drift.

- path: `src/commands/flow-debug/` and `src/types/flow-debug.ts`
- why it matters: Seven read-only debug subcommands plus BFF operation strings and zod wrappers; core evidence for flow-debug relationship.

- path: `src/commands/skills/`, `src/skills/installer.ts`, `src/skills/source-resolver.ts`, `src/skills/target-resolver.ts`
- why it matters: Installs packaged skills to Claude/Codex personal or project scopes; runtime-enumerates skill bundles via `SKILL.md`.

- path: `skills/platform-notification/SKILL.md`
- why it matters: Main agent-facing CLI knowledge base for resource operations, relationships, host-product-code behavior, and hard rules.

- path: `skills/flow-debug/SKILL.md`
- why it matters: Agent playbook for interpreting `pn flow-debug` outputs, signal gates, cross-reference rules, and diagnostic report shape.

- path: `skills/platform-notification-sync-types/SKILL.md` and `MIGRATION_GUIDE.md`
- why it matters: Schema drift recovery protocol and CLI-to-BE source-of-truth map.

- path: `tests/`, `tests/contract/`, `tests/fixtures/release-incy/`
- why it matters: 85 Vitest test files, contract/error sampling, and release-incy fixture snapshots anchor expected BFF response shapes.

## Evidence
- file_or_command: `sed -n '1,260p' /Users/wb.chen/Documents/Project/skills/NOTIFICATION_REPO_MAP_RESEARCH.md`
- finding: Confirmed required Per-Repo Research Output Schema, branch-track rules, evidence rules, and fork-first remote expectations.

- file_or_command: `package.json`
- finding: Package is `@aftership/pltf-nf-cli` 0.5.1, Node >=20, bin `pn`, dependencies are general npm packages, description says testing-env Platform Notification CLI.

- file_or_command: `git remote -v`
- finding: `origin` is AfterShip upstream; `local` is user fork; no `upstream` remote.

- file_or_command: `git status --short --branch`; `git branch -vv`
- finding: Current branch `master` tracks `local/master` and is ahead 5; branch refs include `master`, release/chore/quick branches, and only `origin/master` for company remote.

- file_or_command: `git branch --all --list`
- finding: No `master_v9`, `feat/flow-v3-polaris-v13`, or `feat/flow-v3` refs observed.

- file_or_command: `git log --oneline --left-right --cherry-pick HEAD...origin/master`
- finding: Local HEAD and `origin/master` diverge; `origin/master` has merge commit `4870595`, while HEAD has local 0.5.1/upgrade commits.

- file_or_command: `src/cli.ts`
- finding: Registers entity nouns, `content-variant`, `skills`, `auth`, `flow-debug`, and `upgrade`; no local `flow-trigger` registration.

- file_or_command: `find src -path '*flow-trigger*' -print`; `rg -n "flow-trigger" platform-notification-cli`
- finding: No local `src/commands/flow-trigger` source; only incidental text in flow-debug schema reference.

- file_or_command: `pn --version`; `pn --help`; `npm run pn -- --help`
- finding: Global runtime `pn` is 0.6.2 and exposes `flow-trigger`; local dev runtime from checkout exposes no `flow-trigger` and reports version `dev` under tsx.

- file_or_command: `vite.config.ts`
- finding: Vite SSR Node20 build with Rollup input `bin/pn.ts`, preserve modules, shebang injection; no frontend/MF config.

- file_or_command: `rg -n "module federation|vite-plugin-federation|webpack|remotes|exposes" .`
- finding: No Module Federation implementation evidence; hits were incidental words only.

- file_or_command: `config/environments.ts`; `src/env/resolver.ts`
- finding: Testing GraphQL endpoint is `https://release-incy-bff-api.automizely.me/mkt-operations/admin/graphql`; resolver exports only `TESTING_GRAPHQL_ENDPOINT`.

- file_or_command: `src/graphql/client.ts`
- finding: Builds Authorization and `host-product-code` headers, calls testing endpoint, retries once after 401, maps HTTP/zod/SDL failures to structured errors.

- file_or_command: `src/auth/auth-bridge.ts`; `src/commands/auth/index.ts`; `src/commands/auth/login.ts`
- finding: Uses `employee-auth token --env testing`; auth commands include login/status/refresh/logout/whoami; macOS keychain or disk cache stores JWT.

- file_or_command: `skills/platform-notification/commands.md`; `npm run pn -- --help`
- finding: Documentation says 70 subcommands/17 nouns, while actual local commander help includes 19 command groups including `content-variant` and `flow-debug`; docs and source are close but not perfectly aligned.

- file_or_command: `src/commands/flow-debug/index.ts`
- finding: Wires exactly seven read-only subcommands: `trigger-requests`, `polling-trigger-executions`, `flow-executions`, `step-executions`, `sub-step-executions`, `email-request`, `sms-request`.

- file_or_command: `src/types/flow-debug.ts`
- finding: Stores BFF operation strings for debugTriggerRequests, debugPollingTriggerExecutions, debugFlowExecutions, debugFlowExecutionsByFlowId, debugStepExecutions, debugSubStepExecutions, debugEmailRequest, debugSmsRequest; comments cite mkt-operations BE and fe-pltf-ens-admin mirrors.

- file_or_command: `skills/flow-debug/SKILL.md`
- finding: Skill treats CLI as data passthrough and supplies signal gate, decision tree, cross-ref rules, and required diagnostic report shape.

- file_or_command: `/Users/wb.chen/.codex/skills/flow-trigger/SKILL.md`
- finding: Runtime flow-trigger skill says there is no manual "trigger flow" action; data creation causes commerce events, notification BE matches `trigger_event_type`, and verification should use inbox or `pn flow-debug`.

- file_or_command: `src/commands/approved-query/registry.ts`
- finding: Approved-query registry has three cross-entity composites and deliberately omits static mailcraft audit after Quick 260520-gkr.

- file_or_command: `src/commands/mailcraft-component-detail/index.ts`
- finding: Reads `email-section` payload and local tree path only; emits boundary saying FE editor-only merge-tag scope/tree skeleton needs sidekick/admin portal.

- file_or_command: `src/skills/installer.ts`; `src/skills/source-resolver.ts`; `tests/skills/installer.test.ts`
- finding: `pn skills install` enumerates every `skills/<name>/SKILL.md`, copies to Claude/Codex targets, writes `.pn-installed`, and tests all 3 shipped skills.

- file_or_command: `src/commands/upgrade.ts`
- finding: Upgrade command checks npm registry, upgrades global package through detected package manager, then fresh-spawns `pn skills install --claude --codex`.

- file_or_command: `MIGRATION_GUIDE.md`
- finding: Maps CLI types files to mkt-operations BE modules and defines schema drift recovery procedure; specials map `mailcraft-component-detail` and `approved-query`.

- file_or_command: `vitest.config.ts`; `find tests -name '*.test.ts' | wc -l`; `tests/contract/_fixtures.ts`
- finding: Test suite uses Vitest Node env, 85 test files, isolated auth cache, mocked `employee-auth`, release-incy fixtures, and contract sampling for exit codes.

## Open Questions
- question: Is local checkout intentionally behind the currently installed global `pn` 0.6.2?
- why it matters: `flow-trigger` is present in runtime and in Codex skill workflows, but absent from this local 0.5.1 source checkout; repo map should not attribute flow-trigger source ownership to this checkout without a newer local ref.

- question: Which remote layout should be used before future edits?
- why it matters: Current remotes are not fork-first by protocol (`origin` is AfterShip, `local` is fork, no `upstream`), and branch `master` tracks `local/master`; future code changes should repair/clarify this before commit/push.

- question: Should repo documentation counts be reconciled with actual command surface?
- why it matters: README/commands docs and local commander help differ in noun/subcommand counts; source registration is the stronger evidence for current local behavior.

- question: Are active-major branch-track rules applicable to this standalone CLI repo?
- why it matters: Only `master`/release/quick/chore refs are visible locally; no `feat/flow-v3*` refs were found, so notification active-major branch guidance may not apply here.
