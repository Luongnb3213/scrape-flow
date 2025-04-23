import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { exec } from 'child_process';
import { error } from 'console';

const BROWSER_WS =
  'wss://brd-customer-hl_6e9aaa5d-zone-scrape_flow_browser:tb5li8x6lwq1@brd.superproxy.io:9222';


const openDevTools = async (page: any, client: any) => {
   const frameId = page.mainFrame()._id;
   const { url : inspectUrl } = await client.send('Page.inspect', {frameId})
   exec(`open -a "Google Chrome" "${inspectUrl}"`, (error) => {
       if(error) {
           console.error(`Error opening DevTools: ${error.message}`);
       }
   })
   await waitFor(5000);
}

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  console.log('Launching browser...');
  try {
    const websiteUrl =
      environment.getInput('Website URL') || 'https://example.com';
    console.log(websiteUrl);
    // console.log(JSON.stringify(environment, null, 4));
    const browser = await puppeteer.connect({
      browserWSEndpoint: BROWSER_WS,
    });
    environment.log.info('Browser started successfully');

    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.setViewport({
      width: 2560,
      height: 1440,
    });

    const client = await page.createCDPSession();
    await openDevTools(page, client);
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
