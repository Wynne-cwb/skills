---
name: notification-repo-map
description: Map and operate across AfterShip notification, email, template, rendering, sending-chain, frontend, BFF, Node service, SDK, Module Federation, clone, fork, upstream, and PR repositories. Use when users mention notifications, email rendering, email templates, send flows, BFF, frontend, Node services, SDKs, cross-repo changes, "where is this project", repo relationships, business flows, local repo paths, missing clones, fork-first setup, upstream remotes, or preparing PR work across notification/email repos.
---

# Notification Repo Map

Use this skill to orient notification/email work before reading or editing code. Keep team facts in `references/project-map.yaml`; keep user-specific paths only in `~/.config/notification-repo-map/config.yaml`.

## First Use Bootstrap

If `~/.config/notification-repo-map/config.yaml` does not exist, bootstrap conversationally:

1. Ask which large local directories usually contain notification repos.
2. Ask for the GitHub username or fork owner.
3. Ask for the default clone root.
4. Ask how to handle missing repos: `ask`, `auto`, or `never`; recommend `ask`.
5. Scan the provided directories for git repos.
6. Read each repo's `origin` and `upstream` remotes.
7. Match repos to `references/project-map.yaml` by normalized upstream URL first, then repo name.
8. Write `~/.config/notification-repo-map/config.yaml`.
9. Summarize matched projects, missing projects, remote-shape problems, and explain that future missing repos are handled lazily with `nrm ensure`.

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
scripts/nrm resolve <project-id>
scripts/nrm ensure <project-id>
scripts/nrm doctor
```

- `resolve` reads only local config and prints the mapped path.
- `ensure` lazily checks or prepares one repo using the fork-first model.
- `doctor` diagnoses config, project-map, GitHub auth, SSH, and mapped repo remotes.

Read `references/config-schema.md` before editing local config manually. Read `references/fork-first-workflow.md` before code edits, remote repair, branch creation, or PR preparation.

## Before Code Edits

Before modifying a mapped repo:

1. Run `nrm ensure <project-id>`.
2. Confirm `origin` is the user's fork and `upstream` is the AfterShip repo.
3. Fetch upstream.
4. Create the feature branch from `upstream/<resolved-branch-track>`.
5. Open PRs from the user's fork branch to the AfterShip upstream repo.

If GitHub CLI auth, SSH, fork permissions, or remote ownership is unclear, stop and report the diagnostic instead of continuing.
