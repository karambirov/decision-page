# Page language

The reader is busy and opens the page between other tasks. The text must read on the first pass, without a dictionary and without going back.

Pages are written in the reader's language. The rules below hold for any language; the extra rules for Russian are in [Russian pages](#russian-pages).

## Rules

- **Answer first.** The verdict in the menu, the answer in the question's heading, the explanation under it, details behind a disclosure.
- **Each fact once.** A repeat is the same conclusion or the same number in the text. A number that a widget shows (a bar label, a path step) does not count as a repeat. If a conclusion is needed in two questions, link to it from the second one (`data-goto`).
- **How much text is visible at once.** The answer heading and the paragraph under it: up to 120 words. Facts, widget labels and decision options do not count.
- **Short paragraphs.** One idea, two or three sentences.
- **No judgments instead of facts.** Not "a critical problem", but "2,132 people could not place an order in two weeks".
- **Numbers for people.** "327K", "9.3%", "about one in ten". The period and the source next to the number. Turn event counts into people and a share.
- **Honest confidence.** "Checked on 4 events out of 300", "from the code, without reproducing it". Doubtful items go into the «Что я не проверил» ("What I did not check") block.
- **Decision options.** A verb and a consequence: "Fix it in the shared code. This also closes the same events for other teams."

## Terms

Replace slang and jargon with plain words of the page's language. If a term cannot be avoided (the reader will see it in a tool's interface or in code), keep it as a `.term` explain button.

Code, queries and field names stay as they are, in `<code>`.

## Reply draft

The reply is written for the addressee, not for the owner, in the addressee's register. Terms the addressee is used to may stay as they are (issue, host, extra) if the addressee writes them that way. Start with a greeting, give a paragraph per question, and end with what happens next. Write the phrase for each decision option so that any combination reads coherently.

## Russian pages

Extra rules for pages in Russian.

**Numbers.** Write them the Russian way: «327 тыс.», «9,3 %», «примерно каждый десятый».

**Terms.** Replace slang and anglicisms with Russian words. The `.term` rule above still applies to terms that cannot be avoided.

| Instead of | Write |
|---|---|
| issue, ишью | группа событий |
| event, ивент | событие |
| sample rate, сэмплирование | отправляется каждый десятый случай |
| deeplink | ссылка в приложение |
| WebView | встроенный браузер |
| flow, флоу | сценарий, путь |
| endpoint | адрес запроса |
| tag, extra | метка, дополнительное поле |
| release | версия |
| feature flag | настройка на сервере |
| retry | повтор |
| timeout | истекло время ожидания |
| race condition | гонка (поясни, кто с кем) |
| user | человек, пользователь |
| fix, пофиксить | исправление, исправить |
| задеплоить, выкатить | выпустить |

**Reply draft.** Terms the addressee is used to may stay in Latin script as they are (issue, host, extra), if the addressee writes them that way. Do not use transliteration («сэмпл», «хотфикс», «ишью»): write in Russian («выборка», «срочное исправление») or in Latin script.

**Editing.** After the build, run Russian text through `redaktura-skills:redaktura` if the skill is installed: meaning, structure, bureaucratic language, clichés, traces of AI writing. For article-like pages with long text, check the structure against `redaktura-skills:statya`. Project style rules (for example, a ban on the long dash or on transliteration) take precedence; `scripts/build.py` warns about long dashes.
