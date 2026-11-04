# Template widgets

All widgets are already in `assets/template.html`: markup, styles and behavior. The engine finds them by attributes, so to add a new instance, copy one and fill it in. Do not edit the engine script: if you need a new widget type, add a separate small script after `window.PAGE` and follow the rules at the end of this file.

## Look

The page opens next to the chat in Claude Desktop, most often in a side pane 550–750 px wide, and must look like part of the app. The colors were taken from a screenshot of Claude Desktop: white background, gray surfaces `#f2f2f2`, thin lines around `#e7e7e7`, text and the primary button almost black (`#141414`, `#181818`), secondary text `#666`, the system font. There is almost no colored accent: only verdicts and the "bad" and "good" states have color.

Why: cards with shadows, colored badges and an accent of the page's own make the page look foreign next to the chat; the warm claude.ai tones with serifs do not match Claude Desktop. Both versions were tried, and both looked odd next to the app.

- In a narrow pane, questions are switched with a dropdown in the top bar, like the app's own headers, and with "back" and "forward" arrows. Wider than 1000 px, there is a permanent menu on the left.
- One card per widget or decision, with a thin border and no shadow. Facts as a row of numbers between lines.
- Build new elements from the template's tokens (`--bg`, `--side`, `--paper`, `--raise`, `--line`, `--primary`, `--sans`) with no colors or fonts of your own. Do not load web fonts.
- Check the page at 590 px width: this is how it looks in the side pane.

## Skeleton

On a wide screen there is a sidebar menu on the left, like the chat list in Claude, and one question on the right. Below 1000 px the menu opens as a dropdown from the top bar, which holds the current question, the «2 из 6» ("2 of 6") counter and the arrows. Scroll position is remembered for each question. The template keeps the top bar, the backdrop and the menu button outside the `<!--APP-->` section: they are not written by hand.

