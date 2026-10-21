import { it, expect } from "vitest";
import { Game } from "../src/game";
const setup = (
  lock: "delay" | "failed" = "delay",
  hardLock: "general" | "immediate" = "general",
) => {
  const g = new Game(() => 0, { lock, hardLock });
  g.active = { kind: "O", rotation: 0, x: 3, y: 0 };
  return g;
};
it("hard drops to landing then waits a full interval", () => {
  const g = setup();
  expect(g.landing()?.y).toBe(18);
  g.hardDrop();
  expect(g.active.y).toBe(18);
  g.tick(999);
  expect(g.board.flat().filter(Boolean)).toHaveLength(0);
  g.tick(1);
  expect(g.board.flat().filter(Boolean)).toHaveLength(4);
});
it("does not reset grounded delay for lateral actions or repeated hard drop", () => {
  const g = setup();
  g.hardDrop();
  g.tick(700);
  g.move(1);
  g.rotate();
  g.hardDrop();
  g.tick(300);
  expect(g.board.flat().filter(Boolean)).toHaveLength(4);
});
it("starts full delay on landing between gravity events", () => {
  const g = setup();
  g.active.y = 17;
  g.tick(500);
  g.down();
  g.tick(999);
  expect(g.board.flat().filter(Boolean)).toHaveLength(0);
  g.tick(1);
  expect(g.board.flat().filter(Boolean)).toHaveLength(4);
});
it("cancels delay when airborne and starts anew when grounded", () => {
  const g = setup();
  g.board[18][3] = "I";
  g.active.y = 16;
  g.down();
  g.tick(600);
  g.move(2);
  g.down();
  g.down();
  g.tick(999);
  expect(g.board.flat().filter(Boolean)).toHaveLength(1);
  g.tick(1);
  expect(g.board.flat().filter(Boolean)).toHaveLength(5);
});
it("pause preserves lock residual", () => {
  const g = setup();
  g.hardDrop();
  g.tick(600);
  g.pause();
  g.tick(5000);
  g.pause();
  g.tick(399);
  expect(g.board.flat().filter(Boolean)).toHaveLength(0);
  g.tick(1);
  expect(g.board.flat().filter(Boolean)).toHaveLength(4);
});
it("supports failed-down and immediate hard-drop locking", () => {
  const g = setup("failed");
  g.hardDrop();
  expect(g.board.flat().filter(Boolean)).toHaveLength(0);
  g.down();
  expect(g.board.flat().filter(Boolean)).toHaveLength(4);
  const h = setup("delay", "immediate");
  h.hardDrop();
  expect(h.board.flat().filter(Boolean)).toHaveLength(4);
});
it("normal landing cannot pass occupied cells", () => {
  const g = setup();
  g.board[10][3] = "I";
  expect(g.landing()?.y).toBe(8);
});
it("tries wall kicks in order and rejects fully blocked rotations", () => {
  const g = setup();
  g.active = { kind: "I", rotation: 1, x: -2, y: 3 };
  expect(g.rotate()).toBe(true);
  expect(g.active.x).toBe(0);
  g.board = Array.from({ length: 20 }, () => Array(10).fill("O"));
  const before = { ...g.active };
  expect(g.rotate()).toBe(false);
  expect(g.active).toEqual(before);
});
it("large elapsed updates equal small chronological updates", () => {
  const a = setup(),
    b = setup();
  a.tick(25000);
  for (let i = 0; i < 250; i++) b.tick(100);
  expect(a.board).toEqual(b.board);
  expect(a.active).toEqual(b.active);
});
