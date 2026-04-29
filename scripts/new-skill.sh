#!/bin/zsh

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: ./scripts/new-skill.sh <skill-name>"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NAME="$1"
TARGET_DIR="$ROOT_DIR/skills/$NAME"
TEMPLATE_DIR="$ROOT_DIR/templates/skill"

if [[ ! "$NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "Skill name must be kebab-case: lowercase letters, numbers, and hyphens only."
  exit 1
fi

if [[ -e "$TARGET_DIR" ]]; then
  echo "Target already exists: $TARGET_DIR"
  exit 1
fi

mkdir -p "$TARGET_DIR"
cp -R "$TEMPLATE_DIR/." "$TARGET_DIR/"

perl -0pi -e "s/name: my-skill/name: $NAME/" "$TARGET_DIR/SKILL.md"
perl -0pi -e "s/# My Skill/# $NAME/" "$TARGET_DIR/SKILL.md"

echo "Created skill scaffold at: $TARGET_DIR"
echo "Next: edit skills/$NAME/SKILL.md"
