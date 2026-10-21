# Browser Tetris

A browser Tetris game with seven-bag randomization, hold, ghost projection, wall kicks, hard drop, configurable locking, penetrator bonuses and persistent preferences. Built with TypeScript and Canvas, with HTML controls and no runtime framework.

## Play

Download `tetris.zip` and its checksum from the [releases](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-V1/releases). Extract the archive, run `python3 -m http.server 8080` in that directory (Windows: `py -m http.server 8080`), and open http://localhost:8080. Any HTTP(S) static host works; opening `index.html` through `file://` is unsupported.

Click the board to focus keyboard controls. Controls keep their native behavior while a settings field has focus.

| Key | Action |
| --- | --- |
| Left / Right | Move |
| Up / Space | Rotate clockwise |
| Down | Soft drop |
| Enter | Hard drop |
| C | Hold, once between locks |
| P | Activate penetrator using one bonus |
| Escape | Pause / resume |
| R | Restart |

Clearing 1/2/3/4 lines awards 100/300/500/800 × the current level. Every ten lines increases the level and gravity speed. Hiding the page pauses the game; returning does not automatically resume. Restart clears the game while retaining preferences. Mobile touch controls are outside scope.

## Locking and penetrators

By default, a piece locks one full gravity interval after becoming grounded. Grounded movement/rotation and repeated hard drops do not restart that timer. Becoming airborne cancels it; grounding again starts a full interval. Pause preserves the remaining time. The alternative policy locks on a failed downward attempt. Hard drop follows the general policy unless immediate locking is selected. Locking changes apply at the next spawn, including a hold swap. Wall kicks use the specified ordered offsets, not SRS.

A four-line clear earns one penetrator bonus, up to three. P spends one immediately and turns the current piece white until lock. It passes through occupied cells without destroying them. Ghost and hard drop seek the deepest valid, nonoverlapping landing. Movement that leaves no valid landing is rejected. Hold is disabled during activation; locked penetrator cells stay white. Lightning symbols show available bonuses.

## Settings and sharing

Every setting is independently resolved from a valid URL parameter, then its saved cookie, then its default.

| URL parameter | Values | Default |
| --- | --- | --- |
| `ghost` | `hide`, `dynamic`, `show` | `show` |
| `hardDrop` | `off`, `on` | `on` |
| `preview` | `off`, `on` | `on` |
| `hardLock` | `general`, `immediate` | `general` |
| `lock` | `failed`, `delay` | `delay` |
| `hold` | `off`, `on` | `on` |

Example: `http://localhost:8080/?ghost=dynamic&hardLock=immediate`. Dynamic visibility hides the whole ghost if any landing cell is above row 10 of the 20-row board; a landing wholly in the lower half is shown.

Values are case-sensitive. Invalid, empty or duplicate URL values fall back to the cookie/default for that key. Valid explicit URL values are saved to cookies, including values equal to defaults. Omitted parameters retain saved values. Changing a control updates its cookie and URL parameter without reloading, preserving other parameters and the hash. Cookies use the `tetris_` prefix, one-year expiry, path `/`, SameSite=Lax and Secure on HTTPS. Preferences survive reopening; games are not saved. A persistence warning means current selections still work but may not survive reopening.

## Develop and verify

Use Node.js 24 and `npm ci`. Run `npm run dev` and open the printed local URL. Python 3 is needed for release packaging and the production-package test server.

- `npm test`: deterministic model and settings tests.
- `npm run build`: TypeScript checking and relative-asset production build.
- `npm run test:browser`: Chromium/Firefox public-page checks plus deterministic controller fixtures.
- `npm run package`: create `artifacts/tetris.zip` and `tetris.zip.sha256` from an existing build.

Browser setup follows [BROWSER_DEV_POLICY.md](BROWSER_DEV_POLICY.md). Use the locked Playwright CLI with project-owned binaries. On Linux:

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/.browser" node node_modules/playwright/cli.js install --only-shell chromium firefox
```

On Windows CMD, first run `set PLAYWRIGHT_BROWSERS_PATH=%CD%\.browser`, then the same local CLI command without the leading environment assignment. No global/personal browser is used.

On a host diagnosed with Firefox content-process `uid_map: EPERM`, trusted local tests may use `TETRIS_FIREFOX_SANDBOX=1 npm run test:browser`. This explicitly gated workaround disables Firefox’s internal content sandbox for that process; re-evaluate when the host changes. The browser policy documents verified official-image recovery when CDN downloads fail.

To test a release package, extract it into a clean `artifacts/serve` directory and run `TETRIS_PRODUCTION=1 npm run test:browser` (add the diagnosed Firefox environment switch only where required). This runs public-page tests against the extracted archive. Development fixtures exercise the real controller with deterministic model state and are excluded from distribution. Native keyboard/focus and Canvas pixels are checked; hidden-page handler tests model visibility events rather than headed OS-window behavior.

## Project records

See the [project brief](docs/dev/PROJECT.md), [specification](docs/dev/SPEC.md), [delivery tasks](docs/dev/TASKS.md), and [handoff](docs/dev/HANDOFF.md). Development uses [SDD Manager](SDD-MANAGER.md); see the [AI-assisted development disclosure](AI_DISCLOSURE.md).
