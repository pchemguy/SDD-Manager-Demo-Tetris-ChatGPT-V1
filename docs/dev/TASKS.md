# Implementation tasks

Scope: all phases are authorized under the user’s autonomous instruction of 2026-10-21. [SPEC](SPEC.md), [PLAN](PLAN.md) and [layout](layout.md) own contracts, strategy and paths. Each task includes its tests/docs and one verified closing commit/push. Release each completed integrated phase before activating its successor.

## Phase 1 — Classic baseline

- [x] Phase 1 — Classic baseline
    - [x] Milestone 1.1 — Playable classic game
        - [x] T-001 — Establish isolated tooling and piece geometry
            Scope: package/configuration, src/pieces.ts, tests/pieces.test.ts; central browser policy provisioning. Depends on: none.
            Evidence: Seven distinct four-cell types, rotations and board-coordinate fixtures; reproducible isolated Chromium/Firefox provisioning; relevant tests, build and documentation.
        - [x] T-002 — Implement classic session rules
            Scope: src/game.ts and tests/game.test.ts. Depends on: T-001.
            Evidence: Movement/collision, gravity, failed-down locking, line compaction/scoring, level, pause, restart and game over; relevant tests, build and documentation.
        - [x] T-003 — Build the playable browser interface
            Scope: index.html, src/main.ts, src/render.ts, src/style.css and browser tests. Depends on: T-002.
            Evidence: Native keyboard play, Canvas output, preview/status, focus, pause/restart and 1280×800 layout; relevant tests, build and documentation.
        - [x] T-004 — Verify browser delivery and static packaging
            Scope: tests/browser.spec.ts, scripts/package.py, README, AGENTS and build configuration. Depends on: T-003.
            Evidence: Both browser targets, production build, archive inventory/checksum and actual serving guide; relevant tests, build and documentation.
        - [x] T-005 — Review, test and report milestone 1.1
            Depends on: T-001, T-002, T-003, T-004. Evidence: code review, tests, blocker repairs, TODO disposition and HANDOFF.
            Report: docs/dev/reports/phases/1/1.1.md.
    - [x] Milestone 1.2 — Phase review
        - [x] T-006 — Review, test and report phase 1
            Depends on: T-005 and milestone 1.1 verified closure. Evidence: phase exits, code review, regression/build/package checks and HANDOFF.
            Report: docs/dev/reports/phases/1/PHASE-REPORT.md.

## Phase 2 — Modern controls

- [ ] Phase 2 — Modern controls
    - [x] Milestone 2.1 — Modern piece handling
        - [x] T-007 — Add seven-bag queue and hold
            Scope: src/game.ts and model tests. Depends on: T-006.
            Evidence: Each bag has all seven types; hold swaps/reset/once-per-lock and blocked spawn; relevant tests, build and documentation.
        - [x] T-008 — Implement wall kicks and timed hard drop
            Scope: src/game.ts, src/pieces.ts and model/controller tests. Depends on: T-007.
            Evidence: Ordered kicks, exact grounding timer/reset/pause and hard-drop policies; relevant tests, build and documentation.
        - [x] T-009 — Render shared ghost projection and modern controls
            Scope: src/render.ts, src/main.ts and browser/model tests. Depends on: T-008.
            Evidence: Ghost equals hard drop, midline rule and visible hold/help integration; relevant tests, build and documentation.
        - [x] T-010 — Review, test and report milestone 2.1
            Depends on: T-007, T-008, T-009. Evidence: code review, tests, blocker repairs, TODO disposition and HANDOFF.
            Report: docs/dev/reports/phases/2/2.1.md.
    - [ ] Milestone 2.2 — Phase review
        - [ ] T-011 — Review, test and report phase 2
            Depends on: T-010 and milestone 2.1 verified closure. Evidence: phase exits, code review, regression/build/package checks and HANDOFF.
            Report: docs/dev/reports/phases/2/PHASE-REPORT.md.

## Phase 3 — Penetrator bonuses

