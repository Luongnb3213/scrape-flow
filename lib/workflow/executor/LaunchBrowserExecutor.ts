import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';
import { LaunchBrowserTask } from '../task/LaunchBrowser';

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  console.log('Launching browser...');
  try {
    const websiteUrl =
      environment.getInput('Website URL') || 'https://example.com';
    console.log(websiteUrl);
    // console.log(JSON.stringify(environment, null, 4));
    const browser = await puppeteer.launch({
      headless: false, // for testing
    });
    environment.log.info('Browser started successfully');

     environment.setBrowser(browser);
     const page = await browser.newPage();
     await page.goto(websiteUrl)
     environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
