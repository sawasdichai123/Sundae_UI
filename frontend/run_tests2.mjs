import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const MOCKUP_URL = 'http://localhost:5174';
const ARTIFACT_DIR = 'C:\\Users\\bboy1\\.gemini\\antigravity\\brain\\9ab9f4cb-be11-4969-af50-9a71bebbc17c\\CAPTURE';

async function takeScreenshot(page, filename) {
  const fullPath = path.join(ARTIFACT_DIR, 'mockup_' + filename);
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`Saved screenshot: ${fullPath}`);
}

async function runTests() {
  console.log('Starting Playwright for Flow 2 & 3...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  try {
    const page = await context.newPage();
    
    // --- Flow 2: Support Role ---
    console.log('--- Flow 2: Support Role ---');
    await page.goto(MOCKUP_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${MOCKUP_URL}/login`);
    await page.fill('input[type="email"]', 'support@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'flow2_01-login-success.png');

    // Allowed Routes
    const allowed = ['/approvals', '/chat', '/create-org', '/profile'];
    for (const route of allowed) {
      await page.goto(`${MOCKUP_URL}${route}`);
      await page.waitForTimeout(1000);
      await takeScreenshot(page, `flow2_allowed${route.replace(/\//g, '-')}.png`);
    }

    // Blocked Routes
    const blocked = ['/knowledge-base', '/bots', '/inbox', '/integration', '/organization'];
    let blockCount = 1;
    for (const route of blocked) {
      await page.goto(`${MOCKUP_URL}${route}`);
      await page.waitForTimeout(1000);
      await takeScreenshot(page, `flow2_0${5+blockCount}-blocked${route.replace(/\//g, '-')}.png`);
      blockCount++;
    }

    // --- Flow 3: Approved User Role ---
    console.log('--- Flow 3: Approved User Role ---');
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${MOCKUP_URL}/login`);
    await page.fill('input[type="email"]', 'user@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'flow3_01-login-success.png');

    const userAllowed = ['/', '/knowledge-base', '/bots', '/inbox', '/integration', '/chat', '/profile'];
    for (const route of userAllowed) {
      await page.goto(`${MOCKUP_URL}${route}`);
      await page.waitForTimeout(1000);
      await takeScreenshot(page, `flow3_allowed${route === '/' ? '-dashboard' : route.replace(/\//g, '-')}.png`);
    }

    // Blocked
    await page.goto(`${MOCKUP_URL}/approvals`);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'flow3_09-blocked-approvals.png');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

runTests();
