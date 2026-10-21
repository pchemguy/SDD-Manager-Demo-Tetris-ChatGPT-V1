/** Use project-owned Playwright browsers and isolated test contexts. */
import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH=resolve('.browser');
export default defineConfig({testDir:'tests',testMatch:'browser.spec.ts',use:{headless:true,baseURL:'http://127.0.0.1:4173',viewport:{width:1280,height:800}},projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'firefox',use:{browserName:'firefox',launchOptions:process.env.TETRIS_FIREFOX_SANDBOX==='1'?{env:{...process.env,MOZ_DISABLE_CONTENT_SANDBOX:'1'}}:{}}}],webServer:{command:'npm run dev -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:false}});
