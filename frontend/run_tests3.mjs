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
  console.log('Starting Playwright for Flow 4, 5, 6...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  try {
    const page = await context.newPage();
    
    // --- Flow 4: Pending User Lockout ---
    console.log('--- Flow 4: Pending User Lockout ---');
    await page.goto(MOCKUP_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${MOCKUP_URL}/login`);
    await page.fill('input[type="email"]', 'pending@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.waitForTimeout(2000);
    
    await page.goto(MOCKUP_URL);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'flow4_02-lockout-dashboard.png');

    await page.goto(`${MOCKUP_URL}/chat`);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'flow4_03-chat-access.png');

    // --- Flow 5: Auth Utility Screens ---
    console.log('--- Flow 5: Auth Utility Screens ---');
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${MOCKUP_URL}/forgot-password`);
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'flow5_01-forgot-password.png');

    await page.goto(`${MOCKUP_URL}/reset-password`);
    await page.fill('input[type="password"]', 'newpassword123'); // first password field
    await page.fill('input[name="confirmPassword"]', 'newpassword123'); // assuming name confirmPassword, else ignore error
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'flow5_02-reset-password.png');

    // --- Flow 6: Org Flows ---
    // Specifically editing name on /organization for Admin
    console.log('--- Flow 6: Org Flows ---');
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${MOCKUP_URL}/login`);
    await page.fill('input[type="email"]', 'admin@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.waitForTimeout(2000);

    await page.goto(`${MOCKUP_URL}/organization`);
    await page.waitForTimeout(1000);
    // try to change naming
    await page.fill('input[name="name"]', 'New Org Name').catch(() => {});
    await page.click('button:has-text("Save")').catch(() => {});
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'flow6_01-org-settings-edit.png');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

runTests();
