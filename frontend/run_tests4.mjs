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
  console.log('Starting Playwright for Flow 5 (Reset) and Flow 6...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  try {
    const page = await context.newPage();
    
    // --- Flow 5: Reset password ---
    console.log('--- Flow 5: Reset Password ---');
    await page.goto(`${MOCKUP_URL}/reset-password`);
    await page.waitForTimeout(1000);
    
    // Fill all password fields
    const passwordInputs = page.locator('input[type="password"]');
    const count = await passwordInputs.count();
    for (let i = 0; i < count; i++) {
      await passwordInputs.nth(i).fill('newpassword123');
    }
    
    // Clicking the submit button
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
    await takeScreenshot(page, 'flow5_03-login-reset-success.png');

    // --- Flow 6: Org Flows ---
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
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.count() > 0) {
        await nameInput.fill('New Org Name');
        const saveBtn = page.locator('button:has-text("Save")');
        if (await saveBtn.count() > 0) {
            await saveBtn.click();
        }
    }
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
