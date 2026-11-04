#!/bin/sh
# Install the decision-page skill for Claude Code, together with the skills it relies on.
#
#   curl -fsSL https://raw.githubusercontent.com/karambirov/decision-page/main/install.sh | sh
#
# Needs only curl and tar (both ship with macOS and Linux). Copies skill folders into
# ~/.claude/skills (override with CLAUDE_SKILLS_DIR). Changes nothing else on the computer:
# no system packages, no settings. Running it again updates every skill to the latest version.
# A skill folder that is a symlink or a git checkout is left alone: that is someone's working copy.
set -eu

DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT INT TERM
mkdir -p "$DEST"

# Download a GitHub repository once and print the folder it was unpacked into
fetch() {
  dir="$TMP/$(printf '%s' "$1" | tr '/' '_')"
  if [ ! -d "$dir" ]; then
    mkdir -p "$dir"
    curl -fsSL "https://github.com/$1/archive/HEAD.tar.gz" | tar -xz -C "$dir" --strip-components=1
  fi
  printf '%s' "$dir"
}

# put <owner/repo> <folder in the repo> <skill name>
put() {
  target="$DEST/$3"
  if [ -L "$target" ] || [ -d "$target/.git" ]; then
    echo "  - $3: kept as is (a link or a git working copy)"
    return 0
  fi
  src="$(fetch "$1")/$2"
  if [ ! -f "$src/SKILL.md" ]; then
    echo "  ! $3: not found in $1, skipped" >&2
    return 0
  fi
  rm -rf "$target"
  cp -R "$src" "$target"
  echo "  + $3"
}

echo "Installing into $DEST"
put karambirov/decision-page . decision-page
put benjitaylor/skills stageshow stageshow
put emilkowalski/skill skills/apple-design apple-design
put emilkowalski/skill skills/emil-design-eng emil-design-eng
put ehmo/platform-design-skills skills/web web-design-guidelines
put ehmo/platform-design-skills skills/ios ios-design-guidelines
put ehmo/platform-design-skills skills/android android-design-guidelines
put N1arko/redaktura-skills redaktura redaktura
put N1arko/redaktura-skills statya statya

# Python 3 builds every page. On a Mac without developer tools, /usr/bin/python3 is only a stub
# that opens an install dialog, so do not run it there.
python_ok=no
py="$(command -v python3 || true)"
if [ -n "$py" ]; then
  if [ "$(uname -s)" = "Darwin" ] && [ "$py" = "/usr/bin/python3" ] && ! xcode-select -p >/dev/null 2>&1; then
    python_ok=no
  elif "$py" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)' 2>/dev/null; then
    python_ok=yes
  fi
fi

# Node.js is optional: it builds animated scenes with stageshow
scenes=no
if command -v npm >/dev/null 2>&1 && [ -f "$DEST/stageshow/package.json" ] && [ ! -L "$DEST/stageshow" ]; then
  if (cd "$DEST/stageshow" && npm install --no-fund --no-audit --loglevel=error >/dev/null 2>&1); then
    scenes=yes
  fi
fi

echo
echo "Done."
if [ "$python_ok" = yes ]; then
  echo "Python 3: ready."
else
  echo "Python 3: MISSING. Pages cannot be built without it."
  if [ "$(uname -s)" = "Darwin" ]; then
    echo "  Fix on a Mac: run 'xcode-select --install' and ask the person to click Install in the window"
    echo "  that opens (a few minutes). Or install Python from https://www.python.org/downloads/."
  else
    echo "  Fix: install Python 3 with the system package manager."
  fi
fi
if [ "$scenes" = yes ]; then
  echo "Animated scenes: ready."
else
  echo "Animated scenes: off (needs Node.js from https://nodejs.org). Optional: pages work without them."
fi
echo "Next: start a new chat in Claude (the Code tab) so it picks up the new skills."
