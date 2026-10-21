import {describe,it,expect} from 'vitest';
import {cells,kinds} from '../src/pieces';
describe('tetromino geometry',()=>{
 it('contains four distinct cells in every orientation',()=>{for(const k of kinds)for(let r=0;r<4;r++){const c=cells(k,r);expect(c).toHaveLength(4);expect(new Set(c.map(String)).size).toBe(4);}});
 it('rotates the I into a vertical column and cycles',()=>{expect(cells('I',1)).toEqual([[2,0],[2,1],[2,2],[2,3]]);expect(cells('I',4)).toEqual(cells('I',0));});
 it('keeps the square fixed',()=>expect(cells('O',1)).toEqual(cells('O',0)));
});
