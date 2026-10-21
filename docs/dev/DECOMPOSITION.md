# Component decomposition

This document refines [ARCHITECTURE](ARCHITECTURE.md). [SPEC](SPEC.md) owns observable contracts.

| Component | Owns and provides | Requires / excludes | Verification seam |
| --- | --- | --- | --- |
| Piece geometry | Seven shape definitions, orientations, coordinate conversion and rotation kick candidates | No session or browser state | Fixed orientation/collision fixtures |
| Game | Board, active piece, next queue, held type, score/level/lines, timer, state and bonuses; movement/rotation/drop/hold/activation/update/restart methods | Geometry and injected RNG; no rendering, cookies or event registration | Deterministic constructed sessions and elapsed-time updates |
| Settings | Typed defaults, strict value parser, independent source resolution and browser synchronization | Cookie string, URL and write callbacks; no piece mutation | Conflicting/invalid sources and failed browser writes |
| Renderer | Canvas cells, ghost, previews and white penetrator; HTML status text | Model and current visible settings | Pixel evidence plus visible status assertions |
| Controller | Event listeners, focus gating, animation loop, controls and automatic pause | Game, renderer and settings; sole browser lifecycle owner | Native key/focus/visibility and reload tests |

## Collaboration and state lifecycle

The controller loads settings before creating a game. Game construction creates an empty board and first queue. Each animation step advances model time, then renders its resulting state. Keyboard events invoke one game action and redraw. Restart creates a new session retaining selected settings. Pause keeps the board and residual timing unchanged.

Game centralizes placement validation, landing search and lock/clear/spawn transitions. Queue generation starts with independent uniform choices in the classic baseline and adopts seven-bag generation in the modern increment. Hold exchanges types, resets orientation/position and starts a new falling-piece lifecycle; its once-per-turn guard resets only after locking.

Settings resolve each field independently. Browser I/O errors preserve usable in-memory choices and expose a persistence warning. The controller applies live visibility/control settings and passes future locking preferences for the next spawn. The renderer never calculates a competing landing rule.

## Failure boundaries

Invalid movement leaves state unchanged. No bonus or repeated activation leaves resources unchanged. Invalid spawn ends the game. Failed persistence does not stop gameplay. Event listeners are registered once; animation scheduling has one owner. Tests distinguish pure modeled transitions from actual browser event delivery and rendering.
