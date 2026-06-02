# Personal Skills Repo

This repository is the source of truth for custom skills you use regularly.

## Install

Install skills only from the pushed GitHub repository with `npx skills add`. Do not symlink or auto-sync newly created local skills into a coding agent runtime.

After committing and pushing a skill to GitHub, install it with:

```bash
npx skills add Wynne-cwb/skills --skill <skill-name> -g -a claude-code
```

Example:

```bash
npx skills add Wynne-cwb/skills --skill gsd-team-lead -g -a claude-code
```

Some skills may require full-depth installation:

```bash
npx skills add Wynne-cwb/skills --skill brainstorming-prd -g -a claude-code -y --full-depth
```

## Structure

- `skills/`: each subdirectory is one skill
- `templates/skill/`: starter layout for a new skill
- `scripts/new-skill.sh`: scaffold a new skill directory

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

4. Validate the skill:

   ```bash
   python3 /path/to/skill-creator/scripts/quick_validate.py skills/my-skill
   ```

5. Commit and push the repository to GitHub.

6. Install the pushed skill with `npx skills add`:

   ```bash
   npx skills add Wynne-cwb/skills --skill my-skill -g -a claude-code
   ```

7. List local source skills:

   ```bash
   make list
   ```

## Make Targets

- `make help`: show available commands
- `make new NAME=my-skill`: create a new skill scaffold
- `make list`: list local skills in this repo

## Naming

- Use kebab-case for skill directory names.
- Keep one skill per folder.
- Put only skill-relevant files inside each skill folder.

## Notes

- Do not auto-sync or symlink new skills into coding agent runtime directories.
- This repo is for authoring, versioning, and organizing your own skills.
- Installation happens from GitHub through `npx skills add` after the code has been pushed.
