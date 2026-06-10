# Project Map Schema

Use `references/project-map.yaml` for stable team facts only. Do not include any user's local absolute paths.

## Top-Level Fields

```yaml
defaults:
  contribution_model: fork_pr
  git_provider: github
  upstream_owner: AfterShip
  clone_protocol: ssh

branch_tracks:
  production:
    candidates: [master]
  legacy_v9:
    candidates: [master_v9]
  active_major:
    candidates: [feat/flow-v3-polaris-v13, feat/flow-v3]

projects:
  - id: notification-bff
    name: Notification BFF
    type: bff
    repo_name: notification-bff
    upstream: https://github.com/AfterShip/notification-bff.git
    default_branch: master
    branches:
      production: master
      legacy_v9:
      active_major: feat/flow-v3
    module_federation:
      enabled: false
    packages:
      - "@aftership/example"
    responsibility: "聚合通知配置、模板、预览 API。"
    related_projects:
      - notification-admin
      - email-render-service
    flows:
      - email-rendering
    notes:
      - "Optional stable caveat."
```

## Field Rules

- `id`: stable project id used by `nrm`; prefer the GitHub repo name.
- `repo_name`: exact GitHub repo name under `AfterShip`.
- `upstream`: canonical upstream repo URL; HTTPS or SSH is acceptable, but keep owner as `AfterShip`.
- `default_branch`: stable default, usually `master` in this map.
- `branches`: record verified branch tracks only; leave absent tracks blank.
- `type`: use concise categories such as `frontend`, `frontend-sdk`, `bff`, `node-service`, `sdk`, `cli`, `library`, or `shell`.
- `responsibility`: one short paragraph about ownership and non-obvious boundaries.
- `related_projects`: project ids from the same map.
- `flows`: business flow ids; keep stable and reusable.
- `module_federation`: include `enabled`, and optionally `remote` or `exposes`.
- `packages`: npm package names or import namespaces owned by the repo.
- `notes`: caveats that affect repo choice, branch choice, or confidence.

## Branch Track Semantics

- `production`: stable production base. In this code system it normally resolves to `master`.
- `legacy_v9`: maintenance line for products still pinned to old Module Federation/runtime versions. Use only when `master_v9` exists for the repo.
- `active_major`: current large-version work. Prefer `feat/flow-v3-polaris-v13` when present; otherwise use `feat/flow-v3`.

When code evidence conflicts with the global branch-track rule, record the repo-specific branch in `projects[].branches` and explain it in `notes`.
