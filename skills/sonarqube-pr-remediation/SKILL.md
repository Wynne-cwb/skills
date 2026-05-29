---
name: sonarqube-pr-remediation
description: Inspect and fix self-hosted SonarQube pull request failures. Use when the user asks to read, summarize, debug, or fix Sonar/SonarQube PR issues, Quality Gate failures, failed Sonar bot comments, New Bugs, New Vulnerabilities, New Code Smells, coverage or duplication gate failures, especially for AfterShip Sonar at sonar.aftership.org where SONAR_TOKEN may need to be created and stored in shell startup files.
---

# SonarQube PR Remediation

Use this skill to fetch the current SonarQube PR state from the Web API, help the user choose a repair scope, fix the selected issues, and return a review-ready summary.

## Core Rules

1. Treat SonarQube Web API data as current truth. GitHub bot comments can be stale.
2. Never ask the user to paste `SONAR_TOKEN` into chat.
3. Never print, echo, commit, or log `SONAR_TOKEN`.
4. Prefer the bundled script over hand-written `curl`; it handles token loading, pagination, Quality Gate status, and summaries.
5. Default to fixing only the Quality Gate failure path unless the user explicitly asks to fix all open issues.
6. Keep the fix narrow. Do not refactor unrelated legacy code just because Sonar reports nearby smells.
7. After fixing, fetch Sonar data again and compare before/after when possible.

## Token Bootstrap

First check whether a token is available:

```bash
python3 <skill-dir>/scripts/fetch_sonar_pr_issues.py --pr <pr> --max-issues 0
```

If `SONAR_TOKEN` is missing, tell the user to create one at:

https://sonar.aftership.org/account/security

Then give them this local command. It reads the token silently and writes a managed block into `~/.zshrc` without putting the token in shell history:

```zsh
zsh <skill-dir>/scripts/bootstrap_sonar_token.zsh
```

If they prefer a pasteable one-liner, give this:

```zsh
read -rs "SONAR_TOKEN?Paste Sonar token: "; echo; touch ~/.zshrc; tmp="$(mktemp)"; awk 'BEGIN{skip=0} /# >>> sonar.aftership.org >>>/{skip=1; next} /# <<< sonar.aftership.org <<</{skip=0; next} !skip{print}' ~/.zshrc > "$tmp"; { cat "$tmp"; echo '# >>> sonar.aftership.org >>>'; echo 'export SONAR_HOST_URL="https://sonar.aftership.org"'; printf 'export SONAR_TOKEN=%q\n' "$SONAR_TOKEN"; echo '# <<< sonar.aftership.org <<<'; } > ~/.zshrc; rm -f "$tmp"; unset SONAR_TOKEN; source ~/.zshrc
```

Do not run these commands yourself unless the user explicitly asks; token creation is user-local.

## Fetch Current Sonar State

Run from the repository being inspected when possible:

```bash
python3 <skill-dir>/scripts/fetch_sonar_pr_issues.py \
  --project <sonar-project-key> \
  --pr <pr-number-or-url>
```

For machine-readable output and before/after comparison:

```bash
python3 <skill-dir>/scripts/fetch_sonar_pr_issues.py \
  --project <sonar-project-key> \
  --pr <pr-number-or-url> \
  --format json > /tmp/sonar-pr-before.json
```

Useful flags:

- `--host`: defaults to `$SONAR_HOST_URL`, then `https://sonar.aftership.org`
- `--project`: Sonar project key; inferred from a Sonar URL or Git repo root directory when omitted
- `--pr`: PR number, GitHub PR URL, or Sonar dashboard URL
- `--format markdown|json`: default `markdown`
- `--max-issues`: Markdown issue row limit; use `0` for summary only
- `--include-resolved`: include resolved issues for historical comparison

## Scope Decision

After reading Sonar, summarize the Quality Gate status and ask the user to choose a repair scope unless they already made it clear:

- `Gate only` (recommended): fix the issues or metrics causing `Quality Gate: ERROR`.
- `All open issues`: fix every unresolved issue returned for the PR.

For `Gate only`, map failing gate conditions to the smallest repair target:

- `new_bugs`, reliability rating, or Bug count: fix Bug issues first.
- `new_vulnerabilities`, security rating, or hotspot/security conditions: fix Vulnerability/Security issues first.
- `new_code_smells`, maintainability rating, or debt conditions: fix Major/Critical Code Smells first, then enough remaining smells to pass.
- coverage conditions: add or adjust focused tests for new code.
- duplication conditions: remove new-code duplication with the smallest shared helper or branch simplification.

If the issue list is empty but the gate fails, inspect `qualityGate.conditions`; the failure may be coverage, duplication, or a stale analysis edge case.

## Repair Workflow

1. Save or keep the initial Sonar output.
2. Identify the smallest files and rules needed for the selected scope.
3. Check the repository for GSD support:
   - `.planning/`
   - `.gsd/`
   - `gsd` on `PATH`
   - package, make, or script entries that obviously run GSD
4. If GSD is installed, use GSD quick for the repair and include the Sonar summary as the task context.
5. If GSD is not installed, repair directly as the agent.
6. Run the repo's focused tests, lint, typecheck, or build commands that match the touched files.
7. Fetch Sonar again if credentials and network allow it.
8. Finish with a review summary:
   - selected scope
   - Quality Gate status before/after
   - issues fixed or remaining
   - files changed
   - verification run and result

## Failure Handling

- `SONAR_TOKEN is not available`: direct the user to create a token locally; do not ask for it in chat.
- `401` / `403`: token is missing, expired, or lacks project access.
- project not found or empty results: ask for the Sonar dashboard URL or explicit `--project`.
- GitHub Actions only says `QUALITY GATE STATUS: FAILED`: expected; use Sonar API for details.
- GitHub bot comment differs from the API: call out that the bot comment may be stale.
- Sonar remains failing after code fixes: fetch `project_status` again and work from the remaining failing conditions, not assumptions.
