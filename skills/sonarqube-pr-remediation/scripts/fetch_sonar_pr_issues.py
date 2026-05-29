#!/usr/bin/env python3
"""Fetch SonarQube PR issues and Quality Gate status without leaking SONAR_TOKEN."""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any


DEFAULT_HOST = "https://sonar.aftership.org"
PAGE_SIZE = 500


class SonarError(RuntimeError):
    pass


def run_stdout(command: list[str], cwd: str | None = None) -> str:
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=10,
        )
    except (OSError, subprocess.SubprocessError):
        return ""
    if result.returncode != 0:
        return ""
    return result.stdout.strip()


def load_token() -> str:
    token = os.environ.get("SONAR_TOKEN", "").strip()
    if token:
        return token

    shell_checks = [
        ["zsh", "-c", 'source ~/.zshrc >/dev/null 2>&1; printf "%s" "$SONAR_TOKEN"'],
        [
            "bash",
            "-lc",
            'source ~/.bashrc >/dev/null 2>&1 || true; '
            'source ~/.bash_profile >/dev/null 2>&1 || true; '
            'printf "%s" "$SONAR_TOKEN"',
        ],
    ]
    for command in shell_checks:
        token = run_stdout(command).strip()
        if token:
            return token
    return ""


def parse_pr(value: str | None) -> str:
    if value:
        sonar_match = re.search(r"[?&]pullRequest=([^&#]+)", value)
        if sonar_match:
            return urllib.parse.unquote(sonar_match.group(1))
        github_match = re.search(r"/pull/(\d+)(?:[/?#].*)?$", value)
        if github_match:
            return github_match.group(1)
        if re.fullmatch(r"\d+", value):
            return value
        return value

    pr = run_stdout(["gh", "pr", "view", "--json", "number", "--jq", ".number"])
    if pr:
        return pr
    raise SonarError("Missing PR number. Pass --pr <number-or-url>.")


def parse_project(project: str | None, pr_value: str | None) -> str:
    if project:
        return project
    if pr_value:
        sonar_match = re.search(r"[?&]id=([^&#]+)", pr_value)
        if sonar_match:
            return urllib.parse.unquote(sonar_match.group(1))

    root = run_stdout(["git", "rev-parse", "--show-toplevel"])
    if root:
        return Path(root).name
    return Path.cwd().name


def auth_header(token: str) -> str:
    basic = base64.b64encode(f"{token}:".encode("utf-8")).decode("ascii")
    return f"Basic {basic}"


