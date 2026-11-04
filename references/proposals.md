# Proposal checklist

Before you put a decision option on the page, answer the questions below. The owner asks them almost always, and if the answer is not on the page, the round is spent on clarifications.

## Removing or filtering a signal

An event in the error log, a metric, an alert, a log.

- What exactly will stop coming in, and what will remain? For example, network failures will go away, and server errors will keep coming in.
- Where does the same information stay visible: a shared error group, product analytics, server logs? Give a link or a query to find it.
- Does the noise take another team's or another product's signal with it?
- How will we notice if the problem comes back after the change?

## A new metric, event or field

- What it is, in one sentence, and which question it answers.
- Where it will live: product analytics, the error log, performance monitoring. Why exactly there.
- Is there already data it can be computed from today? Check existing events and measurements first (in the code: what is sent, when a measurement starts and ends).
- What it costs: event volume, storage space, limits, analysts' work.
- Who owns it and who will look at it.

## A code change in a risky place

Old code shared by many screens, without tests, in Objective-C, on the purchase path.

- What changes, kept to a minimum, and what stays as it was.
- Which tests will check the behavior before and after. If the code is hard to test, which thin layer can be extracted and covered.
- How to turn it off without a new version: a server setting, an experiment.
- How to release it: in phases, to a share of people, watching which metric.
- What the person will see if the fix does not work.

## A change to what a person sees and does

A loading indicator on a button, the order of screens, error messages, gestures, modal windows. Design such proposals with the platform's design and interface skills loaded, not from memory:

| Platform | Skills |
|---|---|
| iOS | `ios-design-guidelines`, `apple-design`, `uikit-max` or `swiftui-expert-skill` depending on the screen's framework, plus the project's UI skill if there is one |
| Android | `android-design-guidelines`, plus the project's UI skill |
| Web | `web-design-guidelines`, `emil-design-eng`, `apple-design` |

If a skill has a variant for the project folder (for example, `<repository>:uikit-max`), use that one.

- On the page, describe the behavior in the person's words: what they see after tapping, what they can do while waiting, what they see on failure. Under each requirement, briefly state which rule it rests on.
- The same requirements go into the task texts, so that the developer and QA check the same thing.

## Product problems and tasks

- Each problem visible to a person is separate, even if the cause is shared: that way it can be verified and closed.
- For each one: how to reproduce it, whom it affects and how many, how we will know it is fixed.

## Tracking after a fix

- If the fix removes the situation, an event about it is not needed.
- What is needed is one safeguard event at the place where the rule breaks ("a second launch while the first one is still running"), with a reason tag. It stays silent while the fix works and reports loudly if it does not.
- Normal behavior (a double tap) is not written to the error log.
