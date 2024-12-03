import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Perform any necessary setup
  await page.goto('http://localhost:3000');
  
  await browser.close();
}

export default globalSetup;