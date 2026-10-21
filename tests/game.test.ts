import {describe,it,expect} from 'vitest';
import {Game} from '../src/game';
import {cells} from '../src/pieces';
const game=()=>new Game(()=>0);
describe('classic session',()=>{
 it('moves within bounds and respects occupied cells',()=>{const g=game();expect(g.move(-1)).toBe(true);for(let i=0;i<20;i++)g.move(-1);expect(g.active.x).toBe(0);g.board[1][4]='O';expect(g.move(1)).toBe(false)});
 it('rotates clockwise only when valid',()=>{const g=game();expect(g.rotate()).toBe(true);expect(g.active.rotation).toBe(1);g.active.y=17;expect(g.rotate()).toBe(true);expect(g.rotate()).toBe(false)});
 it('advances at exact gravity boundaries and locks on failed down',()=>{const g=game();g.tick(999);expect(g.active.y).toBe(0);g.tick(1);expect(g.active.y).toBe(1);g.active.y=18;expect(g.down()).toBe(false);expect(g.board[19].filter(Boolean)).toHaveLength(4);expect(g.active.y).toBe(0)});
 it('compacts lines and scores at the pre-clear level',()=>{const g=game();g.lines=9;g.board[19]=Array(10).fill('O');for(let x=3;x<7;x++)g.board[19][x]=null;g.active.y=18;g.down();expect(g.lines).toBe(10);expect(g.score).toBe(100);expect(g.level).toBe(2);expect(g.board.flat().filter(Boolean)).toHaveLength(0)});
 it.each([2,3,4])('scores %i simultaneous lines',n=>{const g=game();g.active={kind:'I',rotation:1,x:3,y:16};for(let y=20-n;y<20;y++){g.board[y]=Array(10).fill('O');g.board[y][5]=null}g.down();expect(g.lines).toBe(n);expect(g.score).toBe([0,100,300,500,800][n]);expect(g.board.flat().filter(Boolean)).toHaveLength(4-n)});
 it('pauses time and controls; restart clears session',()=>{const g=game();g.pause();g.tick(10000);g.move(1);g.rotate();g.down();expect(g.active).toEqual({kind:'I',x:3,y:0,rotation:0});g.pause();g.tick(1000);expect(g.active.y).toBe(1);g.score=100;g.restart();expect(g.score).toBe(0);expect(g.active.y).toBe(0)});
 it('ends on blocked spawn without overwriting cells',()=>{const g=game();g.board[1][3]='O';g.active.y=18;g.down();expect(g.over).toBe(true);expect(g.board[1][3]).toBe('O');const before=JSON.stringify(g.board);g.tick(50000);expect(JSON.stringify(g.board)).toBe(before)});
 it('processes multiple gravity events and all four-cell shapes',()=>{const g=game();g.tick(3000);expect(g.active.y).toBe(3);expect(cells(g.active.kind)).toHaveLength(4)});
});
