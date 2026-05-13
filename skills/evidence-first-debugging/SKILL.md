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
7. Validate write paths with write evidence. A read path that looks consistent with your hypothesis does not prove where data should be written. Reads may succeed through getters, fallbacks, proxies, prototype chains, lazy migration shims, or framework behavior that does not apply to writes. Before committing a write-path fix, find a working write call site, the deserialization/initialization path that proves where data lives at rest, or the persistence/save path that proves what the system later reads. If you only have read-path inference, label it as a current hypothesis.
8. Treat temporary instrumentation as a lifecycle, not a deliverable. Add it to collect evidence, use it to confirm or reject the hypothesis, then remove it after the issue is fixed or the user confirms the issue is fixed unless there is an explicit decision to keep it behind a safe debug gate.

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
- If the fix changes a write, mutation, or persistence path, do not ship based only on a matching read path. Require either a working write-path analog in the same codebase, or a runtime/integration check proving the written data is observable through the system's actual read, save, or downstream consumption path.
- If you added temporary instrumentation and the issue is later fixed or verified, remove the instrumentation before finishing unless the user explicitly wants to keep it. If kept, gate it, document why, and ensure it is safe for normal usage.

## Temporary Instrumentation

When adding logs, optimize for evidence that a later agent can consume without asking the user to manually summarize it. Temporary instrumentation is encouraged when it closes an evidence gap, but it must be scoped, behavior-preserving, and cleaned up.

Instrumentation must:

- Use a stable prefix or event name, such as `[checkout-debug]`.
- Include timestamp and a correlation id when available: request id, session id, trace id, job id, route, or component name.
- Capture branch decisions, input summary, output summary, validation results, stop/skip reasons, and error details.
- Avoid secrets, tokens, cookies, authorization headers, raw PII, and huge payloads.
- Prefer structured JSON or JSONL over prose.
- Be easy to remove, downgrade behind a debug flag, or keep only in local/dev paths after the issue is fixed.

Follow this lifecycle:

1. Add the smallest behavior-preserving instrumentation needed around the missing evidence.
2. Collect evidence through a reproduction.
3. Read and interpret the collected logs.
4. Use the evidence to confirm, reject, or revise the hypothesis.
5. Fix and verify the issue.
6. Remove the temporary instrumentation after verification or after the user confirms the issue is fixed. Keep it only if there is an intentional debug-only decision.

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

## Node.js Self-Closure

For Node.js, CLI, or server-side issues, close the evidence loop yourself whenever the user provides a reproducible command or the repo contains a runnable repro.

Use this flow:

1. Add temporary JSONL instrumentation.
2. Clear or rotate the old debug log so the next run is easy to inspect.
3. Run the repro command yourself, such as `curl`, an npm script, a CLI command, or a focused test.
4. Read the local log file yourself.
5. Update the evidence table before changing the fix direction.

Do not ask the user to paste logs that you can read directly. Ask for help only when the reproduction depends on user-only state, credentials, private browser session data, or an environment you cannot access.

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

## Browser Self-Closure

For browser-side issues, close the evidence loop yourself when a controllable browser session is available.

Preferred browser evidence order:

1. Controllable authenticated browser session. Example: in Codex, try the Codex Chrome Extension path first when the issue depends on the user's logged-in state, real account data, workspace data, embedded browser state, or production-like permissions.
2. Controllable non-authenticated browser session, such as an in-app browser or local Playwright browser, when authentication is irrelevant or easy to reproduce.
3. User-assisted reproduction with a copy-friendly debug buffer.
4. Static code inference only as supporting evidence.

Use this flow when the user provides a clear browser reproduction path, target URL, or an authenticated browser session the agent can operate:

1. Connect to the browser and confirm the target tab, URL, title, and login/session relevance.
2. Reproduce the user path.
3. Collect browser evidence: DOM snapshot, console logs, screenshot, iframe attributes/content when relevant, and key network/API signals.
4. If evidence is still incomplete, add minimal branch-level browser instrumentation.
5. Refresh or rerun the reproduction path.
6. Read the console/debug buffer and update the evidence table.
7. Fix the code.
8. Re-verify in the same browser session when possible.
9. Remove temporary instrumentation.
10. Run relevant type checks, tests, or lint checks.

