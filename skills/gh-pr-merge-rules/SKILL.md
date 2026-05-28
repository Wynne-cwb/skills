---
name: gh-pr-merge-rules
description: Safe GitHub PR preparation workflow for feature branches that must merge into target environment branches across one or more repositories. Use when the user asks Codex to create or prepare GitHub PRs from a shared feature branch such as feat/feature-name into a target branch such as testing, release-incy, release-pear, or another environment branch, especially in multi-repo work involving module federation apps, BFFs, forks, and AfterShip upstream repositories.
---

# GH PR Merge Rules

## Overview

Use this workflow to prepare GitHub PRs without polluting the feature branch or pushing directly to AfterShip upstream branches. Treat `feat/feature-name` as the complete requirement branch, and treat the user-provided target branch as the integration branch for the requested environment.

## Inputs

Confirm these values before changing branches or creating PRs:

- `feature_branch`: the requirement branch, usually `feat/feature-name`.
- `target_branch`: the environment branch requested by the user, such as `testing`, `release-incy`, or `release-pear`.
- `aftership_remote`: the remote whose Git URL points to the AfterShip upstream repository.
- `fork_remote`: the writable fork remote.

If `target_branch` is missing, ask the user to choose it. Do not default to `testing`.

Identify remotes with `git remote -v`; do not assume the remote names. Treat a GitHub URL owned by `AfterShip` as `aftership_remote`. Treat a non-AfterShip remote that the user can push to as `fork_remote`. If the remotes are ambiguous, ask before pushing or creating the PR.

## Hard Rules

- Interpret "create a GitHub PR" as creating a PR only. Do not merge the PR or push directly to the upstream target branch.
- Never push directly to an AfterShip upstream branch.
- Push only to the user's fork remote unless the user explicitly confirms another writable destination.
- Do not merge `target_branch`, `main`, `master`, or any other branch into `feature_branch` unless the user explicitly requests it.
- Keep `feature_branch` as the complete, unpolluted branch for the requirement.
- If the worktree has uncommitted changes, ask the user how to handle them. Do not stash, commit, discard, or mix them into a PR without confirmation.
- Base every conflict check on the latest `aftership_remote/target_branch`.
- Never force-push or delete a branch unless the user explicitly approves the exact branch and remote.

## Preflight

Run these checks in each repository independently:

1. Check `git status --short`.
2. Stop and ask the user what to do if there are uncommitted changes.
3. Run `git remote -v` and classify `aftership_remote` and `fork_remote`.
4. Fetch the latest refs from both remotes.
5. Verify `feature_branch` exists locally or on `fork_remote`.
6. Verify `aftership_remote/target_branch` exists. If not, ask whether the target branch name is correct.
7. Ensure all requirement changes are committed on `feature_branch`.
8. Push `feature_branch` to `fork_remote` before creating any PR or doing conflict resolution.

## Conflict Check

Check whether the latest upstream target can accept the feature branch without changing `feature_branch`.

Prefer a disposable worktree or temporary branch from `aftership_remote/target_branch`. Merge `feature_branch` with `--no-commit --no-ff`, record whether conflicts appear, then abort and remove the disposable state.

Use the result only to choose the PR path:

- No conflicts: create the PR from `fork_remote/feature_branch` into `aftership_remote/target_branch`.
- Conflicts: prepare `target_branch` on the fork, resolve there, then create the PR from `fork_remote/target_branch` into `aftership_remote/target_branch`.

## No-Conflict PR Flow

Use this path when the conflict check succeeds:

1. Stay on or return to `feature_branch`.
2. Ensure `feature_branch` has no uncommitted changes.
3. Push `feature_branch` to `fork_remote`.
4. If the push is rejected due to non-fast-forward history, stop and ask the user how to proceed. Do not force-push.
5. Create a PR with base `target_branch` on `aftership_remote` and head `feature_branch` on the fork.
6. Include the conflict-check result and verification result in the PR body.

## Conflict PR Flow

Use this path when merging `feature_branch` into the latest upstream target has conflicts:

1. Preserve `feature_branch`: ensure it is committed and pushed to `fork_remote`.
2. Do not merge `target_branch` into `feature_branch`.
3. Switch to local `target_branch`, or create it from `aftership_remote/target_branch` if it does not exist.
4. Fetch latest `aftership_remote/target_branch`.
5. Update local `target_branch` to latest upstream, preferably with a fast-forward update.
6. If local or fork `target_branch` is messy, divergent, or has large conflicts while updating from upstream, ask the user whether to delete local `target_branch` and the fork's `target_branch`, then recreate local `target_branch` from `aftership_remote/target_branch`.
7. Only after explicit approval, delete or recreate local/fork `target_branch`. Never delete `aftership_remote/target_branch`.
8. Merge `feature_branch` into local `target_branch`.
9. Resolve conflicts on local `target_branch`.
10. Run the available verification for that repository.
11. Push local `target_branch` to `fork_remote`.
12. If the push is rejected due to non-fast-forward history, stop and ask whether to delete or recreate the fork's `target_branch`. Do not force-push.
13. Create a PR with base `target_branch` on `aftership_remote` and head `target_branch` on the fork.
14. Mention in the PR body that this PR uses the fork target branch because direct feature-to-target merge had conflicts.

## Verification

Run the repo's normal available checks after preparing the branch that will be used as the PR head. Prefer existing scripts such as lint, test, typecheck, or build. If checks are unavailable or cannot run in the environment, state that clearly in the PR body and in the final summary.

## Multi-Repo Work

When one requirement spans multiple repositories, repeat the full workflow per repository. Do not infer that one repository is safe because another repository succeeded.

Finish with a per-repository summary containing:

- repository name and path
- `feature_branch`
- `target_branch`
- PR source and base
- conflict status
- verification result
- PR URL or blocker

Link related PRs in the PR body when the GitHub workflow or available context makes those URLs known.

## PR Body Checklist

Include:

- target branch and source branch
- whether conflict checking passed or required target-branch conflict resolution
- verification commands and results
- related PRs for other repositories when known
- any user-approved branch deletion or recreation, if it occurred
