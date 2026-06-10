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

domain_conventions:
  admin_aftership:
    testing: https://admin.aftership.io
    release_pattern: https://<release>-admin.aftership.io
    staging: https://staging-admin.aftership.com
    production: https://admin.aftership.com
  admin_automizely:
    testing: https://admin.automizely.me
    release_pattern: https://<release>-admin.automizely.me
    staging: https://staging-admin.automizely.org
    production: https://admin.automizely.org
  sdks_am_static:
    testing: https://sdks.am-static.io
    release_pattern: https://<release>-sdks.am-static.io
    staging: https://staging-sdks.am-static.com
    production: https://sdks.am-static.com

projects:
  - id: notification-bff
    name: Notification BFF
    type: bff
    aliases:
      - notification bff
    repo_name: notification-bff
    upstream: https://github.com/AfterShip/notification-bff.git
    default_branch: master
    branches:
      production: master
      legacy_v9:
      active_major: feat/flow-v3
    module_federation:
      enabled: false
      remote:
      legacy_remote:
      aliases: []
      remote_entry_paths: []
      consumes: []
    packages:
      - "@aftership/example"
    urls:
      - https://admin.automizely.me/aio-notifications/
    api_endpoints:
      - /marketing/admin/v2/graphql
    service_hosts:
      - prod-mt-email-renderer.as-in.io
    business_aliases:
      - Platform Notification
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
- `domain_conventions`: stable environment/domain mapping for product/static hosts. Do not put personal local URLs here.
- `type`: use concise categories such as `frontend`, `frontend-sdk`, `bff`, `node-service`, `sdk`, `cli`, `library`, or `shell`.
- `aliases`: stable repo or product aliases people may type in chat. Use short phrases, not one-off typos.
- `responsibility`: one short paragraph about ownership and non-obvious boundaries.
- `related_projects`: project ids from the same map.
- `flows`: business flow ids; keep stable and reusable.
- `business_aliases`: human business names such as `Platform Notification`, `advanced email editor`, or `On-site Recommendation`.
- `module_federation`: include `enabled`; optionally include:
  - `remote`: current canonical MF global.
  - `legacy_remote`: old MF global such as Polaris v9/admin-era names.
  - `aliases`: common host-side aliases such as `notificationEmail`.
  - `remote_entry_paths`: stable CDN paths such as `/notification-email/remoteEntry.js`.
  - `consumes`: MF globals consumed by this repo.
  - `exposes`: public expose names when useful for routing work.
- `packages`: npm package names or import namespaces owned by the repo. For deprecated MF-package outputs, keep the package for lookup but explain the caveat in `notes`.
- `urls`: product/site/documentation URLs or stable route prefixes.
- `api_endpoints`: GraphQL/REST endpoint paths or full endpoint URLs.
- `service_hosts`: stable internal/public service hosts, without per-user credentials.
- `notes`: caveats that affect repo choice, branch choice, or confidence.

## Lookup Field Guidance

`nrm lookup` treats these as searchable keys:

1. normalized URL/domain/endpoint from `urls`, `api_endpoints`, and `service_hosts`
2. `packages`
3. `module_federation.remote`, `legacy_remote`, `aliases`, `remote_entry_paths`, and `consumes`
4. `id`, `repo_name`, and `aliases`
5. `business_aliases` and `flows`

Prefer exact, stable values. Avoid adding generic words such as `admin`, `email`, or `api` alone because they create noisy matches.

## Branch Track Semantics

- `production`: stable production base. In this code system it normally resolves to `master`.
- `legacy_v9`: maintenance line for products still pinned to old Module Federation/runtime versions. Use only when `master_v9` exists for the repo.
- `active_major`: current large-version work. Prefer `feat/flow-v3-polaris-v13` when present; otherwise use `feat/flow-v3`.

When code evidence conflicts with the global branch-track rule, record the repo-specific branch in `projects[].branches` and explain it in `notes`.
