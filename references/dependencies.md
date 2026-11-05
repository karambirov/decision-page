# Dependencies

Pages rely on several skills and on two programs. The skills come with the decision-page plugin as its dependencies; the programs are checked and, if missing, installed by the agent, after asking the person.

## Skills

Installing `decision-page@decision-page` from this repository's catalog (`.claude-plugin/marketplace.json`) installs every skill below except the built-in ones, each from its author's repository. The steps are in the README, under "Instructions for the agent".

| Skill | From | What it gives | Without it |
|---|---|---|---|
| `artifact-design`, `artifact-capabilities`, `artifact-diagramming`, `dataviz` | built into Claude Code | the claude.ai page contract, storage, diagrams, charts | without Claude Code the page lives as a local file, and the choices are passed on with the export button |
| `stageshow` | [benjitaylor/skills](https://github.com/benjitaylor/skills), `stageshow/` | animated interface scenes | a step-through or a situation switcher instead of a scene |
| `apple-design`, `emil-design-eng` | [emilkowalski/skill](https://github.com/emilkowalski/skill), `skills/apple-design/`, `skills/emil-design-eng/` | motion, presses, step-by-step reveal | the rules from the template and [components.md](components.md) |
| `web-design-guidelines` | [ehmo/platform-design-skills](https://github.com/ehmo/platform-design-skills), `skills/web/` | accessibility, keyboard, responsiveness | the rules from [components.md](components.md) |
| `ios-design-guidelines`, `android-design-guidelines` | [ehmo/platform-design-skills](https://github.com/ehmo/platform-design-skills), `skills/ios/`, `skills/android/` | interface behavior requirements when a proposal changes an app screen | general platform knowledge |
| `redaktura`, `statya` | [N1arko/redaktura-skills](https://github.com/N1arko/redaktura-skills), `redaktura/`, `statya/` | structure and editing of Russian text | the rules from [language.md](language.md) |

Skills from plugins are named `<plugin>:<skill>`, for example `redaktura:redaktura`; a person who installed the author's own plugin has `redaktura-skills:redaktura` instead. Either works.

## Programs

Find the Claude Code program first: inside the Claude desktop app it is `$CLAUDE_CODE_EXECPATH`, even when no `claude` command is on `PATH`.

**Python 3.8 or newer** builds every page (`scripts/build.py`, standard library only).

- On a Mac, `/usr/bin/python3` without Apple's Command Line Tools is a stub: running it opens an install dialog instead of Python. Check `xcode-select -p` before running it.
- If there is no working Python 3, ask the person and install one. The python.org installer or Homebrew is the usual way; `uv` installs Python without administrator rights. Command Line Tools also bring Python 3 but are a large download, so offer them last.

**Node.js 20.19 or newer with npm** builds animated scenes with stageshow (`scripts/build-scene.mjs`).

- When the plugin installs, Claude Code installs stageshow's packages by itself if `npm` is on `PATH` at that moment.
- If Node.js was missing then, install it after asking the person (the nodejs.org installer, or Homebrew), then run `"$CLAUDE_CODE_EXECPATH" plugin update stageshow@decision-page`: an update retries the package install. `npm ci` in stageshow's folder does the same.
- `scripts/build-scene.mjs` looks for stageshow in `~/.claude/skills`, `~/.agents/skills` and the plugin cache, and prefers a copy whose packages are installed.

**Check that everything works** by building the bundled examples from the skill's folder:

```sh
python3 scripts/build.py examples/pages/team-pricing.en.content.html --out /tmp/decision-page-check
node scripts/build-scene.mjs --scene examples/scenes/dead-button --name DeadButtonDemo --out /tmp/decision-page-scene
```

## How to share the skill

Nothing in the skill ties it to one company or one person. Personal rules (writing style, message approval, task tracker, language) live in each person's CLAUDE.md and memory; the skill only respects them. The examples in `examples/` use made-up data.

- **Link.** Send the repository link; the person's agent installs the plugin by the README.
- **Fork.** The catalog is a file in the repository, not an account anywhere, so a fork can be installed the same way by its own link.
- **Git.** For working on the skill itself, clone the repository into `~/.claude/skills/decision-page`. It loads as a plain skill; the helper skills then have to be installed separately, for example from this catalog.
- **Different Claude accounts.** The page is published in the account of whoever works with the skill and by default is visible only to them. Each page has its own choice storage.

## What depends on the environment

| Environment | What works |
|---|---|
| Claude Code in the Claude Desktop app or on claude.ai | everything: publishing the page, choice storage, Claude reading the choices, the app's look |
| Claude Code in a terminal without the Artifact tool | the page builds as a local file and opens in a browser; choices are stored in the browser and passed to Claude with the "Copy choices as text for Claude" button |
| other agents (Codex and the like) | not a target. The template, the build and the checks do not depend on Claude, so they may work, but nobody tests this |
