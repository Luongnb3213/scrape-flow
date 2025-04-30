import { Environment, ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmkTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/Fillinput';
import { ClickElementTask } from '../task/ClickElementTask';
import { ReadProperTyFromJsonTask } from '../task/ReadProperTyFromJsonTask';

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadProperTyFromJsonTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInput('JSON');
    if (!jsonData) {
      environment.log.error('input->JSON is not defined');
    }

    const propertyName = environment.getInput('Property name');
    if (!propertyName) {
      environment.log.error('input->propertyName is not defined');
    }

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyName];
    if (propertyValue === undefined) {
      environment.log.error('Property not found');
      return false;
    }

    environment.setOutput('Property value', propertyValue);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
