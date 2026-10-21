import {test,expect} from '@playwright/test';
test('keyboard play, pause, restart and visible canvas',async({page})=>{
 await page.goto('/'); const board=page.getByRole('application',{name:'Tetris board'});
 await expect(board).toBeVisible(); await board.focus();
 const raster=()=>board.evaluate((e:HTMLCanvasElement)=>e.toDataURL());
 const before=await raster();await page.keyboard.press('ArrowLeft');expect(await raster()).not.toBe(before);
 await page.keyboard.press('Escape');await expect(page.getByTestId('status')).toHaveText('Paused');
 const paused=await raster();await page.waitForTimeout(1100);expect(await raster()).toBe(paused);
 await page.getByRole('button',{name:'Restart'}).click();await expect(page.getByTestId('status')).toHaveText('Playing');
 await expect(page.getByTestId('score')).toHaveText('0');await expect(board).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const colored=await board.evaluate((e:HTMLCanvasElement)=>{const d=e.getContext('2d')!.getImageData(0,0,e.width,e.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]>350)n++;return n});expect(colored).toBeGreaterThan(1000);
 await page.screenshot({path:test.info().outputPath('game.png')});
});
test('controls stay scoped and hidden-page handler pauses',async({page})=>{
 await page.goto('/');const board=page.getByRole('application',{name:'Tetris board'});
 await page.getByRole('button',{name:'Pause',exact:true}).focus();await page.keyboard.press('Escape');await expect(page.getByTestId('status')).toHaveText('Playing');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});
 await expect(page.getByTestId('status')).toHaveText('Paused');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'))});
 await expect(page.getByTestId('status')).toHaveText('Paused');await board.focus();await page.keyboard.press('Escape');await expect(page.getByTestId('status')).toHaveText('Playing');
});