- [ ] Phase 3 — Penetrator bonuses
    - [ ] Milestone 3.1 — Penetrating pieces
        - [ ] T-012 — Implement penetrator resources and transit
            Scope: src/game.ts and model tests. Depends on: T-011.
            Evidence: Four-line award/cap, single consumption, hold restriction, lowest valid landing and no overlap lock; relevant tests, build and documentation.
        - [ ] T-013 — Integrate penetrator presentation and controls
            Scope: src/render.ts, src/main.ts, README and browser tests. Depends on: T-012.
            Evidence: White active/locked cells, bonus symbols and P activation with projection/hard drop integration; relevant tests, build and documentation.
        - [ ] T-014 — Review, test and report milestone 3.1
            Depends on: T-012, T-013. Evidence: code review, tests, blocker repairs, TODO disposition and HANDOFF.
            Report: docs/dev/reports/phases/3/3.1.md.
    - [ ] Milestone 3.2 — Phase review
        - [ ] T-015 — Review, test and report phase 3
            Depends on: T-014 and milestone 3.1 verified closure. Evidence: phase exits, code review, regression/build/package checks and HANDOFF.
            Report: docs/dev/reports/phases/3/PHASE-REPORT.md.

## Phase 4 — Configurable persistent rules

- [ ] Phase 4 — Configurable persistent rules
    - [ ] Milestone 4.1 — Settings and persistence
        - [ ] T-016 — Add six session configuration controls
            Scope: src/settings.ts, src/main.ts, src/render.ts, tests/settings.test.ts and browser tests. Depends on: T-015.
            Evidence: All six choices, defaults, live controls, next-piece lock snapshots and form focus; relevant tests, build and documentation.
        - [ ] T-017 — Persist independent settings through cookies and URL
            Scope: src/settings.ts, browser/settings tests and README. Depends on: T-016.
            Evidence: Mixed-source precedence, invalid/duplicate inputs, default-valued URL writes, retained omissions, updates/reload and storage failure warning; relevant tests, build and documentation.
        - [ ] T-018 — Review, test and report milestone 4.1
            Depends on: T-016, T-017. Evidence: code review, tests, blocker repairs, TODO disposition and HANDOFF.
            Report: docs/dev/reports/phases/4/4.1.md.
    - [ ] Milestone 4.2 — Phase review
        - [ ] T-019 — Review, test and report phase 4
            Depends on: T-018 and milestone 4.1 verified closure. Evidence: phase exits, code review, regression/build/package checks and HANDOFF.
            Report: docs/dev/reports/phases/4/PHASE-REPORT.md. Include docs/dev/reports/IMPLEMENTATION-REPORT.md with final TODO aggregation.

## T-001 in progress — provisioning blocked

Working branch: `phase/1-classic-baseline`, created from published preparation merge `37c8a35822cb9171eb7884a9388ce8a5c0826b79`. Phase 1 label, milestones 2/3 and task issues #10–#15 were verified before task edits. T-001 remains unchecked; no implementation task is complete.

Tooling and geometry are pending local changes. Observed RED: two geometry assertions failed against the empty-cell stub; GREEN: all three geometry tests passed and TypeScript checking passed. Dependencies installed successfully. Node 24.19.0, npm 11.9.0 and Python 3.12.14 are available.

Browser provisioning failed with both the initially resolved Playwright build (Chromium 1248) and exact Playwright 1.56.1 (Chromium 1194). The current package lock pins 1.56.1. The CDN returned HTML titled Site Unavailable instead of a ZIP; the official Microsoft fallback returned HTTP 503. Installer retries also reported a stale directory lock. The host rejected escalated execution because sandbox approvals are disabled. No compatible browser executables or archives were found in the supplied primary runtime. No system/personal browser was used. Firefox provisioning and all browser execution remain unverified.

Do not mark this task complete or begin T-002 until compliant isolated Chromium/Firefox provisioning and representative launch evidence succeed. Preserve these pending files; no partial task commit or release has been created. Resume with the pinned runner and central browser policy, reconciling failed-install process/lock state before retry.

## T-001 completion evidence

