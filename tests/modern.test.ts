import {it,expect} from 'vitest';
import {Game} from '../src/game';
import {kinds} from '../src/pieces';
function settle(g:Game){while(g.valid({...g.active,y:g.active.y+1}))g.down();g.down();g.board=Array.from({length:20},()=>Array(10).fill(null))}
it('draws every piece once in each seven-piece bag',()=>{const g=new Game(()=>0.3);const drawn=[];for(let i=0;i<21;i++){drawn.push(g.active.kind);settle(g)}for(let i=0;i<21;i+=7)expect(drawn.slice(i,i+7).sort()).toEqual([...kinds].sort())});
it('holds once between locks and resets retrieved pose',()=>{const g=new Game(()=>0.3);const first=g.active.kind;const next=g.next;expect(g.hold()).toBe(true);expect(g.held).toBe(first);expect(g.active.kind).toBe(next);expect(g.hold()).toBe(false);settle(g);g.active.rotation=1;g.active.x=2;expect(g.hold()).toBe(true);expect(g.active).toEqual({kind:first,rotation:0,x:3,y:0});g.restart();expect(g.held).toBe(null);expect(g.holdUsed).toBe(false)});
it('ends on blocked hold spawn',()=>{const g=new Game();g.held='O';g.active.y=10;g.board[0][3]='I';g.hold();expect(g.over).toBe(true)});