Do not ask the user to copy DevTools logs when the agent can directly operate the relevant browser session and collect equivalent evidence. Ask for user help only when browser automation is unavailable, unsafe, blocked by CAPTCHA or permission prompts, or depends on private state the agent cannot access.

## Browser Evidence Checklist

Use more than one browser signal when the issue is non-trivial:

- **Browser tab/session**: URL, title, logged-in state, account/workspace relevance.
- **DOM snapshot**: key containers, rendered text, empty states, disabled controls, mounted/unmounted nodes.
- **Iframe evidence**: `src`, `srcdoc` length or content summary, sandbox attributes, visible content, relevant tokens/text.
- **Console/debug logs**: errors, warnings, lifecycle events, temporary debug events.
- **Screenshot**: visual state, iframe rendering, layout state, loading state.
- **Network/API**: request started, status, resolved/rejected result, response summary, cancellation/abort.
- **Local code path**: static inference only; use it to choose evidence points, not as standalone proof.

Do not collapse different browser facts into one conclusion. For example, "iframe exists", "iframe has expected `srcdoc`", and "iframe visually rendered expected content" are related but distinct evidence.

## Iframe And Sandbox Evidence

If browser automation cannot enter a cross-origin, out-of-process, or sandboxed iframe, do not remove sandboxing just to debug it.

Prefer behavior-preserving evidence:

- Outer iframe attributes: `src`, `srcdoc`, `sandbox`, size, visibility.
- `srcdoc` or URL content summary when accessible from the outer document.
- Screenshot evidence for visible rendering state.
- Console logs and network/API evidence around iframe construction.
- Parent component state and render lifecycle events.

Evidence from `srcdoc` plus a screenshot can be enough to prove rendered content for a user-visible bug. It does not necessarily prove that the agent can query or manipulate the iframe's internal DOM.

## Browser Instrumentation Events

For browser async or rendering issues, prefer branch-level lifecycle events over broad object dumps.

Useful event names include:

- `fetch-start`, `fetch-success`, `fetch-error`, `fetch-abort`, `fetch-cleanup`
- `effect-start`, `effect-cleanup`
- `render-start`, `render-empty`, `render-success`
- `iframe-srcdoc-built`, `iframe-rendered`
- `direct-content-group`, `fallback-content-group`

Record enough context to distinguish branches: input keys, route, ids, status, result length, abort reason, render mode, and whether the component was still mounted. Keep payloads summarized and copy-friendly.

For browser-side issues, if you cannot directly operate the user's authenticated browser state, ask the user to reproduce once after instrumentation. Give exact steps and a single copy command for the debug buffer. Keep missing browser evidence explicit; do not fill it with guesses.

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
- Whether the agent can self-run the reproduction and read the log, or whether the user must reproduce in the browser.
- The cleanup action taken after the fix, or the reason a debug-gated log remains.

For completed browser fixes, include a self-closure verification summary:

```text
自闭环验证:
- 浏览器会话:
- DOM/iframe 证据:
- console/network 证据:
- 截图证据:
- 本地命令:
- 临时 instrumentation 清理:
```

## Anti-Patterns

Avoid these:

- Declaring a root cause from code reading alone.
- Ignoring user-provided runtime evidence because the code "should" behave differently.
- Switching hypotheses after a user challenge without identifying the missing evidence.
- Adding broad noisy logs instead of targeted logs around the decision point.
- Logging raw secrets or large user payloads.
- Leaving temporary instrumentation in production paths without a debug gate or cleanup plan.
- Asking the user to paste Node.js, CLI, or server logs that the agent can read locally after running the provided reproduction command.
- Asking the user to copy browser logs when the agent can operate the relevant authenticated browser session and collect the same evidence directly.
- Finishing after the user says the issue is fixed while leaving temporary instrumentation in place without removing it or explicitly gating it.
- Inferring a write API from a read call site without checking sibling write handlers, mutation handlers, serializers, or save paths in the same module.
- Treating a mocked unit test as proof of business correctness. A mock confirming `obj.method()` was called proves the interaction happened, not that the method writes to the location the rest of the system reads from.
- Accepting a test that only verifies the local code path when the real contract is whether persisted or mutated state is observable from the actual downstream read path.
- Treating repeated browser logs as proof of slow network or backend failure. Repeated `start` events can also come from unstable React effect dependencies, inline objects/functions, component remounts, or cleanup/abort loops. Verify the `start`/`success`/`error`/`cleanup` lifecycle before choosing a fix.
