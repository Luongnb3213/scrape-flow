import { TaskType } from '@/types/task';
import { ExtractTextFromElement } from './ExtractTextFromElement';
import { LaunchBrowserTask } from './LaunchBrowser';
import { PageToHtmkTask } from './PageToHtml';
import { WorkflowTask } from '@/types/worklflow';
import { FillInputTask } from './Fillinput';
import { ClickElementTask } from './ClickElementTask';
import { WaitForElementTask } from './WaitForElement';
import { DeliverViaWebhookTask } from './DeliverViaWebhookTask';
import { ExtractDataWithAITask } from './ExtractDataWithAITask';
import { ReadProperTyFromJsonTask } from './ReadProperTyFromJsonTask';
import { AddPropertyToJsonTask } from './AddPropertyToJsonTask';
import { NavigateUrlTask } from './NavigateUrlTask';
import { ScrollToElementTask } from './ScrollToElementTask';

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmkTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI : ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadProperTyFromJsonTask,
  ADD_PROPERTY_TO_JSON :AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask
};
