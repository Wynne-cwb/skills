#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const QUERY = `query EmailsMessages($productCode: String, $organizationId: String, $cursor: String, $toEmail: String, $startTime: String, $endTime: String, $filters: String, $fromEmail: String, $serviceCode: String, $limit: Int, $id: String, $senderAccount: String, $status: String, $subject: String, $type: String, $unsubscribeType: String, $tryCount: String) {
  messagesEmailsMessages(
    productCode: $productCode
    organizationId: $organizationId
    toEmail: $toEmail
    cursor: $cursor
    startTime: $startTime
    endTime: $endTime
    filters: $filters
    fromEmail: $fromEmail
    serviceCode: $serviceCode
    limit: $limit
    id: $id
    senderAccount: $senderAccount
    status: $status
    subject: $subject
    type: $type
    unsubscribeType: $unsubscribeType
    tryCount: $tryCount
  ) {
    pagination {
      hasNextPage
      nextCursor
      total
      limit
    }
    messages {
      accountType
      attachments
      batchId
      blockedCount
      canceled
      categories
      contents {
        type
        value
      }
      createdAt
      customArgs {
        appEnv
        domainFreeStatus
        domainVerifiedStatus
        groupId
        messageId
        sendgridAccountId
      }
      enableGzipPayload
      failedCount
      from {
        email
        name
      }
      groupId
      groupStatus
      id
      organization {
        id
      }
      personalizations {
        createdAt
        id
        limitTryCount
        sendTime
        status
        substitutions {
          messagesPlatformUnsubscribeLink
        }
        to {
          email
          name
        }
        tryCount
        updatedAt
      }
      productCode
      replyTo {
        email
        name
      }
      riskControl
      scheduleEndTime
      senderAccount {
        username
      }
      senderIp
      sendgridUsername
      serviceCode
      status
      subject
      subjectSubstitutions
      successCount
      templateId
      totalCount
      tryCount
      unsubscribe {
        type
      }
      updatedAt
      weight
    }
  }
}`;

function usage() {
  return `Usage:
  node fetch-sent-email-record.mjs --product-code <code> --organization-id <id> [filters]

Required:
  --product-code <code>       Product code. Built-in choices: email (Tracking), conversions (Automizely Marketing).
  --organization-id <id>      Organization id.

Options:
  --env <production|testing>  Defaults to production.
  --to-email <email>
  --from-email <email>
  --subject <text>
  --start-time <value>
  --end-time <value>
  --message-id <id>
  --service-code <code>
  --sender-account <value>
  --status <value>
  --events <value>            Defaults to delivered.
  --type <value>
  --unsubscribe-type <value>
  --try-count <value>
  --cursor <value>
  --filters <json/string>     Raw backend filters string. JSON objects are merged with the default events filter.
  --limit <number>            Defaults to 20.
  --output-dir <path>         Defaults to a temporary directory.
  --json                      Print machine-readable output.
  --help`;
}

function parseArgs(argv) {
  const args = {
    env: "production",
    events: "delivered",
    limit: 20,
    json: false,
  };

  const alias = {
    "--productCode": "productCode",
    "--product-code": "productCode",
    "--organizationId": "organizationId",
    "--organization-id": "organizationId",
    "--toEmail": "toEmail",
    "--to-email": "toEmail",
    "--fromEmail": "fromEmail",
    "--from-email": "fromEmail",
    "--startTime": "startTime",
    "--start-time": "startTime",
    "--endTime": "endTime",
    "--end-time": "endTime",
    "--messageId": "id",
    "--message-id": "id",
    "--id": "id",
    "--serviceCode": "serviceCode",
    "--service-code": "serviceCode",
    "--senderAccount": "senderAccount",
    "--sender-account": "senderAccount",
    "--unsubscribeType": "unsubscribeType",
    "--unsubscribe-type": "unsubscribeType",
    "--tryCount": "tryCount",
    "--try-count": "tryCount",
    "--outputDir": "outputDir",
    "--output-dir": "outputDir",
    "--subject": "subject",
    "--status": "status",
    "--events": "events",
    "--type": "type",
    "--cursor": "cursor",
    "--filters": "filters",
    "--limit": "limit",
    "--env": "env",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (arg === "--json") {
      args.json = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${arg}`);
    }

    const [flag, inlineValue] = arg.split("=", 2);
    const key = alias[flag];
    if (!key) {
      throw new Error(`Unknown flag: ${flag}`);
    }

    let value = inlineValue;
    if (value === undefined) {
      i += 1;
      value = argv[i];
    }
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}`);
    }

    args[key] = value;
  }

  args.limit = Number.parseInt(String(args.limit), 10);
  if (!Number.isFinite(args.limit) || args.limit <= 0) {
    throw new Error("--limit must be a positive integer");
  }

  return args;
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} is required`);
  }
  return value.trim();
}

