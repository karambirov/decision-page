import { Stage, Phone, Bar, Badge, Count, Icon, Connector, type Act } from '../../kit'
import './stuck.css'

// Example scene for decision-page (made-up shop and numbers). A product screen right
// after the person closed a previous checkout. Story in four beats:
// 1. a tap on the checkout button (context: the product card, its sticky button);
// 2. instead of checkout, a feedback survey from the previous session slides up:
//    it won the race for the screen;
// 3. the survey is closed, the product screen is back;
// 4. the button is tapped again and again: nothing opens, and every tap lands in the
//    error tracker as one more event of the same issue (the satellite's count rolls).
// The payoff holds: the button is there, checkout never comes, the count keeps growing.
// It plays once; the host's replay button remounts it.
//
// Real strings only on the key elements: the button, the survey title and its button,
// the issue title and its counter. Everything else is a grey bar.

type S = { sheet: boolean; taps: number }

const START: S = { sheet: false, taps: 0 }
// Made-up starting figures for the issue; each dead tap adds an event, the person counts once
const EVENTS = 48210
const USERS = 6870

const script = async (a: Act<S>) => {
  await a.wait(1000)
  a.mark('tap')
  await a.click('buy')
  // Checkout starts; the survey from the last session is presented first
  await a.wait(320)
  a.put({ sheet: true })
  await a.wait(1700)
  a.mark('close')
  await a.click('close')
  a.put({ sheet: false })
  await a.wait(900)
  for (let i = 1; i <= 4; i++) {
    if (i === 1) a.mark('retap')
    await a.click('buy')
    a.put({ taps: i })
    await a.wait(i === 1 ? 950 : 620)
  }
  a.mark('payoff')
  await a.wait(2200)
}

function ProductMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <path d="M3 5.5 8 3l5 2.5v5L8 13l-5-2.5v-5Z M3 5.5 8 8l5-2.5M8 8v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export default function DeadButton() {
  return (
    <Stage<S>
      width={700}
      height={440}
      compact={{ below: 520, width: 358, height: 470 }}
      initial={START}
      poster={{ sheet: false, taps: 4 }}
      play="once"
      script={script}
      cursor={{ at: { wide: { x: 300, y: 330 }, compact: { x: 250, y: 380 } }, style: 'touch', ripple: true }}
      className="sb"
    >
      {(s, rect, layout) => {
        const buy = rect('buy')
        const issue = rect('issue')
        return (
        <>
          <Phone width={layout === 'compact' ? 300 : 360} className="sb-phone">
            <div className="sb-screen">
              {/* The product: a card and a few detail rows above the sticky footer */}
              <div className="sb-card sb-card--segment">
                <span className="sb-seg">
                  <span className="sb-seg__mark">
                    <ProductMark />
                  </span>
                  <span className="sb-seg__lines">
                    <Bar w={150} h={13} r={4} tone={5} />
                    <Bar w={96} h={8} r={4} tone={3} />
                  </span>
                </span>
                <span className="sb-seg__times">
                  <Bar w={64} h={18} r={5} tone={5} />
                  <span className="sb-seg__track" />
                  <Bar w={64} h={18} r={5} tone={5} />
                </span>
                <span className="sb-seg__meta">
                  <Bar w={110} h={8} r={4} tone={2} />
                  <Bar w={84} h={8} r={4} tone={2} />
                </span>
              </div>
              <div className="sb-card sb-card--rows">
                {[
                  [118, 46],
                  [92, 58],
                  [134, 40],
                ].map(([l, v], i) => (
                  <span key={i} className="sb-row">
                    <span className="sb-row__dot" />
                    <Bar w={l} h={9} r={4} tone={3} />
                    <span className="sb-row__val">
                      <Bar w={v} h={9} r={4} tone={2} />
                    </span>
                  </span>
                ))}
              </div>

              <footer className="sb-foot">
                <span className="sb-buy" data-target="buy">
                  Checkout · $34.90
                </span>
              </footer>

              {/* The feedback survey from the previous session */}
              <div className="sb-dim" data-show={s.sheet || undefined} />
              <div className="sb-sheet" data-open={s.sheet || undefined}>
                <span className="sb-sheet__close" data-target="close">
                  <Icon name="close" size={14} stroke={2} />
                </span>
                <span className="sb-sheet__title">How was your last purchase?</span>
                <span className="sb-sheet__scores">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="sb-score" />
                  ))}
                </span>
                <span className="sb-sheet__labels">
                  <Bar w={54} h={8} r={4} tone={2} />
                  <Bar w={62} h={8} r={4} tone={2} />
                </span>
                <span className="sb-sheet__send">Send</span>
              </div>
            </div>
          </Phone>

          {/* The error tracker: the same issue, one event per tap */}
          <div className="sb-issue" data-target="issue" data-hit={s.taps > 0 || undefined}>
            <span className="sb-issue__head">
              <Badge tone="danger" dot>
                error
              </Badge>
              <span className="sb-issue__team">last 30 days</span>
            </span>
            <span className="sb-issue__title">Repeated “Checkout” tap</span>
            <span className="sb-issue__stats">
              <span className="sb-stat">
                <span className="sb-stat__value">
                  <Count value={EVENTS + s.taps} duration={360} format={(n) => Math.round(n).toLocaleString('en-US')} />
                </span>
                <span className="sb-stat__label">events</span>
              </span>
              <span className="sb-stat">
                <span className="sb-stat__value">
                  <Count value={USERS + (s.taps > 0 ? 1 : 0)} duration={360} format={(n) => Math.round(n).toLocaleString('en-US')} />
                </span>
                <span className="sb-stat__label">people</span>
              </span>
            </span>
          </div>

          {/* Each dead tap is one more event of the issue */}
          {layout === 'wide' && buy && issue && (
            <Connector
              from={{ x: buy.x + buy.width - 14, y: buy.y + buy.height / 2 }}
              to={{ x: issue.x, y: issue.y + issue.height - 34 }}
              route="curve"
              dots="both"
              show={s.taps > 0}
              className="sb-link"
            />
          )}
        </>
        )
      }}
    </Stage>
  )
}
