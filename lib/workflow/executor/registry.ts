import { TaskType } from '@/types/task';
import { LaunchBrowserExecutor } from './LaunchBrowserExecutor';
import { PageToHrmlExecutor } from './PageToHrmlExecutor';
import { ExecutionEnvironment } from '@/types/executor';
import { WorkflowTask } from '@/types/worklflow';
import { ExtractTextFromElementExcutor } from './ExtractTextFromElementExcutor';
import { FillInputExecutor } from './FillInputExecutor';
import { ClickElementExecutor } from './ClickElementExecutor';
import {WaitForElementTask } from '../task/WaitForElement';
import { WaitForElementExecutor } from './WaitForElementExecutor';
import { DeliverViaWebhookExecutor } from './DeliverViaWebhookExecutor';

type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};
export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHrmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExcutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor
};
