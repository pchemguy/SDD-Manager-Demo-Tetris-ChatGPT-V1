# Implementation tasks

Scope: all phases are authorized under the user’s autonomous instruction of 2026-10-21. [SPEC](SPEC.md), [PLAN](PLAN.md) and [layout](layout.md) own contracts, strategy and paths. Each task includes its tests/docs and one verified closing commit/push. Release each completed integrated phase before activating its successor.

## Phase 1 — Classic baseline

- [ ] Phase 1 — Classic baseline
    - [ ] Milestone 1.1 — Playable classic game
        - [ ] T-001 — Establish isolated tooling and piece geometry
            Scope: package/configuration, src/pieces.ts, tests/pieces.test.ts; central browser policy provisioning. Depends on: none.
            Evidence: Seven distinct four-cell types, rotations and board-coordinate fixtures; reproducible isolated Chromium/Firefox provisioning; relevant tests, build and documentation.
        - [ ] T-002 — Implement classic session rules
            Scope: src/game.ts and tests/game.test.ts. Depends on: T-001.
            Evidence: Movement/collision, gravity, failed-down locking, line compaction/scoring, level, pause, restart and game over; relevant tests, build and documentation.
        - [ ] T-003 — Build the playable browser interface
            Scope: index.html, src/main.ts, src/render.ts, src/style.css and browser tests. Depends on: T-002.
            Evidence: Native keyboard play, Canvas output, preview/status, focus, pause/restart and 1280×800 layout; relevant tests, build and documentation.
        - [ ] T-004 — Verify browser delivery and static packaging
            Scope: tests/browser.spec.ts, scripts/package.py, README, AGENTS and build configuration. Depends on: T-003.
            Evidence: Both browser targets, production build, archive inventory/checksum and actual serving guide; relevant tests, build and documentation.
        - [ ] T-005 — Review, test and report milestone 1.1
            Depends on: T-001, T-002, T-003, T-004. Evidence: code review, tests, blocker repairs, TODO disposition and HANDOFF.
            Report: docs/dev/reports/phases/1/1.1.md.
    - [ ] Milestone 1.2 — Phase review
        - [ ] T-006 — Review, test and report phase 1
            Depends on: T-005 and milestone 1.1 verified closure. Evidence: phase exits, code review, regression/build/package checks and HANDOFF.
            Report: docs/dev/reports/phases/1/PHASE-REPORT.md.

## Phase 2 — Modern controls

- [ ] Phase 2 — Modern controls
    - [ ] Milestone 2.1 — Modern piece handling
        - [ ] T-007 — Add seven-bag queue and hold
            Scope: src/game.ts and model tests. Depends on: T-006.
            Evidence: Each bag has all seven types; hold swaps/reset/once-per-lock and blocked spawn; relevant tests, build and documentation.
        - [ ] T-008 — Implement wall kicks and timed hard drop
            Scope: src/game.ts, src/pieces.ts and model/controller tests. Depends on: T-007.
            Evidence: Ordered kicks, exact grounding timer/reset/pause and hard-drop policies; relevant tests, build and documentation.
        - [ ] T-009 — Render shared ghost projection and modern controls
            Scope: src/render.ts, src/main.ts and browser/model tests. Depends on: T-008.
            Evidence: Ghost equals hard drop, midline rule and visible hold/help integration; relevant tests, build and documentation.
        - [ ] T-010 — Review, test and report milestone 2.1
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
