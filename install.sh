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
# Running it again updates every skill it installed. A skill folder installed some other way is
# moved to a backup folder first; a folder that is a symlink or a git checkout is left alone.
set -eu

DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
BACKUP="$DEST/.decision-page-backup/$(date +%Y%m%d-%H%M%S)"
MARK=".installed-by-decision-page"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT INT TERM
mkdir -p "$DEST"
backed_up=0

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
  if [ -d "$target" ] && [ ! -f "$target/$MARK" ]; then
    mkdir -p "$BACKUP"
    mv "$target" "$BACKUP/$3"
    backed_up=$((backed_up + 1))
  fi
  rm -rf "$target"
  cp -R "$src" "$target"
  printf 'https://github.com/%s/tree/HEAD/%s\n' "$1" "$2" > "$target/$MARK"
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
if grep -q '"redaktura-skills@' "$HOME/.claude/plugins/installed_plugins.json" 2>/dev/null; then
  echo "  - redaktura, statya: already available through the redaktura-skills plugin"
else
  put N1arko/redaktura-skills redaktura redaktura
  put N1arko/redaktura-skills statya statya
fi

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
  if "$py" -I "$DEST/decision-page/scripts/build.py" "$DEST/decision-page/examples/pages/release-cadence.en.content.html" --out "$TMP/check" >/dev/null 2>&1 \
    && [ -f "$TMP/check/page.html" ]; then
    build_ok=yes
  fi
fi

# Node.js 20.19+ is optional: it builds animated scenes with stageshow
scenes=no
node_note="needs Node.js 20.19 or newer from https://nodejs.org"
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  if node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>20||(a===20&&b>=19)?0:1)' 2>/dev/null; then
    if [ -f "$DEST/stageshow/package.json" ] && [ ! -L "$DEST/stageshow" ]; then
      if (cd "$DEST/stageshow" && npm install --no-fund --no-audit --loglevel=error >/dev/null 2>&1); then
        scenes=yes
      else
        node_note="npm install failed in $DEST/stageshow; run it there by hand to see why"
      fi
    fi
  else
    node_note="Node.js $(node -v) is too old; stageshow needs 20.19 or newer"
  fi
fi

echo
echo "Done."
if [ "$backed_up" -gt 0 ]; then
  echo "Replaced $backed_up skill(s) installed some other way; the old copies are in $BACKUP"
fi
if [ "$build_ok" = yes ]; then
  echo "Check: the example page builds. Python 3: ready."
elif [ "$python_ok" = yes ]; then
  echo "Check FAILED: the example page did not build. Run this to see the error:"
  echo "  python3 $DEST/decision-page/scripts/build.py $DEST/decision-page/examples/pages/release-cadence.en.content.html --out /tmp/decision-page-check"
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
