# PRD Document Reviewer Prompt Template

Use this template if an independent review pass is available and appropriate.

**Purpose:** Verify the PRD is clear, scoped, and ready to be handed to get-shit-done for planning.

**Dispatch after:** PRD document is written to `prds/YYYY-MM-DD-<topic>/PRD.md`.

```
Task tool (general-purpose):
  description: "Review PRD document"
  prompt: |
    You are a PRD document reviewer. Verify this PRD is complete enough for get-shit-done to plan from.

    **PRD to review:** [PRD_FILE_PATH]

    ## What to Check

    | Category | What to Look For |
    |----------|------------------|
    | Product clarity | Problem, goals, target users, and user value are clear |
    | Scope | Goals and non-goals create a focused planning boundary |
    | Requirements | Requirements are concrete enough to guide planning |
    | Acceptance criteria | Important behavior has testable success criteria |
    | Consistency | No contradictions across goals, requirements, UX notes, and non-goals |
    | Open questions | Remaining questions are explicit and not hidden in vague language |
    | GSD readiness | Handoff notes are useful but do not become an implementation plan |

    ## Calibration

    Only flag issues that would cause real problems during GSD planning.
    Minor wording improvements, stylistic preferences, and optional polish are not blockers.

    Approve unless there are serious gaps that would lead to a flawed plan.

    ## Output Format

    ## PRD Review

    **Status:** Approved | Issues Found

    **Issues (if any):**
    - [Section X]: [specific issue] - [why it matters for GSD planning]

    **Recommendations (advisory, do not block approval):**
    - [suggestions for improvement]
```

**Reviewer returns:** Status, issues if any, and advisory recommendations.
