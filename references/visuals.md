# Visuals

One thing per question that the reader can touch. It answers "how does this work"; the text next to it answers "what follows from this". If a diagram only repeats the paragraph, it is not needed.

## How to choose

| What the reader needs to understand | Widget |
|---|---|
| How the interface behaves over time: a button does not respond, a screen did not open, the wrong thing popped up | `stageshow` scene |
| How one signal passes through the layers and where it breaks, what the fix will change | path with "now / after" modes |
| How several scenarios of one phenomenon differ | situation switcher |
| Why a sequence of events leads to a breakage | step-through |
| What exactly can be found or done with a tool | "try it yourself" with verified queries |
| How something is distributed or how it changed over time | chart following the `dataviz` rules |
| How the parts of a system are arranged and connected | diagram following the `artifact-diagramming` rules |
| What is there and what is not | two-column comparison |

## stageshow scene

When the problem is visible to the user, a scene convinces better than any description. Example: `examples/scenes/dead-button` shows how, after a survey is closed, the "Checkout" button stops working, while the event counter in the error log grows with every tap.

How to build one:

1. Load the `stageshow` skill and read its sections on scenes with a cursor and on `play="once"`.
2. Write a story in three to five beats: context, action, unexpected result, resolution. Each beat has a pause so that it can be read.
3. Real text only on key elements: the button label, the screen title, the event name. Everything else as gray placeholder bars.
4. Show what happens off screen (error log, server, analytics) as a companion next to the phone, and connect it with a `Connector` arrow.
5. The poster (the frame before playback) shows the resolution: that way the meaning is visible even without animation and under `prefers-reduced-motion`.
6. Put `index.tsx` and the styles in the scene folder, and import the kit as `'../../kit'`, as in the example.
7. Build: `node scripts/build-scene.mjs --scene <folder> --name DeadButtonDemo --out <build folder>`. This needs `stageshow` installed, with `npm install` run in its folder.
8. In the page: `<div class="demo-host" data-mount="DeadButtonDemo"></div>`, then `scripts/build.py ... --scene-js <build>/scene.js --scene-css <build>/stageshow.css`.
9. Check it with a stageshow recording (`film.mjs`) or in a browser: texts do not overlap, nothing is cut off at 375 px, replay works.

The build weighs about 400 KB; that is normal. Build several scenes on one page under separate global names.

## Signal path

Fits error logs, analytics, network failures: "request → network layer → handler → log". Five to seven steps, each with a result: "sent", "stayed silent", "logged again". The "After the fix" mode changes only the steps that the fix changes.

## Situation switcher

Each situation has the same form: a short timeline, what the person sees, what lands in the log, how harmful it is. Then the difference is visible at once.

## Step-through

Steps in the present tense, one action per step. The step where things break is marked with the `bad` class. The last step describes the consequence for the person, not for the code.

## Chart

- Normalize absolute numbers if you compare versions or periods of different sizes: "per 100 network failures of the same version", "per 1,000 taps".
- The caption under the chart says what is compared and over what period.
- Color only for meaning: one series neutral, the highlighted series in the accent color.
