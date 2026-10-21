# Delivery plan

Deliver the complete [SPEC](SPEC.md) through four usable increments. Each phase preserves its predecessor and ends with integration and a versioned release. Preparation is separate from implementation. User preapproval covers all human checkpoints and the complete task range; technical gates remain mandatory.

| Phase | Delivery milestone | Useful outcome and scope | Deferred scope | Release |
| --- | --- | --- | --- | --- |
| 1 — Classic baseline | 1.1 — Playable classic game | S1, baseline S2 and S6: board/pieces, gravity, scoring, pause/restart, preview, keyboard UI, contained browser verification and static packaging | S3–S5 and modern S2; baseline failed-downward locking | 0.1.0 |
| 2 — Modern controls | 2.1 — Modern piece handling | S2 delayed locking and kicks; S3 seven-bag, hold, hard drop and ghost with shared projection | Penetrator and configurable browser preferences | 0.2.0 |
| 3 — Penetrator bonuses | 3.1 — Penetrating pieces | S4 resource awards, legal transit/landing, ghost/hard-drop integration and white/bonus display | Settings panel and persistence | 0.3.0 |
| 4 — Configurable persistent rules | 4.1 — Settings and persistence | S5 six controls, live/snapshotted effects, independent URL/cookie precedence and reload; full S1–S6 regression | None within accepted scope | 1.0.0 |

Each phase additionally has a final milestone N.2 — Phase review, containing one phase code review/testing/report task. Each delivery milestone ends with its own review/testing/report task. Phase review starts only after the delivery milestone and all its issues are closed.

## Dependencies and exits

Phase 1 establishes the minimal complete game and provisioning evidence. Phase 2 depends on shared placement and timing boundaries; its controls make a coherent modern play experience. Phase 3 adds one distinct strategic mechanic atop projection/hold/drop. Phase 4 adds user-selectable rules and sharing/restoration; it does not delay the earlier playable releases. Each phase is deliberately one delivery milestone because its outcome is one integrated play experience; artificial subsystem milestones would defer integrated feedback without improving ownership.

Every delivery milestone exits with focused model tests, meaningful browser evidence for changed user paths, updated instructions and a passing production build. Its review assesses code separately from tests, repairs blockers and retains a report and TODO disposition. The phase review verifies all applicable contracts, earlier regressions, current release packaging and cross-component behavior. Phase 4 also aggregates a final implementation report and all unresolved TODOs.

Show a working game by phase 1 UI integration; use native keyboard and Canvas checks to assess usability rather than treating an empty page or model suite as acceptance. For phase 2 inspect controls and ghost consistency; phase 3 exercises penetrator state/model scenarios and rendering; phase 4 exercises real reload persistence and form focus. Browser selection/provisioning follow the central policy. Missing required browser evidence blocks the phase exit.

## Integration and releases

For each phase: complete task commits and verified pushes, close verified issues and milestones, verify an explicit two-parent merge into main and publish it. Then produce the authorized release with fresh notes, version bump, verified static archive/checksum, exact source tag and hosted asset/body readback. Only then activate the next phase. Preserve phase branches and reports. No phase result claims future scope is delivered. Version and package contracts are defined in S6.

## Risks

Timer event ordering, penetrator overlap transit and independent setting precedence need targeted deterministic fixtures plus browser integration. Browser asset downloads and hosted operations can block delivery independently of source correctness; preserve verified results and reconcile uncertain external effects before retrying. Optional comprehensive prerelease review does not replace required phase and package checks.
