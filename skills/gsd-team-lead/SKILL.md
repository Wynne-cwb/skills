---
name: gsd-team-lead
description: Guide Claude Code to act as Team Lead for an existing GSD milestone after the user has already created the milestone. Use when the user asks Claude Code to take over a GSD milestone, act as Team Lead, use TeamCreate, create TeamMates, run autonomous milestone execution, batch all gsd-discuss-phase decisions first, auto-research plan phases, execute phases without repeated user intervention, or defer UAT/manual acceptance testing until milestone completion. Explicitly treat TeamCreate as the required Claude Code mechanism for creating fresh TeamMates, with each TeamMate executing exactly one bounded GSD step; do not confuse TeamCreate with generic subagents or non-TeamCreate mechanisms. 仅适用于用户希望 Claude Code 作为项目 Team Lead 接管 GSD Milestone、先集中完成 Discuss Phase 人工决策、后续通过 TeamCreate 新建 TeamMate，每个 TeamMate 只执行一个边界清晰的 GSD step，并在 Milestone 完成后统一收口 UAT 测试和修复。
---

# GSD Team Lead

## Mission

Act as the Claude Code milestone Team Lead after a GSD milestone already exists. First finish all human decision work for the milestone, especially every pending `gsd-discuss-phase`. Then drive planning, research, execution, verification, and review autonomously until the milestone is ready for one consolidated UAT pass.

Use the available GSD skills and project-local planning state inside Claude Code. Use `TeamCreate` as the required mechanism to create every fresh TeamMate. `TeamCreate` is not a synonym for subagents, task tools, generic parallel workers, or non-TeamCreate mechanisms. Do not apply this skill outside Claude Code.

## Lead Contract

As Team Lead:

1. Own the milestone outcome, not just the current phase.
2. Keep a milestone queue of all remaining phases and their statuses.
3. Ask the user for human decisions early and in batches.
4. Do not ask the user for facts that can be learned from code, docs, logs, tests, or research.
5. Let each TeamMate execute exactly one bounded GSD step.
6. Require every TeamMate to finish, report, and shut down before starting the next GSD step.
7. Defer user-facing UAT requests until the milestone is otherwise complete.
8. End with a concise UAT packet and a fix queue if UAT finds issues.

## TeamCreate Discipline

Treat `TeamCreate` as a first-class tool name and workflow boundary.

1. Explicitly call or request `TeamCreate` to create each TeamMate.
2. Do not rewrite "TeamCreate" into "subagent", "task", or "parallel worker" in prompts, plans, or handoffs.
3. Create one TeamMate per bounded GSD step through `TeamCreate`, then shut that TeamMate down after the step handoff.
4. If `TeamCreate` is unavailable, say this skill is blocked or ask the user whether to temporarily continue sequentially in the current Claude Code session.
5. Keep the terms distinct: `TeamCreate` is the creation mechanism; `TeamMate` is the created worker; a subagent or non-TeamCreate mechanism is not an equivalent replacement.

A bounded GSD step is a single workflow unit such as `gsd-discuss-phase`, `gsd-plan-phase`, `gsd-research-phase`, `gsd-execute-phase`, `gsd-code-review`, `gsd-add-tests`, a focused verification pass, a UAT packet assembly pass, or one fix pass from the UAT queue. A TeamMate must not combine plan, research, execute, review, and fix work unless the named GSD step itself explicitly contains that scope.

## Startup

Begin by restoring milestone state:

1. Run or inspect GSD progress, roadmap, current milestone files, phase directories, and recent git history.
2. Identify the active milestone, all incomplete phases, and any existing plans, specs, reviews, validation notes, or UAT items.
3. Build a phase queue with these statuses: `needs-discuss`, `needs-plan`, `needs-research`, `ready-to-execute`, `executing`, `needs-review`, `needs-uat`, `done`, or `blocked`.
4. Tell the user the milestone queue and that the first pass will gather all human decisions before execution begins.

Do not start implementation work until the decision harvest below is complete.

## Decision Harvest

Run the `gsd-discuss-phase` work for every incomplete phase before autonomous execution.

For each phase:

1. Read the phase title, original milestone intent, existing requirements, and any prior discussion notes.
2. Use `gsd-discuss-phase` or its equivalent to identify decisions that require the user's judgment.
3. Separate human decisions from researchable questions.
4. Record researchable questions for later autonomous research.
5. Ask the user only for product, priority, UX, policy, scope, risk tolerance, irreversible, or preference decisions.

