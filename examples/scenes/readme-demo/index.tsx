import { ArrowUp } from 'lucide-react'
import { Stage, Window, Thread, Bubble, Bar, Count, Popover, Scroll, Segmented, Stream, Swap, type Act } from '../../kit'
import './readme.css'

// The README demo for decision-page (made-up company, people and numbers). An
// illustration, not a screenshot: a neutral chat window, and our own page in
// the pane beside it, drawn from assets/template.html. Story in four beats:
// 1. "Help me decide:" is typed and a co-founder's question pasted after it;
//    the assistant answers in one line that it built a page;
// 2. the page slides in beside the chat: the question, the answer first, and
//    a price switcher whose bars move when $15 is tapped;
// 3. the page scrolls to the decision, the recommended option is picked and
//    the choice is saved;
// 4. the question list opens from the bar, Summary is picked, and the reply
//    draft assembled from the choice is ready under Copy.
// It plays once; the payoff (the page beside the chat, the reply ready) holds.
//
// Real strings only where the story needs them: the message, the reply, the
// page's question, answer, chart, options, the question list and the draft.
// Everything else is a grey bar.
//
// Designed at 838 px, the width of a README column on github.com, with type
// large enough to read when GitHub shrinks the video to a phone column. The
// ground is its own mid-light grey, since a video cannot follow the page's
// theme. The scene runs on a virtual clock, so the same source renders the
// same frames. To make the README video:
//   1. copy this folder to stageshow/examples/readme-demo and start the preview
//      in the stageshow folder:
//      node node_modules/vite/bin/vite.js playground --config playground/vite.config.ts --port 4625
//   2. render it with change-story's scripts/scene.mjs:
//      node scene.mjs "http://127.0.0.1:4625/?capture=readme-demo" --video demo.mp4 --until done --hold 1500
//   3. put the cover on frame 0, the still GitHub shows before Play:
//      python3 cover.py demo.mp4 decision-page-demo.mp4
//   4. upload it as a GitHub attachment and put the printed link in the README:
//      curl -sS -X POST "https://uploads.github.com/user-attachments/assets?name=decision-page-demo.mp4&content_type=video/mp4&repository_id=$(gh api repos/karambirov/decision-page -q .id)" \
//        -H "Authorization: Bearer $(gh auth token)" -H "Content-Type: application/octet-stream" --data-binary @decision-page-demo.mp4

type Panel = 'q1' | 'summary'
type S = {
  pasted: boolean
  typed: string
  sent: boolean
  words: number
  pane: boolean
  price: number
  chosen: boolean
  saved: boolean
  menu: boolean
  panel: Panel
}

const ASK = 'Help me decide: '
const QUOTE = '“Should we raise the Team plan from $12 to $15 per seat?”'
const REPLY = "I built a page with three questions. It's open on the right."
const REPLY_WORDS = REPLY.split(' ').length

// One price per segment: monthly revenue in $k, and the share of teams that leave
const PRICES = ['$12', '$15', '$18']
const REVENUE = [40, 47, 42]
const LEAVE = [2, 6, 30]
const REVENUE_MAX = 50
const LEAVE_MAX = 40

const DRAFT =
  "Hi Sam, let's go to $15 a seat. About 6% of teams may leave, but monthly revenue still grows by about 17%. Next I'll work out who gets the new price first and how we tell customers."

const START: S = { pasted: false, typed: '', sent: false, words: 0, pane: false, price: 0, chosen: false, saved: false, menu: false, panel: 'q1' }
const END: S = { pasted: false, typed: '', sent: true, words: REPLY_WORDS, pane: true, price: 1, chosen: true, saved: true, menu: false, panel: 'summary' }

