# Page modes

A mode suggests which questions become menu items, which visuals work and which decisions are usually needed. It is a guide, not a form: if the asker's questions are different, the menu is built from them.

## Review of an incident, an alert or a "noisy" event

The questions are usually these: is it a real problem or noise, whom does it affect and how many, why does it happen, what to do now and what later, how not to miss it if it happens again.

- **Verdicts:** "Noise", "Bug", "Partly", "Does not reproduce".
- **Visuals:** a signal path through the layers with "now / after the fix" modes; an interface scene if the problem is visible to the user; a step-through of a race or a freeze; a chart by app version or over time.
- **Evidence:** the error log plus an independent source (product analytics, server logs, metrics). Turn event counts into people and into a share of the affected action.
- **Decisions:** what to do with the event (fix it on our side, fix it in shared code, remove it, keep it), what to do about old versions, whether to fix the cause, how to keep watching.
- **Mobile specifics:** a fix takes weeks to reach people because of phased rollout and old versions. Separate the client levers (a new version) from the server levers (a filter, a setting, a flag), and show how many people are on old versions.
- **Summary:** a reply to the thread or the alert channel, tasks for the fixes.

## Solution design

Questions: what problem are we solving, what options are there, what does each one cost, which to choose, how to roll it out without risk.

- **Verdicts:** "Option B", "Need data", "Do not do it".
- **Visuals:** an option switcher with the same diagram for each option (data flow, screens, dependencies), a "what we gain / what we lose" comparison, a scene of the new behavior.
- **Decisions:** the choice of option, the scope of the first step, the release method (flag, experiment, phased), what to measure.
- **Summary:** the task statement, a draft technical description, a work plan.

## Review of a request or a thread

Someone asked the owner a question or asked them to do something. The menu items follow the asker's questions, in the asker's words.

- **Verdicts:** a short answer to each question.
- **Visuals:** whatever clears up the asker's misunderstanding: "try it yourself" with verified queries, a "works / does not work" comparison, a signal path.
- **Decisions:** what to promise, what to do, whom to hand it over to.
- **Summary:** a reply draft in the asker's register and language; the terms they are used to can stay. Sending only after the exact text is approved.

## Task plan from findings

The findings are already accepted; they need to become work.

- **Menu items:** by task or by product problem. One problem visible to the user gives one task to verify, even if it is fixed in the same place in the code as a neighboring one.
- **Visuals:** a map "problem → task → PR → check", the order and the dependencies.
- **Decisions:** what the task includes, priority, assignee, release method. A "create" mark on every task.
- **Summary:** the list of tasks with their texts. Creating them in the tracker only after an explicit "yes".

## Next round

The owner has filled in the previous page. Details in [decision-loop.md](decision-loop.md).

- **Menu items:** "Your decisions" (what was chosen and what follows from it), an item for each major question from the comments, "Plan".
- **Visuals:** the answer to a question from a comment, shown as concretely as in the first round.
- **Decisions:** only new ones. Do not ask again about decisions made earlier; show them as made.
