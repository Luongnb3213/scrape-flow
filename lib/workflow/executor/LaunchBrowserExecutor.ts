import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment,
): Promise<boolean> {
  console.log('Launching browser...');
  try {
    const websiteUrl = environment.getInput('Website URL') || 'https://example.com';
    console.log(websiteUrl)
    // console.log(JSON.stringify(environment, null, 4));
    const browser = await puppeteer.launch({
      headless: true, // for testing
    });

    await waitFor(3000);
    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
