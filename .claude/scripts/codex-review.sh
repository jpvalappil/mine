#!/usr/bin/env bash
# Stop-hook helper: pipes the working-tree diff through `codex exec` for a
# second-opinion review and surfaces the result back to the user.
set -uo pipefail

REPO="/Users/jayaprakash/code/mine"
cd "$REPO" || exit 0

DIFF=$(git diff HEAD 2>/dev/null || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null || true)

if [ -z "$DIFF" ] && [ -z "$UNTRACKED" ]; then
  exit 0
fi

PAYLOAD=$(printf '## git diff HEAD\n%s\n\n## untracked files\n%s\n' "$DIFF" "$UNTRACKED" | head -c 200000)

PROMPT="You are reviewing code an AI assistant just generated in a small JS UI library project (mine). Review the following changes for: bugs, regressions, security issues, and clear quality problems. Output a short bulleted list of actionable items only. Skip nits and style preferences. If everything looks fine, reply exactly: No issues."

OUT=$(mktemp -t codex-review.XXXXXX)
trap 'rm -f "$OUT"' EXIT

if ! printf '%s\n\n%s' "$PROMPT" "$PAYLOAD" \
     | codex exec --skip-git-repo-check --color never --output-last-message "$OUT" - >/dev/null 2>&1; then
  jq -n '{systemMessage: "Codex review skipped (codex exec failed — check `codex login` / network)."}'
  exit 0
fi

REVIEW=$(cat "$OUT")
if [ -z "$REVIEW" ]; then
  exit 0
fi

jq -n --arg msg "$REVIEW" '{systemMessage: ("Codex code review:\n\n" + $msg)}'
