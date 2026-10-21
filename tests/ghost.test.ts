import { it, expect } from "vitest";
import { Game } from "../src/game";
it("uses the hard-drop projection for ghost", () => {
  const g = new Game();
  expect(g.ghost()).toEqual(g.landing());
  const target = g.ghost();
  g.hardDrop();
  expect(g.active).toEqual(target);
  expect(g.ghost("hide")).toBe(null);
});
it.each([
  [10, false],
  [11, false],
  [12, true],
])("handles barrier row %i at the midline", (barrier, visible) => {
  const g = new Game();
  g.active = { kind: "O", x: 3, y: 0, rotation: 0 };
  g.board[barrier as number][3] = "I";
  expect(Boolean(g.ghost("dynamic"))).toBe(visible);
  expect(g.ghost("show")).not.toBe(null);
});
