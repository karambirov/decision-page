<h1 align="center">Ask Claude as usual.<br>Get an interactive page next to the chat.</h1>

<p align="center"><b>decision-page</b> is a skill for the Claude desktop app. When there is a lot to weigh, Claude answers with a page you can click through: the answer up front, the options side by side, and a plan or a ready reply put together from your picks.</p>

https://github.com/user-attachments/assets/183f6407-3fd6-49f8-b8be-a739039a09e4

<p align="center"><sub>The company and the numbers in the video are made up.</sub></p>

## How it works

1. **Start your message with `/decision-page`.** Then ask the way you always do: paste the thread, describe the decision, attach the data. Calling the skill by name means you don't depend on Claude guessing that you want a page. Claude looks into it first, then builds the page and opens it next to the chat.
2. **Decide on the page.** Every question gets its own screen: the short answer, the key facts, and a chart, a diagram or an interface sketch you can play with. Unfamiliar words are underlined; tap one for a short explanation. Each decision sits next to its evidence, with what every option leads to. Click an option, or leave a comment where you disagree. No more typing back "1: yes, 2: the second one, 3: no, because…". Your choices save on their own.
3. **Get the result.** Tell Claude you're done. It reads your choices and puts together what you need: a plan, a checklist, or a reply. The reply is yours to copy: Claude sends nothing on your behalf.

## When it helps

When there is more to decide than a chat answer can hold, and the decisions depend on each other:

| Situation | On the page | You leave with |
|---|---|---|
| **An incident review** | the timeline, the cause and the evidence for it, each fix as its own decision | the follow-up actions, in order |
| **A thread you need to answer** | every ask in it, the options for each, and what each answer leads to | a reply drafted from your choices |
| **Planning a project** | the scope, the order of work, the risks, each open question as a decision | a task list |
| **A strategy call** | the options with their numbers, and scenarios you can switch between | the decision, its reasons and a note for the team |
| **A review of someone's proposal** | each point, with what holds up and what doesn't | feedback to send back |

Each round ends with your choices. Claude reads them, digs further where you asked, and builds the next round if new questions came up. It works the same outside work, for a move or a renovation. Pages are written in your language.

## Install

You need the Claude desktop app. Open the **Code** tab, pick any folder and send:

```
Install the decision-page plugin from https://github.com/karambirov/decision-page
```

Claude installs the plugin with everything it needs, asks your permission along the way, and tells you when it's done. Then start a new chat and begin your message with `/decision-page`.

> [!TIP]
> Not sure what to try first? Type `/decision-page`, paste a message you need to answer and add *"Help me decide what to reply."*

<details>
<summary><b>Instructions for the agent installing this skill</b></summary>

1. **Install the plugin with Claude Code's plugin manager.** Inside the Claude desktop app, `$CLAUDE_CODE_EXECPATH` is Claude Code itself, even when there is no `claude` command:

   ```sh
   C="${CLAUDE_CODE_EXECPATH:-claude}"
   "$C" plugin marketplace add karambirov/decision-page
   "$C" plugin install decision-page@decision-page
   ```

   This installs `decision-page` and the eight skills it depends on, listed below. When `npm` is available, Claude Code also installs the packages stageshow needs for animated scenes.
2. **Turn on updates.** In `~/.claude/settings.json`, set `"autoUpdate": true` on the `decision-page` entry under `extraKnownMarketplaces`; the first command added that entry. The plugin and its skills then stay current by themselves.
3. **Make sure Python 3 and Node.js 20.19+ work.** Pages are built with Python 3 and animated scenes with Node.js. Ask the person before installing what's missing, then run `"$C" plugin update stageshow@decision-page` so that stageshow gets its packages. The traps, such as the Python stub on a Mac, are in [references/dependencies.md](references/dependencies.md).
4. **Tell the person to start a new chat,** so that Claude loads the plugin, and to begin their message with `/decision-page`. Suggest one of the situations in [When it helps](#when-it-helps), in their language.

**Update now.** Run `"$C" plugin update decision-page@decision-page`, and the same for a helper skill.

**Remove.** Run `"$C" plugin uninstall decision-page@decision-page`, then `"$C" plugin prune` to remove the helper skills nothing else needs, then `"$C" plugin marketplace remove decision-page`.

**What gets installed.** The plugin's catalog, [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), lists each skill and where it comes from:

| Skill | Source repository and folder | What it adds |
|---|---|---|
| `decision-page` | [karambirov/decision-page](https://github.com/karambirov/decision-page) | this skill |
| `stageshow` | [benjitaylor/skills](https://github.com/benjitaylor/skills), `stageshow/` | animated interface scenes; its npm packages take about 110 MB |
| `apple-design`, `emil-design-eng` | [emilkowalski/skill](https://github.com/emilkowalski/skill), `skills/apple-design/`, `skills/emil-design-eng/` | motion, presses, step-by-step reveal |
| `web-design-guidelines`, `ios-design-guidelines`, `android-design-guidelines` | [ehmo/platform-design-skills](https://github.com/ehmo/platform-design-skills), `skills/web/`, `skills/ios/`, `skills/android/` | accessibility, layout, platform behavior when a proposal changes an app screen |
| `redaktura`, `statya` | [N1arko/redaktura-skills](https://github.com/N1arko/redaktura-skills), `redaktura/`, `statya/` | structure and editing of Russian text |

The page also uses `artifact-design`, `artifact-capabilities`, `artifact-diagramming` and `dataviz`, which come with Claude Code.

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

This skill as a Claude plugin, and eight skills by other authors that its pages rely on, each from its author's repository. The list is in the instructions for the agent above. Pages are built with Python 3 and animated scenes with Node.js; if they are missing, Claude asks you and installs them. Updates arrive by themselves, and the plugin is removed the same standard way it was installed.

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
.claude-plugin/           the plugin catalog: this skill and the skills it depends on
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

## License and trademarks

MIT, see [LICENSE](LICENSE). The helper skills come from their authors' repositories, under their own licenses.

decision-page is an independent project. It is not made, endorsed or supported by Anthropic. Claude and Anthropic are trademarks of Anthropic, PBC, named here only to say what the skill works with.
