import { Environment, ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmkTask } from '../task/PageToHtml';

export async function PageToHrmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmkTask>
): Promise<boolean> {
  console.log('Page tO  HTML...');
  try {

    const html = await environment.getPage()!.content();
    environment.setOutput('Html', html);
    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