| Part | Markup | Rule |
|---|---|---|
| Menu header | `aside.side > .side-head` | a caption, an `h1` with the title, a short paragraph about who asked and about what, links to sources |
| Menu item | `a.q-link[href="#ID"][data-panel=ID]` in `nav.qnav` | `.n` (number or topic), `.t` (the question in the asker's words), `.row` with the verdict `.pill`; «Итог» (summary) last, with the `q-summary` class |
| Question | `section.panel#ID` inside `div.content > main` | all except the first with `hidden`. The engine adds the line with the question above the answer, the decision progress in the menu and the «Дальше» ("Next") button at the end by itself |
| Answer | `.answer > h2 + p` | the heading answers the question, the paragraph explains why |
| Facts | `.facts > .fact > b + span` | up to three, the number large, the caption with the period. Write a caveat under them (for example, "test data") as `p.note` |
| Block | `.block`, heading `.block-head > h3` | one idea per block |
| Details | `details.more > summary` | code, queries, links, caveats |
| Term | `button.term[data-term=KEY]` and the key in `#terms` | an explanation in one or two sentences in plain words |
| Link to a question | `<a href="#ID" data-goto="ID">` | for cross-references between questions; the question's scroll position is restored |

A verdict is short, usually 2–5 words. Verdict colors: `.pill.neutral` (noise, nothing serious), `.pill.bad` (bug, risk), `.pill.warn` (partly, with caveats), `.pill.ok` (all good), `.pill.info` (counter, reference).

## Signal path with modes

Shows how one event passes through the layers and where it breaks. The «Сейчас / После исправления» ("Now / After the fix") modes show the difference without a second diagram.

- Container `.block[data-path][data-modes]`, start button `[data-path-play]`. There can be any number of modes, `data-in-mode` goes on any element inside, and `data-modes` also works without a path (for example, for code shown as "now / proposed").
- Steps `li.path-step`, dot type `data-kind="sent|quiet|leak"`, or per mode `data-kinds="now:leak after:quiet"`.
- Mode-dependent text: elements with `data-in-mode="now"` and `data-in-mode="after"` (the second with `hidden`).
- The result under the diagram is `.path-sum`, one per mode.

## Situation switcher

Several scenarios of one phenomenon: "double tap", "long loading", "freeze". Each is shown in the same form so that the comparison is fair.

- Container `[data-toggle]`, buttons `button[role=tab][data-show=KEY]` in `.seg[role=tablist]`, content `[data-when=KEY]`.

## Step-through

A sequence with causality: a race, a freeze, a user's path. The reader goes through the steps with the «Дальше» button.

- Container `.stepper`, steps `ol.steps > li`, the step where things break with the `bad` class, buttons `[data-step=prev]` and `[data-step=next]`, counter `.count`.
- Five to seven steps. If there are more, split them into situations.

## Try it yourself

Verified queries, commands or examples that the reader can repeat. Every result is real, with a number.

- Container `[data-presets]`, buttons `.p-btn[data-p=KEY]` with a `.mark.y` or `.mark.n` mark, results in `template[data-p-body=KEY]`, output in `.p-result`.
- Copy button: `button[data-copy="text"]` or `button[data-copy-from="#id"]`.

## Comparison

Two columns, "works / does not work", "is there / is not there", "before / after": `.compare > .cmp.yes` and `.cmp.no` with an `h4` heading and `.chip` chips.

## Bars

A comparison of several values that also reads on a phone: `.hbars > .hbar` with a heading `.hbar-head` (a caption and `<b>` with the number), a track `.hbar-track > .hbar-fill style="--w: 58%"` and a `small` note. `.hbar.hl` highlights the main value neutrally; `.hbar.bad` marks a bad outcome. Compute widths relative to the largest value. For two to five values this is better than SVG: text in an SVG shrinks with the picture and becomes unreadable at 375 px.

## Static list

A plan or a numbered list of tasks: `ol.steps.static`, a note on an item in `span.note`.

## Chart

For time series and many data points. Inline SVG with the classes `.bar-a`, `.bar-b`, `.t-fg`, `.t-muted`, `.grid-l`, `.axis-l`. Labels directly on the bars, a legend only with three or more series, `role="img"` and an `aria-label` with the numbers. The rules for form and color come from the `dataviz` skill.

## Scene

An animated interface fragment from `stageshow`: `<div class="demo-host" data-mount="GlobalName"></div>`. The engine mounts the scene when its question opens. The build is described in [visuals.md](visuals.md).

## Decision

```html
<div class="block decision" data-id="docs-event" data-title="Событие о документах">
  <fieldset>
    <legend>Что сделать с событием о документах</legend>
    <label class="opt"><input type="radio" name="docs-event" value="fix-shared"><span class="ot">Исправить в общем коде<span class="rec">советую</span><span class="od">Закроет такие же события у других команд.</span></span></label>
    <label class="opt"><input type="radio" name="docs-event" value="keep"><span class="ot">Оставить как есть</span></label>
  </fieldset>
</div>
```

- `data-id` is unique on the page and matches the options' `name`. Option values are short and in Latin letters: Claude reads the choice by them.
- The engine adds the comment field, the status line and the last option «Другое» ("Other") by itself. «Другое» is always needed: the person may disagree with every option. If it is chosen, the comment field becomes «Свой вариант» ("Your own option"), and the summary shows that text. The value `other` is reserved; do not add your own «Другое» to the markup.
- Options are mutually exclusive. Each has a one-line consequence `.od`. The recommended one is marked `.rec`, and the reason for the recommendation is visible in its consequence.
- Whether you need «Не сейчас» ("Not now") or «Оставить как есть» ("Leave as is"), decide by meaning: it is often an honest option.

## Summary

The `#summary` question with `#sum-list`, `#dec-count` in the «Итог» menu item, `#reply` with a copy button, `#export-decisions` (it appears by itself if there is no page storage), and the «Что я не проверил» ("What I did not check") and «Источники» ("Sources") blocks. The reply text is assembled by `window.PAGE.composeReply(d)`: `d.choice(id)` gives the option's value, `d.label(id)` its label, `d.note(id)` the comment.

## Nesting widgets

Widgets can be nested inside each other: the engine finds them by attributes. For example, bars inside a situation switcher, one set of bars per situation.

## New widget

If none of them fits:

1. First ask yourself whether it is needed: a second diagram per question is almost always unnecessary.
2. Make anything clickable a `<button>` with a visible focus and `:active { transform: scale(0.97) }`.
3. Transitions only on `transform` and `opacity`, 150–250 ms, `var(--ease-out)`, and a variant without motion under `prefers-reduced-motion`.
4. Keyboard: arrows inside a group, `aria-selected` or `aria-pressed`, `aria-live` for a result that changes.
5. 375 px width with no horizontal scrolling, the dark theme through tokens.
6. For details, load `web-design-guidelines`, `emil-design-eng` and `apple-design`.
