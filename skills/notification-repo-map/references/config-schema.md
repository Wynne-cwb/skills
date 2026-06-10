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
```

## Fields

- `context_repo`: optional path to the repo or workspace where the config was generated.
- `github_user`: GitHub fork owner; used as the default fork namespace.
- `fork.owner`: optional override when the fork owner is not the same as `github_user`.
- `default_clone_root`: directory where `nrm ensure` lazily clones missing projects.
- `workspace_roots`: directories scanned during bootstrap.
- `projects`: map from project id to local checkout path.
- `clone.missing_projects`: `ask`, `auto`, or `never`.
- `fork.missing_forks`: `ask`, `auto`, or `never`.
- `clone.protocol`: optional `ssh` or `https`; defaults to the project map's `defaults.clone_protocol`.

## Bootstrap Matching

During first-use bootstrap, match local repos in this order:

1. Normalize `origin` and `upstream` URLs and compare them to project-map `upstream`.
2. Compare repo directory name and GitHub repo name to project-map `repo_name`.
3. If multiple local checkouts match one project, ask the user which path should be primary and record only that path.
4. Record remote-shape warnings separately in the bootstrap summary; do not silently repair remotes.
