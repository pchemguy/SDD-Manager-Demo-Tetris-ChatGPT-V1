import { cells, kinds, type Kind } from './pieces';
export type Piece = { kind: Kind; rotation: number; x: number; y: number };
export type Rules={lock:'failed'|'delay';hardLock:'general'|'immediate'};
export type Board = (Kind | null)[][];
const emptyBoard = (): Board => Array.from({ length: 20 }, () => Array(10).fill(null));
/** Deterministic session model. The caller supplies elapsed milliseconds and optional RNG. */
export class Game {
  board = emptyBoard();
  active!: Piece;
  next!: Kind;
  held: Kind | null = null;
  holdUsed = false;
  private bag: Kind[] = [];
  hold() {
    if (this.paused || this.over || this.holdUsed) return false;
    const previous = this.held;
    this.held = this.active.kind;
    this.spawn(previous ?? undefined);
    this.holdUsed = true;
    return true;
  }
  score = 0;
  lines = 0;
  paused = false;
  over = false;
  private elapsed = 0;
  private lockRemaining: number | null = null;
  private pieceRules!: Rules;
  /** Shared normal landing search; blockers stop the descent. */
  landing(piece = this.active): Piece | null {
    if (!this.valid(piece)) return null;
    let target = { ...piece };
    while (this.valid({ ...target, y: target.y + 1 })) target.y++;
    return target;
  }
  ghost(mode:'hide'|'dynamic'|'show'='show'):Piece|null {
    if (mode === 'hide' || this.over) return null;
    const target = this.landing();
    if (target && mode === 'dynamic' && this.coordinates(target).some(([,y]) => y < 10)) return null;
    return target;
  }
  hardDrop() {
    if (this.paused || this.over) return false;
    const target = this.landing();
    if (!target) return false;
    this.active = target; this.syncGround();
    if (this.pieceRules.hardLock === 'immediate') this.lock();
    return true;
  }
  private syncGround() {
    if (this.pieceRules.lock !== 'delay' || this.valid({ ...this.active, y: this.active.y + 1 })) {
      this.lockRemaining = null;
    } else if (this.lockRemaining === null) this.lockRemaining = this.interval;
  }
  constructor(private random: () => number = Math.random, public rules:Rules={lock:'delay',hardLock:'general'}) { this.restart(); }
  get level() { return 1 + Math.floor(this.lines / 10); }
  get interval() { return Math.max(100, 1000 - 75 * (this.level - 1)); }
  private draw(): Kind {
    if (!this.bag.length) {
      this.bag = [...kinds];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(this.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    return this.bag.shift()!;
  }
  coordinates(piece = this.active): [number, number][] {
    return cells(piece.kind, piece.rotation).map(([x, y]) => [x + piece.x, y + piece.y]);
  }
  valid(piece: Piece): boolean {
    return this.coordinates(piece).every(([x, y]) => x >= 0 && x < 10 && y >= 0 && y < 20 && !this.board[y][x]);
  }
  private spawn(kind?: Kind) {
    this.active = { kind: kind ?? this.next, rotation: 0, x: 3, y: 0 };
    if (!kind) this.next = this.draw();
    this.elapsed = 0; this.lockRemaining = null; this.pieceRules = { ...this.rules };
    this.over = !this.valid(this.active);
    if (!this.over) this.syncGround();
  }
  private attempt(piece: Piece) {
    if (this.paused || this.over || !this.valid(piece)) return false;
    this.active = piece; this.syncGround();
    return true;
  }
  move(dx: number) { return this.attempt({ ...this.active, x: this.active.x + dx }); }
  rotate() {
    for (const [dx, dy] of [[0,0],[-1,0],[1,0],[-2,0],[2,0],[0,-1],[0,-2]]) {
      if (this.attempt({ ...this.active, rotation: (this.active.rotation + 1) % 4,
        x: this.active.x + dx, y: this.active.y + dy })) return true;
    }
    return false;
  }
  down() {
    if (this.paused || this.over) return false;
    if (this.attempt({ ...this.active, y: this.active.y + 1 })) return true;
    if (this.pieceRules.lock === 'failed') this.lock();
    else this.syncGround();
    return false;
  }
  private lock() {
    for (const [x, y] of this.coordinates()) this.board[y][x] = this.active.kind;
    const remaining = this.board.filter(row => row.some(cell => !cell));
    const cleared = 20 - remaining.length;
    this.score += [0, 100, 300, 500, 800][cleared] * this.level;
    this.lines += cleared;
    this.board = [...Array.from({ length: cleared }, () => Array(10).fill(null)), ...remaining];
    this.holdUsed = false;
    this.spawn();
  }
  /** Consume chronological gravity events; pausing preserves the fractional interval. */
  tick(ms: number) {
    if (this.paused || this.over || !Number.isFinite(ms) || ms <= 0) return;
    this.syncGround();
    while (ms > 0 && !this.over) {
      const step = Math.min(ms, this.interval - this.elapsed, this.lockRemaining ?? Infinity);
      ms -= step; this.elapsed += step;
      if (this.lockRemaining !== null) this.lockRemaining -= step;
      if (this.lockRemaining === 0) { this.lock(); continue; }
      if (this.elapsed >= this.interval) { this.elapsed = 0; this.down(); }
    }
  }

  pause() { if (!this.over) this.paused = !this.paused; }
  restart() {
    this.board = emptyBoard(); this.score = 0; this.lines = 0; this.paused = false; this.over = false;
    this.bag = []; this.held = null; this.holdUsed = false;
    this.next = this.draw(); this.spawn();
  }
}
