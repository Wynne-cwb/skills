---
name: app-center-cicd-debug
description: Debug AfterShip App Center and Clime CI/CD failures with evidence-first metadata and log analysis. Use when a user provides or asks about CI failed, CD failed, artifact failed, App Center, Clime, Tekton, publish failed, release failed, build log analysis, artifact id, build id, event id, CI name, repository name, PR build failure, deployment failure, or GCP/Tekton/Docker logs.
---

# App Center CI/CD Debug

## Overview

Use this skill to investigate App Center CI/CD build, artifact, publish, and release failures without jumping straight to code changes. Start from Clime/App Center metadata and raw logs, distinguish artifact ids from build/event ids, then classify the failure layer before recommending the next step.

For command details, field mappings, and examples, read `references/clime-app-center.md` when you need copy-paste commands, CD/publish lookups, artifact field interpretation, or the 8568/8572 reference case.

## Core Rules

1. Collect evidence before proposing a root cause. Prefer App Center artifact metadata, CI config, publish records, and raw logs over guesses.
2. Use read-only `clime app-center` commands first. Do not edit repository code until the logs show a repo-owned command failed or the user explicitly asks for code investigation.
3. Do not treat an artifact id as a build id. Track `id`, `event_id`, `build_id`, `image_tag`, `build_url`, and `log_url` separately.
4. Quote evidence in the final diagnosis: metadata fields, failed step, key log lines, command output, and exit code.
5. Classify the failure at the layer where the first meaningful failure appears, not where the pipeline eventually reports failure.
6. If the logs have not reached a repo-owned command such as `yarn build:sdk`, `npm test`, `tsc`, or `eslint`, do not blame repository code.
7. Treat shared Dockerfile, base image, tool installation, cloud service, permission, auth, and transient network failures as infra/pipeline candidates until evidence says otherwise.
8. Keep secrets out of chat and logs. Do not print tokens, cookies, SSH keys, service account credentials, or authorization headers.

## Safety Gate

These commands create new work or mutate App Center state. Do not run them unless the user explicitly asks for the action and confirms the target:

```bash
clime app-center ci trigger ...
clime app-center publish trigger ...
clime app-center artifact transform ...
```

When unsure whether a command is read-only, inspect help text first or ask the user before running it.

## Workflow

1. Normalize the input.
   - Extract repository name, CI name, artifact id, event/build id, app name, environment, PR URL, branch, commit, and pasted log snippets.
   - If the user only says CI/CD failed, ask for the smallest missing handle: repo/CI name, artifact id, build URL, log URL, PR, or pasted failure lines.

2. Confirm Clime availability and auth.
   - Run `command -v clime`.
   - Run `clime app-center auth status --output json`.
   - If auth is missing or expired, ask the user to run `clime app-center auth login`; do not guess from stale local state.

3. Gather CI and artifact evidence.
   - Query CI config by repository name or CI id/name.
   - Query artifact records by CI name and repository name, then fetch the specific artifact when an id is known.
   - Preserve the raw JSON or summarize the important fields before moving to root-cause analysis.

4. Gather publish or release evidence when the failure is CD-side.
   - Query CD apps, environments, publish records, and publish details for the application and environment.
   - Distinguish CI artifact failure from publish/deploy failure.

5. Inspect logs.
   - Prefer `log_url` and `build_url` from artifact or publish metadata.
   - Identify the earliest failing step, command, error text, retry pattern, and exit code.
   - Compare adjacent successful and failed artifacts when available; a same branch/commit/package retry that succeeds is strong evidence for infra or network flake.

6. Classify the failure.
   - CI metadata/auth/permission
   - source checkout, Git, or SSH key
   - dependency install
   - Docker/base image/shared pipeline
   - external network dependency
   - repo-owned build command
   - test, lint, typecheck
   - publish/deploy
   - artifact transform

7. Decide whether code investigation is justified.
   - Investigate repository code only after logs show a repo-owned command failed or metadata points to a repo-owned config issue.
   - If the failure is infra/pipeline/network, recommend retry, pipeline owner follow-up, mirror/cache hardening, or dependency source stabilization instead of code edits.

## Output Format

End each investigation with this concise structure:

```text
结论：
- ...

证据：
- Artifact: <id>
- Event/build id: <uuid>
- Status: <success/failure>
- Branch/commit: ...
- Failed step: ...
- Key log lines: ...

归类：
- infra/pipeline/network 或 repo code 或 publish/deploy 等

建议下一步：
- ...
```

If evidence is incomplete, say exactly what is missing and give the next read-only command or artifact needed.

## Reference Loading

Read `references/clime-app-center.md` when you need:

- exact Clime command examples for CI, artifact, CD, env, or publish lookup
- artifact field definitions and id mapping
- dangerous command guardrails
- failure classification details
- the 8568 vs 8572 infra/network example
- the repo-code example involving `yarn build:sdk`, Rollup, and SDK entry points
