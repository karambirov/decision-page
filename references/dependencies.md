# Dependencies

The page relies on several skills. The template already contains their main rules, so the page builds without them, but new widgets, scenes and texts come out worse.

| Skill | Source | What it gives | Without it |
|---|---|---|---|
| `artifact-design`, `artifact-capabilities`, `artifact-diagramming`, `dataviz` | built into Claude Code | the claude.ai page contract, storage, diagrams, charts | without Claude Code the page lives as a local file, and the choices are passed on with the export button |
| `stageshow` | `npx skills add benjitaylor/skills`, then `npm install` in the skill's folder | animated interface scenes | a step-through or a situation switcher instead of a scene |
| `apple-design`, `emil-design-eng` | `npx skills add emilkowalski/skill` | motion, presses, step-by-step reveal | the rules from the template and [components.md](components.md) |
| `web-design-guidelines` | `npx skills add ehmo/platform-design-skills` | accessibility, keyboard, responsiveness | the rules from [components.md](components.md) |
| `redaktura-skills:statya`, `redaktura-skills:redaktura` | Claude Code plugin from `N1arko/redaktura-skills` | structure and editing of Russian text | the rules from [language.md](language.md) |

The scripts need Python 3 (standard library only), and Node 20 to build scenes.

## How to share the skill

The skill is not distributed yet; see [CONTRIBUTING.md](../CONTRIBUTING.md) and the distribution issue before offering it to anyone. When it is, the notes below apply.

Nothing in the skill ties it to one company or one person. Personal rules (writing style, message approval, task tracker, language) live in each person's CLAUDE.md and memory; the skill only respects them. The examples in `examples/` use made-up data.

- **Git.** The `decision-page` folder is the repository: `SKILL.md` at the root, `README.md` next to it. Colleagues clone it into `~/.claude/skills/decision-page` or `~/.agents/skills/decision-page`.
- **npx.** It installs with one command: `npx skills add karambirov/decision-page -g -a claude-code`; a private repository needs read access and git that can clone it. Update: `npx skills update decision-page`.
- **Different Claude accounts.** The page is published in the account of whoever works with the skill and by default is visible only to them. Each page has its own choice storage.

## What depends on the environment

| Environment | What works |
|---|---|
| Claude Code in the Claude Desktop app or on claude.ai | everything: publishing the page, choice storage, Claude reading the choices, the app's look |
| Claude Code in a terminal without the Artifact tool | the page builds as a local file and opens in a browser; choices are stored in the browser and passed to Claude with the "Copy choices as text" button («Скопировать выбор текстом» on Russian pages) |
| other agents (Codex and the like) | not a target. The template, the build and the checks do not depend on Claude, so they may work, but nobody tests this |

Scenes need `stageshow` installed and Node 20; without them the page builds without scenes.
