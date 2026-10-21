# System specification

[PROJECT](PROJECT.md) owns scope, [ARCHITECTURE](ARCHITECTURE.md) owns structure and [DECOMPOSITION](DECOMPOSITION.md) identifies components. This specification owns behavior for the complete product; PLAN schedules delivery subsets.

## S1 — Board and session

The Game owns a 10-column, 20-row board, indexed from zero at the top left. Seven tetromino types each contain four cells. Spawn orientation is zero, x=3, y=0. All occupied cells must be inside the visible board at spawn; overlapping spawn ends the game. Restart clears board, score, lines, hold and bonuses, creates a fresh queue and starts running while retaining settings. Pause freezes all simulation timers and ignores gameplay commands; restart remains available. Hiding the page pauses; returning does not resume automatically.

One row is complete when every column is occupied. On lock, clear all complete rows simultaneously, preserve survivor order and insert empty rows at the top. Award 100/300/500/800 times the pre-clear level for one/two/three/four rows. Level is 1 + floor(total lines/10). Gravity interval is max(100, 1000 - 75*(level-1)) milliseconds. Soft and hard drop award no extra points. Baseline selection samples seven types independently; the modern ruleset draws shuffled bags containing each type once. Random injection supports deterministic tests.

Acceptance: bounds and collision rejection, correct row compaction and scores for one through four lines, level transition, blocked spawn, pause/restart and deterministic queue behavior.

## S2 — Movement, rotation and locking

Left/right moves one cell; down attempts one row. Rotate clockwise in a square matrix (I: 4×4, O: 2×2, others: 3×3). O rotation has no visible change. Normal rotation tries original position; modern wall kicks then try (-1,0), (1,0), (-2,0), (2,0), (0,-1), (0,-2) in that order. This is a defined simple kick system, not SRS. Accept the first legal candidate, otherwise preserve the original pose.

The failed-downward policy locks only on a failed gravity or soft-drop attempt. The delayed policy starts a full current gravity interval when grounded. Grounded horizontal/rotation actions retain the elapsed lock time. Airborne movement cancels the timer; grounding anew starts a full interval. Snapshot the interval at grounding. Advance gravity and lock events in chronological order; elapsed updates must not skip intervening events. A downward landing starts its timer at the landing instant. Commands are processed in event-loop order. Pausing preserves remaining time; hiding the page excludes hidden elapsed time.

Hard drop moves to the lowest reachable landing. Normal pieces cannot pass through filled cells. Under the delayed policy a newly grounded hard drop waits a full interval; a hard drop already grounded does not reset the timer. Under failed-downward policy it waits for a subsequent failed downward attempt. Immediate hard-drop mode locks after placement. Keyboard auto-repeat is accepted only for horizontal movement and soft drop.

Acceptance: exact timing before/at deadline, repeated grounded actions, airborne reset, pause residuals, large elapsed updates, hard-drop policies and rejected rotation.

## S3 — Hold and ghost

Hold stores a type and spawns the next type, or swaps with the stored type. Spawn resets orientation/position and captures locking settings. Hold is allowed once between locks; repeated hold is ignored. Disabling hold preserves its slot and usage guard. An activated penetrator cannot be held. Blocked hold-spawn ends the game.

Ghost and hard drop share one landing query. Dynamic mode hides the entire ghost when any projected occupied cell has y<10. It shows when all cells have y>=10, including the exact boundary. Hidden means no ghost pixels; always-visible still requires a valid projected landing. The ghost is a translucent outline, never a second active piece.

Acceptance: bag permutations across refills, hold once per turn and retrieval, landing equivalence, straddling/exact midline visibility and view toggles.

## S4 — Penetrator

A four-row clear earns one bonus, capped at three. P spends exactly one available bonus to activate the falling piece; zero bonuses, repeated activation, paused/game-over activation are no-ops. Activation lasts until lock. Active and locked penetrator cells are white; ordinary types use nonwhite colors. Available bonus symbols update immediately.

