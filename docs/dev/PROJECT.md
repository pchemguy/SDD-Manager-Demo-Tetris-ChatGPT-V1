# Browser Tetris

## Purpose and intended users

Develop a single-player browser Tetris game for keyboard players, combining a playable classic baseline with modern piece controls, configurable rules, and a penetrator bonus mechanic. Deliver the simplest sensible playable baseline first, then add the remaining capabilities through bounded phases that each provide a useful functionality increment. The complete scope below is the target product, not a requirement to deliver everything in the first phase.

## Platform and experience

Use TypeScript, the Canvas API for the board, and HTML for the surrounding interface and configuration controls. The game runs in the browser without a backend. Prioritize clear board rendering, responsive keyboard control, understandable state and bonus indicators, and repeatable automated gameplay verification.

Browser selection and isolated provisioning follow the central [browser development policy](../../BROWSER_DEV_POLICY.md). Chromium is the primary target and Firefox is included by default. Framework selection and detailed coverage belong to later design and verification planning.

## Complete product scope

The classic baseline includes a 10×20 board, seven tetrominoes, horizontal movement, rotation, soft drop, gravity, line clearing, score and levels, next-piece preview, pause, restart, and game over.

Add hold, ghost preview, 7-bag piece randomization, wall kicks, and hard drop. The default general locking policy waits one full gravity interval after grounding; hard drop follows the selected general policy unless immediate hard-drop locking is selected.

Provide conditional ghost visibility that hides the preview when any projected cell is above the board's midline and shows it when all projected cells are in the lower half. Always-hidden and always-visible modes are also available.

A four-line clear awards one penetrator bonus, up to three stored bonuses. A hotkey spends one bonus to activate the current falling piece. The piece can pass through occupied cells without destroying them and must lock entirely inside the board without overlapping occupied cells. Hard drop and ghost preview use the same lowest valid landing position under penetrator rules. Render the active penetrator entirely white, reserve other colors for regular pieces, and show one side-panel symbol per available bonus. Update the indicator when bonuses are earned or spent.

The side panel exposes six settings:

1. Ghost visibility: hidden, dynamically hidden above the midline, or visible.
2. Hard drop: on or off.
3. Next-piece preview: on or off.
4. Hard-drop locking: general policy or immediate.
5. General locking: failed downward movement attempt or full gravity interval after grounding.
6. Hold: on or off.

Persist every setting independently through cookies and URL query parameters, with precedence of valid explicit URL value, saved cookie value, then default. Valid explicit URL values update their corresponding cookies, including values equal to defaults. Omitted parameters retain saved cookie values. Player changes update both the corresponding cookie and URL parameter. Session-only controls may be delivered before persistence.

## Accepted gameplay constraints

- Grounded movement and rotation do not reset the lock timer. Becoming airborne cancels it; renewed grounding starts a full interval. Pausing freezes the timer.
- Penetrator activation spends one bonus immediately, cannot be undone or charged twice for the same falling piece, and disables hold for that piece until it locks.
- Invalid URL or cookie values are treated as absent when resolving precedence. Invalid URL values must not overwrite valid saved cookies.
- Visibility and control toggles apply immediately. Locking-policy changes take effect for the next piece.

SPEC will define precise transitions and acceptance scenarios.

## Scope boundaries and remaining design work

Keyboard gameplay and client-side settings persistence are in scope. Multiplayer, backend services, account systems, server leaderboards, and saved in-progress games are outside this brief. Mobile touch controls are a proposed exclusion for confirmation with this brief.

Later design and SPEC must settle exact keys, rotation and wall-kick rules, scoring and speed progression, configuration defaults and parameter names, cookie lifetime, and behavior when persistence is unavailable. They must also define penetrator grounding while crossing occupied cells, behavior when no valid landing exists, spawn/top-out conditions, simultaneous input/timer ordering, and hold/control-toggle boundary cases. Surface materially different gameplay choices before implementation. These details do not block review of the project direction.
