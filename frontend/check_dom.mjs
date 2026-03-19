import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to MOCKUP login...');
  await page.goto('http://localhost:5174/login');
  
  console.log('Waiting 2s...');
  await page.waitForTimeout(2000);
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('BODY TEXT LENGTH:', bodyText.length);
  console.log('BODY TEXT PREVIEW:', bodyText.substring(0, 500));
  
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML?.substring(0, 200));
  console.log('ROOT PREVIEW:', rootHtml);

  await browser.close();
}
run();
