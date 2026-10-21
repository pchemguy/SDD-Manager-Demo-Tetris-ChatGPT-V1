import { cells, kinds, type Kind } from './pieces';
export type Piece = { kind: Kind; rotation: number; x: number; y: number };
export type Board = (Kind | null)[][];
const emptyBoard = (): Board => Array.from({ length: 20 }, () => Array(10).fill(null));
/** Deterministic session model. The caller supplies elapsed milliseconds and optional RNG. */
export class Game {
  board = emptyBoard();
  active!: Piece;
  next!: Kind;
  score = 0;
  lines = 0;
  paused = false;
  over = false;
  private elapsed = 0;
  constructor(private random: () => number = Math.random) { this.restart(); }
  get level() { return 1 + Math.floor(this.lines / 10); }
  get interval() { return Math.max(100, 1000 - 75 * (this.level - 1)); }
  private draw(): Kind { return kinds[Math.floor(this.random() * kinds.length)]; }
  coordinates(piece = this.active): [number, number][] {
    return cells(piece.kind, piece.rotation).map(([x, y]) => [x + piece.x, y + piece.y]);
  }
  valid(piece: Piece): boolean {
    return this.coordinates(piece).every(([x, y]) => x >= 0 && x < 10 && y >= 0 && y < 20 && !this.board[y][x]);
  }
  private spawn() {
    this.active = { kind: this.next, rotation: 0, x: 3, y: 0 };
    this.next = this.draw();
    this.elapsed = 0;
    this.over = !this.valid(this.active);
  }
  private attempt(piece: Piece) {
    if (this.paused || this.over || !this.valid(piece)) return false;
    this.active = piece;
    return true;
  }
  move(dx: number) { return this.attempt({ ...this.active, x: this.active.x + dx }); }
  rotate() { return this.attempt({ ...this.active, rotation: (this.active.rotation + 1) % 4 }); }
  down() {
    if (this.paused || this.over) return false;
    if (this.attempt({ ...this.active, y: this.active.y + 1 })) return true;
    this.lock();
    return false;
  }
  private lock() {
    for (const [x, y] of this.coordinates()) this.board[y][x] = this.active.kind;
    const remaining = this.board.filter(row => row.some(cell => !cell));
    const cleared = 20 - remaining.length;
    this.score += [0, 100, 300, 500, 800][cleared] * this.level;
    this.lines += cleared;
    this.board = [...Array.from({ length: cleared }, () => Array(10).fill(null)), ...remaining];
    this.spawn();
  }
  /** Consume chronological gravity events; pausing preserves the fractional interval. */
  tick(ms: number) {
    if (this.paused || this.over || !Number.isFinite(ms) || ms <= 0) return;
    while (ms > 0 && !this.over) {
      const step = Math.min(ms, this.interval - this.elapsed);
      ms -= step; this.elapsed += step;
      if (this.elapsed >= this.interval) { this.elapsed = 0; this.down(); }
    }
  }
  pause() { if (!this.over) this.paused = !this.paused; }
  restart() {
    this.board = emptyBoard(); this.score = 0; this.lines = 0; this.paused = false; this.over = false;
    this.next = this.draw(); this.spawn();
  }
}
