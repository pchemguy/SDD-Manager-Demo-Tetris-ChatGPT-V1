# Browser Tetris

A TypeScript browser Tetris game with modern controls and penetrator bonuses. Configurable rules and URL/cookie persistence are the remaining delivery phase.

The classic baseline is playable. Run `npm run dev`, open the printed local URL and click the board. Arrow keys move/rotate/soft-drop; Space rotates, Esc pauses and R restarts. See the [project brief](docs/dev/PROJECT.md), [preparation tasks](docs/dev/DOCS_TASKS.md), and [workflow handoff](docs/dev/HANDOFF.md).

Development uses [SDD Manager](SDD-MANAGER.md). See the [AI-assisted development disclosure](AI_DISCLOSURE.md).

## Development environment

Use Node.js 22 or newer and `npm ci`. Run `npm test` for model tests and `npx tsc --noEmit` for type checking. Browser automation uses the locked Playwright version and project-owned `.browser` binaries under [BROWSER_DEV_POLICY.md](BROWSER_DEV_POLICY.md).

On Linux, provision with `PLAYWRIGHT_BROWSERS_PATH="$PWD/.browser" node node_modules/playwright/cli.js install --only-shell chromium firefox`. On Windows CMD, set `PLAYWRIGHT_BROWSERS_PATH=%CD%\.browser` before running the same Playwright install command. Browser configuration uses this same contained directory. No global browser installation is required.

On a host diagnosed with Firefox content-process `uid_map: EPERM`, trusted local tests may use `TETRIS_FIREFOX_SANDBOX=1 npm run test:browser`. This opt-in disables Firefox’s internal content sandbox only for that process; re-evaluate on other hosts. See the browser policy for verified official-image recovery when CDN downloads fail.

## Build and distribute

Run `npm run build` then `npm run package`. The archive and SHA-256 file are in `artifacts/`. Extract `tetris.zip` and follow its `SERVING.md`, or host its contents on an HTTP static server. Assets use relative paths; `file://` is unsupported. Source checks: `npm test`, `npm run build`, and `npm run test:browser`.

Classic scoring is 100/300/500/800 × current level for 1/2/3/4 lines. Every ten lines raises the level and gravity speed. Pieces use a shuffled seven-bag queue, simple wall kicks and a full gravity interval of lock delay. Enter hard-drops, C holds once per piece, and an outlined ghost previews the landing. Moving while grounded does not reset lock delay; becoming airborne does. Mobile touch controls are outside scope.

## Penetrator bonuses

Clear four lines at once to earn one lightning bonus, up to three. Press P to spend one and turn the current piece white until it locks. It passes through occupied cells without destroying them; ghost and hard drop seek the deepest valid nonoverlapping landing. Hold is disabled for an activated penetrator. White cells remain white after locking.

Browser integration fixtures use the same controller with deterministic model state and are excluded from the production archive. `TETRIS_PRODUCTION=1` runs the public browser suite against an extracted archive in `artifacts/serve`; the normal development suite additionally exercises the fixtures.
