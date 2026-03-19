import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const MOCKUP_URL = 'http://localhost:5174';
const SUNDAE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:\\Users\\bboy1\\.gemini\\antigravity\\brain\\9ab9f4cb-be11-4969-af50-9a71bebbc17c\\CAPTURE';

async function takeScreenshot(page, route, filename, isMockup = true) {
  const prefix = isMockup ? 'mockup_' : 'sundae_';
  const fullPath = path.join(ARTIFACT_DIR, prefix + filename);
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`Saved screenshot: ${fullPath}`);
}

async function runTests() {
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  try {
    // ---- MOCKUP APP ---
    console.log('--- Testing Mockup (5174) ---');
    const page = await context.newPage();
    
    // Flow 0 - Clean Start
    console.log('Flow 0 - Clean Start');
    await page.goto(MOCKUP_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1000); // wait for redirect
    await takeScreenshot(page, '/login', 'flow0_01-redirect-login.png', true);

    // Flow 1 - Admin Login
    console.log('Flow 1 - Admin Role Full Navigation');
    await page.goto(`${MOCKUP_URL}/login`);
    await page.fill('input[type="email"]', 'admin@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.waitForTimeout(2000); // wait for dashboard reload
    await takeScreenshot(page, '/', 'flow1_01-login-success.png', true);

    await page.goto(`${MOCKUP_URL}/profile`);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '/profile', 'flow1_02-profile.png', true);

    await page.goto(`${MOCKUP_URL}/knowledge-base`);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '/knowledge-base', 'flow1_04-kb-list.png', true);

    // ---- SUNDAE APP ---
    console.log('--- Testing Sundae (5173) ---');
    const page2 = await context.newPage();
    await page2.goto(SUNDAE_URL);
    await page2.waitForTimeout(2000);
    await takeScreenshot(page2, '/', 'flow0_sundae_home.png', false);
    
    await page2.goto(`${SUNDAE_URL}/login`);
    await page2.waitForTimeout(1000);
    await takeScreenshot(page2, '/login', 'flow1_sundae_login.png', false);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

runTests();
