#!/bin/zsh

set -euo pipefail

ZSHRC="${ZDOTDIR:-$HOME}/.zshrc"
HOST="${SONAR_HOST_URL:-https://sonar.aftership.org}"
START_MARKER="# >>> sonar.aftership.org >>>"
END_MARKER="# <<< sonar.aftership.org <<<"

print "Create a SonarQube token at:"
print "  ${HOST}/account/security"
print ""
read -rs "TOKEN?Paste Sonar token: "
print ""

if [[ -z "${TOKEN}" ]]; then
  print -u2 "No token provided."
  exit 1
fi

touch "${ZSHRC}"
tmp="$(mktemp)"
awk -v start="${START_MARKER}" -v end="${END_MARKER}" '
  $0 == start { skip = 1; next }
  $0 == end { skip = 0; next }
  !skip { print }
' "${ZSHRC}" > "${tmp}"

{
  cat "${tmp}"
  print "${START_MARKER}"
  print "export SONAR_HOST_URL=\"${HOST}\""
  printf "export SONAR_TOKEN=%q\n" "${TOKEN}"
  print "${END_MARKER}"
} > "${ZSHRC}"

rm -f "${tmp}"
unset TOKEN

print "Updated ${ZSHRC}."
print "Run this in your shell, or open a new terminal:"
print "  source ${ZSHRC}"

