import { Environment, ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmkTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/Fillinput';
import { ClickElementTask } from '../task/ClickElementTask';
import { NavigateUrlTask } from '../task/NavigateUrlTask';

export async function NavigateUrlExcutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  console.log('Fill Input');
  try {
    const url = environment.getInput('URL');
    if (!url) {
      environment.log.error('input->url is not defined');
    }

    await environment.getPage()!.goto(url);
    environment.log.info(`Visited ${url}`);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
