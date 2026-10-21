# Physical layout

This map allocates [DECOMPOSITION](DECOMPOSITION.md) to paths and supports [PLAN](PLAN.md). Entries describe intended ownership, not completion.

| Path | Owner and purpose |
| --- | --- |
| src/pieces.ts | Geometry definitions, rotations and kick candidates |
| src/game.ts | Session state, transitions, timer, queue, hold and penetrator |
| src/settings.ts | Types/defaults/parser/resolution and browser persistence adapter |
| src/render.ts | Canvas drawing and display helpers |
| src/main.ts | DOM composition, controls, keyboard and frame lifecycle |
| src/style.css; index.html | Presentation, labeled HTML shell and focusable game region |
| tests/game.test.ts; tests/pieces.test.ts; tests/settings.test.ts | Deterministic rule/geometry/settings fixtures |
| tests/browser.spec.ts | Native browser integration and screenshot/pixel evidence |
| package.json; package-lock.json; tsconfig.json; vite.config.ts; playwright.config.ts | Version authority, locked tooling, build and test configuration |
| scripts/package.py | Build inventory, static ZIP and SHA-256 generation |
| README.md | Verified setup, play, configuration and distribution guidance |
| docs/dev/ | Governing design/spec/plan/tasks, QC and handoff |
| docs/dev/reports/phases/N/ | Milestone and phase code review/verification evidence |
| docs/dev/reports/IMPLEMENTATION-REPORT.md | Final outcomes, limits and TODO aggregation |
| dist/; artifacts/; test-results/; .browser/ | Ignored generated build, release, test evidence and project-owned browser binaries/state |

Game and geometry import no browser APIs. Renderer/controller consume game and settings interfaces. Tests may construct deterministic model states; production code has no test-only global API. Configuration I/O remains isolated from parsing/resolution. Existing root policies, disclosures, LICENSE and bundled agent packages remain intact. Root AGENTS gains validated commands once implementation establishes them.

Playwright configuration and installation both use the same repository-owned `.browser` directory under the central browser policy. Runtime dependencies and generated products are ignored, excluded from distributables and not added to the source tree.
