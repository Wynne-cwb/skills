---
name: find-sent-email-record
description: Find real sent email records from Automizely/AfterShip message logs and extract or preview the HTML content that was actually sent. Use when a user asks to locate a sent email, inspect email delivery/message records, compare candidate emails, preview email HTML, or get the HTML source from a real outbound email record.
---

# Find Sent Email Record

Use this skill to locate real sent email records and retrieve the HTML body stored on the message record. Do not describe this as fetching an email template; the HTML comes from an actual outbound email/message record.

## Required Inputs

- `productCode` is required.
  - If missing, ask the user to choose one of:
    - Tracking (`productCode`: `email`)
    - Automizely Marketing (`productCode`: `conversions`)
  - When the user says Tracking, use `email`.
  - When the user says Automizely Marketing, use `conversions`.
  - If the user explicitly provides another product code, use it as-is.
  - Do not default `productCode`.
- `organizationId` is required. Ask for it if it is not present in the user request or surrounding context.
- `env` defaults to `production` when omitted.
  - Use `testing` only when the user explicitly asks for testing or the surrounding task context clearly requires it.
- `events` defaults to `delivered`.
  - Do not ask for this unless the user wants a different event filter.
  - The script sends this through the backend `filters` string, not as a GraphQL field argument.

## Optional Clues

Ask for these only when useful; do not block if the user does not know them:

- `toEmail`
- `fromEmail`
- `subject`
- `startTime` and `endTime`
  - When both are provided, the script also sends the SDUI-compatible fixed variable `time: [startTime, endTime]` alongside the explicit fields.
- message `id`
- `serviceCode`
- `status`
- `senderAccount`
- approximate send time or customer-facing context

If the user is unsure which record is correct, fetch a candidate list and generate the local preview page.

## Authentication

Use the `clime auth` CLI; never depend on `window.getAuth()` or browser DevTools.

1. Try the bundled script first. It calls:

   ```bash
   clime auth token -env <env>
   ```

2. If token retrieval fails, ask the user to log in or run:

   ```bash
   clime auth login -env <env> --open
   ```

3. Retry the bundled script after login.

Do not print, store, or include the token in output files.

## Query Workflow

1. Confirm required inputs: product area/`productCode` and `organizationId`.
2. Default `env` to `production` unless the user specified otherwise.
3. Collect optional clues if the user knows them.
4. Run `scripts/fetch-sent-email-record.mjs` with the known inputs.
5. Read the script output. It reports a `previewPath`, `metadataPath`, and per-candidate `htmlPath` values.
6. If multiple candidates are plausible, open the preview page in the user's browser and ask which candidate matches.
7. After the user chooses a candidate, return the chosen HTML file path or read the file and provide the source if they explicitly ask for inline source.

Prefer the Chrome plugin path for opening the local preview page when browser automation is needed, because this workspace prefers using the user's real Chrome profile first. Fall back to the in-app browser only if Chrome is unavailable or the user asks for it.

## Script

Run from the skill directory or pass the full script path:

```bash
node scripts/fetch-sent-email-record.mjs \
  --product-code email \
  --organization-id <organization-id> \
  --to-email user@example.com \
  --limit 20 \
  --json
```

Useful flags:

- `--env production|testing` defaults to `production`.
- `--events <value>` defaults to `delivered` and is merged into `filters` as `{ "events": "<value>" }`.
- `--product-code <code>` is required. Built-in choices are `email` for Tracking and `conversions` for Automizely Marketing.
- `--organization-id <id>` is required.
- `--to-email <email>`, `--from-email <email>`, `--subject <text>`, `--start-time <value>`, `--end-time <value>` filter the query.
  - With both time flags, the script automatically mirrors the SDUI request shape by adding `time: [startTime, endTime]` to GraphQL variables.
- `--message-id <id>`, `--service-code <code>`, `--status <value>`, `--sender-account <value>` pass additional backend filters.
- `--filters <json/string>` passes raw backend filters; JSON object filters are merged with the default `events` value when they do not already include `events`.
- `--limit <number>` defaults to `20`.
- `--output-dir <path>` controls where preview and HTML files are written.
- `--json` prints a machine-readable summary for agent use.

The script writes:

- `preview.html`: local UI for browsing candidates, switching rendered HTML/source, copying each record id, copying the selected HTML source, and moving between candidates with Up/Down arrow keys.
- `metadata.json`: candidate metadata; no auth token.
- `candidate-NNN.html`: raw HTML body for each candidate.

## Result Handling

- Call results "sent email records", "message records", or "outbound email records".
- Avoid saying the selected HTML is the source template unless the user has separately proven that the record came directly from an unchanged template.
- When there are zero results, suggest adding or relaxing filters: wider time range, no subject filter, no `toEmail`, or a larger `--limit`.
- When there are many similar candidates, guide selection by `createdAt`, `subject`, recipient, sender, `status`, `serviceCode`, and rendered preview.
