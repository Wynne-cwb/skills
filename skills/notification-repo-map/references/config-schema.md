# Local Config Schema

Local config lives at:

```text
~/.config/notification-repo-map/config.yaml
```

This file is personal and may contain absolute paths. Never copy real user paths from it into shared skill files.

## Example

```yaml
context_repo: /Users/example/work/notification-repo-map
github_user: example-user
default_clone_root: /Users/example/work/notification

workspace_roots:
  - /Users/example/work/notification

projects:
  notification-bff: /Users/example/work/notification/notification-bff
  email-render-service: /Users/example/work/notification/email-render-service

clone:
  missing_projects: ask

fork:
  missing_forks: ask

codegraph:
  enabled: true
  install_if_missing: true
  init_on_bootstrap: true
  init_on_ensure: true
```

## Fields

- `context_repo`: optional path to the repo or workspace where the config was generated.
- `github_user`: GitHub fork owner; used as the default fork namespace.
- `fork.owner`: optional override when the fork owner is not the same as `github_user`.
- `default_clone_root`: single directory where `nrm ensure` lazily clones missing projects. Default it to the primary workspace root.
- `workspace_roots`: directories scanned during bootstrap.
- `projects`: map from project id to local checkout path.
- `clone.missing_projects`: `ask`, `auto`, or `never`.
- `fork.missing_forks`: `ask`, `auto`, or `never`.
- `clone.protocol`: optional `ssh` or `https`; defaults to the project map's `defaults.clone_protocol`.
- `codegraph.enabled`: default `true`.
- `codegraph.install_if_missing`: default `true`; `nrm codegraph install` uses npm-based installation when available.
- `codegraph.init_on_bootstrap`: default `true`; agents may initialize mapped repos after bootstrap when safe.
- `codegraph.init_on_ensure`: default `true`; `nrm ensure` initializes the ensured repo when CodeGraph is available.

## Bootstrap Defaults

Use this order to reduce questions:

1. Get GitHub user with `gh api user --jq .login`.
2. If unavailable, infer fork owner from local repo remotes.
3. Ask the user only if still unknown.
4. Infer likely workspace roots from current working directory, repo remotes, and common team directories.
5. Ask one workspace-root confirmation question if inference is ambiguous.
6. Set `default_clone_root` to the primary workspace root unless the user specifies another path.
7. Record missing repos in the bootstrap summary; do not fork or clone until a later `nrm ensure`.

## Bootstrap Matching

During first-use bootstrap, match local repos in this order:

1. Normalize `origin` and `upstream` URLs and compare them to project-map `upstream`.
2. Compare repo names from any remote URL to project-map `repo_name`.
3. Compare repo directory name to project-map `repo_name`.
3. If multiple local checkouts match one project, ask the user which path should be primary and record only that path.
4. Record remote-shape warnings separately in the bootstrap summary; do not silently repair remotes.

## Path Repair

When a configured project path no longer exists:

1. `nrm ensure <project-id>` scans `workspace_roots` and `default_clone_root`.
2. If one checkout matches by remote URL or repo name, it updates `projects.<project-id>`.
3. If multiple checkouts match, it stops and asks for manual config selection.
4. If none match, it applies `clone.missing_projects` and `fork.missing_forks` lazily for that one project.
