import { Environment, ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmkTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/Fillinput';
import { ClickElementTask } from '../task/ClickElementTask';
import { ReadProperTyFromJsonTask } from '../task/ReadProperTyFromJsonTask';
import { AddPropertyToJsonTask } from '../task/AddPropertyToJsonTask';

export async function AddPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
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


    const propertyValue = environment.getInput('Property value');
    if (!propertyValue) {
      environment.log.error('input->propertyValue is not defined');
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    environment.setOutput('Update JSON', JSON.stringify(json));


    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
