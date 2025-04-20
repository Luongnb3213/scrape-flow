import { Environment, ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmkTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/Fillinput';
import { ClickElementTask } from '../task/ClickElementTask';
import { WaitForElementTask } from '../task/WaitForElement';

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  console.log('Fill Input');
  try {
    const selector = environment.getInput('Selector');
    if (!selector) {
      environment.log.error('input->Selector is not defined');
    }

    const visibility = environment.getInput('Visibility');
    if (!visibility) {
      environment.log.error('input->visibility is not defined');
    }

    await environment.getPage()!.waitForSelector(selector,{
       visible: visibility === 'visible',
       hidden: visibility === 'hidden'
    });
    environment.log.info(`Element ${selector} became: ${visibility}`);
    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
