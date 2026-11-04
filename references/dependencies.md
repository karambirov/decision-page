# Dependencies

The page relies on several skills. The template already contains their main rules, so the page builds without them, but new widgets, scenes and texts come out worse.

| Skill | Source | What it gives | Without it |
|---|---|---|---|
| `artifact-design`, `artifact-capabilities`, `artifact-diagramming`, `dataviz` | built into Claude Code | the claude.ai page contract, storage, diagrams, charts | without Claude Code the page lives as a local file, and the choices are passed on with the export button |
| `stageshow` | `npx skills add benjitaylor/skills`, then `npm install` in the skill's folder | animated interface scenes | a step-through or a situation switcher instead of a scene |
| `apple-design`, `emil-design-eng` | `npx skills add emilkowalski/skill` | motion, presses, step-by-step reveal | the rules from the template and [components.md](components.md) |
| `web-design-guidelines` | `npx skills add ehmo/platform-design-skills` | accessibility, keyboard, responsiveness | the rules from [components.md](components.md) |
| `ios-design-guidelines`, `android-design-guidelines` | `npx skills add ehmo/platform-design-skills` | interface behavior requirements when a proposal changes an app screen | general platform knowledge |
| `statya`, `redaktura` | `npx skills add N1arko/redaktura-skills`, or the Claude Code plugin from the same repository (then the names are `redaktura-skills:statya`, `redaktura-skills:redaktura`) | structure and editing of Russian text | the rules from [language.md](language.md) |

All of the above except the built-in ones install with one command, which also runs `npm install` for `stageshow` when Node.js is present: `curl -fsSL https://raw.githubusercontent.com/karambirov/decision-page/main/install.sh | sh`. It needs only curl and tar, copies each skill from its author's repository into `~/.claude/skills`, moves a same-named skill installed some other way to `~/.claude/skills/.decision-page-backup/`, leaves alone any folder that is a link or a git working copy, skips `redaktura` and `statya` when the `redaktura-skills` plugin is installed, and ends by building the bundled example page as a check.

The scripts need Python 3 (standard library only), and Node 20 to build scenes.

## How to share the skill

Nothing in the skill ties it to one company or one person. Personal rules (writing style, message approval, task tracker, language) live in each person's CLAUDE.md and memory; the skill only respects them. The examples in `examples/` use made-up data.

- **Link.** Send the repository link to a person; their agent installs it by the instructions at the top of the README. Updating is the same command again.
- **npx.** `npx skills add karambirov/decision-page -g -a claude-code -y` installs this skill alone; the install command above adds the helper skills.
- **Git.** The `decision-page` folder is the repository: `SKILL.md` at the root, `README.md` next to it. It also works as a plain clone into `~/.claude/skills/decision-page`.
- **Different Claude accounts.** The page is published in the account of whoever works with the skill and by default is visible only to them. Each page has its own choice storage.

## What depends on the environment

| Environment | What works |
|---|---|
| Claude Code in the Claude Desktop app or on claude.ai | everything: publishing the page, choice storage, Claude reading the choices, the app's look |
| Claude Code in a terminal without the Artifact tool | the page builds as a local file and opens in a browser; choices are stored in the browser and passed to Claude with the "Copy choices as text for Claude" button |
| other agents (Codex and the like) | not a target. The template, the build and the checks do not depend on Claude, so they may work, but nobody tests this |

Scenes need `stageshow` installed and Node 20; without them the page builds without scenes.
