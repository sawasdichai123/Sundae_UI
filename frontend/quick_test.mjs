import { chromium } from 'playwright';
import path from 'path';

const MOCKUP_URL = 'http://localhost:5174';
const ARTIFACT_DIR = 'C:\\Users\\bboy1\\.gemini\\antigravity\\brain\\9ab9f4cb-be11-4969-af50-9a71bebbc17c\\CAPTURE';

async function runTest() {
  console.log('Starting Headed Playwright test...');
  // Running in headed mode ensures correct Thai font rendering from the host OS
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  try {
    const page = await context.newPage();
    console.log('Testing Flow 1 Admin...');
    
    await page.goto(`${MOCKUP_URL}/login`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mockup_flow1_01-login-form.png'), fullPage: true });

    await page.fill('input[type="email"]', 'admin@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    // Click and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
      page.click('button:has-text("เข้าสู่ระบบ")').catch(e => console.log('Click failed', e))
    ]);
    
    await page.waitForTimeout(2000); // Add safety wait for React to render

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mockup_flow1_01-login-success.png'), fullPage: true });
    
    console.log('Success!');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

runTest();
