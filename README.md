# Personal Skills Repo

This repository is the source of truth for custom agent skills you use regularly.

## Install

Install the `evidence-first-debugging` skill globally with `add-skill`:

```bash
npx skills add Wynne-cwb/skills --skill evidence-first-debugging -g -a claude-code
```

Install the `brainstorming-prd` skill globally into Claude Code:

```bash
npx skills add Wynne-cwb/skills --skill brainstorming-prd -g -a claude-code
```

The same repository can also be installed into other agents:

```bash
npx skills add Wynne-cwb/skills --skill evidence-first-debugging -g -a codex -a opencode
```

## Structure

- `skills/`: each subdirectory is one skill
- `templates/skill/`: starter layout for a new skill
- `scripts/new-skill.sh`: scaffold a new skill directory
- `scripts/sync-to-codex.sh`: symlink one or more local skills into `~/.codex/skills`

## Suggested Workflow

1. Create a new skill scaffold:

   ```bash
   make new NAME=my-skill
   ```

2. Edit `skills/my-skill/SKILL.md` with `skill-creator`.

3. If the skill needs deterministic logic, add files under:

   - `scripts/`
   - `references/`
   - `assets/`

4. Symlink the finished skill into Codex:

   ```bash
   make link NAME=my-skill
   ```

5. List local skills:

   ```bash
   make list
   ```

## Make Targets

- `make help`: show available commands
- `make new NAME=my-skill`: create a new skill scaffold
- `make link NAME=my-skill`: symlink one skill into `~/.codex/skills`
- `make list`: list local skills in this repo

## Naming

- Use kebab-case for skill directory names.
- Keep one skill per folder.
- Put only skill-relevant files inside each skill folder.

## Notes

- Codex runtime skills live under `~/.codex/skills`.
- This repo is for authoring, versioning, and organizing your own skills.
