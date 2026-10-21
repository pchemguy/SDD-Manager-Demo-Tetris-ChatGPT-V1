/** Tetromino geometry in local square coordinates; rotations are clockwise. */
export type Kind='I'|'O'|'T'|'S'|'Z'|'J'|'L';
export const kinds:Kind[]=['I','O','T','S','Z','J','L'];
const shapes:Record<Kind,string[]>={I:['0000','1111','0000','0000'],O:['11','11'],T:['010','111','000'],S:['011','110','000'],Z:['110','011','000'],J:['100','111','000'],L:['001','111','000']};
export const colors:Record<Kind|'P',string>={P:'#ffffff',I:'#4bd8ea',O:'#f9cf55',T:'#bb8bfa',S:'#6bdd9a',Z:'#fa7f91',J:'#6d9df7',L:'#ffab66'};
/** Return occupied cells, ordered by row then column. No shared array escapes. */
export function cells(kind:Kind,rotation=0):[number,number][]{
 let matrix=shapes[kind].map(r=>[...r]);
 for(let i=0;i<((rotation%4)+4)%4;i++) matrix=matrix[0].map((_,x)=>matrix.map(row=>row[x]).reverse());
 return matrix.flatMap((row,y)=>row.flatMap((v,x)=>v==='1'?[[x,y] as [number,number]]:[]));
}
