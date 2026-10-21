# Architecture

The [project brief](PROJECT.md) defines the complete product. A single browser application owns one game session; no server participates.

## Blocks and dependencies

| Block | Responsibility | Dependencies |
| --- | --- | --- |
| Game model | Board, falling piece, queue, hold, score, bonuses and transitions | Piece geometry and injected random source; no browser APIs |
| Application controller | Translate keyboard and clock events into model actions; coordinate settings and restart | Model, settings adapter, view |
| View | Canvas board/preview/hold and HTML status, controls and feedback | Read-only model snapshots and settings |
| Settings | Validate six preferences; resolve sources and synchronize URL/cookies | Small browser adapter; no board dependency |

The controller is the composition root. Input and elapsed-time events run serially on the browser event loop. The model alone changes gameplay state. Rendering never advances simulation. Settings changes are validated at the boundary; lock policies are captured when a new piece spawns, while view/control switches remain live.

## Timing and geometry

Use elapsed simulation time rather than counting animation frames. Pause and hidden-page suspension exclude elapsed time. All downward actions share grounding and locking logic; hard drop changes position but normally preserves the general delay policy. Randomness is injectable so tests can reproduce sequences.

Normal collision and penetrator transit are distinct predicates. Final placement always uses normal nonoverlap validation. A shared landing query serves ghost and hard drop, preventing preview disagreement. Penetrator eligibility, consumption and hold restrictions belong to the model rather than input handlers.

## Tooling and verification

Use Vite for TypeScript development and static production builds, Vitest for model/settings tests and Playwright for browser integration. Browser setup obeys the repository's central policy, using contained Playwright-managed Chromium and Firefox. Tests exercise the production application, keyboard focus, visible Canvas output, reload persistence and pause behavior. Test-only scenarios can construct model states through module interfaces; the production UI exposes no debug backdoor.

## Tradeoffs and invariants

Canvas makes grid rendering straightforward; HTML keeps controls labeled and keyboard-accessible. A small mutable model with explicit action methods avoids framework and state-store overhead. Snapshots are consumed synchronously; the view must not mutate the board. Module separation supports independent geometry and persistence checks without duplicating game rules. Cookies store preferences only, never a saved game. Generated build/browser assets remain outside tracked source.
