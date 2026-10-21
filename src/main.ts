import './style.css';
import {Game} from './game';
import {render,preview} from './render';
/** Mount one game session; tests may supply a deterministic model without production debug hooks. */
export function mount(game=new Game()){
document.querySelector('#app')!.innerHTML=`
<header><a class="brand" href="./"><span class="brand-icon">▦</span> ORBIT <span>ARCADE</span></a><span class="edition">03 / PENETRATOR</span></header>
<main><section class="intro"><p class="eyebrow">A LITTLE ORDER IN THE CHAOS</p><h1>One more line.</h1><p>Find your rhythm. Make room for what comes next.</p></section>
<div class="play-layout"><section class="board-wrap"><div class="board-top"><span>TETRIS</span><span class="status" data-testid="status"></span></div><canvas id="board" width="300" height="600" tabindex="0" role="application" aria-label="Tetris board" aria-describedby="controls">Keyboard-controlled Tetris board.</canvas><p class="focus-note">Click the board to play · Esc to pause</p></section>
<aside><section class="panel score-panel"><p class="eyebrow">SCORE</p><div class="score" data-testid="score">0</div><div class="stats"><div><span>LEVEL</span><strong id="level">1</strong></div><div><span>LINES</span><strong id="lines">0</strong></div></div></section>
<section class="panel piece-panel"><div><h2>Up next</h2><canvas id="next" width="96" height="80" aria-label="Next piece"></canvas></div><div><h2>Hold · C</h2><canvas id="held" width="96" height="80" aria-label="Held piece"></canvas><span data-testid="held-name">Empty</span></div></section>
<section class="panel bonus-panel"><div><h2>Penetrator · P</h2><p>Clear four lines to earn a bonus.</p></div><div data-testid="bonuses" aria-label="Available penetrator bonuses">—</div></section><section class="panel" id="controls"><h2>Your controls</h2><dl><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Move</dd><dt><kbd>↑</kbd> / <kbd>Space</kbd></dt><dd>Rotate</dd><dt><kbd>↓</kbd></dt><dd>Soft drop</dd><dt><kbd>Enter</kbd></dt><dd>Hard drop</dd><dt><kbd>C</kbd></dt><dd>Hold</dd><dt><kbd>Esc</kbd></dt><dd>Pause</dd><dt><kbd>R</kbd></dt><dd>Restart</dd></dl></section>
<div class="actions"><button id="pause">Pause</button><button id="restart">Restart</button></div></aside></div></main><footer>Small moves. Clear possibilities.</footer>`;
const board=document.querySelector<HTMLCanvasElement>('#board')!;
const next=document.querySelector<HTMLCanvasElement>('#next')!;
function draw(){document.querySelector('[data-testid=bonuses]')!.textContent='⚡'.repeat(game.bonuses)||'—';render(game,board);preview(game.next,next);preview(game.held,document.querySelector<HTMLCanvasElement>('#held')!);document.querySelector('[data-testid=held-name]')!.textContent=game.held??'Empty';document.querySelector('[data-testid=score]')!.textContent=String(game.score);document.querySelector('#level')!.textContent=String(game.level);document.querySelector('#lines')!.textContent=String(game.lines);document.querySelector('[data-testid=status]')!.textContent=game.over?'Game over':game.paused?'Paused':'Playing';document.querySelector('#pause')!.textContent=game.paused?'Resume':'Pause'}
let last=performance.now();
function advance(now:number){game.tick(now-last);last=now;draw()}
board.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(!['arrowleft','arrowright','arrowup','arrowdown',' ','escape','r','enter','c','p'].includes(key))return;e.preventDefault();if(e.repeat&&!['arrowleft','arrowright','arrowdown'].includes(key))return;advance(performance.now());if(key==='arrowleft')game.move(-1);if(key==='arrowright')game.move(1);if(key==='arrowup'||key===' ')game.rotate();if(key==='arrowdown')game.down();if(key==='enter')game.hardDrop();if(key==='c')game.hold();if(key==='p')game.activate();if(key==='escape'&&!e.repeat)game.pause();if(key==='r'&&!e.repeat)game.restart();draw()});
document.querySelector('#pause')!.addEventListener('click',()=>{advance(performance.now());game.pause();draw();board.focus()});
document.querySelector('#restart')!.addEventListener('click',()=>{game.restart();last=performance.now();draw();board.focus()});
document.addEventListener('visibilitychange',()=>{advance(performance.now());if(document.hidden&&!game.paused&&!game.over)game.pause();draw()});
function frame(now:number){advance(now);requestAnimationFrame(frame)}
draw();requestAnimationFrame(frame);

}
if(document.querySelector('#app'))mount();