Recovered on 2026-10-21 under updated browser policy. Pinned Playwright 1.56.1; official image `mcr.microsoft.com/playwright:v1.56.1-noble`, linux/amd64 manifest `sha256:42f02d323c310069b4d54c94bd91a608966a486c3492c48ae0b1cea747ec5ca2`. Manifest/config sizes and SHA-256 verified. Config history locates the sole browser-creating layer; layer size 786741920 and SHA-256 `44acc34a5cf7569816f1cbd047c04ba06ad8face9b0707ca096e78a7d1b856f3` verified before extraction. Extracted only managed shell 1194, Firefox 1495 and FFmpeg 1011 into the absolute project `.browser` directory. Traversal/special entries rejected; selected entries were regular files/directories, no links or whiteouts; executable modes preserved. No later layers modify them. Host executable dependencies resolve.

Independent Firefox GET diagnostics also returned 195-byte HTML (200 text/html), official fallback 503. Chromium 141.0.7390.37 headless shell passed two isolated context/page/click/Canvas-pixel/screenshot/teardown cycles. Firefox 142.0.1 initially stalled creating a page with `uid_map: EPERM`; 30-second whole-process timeout closed the browser and cleaned its profile. Process-local `MOZ_DISABLE_CONTENT_SANDBOX=1` then passed both cycles and clean exit. Config gates this trusted-local-only workaround behind `TETRIS_FIREFOX_SANDBOX=1`. Browser logs contain nonfatal graphics/service warnings; application acceptance is reserved for T-003/T-004. No global browser/security setting changed. Geometry RED/GREEN evidence above remains valid; final three model tests and TypeScript check passed. Full Vite build awaits T-003 entry point.

## T-002 evidence

Observed seven behavior failures against inert model methods before implementation. Final 13 tests pass, including all clear counts, pre-clear scoring, bounds/collisions, rotation, chronological gravity, pause/restart and blocked spawn. TypeScript check passes. Corrected a rotation fixture to y=17 so its intended intermediate pose fits the board. Model owns no DOM/time source; optional RNG enables deterministic scenarios. Browser integration remains T-003.

## T-003 evidence

Both browser scenarios failed on the empty interface before implementation. Both now pass native focused keyboard movement, pause stability, restart/focus, rendered Canvas pixels and 1280×800 overflow checks through the actual Vite server. Production build passes. Screenshot inspection confirms readable controls, visible colored cells and board/sidebar layout. Visibility handler pauses on hiding; native hidden-tab coverage follows in T-004. No OS-window focus claim.

## T-004 evidence

13 model tests, production build and four production-archive browser scenarios pass. ZIP integrity/inventory verified: index, relative JS/CSS, LICENSE, VERSION.json and SERVING.md only; SHA-256 generated. Extracted archive was served with Python and exercised in Chromium/Firefox. Native keyboard/focus and Canvas pixels verified; hidden-page handler tested with modeled visibility events, not a headed OS-window experiment. Browser policy defaults permit headless coverage. Only nonfunctional missing favicon requests and environment npm/color warnings observed. No secrets, dependencies, browser files or source enter the whitelist.

## T-007 evidence

Three new behavioral tests failed before implementation; all 16 model tests and production build now pass. Verified three successive bags, hold guard/retrieval/reset and blocked hold-spawn. Existing classic fixtures now explicitly select their I-piece pose rather than depending on independent random selection. Phase 2 tracking issues #16–#20 and milestones #4/#5 were individually read back after a stale collection response. Phase branch was created from release commit 18fcdc5ad56b5ab340c5e565cd40b0343d0daae6; v0.1.0 publication and both downloaded asset hashes were verified before activation.

## T-008 evidence

Eight new timing/landing/kick assertions failed before implementation (one chronological-equivalence case already passed). All 25 model tests, build and six browser checks now pass. Delayed locking captures a full interval on grounding, retains grounded residuals, cancels in air, freezes on pause and orders deadlines before coincident gravity. Failed-down and immediate hard-drop policies tested. Classic fixtures explicitly select failed mode. Rotation auto-repeat was reproduced in Chromium then fixed; both browser targets verify it. This corrects a baseline input defect identified during phase 2 preparation.

## T-009 evidence

Four ghost tests and the new browser hold scenario failed before implementation. All 29 model tests, production build and eight browser checks pass. Shared landing equality, above/straddling/exact midline cases, native hold guard and hard-drop raster are covered. Screenshot confirms outlined ghost and separate held/next previews. Visibility mode selection UI remains T-016; all three projection modes are modeled now.
