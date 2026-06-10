---
name: notification-repo-map
description: Map and operate across AfterShip notification, email, template, rendering, sending-chain, frontend, BFF, Node service, SDK, Module Federation, clone, fork, upstream, and PR repositories. Use when users mention notifications, email rendering, email templates, send flows, BFF, frontend, Node services, SDKs, cross-repo changes, "where is this project", repo relationships, business flows, local repo paths, missing clones, fork-first setup, upstream remotes, or preparing PR work across notification/email repos.
---

# Notification Repo Map

Use this skill to orient notification/email work before reading or editing code. Prefer `nrm lookup` when the user gives a short clue such as an npm package, URL, MF alias, endpoint, service host, repo name, business alias, or flow id.

Keep team facts in `references/project-map.yaml`; keep user-specific paths only in `~/.config/notification-repo-map/config.yaml`.

## First Use Bootstrap

If `~/.config/notification-repo-map/config.yaml` does not exist, bootstrap conversationally:

1. Infer GitHub user with `gh api user --jq .login`; if that fails, infer fork owner from local remotes; ask only if still unknown.
2. Infer likely workspace roots from the current environment and common team paths. If confirmation is needed, ask one root question.
3. Use the main workspace root as `default_clone_root` unless the user says otherwise.
4. Default missing-repo policies to `ask`; do not clone during bootstrap.
5. Run `scripts/nrm scan --root <path> --json` for confirmed roots. Match by normalized remotes first, so folder names may differ from repo names.
6. Write `~/.config/notification-repo-map/config.yaml` with `codegraph.enabled: true`.
7. Summarize matched projects, missing projects, remote-shape problems, candidate folders, and that future missing repos are handled lazily with `nrm ensure`.
8. If CodeGraph is enabled, run `scripts/nrm codegraph doctor`; initialize mapped repos when safe, but report install/auth failures clearly.

Do not clone every repo during bootstrap. Do not write personal absolute paths into this skill.

## Project Map

Read `references/project-map.yaml` when the user asks what a repo owns, which repos participate in a flow, or which branch track applies.

Use the global branch-track rule unless a project entry says otherwise:

- `production`: `master`
- `legacy_v9`: `master_v9` when present
- `active_major`: prefer `feat/flow-v3-polaris-v13`; otherwise `feat/flow-v3`

Read `references/project-map-schema.md` before changing project-map fields or adding repos.

## Local Operations

Run `scripts/nrm` from this skill directory, or by absolute path.

```bash
scripts/nrm lookup <query> [--json] [--limit N]
scripts/nrm show <project-id> [--json]
scripts/nrm scan --root <path>... [--json]
scripts/nrm resolve <project-id>
scripts/nrm ensure <project-id>
scripts/nrm doctor [--repair-paths]
scripts/nrm validate
scripts/nrm codegraph doctor|install|init <project-id|--all>
```

- `lookup` finds projects by URL/domain/endpoint, npm package, MF remote or alias, remoteEntry path, repo id/name, business alias, or flow id. Treat low-confidence/fuzzy results as candidates.
- `show` prints one project's stable team facts.
- `scan` discovers local git repos under roots and reports matched/missing/unmapped repos.
- `resolve` reads only local config and prints the mapped path.
- `ensure` self-heals missing configured paths by rescanning roots, then lazily forks/clones only the requested repo.
- `doctor` diagnoses config, project-map, GitHub auth, SSH, and mapped repo remotes.
- `validate` checks map shape, lookup-key conflicts, references, and personal-path leaks.
- `codegraph` checks, installs, or initializes CodeGraph. Read `references/config-schema.md` before changing CodeGraph config.

Read `references/config-schema.md` before editing local config manually. Read `references/fork-first-workflow.md` before code edits, remote repair, branch creation, or PR preparation.

## Before Code Edits

Before modifying a mapped repo:

1. Run `nrm ensure <project-id>`.
2. Confirm `origin` is the user's fork and `upstream` is the AfterShip repo.
3. Fetch upstream.
4. Create the feature branch from `upstream/<resolved-branch-track>`.
5. Open PRs from the user's fork branch to the AfterShip upstream repo.

If GitHub CLI auth, SSH, fork permissions, or remote ownership is unclear, stop and report the diagnostic instead of continuing.

## Knowledge Corrections

If the user says the skill's repo knowledge is wrong, ask whether the skill is outdated. After confirmation, update `references/project-map.yaml` or the relevant reference, run `nrm validate`, create a `codex/update-notification-repo-map-<slug>` branch, and open a PR with a concise Chinese summary of which projects and logic changed and that the correction was user-confirmed.

Read detailed references only when needed:

- `references/project-map-schema.md`: adding/changing project-map fields.
- `references/config-schema.md`: bootstrap config, path repair, CodeGraph config.
- `references/fork-first-workflow.md`: remote shape, branch base, PR rules.
