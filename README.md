<h1 align="center">Ask Claude as usual.<br>Get an interactive page next to the chat.</h1>

<p align="center"><b>decision-page</b> is a skill for the Claude desktop app. When there is a lot to weigh, Claude answers with a page you can click through: the answer up front, the options side by side, and a plan or a ready reply put together from your picks.</p>

https://github.com/user-attachments/assets/fb5c6d28-7f92-40e1-b276-5180f908f23e

<p align="center"><sub>The company and the numbers in the video are made up.</sub></p>

## How it works

1. **Ask the way you always do.** No special prompts. When the answer has several decisions in it, Claude builds a page and opens it next to the chat. Quick questions still get a quick answer in the chat.
2. **Decide on the page.** Every question gets its own screen: the short answer, the key facts, a chart or a diagram you can play with, and the options with what each one leads to. Click an option, or leave a comment where you disagree. No more typing back "1: yes, 2: the second one, 3: no, because…". Your choices save on their own.
3. **Get the result.** Tell Claude you're done. It reads your choices and puts together what you need: a plan, a checklist, or a reply. The reply is yours to copy: Claude sends nothing on your behalf.

## What you can ask

| At work | Outside work |
|---|---|
| *"Sam asks whether we should raise our prices. Help me decide and draft my reply."* | *"Help me choose an air fryer for a family of four, under $150."* |
| *"Here are three quotes from agencies. Which one should we take?"* | *"Which documents do I need for a Schengen visa, and in what order?"* |
| *"Plan our team offsite: dates, place and budget."* | *"Plan four days in Lisbon with a toddler."* |
| *"Here's our sales report for October. What went wrong, and what do we do?"* | *"Explain how a mortgage works, with numbers I can change."* |

Pages are written in your language.

## Install

You need the Claude desktop app. Open the **Code** tab, pick any folder and send:

```
Install the decision-page skill from https://github.com/karambirov/decision-page
```

Claude may ask your permission to run the installer, then sets everything up and tells you when it's done. You won't write any code. Start a new chat after that, and ask your question.

> [!TIP]
> Not sure what to try first? Paste a message you need to answer and add *"Help me decide what to reply."*

<details>
<summary><b>Instructions for the agent installing this skill</b></summary>

1. **Download the installer, read it, and run it.** It needs only `curl` and `tar`.

   ```sh
   curl -fsSLo /tmp/decision-page-install.sh https://raw.githubusercontent.com/karambirov/decision-page/main/install.sh
   sh /tmp/decision-page-install.sh
   ```

   What it does:
   - **Skill folders.** It copies `decision-page` into `~/.claude/skills`, then each of the eight skills it relies on that the person does not have yet, from its author's repository. Set `CLAUDE_SKILLS_DIR` to use another folder.
   - **Scenes.** When Node.js 20.19 or newer is present, it runs `npm install` in the `stageshow` folder. That takes about 110 MB, plus the npm cache.
   - **Skills the person already has** are left alone, whatever way they were installed: a folder, a link, a git checkout or a plugin.
   - **Nothing else changes:** no system packages, no settings. The download is about 2 MB.