const script = async (a: Act<S>) => {
  await a.wait(600)
  // 1. The ask is typed, and the question pasted after it from elsewhere
  a.mark('type')
  await a.type('typed', ASK, { interval: 45 })
  await a.wait(250)
  a.mark('paste')
  await a.key('cmd+v')
  a.put({ pasted: true })
  // Long enough to see what was pasted
  await a.wait(800)
  a.mark('send')
  await a.key('enter')
  a.put({ sent: true, pasted: false, typed: '' })
  // The question sits in the thread long enough to read it
  await a.wait(1300)
  a.mark('reply')
  for (let i = 1; i <= REPLY_WORDS; i++) {
    a.put({ words: i })
    await a.wait(100)
  }
  // And the reply, before the page takes the eye
  await a.wait(900)
  // 2. The page arrives beside the chat; $15 moves the bars
  a.mark('page')
  a.put({ pane: true })
  await a.wait(1300)
  // The cursor's first appearance: it comes in from the right edge
  a.mark('price')
  await a.click({ at: 'seg-15', x: 0.86, y: 0.62 })
  a.put({ price: 1 })
  await a.wait(1400)
  // 3. Down to the decision; the recommended option, then Saved
  a.mark('scroll')
  // Whole rows at the top edge: the last bar of the chart stays in view, its
  // label clear of the edge, and the scroll ends on a whole pixel
  await a.scroll('q1', Math.round(a.rect('decision').y - a.rect('q1').y - 82))
  await a.wait(80)
  a.mark('choose')
  await a.click({ at: 'opt-15', x: 0.96, y: 0.3 })
  a.put({ chosen: true })
  await a.wait(380)
  a.put({ saved: true })
  await a.wait(1000)
  // 4. The question list, Summary, and the reply ready under Copy
  a.mark('menu')
  await a.click({ at: 'switch', x: 0.8, y: 0.86 })
  a.put({ menu: true })
  await a.wait(1000)
  a.mark('summary')
  await a.click({ at: 'link-summary', x: 0.84, y: 0.5 })
  // The list closes first, then Summary takes the pane, so the two never
  // show through each other
  a.put({ menu: false })
  await a.wait(150)
  a.put({ panel: 'summary' })
  await a.wait(300)
  a.mark('copy')
  await a.move({ at: 'copy', x: 0.9, y: 0.8 })
  await a.wait(200)
  a.mark('done')
  await a.wait(2000)
}

