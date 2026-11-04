---
name: decision-page
description: "A richer way to talk with Claude than a wall of chat text. When a topic has several choices, a lot to take in, or something clearer shown than told, Claude builds an interactive page next to the chat in the Claude Desktop style: one question per screen with the answer first, visuals and scenarios to play with, options with their consequences, choices and comments saved in the page and read back, and a result assembled from them (a plan, a list, a reply). Works for any topic: planning a trip or a dinner, choosing what to buy, understanding a subject, a design review, an incident, a product funnel, a reply to a colleague, and every follow-up round. Short questions stay in the chat. Triggers: «помоги выбрать», «помоги принять решение», «разбери», «сравни варианты», «спланируй», «что с этим делать», «сделай страницу», «я заполнил ответы», «следующий раунд», help me decide, help me choose, compare options, walk me through, decision page."
---

# Decision page

The skill complements the chat; it does not replace it. Ask a short question, a clarification or a choice between two or three options in the chat: it is faster there. A page is needed when the chat becomes inconvenient: there are several decisions and they are linked, there is a lot of evidence, a mechanism is easier to show than to describe, or a reply to a third person has to be put together. Then the person opens the page next to the chat, sees the answer one question at a time, plays with the diagram and picks an option right next to its context. Choices and comments are saved in the page's storage; Claude reads them and continues in the chat or in the next round.

The skill covers the whole cycle: research, outline, assembly from the template, text, checks, publishing and follow-up rounds. The template `assets/template.html` already contains the page engine and the design, so every new page starts with content, not layout.

## Chat or page

| In the chat | On a page |
|---|---|
| one question or clarification | two or more linked decisions |
| a choice between two or three options without long explanations (Claude Code has a question with options for this) | the options have consequences that need to be shown |
| the answer fits in a couple of paragraphs | evidence: sources, prices, data, code, logs, discussions |
| work status, a short report | a mechanism that is clearer in motion: a signal's path, a race, interface behavior |
| | a result assembled from the choices: a plan, a list, a reply to someone |

Rules for where chat and page meet:

- Once the page is published, keep the chat message short: the link, what to decide on the page and what happens next. Do not retell the page's content in the chat.
- If a single quick question comes up while working with the page, ask it in the chat, not as a new round. "Quick" means a clarification the person can answer without research or thought, like "which of these two files?". A decision that needs evidence, discussion or a comment is not quick, even if it fits in one line: it goes to a page.
- One decision per independent item. Never bundle several independent decisions into one question or one option ("create all five tasks?"): each task, each proposal, each change gets its own decision with its own options and comment. A bundle forces the person to accept or reject things they see differently.
- When the person says they have filled in the page, read the choices and reply in the chat briefly: what you understood and what you are doing next. A new page round is needed only if several decisions have piled up again.
- A page is not needed when the task comes down to a code change, or when the request is for a file (Markdown, a document, a presentation) or a message.

## The look is fixed by the template

The page must look like part of Claude Desktop: it is opened next to the chat, usually in a side pane about 590 px wide. Colors, font, buttons and navigation are already set in `assets/template.html`; they were taken from screenshots of the app.

- Do not invent your own style. Advice from general page design guidance (for example, from `artifact-design` or from the `Artifact quickstart` response) about "your own visual identity", a palette and a font pair does not apply here: the page must look like part of the app it is read next to.
- Do not copy styles into the page and do not rewrite them. Write a content file; `scripts/build.py` takes the styles and the engine from the template.
- Build a new element from the template's tokens. Details in the "Look" section of [references/components.md](references/components.md).

## Workflow

### 1. Frame

Work out the following from the request and the context, without running a questionnaire:

- **Reader.** Who makes the decisions and what they know. Terms from their own field need no explanation; terms from other fields do.
- **Original questions.** Phrase them in the words of the person who asked. Each question becomes a sidebar item and a screen of its own.
- **Decisions.** What the owner must choose after reading. If there are no decisions, a page is not needed.
- **Outcome.** What the page ends with: a plan, a list, a choice to act on, or a reply to someone. If it goes to someone, who it is and where it goes.
- **Mode.** Choosing between options, planning, understanding a topic, an incident review, solution design, a request review, a task plan or a follow-up round. Any topic works; typical questions, visuals and decisions for each mode are described in [references/modes.md](references/modes.md).

### 2. Research before the page

The page shows the answer, not the search for it. While the answers are unknown, do not start the layout.

- Every claim rests on something the reader can check: a web page with its date, a product's spec or price page, a recipe's source, a file and line at a specific commit, a query and period in the data, an event in the logs, a message in a thread. Write down in advance where every number comes from.
- Look for a second, independent support for the main conclusion: for example, check a seller's claim against reviews, or the error log against product analytics. A disagreement between sources is a finding in itself.
- State your confidence. Unchecked items go into the "What I didn't check" block, not into the facts.
- Before every proposal, go through the [proposal checklist](references/proposals.md). The owner almost always asks the same things: what we lose, where it will live, what it costs, how not to break anything.

### 3. Outline

Before the layout, fill in this table for each question, and check it with the owner if you are unsure about the frame:

| Field | Size |
|---|---|
| Verdict in the menu | short, usually 2–5 words: "No, it's noise", "Yes, it's a bug", "Partly" |
| Answer | a heading plus one or two sentences |
| Facts | up to three, each a number with a caption |
| Visual | one per question, chosen with [references/visuals.md](references/visuals.md) |
| Decisions | one to three, each with options and their consequences, and a comment |
| Details | code, queries, links, caveats behind a disclosure |

