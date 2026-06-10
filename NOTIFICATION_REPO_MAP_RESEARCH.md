# Notification Repo Map Research Protocol

## Current Objective

Build the `notification-repo-map` Codex Skill from evidence gathered across notification, email, marketing, BFF, frontend, Node service, SDK, Module Federation, and related platform repositories.

The final skill should help agents understand:

- what each repo owns and does not own
- where local checkouts are located per user
- which repos participate in business flows
- which repos depend on other team repos
- which branch track should be used for a task
- how to follow the fork-first contribution workflow

## Recovery Instructions

After context compaction or a resumed thread:

1. Read this file first.
2. Read `repo-research/INDEX.md` for the current repo queue and report status.
3. Do not overwrite a repo report owned by a running subagent.
4. Continue from the `Current State` section below.
5. When enough repo reports are complete, merge their stable facts into the future `skills/notification-repo-map/references/project-map.yaml`.

## Non-Goals

- Do not store personal absolute paths in shared skill files.
- Do not copy research-only local checkout paths into the shared team project map.
- Do not clone every missing repo eagerly.
- Do not edit source code during research.
- Do not install runtime skills from local source directories.
- Do not treat inferred repo relationships as facts unless evidence is recorded.

## Repository Discovery Inputs

- Upstream GitHub prefix: `https://github.com/AfterShip/`
- Equivalent SSH upstream prefix: `git@github.com:AfterShip/`
- Research-only local scan root for this user/thread: `~/Documents/AfterShip`

Use the upstream prefix to derive candidate upstream URLs from repo names. Treat GitHub owner case as equivalent for matching, but prefer `AfterShip` casing when writing shared project-map data.

## Branch Track Rules

Default branch-track interpretation for notification and Module Federation related work:

| Track | Candidate branches | Meaning |
| --- | --- | --- |
| `production` | `master` | Stable production branch. |
| `legacy_v9` | `master_v9` | Optional legacy maintenance branch for old products that have not migrated to latest `master`. |
| `active_major` | `feat/flow-v3-polaris-v13`, then `feat/flow-v3` | Current major-version iteration. Prefer `feat/flow-v3-polaris-v13` when it exists; otherwise use `feat/flow-v3`. |

Per-repo research must verify which candidate branches actually exist. If these rules do not apply to a repo, record the repo-specific branch model with evidence.

## Fork-First Contribution Rules

When researching, record remotes but do not modify them. When later editing code, the agent must ensure:

- `origin` points to the user's fork.
- `upstream` points to the company upstream repo.
- feature branches are created from `upstream/<resolved-base-branch>`.
- PRs are opened from the user's fork branch to the upstream repo.

If authentication, GitHub CLI, permissions, or SSH access fail, stop and report diagnostics instead of forcing progress.

## Subagent Protocol

Use one subagent per repo when possible.

Subagents are read-only. They may inspect files, git remotes, branches, package manifests, lockfiles, configs, docs, and source references. They must not edit source files, final skill files, or shared indexes.

Each subagent owns exactly one report:

```text
repo-research/<repo-name>.md
```

The main agent owns:

```text
NOTIFICATION_REPO_MAP_RESEARCH.md
repo-research/INDEX.md
skills/notification-repo-map/**
```

Before the main agent writes a file that overlaps with an active subagent assignment, it must check subagent status and wait for completion unless the subagent reports failure or the user asks the main agent to take over.

## Subagent Assignment Template

When starting a repo research subagent, provide only the repo-specific inputs and this task:

```text
Research one repo for Notification Repo Map. Work read-only.

Repo: <repo-name>
Local checkout: <path from repo-research/INDEX.md, if present>
Upstream candidate: https://github.com/AfterShip/<repo-name>
Report file: repo-research/<repo-name>.md

Read NOTIFICATION_REPO_MAP_RESEARCH.md first, then inspect the local checkout. Produce the report using the Per-Repo Research Output Schema. Focus on stable facts: responsibility, branch tracks, Module Federation config, team repo dependencies, business flow roles, important entrypoints, and evidence. Do not edit source code, shared skill files, or repo-research/INDEX.md.
```

