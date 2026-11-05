# Contributing

A guide for an agent or a person who changes the `decision-page` skill. People who only use the skill need the README instead.

## Status

The repository is public under the MIT license, and the skill is in early use. The name `decision-page` is final. Version tags and a CHANGELOG are not set up yet; add them only when the owner explicitly asks. The history of the first release is in the closed issue [Prepare the skill for distribution](https://github.com/karambirov/decision-page/issues/1).

## Where things live

- The working copy is the installed skill: `~/.agents/skills/decision-page`, linked from `~/.claude/skills/decision-page`. A change in this folder takes effect in all of the owner's chats at once.
- `SKILL.md` holds the instructions for Claude. `references/` holds the details `SKILL.md` loads by link. `assets/template.html` is the look and the engine of the page. `scripts/` builds pages and scenes. `examples/` holds examples on made-up data; `examples/scenes/readme-demo` is the video at the top of the README.

## Principles not to break

- **The skill complements the chat.** Short questions stay in the chat; a page is for when the chat gets inconvenient. See "Chat or page" in `SKILL.md`.
- **The look is fixed by the template.** A page looks like part of Claude Desktop. Build new elements from the template's tokens; do not add colours or fonts of your own. Details in "Look" in `references/components.md`.
- **No work data.** The skill, examples, screenshots and commits never contain company names, error-tracker data, Slack or Jira content, internal links or the owner's pages. Examples use made-up data only.
- **The owner's rules live elsewhere.** Writing style, language and the approval order for messages live in each user's CLAUDE.md and memory. The skill respects them and does not copy them.
- **People's answers are never lost.** Any change to saving is checked against the scenarios in "Storage" in `references/pitfalls.md`.
- **Public text is in English.** README, CONTRIBUTING, issues, commit messages and the repository description are in English. Page content follows the reader's language.

## How to check a change

1. The template builds: `python3 scripts/build.py assets/template.html --out <dir> --allow-placeholders`.
2. Both examples build with no errors or warnings: `python3 scripts/build.py examples/pages/team-pricing.content.html --out <dir>` and the same for `team-pricing.en.content.html`. The English page shows no Cyrillic in the engine's strings.
3. Open `preview.html` through a local http server, not as a file, and check:
   - 590 px wide: this is how the page looks in the Claude Desktop side pane;
   - 1280 px with the sidebar, and 375 px;
   - light and dark themes;
   - switching questions, the arrows, scroll memory, the "Other" option, the growing comment field, saving choices;
   - no errors in the console.
4. If a scene changed: `node scripts/build-scene.mjs --scene examples/scenes/dead-button --name DeadButtonDemo --out <dir>`. If the README video changed, follow the steps at the top of `examples/scenes/readme-demo/index.tsx`, then replace the video in the README through GitHub's web editor: a video can only be uploaded there.
5. After a notable change to `SKILL.md` or the references, test the skill with a fresh agent that has no context. Give it only the skill name and a made-up topic, forbid publishing and sending anything, then look at its page at 590 px and ask it what in the skill was unclear.

## Where lessons go

- Traps already stepped on: `references/pitfalls.md`.
- New widgets and markup rules: `references/components.md`.
- Language and presentation: `references/language.md`.

Do not create separate documents: an agent reads `SKILL.md` and its links, nothing else.

## Commits

Small and meaningful; the message briefly says what changed and why. A commit made by an agent ends with a `Co-Authored-By` line naming its model. The owner and the owner's agents push to `main`; everyone else opens a pull request.

## Published pages

Pages a user has already opened were built from the template at publish time and do not update themselves. To give a page a template change, rebuild it from its content file and publish it to the same path. Rebuild only with the user's consent: an open page may hold answers that are not saved yet.