Transit may overlap occupied cells without modifying them. A valid final placement is entirely inside the board and has no occupied-cell overlap. A penetrator's landing is the deepest valid placement at or below its current y, ignoring intermediate occupied cells. A downward transit step is allowed only if a valid placement exists farther below. It becomes grounded at the deepest reachable valid placement; it never locks while overlapping. Movement/rotation must remain inside the board and retain at least one valid placement at or below the proposed pose. Reject candidates with no valid landing, preserving the prior pose. This ensures activation cannot strand an existing valid piece. Vertical boundaries remain solid. Ghost/hard drop use this exact search. General locking policies and the optional immediate hard drop apply identically.

Acceptance: cross multiple blockers without destruction, lowest cavity selection, overlap transit without locking, invalid/no-landing lateral and rotation rejection, resource cap/consumption, hold prohibition, white rendering and bonus symbols.

## S5 — Configuration

The six HTML controls are labeled and usable by keyboard. Parameters and cookie keys use the names below; cookie names add `tetris_`. Values are case-sensitive. Unknown values, empty values and duplicate URL values for a key are treated as absent; unknown unrelated URL parameters are preserved.

| Setting / URL key | Values | Default |
| --- | --- | --- |
| ghost | hide, dynamic, show | show |
| hardDrop | off, on | on |
| preview | off, on | on |
| hardLock | general, immediate | general |
| lock | failed, delay | delay |
| hold | off, on | on |

Resolve each key independently: valid explicit URL value, then valid cookie, then default. Each valid explicit URL value writes the corresponding cookie, even when equal to default. An omitted or invalid URL value does not overwrite a valid cookie. User changes update the in-memory field, corresponding cookie and one canonical URL parameter using history replacement, preserving other settings, unrelated query parameters and the hash. Do not reload or navigate. Cookies use path=/, SameSite=Lax and Max-Age=31536000; add Secure on HTTPS. Decode malformed cookie values safely as invalid. Failed browser persistence preserves gameplay and in-memory selection and displays a warning.

Visibility, preview and control enablement apply immediately. Both lock settings are snapshotted when the next piece spawns, including hold-spawn. Restart retains selected settings and applies them to its first piece. Settings do not save a game. An intermediate session-only panel may omit browser persistence.

Acceptance: mixed-source precedence, URL-default overwrite, omitted-key retention, invalid fallback, duplicates, independent updates, cookies-disabled behavior, reload and URL sharing, focus-safe control use and locking snapshot.

## S6 — Browser interface and distribution

Show board, score, lines, level, next preview, held piece and bonuses, with controls/help. Arrow Left/Right move, Arrow Down soft-drops, Arrow Up or Space rotate, Enter hard-drops, C holds, P activates, Escape pauses/resumes and R restarts. Gameplay shortcuts operate only while the game region is focused; form controls retain their native key behavior. Provide a focusable play region and visible focus indicator. Buttons provide start/restart and pause/resume. Prevent page scrolling for handled gameplay keys only.

Use an animation-driven display with elapsed-time simulation. Score/status and configuration remain HTML text. The layout must fit a 1280×800 desktop viewport without horizontal overflow. Browser automation follows the central [policy](../../BROWSER_DEV_POLICY.md), using Playwright-managed Chromium and Firefox in a project-owned binary directory. Required evidence covers actual native keyboard delivery, settings focus, Canvas non-background pixels, pause and reload; model checks alone do not establish browser acceptance.

Build a static distributable with relative asset URLs. `package.json` is the version authority. Each completed phase publishes a GitHub release after verified two-parent integration into main. Assets are `tetris.zip` and `tetris.zip.sha256`; archive root contains the built index/assets plus LICENSE, a short serving guide and version metadata. Exclude credentials, dependencies, browser binaries and development records. Serve over HTTP(S), not file://. Phase versions are 0.1.0, 0.2.0, 0.3.0 and 1.0.0. Verify build, archive members, checksum and hosted release/asset readback. Comprehensive prerelease review is optional; normal required phase and release checks are mandatory.
