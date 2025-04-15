import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/worklflow';
import { CodeIcon, GlobeIcon, LucideProps } from 'lucide-react';

export const PageToHtmkTask = {
  type: TaskType.PAGE_TO_HTML,
  label: 'Get HTML from page',
  icon: (props: LucideProps) => {
    return <CodeIcon className="stroke-rose-400-400" {...props} />;
  },
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true, // this is required a input from annother node ( output of another node)
      hideHandle: false,
      helperText: '',
    },
  ],
  outputs: [
    { name: 'Html', type: TaskParamType.STRING },
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
  credits: 1,
} satisfies WorkflowTask;
