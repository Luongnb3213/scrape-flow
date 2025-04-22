import { Environment, ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmkTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/Fillinput';
import { ClickElementTask } from '../task/ClickElementTask';
import { ScrollToElementTask } from '../task/ScrollToElementTask';
import { waitFor } from '@/lib/helper/waitFor';

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector');
    if (!selector) {
      environment.log.error('input->Selector is not defined');
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top : y, behavior: 'smooth' });
      } else {
        throw new Error(`Element with selector "${selector}" not found`);
      }
    }, selector);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