function getAuthToken(env) {
  const result = spawnSync("clime", ["auth", "token", "-env", env], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    const details = result.stderr?.trim() || result.stdout?.trim() || "unknown error";
    throw new Error(
      `Unable to get auth token for ${env}. Run: clime auth login -env ${env} --open\n${details}`,
    );
  }

  const token = result.stdout.trim();
  if (!token) {
    throw new Error(`clime auth token returned an empty token for ${env}`);
  }

  return token;
}

function compactObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== ""),
  );
}

function buildFilters(rawFilters, events) {
  if (!rawFilters) {
    return events ? JSON.stringify({ events }) : undefined;
  }

  try {
    const parsed = JSON.parse(rawFilters);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return JSON.stringify({
        ...parsed,
        ...(events && parsed.events === undefined ? { events } : {}),
      });
    }
  } catch {
    // Keep non-JSON filters untouched; the backend accepts this as an opaque string.
  }

  return rawFilters;
}

function endpointForEnv(env) {
  return `https://api.automizely.${env === "testing" ? "me" : "org"}/gql-router/graphql`;
}

function refererForEnv(env) {
  return `https://sdui.automizely.${env === "testing" ? "me" : "org"}/`;
}

async function fetchRecords(args, token) {
  const filters = buildFilters(args.filters, args.events);
  const variables = compactObject({
    productCode: args.productCode,
    organizationId: args.organizationId,
    cursor: args.cursor,
    toEmail: args.toEmail,
    startTime: args.startTime,
    endTime: args.endTime,
    filters,
    fromEmail: args.fromEmail,
    serviceCode: args.serviceCode,
    limit: args.limit,
    id: args.id,
    senderAccount: args.senderAccount,
    status: args.status,
    subject: args.subject,
    type: args.type,
    unsubscribeType: args.unsubscribeType,
    tryCount: args.tryCount,
  });

  const response = await fetch(endpointForEnv(args.env), {
    method: "POST",
    headers: {
      accept: "*/*",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      referer: refererForEnv(args.env),
    },
    body: JSON.stringify([
      {
        operationName: "EmailsMessages",
        variables,
        query: QUERY,
      },
    ]),
  });

  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch (error) {
    throw new Error(`GraphQL response was not JSON (${response.status}): ${text.slice(0, 500)}`);
  }

  if (!response.ok) {
    throw new Error(`GraphQL request failed with HTTP ${response.status}: ${JSON.stringify(payload)}`);
  }

  const first = Array.isArray(payload) ? payload[0] : payload;
  if (first?.errors?.length) {
    throw new Error(`GraphQL returned errors: ${JSON.stringify(first.errors)}`);
  }

  const result = first?.data?.messagesEmailsMessages;
  if (!result) {
    throw new Error(`GraphQL response did not include messagesEmailsMessages: ${JSON.stringify(payload).slice(0, 1000)}`);
  }

  return result;
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickHtmlContent(contents = []) {
  const typedHtml = contents.find(
    (content) =>
      typeof content?.value === "string" &&
      typeof content?.type === "string" &&
      content.type.toLowerCase().includes("html"),
  );
  if (typedHtml) return typedHtml;

  const htmlLike = contents.find(
    (content) =>
      typeof content?.value === "string" &&
      /<!doctype|<html|<body|<table|<div|<p[\s>]/i.test(content.value),
  );
  if (htmlLike) return htmlLike;

  return contents.find((content) => typeof content?.value === "string") || null;
}

function formatPerson(person) {
  if (!person) return "";
  const name = person.name ? `${person.name} ` : "";
  return `${name}${person.email || ""}`.trim();
}

function recipients(record) {
  return (record.personalizations || [])
    .flatMap((item) => item?.to || [])
    .map(formatPerson)
    .filter(Boolean);
}

function safeFilePart(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toBase64(value) {
  return Buffer.from(String(value || ""), "utf8").toString("base64");
}

function renderPreviewHtml(candidates, context) {
  const data = {
    context,
    candidates: candidates.map((candidate) => ({
      index: candidate.index,
      id: candidate.id,
      htmlBase64: toBase64(candidate.html),
      summary: candidate.summary,
    })),
  };

  const encodedData = JSON.stringify(data).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sent email record preview</title>
  <style>
    :root {
      color-scheme: light;
      --border: #d7dce2;
      --muted: #687385;
      --accent: #0f6b57;
      --surface: #f6f8fa;
      --selected: #e8f3ef;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      color: #17202a;
      background: #fff;
      overflow: hidden;
    }
    button { font: inherit; }
    .layout {
      display: grid;
      grid-template-columns: minmax(300px, 400px) minmax(0, 1fr);
      height: 100dvh;
      overflow: hidden;
    }
    aside {
      border-right: 1px solid var(--border);
      background: var(--surface);
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      height: 100dvh;
      min-height: 0;
      overflow: hidden;
    }
    header {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      background: #fff;
      z-index: 2;
    }
    h1 {
      font-size: 18px;
      line-height: 1.25;
      margin: 0 0 8px;
      letter-spacing: 0;
    }
    .context, .meta {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }
    #list {
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    #list:focus-visible {
      outline: 2px solid #0f6b57;
      outline-offset: -2px;
    }
    .candidate {
      width: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 6px;
      border-bottom: 1px solid var(--border);
      background: transparent;
      color: inherit;
    }
    .candidate:hover { background: #eef2f5; }
    .candidate[data-selected="true"] {
      background: var(--selected);
      box-shadow: inset 3px 0 0 var(--accent);
    }
    .candidate-select {
      min-width: 0;
      width: 100%;
      display: block;
      text-align: left;
      padding: 9px 0 9px 14px;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    .copy-id {
      align-self: start;
      min-height: 28px;
      margin: 8px 8px 0 0;
      padding: 0 7px;
      border: 1px solid var(--border);
      border-radius: 5px;
      background: #fff;
      color: #1f2937;
      cursor: pointer;
      font-size: 11px;
      line-height: 1;
      white-space: nowrap;
    }
    .copy-id:hover { border-color: #aab4c0; background: #f9fafb; }
    .copy-id[data-state="copied"] {
      border-color: #95c4b5;
      background: #eef8f4;
      color: #0f6b57;
    }
    .candidate-select:focus-visible,
    .copy-id:focus-visible,
    .tab:focus-visible,
    .copy-html:focus-visible {
      outline: 2px solid #0f6b57;
      outline-offset: -2px;
    }
    .title {
      display: flex;
      gap: 8px;
      align-items: baseline;
      font-size: 13px;
      font-weight: 650;
      line-height: 1.25;
    }
    .index {
      color: var(--accent);
      font-variant-numeric: tabular-nums;
    }
    .subject {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .details {
      display: grid;
      gap: 2px;
      margin-top: 5px;
      color: var(--muted);
      font-size: 11.5px;
      line-height: 1.25;
    }
    main {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      min-width: 0;
      height: 100dvh;
      min-height: 0;
      overflow: hidden;
      background: #fff;
    }
    .preview-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      background: #fff;
    }
    .toolbar-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      min-width: 0;
      flex: 1;
    }
    .tabs {
      display: flex;
      gap: 4px;
      padding: 3px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
    }
    .tab {
      min-height: 36px;
      padding: 0 12px;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    }
    .tab[aria-selected="true"] {
      background: #fff;
      color: #17202a;
      box-shadow: 0 1px 2px rgba(23, 32, 42, 0.12);
    }
    .selected-meta {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.4;
      text-align: right;
    }
    .copy-html {
      display: none;
      align-items: center;
      justify-content: center;
      min-height: 34px;
      padding: 0 10px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: #fff;
      color: #1f2937;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    main[data-view="source"] .copy-html {
      display: inline-flex;
    }
    .copy-html:hover { border-color: #aab4c0; background: #f9fafb; }
    .copy-html[data-state="copied"] {
      border-color: #95c4b5;
      background: #eef8f4;
      color: #0f6b57;
    }
    .preview-content {
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }
    .pane {
      min-width: 0;
      min-height: 0;
      width: 100%;
      height: 100%;
      display: none;
    }
    .pane.active {
      display: block;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      background: #fff;
    }
    pre {
      margin: 0;
      padding: 18px;
      height: 100%;
      overflow: auto;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: #101418;
      color: #eef4f8;
      font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
    }
    .empty {
      padding: 24px;
      color: var(--muted);
    }
    @media (max-width: 860px) {
      .layout {
        grid-template-columns: 1fr;
        grid-template-rows: minmax(220px, 42dvh) minmax(0, 58dvh);
      }
      aside {
        height: 42dvh;
        border-right: 0;
        border-bottom: 1px solid var(--border);
      }
      main {
        height: 58dvh;
      }
      .preview-toolbar {
        align-items: stretch;
        flex-direction: column;
      }
      .tabs {
        width: 100%;
      }
      .tab {
        flex: 1;
      }
      .selected-meta {
        width: 100%;
        text-align: left;
      }
      .toolbar-actions {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside>
      <header>
        <h1>Sent email records</h1>
        <div class="context" id="context"></div>
      </header>
      <div id="list" tabindex="0" role="listbox" aria-label="Sent email record candidates"></div>
    </aside>
    <main data-view="rendered">
      <div class="preview-toolbar">
        <div class="tabs" role="tablist" aria-label="Preview mode">
          <button class="tab" id="tab-rendered" type="button" role="tab" aria-controls="panel-rendered" aria-selected="true" data-view="rendered">Preview</button>
          <button class="tab" id="tab-source" type="button" role="tab" aria-controls="panel-source" aria-selected="false" data-view="source">HTML</button>
        </div>
        <div class="toolbar-actions">
          <div class="selected-meta" id="selectedMeta"></div>
          <button class="copy-html" id="copyHtml" type="button">Copy HTML</button>
        </div>
      </div>
      <section class="preview-content">
        <div class="pane active" id="panel-rendered" role="tabpanel" aria-labelledby="tab-rendered">
          <iframe id="rendered" sandbox=""></iframe>
        </div>
        <div class="pane" id="panel-source" role="tabpanel" aria-labelledby="tab-source" hidden>
          <pre id="source"></pre>
        </div>
      </section>
    </main>
  </div>
  <script>
    const data = ${encodedData};
    const list = document.getElementById("list");
    const context = document.getElementById("context");
    const rendered = document.getElementById("rendered");
    const source = document.getElementById("source");
    const selectedMeta = document.getElementById("selectedMeta");
    const previewMain = document.querySelector("main");
    const copyHtml = document.getElementById("copyHtml");
    let activeCandidateIndex = data.candidates[0]?.index || null;
    let activeHtml = "";

    const decode = (value) => new TextDecoder().decode(Uint8Array.from(atob(value), (char) => char.charCodeAt(0)));
    const line = (label, value) => value ? \`<div><strong>\${label}:</strong> \${escapeHtml(String(value))}</div>\` : "";
    const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

    context.textContent = [
      \`env=\${data.context.env}\`,
      \`productCode=\${data.context.productCode}\`,
      \`events=\${data.context.events || "delivered"}\`,
      \`organizationId=\${data.context.organizationId}\`,
      \`total=\${data.context.total ?? "unknown"}\`,
    ].join(" · ");

    function setActiveView(view) {
      previewMain.dataset.view = view;
      document.querySelectorAll(".tab").forEach((tab) => {
        const active = tab.dataset.view === view;
        tab.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll(".pane").forEach((pane) => {
        const active = pane.id === \`panel-\${view}\`;
        pane.classList.toggle("active", active);
        pane.hidden = !active;
      });
    }

    function selectCandidate(index, options = {}) {
      const candidate = data.candidates.find((item) => item.index === index);
      if (!candidate) return;
      activeCandidateIndex = index;
      const html = decode(candidate.htmlBase64);
      activeHtml = html;
      rendered.srcdoc = html;
      source.textContent = html;
      selectedMeta.textContent = [
        \`#\${String(candidate.index).padStart(3, "0")}\`,
        candidate.id || "no id",
        candidate.summary.createdAt || "",
      ].filter(Boolean).join(" · ");
      document.querySelectorAll(".candidate").forEach((item) => {
        item.dataset.selected = String(Number(item.dataset.index) === index);
        item.setAttribute("aria-selected", String(Number(item.dataset.index) === index));
      });
      const selectedButton = list.querySelector(\`.candidate-select[data-index="\${index}"]\`);
      const selectedItem = list.querySelector(\`.candidate[data-index="\${index}"]\`);
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
      if (options.focus && selectedButton) {
        selectedButton.focus({ preventScroll: true });
      }
    }

    function fallbackCopy(value) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    }

    async function copyText(value) {
      if (!value) return false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          return true;
        }
      } catch {
        return fallbackCopy(value);
      }
      return fallbackCopy(value);
    }

    function showCopyState(button, copied, resetLabel) {
      button.dataset.state = copied ? "copied" : "failed";
      button.textContent = copied ? "OK" : "Failed";
      clearTimeout(button._copyTimer);
      button._copyTimer = setTimeout(() => {
        button.dataset.state = "";
        button.textContent = resetLabel;
      }, 1200);
    }

    async function copyRecordId(button) {
      const copied = await copyText(button.dataset.copyId || "");
      showCopyState(button, copied, "ID");
    }

    async function copyCurrentHtml() {
      const copied = await copyText(activeHtml || source.textContent || "");
      showCopyState(copyHtml, copied, "Copy HTML");
    }

    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => setActiveView(tab.dataset.view));
    });
    copyHtml.addEventListener("click", copyCurrentHtml);

    function moveCandidate(delta) {
      if (!data.candidates.length) return;
      const currentPosition = Math.max(
        0,
        data.candidates.findIndex((candidate) => candidate.index === activeCandidateIndex),
      );
      const nextPosition = Math.min(
        data.candidates.length - 1,
        Math.max(0, currentPosition + delta),
      );
      selectCandidate(data.candidates[nextPosition].index, { focus: true });
    }

    list.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveCandidate(1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveCandidate(-1);
      }
    });

    if (!data.candidates.length) {
      list.innerHTML = '<div class="empty">No records found. Try relaxing filters or increasing the limit.</div>';
      source.textContent = "No HTML source available.";
    } else {
      list.innerHTML = data.candidates.map((candidate) => {
        const summary = candidate.summary;
        return \`
          <article class="candidate" role="option" aria-selected="false" data-index="\${candidate.index}" data-selected="false">
            <button class="candidate-select" type="button" data-index="\${candidate.index}">
            <div class="title">
              <span class="index">#\${String(candidate.index).padStart(3, "0")}</span>
              <span class="subject">\${escapeHtml(summary.subject || "(no subject)")}</span>
            </div>
            <div class="details">
              \${line("createdAt", summary.createdAt)}
              \${line("from", summary.from)}
              \${line("to", summary.toPreview)}
              \${line("status", summary.status)}
              \${line("serviceCode", summary.serviceCode)}
              \${line("templateId", summary.templateId)}
            </div>
            </button>
            <button class="copy-id" type="button" data-copy-id="\${escapeHtml(summary.id || "")}" aria-label="Copy record id \${escapeHtml(summary.id || "")}" title="\${escapeHtml(summary.id || "")}">ID</button>
          </article>
        \`;
      }).join("");
      list.querySelectorAll(".candidate-select").forEach((button) => {
        button.addEventListener("click", () => selectCandidate(Number(button.dataset.index)));
      });
      list.querySelectorAll(".copy-id").forEach((button) => {
        button.addEventListener("click", () => copyRecordId(button));
      });
      selectCandidate(data.candidates[0].index);
    }
  </script>
</body>
</html>`;
}

function buildCandidate(record, index, outputDir) {
  const htmlContent = pickHtmlContent(record.contents || []);
  const html = htmlContent?.value || "";
  const recipientList = recipients(record);
  const textSummary = stripHtml(html).slice(0, 240);
  const fileStem = [
    `candidate-${String(index).padStart(3, "0")}`,
    safeFilePart(record.createdAt || ""),
    safeFilePart(record.subject || ""),
  ]
    .filter(Boolean)
    .join("-");
  const htmlPath = path.join(outputDir, `${fileStem}.html`);

  const summary = {
    index,
    id: record.id || "",
    createdAt: record.createdAt || "",
    updatedAt: record.updatedAt || "",
    subject: record.subject || "",
    productCode: record.productCode || "",
    organizationId: record.organization?.id || "",
    from: formatPerson(record.from),
    replyTo: formatPerson(record.replyTo),
    to: recipientList,
    toPreview: recipientList.slice(0, 3).join(", "),
    status: record.status || "",
    groupStatus: record.groupStatus || "",
    serviceCode: record.serviceCode || "",
    templateId: record.templateId || "",
    senderAccount: record.senderAccount?.username || "",
    sendgridUsername: record.sendgridUsername || "",
    totalCount: record.totalCount,
    successCount: record.successCount,
    failedCount: record.failedCount,
    htmlContentType: htmlContent?.type || "",
    htmlPath,
    textSummary,
  };

  return { index, id: record.id || "", html, htmlPath, summary };
}

function writeOutputs(result, args) {
  const outputDir =
    args.outputDir ||
    fs.mkdtempSync(path.join(os.tmpdir(), "sent-email-records-"));
  fs.mkdirSync(outputDir, { recursive: true });

  const messages = result.messages || [];
  const candidates = messages.map((record, idx) => buildCandidate(record, idx + 1, outputDir));

  for (const candidate of candidates) {
    fs.writeFileSync(candidate.htmlPath, candidate.html, "utf8");
  }

  const context = {
    env: args.env,
    productCode: args.productCode,
    organizationId: args.organizationId,
    endpoint: endpointForEnv(args.env),
    events: args.events,
    filters: buildFilters(args.filters, args.events),
    total: result.pagination?.total,
    returned: candidates.length,
    hasNextPage: result.pagination?.hasNextPage,
    nextCursor: result.pagination?.nextCursor,
    limit: result.pagination?.limit,
  };

  const metadata = {
    context,
    pagination: result.pagination || null,
    candidates: candidates.map((candidate) => candidate.summary),
  };

  const metadataPath = path.join(outputDir, "metadata.json");
  const previewPath = path.join(outputDir, "preview.html");

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf8");
  fs.writeFileSync(previewPath, renderPreviewHtml(candidates, context), "utf8");

  return {
    outputDir,
    previewPath,
    metadataPath,
    context,
    candidates: candidates.map((candidate) => candidate.summary),
  };
}

function printReadable(summary) {
  console.log(`Preview: ${summary.previewPath}`);
  console.log(`Metadata: ${summary.metadataPath}`);
  console.log(`Returned: ${summary.candidates.length}`);
  for (const candidate of summary.candidates) {
    console.log(
      [
        `#${String(candidate.index).padStart(3, "0")}`,
        candidate.createdAt,
        candidate.status,
        candidate.from ? `from=${candidate.from}` : "",
        candidate.toPreview ? `to=${candidate.toPreview}` : "",
        candidate.subject ? `subject=${candidate.subject}` : "",
        candidate.htmlPath,
      ]
        .filter(Boolean)
        .join(" | "),
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  args.productCode = requireString(args.productCode, "--product-code");
  args.organizationId = requireString(args.organizationId, "--organization-id");
  args.env = requireString(args.env, "--env");
  if (!["production", "testing"].includes(args.env)) {
    throw new Error("--env must be production or testing");
  }

  const token = getAuthToken(args.env);
  const result = await fetchRecords(args, token);
  const summary = writeOutputs(result, args);

  if (args.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    printReadable(summary);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