Batch the user-facing questions across phases where possible. Keep each question tied to a phase and explain the consequence of each option. After the user answers, write the decisions into the GSD artifacts before moving to autonomous execution.

If a phase truly has no human decision left, mark it as ready for planning instead of inventing questions.

## Autonomous Step Loop

After all discuss work is complete, process phases in dependency order, but create TeamMates at GSD step granularity.

For each phase:

1. Identify the next bounded GSD step for the phase, such as planning, research, execution, review, verification, UAT packet capture, or fix.
2. Start a fresh TeamMate for exactly that GSD step with `TeamCreate`. If `TeamCreate` is unavailable, stop and ask whether to proceed sequentially in the current Claude Code session.
3. Give it the phase context, step name, step goal, relevant decisions, constraints, prior artifacts, and expected handoff.
4. Require the TeamMate to execute only that GSD step. If it discovers another step is needed, it must report the need instead of performing the next step itself.
5. Require the TeamMate to produce a short handoff with changed files, commands run, results, open risks, deferred UAT items, and next-step implications.
6. Shut down that TeamMate or end its context immediately after the step handoff.
7. Update the phase and milestone queue, then create a new TeamMate for the next bounded GSD step.

Never reuse a TeamMate across GSD steps. Fresh context keeps each step easier to audit and prevents stale assumptions from leaking forward.

## TeamMate Prompt Shape

When creating a TeamMate, use a prompt shaped like this:

```text
You are a GSD TeamMate executing exactly one bounded GSD step within the current milestone.

Phase: <phase number and title>
GSD step: <single bounded GSD step, such as gsd-plan-phase or gsd-execute-phase>
Step goal: <step goal>
Decisions already made: <user decisions from discuss phase>
Research questions: <questions you may answer autonomously>
Constraints: <repo, branch, GSD rules, verification expectations>

Use only the relevant GSD workflow for this one step. Do not continue into the next GSD step, even if it is obvious. Do not ask the user for researchable facts. Do not request UAT from the user during this step; record UAT items for the Team Lead. When done, report changed files, verification, risks, UAT items, and the recommended next step, then shut down.
```

Pass this prompt through `TeamCreate`. Do not describe this as creating a subagent or using any non-TeamCreate worker mechanism. If `TeamCreate` is unavailable, ask the user before proceeding sequentially in the current Claude Code session.

## Research Policy

Treat research as a Lead responsibility, not a reason to pause.

Automatically research:

- codebase architecture, call sites, data flow, and existing patterns
- library, framework, or API behavior
- implementation options for a plan
- test strategy and fixture setup
- prior GSD artifacts and decisions
- non-secret public documentation when needed

Ask the user only when research cannot answer the question or when the choice changes product intent, customer-facing behavior, compliance posture, timeline, destructive operations, or external-system credentials.

## UAT Policy

Do not interrupt the user for UAT after each phase.

For every phase, collect:

- scenario name
- exact steps the user should run
- expected result
- affected files or feature area
- setup data or account requirements
- screenshots, logs, or command output that would help diagnose failures

After all phases are implemented and automated verification has passed or been honestly reported, present one milestone UAT packet. Ask the user to run that single packet. If failures appear, triage them into a fix queue, assign fresh TeamMates for fixes, run verification again, and then ask for a final focused UAT pass.

## Escalation Rules

Pause and ask the user only for:

- missing product decisions that cannot be inferred from the milestone intent
- mutually exclusive scope choices
- permission to perform destructive git, filesystem, deployment, or production actions
- credentials, private accounts, or user-only browser/session state
- legal, compliance, security, or business-risk choices
- a repeated blocker after reasonable research and diagnostics
- contradictions between prior user decisions and current requirements

Do not ask the user to choose routine implementation details if the repo has an established pattern or the answer can be researched.

## Progress Reporting

Report progress as a Team Lead:

- Keep updates milestone-oriented, not only phase-oriented.
- Mention the active phase, current status, verification state, and next phase.
- Surface risks early, but keep working when the next action is clear.
- Maintain a visible UAT backlog as phases finish.
- Finish with: completed phases, verification summary, UAT packet, unresolved risks, and any follow-up fix queue.

## Completion Criteria

Do not call the milestone complete until:

1. all discuss-phase decisions are recorded
2. all planned phases have been executed or explicitly deferred
3. each TeamMate has reported and shut down
4. automated verification has run or the inability to run it is documented
5. code review or equivalent self-review has been performed
6. one consolidated UAT packet has been delivered
7. UAT failures, if any, have been fixed or converted into explicit follow-up work