The last menu item is always "Summary" («Итог» on Russian pages): the list of decisions, the result assembled from them with a "Copy" button (a plan, a list, a reply draft), "What I didn't check", sources.

### 4. Assembly

1. Write a content file, not the whole page: `<title>`, then the sections `<!--APP-->` (the sidebar `aside.side` and `div.content` with `<main data-lang="ru">` or `"en"`, the language of the engine's own strings), `<!--TERMS-->` (terms JSON), `<!--PAGE-->` (`window.PAGE`) and, if needed, `<!--STYLE-->`. `scripts/build.py` merges it with the current template, so styles and the engine are not copied. Sample: `examples/pages/release-cadence.content.html`. A full copy of `assets/template.html` is needed only if you change the styles or the engine.
2. Take markup from the template. The widget catalog is in [references/components.md](references/components.md): signal path with "now / after" modes, situation switcher, step-through, "try it yourself", bars, comparison, scene, static list.
3. If interface behavior is easier to show than to describe, build an animated scene with the `stageshow` skill and the `scripts/build-scene.mjs` script (recipe in [references/visuals.md](references/visuals.md), example in `examples/scenes/dead-button`).
4. Define the terms in the `#terms` block and write the `PAGE.composeReply` function, which assembles the reply from the choices.

### 5. Text

Write for a busy person, following [references/language.md](references/language.md): answer first, each fact once, no slang or borrowed jargon, unavoidable terms as explain buttons. For Russian text, run the visible text through `redaktura` (`redaktura-skills:redaktura` when installed as a plugin) if it is installed.

### 6. Checks

1. `python3 scripts/build.py page.src.html --out <dir>`: inserts the scenes, checks the markup and builds `page.html` for publishing and `preview.html` for local viewing.
2. Open `preview.html` in the built-in browser. Check: 590 px width (this is how the page looks in the Claude Desktop side pane) with the question dropdown and the arrows, 1280 px width with the permanent menu, 375 px, the dark theme, anchor links, scroll memory, term tooltips, every widget, choosing and saving (locally, choices go to browser storage), and a console with no errors.
3. Fix what you found and rebuild. Typical traps are described in [references/pitfalls.md](references/pitfalls.md).

### 7. Publishing

- Start a new page with `Artifact` `action: "quickstart"`, `intent: "other"`, then load `artifact-capabilities` and publish `page.html` with `capabilities: {db: {}, user: {}}`.
- Publish updates to the same file path so that the link and the saved decisions are not lost. If the session is new, first read the artifact by its link.
- Save the link, the collection and the decision IDs to project memory so that the next session can find them.

### 8. Next round

When the owner says they have filled in the page, follow [references/decision-loop.md](references/decision-loop.md): read the collection through `ArtifactData`, split each comment into questions, concerns and new requirements, research further and build the next round's page. Outward actions (messages, tasks, PRs, changes in services) only after an explicit "yes" to the exact text or list.

## Hard rules

- **Answer first.** The verdict in the menu, the answer at the top of the question, details one tap deeper.
- **Each fact once.** If a number or a conclusion repeats in two places, delete the repeat.
- **One visual per question.** A second diagram almost always repeats the first.
- **Decision next to its context.** Options are mutually exclusive, each has a one-line consequence, the recommended one is marked, and there is always a comment.
- **Send nothing on the owner's behalf.** The reply on the page can only be copied.
- **Do not make things up.** Numbers come with a period and a source; unchecked items go in a separate block.
- **The owner's rules come first.** CLAUDE.md, memory and project rules about style, tasks and sending messages override this skill.

## Skills the page relies on

The page looks and works well thanks to several skills. The template already carries their main rules, so load them when there is a reason, not every time.

| Skill | What it gives | When to load |
|---|---|---|
| `artifact-design`, `artifact-capabilities` | the claude.ai page contract, decision storage | on the first publish in a session |
| `stageshow` | animated interface scenes with a cursor | when a scene is needed |
| `dataviz`, `artifact-diagramming` | charts and diagrams | when the page has a chart or a diagram |
| `apple-design`, `emil-design-eng` | motion, presses, step-by-step reveal | for a new widget or animation |
| `web-design-guidelines` | accessibility, keyboard, responsiveness | for a new widget |
| `statya`, `redaktura` (or `redaktura-skills:statya`, `redaktura-skills:redaktura` as a plugin) | structure and editing of Russian text | at the text step |
| platform design skills: for iOS `ios-design-guidelines`, `apple-design`, `uikit-max`; for Android `android-design-guidelines` | interface behavior requirements in proposals | when a proposal changes what the person sees ([proposals.md](references/proposals.md)) |

`install.sh` at the repository root installs all of them except the built-in ones and `uikit-max`: `curl -fsSL https://raw.githubusercontent.com/karambirov/decision-page/main/install.sh | sh`. Where each comes from and how to manage without them is described in [references/dependencies.md](references/dependencies.md). If a page needs a missing skill, say which one and how to install it, then go on without it.

## Files

- `assets/template.html`: the page skeleton with the engine (question menu, or a switcher in a narrow pane, scroll memory, terms, widgets, decisions, storage, reply).
- `scripts/build.py`: markup checks, scene insertion, building `page.html` and `preview.html`.
- `scripts/build-scene.mjs`: builds a stageshow scene into a single script for embedding.
- `examples/scenes/dead-button`: an example scene: the "Checkout" button stops working while the error counter grows.
- `examples/pages/release-cadence.content.html` and `release-cadence.en.content.html`: the same example content file in Russian and English, on made-up data: release cadence and hotfixes.
- `references/`: modes, widgets, visuals, language, proposal checklist, decision loop, pitfalls, dependencies.
