#!/bin/sh
# Install the decision-page skill for Claude Code, together with the skills it relies on.
#
#   curl -fsSLo /tmp/decision-page-install.sh https://raw.githubusercontent.com/karambirov/decision-page/main/install.sh
#   sh /tmp/decision-page-install.sh
#
# Needs only curl and tar (both ship with macOS and Linux). Copies skill folders from their
# authors' repositories into ~/.claude/skills (override with CLAUDE_SKILLS_DIR). When Node.js 20.19+
# is present, it also runs npm install in the stageshow folder (about 110 MB, plus the npm cache).
# Nothing else changes: no system packages, no settings.
#
# Helper skills are installed only when missing: a skill the person already has, in any form
# (a folder, a link, a git checkout, a plugin), is left alone. Running it again updates
# decision-page itself when this installer put it there.
set -eu

DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
MARK=".installed-by-decision-page"
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

# Is a skill with this name already available to Claude Code: a folder or link in the skills
# folder, or a skill inside an installed plugin?
has_skill() {
  [ -e "$DEST/$1" ] && return 0
  [ -d "$HOME/.claude/plugins/cache" ] && find "$HOME/.claude/plugins/cache" -maxdepth 6 -path "*/$1/SKILL.md" 2>/dev/null | grep -q .
}

# copy <owner/repo> <folder in the repo> <skill name>
copy() {
  src="$(fetch "$1")/$2"
  if [ ! -f "$src/SKILL.md" ]; then
    echo "  ! $3: not found in $1, skipped" >&2
    return 1
  fi
  rm -rf "$DEST/$3"
  cp -R "$src" "$DEST/$3"
  printf 'https://github.com/%s/tree/HEAD/%s\n' "$1" "$2" > "$DEST/$3/$MARK"
}

# need <owner/repo> <folder in the repo> <skill name>: install a helper skill only when missing
need() {
  if has_skill "$3"; then
    echo "  = $3: already installed"
  elif copy "$1" "$2" "$3"; then
    echo "  + $3"
  fi
}

# This skill: install, or update a copy this installer put there; leave any other copy alone
self() {
  target="$DEST/decision-page"
  if [ -e "$target" ] && [ ! -f "$target/$MARK" ]; then
    echo "  = decision-page: already installed some other way, left as is"
  elif [ -e "$target" ]; then
    copy karambirov/decision-page . decision-page && echo "  ^ decision-page: updated"
  else
    copy karambirov/decision-page . decision-page && echo "  + decision-page"
  fi
}

echo "Installing into $DEST"
self
need benjitaylor/skills stageshow stageshow
need emilkowalski/skill skills/apple-design apple-design
need emilkowalski/skill skills/emil-design-eng emil-design-eng
need ehmo/platform-design-skills skills/web web-design-guidelines
need ehmo/platform-design-skills skills/ios ios-design-guidelines
need ehmo/platform-design-skills skills/android android-design-guidelines
need N1arko/redaktura-skills redaktura redaktura
need N1arko/redaktura-skills statya statya

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

# The real check: build the bundled example page
build_ok=no
if [ "$python_ok" = yes ] && [ -f "$DEST/decision-page/scripts/build.py" ]; then
  if "$py" -I "$DEST/decision-page/scripts/build.py" "$DEST/decision-page/examples/pages/team-pricing.en.content.html" --out "$TMP/check" >/dev/null 2>&1 \
    && [ -f "$TMP/check/page.html" ]; then
    build_ok=yes
  fi
fi

# Node.js 20.19+ is optional: it builds animated scenes with stageshow
scenes=no
node_note="needs Node.js 20.19 or newer from https://nodejs.org"
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  if node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>20||(a===20&&b>=19)?0:1)' 2>/dev/null; then
    if [ -f "$DEST/stageshow/package.json" ] && [ -f "$DEST/stageshow/$MARK" ]; then
      if (cd "$DEST/stageshow" && npm install --no-fund --no-audit --loglevel=error >/dev/null 2>&1); then
        scenes=yes
      else
        node_note="npm install failed in $DEST/stageshow; run it there by hand to see why"
      fi
    elif [ -d "$DEST/stageshow/node_modules" ]; then
      scenes=yes
    fi
  else
    node_note="Node.js $(node -v) is too old; stageshow needs 20.19 or newer"
  fi
fi

echo
echo "Done."
if [ "$build_ok" = yes ]; then
  echo "Check: the example page builds. Python 3: ready."
elif [ "$python_ok" = yes ]; then
  echo "Check FAILED: the example page did not build. Run this to see the error:"
  echo "  python3 $DEST/decision-page/scripts/build.py $DEST/decision-page/examples/pages/team-pricing.en.content.html --out /tmp/decision-page-check"
else
  echo "Python 3: MISSING. Pages cannot be built without it."
  if [ "$(uname -s)" = "Darwin" ]; then
    echo "  Fix on a Mac: run 'xcode-select --install' and ask the person to click Install in the window"
    echo "  that opens (a few minutes). Or install Python from https://www.python.org/downloads/."
  else
    echo "  Fix: install Python 3 with the system package manager."
  fi
  echo "  Then run this installer again."
fi
if [ "$scenes" = yes ]; then
  echo "Animated scenes: ready."
else
  echo "Animated scenes: off ($node_note). Optional: pages work without them."
fi
echo "Next: start a new chat in Claude (the Code tab) so it picks up the new skills."
