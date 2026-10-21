import {Game} from './game';
import {cells,colors,type Kind} from './pieces';
/** Canvas projection only: never advances or mutates the model. */
export function render(game:Game,canvas:HTMLCanvasElement) {
 const c=canvas.getContext('2d')!;const size=canvas.width/10;
 c.fillStyle='#0a1220';c.fillRect(0,0,canvas.width,canvas.height);
 c.strokeStyle='#152338';c.lineWidth=1;
 for(let x=0;x<=10;x++){c.beginPath();c.moveTo(x*size,0);c.lineTo(x*size,canvas.height);c.stroke()}
 for(let y=0;y<=20;y++){c.beginPath();c.moveTo(0,y*size);c.lineTo(canvas.width,y*size);c.stroke()}
 const block=(x:number,y:number,color:string)=>{c.fillStyle=color;c.fillRect(x*size+2,y*size+2,size-4,size-4);c.fillStyle='#ffffff30';c.fillRect(x*size+2,y*size+2,size-4,3)};
 game.board.forEach((row,y)=>row.forEach((kind,x)=>{if(kind)block(x,y,colors[kind])}));
 if(!game.over)game.coordinates().forEach(([x,y])=>block(x,y,colors[game.active.kind]));
 if(game.paused||game.over){c.fillStyle='#07101bdd';c.fillRect(0,0,canvas.width,canvas.height);c.textAlign='center';c.fillStyle='#eef4ff';c.font='600 24px system-ui';c.fillText(game.over?'Game over':'Paused',canvas.width/2,canvas.height/2);c.font='14px system-ui';c.fillText(game.over?'Press R to play again':'Escape to resume',canvas.width/2,canvas.height/2+30)}
}
export function preview(kind:Kind,canvas:HTMLCanvasElement){
 const c=canvas.getContext('2d')!;c.clearRect(0,0,canvas.width,canvas.height);c.fillStyle=colors[kind];
 const points=cells(kind);const width=Math.max(...points.map(p=>p[0]))+1;
 for(const [x,y] of points)c.fillRect((canvas.width-width*24)/2+x*24,y*24+8,21,21);
}
