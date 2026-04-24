#!/bin/zsh

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./scripts/sync-to-codex.sh <skill-name> [skill-name...]"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CODEX_SKILLS_DIR="${CODEX_HOME:-$HOME/.codex}/skills"

mkdir -p "$CODEX_SKILLS_DIR"

for NAME in "$@"; do
  SOURCE_DIR="$ROOT_DIR/skills/$NAME"
  TARGET_DIR="$CODEX_SKILLS_DIR/$NAME"

  if [[ ! -d "$SOURCE_DIR" ]]; then
    echo "Missing local skill: $SOURCE_DIR"
    exit 1
  fi

  if [[ -L "$TARGET_DIR" || -e "$TARGET_DIR" ]]; then
    rm -rf "$TARGET_DIR"
  fi

  ln -s "$SOURCE_DIR" "$TARGET_DIR"
  echo "Linked $NAME -> $TARGET_DIR"
done

echo "Restart Codex to pick up updated skills."
