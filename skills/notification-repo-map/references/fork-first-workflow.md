# Fork-First Workflow

Notification repo work uses a fork-first contribution model.

## Required Remote Shape

```text
origin   -> user fork, for example git@github.com:<user>/<repo>.git
upstream -> AfterShip upstream, for example git@github.com:AfterShip/<repo>.git
```

Reading code can use any local checkout. Editing code should happen only after the remote shape is confirmed.

## Before Editing

1. Run `nrm ensure <project-id>`.
2. Run `git remote -v` in the repo and verify:
   - `origin` is not `AfterShip`.
   - `origin` points to the user's fork owner.
   - `upstream` points to `AfterShip/<repo>`.
3. Fetch upstream:

```bash
git fetch upstream --prune
```

4. Resolve the base branch from the project map:
   - production fix: `upstream/master`
   - legacy v9 fix: `upstream/master_v9`
   - active major work: `upstream/feat/flow-v3-polaris-v13`, or `upstream/feat/flow-v3` when the Polaris branch is absent
   - repo-specific temporary branch: use only when the project-map notes or user explicitly confirm it for the task, such as `dev-notifications` for `aftership-os-notification`

5. Create the feature branch from upstream:

```bash
git switch -c <feature-branch> upstream/<resolved-base-branch>
```

## PR Rule

Open PRs from the user's fork branch to the AfterShip upstream repo and base branch.

Do not push directly to AfterShip upstream branches. Do not create a feature branch from a stale fork branch when upstream has a verified base branch.

## Diagnostics

Stop and report next steps when any of these fail:

- GitHub CLI is missing or not logged in.
- SSH authentication to GitHub fails.
- User fork does not exist and config says `never`.
- The repo path exists but `origin` points to AfterShip.
- `upstream` is missing or points to a non-AfterShip repo.
- The resolved base branch is not present on upstream.

## Knowledge Correction PRs

When repo-map knowledge is user-confirmed as outdated:

1. Update only the shared skill files that encode stable knowledge, usually `references/project-map.yaml` or this workflow reference.
2. Do not copy personal local paths into shared files.
3. Run `scripts/nrm validate`.
4. Create a branch named `codex/update-notification-repo-map-<slug>`.
5. Open a PR to the skill repo with a short Chinese summary:
   - 哪些项目被更新
   - 哪些判断/分支/URL/MF/API 逻辑改变
   - 用户已确认 Skill 旧知识过期
