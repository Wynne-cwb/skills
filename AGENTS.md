## Browser Usage

When a task requires browser automation or inspecting a local/remote web page, prefer the Codex in Chrome Extension / Chrome plugin path first. Use it before the in-app browser so the agent can reuse the user's real Chrome profile, logged-in session, cookies, and current tabs.

Only fall back to the Codex in-app browser when the Chrome Extension path is unavailable, explicitly inappropriate for the task, or the user asks to use the in-app browser.

## Subagent Handoffs

When a subagent has been spawned for a specific artifact or workflow step, do not take over or recreate that same work while the subagent is still running. The main agent may continue with non-overlapping work, but the delegated artifact remains owned by the subagent until it completes.

Only take over a delegated subagent task when the subagent explicitly reports failure or blockage, the user explicitly asks the main agent to take over, or there is concrete evidence that the subagent cannot continue. A timeout or slow response alone is not a failure signal.

Before writing a file that overlaps with a running subagent's assignment, check the subagent status and wait for completion unless one of the takeover conditions above is true.

## Skill Release Workflow

For any skill change in this repository:

1. Edit and validate the source skill under `skills/<skill-name>/`.
2. Commit the validated change.
3. Push the commit to GitHub.
4. Install the pushed skill from GitHub for both Codex and Claude Code:

   ```bash
   npx skills add Wynne-cwb/skills --skill <skill-name> -g -a codex claude-code -y --copy
   ```

Use `--full-depth` as well only when a skill needs it:

```bash
npx skills add Wynne-cwb/skills --skill <skill-name> -g -a codex claude-code -y --copy --full-depth
```

Never install, sync, or symlink skills directly from the local source directory into agent runtime directories. Runtime installs must come from the pushed GitHub repository through `npx skills add`, and must copy files rather than directly symlinking local source files.
