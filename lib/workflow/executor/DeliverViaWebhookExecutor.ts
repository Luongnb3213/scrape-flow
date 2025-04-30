import { Environment, ExecutionEnvironment } from '@/types/executor';
import { DeliverViaWebhookTask } from '../task/DeliverViaWebhookTask';

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  console.log('Fill Input');
  try {
    const targetUrl = environment.getInput('Target URL');
    if (!targetUrl) {
      environment.log.error('input->targetUrl is not defined');
    }

    const body = environment.getInput('Body');
    if (!body) {
      environment.log.error('input->body is not defined');
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers:{
         "Content-type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const statusCode = response.status;
    if(statusCode !== 200) {
      environment.log.error(`Webhook delivery failed with status code: ${statusCode}`);
      return false;
    }


   const responseBody = await response.json();
   environment.log.info(JSON.stringify(responseBody))

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
