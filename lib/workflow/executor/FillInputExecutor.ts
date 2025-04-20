import { Environment, ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmkTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/Fillinput';

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  console.log('Fill Input');
  try {
    const selector = environment.getInput('Selector');
    if (!selector) {
      environment.log.error('input->Selector is not defined');
    }
    const value = environment.getInput('Value');
    if (!value) {
      environment.log.error('input->Value is not defined');
    }

    await environment.getPage()!.type(selector, value);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