def request_json(host: str, token: str, path: str, params: dict[str, Any]) -> dict[str, Any]:
    url = host.rstrip("/") + path + "?" + urllib.parse.urlencode(params, doseq=True)
    request = urllib.request.Request(
        url,
        headers={
            "Authorization": auth_header(token),
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        if error.code in {401, 403}:
            raise SonarError(
                f"SonarQube returned HTTP {error.code}. Check SONAR_TOKEN access for this project."
            ) from error
        body = error.read().decode("utf-8", "replace")[:500]
        raise SonarError(f"SonarQube returned HTTP {error.code}: {body}") from error
    except urllib.error.URLError as error:
        raise SonarError(f"Could not reach SonarQube: {error.reason}") from error


def fetch_issues(host: str, token: str, project: str, pr: str, include_resolved: bool) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    page = 1
    while True:
        params: dict[str, Any] = {
            "componentKeys": project,
            "pullRequest": pr,
            "ps": PAGE_SIZE,
            "p": page,
            "additionalFields": "_all",
        }
        if not include_resolved:
            params["resolved"] = "false"
        payload = request_json(host, token, "/api/issues/search", params)
        batch = payload.get("issues") or []
        issues.extend(batch)
        paging = payload.get("paging") or {}
        total = int(paging.get("total", payload.get("total", len(issues))) or 0)
        if len(issues) >= total or not batch:
            return issues
        page += 1


def fetch_quality_gate(host: str, token: str, project: str, pr: str) -> dict[str, Any] | None:
    try:
        payload = request_json(
            host,
            token,
            "/api/qualitygates/project_status",
            {"projectKey": project, "pullRequest": pr},
        )
    except SonarError:
        return None
    return payload.get("projectStatus")


def normalize_issue(project: str, issue: dict[str, Any]) -> dict[str, Any]:
    component = issue.get("component") or ""
    prefix = f"{project}:"
    if component.startswith(prefix):
        component = component[len(prefix) :]
    return {
        "key": issue.get("key"),
        "type": issue.get("type"),
        "severity": issue.get("severity"),
        "rule": issue.get("rule"),
        "component": component,
        "line": issue.get("line"),
        "message": issue.get("message"),
        "effort": issue.get("effort"),
        "status": issue.get("status"),
        "resolution": issue.get("resolution"),
        "impacts": issue.get("impacts") or [],
        "cleanCodeAttribute": issue.get("cleanCodeAttribute"),
    }


def count_by(issues: list[dict[str, Any]], key: str) -> dict[str, int]:
    return dict(Counter(str(issue.get(key) or "UNKNOWN") for issue in issues))


def failing_conditions(quality_gate: dict[str, Any] | None) -> list[dict[str, Any]]:
    if not quality_gate:
        return []
    return [
        condition
        for condition in quality_gate.get("conditions", [])
        if condition.get("status") == "ERROR"
    ]


def issue_sort_key(issue: dict[str, Any]) -> tuple[int, int, str, int]:
    type_rank = {"BUG": 0, "VULNERABILITY": 1, "SECURITY_HOTSPOT": 2, "CODE_SMELL": 3}.get(
        issue.get("type"), 9
    )
    severity_rank = {"BLOCKER": 0, "CRITICAL": 1, "MAJOR": 2, "MINOR": 3, "INFO": 4}.get(
        issue.get("severity"), 9
    )
    return (
        type_rank,
        severity_rank,
        issue.get("component") or "",
        int(issue.get("line") or 0),
    )


def is_priority_issue(issue: dict[str, Any]) -> bool:
    return (
        issue.get("type") in {"BUG", "VULNERABILITY", "SECURITY_HOTSPOT"}
        or issue.get("severity") in {"BLOCKER", "CRITICAL", "MAJOR"}
    )


def scope_hint(quality_gate: dict[str, Any] | None, issues: list[dict[str, Any]]) -> str:
    failures = failing_conditions(quality_gate)
    if not failures:
        return "Quality Gate is not reporting failing conditions. If issues remain, fix only what the user requested."

    metrics = {str(condition.get("metricKey") or "") for condition in failures}
    hints: list[str] = []
    if any("bug" in metric or "reliability" in metric for metric in metrics):
        hints.append("fix Bug issues first")
    if any("vulnerab" in metric or "security" in metric for metric in metrics):
        hints.append("fix Vulnerability/Security issues first")
    if any("smell" in metric or "maintainability" in metric or "sqale" in metric for metric in metrics):
        hints.append("fix Major/Critical Code Smells first")
    if any("coverage" in metric for metric in metrics):
        hints.append("add focused tests for new code coverage")
    if any("duplicated" in metric or "duplication" in metric for metric in metrics):
        hints.append("remove new-code duplication narrowly")
    if not hints and issues:
        hints.append("start with Priority Issues below")
    return "; ".join(hints) or "Inspect failing Quality Gate metrics and repair the smallest related surface."


def issue_line(issue: dict[str, Any]) -> str:
    location = issue.get("component") or "<unknown>"
    if issue.get("line"):
        location += f":{issue['line']}"
    return (
        f"- `{issue.get('severity')}` `{issue.get('type')}` `{issue.get('rule')}` "
        f"{location} - {issue.get('message')}"
    )


def markdown_report(
    host: str,
    project: str,
    pr: str,
    issues: list[dict[str, Any]],
    quality_gate: dict[str, Any] | None,
    max_issues: int,
) -> str:
    dashboard = (
        f"{host.rstrip('/')}/dashboard?id={urllib.parse.quote(project)}"
        f"&pullRequest={urllib.parse.quote(pr)}"
    )
    lines = [
        f"# SonarQube PR {pr}",
        "",
        f"- Project: `{project}`",
        f"- Dashboard: {dashboard}",
        f"- Open issues returned: `{len(issues)}`",
    ]
    if quality_gate:
        lines.append(f"- Quality Gate: `{quality_gate.get('status', 'UNKNOWN')}`")
    lines.append(f"- Suggested repair focus: {scope_hint(quality_gate, issues)}")
    lines.append("")

    failures = failing_conditions(quality_gate)
    if failures:
        lines.append("## Failing Quality Gate Conditions")
        lines.append("")
        for condition in failures:
            metric = condition.get("metricKey")
            actual = condition.get("actualValue", "<missing>")
            threshold = condition.get("errorThreshold", "<missing>")
            comparator = condition.get("comparator", "")
            lines.append(f"- `{metric}`: actual `{actual}`, threshold `{comparator} {threshold}`")
        lines.append("")

    lines.append("## Summary")
    lines.append("")
    lines.append(f"- By type: `{json.dumps(count_by(issues, 'type'), sort_keys=True)}`")
    lines.append(f"- By severity: `{json.dumps(count_by(issues, 'severity'), sort_keys=True)}`")
    rule_counts = Counter(str(issue.get("rule") or "UNKNOWN") for issue in issues)
    top_rules = ", ".join(f"`{rule}` x{count}" for rule, count in rule_counts.most_common(10))
    lines.append(f"- Top rules: {top_rules or '`none`'}")
    lines.append("")

    priority = [issue for issue in sorted(issues, key=issue_sort_key) if is_priority_issue(issue)]
    if priority:
        lines.append("## Priority Issues")
        lines.append("")
        for issue in priority:
            lines.append(issue_line(issue))
        lines.append("")

    if max_issues != 0:
        lines.append("## Issues")
        lines.append("")
        shown = sorted(issues, key=issue_sort_key)
        if max_issues > 0:
            shown = shown[:max_issues]
        for issue in shown:
            lines.append(issue_line(issue))
        if max_issues > 0 and len(issues) > max_issues:
            lines.append(f"- ... {len(issues) - max_issues} more not shown")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default=os.environ.get("SONAR_HOST_URL", DEFAULT_HOST))
    parser.add_argument("--project", help="SonarQube project key")
    parser.add_argument("--pr", help="PR number, GitHub PR URL, or Sonar dashboard URL")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    parser.add_argument("--max-issues", type=int, default=120, help="Markdown issue row limit; 0 shows summary only")
    parser.add_argument("--include-resolved", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    token = load_token()
    if not token:
        print(
            "SONAR_TOKEN is not available. Create one at "
            "https://sonar.aftership.org/account/security, then export it locally.",
            file=sys.stderr,
        )
        return 2

    try:
        pr = parse_pr(args.pr)
        project = parse_project(args.project, args.pr)
        raw_issues = fetch_issues(args.host, token, project, pr, args.include_resolved)
        issues = [normalize_issue(project, issue) for issue in raw_issues]
        quality_gate = fetch_quality_gate(args.host, token, project, pr)
    except SonarError as error:
        print(str(error), file=sys.stderr)
        return 1

    if args.format == "json":
        print(
            json.dumps(
                {
                    "host": args.host.rstrip("/"),
                    "project": project,
                    "pr": pr,
                    "qualityGate": quality_gate,
                    "failingConditions": failing_conditions(quality_gate),
                    "suggestedRepairFocus": scope_hint(quality_gate, issues),
                    "total": len(issues),
                    "byType": count_by(issues, "type"),
                    "bySeverity": count_by(issues, "severity"),
                    "byRule": count_by(issues, "rule"),
                    "priorityIssues": [issue for issue in sorted(issues, key=issue_sort_key) if is_priority_issue(issue)],
                    "issues": sorted(issues, key=issue_sort_key),
                },
                ensure_ascii=False,
                indent=2,
            )
        )
    else:
        print(markdown_report(args.host, project, pr, issues, quality_gate, args.max_issues))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

