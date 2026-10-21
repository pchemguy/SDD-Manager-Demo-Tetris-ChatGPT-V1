# Browser Tetris

A TypeScript browser game with a classic playable baseline and planned modern controls, penetrator bonuses, and configurable rules with URL/cookie persistence.

The project is in documentation preparation; gameplay is not implemented yet. See the [project brief](docs/dev/PROJECT.md), [preparation tasks](docs/dev/DOCS_TASKS.md), and [workflow handoff](docs/dev/HANDOFF.md).

Development uses [SDD Manager](SDD-MANAGER.md). See the [AI-assisted development disclosure](AI_DISCLOSURE.md).

## Development environment

Use Node.js 22 or newer and `npm ci`. Run `npm test` for model tests and `npx tsc --noEmit` for type checking. Browser automation uses the locked Playwright version and project-owned `.browser` binaries under [BROWSER_DEV_POLICY.md](BROWSER_DEV_POLICY.md).

On Linux, provision with `PLAYWRIGHT_BROWSERS_PATH="$PWD/.browser" node node_modules/playwright/cli.js install --only-shell chromium firefox`. On Windows CMD, set `PLAYWRIGHT_BROWSERS_PATH=%CD%\.browser` before running the same Playwright install command. Browser configuration uses this same contained directory. No global browser installation is required.

On a host diagnosed with Firefox content-process `uid_map: EPERM`, trusted local tests may use `TETRIS_FIREFOX_SANDBOX=1 npm run test:browser`. This opt-in disables Firefox’s internal content sandbox only for that process; re-evaluate on other hosts. See the browser policy for verified official-image recovery when CDN downloads fail.
