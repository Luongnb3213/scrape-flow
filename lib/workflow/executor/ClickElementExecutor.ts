import { Environment, ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmkTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/Fillinput';
import { ClickElementTask } from '../task/ClickElementTask';

export async function ClickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  console.log('Fill Input');
  try {
    const selector = environment.getInput('Selector');
    if (!selector) {
      environment.log.error('input->Selector is not defined');
    }

    await environment.getPage()!.click(selector);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
