import {test,expect} from '@playwright/test';
test('earn, spend and render penetrator through the real controller',async({page})=>{
 await page.goto('/tests/fixtures/penetrator.html');const board=page.getByRole('application',{name:'Tetris board'});await board.focus();await page.keyboard.press('Enter');
 const bonuses=page.getByTestId('bonuses');await expect(bonuses).toHaveText('⚡');await page.keyboard.press('p');await expect(bonuses).toHaveText('—');
 const white=(top:number)=>board.evaluate((e:HTMLCanvasElement,y)=>{const d=e.getContext('2d')!.getImageData(0,y,300,100).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]===255&&d[i+1]===255&&d[i+2]===255)n++;return n},top);
 expect(await white(0)).toBeGreaterThan(1000);await page.keyboard.press('c');await expect(page.getByTestId('held-name')).toHaveText('Empty');await page.keyboard.press('Enter');await page.waitForTimeout(1100);expect(await white(500)).toBeGreaterThan(1000);await expect(bonuses).toHaveText('—');
});
