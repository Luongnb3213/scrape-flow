import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/worklflow';
import {EyeIcon, LucideProps } from 'lucide-react';

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: 'Wait for element',
  icon: (props: LucideProps) => {
    return <EyeIcon className="stroke-amber-400" {...props} />;
  },
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: 'Selector',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'Visibility',
      type: TaskParamType.SELECT,
      required: true,
      hideHandle: true,
      options:[
         {
           label: "Visible",
           value: "visible"
         },
         {
          label: "Hidden",
          value: "hidden"
        }
      ]
    },
  ] as const,
  outputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