2. **Read the last lines it prints and act on them:**
   - **"Check: the example page builds"** means the install works.
   - **"Python 3: MISSING".** Pages can't be built without Python 3. On a Mac, ask the person first, then run `xcode-select --install` and tell them to click **Install** in the window that opens. When it finishes, run step 1 again.
   - **"Check FAILED".** Run the command it prints, then fix what the error shows.
   - **"Animated scenes: off".** Node.js is missing or older than 20.19. This is optional: pages work without animated scenes. Offer to install Node.js from [nodejs.org](https://nodejs.org) only if the person wants scenes.
3. **Tell the person to start a new chat,** so Claude picks up the skills. Give them an example request from [What you can ask](#what-you-can-ask), in their language.

**Update.** Run step 1 again: it updates `decision-page` and adds any helper skill that is still missing. It is safe to repeat, including after a run that stopped with an error.

**Remove.** Delete these folders from `~/.claude/skills`, but only the ones whose folder has an `.installed-by-decision-page` file: the others were there before.
- `decision-page`, `stageshow`, `apple-design`, `emil-design-eng`;
- `web-design-guidelines`, `ios-design-guidelines`, `android-design-guidelines`;
- `redaktura`, `statya`.

**Windows.** The script does not run there, so do the same by hand:
1. For each row of the table below, download the repository and copy the listed folder into `%USERPROFILE%\.claude\skills`, renamed to the skill name. For example, `skills/web` becomes `web-design-guidelines`.
2. If Node.js 20.19+ is installed, run `npm install` in the `stageshow` folder.
3. Pages need Python 3 from [python.org](https://www.python.org/downloads/).

**skills CLI.** If you prefer the [skills CLI](https://skills.sh), `npx skills add karambirov/decision-page -g -a claude-code -y` installs this skill alone. Run the installer above as well to get the helper skills.

**What gets installed.** `install.sh` downloads each skill from its author's repository and copies the folder into `~/.claude/skills`. Pages build without the helper skills, but new widgets, scenes and texts come out worse.

| Skill | Source repository and folder | What it adds |
|---|---|---|
| `decision-page` | [karambirov/decision-page](https://github.com/karambirov/decision-page) | this skill |
| `stageshow` | [benjitaylor/skills](https://github.com/benjitaylor/skills), `stageshow/` | animated interface scenes; `npm install` runs in its folder when Node.js is present |
| `apple-design`, `emil-design-eng` | [emilkowalski/skill](https://github.com/emilkowalski/skill), `skills/apple-design/`, `skills/emil-design-eng/` | motion, presses, step-by-step reveal |
| `web-design-guidelines`, `ios-design-guidelines`, `android-design-guidelines` | [ehmo/platform-design-skills](https://github.com/ehmo/platform-design-skills), `skills/web/`, `skills/ios/`, `skills/android/` | accessibility, layout, platform behavior when a proposal changes an app screen |
| `redaktura`, `statya` | [N1arko/redaktura-skills](https://github.com/N1arko/redaktura-skills), `redaktura/`, `statya/` | structure and editing of Russian text |

The page also uses `artifact-design`, `artifact-capabilities`, `artifact-diagramming` and `dataviz`, which come with Claude Code.

**Install telemetry.** `install.sh` only downloads: from GitHub, and from npm for scenes. It reports nothing. The skills CLI reports installs of public repositories to skills.sh; to turn that off, prefix `npx` commands with `DISABLE_TELEMETRY=1`.

</details>

## Questions

<details>
<summary><b>Do I need to know how to code?</b></summary>

No. The skill runs in the Code tab because it builds each page on your computer, but you talk to Claude in plain words, as in any chat.

</details>

<details>
<summary><b>Who can see my pages?</b></summary>

Only you. Each page is a private artifact in your Claude account and stays private until you share it.

</details>

<details>
<summary><b>Can it send anything on my behalf?</b></summary>

No. A reply on the page can only be copied. Before any message, task or change in another service, Claude asks for an explicit "yes" to the exact text.

</details>

<details>
<summary><b>Where does it work?</b></summary>

In the Code tab of the Claude desktop app and in Claude Code on claude.ai: the page opens next to the chat, and Claude reads your choices from it. Claude Code in a terminal works with less: the page opens in your browser, and you hand your choices back with a copy button.

</details>

<details>
<summary><b>What does it install?</b></summary>

This skill and up to eight helper skills by other authors that make pages look and read better, each from its author's repository. Skills you already have are left alone. Pages are built with Python 3; Node.js is optional, for animated scenes. Nothing else on your computer changes. The full list is in the instructions for the agent above.

</details>

<details>
<summary><b>Is it here to stay?</b></summary>

I hope not. Chat apps are starting to answer with interactive elements right in the conversation, and I expect Claude's app to get there too. I built this skill because I wanted that in my daily work now. When Claude's own chat answers like this, I'll retire the skill and say so here. There is nothing to migrate: pages are ordinary artifacts in your account.

</details>

<details>
<summary><b>For developers: how it's built</b></summary>

Claude writes a content file, not a whole page: the question menu, one section per question, a glossary, and a `composeReply` function that turns the choices into the result. `scripts/build.py` merges it with `assets/template.html`, which holds the styles, navigation, widgets and storage, checks the markup and writes `page.html` for publishing and `preview.html` for a local browser. Scenes are bundled by `scripts/build-scene.mjs` and inlined by the same build.

To build the bundled example, run this from the skill folder and open `preview.html` in a browser:

```sh
python3 scripts/build.py examples/pages/team-pricing.en.content.html --out /tmp/decision-page-example
```

```
install.sh                installs this skill and the skills it relies on
SKILL.md                  instructions for Claude: chat or page, workflow, rules
assets/template.html      page template: Claude desktop look, navigation, widgets, storage, reply
scripts/build.py          checks a page and assembles it from a content file and the template
scripts/build-scene.mjs   bundles a stageshow scene into one script for embedding
references/               modes, widgets, visuals, language, proposal checklist, decision loop, pitfalls, dependencies
examples/pages/           the example content file in English and Russian, made-up data: raising a Team plan price
examples/scenes/          example scenes: a checkout button that stops working, and the video at the top of this README
```

The widget catalog is in [references/components.md](references/components.md). To change the skill, see [CONTRIBUTING.md](CONTRIBUTING.md).

</details>

## License

MIT, see [LICENSE](LICENSE).
