# Clime App Center Reference

Use this reference for copy-paste Clime commands, field interpretation, failure classification, and examples while debugging App Center CI/CD failures.

## Contents

- [Auth and Availability](#auth-and-availability)
- [CI Config Lookup](#ci-config-lookup)
- [Artifact Lookup](#artifact-lookup)
- [CD and Publish Lookup](#cd-and-publish-lookup)
- [Dangerous Commands](#dangerous-commands)
- [Failure Classification](#failure-classification)
- [Example: Artifact 8568 vs 8572](#example-artifact-8568-vs-8572)
- [Example: Repo-Owned Build Failure](#example-repo-owned-build-failure)

## Auth and Availability

Start with read-only checks:

```bash
command -v clime
clime app-center auth status --output json
```

If not logged in, ask the user to run:

```bash
clime app-center auth login
```

Do not ask the user to paste credentials into chat.

## CI Config Lookup

List CI configs for a repository:

```bash
clime app-center ci list \
  --repository-name <repo> \
  --output json \
  --limit 20
```

Fetch a CI config:

```bash
clime app-center ci get <ci-id> \
  --output json
```

Record these fields when present:

- `id`
- `name`
- `repo_name`
- `build_type`
- `node_version`
- `package_manage_tool`
- `build_src_dir`
- `pre_build_script`
- `pre_deploy_script`
- `additional_dependencies_script`

Use the CI config to understand what the pipeline intended to run. Do not infer that the repo code failed until logs show the pipeline reached a repo-owned command.

## Artifact Lookup

List recent artifacts:

```bash
clime app-center artifact list \
  --ci-name <ci-name> \
  --repository-name <repo> \
  --output json \
  --limit 20
```

Fetch a specific artifact:

```bash
clime app-center artifact get <artifact-id> \
  --ci-name <ci-name> \
  --output json
```

Preserve these fields separately:

- `id`: App Center artifact record id. This is not the build id.
- `event_id`: Tekton/App Center event id.
- `build_id`: Usually equal to `event_id`.
- `image_tag`: Often equal to `event_id` or `build_id`.
- `build_url`: Tekton dashboard URL.
- `log_url`: GCP logs URL.
- `github_commit_id`
- `github_branch`
- `status`
- `packages`

Important: never substitute a neighboring artifact's `event_id` or `build_id` for the artifact currently being diagnosed. If comparing retry attempts, label each artifact and build id explicitly.

Useful capture pattern:

```bash
clime app-center artifact get <artifact-id> \
  --ci-name <ci-name> \
  --output json | tee /tmp/app-center-artifact-<artifact-id>.json
```

## CD and Publish Lookup

List CD apps:

```bash
clime app-center cd list \
  --search <repo-or-app> \
  --output json
```

List environments:

```bash
clime app-center env list \
  --application-name <app-name> \
  --output json
```

List publish records:

```bash
clime app-center publish list \
  --application-name <app-name> \
  --env-name <env> \
  --output json
```

Fetch a publish record:

```bash
clime app-center publish get <publish-id> \
  --application-name <app-name> \
  --output json
```

Use CD and publish records when the reported failure is release, publish, deploy, environment, or rollout related. Keep CI artifact failure and publish/deploy failure separate in the conclusion.

## Dangerous Commands

These commands create work or mutate App Center state. Run them only when the user explicitly requests the action and confirms the target:

```bash
clime app-center ci trigger ...
clime app-center publish trigger ...
clime app-center artifact transform ...
```

Before running any unfamiliar `clime app-center` subcommand, inspect help text or ask whether it is safe:

```bash
clime app-center <subcommand> --help
```

## Failure Classification

Classify by the first meaningful failure in the metadata and logs:

- `CI metadata/auth/permission`: auth expired, forbidden, missing project access, invalid CI config, missing app or repo mapping.
- `source checkout/git/SSH`: checkout fails, branch not found, submodule failure, SSH key or GitHub permission issue.
- `dependency install`: package manager install fails inside the project dependency step.
- `Docker/base image/shared pipeline`: base image pull/build fails, shared Dockerfile step fails, tool installation fails before repo-owned commands.
- `external network dependency`: repeated timeout, DNS, 5xx, TLS, download, registry, or GitHub release asset errors.
- `repo-owned build command`: `yarn build:sdk`, `npm run build`, `pnpm build`, `make build`, or equivalent project script fails.
- `test/lint/typecheck`: `jest`, `vitest`, `tsc`, `eslint`, type checks, or test suites fail.
- `publish/deploy`: publish record fails after a valid artifact exists, deployment command fails, environment or release record reports failure.
- `artifact transform`: transform command or transform record fails after build artifacts exist.

Decision rules:

- If logs have not reached `RUN ... yarn build:sdk`, `npm test`, `tsc`, `eslint`, or another repo-owned command, do not blame repo code.
- If a shared Dockerfile/base image/tool install step fails, classify as infra/pipeline/network unless logs prove project code caused it.
- If a same branch/commit/package retry succeeds, that supports a transient infra or external dependency classification.
- If the repo-owned command fails, inspect the repository at the failing branch/commit before proposing a fix.
- Always include the failed step, key log lines, and exit code in the conclusion.

## Example: Artifact 8568 vs 8572

Use this as a reference example, not as a hardcoded rule.

Artifact `8568`:

- `status`: failure
- `event_id` / `build_id` / `image_tag`: `8f944291-80e7-47b4-a308-5a0a800d510e`
- branch: `feat/affiliate-simple-editor`
- commit: `c2b284ad...`
- root cause: Docker build step tried to install `jq`
- command:

```bash
wget -O /usr/local/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
```

- redirect target: `https://github.com/jqlang/jq/releases/download/jq-1.6/jq-linux64`
- repeated `504 Gateway Time-out` for 20 attempts
- final error: `exit code: 4`, `Build image failure`
- important attribution: the pipeline did not reach `yarn build:sdk`, so this is not a repo code failure.

Artifact `8572`:

- `status`: success
- `event_id` / `build_id` / `image_tag`: `f0ddcd80-e071-4978-a68d-882063c7d824`
- same branch, commit, and package as artifact `8568`
- supports classification of `8568` as an infra/network flake because retry succeeded without a code change.

When using this comparison, say both ids clearly. Artifact `8572`'s build id is not artifact `8568`'s build id.

## Example: Repo-Owned Build Failure

If the build reaches `yarn build:sdk` and Rollup cannot resolve remote-style imports such as `adminMarketingBasic/basicHooks`, then switch to repository code investigation.

In the Email case, inspect SDK entry points such as `src/server.ts` for accidental exports or imports that pull browser or module-federation-only APIs into SDK bundles. The concrete fix was to remove Content Group browser API exports such as `useCreateEmailContentGroup` and `EmailContentGroupPreviewer` from the server SDK entry and keep them in the module federation facade, for example `src/mfExports/email.ts`.

Use this as a pattern for attribution:

- Evidence that justifies code investigation: `yarn build:sdk` ran and Rollup failed inside the repo build command.
- Suspect boundary: SDK/server entry points importing or exporting browser/MF-only modules.
- Fix direction: keep SDK/server exports server-safe; keep browser/MF APIs in the MF facade.
