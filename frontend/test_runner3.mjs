import { chromium } from 'playwright';
import path from 'path';

const MOCKUP = 'http://localhost:5174';
const DIR = 'C:\\Users\\bboy1\\.gemini\\antigravity\\brain\\9ab9f4cb-be11-4969-af50-9a71bebbc17c\\CAPTURE';

async function snap(page, name) {
  await page.waitForTimeout(2000); 
  await page.screenshot({ path: path.join(DIR, name), fullPage: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'th-TH' });
  const page = await context.newPage();

  try {
    console.log('Flow 0');
    await page.goto(MOCKUP, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${MOCKUP}/`, { waitUntil: 'networkidle' });
    await snap(page, 'mockup_flow0_01-redirect-login.png');

    console.log('Flow 5');
    await page.goto(`${MOCKUP}/forgot-password`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'test@test.com');
    await snap(page, 'mockup_flow5_01-forgot-password.png');

    await page.goto(`${MOCKUP}/reset-password`, { waitUntil: 'networkidle' });
    const pwInputs = page.locator('input[type="password"]');
    for(let i=0; i < await pwInputs.count(); i++) await pwInputs.nth(i).fill('new123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000); // Wait manually instead of navigation to avoid crash
    await snap(page, 'mockup_flow5_03-login-reset-success.png');

    console.log('Flow 1');
    await page.goto(`${MOCKUP}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.waitForTimeout(3000);
    await snap(page, 'mockup_flow1_01-login-success.png');
    
    await page.goto(`${MOCKUP}/profile`, { waitUntil: 'networkidle' });
    await snap(page, 'mockup_flow1_02-profile.png');
    
    await page.goto(`${MOCKUP}/knowledge-base`, { waitUntil: 'networkidle' });
    await snap(page, 'mockup_flow1_04-kb-list.png');

    await page.goto(`${MOCKUP}/organization`, { waitUntil: 'networkidle' });
    await snap(page, 'mockup_flow6_01-org-settings-edit.png');

    console.log('Flow 3');
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${MOCKUP}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'user@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.waitForTimeout(3000);

    await page.goto(`${MOCKUP}/approvals`, { waitUntil: 'networkidle' });
    await snap(page, 'mockup_flow3_09-blocked-approvals.png');

    console.log('Flow 4');
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${MOCKUP}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'pending@sundae.local');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.waitForTimeout(3000);

    await page.goto(`${MOCKUP}/`, { waitUntil: 'networkidle' });
    await snap(page, 'mockup_flow4_02-lockout-dashboard.png');

    await page.goto(`${MOCKUP}/chat`, { waitUntil: 'networkidle' });
    await snap(page, 'mockup_flow4_03-chat-access.png');

  } catch(e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}
run();