// The template's own glyphs
function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden>
      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Step({ dir }: { dir: -1 | 1 }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden>
      <path d={dir < 0 ? 'M10 3.5 5.5 8l4.5 4.5' : 'M6 3.5 10.5 8 6 12.5'} stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HBar({ label, value, width, tone }: { label: string; value: React.ReactNode; width: number; tone: 'hl' | 'bad' }) {
  return (
    <div className={`rd-hbar rd-hbar--${tone}`}>
      <div className="rd-hbar__head">
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <div className="rd-hbar__track">
        <div className="rd-hbar__fill" style={{ width: `${(width * 100).toFixed(1)}%` }} />
      </div>
    </div>
  )
}

export default function ReadmeDemo() {
  return (
    <Stage<S>
      width={838}
      height={524}
      initial={START}
      poster={END}
      play="once"
      script={script}
      keys="bottom-left"
      // Out of shot to the right until the page needs it: beat 1 is the keyboard's
      cursor={{ at: { x: 880, y: 330 }, style: 'large', ripple: true }}
      className="rd"
    >
      {(s) => {
        const draft = s.typed + (s.pasted ? QUOTE : '')
        const onSummary = s.panel === 'summary'
        return (
          <Window className="rd-win">
            <div className="rd-body">
              {/* ---- The chat: a centered column that moves aside for the pane ---- */}
              <div className="rd-chat" data-aside={s.pane || undefined}>
                {/* The kit's chat thread: pinned over the composer, older turns
                    gliding up as the message forms out of the composer and the
                    reply streams in. Earlier turns are placeholder */}
                <Thread app="chat" className="rd-thread">
                  {/* The tail of an earlier answer, then two whole turns: the
                      opening fits the column, later arrivals push it up */}
                  {[
                    [0, '86%', '52%'],
                    [124, '88%', '47%'],
                    [190, '94%', '58%'],
                  ].map(([q, l1, l2], i) => (
                    <div className="rd-past" key={i}>
                      {q ? <Bar w={q as number} h={38} r={19} tone={2} className="rd-past__q" /> : null}
                      <span className="rd-past__line">
                        <Bar w={l1!} h={9} r={4.5} tone={2} />
                      </span>
                      <span className="rd-past__line">
                        <Bar w={l2!} h={9} r={4.5} tone={2} />
                      </span>
                    </div>
                  ))}
                  {s.sent && (
                    <Bubble from="me" source="draft">
                      {ASK}
                      {QUOTE}
                    </Bubble>
                  )}
                  {s.words > 0 && (
                    <Bubble from="them">
                      <Stream text={REPLY} count={s.words} />
                    </Bubble>
                  )}
                </Thread>
                {/* A paste grows it at once, as a text field does: an intended step */}
                <div className="rd-composer" data-filled={draft ? true : undefined} data-snap>
                  <p className="rd-composer__text" data-target="draft" data-empty={draft ? undefined : true}>
                    {draft || <span className="rd-composer__placeholder">Reply…</span>}
                  </p>
                  {/* The button keeps to the composer's foot as the text grows */}
                  <span className="rd-send-slot">
                    <span className="rd-send">
                      <ArrowUp size={18} strokeWidth={2.2} />
                    </span>
                  </span>
                </div>
              </div>

              {/* ---- The decision page, in the pane beside the chat ---- */}
              <div className="rd-page dp" data-open={s.pane || undefined}>
                <div className="dp-topbar">
                  <span className="dp-switch" data-target="switch" data-cursor="hand" data-open={s.menu || undefined}>
                    <Swap id={s.panel} className="dp-switch__q">
                      {onSummary ? 'Summary' : 'Churn'}
                    </Swap>
                    <Chevron />
                  </span>
                  <span className="dp-count">
                    <Swap id={s.panel}>{onSummary ? '4 of 4' : '1 of 4'}</Swap>
                  </span>
                  <span className="dp-nav" data-off={!onSummary || undefined}>
                    <Step dir={-1} />
                  </span>
                  <span className="dp-nav" data-off={onSummary || undefined}>
                    <Step dir={1} />
                  </span>
                </div>

                {/* Question 1, scrolled on its own so Summary opens at its top */}
                <div className="dp-view" data-on={!onSummary || undefined}>
                  <Scroll name="q1" bar="overlay" className="dp-scroller">
                    <div className="dp-main">
                      <div className="dp-q">
                        <p className="dp-bubble">Will customers leave if we raise the price?</p>
                      </div>
                      <div className="dp-answer">
                        <div className="dp-h2">Some will; revenue still grows.</div>
                        <span className="dp-p">
                          <Bar w="96%" h={9} r={4.5} tone={2} />
                        </span>
                        <span className="dp-p">
                          <Bar w="71%" h={9} r={4.5} tone={2} />
                        </span>
                      </div>

                      <div className="dp-block">
                        <div className="dp-block__head">
                          <div className="dp-h3">Price per seat</div>
                          <Segmented
                            items={PRICES}
                            value={s.price}
                            targets={['seg-12', 'seg-15', 'seg-18']}
                            cursor="hand"
                            className="dp-seg"
                          />
                        </div>
                        <div className="dp-hbars">
                          <HBar
                            label="Monthly revenue"
                            value={<Count value={REVENUE[s.price]!} format={(n) => `$${Math.round(n)}k`} duration={480} />}
                            width={REVENUE[s.price]! / REVENUE_MAX}
                            tone="hl"
                          />
                          <HBar
                            label="Teams that leave"
                            value={<Count value={LEAVE[s.price]!} format={(n) => `${Math.round(n)}%`} duration={480} />}
                            width={LEAVE[s.price]! / LEAVE_MAX}
                            tone="bad"
                          />
                        </div>
                      </div>

                      <div className="dp-block dp-decision" data-target="decision">
                        <div className="dp-legend">Which price do we go with?</div>
                        <div className="dp-opts">
                          <div className="dp-opt" data-target="opt-15" data-cursor="hand" data-checked={s.chosen || undefined}>
                            <span className="dp-radio" />
                            <span className="dp-ot">
                              $15 a seat<span className="dp-rec">recommended</span>
                              <span className="dp-od">About 6% of teams leave; revenue grows 17%.</span>
                            </span>
                          </div>
                          <div className="dp-opt" data-cursor="hand">
                            <span className="dp-radio" />
                            <span className="dp-ot">
                              $18 a seat
                              <span className="dp-od">30% of teams leave; revenue barely grows.</span>
                            </span>
                          </div>
                          <div className="dp-opt" data-cursor="hand">
                            <span className="dp-radio" />
                            <span className="dp-ot">Keep $12</span>
                          </div>
                        </div>
                        <div className="dp-save" data-on={s.saved || undefined}>
                          Saved 4:12 PM
                        </div>
                      </div>

                      <div className="dp-block dp-more">
                        <Bar w="42%" h={9} r={4.5} tone={2} />
                      </div>
                    </div>
                  </Scroll>
                </div>

                {/* Summary: the choice, and the reply assembled from it */}
                <div className="dp-view" data-on={onSummary || undefined}>
                  <div className="dp-main">
                    <div className="dp-block">
                      <div className="dp-h3">What you chose</div>
                      <div className="dp-sum">
                        <span className="dp-sum__k">Price per seat</span>
                        <span className="dp-sum__v">$15 a seat</span>
                        <span className="dp-sum__link">Change</span>
                      </div>
                    </div>
                    <div className="dp-block">
                      <div className="dp-block__head">
                        <div className="dp-h3">Draft reply to Sam</div>
                        <span className="dp-btn" data-target="copy" data-cursor="hand">
                          Copy
                        </span>
                      </div>
                      <p className="dp-reply">{DRAFT}</p>
                    </div>
                  </div>
                </div>

                {/* The question list opens under the switcher, as the template does in a narrow pane */}
                <Popover show={s.menu} origin="top left" className="dp-side">
                  <div className="dp-side__head">
                    <div className="dp-side__h1">Team plan price</div>
                    <Bar w="78%" h={8} r={4} tone={2} />
                  </div>
                  <div className="dp-side__rule" />
                  <div className="dp-qnav">
                    <div className="dp-qnav__label">Questions</div>
                    <div className="dp-link" data-current>
                      <span className="dp-link__t">Will customers leave if we raise the price?</span>
                      <span className="dp-link__row">
                        <span className="dp-pill dp-pill--warn">Some will; revenue grows</span>
                        <span className="dp-prog dp-prog--done">{s.chosen ? '✓ decided' : '0 of 1 decided'}</span>
                      </span>
                    </div>
                    <div className="dp-link">
                      <span className="dp-link__t">Who gets the new price, and when?</span>
                      <span className="dp-link__row">
                        <span className="dp-pill dp-pill--neutral">New teams first</span>
                        <span className="dp-prog">0 of 1 decided</span>
                      </span>
                    </div>
                    <div className="dp-link">
                      <span className="dp-link__t">How do we tell customers?</span>
                      <span className="dp-link__row">
                        <span className="dp-pill dp-pill--neutral">An email a month ahead</span>
                        <span className="dp-prog">0 of 1 decided</span>
                      </span>
                    </div>
                    <div className="dp-link dp-link--summary" data-target="link-summary" data-cursor="hand">
                      <span className="dp-link__t">Summary</span>
                      <span className="dp-link__row">
                        <span className="dp-pill dp-pill--info">{s.chosen ? '1 of 3 chosen' : '0 of 3 chosen'}</span>
                      </span>
                    </div>
                  </div>
                </Popover>
              </div>
            </div>
          </Window>
        )
      }}
    </Stage>
  )
}
