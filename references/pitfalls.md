# Pitfalls

Everything below has already happened on real pages. The template handles these cases, but edits can easily bring them back.

## Layout and behavior

- **`hidden` does not hide the panel.** The `.panel { display: grid }` rule overrides the `hidden` attribute. The template has `[hidden] { display: none !important; }`; do not remove it.
- **The panel stays transparent.** A fade-in through a double `requestAnimationFrame` does not fire in a background tab, and the panel hangs at `opacity: 0`. A forced reflow is needed: add a class, read `offsetWidth`, remove the class.
- **Fields stick out past the edge.** Without `* { box-sizing: border-box; }` the comment field is wider than its block on mobile.
- **Scroll in the wrong place.** Questions share one page scroll, so without memory a new question opens in the middle. The engine remembers the position of each question (in `sessionStorage` too), opens a new question at the top, and `history.scrollRestoration = "manual"` keeps the browser from interfering.
- **Anchor jump on load.** After loading, the browser scrolls to `#id` by itself, and the question bubble slides under the top bar. After `load`, the engine restores the saved position if the reader has not started scrolling yet.
- **Anchor jump.** Following `href="#id"` scrolls to the section. Menu links and `data-goto` are intercepted, and the address changes through `history.replaceState`.
- **Menu on a phone.** While the panel is open, the content behind it is `inert` and does not scroll; Esc and a tap on the backdrop close the panel, and focus returns to the menu button. The closed panel is hidden with `visibility` so that its links cannot be reached with Tab.
- **Garbled characters in the local preview.** The page for publishing has no `<meta charset>`; claude.ai adds it. For a local preview, open `preview.html` from `scripts/build.py`.
- **Code inside a step falls apart letter by letter.** If a list item is made a "number | text" grid, every `<code>` and `<b>` inside it becomes a separate cell and lands in the narrow number column. Steps in the template flow as normal text with the number at the side; do not give them `display: grid` back.
- **A period after a term on a new line.** A term is a button, and a punctuation mark right after it wraps on its own. The engine glues the button to that mark (`.term-wrap`), so put the mark right against `</button>`.
- **A scene on a hidden question.** Mount the scene when its question opens (`data-mount`); otherwise it plays while invisible.

## Storage

Scenarios that every change to saving is checked against:

- a choice is made before the storage connects: it waits and is sent when the storage connects;
- a write fails: the choice stays on the page, the write is retried with a growing pause, and after eight attempts the "Copy choices as text" button («Скопировать выбор текстом» on Russian pages) appears;
- a snapshot comes from the storage while a local edit is not confirmed yet: the edit is not overwritten by the old value;
- there is no storage (a local file, another agent): the choice goes to browser storage.

How to write saving code:

- Do not block rendering while waiting for the storage: the page works at once, and the choices load later.
- `claude.use("db")` can return `null`, and there may be no answer for 10 seconds: the template shows a clear line in the summary («Итог»).
- Write to a document one write at a time (a promise chain) and only when something changed; the comment with a delay of about a second.
- One subscription to the collection per page, not in rendering.

## stageshow scenes

- A Vite config outside the stageshow folder does not find the packages. Build through `scripts/build-scene.mjs`: it temporarily puts the scene inside stageshow and cleans up after itself.
- Do not leave your scenes in `stageshow/examples`: a skill update will erase them. Keep a scene next to its page or in `examples/scenes` of this skill.
- Semi-transparent layers over the interface let things show through: make the backgrounds of sheets and footers opaque.
- A companion over the phone covers the headings: move it to a separate column and link it with an arrow.
- Long labels wrap and break the frame at 375 px: shorten them.

## Text and content

The first versions of such pages failed not on code but on presentation: "very long, little interactivity, a lot of text, a lot of repetition, a lot of anglicisms". These are the main traps.

- An article instead of a page: long sections about practices and approaches. Give the essence of a practice in one sentence, where it is needed for a decision.
- Repeats: the same number in the header, in a section and in the summary.
- A proposal with no answer to "where does it live and what does it cost" (see [proposals.md](proposals.md)).
- Decisions at the end of the page, cut off from their context.