If the local checkout path is missing, the subagent may inspect GitHub metadata when authenticated tooling is available, but must mark missing source access as a blocker if code evidence is required.

## Per-Repo Research Output Schema

Each report should use this structure:

```md
# <repo-name>

## Summary
- project_id:
- repo_name:
- upstream_url:
- local_path:
- repo_type:
- confidence:

## Responsibility
- Owns:
- Does not own:
- Common change areas:

## Branch Tracks
- production:
- legacy_v9:
- active_major:
- repo_specific_notes:

## Module Federation
- enabled:
- exposes:
- remotes:
- shared_packages:
- branch_alignment:

## Team Repo Dependencies
- Direct dependencies:
- Runtime calls:
- Build-time dependencies:
- Shared packages:
- Inferred but unconfirmed:

## Business Flows
- flow_id:
- role:
- upstream/downstream repos:

## Important Entrypoints
- path:
- why it matters:

## Evidence
- file_or_command:
- finding:

## Open Questions
- question:
- why it matters:
```

## Evidence Rules

- Prefer source files, manifests, configs, route definitions, remote URLs, branch lists, package names, import paths, and documented APIs.
- For every dependency on another team repo, include evidence such as package dependency, import path, remote call, route, build config, Module Federation config, or README/doc reference.
- Mark guesses as `inferred` and list what evidence is missing.
- Keep reports concise. Put long command output summaries in prose instead of pasting large logs.

## Main Agent Merge Rules

After a repo report completes:

1. Mark it as `completed` in `repo-research/INDEX.md`.
2. Review whether the report has enough evidence for:
   - repo identity
   - repo type
   - responsibility
   - branch tracks
   - team repo dependencies
   - business flow participation
3. Move stable facts into the future `project-map.yaml`.
4. Keep personal local paths only in local config examples or runtime config, never in shared project-map files.
5. If a report has blockers, mark it `blocked` and record the next required user input or access fix.

## Current State

- Skill skeleton: not created yet.
- Root research protocol: created.
- Repo list: loaded from user input, 33 repos.
- Repo queue index: `repo-research/INDEX.md`.
- Local discovery: scanned `~/Documents/AfterShip`; 32/33 queue repos matched, `emailcat` not found locally.
- Remote discovery: several local checkouts are not fork-first yet; keep these as `doctor` findings until explicitly repaired.
- Active subagents: none.
- Completed repo reports:
  - `bff-api.automizely.com_marketing_admin_v2`
  - `sdks.am-static.com_admin-flow`
  - `aftership-os-notification`
  - `product.automizelyapi.com_email-renderer`
  - `sdks.am-static.com_admin-email`
  - `sdks.am-static.com_aio-notification`
  - `bff-api.automizely.com_marketing_public`
  - `sdks.automizely.com_conversions`
  - `admin.automizely.org_marketing-operations`
  - `admin.automizelyapi.org_mkt-operations`
  - `sdks.am-static.com_admin-marketing-billing`
  - `am-dynamic-form`
  - `sdks.am-static.com_admin-crm`
  - `sdks.am-static.com_admin-marketing-basic`
  - `sdks.am-static.com_admin-sms`
  - `sdks.am-static.com_admin-marketing-coupon`
  - `sdks.am-static.com_admin-marketing-data`
  - `sdk-nodejs-snap-form`
  - `am-filters`
  - `fe-pltf-ens-admin`
  - `sdk-ts-mailcraft-editor`
  - `npm-aftership-advance-filters`
  - `marketing.automizely.com`
  - `bff-api.automizely.com_marketing_admin`
  - `bff-api.automizely.com_recommendation`
  - `lego`
  - `prod-as-notification-dynamic-renderer`
  - `pltf-nf-cli`
  - `recommendation-admin-ts`
  - `admin.aftership.com`
  - `automizely-frontend-dev-kit`
  - `subscription.as-list.com`
  - `emailcat` (partial: no local checkout; source-level details need clone/access)
- Next step: review completed repo reports with the user, then create the `notification-repo-map` skill skeleton and merge stable facts into `skills/notification-repo-map/references/project-map.yaml`.
