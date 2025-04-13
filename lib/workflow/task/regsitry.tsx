import { TaskType } from "@/types/task";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmkTask } from "./PageToHtml";
import { WorkflowTask } from "@/types/worklflow";


type Registry = {
        [K in TaskType]: WorkflowTask & { type: K};
}

export const TaskRegistry : Registry = {
       LAUNCH_BROWSER: LaunchBrowserTask,
       PAGE_TO_HTML: PageToHtmkTask,
       EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement
}