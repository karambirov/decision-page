#!/usr/bin/env sh
# Install the skills decision-page relies on, for Claude Code at user level.
#
#   sh scripts/install-deps.sh
#
# Pages build without them, but scenes, motion, accessibility checks and
# Russian text come out worse. Safe to run again: it reinstalls the latest versions.
set -eu

add() {
  repo=$1
  shift
  echo "==> $repo: $*"
  npx -y skills add "$repo" -g -a claude-code -y -s "$@"
}

# Animated UI scenes
add benjitaylor/skills stageshow
# Motion, presses, step-by-step reveal
add emilkowalski/skill apple-design emil-design-eng
# Accessibility and responsive layout; platform guidelines for app UI changes
add ehmo/platform-design-skills web-design-guidelines ios-design-guidelines android-design-guidelines
# Structure and editing of Russian text
add N1arko/redaktura-skills redaktura statya

# stageshow builds scenes with its own Vite and React
stageshow="$HOME/.claude/skills/stageshow"
if [ -f "$stageshow/package.json" ]; then
  echo "==> npm install in $stageshow"
  (cd "$stageshow" && npm install --no-fund --no-audit --loglevel=error)
else
  echo "warning: $stageshow/package.json not found, run npm install in the stageshow folder yourself" >&2
fi

echo "Done. Restart Claude Code so it picks up the new skills."
