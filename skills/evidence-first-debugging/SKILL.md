---
name: evidence-first-debugging
description: Use when diagnosing unexpected behavior, failed workflows, bugs, browser or Node.js runtime issues, logs, traces, or when preparing a root-cause hypothesis. 诊断异常、定位 bug、判断修复方向时使用：先建立证据表，区分运行时事实和代码推断，避免多层猜测；证据不足时添加 copy-friendly 浏览器日志或本地 Node.js JSONL 日志。
---

# Evidence-First Debugging

Use this skill when the user asks why something did not behave as expected, why a flow failed or stopped, whether a suspected cause is valid, or when you are about to write a root-cause hypothesis.

## Core Rules

1. Build the evidence chain before proposing a root cause.
2. Runtime evidence beats static code inference. Static code shows what could happen; logs, traces, network data, screenshots, or reproducible output show what did happen.
3. Keep speculation to one step. Do not chain "maybe A, therefore maybe B, therefore root cause C".
4. If the user challenges your hypothesis, look for missing evidence first instead of immediately switching to another hypothesis.
5. If evidence is insufficient, say so plainly and add the smallest useful temporary instrumentation before changing business logic.
6. Do not use strong wording such as "confirmed", "locked", "definitive", or "closed evidence chain" unless the key runtime evidence has been checked.

## Evidence Table

Before giving a diagnosis, create or mentally maintain an evidence table. Show it to the user when the issue is non-trivial or when evidence is incomplete.

```text
Evidence source | Checked? | Type | What it proves | Strength
User repro steps | yes/no | runtime artifact | ... | weak/medium/strong
Browser console/network/DOM | yes/no | runtime | ... | weak/medium/strong
Node.js/server log | yes/no | runtime | ... | weak/medium/strong
CLI/test/CI output | yes/no | runtime | ... | weak/medium/strong
Relevant code path | yes/no | static inference | ... | weak/medium/strong
```

Use these levels:

- **Confirmed fact**: directly observed in runtime evidence or reproduced.
- **Strong inference**: multiple evidence sources agree, but one direct signal is missing.
- **Current hypothesis**: plausible from available evidence, but still needs validation.
- **Unverified assumption**: do not use as the basis for a fix.

## Fix Gate

Before changing product logic, check whether the evidence supports the direction:

- If a key runtime source is unchecked, prefer instrumentation over a speculative fix.
- If only static code reading supports the hypothesis, label it as a hypothesis.
- If the issue can be reproduced locally, reproduce it and capture output before editing.
- If the issue cannot be reproduced, add temporary logs that the agent or user can retrieve after one reproduction.

## Temporary Instrumentation

When adding logs, optimize for evidence that a later agent can consume without asking the user to manually summarize it.

Instrumentation must:

- Use a stable prefix or event name, such as `[checkout-debug]`.
- Include timestamp and a correlation id when available: request id, session id, trace id, job id, route, or component name.
- Capture branch decisions, input summary, output summary, validation results, stop/skip reasons, and error details.
- Avoid secrets, tokens, cookies, authorization headers, raw PII, and huge payloads.
- Prefer structured JSON or JSONL over prose.
- Be easy to remove, downgrade behind a debug flag, or keep only in local/dev paths after the issue is fixed.

## Node.js Logging Pattern

For Node.js services, prefer appending JSONL to a local file that the agent can read later. Do not rely only on stdout or terminal scrollback.

Prefer the project's existing logger and debug-log location if one exists. Otherwise use a temporary file such as `/tmp/<project-or-feature>-debug.jsonl` or a gitignored project path such as `.debug/<feature>.jsonl`.

```ts
import fs from "node:fs";

const DEBUG_LOG_PATH =
  process.env.FEATURE_DEBUG_LOG || "/tmp/feature-debug.jsonl";

function summarizeDebugValue(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return { unserializable: true, type: typeof value };
  }
}

export function debugEvent(event: string, payload: Record<string, unknown>) {
  const record = {
    ts: new Date().toISOString(),
    event,
    ...Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        summarizeDebugValue(value),
      ]),
    ),
  };

  fs.appendFileSync(DEBUG_LOG_PATH, JSON.stringify(record) + "\n");
}
```

Good places to log:

- External input boundary: request payload summary, job input, tool input, or message metadata.
- Before and after important branch decisions.
- Schema parse, validation, permission, feature flag, or route matching results.
- Before and after calls to external services, providers, databases, queues, or tools.
- Early return, short-circuit, skip, retry, fallback, or error paths.

Do not import `node:fs` into browser bundles. Node.js file logging belongs only in server-side or CLI code.

## Browser Logging Pattern

For browser issues, make logs copy-friendly. Avoid logging only object references because DevTools may show live objects whose contents change later, and copying object entries can be incomplete or inconvenient.

Prefer a stable JSON string plus an in-memory debug buffer:

```ts
type BrowserDebugRecord = {
  ts: string;
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    __featureDebugEvents?: BrowserDebugRecord[];
  }
}

function toDebugSnapshot(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return { unserializable: true, type: typeof value };
  }
}

export function debugBrowserEvent(
  event: string,
  payload: Record<string, unknown> = {},
) {
  const record: BrowserDebugRecord = {
    ts: new Date().toISOString(),
    event,
    ...Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        toDebugSnapshot(value),
      ]),
    ),
  };

  window.__featureDebugEvents ||= [];
  window.__featureDebugEvents.push(record);
  window.__featureDebugEvents = window.__featureDebugEvents.slice(-100);

  console.debug("[feature-debug]", JSON.stringify(record));
}
```

When asking the user to share browser evidence, give a single copy command:

```js
copy(JSON.stringify(window.__featureDebugEvents || [], null, 2))
```

Good browser evidence includes:

- Console errors and debug events.
- Network request URL, method, status, request summary, and response summary.
- Actual DOM/UI state after the action.
- Whether event handlers, effects, callbacks, route changes, or async completions ran.
- Browser screenshots only when visual state matters.

## Privacy And Payload Safety

Log summaries, not secrets. Prefer these safe forms:

- `hasAuthorizationHeader: true`, never the header value.
- `emailHash` or `emailDomain`, not raw email unless essential and approved.
- `payloadKeys`, `arrayLength`, `status`, `errorName`, `errorMessage`, `route`, `featureFlagValue`.
- Truncated strings and sampled arrays when payloads are large.

If sensitive data is unavoidable for diagnosis, ask the user before logging it and explain why.

## Output Format

For diagnosis responses, use this shape when the issue is more than trivial:

```text
已确认事实:
...

代码推断:
...

当前假设:
...

缺失证据:
...

下一步:
...
```

If you added instrumentation, include:

- Where the log is written or how to copy it.
- What action the user should reproduce.
- What evidence you expect the log to confirm or rule out.
- A reminder that the temporary log should be removed, gated, or downgraded after diagnosis.

## Anti-Patterns

Avoid these:

- Declaring a root cause from code reading alone.
- Ignoring user-provided runtime evidence because the code "should" behave differently.
- Switching hypotheses after a user challenge without identifying the missing evidence.
- Adding broad noisy logs instead of targeted logs around the decision point.
- Logging raw secrets or large user payloads.
- Leaving temporary instrumentation in production paths without a debug gate or cleanup plan.
